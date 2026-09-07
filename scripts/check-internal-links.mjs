import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import bibtex from 'bibtex-parse-js';

const root = path.resolve('out');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
}
const files = await walk(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));
const failures = new Set();
let checked = 0;
const decode = text => text.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
async function check(raw, source) {
  if (!raw || /^(?:mailto:|tel:|data:|javascript:)/i.test(raw)) return;
  let url;
  try { url = new URL(decode(raw), `https://www.bhoxha.com/${path.relative(root, source).replace(/index\.html$/, '')}`); }
  catch { failures.add(`${path.relative(root, source)}: invalid URL ${raw}`); return; }
  if (!['www.bhoxha.com', 'bhoxha.com'].includes(url.hostname)) return;
  checked++;
  const local = path.join(root, decodeURIComponent(url.pathname));
  let target;
  for (const candidate of [local, `${local}.html`, path.join(local, 'index.html')]) {
    try { if ((await stat(candidate)).isFile()) { target = candidate; break; } } catch {}
  }
  if (!target) { failures.add(`${path.relative(root, source)} → ${url.pathname} (missing file)`); return; }
  if (url.hash && target.endsWith('.html')) {
    const html = await readFile(target, 'utf8');
    const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => decode(match[1]));
    if (!ids.includes(decodeURIComponent(url.hash.slice(1)))) failures.add(`${path.relative(root, source)} → ${url.pathname}${url.hash} (missing anchor)`);
  }
}
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) await check(match[1], file);
}
// Include papers hidden behind client-side pagination.
const bibliography = bibtex.toJSON(await readFile('public/publications.bib', 'utf8'));
for (const pub of bibliography) for (const key of ['url', 'pdf', 'code', 'video']) if (pub.entryTags[key]) await check(pub.entryTags[key], path.join(root, 'index.html'));
if (failures.size) { console.error([...failures].join('\n')); process.exitCode = 1; }
else console.log(`Checked ${checked} internal references across ${htmlFiles.length} HTML pages and ${bibliography.length} bibliography entries.`);
