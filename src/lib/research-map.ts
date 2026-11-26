import { publicationVenueName } from './publication-utils';
import type { Publication } from './bibtex';
import { researchConcepts } from '@/data/research-concepts';
import { researchApplications } from '@/data/research-applications';
import { paperConnections } from '@/data/paper-connections';
import { perceptionReadingPath } from '@/data/perception-reading-path';

export interface MapPaper { id: string; title: string; year: string; venue: string; underReview: boolean; concepts: string[]; applications: string[] }
export const concepts = researchConcepts.map(({id, name}) => ({id, name}));

export const applications = researchApplications.map(({id, name, description}) => ({id, name, description}));

export function buildResearchMap(publications: Publication[]): MapPaper[] {
  const papers = publications.map(p => ({
    id: p.citationKey, title: p.entryTags.title!, year: p.entryTags.year || '',
    venue: publicationVenueName(p),
    underReview: /under review/i.test(p.entryTags.booktitle || p.entryTags.journal || ''),
    applications: researchApplications.filter(a => a.papers.includes(p.citationKey)).map(a => a.id),
    concepts: researchConcepts.filter(c => c.papers.includes(p.citationKey)).map(c => c.id),
  }));
  const keys = new Set(papers.map(p => p.id));
  const referencedPapers = [
    ...[...researchConcepts, ...researchApplications].flatMap(group => group.papers),
    ...paperConnections.flatMap(e => [e.from, e.to]),
    ...perceptionReadingPath.map(step => step.paper),
  ];
  for (const key of referencedPapers) {
    if (!keys.has(key)) throw new Error(`Unknown paper in research map: ${key}`);
  }
  return papers;
}

export function closestPapers(current: MapPaper, papers: MapPaper[]) {
  const weights = new Map(current.concepts.map(id => [id, Math.log(1 + papers.length / papers.filter(p => p.concepts.includes(id)).length)]));
  return papers.filter(p => p.id !== current.id && p.title.toLowerCase() !== current.title.toLowerCase()).map(paper => {
    const edge = paperConnections.find(e => (e.from === current.id && e.to === paper.id) || (e.to === current.id && e.from === paper.id));
    const shared = current.concepts.filter(id => paper.concepts.includes(id));
    const score = shared.reduce((sum, id) => sum + weights.get(id)!, 0) /
      new Set([...current.concepts, ...paper.concepts]).size;
    const relation = edge ? (edge.from === current.id ? edge.forward : edge.reverse) :
      shared.map(id => concepts.find(c => c.id === id)!.name).join(' · ');
    return { paper, relation, direct: Boolean(edge), score };
  }).filter(n => n.direct || n.score > 0)
    .sort((a,b) => Number(b.direct) - Number(a.direct) || b.score - a.score ||
      Math.abs(+a.paper.year - +current.year) - Math.abs(+b.paper.year - +current.year) || a.paper.id.localeCompare(b.paper.id))
    .slice(0,3);
}
