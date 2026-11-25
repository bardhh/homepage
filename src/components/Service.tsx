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
const subheadingClass = "text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3";

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
      <div className="flex items-center mb-8">
        <div className="h-10 w-1 bg-blue-500 rounded-full mr-4"></div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
          Leadership &amp; Service
        </h2>
      </div>

      <h3 className={subheadingClass}>Chair Roles</h3>
      <ul className="space-y-3 mb-10">
        {leadershipRoles.map(role => (
          <li key={`${role.role}-${role.venue}`} className="glass-card rounded-lg px-4 py-3 border-l-4 border-l-blue-500">
            <p className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
              {role.role}
            </p>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              {role.venue}, <Terms terms={role.terms} />
            </p>
          </li>
        ))}
      </ul>

      <h3 className={subheadingClass}>Program Committees</h3>
      <div className="glass rounded-2xl p-6 md:p-8 border border-white/40 dark:border-slate-700/40 shadow-sm mb-10">
        <dl className="grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-x-6 gap-y-3 text-sm">
          {programCommittees.map(venue => (
            <React.Fragment key={venue.short}>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">
                <abbr title={venue.name} className="no-underline">{venue.short}</abbr>
              </dt>
              <dd className="text-slate-600 dark:text-slate-300 -mt-2 md:mt-0">
                <span className="text-slate-500 dark:text-slate-400">{venue.name}: </span>
                <Terms terms={venue.terms} />
              </dd>
            </React.Fragment>
          ))}
        </dl>
      </div>

      <h3 className={subheadingClass}>Reviewing and Memberships</h3>
      <div className="glass rounded-2xl p-6 md:p-8 border border-white/40 dark:border-slate-700/40 shadow-sm text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Journals: </span>
          {journalReviewing.join(', ')}.
        </p>
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Conferences: </span>
          {conferenceReviewing.join(', ')}.
        </p>
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Member: </span>
          {memberships.join(', ')}.
        </p>
      </div>
    </section>
  );
};

export default Service;
