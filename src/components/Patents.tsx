import React from 'react';
import { FaCertificate, FaExternalLinkAlt } from 'react-icons/fa';

interface Patent {
  title: string;
  /** Display label, e.g. "US 12,487,598 B2" or "US App. 18/751,977". */
  number: string;
  status: 'granted' | 'pending';
  inventors: string;
  year: string;
  /** Google Patents URL — direct page for granted, title search for pending applications. */
  link: string;
}

// Search Google Patents by exact title for applications without a confirmed publication number.
const search = (title: string) =>
  `https://patents.google.com/?q=${encodeURIComponent(`"${title}"`)}&inventor=Bardh+Hoxha`;

const patents: Patent[] = [
  // --- Granted ---
  {
    title: 'Systems and methods for risk-bounded control barrier functions',
    number: 'US 12,487,598 B2',
    status: 'granted',
    inventors: 'Mitchell Black, Bardh Hoxha, Georgios Fainekos, Tomoya Yamaguchi, Danil V. Prokhorov',
    year: '2025',
    link: 'https://patents.google.com/patent/US12487598B2/en',
  },
  {
    title: 'Methods and systems for spatio-temporal regular expression matching',
    number: 'US 12,361,086 B2',
    status: 'granted',
    inventors: 'Jacob W. Anderson, Georgios Fainekos, Bardh Hoxha, Hideki Okamoto, Danil V. Prokhorov',
    year: '2025',
    link: 'https://patents.google.com/patent/US12361086B2/en',
  },
  {
    title: 'Systems and methods for online monitoring using a neural model by an automated vehicle',
    number: 'US 12,358,532 B2',
    status: 'granted',
    inventors: 'Bardh Hoxha, Tomoya Yamaguchi, Abdelrahman Hekal, Sergiy Bogomolov',
    year: '2025',
    link: 'https://patents.google.com/patent/US12358532B2/en',
  },
  // --- Pending applications ---
  {
    title: 'Producing a simulation recording to test an automated driving system',
    number: 'US App. 19/016,308',
    status: 'pending',
    inventors: 'Yan Miao, Bardh Hoxha, Georgios Fainekos, Hideki Okamoto, Michael J. Johnson, Vladimeros Vladimerou',
    year: '2026',
    link: search('Producing a simulation recording to test an automated driving system'),
  },
  {
    title: 'System and method for safe control synthesis for hybrid systems through local control barrier functions',
    number: 'US App. 18/751,977',
    status: 'pending',
    inventors: 'Shuo Yang, Georgios Fainekos, Bardh Hoxha, Mitchell Black, Hideki Okamoto, Danil V. Prokhorov',
    year: '2025',
    link: search('System and method for safe control synthesis for hybrid systems through local control barrier functions'),
  },
  {
    title: 'Systems and methods for predictive risk-aware control of vehicles in dynamic environments',
    number: 'US App. 18/486,324',
    status: 'pending',
    inventors: 'Mitchell Black, Georgios Fainekos, Bardh Hoxha, Hideki Okamoto, Danil Prokhorov',
    year: '2025',
    link: search('Systems and methods for predictive risk-aware control of vehicles in dynamic environments'),
  },
  {
    title: 'Learning abstractions for multi-robot path planning in unstructured environments',
    number: 'US App. 18/614,355',
    status: 'pending',
    inventors: 'Georgios Fainekos, Bardh Hoxha, Hideki Okamoto, Danil V. Prokhorov',
    year: '2025',
    link: search('Learning abstractions for multi-robot path planning in unstructured environments'),
  },
  {
    title: 'Systems and methods for control barrier functions for enhanced feasibility in optimization-based control',
    number: 'US App. 18/477,965',
    status: 'pending',
    inventors: 'Hardik Parwana, Mitchell Black, Georgios Fainekos, Bardh Hoxha, Hideki Okamoto, Danil V. Prokhorov',
    year: '2025',
    link: search('Systems and methods for control barrier functions for enhanced feasibility in optimization-based control'),
  },
  {
    title: 'Timed partial order identification for task learning from data',
    number: 'US App. 18/297,481',
    status: 'pending',
    inventors: 'Kandai Watanabe, Bardh Hoxha, Georgios Fainekos, Tomoya Yamaguchi, Danil Prokhorov',
    year: '2024',
    link: search('Timed partial order identification for task learning from data'),
  },
  {
    title: 'Neural network verification for neural network controllers',
    number: 'US App. 18/171,035',
    status: 'pending',
    inventors: 'Bardh Hoxha, Georgios Fainekos, Tomoya Yamaguchi, Danil Prokhorov',
    year: '2024',
    link: search('Neural network verification for neural network controllers'),
  },
  {
    title: 'Temporal logic robustness guided testing for cyber-physical systems',
    number: 'US App. 15/034,979',
    status: 'pending',
    inventors: 'Georgios Fainekos, Bardh Hoxha, Houssam Abbas',
    year: '2016',
    link: search('Temporal logic robustness guided testing for cyber-physical systems'),
  },
];

const statusStyles = {
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

const Patents = () => {
  return (
    <section id="patents" className="scroll-mt-24" role="region" aria-label="Patents">
      <div className="flex items-center mb-8">
        <div className="h-10 w-1 bg-blue-500 rounded-full mr-4"></div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
          Patents
        </h2>
      </div>

      <div className="space-y-4">
        {patents.map((patent, index) => {
          const style = statusStyles[patent.status];
          return (
            <a
              key={index}
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
        })}
      </div>
    </section>
  );
};

export default Patents;
