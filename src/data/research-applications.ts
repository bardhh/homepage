// Applications are systems studied in a paper's experiments, data, or case studies.
// Citation keys also link each assignment to the paper from the map inspector.
export const researchApplications = [
  {
    id: 'autonomous-driving', name: 'Autonomous driving', description: 'Perception from driving footage, scenario testing, and verification of vehicle controllers.',
    papers: [
      'AAAIw2024', 'Hoxha26-VisionRTM', 'hekmatnejad2022formalizing', 'STTT2024',
      'anderson2023pattern', 'bogomolov2022runtime', 'date2020application',
      'hekmatnejad2020search', 'HSCC2025-probstar', 'Tran25-CAV', 'yang2023safe',
    ],
  },
  {
    id: 'quadrotors', name: 'Quadrotors', description: 'Flight safety requirements, visual navigation, tracking, and constrained flight control.',
    papers: ['Miao25-FalconGym', 'Miao26-FalconTrack', 'Parwana25', 'Zhao26-STLMPPI', 'hoxha2015vispec'],
  },
  { id: 'tractor-trailers', name: 'Tractor-trailers', description: 'Motion planning and parking for articulated vehicles under safety and maneuverability constraints.', papers: ['Majd25', 'Kim25-SafeMPD'] },
  {
    id: 'mobile-robots', name: 'Mobile robots', description: 'Navigation, collision avoidance, and fault localization for mobile robots.',
    papers: ['Yamaguchi25', 'IROS2024', 'MPPI2024', 'Zhang25', 'Hoxha26-BRACBF', 'nishitani2023checkmate',
      'yamaguchi2020specification', 'majd2021safe', 'parwana2025feasible', 'Tuck25', 'Wang25', 'Zhao26-STLMPPI'],
  },
  { id: 'continuum-robots', name: 'Continuum robots', description: 'Modeling the distance to obstacles for control of a continuously bending robot.', papers: ['IROS2025'] },
  { id: 'iot', name: 'IoT deployments', description: 'Security of connected devices that influence one another through their physical environment.', papers: ['ozmen2021discovering'] },
];
