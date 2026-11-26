import Link from 'next/link';
import { buildResearchMap, closestPapers } from '@/lib/research-map';
import type { Publication } from '@/lib/bibtex';
import { getPublications } from '@/lib/publications';
import { publicationPath } from '@/lib/publication-utils';
import styles from './ConnectedPapers.module.css';

export default async function ConnectedPapers({ current }: { current: Publication }) {
  const key = current.citationKey;
  const papers = buildResearchMap(await getPublications());
  const neighbors = closestPapers(papers.find(p => p.id === key)!, papers);

  return (
    <section id="connected-papers" aria-labelledby="connections-title" className="mt-8 border-t border-[var(--edge)] pt-5 scroll-mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="connections-title" className="text-xl font-bold font-heading">Connected papers</h2>
        <Link href={`/research-map/?paper=${encodeURIComponent(key)}`} className="text-sm font-medium text-[var(--link)] hover:underline">Explore on research map →</Link>
      </div>
      {neighbors.length > 0 && <div className={styles.graph}>
        <div className={styles.origin}>
          <p className="mb-1 text-xs font-medium text-[var(--muted)]">This paper · {current.entryTags.year}</p>
          <p className="text-sm font-semibold leading-snug">{current.entryTags.title}</p>
        </div>
        <ul className={styles.neighbors}>
          {neighbors.map(({ paper, relation, direct }) => (
            <li key={paper.id}>
              <p className="text-xs leading-snug text-[var(--muted)]">{direct ? relation : 'Shared concept · '+relation}</p>
              <Link prefetch={false} href={publicationPath({citationKey:paper.id})} className="mt-1 block w-fit rounded-sm text-sm font-semibold leading-snug text-[var(--link)] underline-offset-4 hover:underline focus-visible:underline">
                {paper.title}
              </Link>
              <span className="text-xs tabular-nums text-[var(--muted)]">{paper.year}</span>
            </li>
          ))}
        </ul>
      </div>}
    </section>
  );
}
