export const researchAreas = [
  {
    title: 'Requirements-driven testing',
    question: 'How can a specification guide the search for experiments that expose failures and inform the next design revision?',
    filter: 'themes=testing',
    paper: 'fainekos2019robustness',
    reason: 'A single measure of how closely a trajectory satisfies a requirement connects three uses of S-TaLiRo.',
    summary: 'A temporal logic requirement can assign a robustness value to a trajectory, measuring how closely the behavior approaches a violation. This tutorial shows how S-TaLiRo uses that value to search for counterexamples, infer specification parameters, and monitor signals.',
  },
  {
    title: 'Verification of learning-enabled systems',
    question: 'Which behaviors can a learned component or closed-loop system exhibit, and which requirements hold across those behaviors?',
    filter: 'themes=learning,verification',
    paper: 'yang2022neural',
    reason: 'This paper follows a failed safety check through to a change in the neural controller.',
    summary: 'Reachability analysis identifies regions of the input domain where a neural network violates a safety property. The repair algorithm draws training examples from those regions and checks the revised network against the specification. The paper studies aircraft collision avoidance and rocket landing controllers.',
  },
  {
    title: 'Statistical guarantees and runtime monitoring',
    question: 'What can observations tell us about risk when the system state, its environment, or its model is uncertain?',
    filter: 'themes=risk,monitoring&match=any',
    paper: 'zhao2023robust',
    reason: 'This paper makes the assumptions behind a statistical runtime guarantee explicit.',
    summary: 'A predictor calibrated on simulated trajectories may encounter a different distribution after deployment. Given an upper bound on that shift, the method uses robust conformal prediction to bound the future robustness of a signal temporal logic requirement at a chosen confidence level.',
  },
  {
    title: 'Safe planning and control',
    question: 'How can safety requirements shape the decisions of a robot, a vehicle, or a team of agents?',
    filter: 'themes=planning',
    paper: 'IROS2024',
    reason: 'CBFKit shows how a safety constraint enters the control loop of a physical robot.',
    summary: 'CBFKit translates safety requirements expressed as control barrier functions into constraints on robot commands. Its Python and ROS tools support deterministic and stochastic dynamics. The paper demonstrates the approach on a Toyota Human Support Robot in simulation and in physical experiments.',
  },
];
