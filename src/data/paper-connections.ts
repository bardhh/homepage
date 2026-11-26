// Read each label from the current paper toward its neighbor.
// Evidence locations refer to the linked publications in publications.bib.
interface PaperConnection {
  from: string;
  to: string;
  forward: string;
  reverse: string;
}

export const paperConnections: PaperConnection[] = [
  // STTT2024, introduction, discussion of preliminary work [5].
  {
    from: 'anderson2023pattern', to: 'STTT2024',
    forward: 'Extended with online matching in CARLA',
    reverse: 'Builds on the original perception-stream matcher',
  },
  // Zhao25, introduction and reference [1].
  {
    from: 'zhao2023robust', to: 'Zhao25',
    forward: 'Extended to multi-agent spatio-temporal requirements',
    reverse: 'Builds on robust conformal monitoring for STL',
  },
  // HSCC2025-probstar, section 3.1 and reference [34].
  {
    from: 'tran2023quantitative', to: 'HSCC2025-probstar',
    forward: 'Used to evaluate temporal logic over reachable sets',
    reverse: 'Uses the ProbStar probability calculation',
  },
  // Tran25-CAV, “ProbStar Reachability” [71] and “ProbStar Temporal Logic Verification” [70].
  {
    from: 'tran2023quantitative', to: 'Tran25-CAV',
    forward: 'Reachability algorithm implemented in StarV',
    reverse: 'Implements this ProbStar reachability algorithm',
  },
  {
    from: 'HSCC2025-probstar', to: 'Tran25-CAV',
    forward: 'Temporal logic implemented in StarV',
    reverse: 'Implements this temporal logic for ProbStar traces',
  },
];
