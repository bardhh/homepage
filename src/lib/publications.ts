import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import { parseBibtex } from './bibtex';

// Every publication view and export reads this file. Missing/invalid data must fail
// the build rather than silently publishing an empty or incomplete bibliography.
export const getPublications = cache(async () => {
  const content = await readFile(path.join(process.cwd(), 'public/publications.bib'), 'utf8');
  const publications = parseBibtex(content);
  if (!publications.length) throw new Error('publications.bib contains no publications');
  const keys = new Set<string>();
  for (const publication of publications) {
    const key = publication.citationKey;
    if (!key || !/^[A-Za-z0-9_-]+$/.test(key) || keys.has(key.toLowerCase())) {
      throw new Error(`Missing, duplicate, or URL-unsafe citation key: ${key}`);
    }
    if (!publication.entryTags.title || !publication.entryTags.author) {
      throw new Error(`Publication ${key} needs a title and author`);
    }
    keys.add(key.toLowerCase());
  }
  return publications.sort((a, b) => Number(b.entryTags.year || 0) - Number(a.entryTags.year || 0));
});
