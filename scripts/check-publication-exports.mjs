import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import bibtex from 'bibtex-parse-js';
import ts from 'typescript';

// Check the actual static output, not hydrated React data: a crawler must see
// every entry and its canonical URL without running scripts or clicking buttons.
const source = await readFile('src/lib/publication-utils.ts', 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { publicationRecord, publicationJsonLd, publicationsMarkdown } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const entries = bibtex.toJSON(await readFile('public/publications.bib', 'utf8'))
  .sort((a, b) => Number(b.entryTags.year || 0) - Number(a.entryTags.year || 0));
const records = JSON.parse(await readFile('out/publications.json', 'utf8'));
assert.deepEqual(records, JSON.parse(JSON.stringify(entries.map(publicationRecord))));
const markdown = await readFile('out/publications.md', 'utf8');
assert.equal(markdown, publicationsMarkdown(entries));
assert.equal((markdown.match(/^## /gm) || []).length, entries.length);

const withoutScripts = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
const escapeHtml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const archive = withoutScripts(await readFile('out/publications/index.html', 'utf8'));
const sitemap = await readFile('out/sitemap.xml', 'utf8');
assert.equal((archive.match(/<article>/g) || []).length, entries.length);
assert.ok(!archive.includes('class="page-enter'), 'Archive must not wait for hydration to become visible');
for (const entry of entries) {
  const record = publicationRecord(entry);
  const pathname = new URL(record.url).pathname;
  assert.ok(archive.includes(`href="${pathname}"`), `Archive missing ${entry.citationKey}`);
  assert.ok(sitemap.includes(`<loc>${record.url}</loc>`), `Sitemap missing ${entry.citationKey}`);
  const html = await readFile(`out${pathname}index.html`, 'utf8');
  const visible = withoutScripts(html);
  assert.ok(!visible.includes('class="page-enter'), `${entry.citationKey} waits for hydration`);
  assert.ok(visible.includes(escapeHtml(record.title)), `${entry.citationKey} missing title`);
  for (const author of record.authors) assert.ok(visible.includes(escapeHtml(author)), `${entry.citationKey} missing author ${author}`);
  assert.ok(visible.includes(`<link rel="canonical" href="${record.url}"`), `${entry.citationKey} wrong canonical`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  const article = schemas.find(schema => schema['@type'] === 'ScholarlyArticle');
  assert.deepEqual(article, JSON.parse(JSON.stringify(publicationJsonLd(entry))), `${entry.citationKey} inconsistent metadata`);
}
const home = withoutScripts(await readFile('out/index.html', 'utf8'));
assert.equal((home.match(/class="pub-card/g) || []).length, 15, 'Homepage should still initially show only 15 papers');
assert.ok(home.includes('href="/publications/"'), 'Homepage must link to archive');
console.log(`Verified ${entries.length} paper pages, complete HTML archive, JSON, Markdown, sitemap, and 15-card homepage against publications.bib.`);
