#!/usr/bin/env node
// Contadores de la sección «tokens» de la portada. Fuentes, en orden de
// preferencia por proveedor:
//
//   opencode-go — registros locales de HanniPI (~/.pi/agent/sessions/*.jsonl):
//                 opencode-go no expone API pública de uso (comprobado 2026-10).
//   hermes      — PORTAL DE NOUS como valor real si hay NOUS_TOKEN en el
//                 entorno (lo que factura la cuenta); si no, registros locales.
//   copilot     — API de GitHub «premium request usage» si hay GH_PAT en el
//                 entorno (PAT con permiso Plan de lectura). Unidad: requests,
//                 no tokens — GitHub no publica tokens de Copilot.
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
const NOUS_TOKEN = process.env.NOUS_TOKEN || '';
const GH_PAT = process.env.GH_PAT || '';
const GH_USER = 'AlPeFe';

const compact = (n) =>
  n >= 1e9 ? `${(n / 1e9).toFixed(1)}B` : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` :
  n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : String(n);

// ————— registros locales de HanniPI: opencode-go y nous (respaldo de hermes) —————

const LOCAL_PROVIDERS = new Map([
  ['opencode-go', 'opencode-go'],
  ['nous', 'hermes'],
]);

async function* sessionFiles(dir) {
  let entries = [];
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* sessionFiles(p);
    else if (e.name.endsWith('.jsonl')) yield p;
  }
}

async function aggregateLocal() {
  const agg = new Map([...LOCAL_PROVIDERS.values()].map((p) => [p, { total: 0, day: 0 }]));
  const now = Date.now();
  for await (const file of sessionFiles(SESSIONS)) {
    let current = null; // proveedor del último model_change del fichero
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
      if (!u || !provider || !LOCAL_PROVIDERS.has(provider)) continue;
      const tokens = u.totalTokens ??
        (u.input || 0) + (u.output || 0) + (u.cacheRead || 0) + (u.cacheWrite || 0);
      const slot = agg.get(LOCAL_PROVIDERS.get(provider));
      slot.total += tokens;
      const when = Date.parse(d.timestamp || '');
      if (when && now - when <= DAY) slot.day += tokens;
    }
  }
  return agg;
}

// ————— hermes: total real del portal de Nous —————
// El portal está tras el checkpoint de Vercel y no documenta la ruta; se
// prueban las candidatas con la key y gana la primera que responda 200.
async function fetchNousPortalTotal() {
  if (!NOUS_TOKEN) return null;
  const candidates = [
    'https://portal.nousresearch.com/api/v1/usage',
    'https://portal.nousresearch.com/api/usage',
    'https://inference-api.nousresearch.com/v1/usage',
  ];
  const findTokens = (o) => {
    if (!o || typeof o !== 'object') return null;
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === 'number' && /total.*token|token.*total/i.test(k)) return v;
    }
    for (const v of Object.values(o)) {
      const found = findTokens(v);
      if (found !== null) return found;
    }
    return null;
  };
  for (const url of candidates) {
    try {
      const res = await fetch(url, { headers: { authorization: `Bearer ${NOUS_TOKEN}` } });
      if (!res.ok) continue;
      const total = findTokens(await res.json());
      if (total !== null) { console.log(`nous portal: ${url} -> ${total.toLocaleString('es-ES')}`); return total; }
    } catch { /* siguiente candidata */ }
  }
  console.warn('nous portal: ninguna ruta candidata respondió con datos; se usa el registro local');
  return null;
}

// ————— copilot: premium requests según GitHub —————
// GET /users/{user}/settings/billing/premium_request/usage (PAT con Plan:read).
// unitType "requests": GitHub no publica tokens de Copilot, publica requests.
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
  if (!GH_PAT) return null;
  try {
    const total = await fetchCopilotUsage();
    let day = null;
    const now = new Date();
    try {
      day = await fetchCopilotUsage(
        `?year=${now.getUTCFullYear()}&month=${now.getUTCMonth() + 1}&day=${now.getUTCDate()}`,
      );
    } catch { /* sin desglose diario: se muestra sólo el total */ }
    return { total, day };
  } catch (e) {
    console.warn(`copilot: ${e.message}; fila omitida`);
    return null;
  }
}

// ————— bloque de la portada —————

const html = await readFile(LANDING, 'utf8').catch(() => '');
if (!html) { console.error(`no puedo leer ${LANDING}`); process.exit(1); }

const agg = await aggregateLocal();
const nousPortal = await fetchNousPortalTotal();
if (nousPortal !== null) agg.get('hermes').total = nousPortal; // el portal manda

const rows = [];
for (const [name, { total, day }] of agg) {
  rows.push(`<li><span class="p">${name}</span><span class="n">${compact(total)}</span><span class="d">+${compact(day)} / 24 h</span></li>`);
}
const copilot = await copilotRow();
if (copilot) {
  const day = copilot.day === null ? '—' : `+${compact(copilot.day)} / 24 h`;
  rows.push(`<li><span class="p">copilot</span><span class="n">${compact(copilot.total)} req</span><span class="d">${day}</span></li>`);
}

const next = html.replace(
  /(<!-- tokens:start -->)[\s\S]*?(<!-- tokens:end -->)/,
  `$1\n${rows.join('\n')}\n$2`,
);
if (next === html) console.log('sin marcadores tokens:start / tokens:end o sin cambios');
else await writeFile(LANDING, next);

for (const [name, { total, day }] of agg) {
  console.log(`${name.padEnd(12)} total=${total.toLocaleString('es-ES')}  24h=${day.toLocaleString('es-ES')}`);
}
if (copilot) console.log(`copilot      total=${copilot.total.toLocaleString('es-ES')} req  24h=${copilot.day ?? '—'}`);

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
