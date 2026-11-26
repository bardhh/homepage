import { Suspense } from 'react';
import PublicationReturnLink from '@/components/PublicationReturnLink';
import PublicationAuthors from '@/components/PublicationAuthors';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublications } from '@/lib/publications';
import { publicationJsonLd, publicationRecord, publicationVenueName, serializeJsonLd } from '@/lib/publication-utils';
import { researchAreas } from '@/data/research-areas';
import { projects } from '@/components/Software';
import PublicationCitation from '@/components/PublicationCitation';
import PublicationResources, { publicationLinkClass } from '@/components/PublicationResources';

type Props = { params: Promise<{ citationKey: string }> };
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPublications()).map(({ citationKey }) => ({ citationKey }));
}

async function getPublication(params: Props['params']) {
  const { citationKey } = await params;
  const publication = (await getPublications()).find(entry => entry.citationKey === citationKey);
  if (!publication) notFound();
  return publication;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = await getPublication(params);
  const publication = publicationRecord(entry);
  const { pages, volume, number } = entry.entryTags;
  const venue = publicationVenueName(entry);
  const citation: Record<string, string | string[]> = {
    citation_title: publication.title,
    citation_author: publication.authors,
  };
  if (publication.year) citation.citation_publication_date = publication.year;
  if (venue && publication.type === 'journal') citation.citation_journal_title = venue;
  if (venue && (publication.type === 'conference' || publication.type === 'workshop')) citation.citation_conference_title = venue;
  if (volume) citation.citation_volume = volume;
  if (number) citation.citation_issue = number;
  if (publication.doi) citation.citation_doi = publication.doi;
  const range = pages?.trim().match(/^(\d+)(?:\s*[-–—]+\s*(\d+))?$/);
  if (range && (!range[2] || Number(range[2]) >= Number(range[1]))) {
    citation.citation_firstpage = range[1];
    if (range[2]) citation.citation_lastpage = range[2];
  }
  const description = publication.abstract || `${publication.authors.join(', ')}. ${publication.venue || publication.type}${publication.year ? ` (${publication.year})` : ''}.`;
  return {
    title: `${publication.title} | Bardh Hoxha`,
    description,
    authors: publication.authors.map(name => ({ name })),
    keywords: publication.keywords,
    other: citation,
    alternates: { canonical: publication.url },
    openGraph: { title: publication.title, description, url: publication.url, type: 'article', authors: publication.authors },
    twitter: { card: 'summary', title: publication.title, description },
  };
}

export default async function PublicationPage({ params }: Props) {
  const entry = await getPublication(params);
  const publication = publicationRecord(entry);
  const project = projects.find(project => project.paperKey === entry.citationKey);
  const guide = researchAreas.find(area => area.paper === entry.citationKey);
  return (
    <div className="pb-24 space-y-8">
      <Suspense fallback={
        <Link prefetch={false} href="/publications/" className={`inline-block text-sm ${publicationLinkClass}`}>← All publications</Link>
      }>
        <PublicationReturnLink />
      </Suspense>
      <article className="glass rounded-2xl p-6 md:p-8 border border-white/40 dark:border-slate-700/40 shadow-sm break-words">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(publicationJsonLd(entry)) }} />
        <div className="flex flex-wrap gap-3 mb-4 text-sm font-medium text-slate-500 dark:text-slate-400">
          <span>{publication.year}</span>
          <span className="capitalize">{publication.type}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-heading leading-tight text-slate-900 dark:text-white">{publication.title}</h1>
        <p className="mt-5 text-slate-700 dark:text-slate-300 leading-relaxed"><PublicationAuthors names={publication.authors} /></p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{publication.venue}</p>
        {publication.award && <p className="mt-3 font-medium text-amber-700 dark:text-amber-300">{publication.award}</p>}
        {guide && <p className="mt-5 max-w-prose leading-relaxed text-slate-700 dark:text-slate-300">{guide.summary}</p>}
        <nav aria-label="Paper resources" className="flex flex-wrap gap-x-5 gap-y-3 mt-6">
          {publication.links.paper && <a href={publication.links.paper} className={publicationLinkClass}>Read paper</a>}
          {publication.links.pdf && <a href={publication.links.pdf} className={publicationLinkClass}>PDF</a>}
          {publication.links.website && <a href={publication.links.website} className={publicationLinkClass}>Project page</a>}
          {publication.links.code && <a href={publication.links.code} className={publicationLinkClass}>Code</a>}
          {project && <Link prefetch={false} href={`/#software-${project.paperKey}`} className={publicationLinkClass}>{project.title.split(':')[0]} software</Link>}
          {publication.links.video && <a href={publication.links.video} className={publicationLinkClass}>Video</a>}
        </nav>
        {publication.abstract && <section aria-labelledby="abstract-heading" className="mt-8">
          <h2 id="abstract-heading" className="text-xl font-bold font-heading mb-3">Abstract</h2>
          <p className="leading-relaxed whitespace-pre-line">{publication.abstract}</p>
        </section>}
        {publication.keywords.length > 0 && <p className="mt-6 text-sm text-slate-600 dark:text-slate-400"><strong>Topics:</strong> {publication.keywords.join('; ')}</p>}
        {publication.doi && <p className="mt-3 text-sm"><strong>DOI:</strong> {publication.doi}</p>}
        <PublicationCitation bibtex={publication.bibtex} paperUrl={publication.url} />
      </article>
      <div className="px-1">
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">Download the complete bibliography</p>
        <PublicationResources />
      </div>
    </div>
  );
}
