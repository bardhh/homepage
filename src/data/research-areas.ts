export const researchAreas = [
  {
    title: 'Requirements-driven testing',
    result: 'In S-TaLiRo, we used the distance from a requirement violation to guide the search for failures in simulated automotive systems.',
    filter: 'themes=testing',
    paper: 'fainekos2019robustness',
    reason: 'A single measure of how closely a trajectory satisfies a requirement connects three uses of S-TaLiRo.',
    summary: 'A temporal logic requirement can assign a robustness value to a trajectory, measuring how closely the behavior approaches a violation. This tutorial shows how S-TaLiRo uses that value to search for counterexamples, infer specification parameters, and monitor signals.',
  },
  {
    title: 'Verification of learning-enabled systems',
    result: 'We identified aircraft encounters that triggered unsafe neural network advisories, used them to guide repairs, and verified the revised networks.',
    filter: 'themes=learning,verification',
    paper: 'yang2022neural',
    reason: 'This paper follows a failed safety check through to a change in the neural controller.',
    summary: 'Reachability analysis identifies regions of the input domain where a neural network violates a safety property. The repair algorithm draws training examples from those regions and checks the revised network against the specification. The paper studies aircraft collision avoidance and rocket landing controllers.',
  },
  {
    title: 'Statistical guarantees and runtime monitoring',
    result: 'We derived statistical bounds on the safety margin of a predicted trajectory that remain valid under a bounded shift in operating conditions.',
    filter: 'themes=risk,monitoring&match=any',
    paper: 'zhao2023robust',
    reason: 'This paper makes the assumptions behind a statistical runtime guarantee explicit.',
    summary: 'A predictor calibrated on simulated trajectories may encounter a different distribution after deployment. Given an upper bound on that shift, the method uses robust conformal prediction to bound the future robustness of a signal temporal logic requirement at a chosen confidence level.',
  },
  {
    title: 'Safe planning and control',
    result: 'We built a diffusion planner that steers a simulated tractor-trailer around obstacles while keeping the trailer from jackknifing.',
    filter: 'themes=planning',
    paper: 'Kim25-SafeMPD',
    reason: 'A safety shield enforces the vehicle’s motion and safety constraints as the planner generates each trajectory.',
    summary: 'Safe Model Predictive Diffusion uses a safety shield at each denoising step to keep candidate trajectories feasible under the vehicle dynamics. In tractor-trailer simulations, the planner found collision-free maneuvers that also respected the articulation limits between tractor and trailer.',
  },
];
