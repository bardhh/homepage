import bibtexParse from 'bibtex-parse-js';

export interface Publication {
  citationKey: string;
  entryType: string;
  entryTags: {
    title?: string;
    author?: string;
    booktitle?: string;
    year?: string;
    url?: string;
    video?: string;
    code?: string;
    award?: string;
    keywords?: string;
    [key: string]: string | undefined;
  };
}

export function parseBibtex(content: string): Publication[] {
  const parsed = bibtexParse.toJSON(content);
  // The library returns a specific structure, we might want to normalize it or just pass it through
  return parsed as Publication[];
}

export function getPublicationType(entry: Publication): 'conference' | 'journal' | 'workshop' | 'other' {
  const type = entry.entryType.toLowerCase();
  if (type === 'article') return 'journal';
  if (type === 'inproceedings' || type === 'conference') {
    // Heuristic: check booktitle for "workshop"
    if (entry.entryTags.booktitle?.toLowerCase().includes('workshop')) {
      return 'workshop';
    }
    return 'conference';
  }
  return 'other';
}
