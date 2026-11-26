import React from 'react';
import Link from 'next/link';
import { FaAward } from 'react-icons/fa';
import type { Publication } from '@/lib/bibtex';
import { publicationPath, publicationVenueName } from '@/lib/publication-utils';
import { honors, invitedTalks } from '@/data/profile';

const Honors = ({ publications }: { publications: Publication[] }) => {
  // Paper awards come straight from the bibliography, so a new `award` field shows up here.
  const paperAwards = publications
    .filter(pub => pub.entryTags.award)
    .map(pub => ({
      year: pub.entryTags.year || '',
      title: pub.entryTags.award as string,
      detail: publicationVenueName(pub),
      paper: pub,
    }));
  const items = [...paperAwards, ...honors.map(honor => ({ ...honor, paper: undefined }))]
    .sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <section tabIndex={-1} id="honors" className="scroll-mt-24" role="region" aria-label="Honors and recognition">
      <div className="flex items-center mb-5">
        <div className="h-10 w-1 bg-blue-500 rounded-full mr-4"></div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
          Honors &amp; Recognition
        </h2>
      </div>

      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
        <FaAward className="text-amber-500" aria-hidden="true" /> Awards and Distinctions
      </h3>
      <ul className="space-y-1.5">
        {items.map(item => (
          <li key={`${item.year}-${item.title}-${item.detail}`} className="glass-card rounded-lg px-3 py-2 border-l-2 border-l-amber-500 flex items-start gap-2.5">
            <div className="shrink-0 pt-0.5 w-8 font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              {item.year}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                {item.title}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{item.detail}</p>
              {item.paper && (
                <p className="text-xs mt-0.5">
                  <Link
                    prefetch={false}
                    href={publicationPath(item.paper)}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {item.paper.entryTags.title}
                  </Link>
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

    </section>
  );
};

export const InvitedTalks = () => (
    <section tabIndex={-1} id="talks" className="scroll-mt-24" aria-labelledby="talks-title">
      <div className="flex items-center mb-5">
        <div className="h-10 w-1 bg-blue-500 rounded-full mr-4"></div>
        <h2 id="talks-title" className="text-3xl font-bold text-slate-900 dark:text-white font-heading">Invited Talks</h2>
      </div>
      <ul className="space-y-1.5">
        {invitedTalks.map(talk => (
          <li key={`${talk.year}-${talk.title}`} className="glass-card rounded-lg px-3 py-2 border-l-2 border-l-blue-500 flex items-start gap-2.5">
            <div className="shrink-0 pt-0.5 w-8 font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              {talk.year}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                {talk.programUrl ? <a href={talk.programUrl} className="underline decoration-slate-400/50 underline-offset-2">{talk.title}</a> : talk.title}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{talk.venue}{talk.monthDay && ` · ${talk.monthDay}`}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
);

export default Honors;
