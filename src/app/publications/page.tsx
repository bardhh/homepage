import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublications } from '@/lib/publications';
import { publicationRecord, SITE_URL } from '@/lib/publication-utils';
import PublicationResources, { publicationLinkClass } from '@/components/PublicationResources';

const title = 'Publications | Bardh Hoxha';
const description = 'Complete publication archive of Bardh Hoxha, with authors, venues, paper links, and citations.';

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: `${SITE_URL}/publications/` },
  openGraph: { title, description, url: `${SITE_URL}/publications/`, type: 'website' },
  twitter: { card: 'summary', title, description },
};

export default async function PublicationsArchive() {
  const publications = (await getPublications()).map(publicationRecord);
  return (
    <div className="pb-24 space-y-8">
      <Link prefetch={false} href="/#publications" className={`inline-block text-sm ${publicationLinkClass}`}>← Back to homepage</Link>
      <div className="glass rounded-2xl p-6 md:p-8 border border-white/40 dark:border-slate-700/40 shadow-sm">
        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">Publication archive</h1>
        <p className="mt-3 mb-5 text-slate-600 dark:text-slate-400">All {publications.length} publications, from newest to oldest.</p>
        <PublicationResources />
      </div>
      <ol className="space-y-4" aria-label="All publications">
        {publications.map(publication => (
          <li key={publication.id} className="glass-card rounded-lg p-5 border-l-4 border-l-blue-500">
            <article>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span>{publication.year}</span>
                <span className="capitalize">{publication.type}</span>
              </div>
              <h2 className="font-semibold text-lg leading-snug">
                <Link prefetch={false} href={new URL(publication.url).pathname} className="hover:text-blue-600 dark:hover:text-blue-400">{publication.title}</Link>
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{publication.authors.join(', ')}</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{publication.venue}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm">
                {publication.links.paper && <a href={publication.links.paper} className={publicationLinkClass}>Paper</a>}
                {publication.links.pdf && <a href={publication.links.pdf} className={publicationLinkClass}>PDF</a>}
                {publication.links.code && <a href={publication.links.code} className={publicationLinkClass}>Code</a>}
                {publication.links.video && <a href={publication.links.video} className={publicationLinkClass}>Video</a>}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
