// Hand-maintained profile facts that are not in publications.bib.
// Sources and dates are recorded in docs/superpowers/plans/2026-11-16-ieee-fellow-readiness.md.

export const researchSummaryParagraphs = [
  'I study how formal requirements can guide the design of autonomous systems and help establish what guarantees an existing system can support.',
  'Across perception, planning, and control, I develop methods for constructing systems that satisfy a specification and for verifying their behavior under explicit assumptions. Where uncertainty limits those guarantees, I use statistical methods to quantify risk. When testing is the available evidence, I use the requirements to choose experiments that expose weaknesses and inform the next design revision.',
];
export const researchSummary = researchSummaryParagraphs.join(' ');

/** Google Scholar totals. Update the numbers and the date together. */
export const scholar = {
  url: 'https://scholar.google.com/citations?user=kK7LubkAAAAJ&hl=en',
  citations: 2008,
  hIndex: 25,
  i10Index: 50,
  asOf: 'November 2026',
};

/** Rounds a citation count down to the nearest ten for display, e.g. 196 -> "190+". */
export const citedAtLeast = (count: number) => `${(Math.floor(count / 10) * 10).toLocaleString('en-US')}+`;

export interface SelectedPublication {
  /** Citation key in publications.bib. The build fails if it does not exist. */
  key: string;
  /** One line on why the paper mattered. */
  note: string;
  /** Google Scholar citation count as of `scholar.asOf`. */
  citations?: number;
}

export const selectedPublications: SelectedPublication[] = [
  {
    key: 'dokhanchi2014line',
    note: 'Computes temporal logic robustness online for formulas with bounded future and unbounded past, which made quantitative runtime monitoring of cyber-physical systems practical.',
    citations: 196,
  },
  {
    key: 'hoxha2014benchmarks',
    note: 'Automotive models and requirements that became standard problems for falsification tools, including the ARCH-COMP falsification competition.',
    citations: 163,
  },
  {
    key: 'hoxha2017mining',
    note: 'Parameter mining: finds the range of requirement parameters for which a system satisfies or violates a temporal logic specification.',
    citations: 132,
  },
  {
    key: 'yang2022neural',
    note: 'Repairs unsafe deep neural networks using reachability analysis. Received the FORMATS 2022 Best Software Artifact Award.',
    citations: 63,
  },
  {
    key: 'STTT2023',
    note: 'RTAMT, an open-source library for offline and online monitoring of Signal Temporal Logic, applied to cyber-physical systems and robotics.',
    citations: 48,
  },
  {
    key: 'yaghoubi2020risk',
    note: 'Stochastic barrier functions that bound the probability of unsafe behavior, the start of a line of risk-aware control work.',
    citations: 46,
  },
  {
    key: 'anderson2023pattern',
    note: 'Spatial regular expressions for searching perception streams. Best paper finalist at RV 2023 and the basis of the STREM tool and a granted US patent.',
  },
  {
    key: 'hekmatnejad2022formalizing',
    note: 'Spatio-Temporal Perception Logic, a language for stating and evaluating requirements on the perception systems of automated vehicles.',
  },
];

export interface Honor {
  year: string;
  title: string;
  detail: string;
}

/** Honors that are not attached to a paper. Paper awards come from the `award` field in the .bib. */
export const honors: Honor[] = [
  { year: '2017', title: 'Outstanding PhD Student', detail: 'Computer Science, Arizona State University' },
];

export interface Talk {
  year: string;
  monthDay?: string;
  title: string;
  venue: string;
  resources?: { label: 'Program' | 'Seminar' | 'Report' | 'Slides' | 'Recording'; href: string }[];
}

export const invitedTalks: Talk[] = [
  { year: '2024', title: 'Future Mobility: Challenges and Recent Developments in V&V', venue: 'Dagstuhl Seminar on Safety Assurance for Autonomous Mobility',
    resources: [
      { label: 'Seminar', href: 'https://www.dagstuhl.de/24071' },
      { label: 'Report', href: 'https://doi.org/10.4230/DagRep.14.2.95' },
    ] },
  { year: '2023', title: 'Advancing Safety in ML-Driven Systems: Spatio-Temporal Quantitative Verification Techniques', venue: 'Stony Brook University' },
  { year: '2023', monthDay: 'November 15', title: 'Safety in Advanced ML-Driven Systems', venue: 'University of Michigan' },
  { year: '2022', title: 'Verification and Synthesis of Cyber-Physical Systems with Learning-enabled Components', venue: 'NSF Center of Cognitive Autonomy', monthDay: 'April 8',
    resources: [{ label: 'Program', href: 'https://autonomy.unm.edu/speaker-series/2022.html' }] },
  { year: '2021', monthDay: 'August 23', title: 'Autonomous CPS: Verification and Control', venue: 'SNR Workshop at QONFEST', resources: [{ label: 'Program', href: 'https://qonfest2021.lacl.fr/speakers.php#hoxha' }] },
  { year: '2021', monthDay: 'April 15', title: 'Simulation-Based Testing of Autonomous CPS', venue: 'Stony Brook University' },
  { year: '2021', title: 'Verification of Deep Neural Networks', venue: 'University of Southern California, Center for Cyber-Physical Systems and the Internet of Things' },
];

export interface ServiceTerm {
  label: string;
  href?: string;
}

export interface ServiceRole {
  role: string;
  venue: string;
  terms: ServiceTerm[];
}

export const leadershipRoles: ServiceRole[] = [
  {
    role: 'Program Chair',
    venue: 'Workshop on Monitoring and Testing of Cyber-Physical Systems (MT-CPS)',
    terms: [{ label: '2018' }],
  },
  {
    role: 'Repeatability Evaluation Chair',
    venue: 'ACM International Conference on Hybrid Systems: Computation and Control (HSCC)',
    terms: [
      { label: '2021', href: 'https://hscc.acm.org/2021/organizers/' },
      { label: '2020', href: 'https://berkeleylearnverify.github.io/HSCC_2020/' },
    ],
  },
  {
    role: 'Advisory Committee Member',
    venue: 'HSCC Repeatability Evaluation',
    terms: [{ label: '2020' }],
  },
];

export interface CommitteeVenue {
  short: string;
  name: string;
  terms: ServiceTerm[];
}

/** Program committee service, grouped by venue, most recent term first. */
export const programCommittees: CommitteeVenue[] = [
  {
    short: 'HSCC',
    name: 'Hybrid Systems: Computation and Control',
    terms: [
      { label: '2027 (with ICCPS)' },
      { label: '2026 (with ICCPS)', href: 'https://hscc-iccps26.hotcrp.com/users/pc' },
      { label: '2025', href: 'https://hscc.acm.org/2025/organizers/' },
      { label: '2024', href: 'https://hscc.acm.org/2024/organizers/' },
      { label: '2023', href: 'https://hscc.acm.org/2023/organizers/' },
      { label: '2022', href: 'https://hscc.acm.org/2022/organizers/' },
    ],
  },
  {
    short: 'NFM',
    name: 'NASA Formal Methods Symposium',
    terms: [
      { label: '2027', href: 'https://conf.researchr.org/profile/nfm-2027/bardhhoxha' },
      { label: '2026', href: 'https://easychair.org/cfp/nfm-2026' },
      { label: '2023', href: 'https://conf.researchr.org/profile/nfm-2023/bardhhoxha' },
      { label: '2022', href: 'https://nfm2022.caltech.edu/#organization' },
    ],
  },
  {
    short: 'RV',
    name: 'International Conference on Runtime Verification',
    terms: [
      { label: '2026', href: 'https://rv2026.smithengineering.queensu.ca/committees/' },
      { label: '2025', href: 'https://rv25.isec.tugraz.at/committees/' },
    ],
  },
  {
    short: 'EMSOFT',
    name: 'International Conference on Embedded Software',
    terms: [
      { label: '2026', href: 'https://esweek.org/emsoft-program-committee/' },
      { label: '2018 (work in progress track)' },
    ],
  },
  {
    short: 'AAAI',
    name: 'AAAI Conference on Artificial Intelligence',
    terms: [{ label: '2024' }, { label: '2023' }],
  },
  {
    short: 'IJCAI',
    name: 'International Joint Conference on Artificial Intelligence',
    terms: [{ label: '2016' }],
  },
  {
    short: 'VehicleSec',
    name: 'USENIX Symposium on Vehicle Security and Privacy',
    terms: [
      { label: '2027 (Cycle 1)', href: 'https://www.usenix.org/conference/vehiclesec27#organizers' },
      { label: '2026', href: 'https://www.usenix.org/conference/vehiclesec26#organizers' },
    ],
  },
  {
    short: 'AutoSec',
    name: 'Workshop on Automotive and Autonomous Vehicle Security',
    terms: [{ label: '2022' }],
  },
  {
    short: 'SafeThings',
    name: 'IEEE Workshop on the Internet of Safe Things',
    terms: [{ label: '2020', href: 'https://www.ieee-security.org/TC/SPW2020/SafeThings/' }],
  },
  {
    short: 'MT-CPS',
    name: 'Workshop on Monitoring and Testing of Cyber-Physical Systems',
    terms: [
      { label: '2021', href: 'https://sites.google.com/virginia.edu/mt-cps2021/committes' },
      { label: '2020', href: 'https://sites.google.com/view/mt-cps2020/' },
      { label: '2019' },
    ],
  },
  {
    short: 'DARS',
    name: 'Workshop on Design and Analysis of Robust Systems',
    terms: [{ label: '2019' }],
  },
  {
    short: 'HSCC RE',
    name: 'HSCC Repeatability Evaluation Committee',
    terms: [{ label: '2019' }, { label: '2018' }, { label: '2017' }, { label: '2016' }],
  },
];

export const journalReviewing = [
  'IEEE Transactions on Automatic Control',
  'IEEE Systems Journal',
  'IEEE Computational Intelligence Magazine (2021, 2022)',
  'Nonlinear Analysis: Hybrid Systems (2024)',
  'Acta Informatica',
  'Logical Methods in Computer Science',
];

export const conferenceReviewing = [
  'IEEE Conference on Decision and Control (CDC)',
  'IEEE International Conference on Automation Science and Engineering (CASE 2023)',
  'IEEE International Conference on Robotics and Automation (ICRA 2027)',
  'American Control Conference (ACC)',
  'IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)',
  'International Conference on Cyber-Physical Systems (ICCPS)',
  'Applied Verification for Continuous and Hybrid Systems (ARCH)',
];

export const memberships = [
  'IEEE Senior Member',
  'ACM Member',
];

export const education = [
  {
    year: '2017',
    degree: 'Ph.D. in Computer Science',
    school: 'Arizona State University',
    detail: 'Thesis: Formal Requirements-Driven Analysis of Cyber Physical Systems. Advisor: Georgios Fainekos.',
  },
  {
    year: '2010',
    degree: 'M.A. in Mathematics',
    school: 'Central Connecticut State University',
    detail: 'Area of study: Actuarial Science. Advisor: Frank Bensics.',
  },
];

export const employment = [
  { years: 'Present', role: 'Senior Principal Scientist', place: 'Toyota Research Institute of North America, Ann Arbor, Michigan' },
  { years: '2017 – 2020', role: 'Assistant Professor, Department of Computer Science', place: 'Southern Illinois University, Carbondale, Illinois' },
  { years: '2011 – 2017', role: 'Research Assistant', place: 'Arizona State University, Tempe, Arizona' },
  { years: '2010 – 2011', role: 'Mathematics Lecturer', place: 'Central Connecticut State University, New Britain, Connecticut' },
  { years: '2009 – 2011', role: 'Mathematics Lecturer', place: 'Capital Community College, Hartford, Connecticut' },
];
