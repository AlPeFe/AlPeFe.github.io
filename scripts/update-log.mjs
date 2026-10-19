#!/usr/bin/env node
// Refresca las fechas de "último cambio" desde la API de GitHub.
//
// Qué hace:
//   1. Lee las fechas que ya hay en el HTML (sirven de respaldo si la API falla).
//   2. Pregunta a GitHub por el último envío de cada repositorio del catálogo.
//   3. Reescribe el bloque del registro de la portada (entre los marcadores
//      log:start / log:end) y las celdas [data-repo] de proyectos.
//
// Sin dependencias: usa el fetch nativo de Node 18+.
// Con GH_TOKEN ve también los repositorios privados; sin él, sólo los públicos
// y los privados conservan la fecha que ya tenían.

import { readFile, writeFile } from 'node:fs/promises';

const OWNER = 'AlPeFe';
const TOKEN = process.env.GH_TOKEN || '';
const LANDING = 'index.html';
const PROJECTS = 'projects/index.html';
const LOG_SIZE = 6;

// Catálogo curado: qué repos cuentan, cómo se llaman y la línea que se publica.
// La prosa larga vive en projects/index.html; aquí sólo el resumen del registro.
const CATALOG = [
  { repo: 'gam-mcp',            note: 'consulta, estadísticas y operación sobre los servidores, con memoria', closed: true  },
  { repo: 'tsnu-plataforma',    note: 'flota y personal de transporte sanitario',                             closed: true  },
  { repo: 'HanniGram',          note: 'memoria persistente para agentes de código',                           closed: false },
  { repo: 'xiaomi-tv-debloat',  note: '602 MB de RAM liberados en una Mi TV, sin root',                       closed: false },
  { repo: 'fuji-ptp-android',   note: 'las recetas de una Fujifilm X100VI, desde el móvil',                   closed: false },
  { repo: 'kivotos',            note: 'biblioteca de ROMs y descargas en la red de casa',                     closed: false },
  { repo: 'gesipan',            note: 'pizarra infinita de notas y marcadores',                               closed: false },
  { repo: 'SqlServerMcp',       note: 'el esquema y las reglas de negocio de una base de datos, como contexto', closed: false },
  { repo: 'music-grabber',      note: 'descargas de audio autoalojadas, desde el navegador',                   closed: false },
  { repo: 'WindowsServerAgent', note: 'administrar servidores Windows en remoto',                             closed: false },
  { repo: 'tui-server-setup',   note: 'dejar listo un servidor Windows desde la terminal',                     closed: false },
  { repo: 'Nagomi',             note: 'coordinación de transporte sanitario para sitios pequeños',             closed: true  },
  { repo: 'GamFleet',           note: 'gestión de flota, reescrita sobre la plataforma nueva',                 closed: true  },
  { repo: 'charla-ia-equipo',   note: '148 diapositivas sobre IA en un solo HTML',                            closed: true  },
  { repo: 'Rac0',               note: 'los restaurantes que has visitado y los que quieres visitar',          closed: true  },
  { repo: 'PolaperPOS',         note: 'punto de venta para un solo evento',                                   closed: true  },
];

const stamp = (iso) => (iso || '').slice(0, 7); // 2026-10-18T... -> 2026-10

async function readJson(file) {
  try { return await readFile(file, 'utf8'); } catch { return ''; }
}

// fechas que ya están publicadas, para poder degradar sin romper nada
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

function logRows(entries) {
  return entries.map(({ repo, note, closed, date }) => {
    const cls = closed ? ' class="st closed"' : ' class="st"';
    const state = closed ? 'cerrado' : 'abierto';
    return `          <li><span class="d">${date}</span><span class="t">${repo}</span><span class="w">${note}</span><span${cls}>${state}</span></li>`;
  }).join('\n');
}

function replaceBlock(html, start, end, body) {
  const re = new RegExp(`(${start})[\\s\\S]*?(${end})`);
  if (!re.test(html)) return null;
  return html.replace(re, `$1\n${body}\n$2`);
}

const projectsHtml = await readJson(PROJECTS);
const landingHtml = await readJson(LANDING);
const known = { ...existingDates(projectsHtml), ...existingDates(landingHtml) };

const resolved = [];
for (const entry of CATALOG) {
  const { repo } = entry;
  const res = await pushedAt(repo);
  const iso = res.ok ? res.iso : '';
  const date = stamp(iso) || known[repo];
  if (!date) {
    console.warn(`sin fecha para ${repo} (${res.ok ? 'sin respuesta' : 'HTTP ' + res.status}); se omite`);
    continue;
  }
  if (!res.ok) console.log(`${repo}: se conserva ${date} (HTTP ${res.status})`);
  resolved.push({ ...entry, date, iso: iso || date });
}

// 1. registro de la portada: los LOG_SIZE más recientes
// Orden por mes descendente. `sort` es estable, así que dentro del mismo mes
// manda el orden curado del catálogo: sin token no podemos conocer la marca de
// tiempo exacta de los repositorios privados, y fingirla sería peor.
const recent = [...resolved]
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  .slice(0, LOG_SIZE);
let nextLanding = landingHtml;
if (landingHtml) {
  const out = replaceBlock(landingHtml, '<!-- log:start -->', '<!-- log:end -->', logRows(recent));
  if (out) nextLanding = out; else console.warn('no encuentro los marcadores log:start / log:end');
}

// 2. celdas de último cambio en proyectos
let nextProjects = projectsHtml;
if (projectsHtml) {
  for (const { repo, date } of resolved) {
    const re = new RegExp(`(data-repo="${repo}"[^>]*>)[^<]*(<)`);
    nextProjects = nextProjects.replace(re, `$1${date}$2`);
  }
}

let touched = 0;
if (nextLanding && nextLanding !== landingHtml) { await writeFile(LANDING, nextLanding); touched++; }
if (nextProjects && nextProjects !== projectsHtml) { await writeFile(PROJECTS, nextProjects); touched++; }

console.log(`OK: ${resolved.length} repositorios, ${touched} archivo(s) actualizado(s).`);
recent.forEach((r) => console.log(`  ${r.date}  ${r.repo}`));
