import { matchesContributor } from '@/lib/publication-utils';

export interface Patent {
  title: string;
  /** Display label, e.g. "US 12,487,598 B2" or "US App. 18/751,977". */
  number: string;
  status: 'granted' | 'pending' | 'abandoned';
  inventors: string;
  year: string;
  /** Google Patents URL — direct page for granted, title search for pending applications. */
  link: string;
  /** Citation keys of directly related papers. */
  related?: string[];
}

// Search Google Patents by exact title for applications without a confirmed publication number.
const search = (title: string) =>
  `https://patents.google.com/?q=${encodeURIComponent(`"${title}"`)}&inventor=Bardh+Hoxha`;

export const patents: Patent[] = [
  // --- Granted ---
  {
    title: 'System and method for manipulating an omnidirectional cart using an armed robot',
    number: 'US 12,759,133 B2',
    status: 'granted',
    inventors: 'Bardh Hoxha, Georgios Fainekos, Hideki Okamoto, Danil V. Prokhorov, Mitchell Black',
    year: '2026',
    link: 'https://patents.justia.com/patent/12759133',
  },
  {
    title: 'Learning abstractions for multi-robot path planning in unstructured environments',
    number: 'US 12,654,320 B2',
    status: 'granted',
    inventors: 'Naman P. Shah, Georgios Fainekos, Bardh Hoxha, Hideki Okamoto, Danil V. Prokhorov',
    year: '2026',
    link: 'https://patents.google.com/patent/US12654320B2/en',
  },
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
    related: ['anderson2023pattern', 'STTT2024'],
    number: 'US 12,361,086 B2',
    status: 'granted',
    inventors: 'Jacob W. Anderson, Georgios Fainekos, Bardh Hoxha, Hideki Okamoto, Danil V. Prokhorov',
    year: '2025',
    link: 'https://patents.google.com/patent/US12361086B2/en',
  },
  {
    title: 'Systems and methods for online monitoring using a neural model by an automated vehicle',
    related: ['bogomolov2022runtime'],
    number: 'US 12,358,532 B2',
    status: 'granted',
    inventors: 'Bardh Hoxha, Tomoya Yamaguchi, Abdelrahman Hekal, Sergiy Bogomolov',
    year: '2025',
    link: 'https://patents.google.com/patent/US12358532B2/en',
  },
  // --- Published applications ---
  {
    title: 'Barrier rate-guided model predictive path integral (MPPI) for collision aware and narrow environment navigation',
    number: 'US App. 19/188,556',
    status: 'pending',
    inventors: 'Hardik Parwana, Georgios Fainekos, Bardh Hoxha, Hideki Okamoto',
    year: '2026',
    link: 'https://patents.justia.com/patent/20260336662',
  },
  {
    title: 'Risk aware model predictive path integral control for stochastic hybrid systems',
    number: 'US App. 19/080,119',
    status: 'pending',
    inventors: 'Hardik Parwana, Mitchell Black, Georgios Fainekos, Bardh Hoxha, Hideki Okamoto, Danil V. Prokhorov, Dimitra Panagou',
    year: '2026',
    link: 'https://patents.justia.com/patent/20260277227',
  },
  {
    title: 'Neural configuration distance function for continuum robot control',
    related: ['IROS2025'],
    number: 'US App. 19/057,472',
    status: 'pending',
    inventors: 'Kehan Long, Georgios Fainekos, Bardh Hoxha, Hideki Okamoto',
    year: '2026',
    link: 'https://patents.google.com/patent/US20260241561A1/en',
  },
  {
    title: 'Methods of qualitative and quantitative verification of complex learning-enabled systems and temporal logic verification',
    number: 'US App. 19/003,350',
    status: 'pending',
    inventors: 'Bardh Hoxha, Georgios Fainekos, Hideki Okamoto, Danil Prokhorov, Hoang-Dung Tran',
    year: '2026',
    link: 'https://patents.google.com/patent/US20260184308A1/en',
  },
  {
    title: 'Producing a simulation recording to test an automated driving system',
    number: 'US App. 19/016,308',
    status: 'pending',
    inventors: 'Yan Miao, Bardh Hoxha, Georgios Fainekos, Hideki Okamoto, Miles J. Johnson, Vladimeros Vladimerou',
    year: '2026',
    link: search('Producing a simulation recording to test an automated driving system'),
  },
  {
    title: 'Methods and systems for spatio-temporal regular expression matching',
    related: ['anderson2023pattern'],
    number: 'US App. 19/230,678',
    status: 'pending',
    inventors: 'Jacob W. Anderson, Georgios Fainekos, Bardh Hoxha, Hideki Okamoto, Danil V. Prokhorov',
    year: '2025',
    link: 'https://patents.google.com/patent/US20250298855A1/en',
  },
  {
    title: 'System and method for optimization of vehicle perception sensor configuration',
    number: 'US App. 18/593,630',
    status: 'pending',
    inventors: 'Noah T. Curran, Georgios Fainekos, Bardh Hoxha, Hideki Okamoto, Danil V. Prokhorov',
    year: '2025',
    link: 'https://patents.google.com/patent/US20250276708A1/en',
  },
  {
    title: 'System and method for safe control synthesis for hybrid systems through local control barrier functions',
    related: ['yang2023safe'],
    number: 'US App. 18/751,977',
    status: 'pending',
    inventors: 'Shuo Yang, Georgios Fainekos, Bardh Hoxha, Mitchell Black, Hideki Okamoto, Danil V. Prokhorov, Hardik Parwana',
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
    title: 'Systems and methods for control barrier functions for enhanced feasibility in optimization-based control',
    number: 'US App. 18/477,965',
    status: 'pending',
    inventors: 'Hardik Parwana, Mitchell Black, Georgios Fainekos, Bardh Hoxha, Hideki Okamoto, Danil V. Prokhorov',
    year: '2025',
    link: search('Systems and methods for control barrier functions for enhanced feasibility in optimization-based control'),
  },
  {
    title: 'Timed partial order identification for task learning from data',
    related: ['watanabe2023timed'],
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
    status: 'abandoned',
    inventors: 'Georgios Fainekos, Bardh Hoxha, Houssam Abbas',
    year: '2016',
    link: 'https://patents.google.com/patent/US20160292307A1/en',
  },
];

export function patentsByInventor(name: string) {
  return patents.filter(patent => patent.inventors.split(',').some(inventor => matchesContributor(inventor, name)));
}
