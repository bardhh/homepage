import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
// Exercise the same pure helpers as the UI, without adding a browser test dependency.
const source = readFileSync(new URL('../src/lib/publication-utils.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { getPublicationType, publicationLinks, readPublicationState, writePublicationState, publicationAuthors, publicationRecord, publicationJsonLd, publicationsMarkdown, serializeJsonLd } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const entry = (entryType, entryTags) => ({ entryType, entryTags, citationKey: 'test' });
test('preprint venues are not promoted to conferences', () => {
  for (const type of ['article','inproceedings','misc']) assert.equal(getPublicationType(entry(type,{booktitle:'arXiv preprint, 2026'})), 'preprint');
  assert.equal(getPublicationType(entry('misc',{url:'https://arxiv.org/abs/1234.56789'})), 'preprint');
});
test('accepted papers keep their venue classification even when hosted on arXiv', () => {
  assert.equal(getPublicationType(entry('inproceedings',{booktitle:'IROS 2026',url:'https://arxiv.org/abs/1234.56789'})), 'conference');
  assert.equal(getPublicationType(entry('article',{journal:'Nonlinear Analysis: Hybrid Systems'})), 'journal');
  assert.equal(getPublicationType(entry('inproceedings',{booktitle:'NeurIPS Workshop'})), 'workshop');
});
test('paper pages and PDFs have distinct destinations', () => {
  assert.deepEqual(publicationLinks(entry('article',{url:'https://arxiv.org/abs/2404.07158v2'})), {paper:'https://arxiv.org/abs/2404.07158v2',pdf:'https://arxiv.org/pdf/2404.07158v2'});
  assert.deepEqual(publicationLinks(entry('article',{url:'https://arxiv.org/pdf/2404.07158.pdf'})), {paper:'https://arxiv.org/abs/2404.07158',pdf:'https://arxiv.org/pdf/2404.07158'});
  assert.deepEqual(publicationLinks(entry('article',{url:'papers/example.pdf'})), {paper:undefined,pdf:'papers/example.pdf'});
  assert.deepEqual(publicationLinks(entry('article',{url:'https://doi.org/example'})), {paper:'https://doi.org/example',pdf:undefined});
});
test('shareable state round-trips Unicode queries, themes and pagination', () => {
  const state={type:'preprint',themes:['learning','risk'],search:'Hoxha & Schön',count:30};
  const query=writePublicationState('?utm_source=profile',state);
  assert.deepEqual(readPublicationState(query),state);
  assert.equal(new URLSearchParams(query).get('utm_source'),'profile');
});
test('invalid URL state falls back safely and clear removes only owned parameters', () => {
  assert.deepEqual(readPublicationState('?type=bogus&themes=risk,risk,bogus&count=Infinity'),{type:'all',themes:['risk'],search:'',count:15});
  assert.equal(readPublicationState('?count=-20').count,15);
  assert.equal(writePublicationState('?type=journal&q=old&count=30&utm_source=x',{type:'all',themes:[],search:'',count:15}), 'utm_source=x');
});

test('author identities handle both BibTeX name orders and existing legacy lists', () => {
  assert.deepEqual(publicationAuthors('Hoxha, Bardh and Oliver Schön'), ['Bardh Hoxha', 'Oliver Schön']);
  assert.deepEqual(publicationAuthors('Avishree Khare, Hideki Okamoto, Bardh Hoxha'), ['Avishree Khare', 'Hideki Okamoto', 'Bardh Hoxha']);
  assert.deepEqual(publicationAuthors('Hoxha, Bardh'), ['Bardh Hoxha']);
  assert.deepEqual(publicationAuthors('Smith, Jr, John and Bardh Hoxha'), ['John Smith, Jr', 'Bardh Hoxha']);
});

test('exports resolve local assets at the site root and keep paper status consistent', () => {
  const pub = entry('inproceedings', { title: 'A paper', author: 'Hoxha, Bardh', booktitle: 'ACC 2026', year: '2026', url: 'papers/example.pdf', code: 'https://example.com/code' });
  const record = publicationRecord(pub);
  assert.equal(record.links.pdf, 'https://www.bhoxha.com/papers/example.pdf');
  assert.equal(record.links.paper, undefined);
  assert.equal(record.url, 'https://www.bhoxha.com/publications/test/');
  assert.equal(record.type, 'conference');
  assert.equal(publicationJsonLd(pub).creativeWorkStatus, undefined);
  assert.equal(publicationJsonLd(pub).author[0]['@id'], 'https://www.bhoxha.com/#person');
  assert.throws(() => publicationRecord(entry('misc', { url: 'javascript:alert(1)' })), /Unsupported publication URL/);
});

test('optional abstracts flow from BibTeX into both exports and structured data', () => {
  const pub = entry('misc', { title: 'A paper', author: 'Bardh Hoxha', booktitle: 'arXiv preprint', abstract: 'An abstract with Schön & examples.', year: '2026' });
  assert.equal(publicationRecord(pub).abstract, pub.entryTags.abstract);
  assert.equal(publicationJsonLd(pub).description, pub.entryTags.abstract);
  assert.equal(publicationJsonLd(pub).creativeWorkStatus, 'Preprint');
  assert.ok(publicationsMarkdown([pub]).includes(pub.entryTags.abstract));
  assert.equal(publicationJsonLd(entry('misc', {})).datePublished, undefined);
});

test('JSON-LD safely embeds bibliography text without closing its script tag', () => {
  const data = publicationJsonLd(entry('misc', { title: '</script><script>alert(1)</script>' }));
  const serialized = serializeJsonLd(data);
  assert.ok(!serialized.includes('<'));
  assert.deepEqual(JSON.parse(serialized), JSON.parse(JSON.stringify(data)));
});
