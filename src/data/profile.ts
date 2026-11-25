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
  title: string;
  venue: string;
}

export const invitedTalks: Talk[] = [
  { year: '2024', title: 'Future Mobility: Challenges and Recent Developments in V&V', venue: 'Dagstuhl Seminar on Safety Assurance for Autonomous Mobility' },
  { year: '2023', title: 'Advancing Safety in ML-Driven Systems: Spatio-Temporal Quantitative Verification Techniques', venue: 'Stony Brook University' },
  { year: '2023', title: 'Safety in Advanced ML-Driven Systems', venue: 'University of Michigan' },
  { year: '2022', title: 'Verification and Synthesis of Cyber-Physical Systems with Learning-enabled Components', venue: 'NSF Center of Cognitive Autonomy' },
  { year: '2022', title: 'Simulation-Based Testing of Autonomous CPS', venue: 'Stony Brook University' },
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
    terms: [{ label: '2026', href: 'https://www.usenix.org/conference/vehiclesec26#organizers' }],
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
  'Acta Informatica',
  'Logical Methods in Computer Science',
];

export const conferenceReviewing = [
  'IEEE Conference on Decision and Control (CDC)',
  'American Control Conference (ACC)',
  'IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)',
  'International Conference on Cyber-Physical Systems (ICCPS)',
  'Applied Verification for Continuous and Hybrid Systems (ARCH)',
];

export const memberships = [
  'Institute of Electrical and Electronics Engineers (IEEE)',
  'Association for Computing Machinery (ACM)',
];
