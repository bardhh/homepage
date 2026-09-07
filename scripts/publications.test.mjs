import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
// Exercise the same pure helpers as the UI, without adding a browser test dependency.
const source = readFileSync(new URL('../src/lib/publication-utils.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { getPublicationType, publicationLinks, readPublicationState, writePublicationState } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
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
