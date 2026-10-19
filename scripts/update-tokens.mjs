#!/usr/bin/env node
// Suma los tokens consumidos por proveedor leyendo las sesiones locales de
// HanniPI (~/.pi/agent/sessions/*.jsonl): cada mensaje de asistente guarda
// provider + usage.totalTokens. Ni opencode-go ni el portal de Nous exponen
// una API pública de uso (comprobado 2026-10), así que el registro local es
// la fuente fiable. Reescribe el bloque tokens:start/end de la portada.
//
// Uso:
//   node scripts/update-tokens.mjs           sólo actualiza index.html
//   node scripts/update-tokens.mjs --push    además hace pull --rebase, commit y push
//
// Pensado para una tarea programada LOCAL: los datos viven en esta máquina,
// una Action en la nube no puede verlos.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// proveedor en los registros -> nombre que se publica
const PROVIDERS = new Map([
  ['opencode-go', 'opencode-go'],
  ['nous', 'hermes'],
]);

const DAY = 86_400_000;
const PUSH = process.argv.includes('--push');
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LANDING = path.join(REPO, 'index.html');
const SESSIONS = path.join(os.homedir(), '.pi', 'agent', 'sessions');

const compact = (n) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : String(n);

async function* sessionFiles(dir) {
  let entries = [];
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* sessionFiles(p);
    else if (e.name.endsWith('.jsonl')) yield p;
  }
}

async function aggregate() {
  // clave: proveedor publicado -> { total, day }
  const agg = new Map([...PROVIDERS.values()].map((p) => [p, { total: 0, day: 0 }]));
  const now = Date.now();
  for await (const file of sessionFiles(SESSIONS)) {
    let current = null; // proveedor del último model_change visto en el fichero
    let text;
    try { text = await readFile(file, 'utf8'); } catch { continue; }
    for (const line of text.split('\n')) {
      if (!line.includes('"usage"') && !line.includes('"model_change"')) continue;
      let d;
      try { d = JSON.parse(line); } catch { continue; }
      if (d.type === 'model_change') {
        if (d.provider) current = d.provider;
        continue;
      }
      if (d.type !== 'message' || d.message?.role !== 'assistant') continue;
      const u = d.message.usage;
      const provider = d.message.provider || current;
      if (!u || !provider || !PROVIDERS.has(provider)) continue;
      const tokens = u.totalTokens ??
        (u.input || 0) + (u.output || 0) + (u.cacheRead || 0) + (u.cacheWrite || 0);
      const slot = agg.get(PROVIDERS.get(provider));
      slot.total += tokens;
      const when = Date.parse(d.timestamp || '');
      if (when && now - when <= DAY) slot.day += tokens;
    }
  }
  return agg;
}

function rows(agg) {
  const out = [];
  for (const [name, { total, day }] of agg) {
    out.push(`<li><span class="p">${name}</span><span class="n">${compact(total)}</span><span class="d">+${compact(day)} / 24 h</span></li>`);
  }
  return out.join('\n');
}

const html = await readFile(LANDING, 'utf8').catch(() => '');
if (!html) { console.error(`no puedo leer ${LANDING}`); process.exit(1); }

const agg = await aggregate();
const next = html.replace(
  /(<!-- tokens:start -->)[\s\S]*?(<!-- tokens:end -->)/,
  `$1\n${rows(agg)}\n$2`,
);
if (next === html) {
  console.log('sin marcadores tokens:start / tokens:end o sin cambios');
} else {
  await writeFile(LANDING, next);
}
for (const [name, { total, day }] of agg) {
  console.log(`${name.padEnd(12)} total=${total.toLocaleString('es-ES')}  24h=${day.toLocaleString('es-ES')}`);
}

if (PUSH && next !== html) {
  const git = (args) => execFileSync('git', args, { cwd: REPO, stdio: 'inherit' });
  git(['pull', '--rebase', '--autostash']);
  git(['add', 'index.html']);
  try {
    git(['diff', '--cached', '--quiet', '--', 'index.html']);
    console.log('nada que commitear tras el pull');
  } catch {
    git(['commit', '-m', 'chore: tokens al día']);
    git(['push']);
    console.log('cambios empujados');
  }
}
