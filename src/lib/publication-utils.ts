import type { Publication } from './bibtex';

export function getPublicationType(entry: Publication): 'conference' | 'journal' | 'workshop' | 'preprint' | 'other' {
  const type = entry.entryType.toLowerCase();
  const venue = (entry.entryTags.booktitle || entry.entryTags.journal || '').toLowerCase();
  if (venue.includes('workshop')) return 'workshop';
  // A known venue takes precedence over an arXiv URL for accepted papers.
  if (venue.includes('arxiv') || venue.includes('preprint')) return 'preprint';
  if (!venue && (entry.entryTags.eprint || /arxiv\.org/.test(entry.entryTags.url || ''))) return 'preprint';
  if (type === 'inproceedings' || type === 'conference') return 'conference';
  if (type === 'article') {
    if (!venue) return 'other';
    if (/proc\.|proceedings/.test(venue)) return 'conference';
    return 'journal';
  }
  return 'other';
}

export function publicationLinks(entry: Publication) {
  const url = entry.entryTags.url || '';
  const explicitPdf = entry.entryTags.pdf;
  if (!url) return { paper: undefined, pdf: explicitPdf };
  const arxiv = url.match(/^https?:\/\/(?:www\.)?arxiv\.org\/(?:abs|pdf)\/([^?#]+?)(?:\.pdf)?(?:[?#].*)?$/);
  if (arxiv) return { paper: `https://arxiv.org/abs/${arxiv[1]}`, pdf: explicitPdf || `https://arxiv.org/pdf/${arxiv[1]}` };
  if (/\.pdf(?:[?#]|$)/i.test(url)) return { paper: undefined, pdf: explicitPdf || url };
  return { paper: url, pdf: explicitPdf };
}

export const SITE_URL = 'https://www.bhoxha.com';

export function publicationPath(entry: Pick<Publication, 'citationKey'>) {
  return `/publications/${encodeURIComponent(entry.citationKey)}/`;
}

export function publicationAuthors(value = ''): string[] {
  // Older entries use a comma-separated list of full names instead of BibTeX's "and".
  const commaParts = value.split(',').map(name => name.trim());
  if (!/\s+and\s+/i.test(value) && commaParts.length > 2 && commaParts.every(name => /\s/.test(name))) {
    return commaParts;
  }
  return value.split(/\s+and\s+/i).map(name => {
    const [family, given, suffix] = name.trim().split(',').map(part => part.trim());
    if (suffix) return `${suffix} ${family}, ${given}`; // Last, Jr, First
    return given ? `${given} ${family}` : family;
  }).filter(Boolean);
}

export function publicationBibtex(entry: Publication) {
  const fields = Object.entries(entry.entryTags)
    .filter(([, value]) => value)
    .map(([key, value]) => `  ${key} = {${value}}`);
  return `@${entry.entryType}{${entry.citationKey},\n${fields.join(',\n')}\n}`;
}

function absolutePublicationUrl(value?: string) {
  if (!value) return undefined;
  const url = new URL(value, `${SITE_URL}/`);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error(`Unsupported publication URL: ${value}`);
  return url.href;
}

export function publicationRecord(entry: Publication) {
  const tags = entry.entryTags;
  const links = publicationLinks(entry);
  return {
    id: entry.citationKey,
    title: tags.title || '',
    authors: publicationAuthors(tags.author),
    year: tags.year,
    type: getPublicationType(entry),
    venue: tags.booktitle || tags.journal,
    abstract: tags.abstract,
    keywords: (tags.keywords || '').split(',').map(keyword => keyword.trim()).filter(Boolean),
    award: tags.award,
    doi: tags.doi,
    url: `${SITE_URL}${publicationPath(entry)}`,
    links: {
      paper: absolutePublicationUrl(links.paper),
      pdf: absolutePublicationUrl(links.pdf),
      code: absolutePublicationUrl(tags.code),
      video: absolutePublicationUrl(tags.video),
    },
    bibtex: publicationBibtex(entry),
  };
}

export function publicationJsonLd(entry: Publication) {
  const record = publicationRecord(entry);
  return {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    '@id': `${record.url}#article`,
    url: record.url,
    mainEntityOfPage: record.url,
    headline: record.title,
    name: record.title,
    author: record.authors.map(name => ({
      '@type': 'Person', name,
      ...(name === 'Bardh Hoxha' ? { '@id': `${SITE_URL}/#person` } : {}),
    })),
    // Do not manufacture a month/day when the bibliography only supplies a year.
    datePublished: record.year,
    creativeWorkStatus: record.type === 'preprint' ? 'Preprint' : undefined,
    description: record.abstract,
    keywords: record.keywords,
    isPartOf: record.venue ? { '@type': 'CreativeWork', name: record.venue } : undefined,
    identifier: record.doi,
    sameAs: record.links.paper,
    encoding: record.links.pdf ? {
      '@type': 'MediaObject', contentUrl: record.links.pdf, encodingFormat: 'application/pdf',
    } : undefined,
    award: record.award,
  };
}

export function serializeJsonLd(value: unknown) {
  // Prevent data in the bibliography from closing the HTML script element.
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function publicationsMarkdown(entries: Publication[]) {
  const text = (value: string) => value.replace(/[\\`*_[\]<>#]/g, '\\$&').replace(/\r?\n/g, ' ');
  return '# Publications — Bardh Hoxha\n\nSource: https://www.bhoxha.com/publications.bib\n\n' + entries.map(entry => {
    const record = publicationRecord(entry);
    return [
      `## ${text(record.title)}`,
      '',
      `- Citation key: ${text(record.id)}`,
      `- Authors: ${record.authors.map(text).join('; ')}`,
      record.year && `- Year: ${text(record.year)}`,
      `- Type: ${record.type}`,
      record.venue && `- Venue: ${text(record.venue)}`,
      `- Page: ${record.url}`,
      ...Object.entries(record.links).filter(([, url]) => url).map(([label, url]) => `- ${label}: ${url}`),
      record.keywords.length > 0 && `- Topics: ${record.keywords.map(text).join('; ')}`,
      record.award && `- Award: ${text(record.award)}`,
      record.doi && `- DOI: ${text(record.doi)}`,
      record.abstract && `\n${text(record.abstract)}`,
    ].filter(line => line !== undefined && line !== false).join('\n');
  }).join('\n\n') + '\n';
}

export const ITEMS_PER_PAGE = 15;
export const FILTER_TYPES = ['all', 'conference', 'journal', 'workshop', 'preprint', 'recent'] as const;
export const THEMES = ['learning', 'planning', 'verification', 'testing', 'risk'] as const;
export function readPublicationState(search: string) {
  const params = new URLSearchParams(search);
  const type = params.get('type') || 'all';
  const requestedCount = Number(params.get('count'));
  return {
    type: FILTER_TYPES.includes(type as typeof FILTER_TYPES[number]) ? type : 'all',
    themes: [...new Set((params.get('themes') || '').split(',').filter(theme => THEMES.includes(theme as typeof THEMES[number])))],
    search: params.get('q') || '',
    count: Number.isFinite(requestedCount) && requestedCount >= ITEMS_PER_PAGE ? Math.min(Math.floor(requestedCount), 10000) : ITEMS_PER_PAGE,
  };
}
export type PublicationState = ReturnType<typeof readPublicationState>;
export function writePublicationState(current: string, state: PublicationState) {
  const params = new URLSearchParams(current);
  for (const key of ['type', 'themes', 'q', 'count']) params.delete(key);
  if (state.type !== 'all') params.set('type', state.type);
  if (state.themes.length) params.set('themes', state.themes.join(','));
  if (state.search) params.set('q', state.search);
  if (state.count > ITEMS_PER_PAGE) params.set('count', String(state.count));
  return params.toString();
}
