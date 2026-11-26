'use client';

import { useSyncExternalStore } from 'react';
import { FaCertificate, FaExternalLinkAlt } from 'react-icons/fa';
import { patents, patentsByInventor, type Patent } from '@/data/patents';

function subscribeToNavigation(callback: () => void) {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}

const getInventor = () => new URLSearchParams(window.location.search).get('inventor') || '';
const noInventor = () => '';

const initialCount = 5;

const statusStyles = {
  abandoned: {
    border: 'border-l-slate-400',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
    label: 'Abandoned',
  },
  granted: {
    border: 'border-l-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    label: 'Granted',
  },
  pending: {
    border: 'border-l-blue-500',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    label: 'Pending',
  },
};

function PatentCard({ patent }: { patent: Patent }) {
  const style = statusStyles[patent.status];
  return (
    <a
      href={patent.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`block glass-card rounded-lg px-4 py-3 border-l-4 ${style.border} group flex items-start gap-4`}
    >
      {/* Icon */}
      <div className="shrink-0 pt-0.5 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors" aria-hidden="true">
        <FaCertificate />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {patent.title}
        </h3>
        <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 truncate">
          {patent.inventors}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {patent.number}
          </span>
          <span className="text-slate-400">· {patent.year}</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${style.badge}`}>
            {style.label}
          </span>
        </div>
      </div>

      {/* External link affordance */}
      <div className="shrink-0 self-center text-slate-400 opacity-60 group-hover:opacity-100 group-hover:text-blue-500 transition-all" aria-hidden="true">
        <FaExternalLinkAlt className="text-[0.7em]" />
      </div>
    </a>
  );
}

const Patents = () => {
  const inventor = useSyncExternalStore(subscribeToNavigation, getInventor, noInventor);
  const results = inventor ? patentsByInventor(inventor) : patents;
  return (
    <section tabIndex={-1} id="patents" className="scroll-mt-24" role="region" aria-label="Patents">
      <div className="flex items-center mb-8">
        <div className="h-10 w-1 bg-blue-500 rounded-full mr-4"></div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
          Patents
        </h2>
      </div>

      {inventor && (
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
          {results.length} {results.length === 1 ? 'record' : 'records'} for {inventor}
          <a href="/#patents" className="ml-3 text-blue-700 underline dark:text-blue-300">View all patents</a>
        </p>
      )}
      <div className="space-y-4">
        {results.slice(0, initialCount).map(patent => <PatentCard key={patent.number} patent={patent} />)}
        {results.length > initialCount && (
          <details className="group/patents">
            <summary className="mx-auto w-fit cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-blue-700 hover:underline dark:text-blue-300">
              <span className="group-open/patents:hidden">Show more ({results.length - initialCount} remaining)</span>
              <span className="hidden group-open/patents:inline">Show fewer patents</span>
            </summary>
            <div className="mt-4 space-y-4">
              {results.slice(initialCount).map(patent => <PatentCard key={patent.number} patent={patent} />)}
            </div>
          </details>
        )}
      </div>
    </section>
  );
};

export default Patents;
