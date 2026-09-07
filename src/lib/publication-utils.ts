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
