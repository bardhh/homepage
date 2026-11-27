import { residencyGroups, type Resident } from '@/data/mentorship';
import { patentsByInventor } from '@/data/patents';
import type { Publication } from '@/lib/bibtex';
import { matchesContributor, publicationAuthors } from '@/lib/publication-utils';

const linkStyle = 'text-blue-700 underline decoration-blue-400/50 underline-offset-2 dark:text-blue-300';

function ResidentInfo({ resident, authors }: { resident: Resident; authors: string[] }) {
  const { topic, profileUrl, name } = resident;
  return (
    <div className="space-y-0.5 text-sm text-slate-600 dark:text-slate-400">
      {topic && <p>{topic}</p>}
      <div className="flex flex-wrap gap-x-3">
        <a className={linkStyle} href={profileUrl} aria-label={`Website for ${name}`}>
          <span className="cv-website-label">Website</span>
          <span className="cv-website-address hidden">{profileUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
        </a>
        {authors.some(author => matchesContributor(author, name)) && (
          <a className={linkStyle} href={`/?q=${encodeURIComponent(name)}#publications`} aria-label={`Papers by ${name}`}>Papers</a>
        )}
        {patentsByInventor(name).length > 0 && (
          <a className={linkStyle} href={`/?inventor=${encodeURIComponent(name)}#patents`} aria-label={`Patents by ${name}`}>Patents</a>
        )}
      </div>
    </div>
  );
}

export function ResidentList({ compact = false, publications }: { compact?: boolean; publications: Publication[] }) {
  const authors = [...new Set(publications.flatMap(pub => publicationAuthors(pub.entryTags.author)))];
  return (
    <div className={compact ? 'glass-card divide-y divide-slate-300/40 rounded-lg px-4 text-sm dark:divide-slate-600/40' : 'space-y-4'}>
      {residencyGroups.map(({ year, residents }) => (
        <div key={year} className={`grid gap-x-4 sm:grid-cols-[4rem_1fr] ${compact ? 'py-2' : ''}`}>
          <h3 className="font-semibold tabular-nums text-slate-600 dark:text-slate-400">{year}</h3>
          <ul className={compact ? 'grid gap-x-4 sm:grid-cols-2' : 'space-y-1.5'}>
            {residents.map(resident => {
              const name = (
                <>
                  {resident.name}
                  {resident.university && <span className="text-xs font-normal text-slate-600 dark:text-slate-400"> [{resident.university}]</span>}
                </>
              );
              return (
                <li key={resident.name} className="min-w-0 break-inside-avoid">
                  {compact ? (
                    <details>
                      <summary className="cursor-pointer rounded py-1 font-medium text-slate-900 marker:text-slate-400 hover:text-blue-700 dark:text-slate-100 dark:hover:text-blue-300">{name}</summary>
                      <div className="pb-2 pl-4"><ResidentInfo resident={resident} authors={authors} /></div>
                    </details>
                  ) : (
                    <>
                      <strong className="font-semibold text-slate-900 dark:text-slate-100">{name}</strong>
                      <ResidentInfo resident={resident} authors={authors} />
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function ResearchMentorship({ publications }: { publications: Publication[] }) {
  return (
    <section id="mentorship" tabIndex={-1} aria-labelledby="mentorship-title" className="scroll-mt-24">
      <div className="mb-3">
        <h2 id="mentorship-title" className="profile-title">Mentorship</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Graduate researchers I have had the opportunity to mentor and co-mentor at TRINA.</p>
      </div>
      <ResidentList compact publications={publications} />
      <a href="/genealogy/" className="mt-2 inline-flex min-h-10 items-center gap-1 text-sm font-medium text-[var(--link)] underline-offset-4 hover:underline">
        Explore my academic genealogy <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
