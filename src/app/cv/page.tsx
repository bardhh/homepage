import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublications } from '@/lib/publications';
import { getPublicationType, publicationAuthors, publicationPath, publicationVenueName, SITE_URL } from '@/lib/publication-utils';
import { patents } from '@/data/patents';
import { projects } from '@/components/Software';
import PrintButton from '@/components/PrintButton';
import { ResidentList } from '@/components/ResearchMentorship';
import {
  conferenceReviewing,
  education,
  employment,
  honors,
  invitedTalks,
  journalReviewing,
  leadershipRoles,
  memberships,
  programCommittees,
  scholar,
} from '@/data/profile';

const title = 'Curriculum Vitae | Bardh Hoxha';
const description = 'Curriculum vitae of Bardh Hoxha: education, appointments, honors, publications, patents, software, and professional service.';

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: `${SITE_URL}/cv/` },
  openGraph: { title, description, url: `${SITE_URL}/cv/`, type: 'profile' },
  twitter: { card: 'summary', title, description },
};

const linkClass = 'font-medium text-blue-600 dark:text-blue-400 hover:underline';

const Section = ({ heading, children }: { heading: string; children: React.ReactNode }) => (
  <section className="mt-8">
    <h2 className="text-lg font-bold font-heading uppercase tracking-wide text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-600 pb-1 mb-3">
      {heading}
    </h2>
    {children}
  </section>
);

const Row = ({ when, children }: { when: string; children: React.ReactNode }) => (
  <li className="grid grid-cols-[6.5rem_1fr] gap-x-4">
    <span className="text-slate-500 dark:text-slate-400 tabular-nums">{when}</span>
    <div>{children}</div>
  </li>
);

export default async function CurriculumVitae() {
  const publications = await getPublications();
  const granted = patents.filter(patent => patent.status === 'granted');
  const pending = patents.filter(patent => patent.status === 'pending');
  const awards = [
    ...publications.filter(pub => pub.entryTags.award).map(pub => ({
      year: pub.entryTags.year || '',
      title: pub.entryTags.award as string,
      detail: `${publicationVenueName(pub)}, for “${pub.entryTags.title}”`,
    })),
    ...honors,
  ].sort((a, b) => Number(b.year) - Number(a.year));
  const preprints = publications.filter(pub => getPublicationType(pub) === 'preprint').length;

  return (
    <div className="pb-24 space-y-6">
      <article className="cv-page glass rounded-2xl p-6 md:p-10 border border-white/40 dark:border-slate-700/40 shadow-sm text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">Bardh Hoxha</h1>
          <PrintButton />
        </div>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Curriculum Vitae, {scholar.asOf}</p>
        <p className="mt-2">
          Senior Principal Scientist, Toyota Research Institute of North America, Ann Arbor, Michigan
        </p>
        <p>
          <a href="mailto:bardhh@gmail.com" className={linkClass}>bardhh@gmail.com</a>
          {' · '}
          <a href={SITE_URL} className={linkClass}>www.bhoxha.com</a>
          {' · '}
          <a href={scholar.url} className={linkClass}>Google Scholar</a>
        </p>

        <Section heading="Summary">
          <p>
            I develop methods and tools for testing, monitoring, and controlling autonomous and cyber-physical
            systems so that their safety can be checked against formal requirements. My work covers
            requirements-driven testing and falsification, runtime monitoring of signals and perception
            streams, and risk-aware control and verification of learning-enabled systems.
          </p>
          <p className="mt-2">
            {publications.length - preprints} peer-reviewed publications and {preprints} preprints, {granted.length} granted US patents and {pending.length} pending
            applications. {scholar.citations.toLocaleString('en-US')} citations, h-index {scholar.hIndex},
            i10-index {scholar.i10Index} (Google Scholar, {scholar.asOf}).
          </p>
        </Section>

        <Section heading="Education">
          <ul className="space-y-2">
            {education.map(item => (
              <Row key={item.degree} when={item.year}>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{item.degree}</span>, {item.school}
                <br />{item.detail}
              </Row>
            ))}
          </ul>
        </Section>

        <Section heading="Appointments">
          <ul className="space-y-2">
            {employment.map(item => (
              <Row key={`${item.role}-${item.place}`} when={item.years}>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{item.role}</span>
                <br />{item.place}
              </Row>
            ))}
          </ul>
        </Section>

        <Section heading="Honors and Awards">
          <ul className="space-y-2">
            {awards.map(item => (
              <Row key={`${item.year}-${item.title}-${item.detail}`} when={item.year}>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</span>
                <br />{item.detail}
              </Row>
            ))}
          </ul>
        </Section>

        <Section heading="Patents">
          <ol className="space-y-1.5 list-decimal pl-5">
            {patents.map(patent => (
              <li key={patent.number}>
                {patent.inventors}. <a href={patent.link} className={linkClass}>{patent.title}</a>.{' '}
                {patent.number}, {patent.status === 'granted' ? `granted ${patent.year}` : patent.status}.
              </li>
            ))}
          </ol>
        </Section>

        <Section heading="Publications">
          <ol className="space-y-1.5 list-decimal pl-5" reversed>
            {publications.map(pub => {
              const venue = publicationVenueName(pub);
              return (
                <li key={pub.citationKey}>
                  {publicationAuthors(pub.entryTags.author).join(', ')}.{' '}
                  <Link prefetch={false} href={publicationPath(pub)} className={linkClass}>{pub.entryTags.title}</Link>.{' '}
                  {[venue, pub.entryTags.year].filter(Boolean).join(', ')}.
                  {pub.entryTags.award && <span className="font-semibold"> {pub.entryTags.award}.</span>}
                </li>
              );
            })}
          </ol>
        </Section>

        <Section heading="Software">
          <ul className="space-y-1.5">
            {projects.map(project => (
              <li key={project.title}>
                <a href={project.link} className={linkClass}>{project.title}</a>
                {project.impact && <>. {project.impact.join('; ')}.</>}
              </li>
            ))}
          </ul>
        </Section>

        <Section heading="Mentorship">
          <ResidentList publications={publications} />
        </Section>

        <Section heading="Invited Talks">
          <ul className="space-y-2">
            {invitedTalks.map(talk => (
              <Row key={`${talk.year}-${talk.title}`} when={talk.year}>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {talk.programUrl ? <a href={talk.programUrl} className={linkClass}>{talk.title}</a> : talk.title}
                </span>
                <br />{talk.venue}{talk.monthDay && ` · ${talk.monthDay}`}
              </Row>
            ))}
          </ul>
        </Section>

        <Section heading="Professional Service">
          <ul className="space-y-1.5">
            {leadershipRoles.map(role => (
              <li key={`${role.role}-${role.venue}`}>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{role.role}: </span>
                {role.venue}, {role.terms.map(term => term.label).join(', ')}
              </li>
            ))}
            <li>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Program committees: </span>
              {programCommittees.map(venue => `${venue.short} (${venue.terms.map(term => term.label).join(', ')})`).join('; ')}
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Journal and magazine reviewing: </span>
              {journalReviewing.join(', ')}
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Conference reviewing: </span>
              {conferenceReviewing.join(', ')}
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Memberships: </span>
              {memberships.join(', ')}
            </li>
          </ul>
        </Section>
      </article>
    </div>
  );
}
