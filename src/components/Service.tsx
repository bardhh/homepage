import React from 'react';
import ExternalLink from '@/components/ExternalLink';
import {
  leadershipRoles,
  programCommittees,
  journalReviewing,
  conferenceReviewing,
  memberships,
  type ServiceTerm,
} from '@/data/profile';

const linkClass = "font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 no-underline hover:underline";
const subheadingClass = "text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2";

const Terms = ({ terms }: { terms: ServiceTerm[] }) => (
  <>
    {terms.map((term, index) => (
      <React.Fragment key={term.label}>
        {index > 0 && ', '}
        {term.href
          ? <ExternalLink href={term.href} className={linkClass} showIcon={false}>{term.label}</ExternalLink>
          : term.label}
      </React.Fragment>
    ))}
  </>
);

const Service = () => {
  return (
    <section tabIndex={-1} id="service" className="scroll-mt-24" role="region" aria-label="Leadership and service">
      <div className="flex items-center mb-5">
        <div className="h-10 w-1 bg-blue-500 rounded-full mr-4"></div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
          Leadership &amp; Service
        </h2>
      </div>

      <h3 className={subheadingClass}>Chair and Advisory Roles</h3>
      <ul className="space-y-1.5 mb-5">
        {leadershipRoles.map(role => (
          <li key={`${role.role}-${role.venue}`} className="glass-card rounded-lg px-3 py-2 border-l-2 border-l-blue-500">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
              {role.role}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {role.venue}, <Terms terms={role.terms} />
            </p>
          </li>
        ))}
      </ul>

      <h3 className={subheadingClass}>Program Committees</h3>
      <div className="glass rounded-lg px-4 py-3 border border-white/40 dark:border-slate-700/40 shadow-sm mb-5">
        <dl className="space-y-1.5 text-sm leading-5">
          {programCommittees.map(venue => (
            <div key={venue.short} className="sm:grid sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-3">
              <dt className="inline font-semibold text-slate-900 dark:text-slate-100">
                <abbr title={venue.name} className="no-underline">{venue.short}</abbr>
              </dt>{' '}
              <dd className="inline text-slate-600 dark:text-slate-300">
                <span className="text-slate-500 dark:text-slate-400">{venue.name}: </span>
                <Terms terms={venue.terms} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <h3 className={subheadingClass}>Reviewing and Memberships</h3>
      <div className="glass rounded-lg px-4 py-3 border border-white/40 dark:border-slate-700/40 shadow-sm text-sm text-slate-600 dark:text-slate-300 space-y-1.5 leading-5">
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Journals and magazines: </span>
          {journalReviewing.join(', ')}.
        </p>
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Conferences: </span>
          {conferenceReviewing.join(', ')}.
        </p>
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Memberships: </span>
          {memberships.join(', ')}.
        </p>
      </div>
    </section>
  );
};

export default Service;
