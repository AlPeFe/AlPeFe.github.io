#!/usr/bin/env node
// Refresca lo que depende SOLO de la API pública de GitHub (puede correr en la
// nube — una Action diaria— porque no toca nada de esta máquina):
//
//   1. El grafo de contribuciones de la portada (entre contribs:start/end),
//      con la misma geometría y los mismos colores que el perfil de GitHub:
//      celdas de 10 px, separación de 3 px, radio 2 px y su paleta oscura.
//      Fuente: https://github.com/users/<OWNER>/contributions (público).
//   2. Las celdas [data-repo] de /proyectos con el mes del último envío.
//
// Sin dependencias: fetch nativo de Node 18+.
// Con GH_TOKEN ve también los repositorios privados en el paso 2; sin él,
// sólo los públicos y los privados conservan la fecha que ya tenían.

import { readFile, writeFile } from 'node:fs/promises';

const OWNER = 'AlPeFe';
const TOKEN = process.env.GH_TOKEN || '';
const LANDING = 'index.html';
const PROJECTS = 'projects/index.html';

// Catálogo curado de repositorios cuya fecha se publica en /proyectos.
const CATALOG = [
  'gam-mcp', 'tsnu-plataforma', 'HanniGram', 'xiaomi-tv-debloat',
  'fuji-ptp-android', 'kivotos', 'gesipan', 'SqlServerMcp', 'music-grabber',
  'WindowsServerAgent', 'tui-server-setup', 'Nagomi', 'GamFleet',
  'charla-ia-equipo', 'Rac0', 'PolaperPOS',
];

// Los cinco verdes del tema oscuro de GitHub, tal cual.
const LEVELS = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const CELL = 10, GAP = 3, STEP = CELL + GAP, X0 = 24, Y0 = 14;

const stamp = (iso) => (iso || '').slice(0, 7); // 2026-10-18T... -> 2026-10
const esDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};
const esNum = (n) => n.toLocaleString('es-ES');

async function readText(file) {
  try { return await readFile(file, 'utf8'); } catch { return ''; }
}

function replaceBlock(html, start, end, body) {
  const re = new RegExp(`(${start})[\\s\\S]*?(${end})`);
  if (!re.test(html)) return null;
  return html.replace(re, `$1\n${body}\n$2`);
}

// ————— paso 1: el grafo de contribuciones —————

async function fetchContributionDays() {
  const res = await fetch(`https://github.com/users/${OWNER}/contributions`, {
    headers: { 'user-agent': 'alpefe-site-contribs', accept: 'text/html' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  // celdas: <td … data-date id="contribution-day-component-{fila}-{columna}" data-level …>
  const cells = [];
  for (const m of html.matchAll(/<td\b[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g)) {
    const tag = m[0];
    const date = /data-date="(\d{4}-\d{2}-\d{2})"/.exec(tag)?.[1];
    const rc = /id="contribution-day-component-(\d+)-(\d+)"/.exec(tag);
    const level = /data-level="(\d)"/.exec(tag)?.[1];
    if (!date || !rc || level === undefined) continue;
    cells.push({ date, row: Number(rc[1]), col: Number(rc[2]), level: Number(level), count: 0 });
  }
  if (!cells.length) throw new Error('no se encontraron celdas de contribución');

  // conteos: <tool-tip for="contribution-day-component-f-c">N contributions on …</tool-tip>
  const byId = new Map(cells.map((c) => [`${c.row}-${c.col}`, c]));
  for (const m of html.matchAll(/<tool-tip\b[^>]*for="contribution-day-component-(\d+-\d+)"[^>]*>([\s\S]*?)<\/tool-tip>/g)) {
    const cell = byId.get(m[1]);
    if (!cell) continue;
    const n = /([\d,]+)\s+contributions?/i.exec(m[2]);
    cell.count = n ? Number(n[1].replace(/,/g, '')) : 0;
  }
  return cells;
}

function contributionSvg(cells) {
  const today = new Date().toISOString().slice(0, 10);
  const maxCol = Math.max(...cells.map((c) => c.col));
  const w = X0 + (maxCol + 1) * STEP - GAP;
  const h = Y0 + 7 * STEP - GAP;
  const out = [];

  // etiquetas de mes: cambia el mes del primer día de cada columna,
  // como en el grafo del perfil (así el mes inicial también aparece)
  let lastMonth = -1;
  for (let col = 0; col <= maxCol; col++) {
    const first = cells.filter((c) => c.col === col).sort((a, b) => a.row - b.row)[0];
    if (!first) continue;
    const month = Number(first.date.slice(5, 7));
    if (month === lastMonth) continue;
    lastMonth = month;
    out.push(`<text class="m" x="${X0 + col * STEP}" y="10">${MONTHS[month - 1]}</text>`);
  }
  // etiquetas de día: lun / mié / vie, como en el perfil
  [['lun', 1], ['mié', 3], ['vie', 5]].forEach(([label, row]) => {
    out.push(`<text class="d" x="0" y="${Y0 + row * STEP + 9}">${label}</text>`);
  });

  let total = 0;
  for (const c of cells) {
    const future = c.date > today;
    const x = X0 + c.col * STEP, y = Y0 + c.row * STEP;
    const fill = LEVELS[future ? 0 : c.level];
    if (!future) total += c.count;
    const what = c.count === 1 ? '1 contribución' : `${esNum(c.count)} contribuciones`;
    const title = future ? '' : `<title>${esDate(c.date)}: ${what}</title>`;
    out.push(`<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2" fill="${fill}">${title}</rect>`);
  }

  const legend = LEVELS.map((c) => `<i style="background:${c}"></i>`).join('');
  return {
    total,
    block: `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esNum(total)} contribuciones en GitHub en el último año">\n${out.join('\n')}\n</svg>
<p class="total"><b>${esNum(total)}</b> contribuciones en el último año<span class="legend">menos ${legend} más</span></p>`,
  };
}

// ————— paso 2: fechas de último cambio en /proyectos —————

function existingDates(html) {
  const out = {};
  for (const m of html.matchAll(/data-repo="([^"]+)"[^>]*>([^<]*)</g)) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

async function pushedAt(repo) {
  const url = `https://api.github.com/repos/${OWNER}/${repo}`;
  const headers = { accept: 'application/vnd.github+json', 'user-agent': 'alpefe-site-log' };
  if (TOKEN) headers.authorization = `Bearer ${TOKEN}`;
  const res = await fetch(url, { headers });
  if (!res.ok) return { ok: false, status: res.status };
  const data = await res.json();
  return { ok: true, iso: data.pushed_at || '' };
}

const projectsHtml = await readText(PROJECTS);
const landingHtml = await readText(LANDING);
let touched = 0;

// grafo de la portada
try {
  const cells = await fetchContributionDays();
  const { total, block } = contributionSvg(cells);
  const next = replaceBlock(landingHtml, '<!-- contribs:start -->', '<!-- contribs:end -->', block);
  if (next && next !== landingHtml) { await writeFile(LANDING, next); touched++; }
  else if (!next) console.warn('no encuentro los marcadores contribs:start / contribs:end');
  console.log(`OK contribuciones: ${cells.length} días, ${total} en el último año.`);
} catch (e) {
  console.warn(`contribuciones: se conserva lo publicado (${e.message})`);
}

// fechas en /proyectos
const known = existingDates(projectsHtml);
let nextProjects = projectsHtml;
for (const repo of CATALOG) {
  const res = await pushedAt(repo);
  const date = stamp(res.ok ? res.iso : '') || known[repo];
  if (!date) { console.warn(`sin fecha para ${repo}; se omite`); continue; }
  if (!res.ok) console.log(`${repo}: se conserva ${date} (HTTP ${res.status})`);
  const re = new RegExp(`(data-repo="${repo}"[^>]*>)[^<]*(<)`);
  nextProjects = nextProjects.replace(re, `$1${date}$2`);
}
if (nextProjects && nextProjects !== projectsHtml) { await writeFile(PROJECTS, nextProjects); touched++; }

console.log(`OK: ${touched} archivo(s) actualizado(s).`);
