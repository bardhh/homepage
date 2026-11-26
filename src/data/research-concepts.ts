// Editorial concept assignments refer to citation keys, so changes to paper titles
// or venue metadata flow through to both the map and the paper-page neighborhoods.
export const researchConcepts = [
  { id: 'falsification', name: 'Falsification', papers: [
    'Khandait26-DiffTilt', 'AAAIw2024', 'hekmatnejad2020search', 'fainekos2019robustness',
    'dokhanchi2018arch', 'tuncali2018experience', 'dokhanchi2017vacuity', 'dokhanchi2017arch',
    'abbas2014conformance', 'iccps2014wip', 'abbas2014robustness', 'hoxha2014benchmarks',
    'hoxha2014using', 'hoxhasystem', 'date2020application',
  ] },
  { id: 'specifications', name: 'Specification mining & debugging', papers: [
    'hoxha2017mining', 'hoxha2016pareto', 'yang2012querying', 'dokhanchi2017formal', 'dokhanchi2017vacuity',
    'dokhanchi2016mitl', 'dokhanchi2015metric', 'hoxha2015vispec', 'hoxha2014towards', 'fainekos2019robustness',
    'yamaguchi2020specification', 'nishitani2023checkmate', 'hoxha2014benchmarks',
  ] },
  { id: 'monitoring', name: 'Runtime monitoring', papers: [
    'STTT2023', 'Hoxha26-VisionRTM', 'cralley2020tltk', 'dokhanchi2016efficient', 'dokhanchi2014line',
    'fainekos2019robustness', 'dokhanchi2016mitl', 'hoxha2016planning', 'zhao2023robust', 'Zhao25',
    'balakrishnan2021percemon', 'bogomolov2022runtime', 'hekmatnejad2020search',
  ] },
  { id: 'perception', name: 'Perception streams', papers: [
    'anderson2023pattern', 'STTT2024', 'Anderson25-STG', 'Anderson25-LogSTOP', 'Hoxha26-VisionRTM',
    'hekmatnejad2022formalizing', 'balakrishnan2021percemon',
  ] },
  { id: 'temporal', name: 'Temporal logic', papers: [
    'Khare26-TSG', 'Zhao26-STLMPPI', 'Zhao25-STLGO', 'HSCC2025-probstar', 'TCPS2025', 'TCPS2024',
    'ADHS2024', 'ICCPS2023', 'hashemi2023risk', 'STTT2023', 'cralley2020tltk', 'Zhao25',
    'zhao2023robust', 'hoxha2017mining', 'dokhanchi2017vacuity', 'dokhanchi2016efficient',
    'hoxha2016pareto', 'dokhanchi2016mitl', 'hoxha2016planning', 'dokhanchi2015metric',
    'hoxha2015vispec', 'dokhanchi2014line', 'hoxha2014benchmarks', 'abbas2014robustness',
    'yang2012querying', 'nguyen2018mission', 'hekmatnejad2022formalizing',
  ] },
  { id: 'reachability', name: 'Neural reachability', papers: [
    'tran2023quantitative', 'HSCC2025-probstar', 'Tran25-CAV', 'Li26', 'tran2023verification',
    'NAHS2025', 'yang2021reachability', 'WFML2022', 'yang2022neural', 'bogomolov2022runtime',
  ] },
  { id: 'risk', name: 'Risk & uncertainty', papers: [
    'Hoxha26-BRACBF', 'Oura26-CausalMDP', 'Wang26-RLRiskCVaR', 'Zhang25', 'Zhao25', 'Wang25',
    'MPPI2024', 'ACC2024', 'black2023safety', 'zhao2023robust', 'hashemi2023risk',
    'yaghoubi2021risk', 'yaghoubi2020risk', 'abbas2014robustness', 'Li26', 'tran2023quantitative',
  ] },
  { id: 'barriers', name: 'Control barrier functions', papers: [
    'IROS2024', 'Hoxha26-BRACBF', 'Wang26-RLRiskCVaR', 'Kim26-PolicyLibraryCBF', 'Zhang25',
    'Wang25', 'Majd25', 'Parwana25', 'TSA2024', 'yang2023safe', 'parwana2025feasible',
    'black2023safety', 'yaghoubi2021risk', 'majd2021safe', 'yaghoubi2020risk',
  ] },
  { id: 'planning', name: 'Motion planning & control', papers: [
    'Kim25-SafeMPD', 'IROS2025', 'Zhao26-STLMPPI', 'Majd25', 'Parwana25', 'TSA2024', 'MPPI2024',
    'ICRA2024', 'Wang25', 'majd2021safe', 'hoxha2016planning', 'nguyen2018mission', 'watanabe2023timed',
  ] },
  { id: 'multiagent', name: 'Multi-agent systems', papers: [
    'Fronda26-Firefly', 'Fronda26-FairCoPlan', 'Yamaguchi25', 'Tuck25', 'NFM_2024', 'Zhao25',
    'Zhao25-STLGO', 'nishitani2023checkmate', 'nguyen2018mission',
  ] },
  { id: 'learning', name: 'Learning-enabled control', papers: [
    'TCPS2025', 'TCPS2024', 'ADHS2024', 'ICCPS2023', 'hashemi2023risk', 'Wang26-RLRiskCVaR',
    'Li26', 'Tran25-CAV', 'HSCC2025-probstar', 'date2020application', 'Kim25-SafeMPD',
  ] },
  { id: 'simulation', name: 'Simulation & benchmarks', papers: [
    'Miao26-FalconTrack', 'Miao25-FalconGym', 'AAAIw2024', 'Tuck25', 'date2020application',
    'Khandait26-DiffTilt', 'tuncali2018experience', 'hoxha2014using', 'dokhanchi2018arch', 'dokhanchi2017arch',
  ] },
  { id: 'probstars', name: 'Probabilistic stars', papers: ['tran2023quantitative', 'HSCC2025-probstar', 'Li26', 'Tran25-CAV'] },
  { id: 'conformal', name: 'Conformal prediction', papers: ['zhao2023robust', 'Zhao25', 'Zhang25'] },
  { id: 'path-integrals', name: 'Path integral control', papers: ['Zhao26-STLMPPI', 'Majd25', 'Parwana25', 'MPPI2024', 'TSA2024'] },
  { id: 'security', name: 'Cyber-physical security', papers: ['ozmen2021discovering'] },
];
