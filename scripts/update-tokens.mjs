#!/usr/bin/env node
// Contadores de la sección «tokens» de la portada. Reparto de filas (cada
// fila vive entre sus propios marcadores tok:* y NADIE escribe fuera de los
// suyos — así varios cron pueden convivir sin pisarse):
//
//   tok:oc-go   — ESTE script. Suma los tokens del proveedor opencode-go de
//                 los registros locales de HanniPI (~/.pi/agent/sessions):
//                 opencode-go no expone API pública de uso (comprobado 2026-10).
//   tok:hermes  — NO lo toca este script: lo gobierna un cron del dueño que
//                 escribe el total real del portal de Nous.
//   tok:copilot — «undefined undefined» fijo. Si algún día existe GH_PAT en
//                 el entorno (PAT con Plan:read), este script lo sustituye
//                 por las premium requests de la API de GitHub. GitHub no
//                 publica tokens de Copilot, sólo requests.
//
// Uso:
//   node scripts/update-tokens.mjs           sólo actualiza index.html
//   node scripts/update-tokens.mjs --push    además pull --rebase, commit y push
//
// Lo corre la tarea programada LOCAL 'alpefe-tokens' (los registros y las
// credenciales viven en esta máquina; una Action en la nube no los ve).

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DAY = 86_400_000;
const PUSH = process.argv.includes('--push');
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LANDING = path.join(REPO, 'index.html');
const SESSIONS = path.join(os.homedir(), '.pi', 'agent', 'sessions');
const GH_PAT = process.env.GH_PAT || '';
const GH_USER = 'AlPeFe';

const compact = (n) =>
  n >= 1e9 ? `${(n / 1e9).toFixed(1)}B` : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` :
  n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : String(n);

const replaceRow = (html, key, row) =>
  html.replace(
    new RegExp(`(<!-- tok:${key}:start -->)[\\s\\S]*?(<!-- tok:${key}:end -->)`),
    `$1${row}$2`,
  );

// ————— opencode-go: registros locales de HanniPI —————

async function* sessionFiles(dir) {
  let entries = [];
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* sessionFiles(p);
    else if (e.name.endsWith('.jsonl')) yield p;
  }
}

async function aggregateOpencodeGo() {
  const agg = { total: 0, day: 0 };
  const now = Date.now();
  for await (const file of sessionFiles(SESSIONS)) {
    let isOcGo = false; // proveedor del último model_change del fichero
    let text;
    try { text = await readFile(file, 'utf8'); } catch { continue; }
    for (const line of text.split('\n')) {
      if (!line.includes('"usage"') && !line.includes('"model_change"')) continue;
      let d;
      try { d = JSON.parse(line); } catch { continue; }
      if (d.type === 'model_change') {
        isOcGo = d.provider === 'opencode-go';
        continue;
      }
      if (d.type !== 'message' || d.message?.role !== 'assistant') continue;
      const u = d.message.usage;
      const provider = d.message.provider || (isOcGo ? 'opencode-go' : null);
      if (!u || provider !== 'opencode-go') continue;
      const tokens = u.totalTokens ??
        (u.input || 0) + (u.output || 0) + (u.cacheRead || 0) + (u.cacheWrite || 0);
      agg.total += tokens;
      const when = Date.parse(d.timestamp || '');
      if (when && now - when <= DAY) agg.day += tokens;
    }
  }
  return agg;
}

// ————— copilot: sólo si hay GH_PAT (PAT con Plan:read) —————

async function fetchCopilotUsage(params = '') {
  const url = `https://api.github.com/users/${GH_USER}/settings/billing/premium_request/usage${params}`;
  const res = await fetch(url, {
    headers: {
      authorization: `Bearer ${GH_PAT}`,
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'user-agent': 'alpefe-site-tokens',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const items = data.usageItems || data.usage_items || [];
  return items.reduce((sum, it) => sum + (it.grossQuantity ?? it.gross_quantity ?? 0), 0);
}

async function copilotRow() {
  if (!GH_PAT) return null; // sin PAT: la fila «undefined undefined» se queda como está
  const total = await fetchCopilotUsage();
  let day = 'undefined';
  const now = new Date();
  try {
    day = `+${compact(await fetchCopilotUsage(
      `?year=${now.getUTCFullYear()}&month=${now.getUTCMonth() + 1}&day=${now.getUTCDate()}`,
    ))} / 24 h`;
  } catch { /* sin desglose diario */ }
  return `<li><span class="p">copilot</span><span class="n">${compact(total)} req</span><span class="d">${day}</span></li>`;
}

// ————— aplicar al HTML —————

const html = await readFile(LANDING, 'utf8').catch(() => '');
if (!html) { console.error(`no puedo leer ${LANDING}`); process.exit(1); }

let next = html;

const oc = await aggregateOpencodeGo();
next = replaceRow(
  next,
  'oc-go',
  `<li><span class="p">opencode-go</span><span class="n">${compact(oc.total)}</span><span class="d">+${compact(oc.day)} / 24 h</span></li>`,
);
console.log(`opencode-go  total=${oc.total.toLocaleString('es-ES')}  24h=${oc.day.toLocaleString('es-ES')}`);

try {
  const row = await copilotRow();
  if (row) {
    next = replaceRow(next, 'copilot', row);
    console.log('copilot      actualizado desde GitHub');
  }
} catch (e) {
  console.warn(`copilot: ${e.message}; se conserva la fila`);
}

if (next === html) console.log('sin cambios');
else await writeFile(LANDING, next);

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
