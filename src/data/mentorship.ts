export type Resident = {
  name: string;
  profileUrl: string;
  yearEvidence?: { estimated?: boolean; url: string; label: string };
  university?: string;
  topic?: string;
};

type ResidencyGroup = {
  year: number;
  residents: Resident[];
};

export const residencyGroups: ResidencyGroup[] = [
  {
    year: 2026,
    residents: [
      { name: 'Muhan Lin', profileUrl: 'https://hellosunnyworld.github.io/', university: 'Purdue University', topic: 'Tool substitution for vision-language-action policies' },
      { name: 'Kai-Chun Chang', profileUrl: 'https://kevinchang73.github.io/', university: 'UC Berkeley', topic: 'Requirements-driven falsification of automated vehicles using diffusion models' },
      { name: 'Taekyung Kim', profileUrl: 'https://www.taekyung.me/', university: 'University of Michigan', topic: 'JEPA-Shield and safety guarantees for vision-language-action models' },
      { name: 'Ege Yuceel', profileUrl: 'https://yuceelege.github.io/', university: 'University of Illinois Urbana-Champaign', topic: 'Kinodynamic planning for tractor-trailer parking' },
      { name: 'Evangelos Psomiadis', profileUrl: 'https://www.linkedin.com/in/evangelos-psomiadis', university: 'Georgia Tech', topic: 'Graph neural networks for multi-agent pickup and drop-off' },
    ],
  },
  {
    year: 2025,
    residents: [
      { name: 'Eric Vin', profileUrl: 'https://eric-vin.github.io/', university: 'UC Santa Cruz', topic: 'Diffusion-based trajectory generation' },
      { name: 'Yan Miao', profileUrl: 'https://yanmiao.netlify.app/', university: 'University of Illinois Urbana-Champaign', topic: 'Vision-based UAV control with an editable digital twin' },
      { name: 'Taekyung Kim', profileUrl: 'https://www.taekyung.me/', university: 'University of Michigan' },
      { name: 'Yiqi (Nick) Zhao', profileUrl: 'https://zhaoy37.github.io/', university: 'USC' },
      { name: 'Sung Woo Choi', profileUrl: 'https://2026.formalise.org/profile/sungwoochoi2', university: 'University of Florida', topic: 'Verification of graph neural networks' },
    ],
  },
  {
    year: 2024,
    residents: [
      { name: 'Victoria Tuck', profileUrl: 'https://github.com/victoria-tuck', university: 'UC Berkeley' },
      { name: 'Hardik Parwana', profileUrl: 'https://sites.google.com/view/hardik-parwana/home', university: 'University of Michigan' },
      { name: 'Kehan Long', profileUrl: 'https://kehanlong.github.io/', topic: 'Learning-based control barrier functions' },
      { name: 'Yan Miao', profileUrl: 'https://yanmiao.netlify.app/', university: 'University of Illinois Urbana-Champaign', topic: 'Perception' },
    ],
  },
  {
    year: 2023,
    residents: [
      { name: 'Hardik Parwana', profileUrl: 'https://sites.google.com/view/hardik-parwana/home', university: 'University of Michigan', topic: 'Trust-based control barrier functions' },
      { name: 'Naman Shah', profileUrl: 'https://www.namanshah.net/', university: 'Arizona State University', topic: 'Planning and routing for stochastic systems' },
      { name: 'Shuo Yang', profileUrl: 'https://shuoyang2000.github.io/', university: 'University of Pennsylvania', topic: 'Data-driven AI for perception, planning and control' },
      { name: 'Ozgur Ozmen', profileUrl: 'https://ozgurozmen.github.io/', university: 'Purdue University', topic: 'Search-based testing for vulnerability detection in multi-robot systems' },
      { name: 'Noah Curran', profileUrl: 'https://ntcurran.com/', university: 'University of Michigan', topic: 'Human–autonomy handoffs in control barrier function applications' },
    ],
  },
  {
    year: 2022,
    residents: [
      { name: 'Kandai Watanabe', profileUrl: 'https://watakandai.github.io/', university: 'University of Colorado', topic: 'Learning timed automata for factory planning and scheduling' },
      { name: 'Jacob Anderson', profileUrl: 'https://www.linkedin.com/in/andersonjwan', university: 'Arizona State University', topic: 'Querying perception streams with regular expressions' },
      { name: 'Mitchell Black', profileUrl: 'https://www.blackmitchell.com/about', university: 'University of Michigan', topic: 'Risk-based guarantees for control with barrier functions' },
    ],
  },
  {
    year: 2021,
    residents: [
      {
        name: 'Xiaodong Yang',
        profileUrl: 'https://usa.visa.com/about-visa/visa-research/xiaodong-yang.html',
        university: 'Vanderbilt University',
        topic: 'Reachability analysis of deep neural networks',
        yearEvidence: { estimated: true, url: '/publications/yang2021reachability/', label: 'HSCC 2021 paper' },
      },
    ],
  },
  {
    year: 2020,
    residents: [
      {
        name: 'Anand Balakrishnan',
        profileUrl: 'https://anandb.dev/',
        university: 'University of Southern California',
        topic: 'Online monitoring for perception systems',
        yearEvidence: { url: 'https://anandb.dev/assets/AnandBalakrishnanCV.pdf', label: 'CV (summer 2020)' },
      },
      {
        name: 'Shakiba Yaghoubi',
        profileUrl: 'https://sites.google.com/asu.edu/syaghoub',
        university: 'Arizona State University',
        topic: 'Risk-bounded control using stochastic barrier functions',
        yearEvidence: { estimated: true, url: '/publications/yaghoubi2020risk/', label: '2020 control barrier functions paper' },
      },
    ],
  },
];
