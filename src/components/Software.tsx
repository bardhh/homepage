import React from 'react';
import { FaCode, FaFilePdf, FaBlog, FaBook } from 'react-icons/fa';

interface Project {
  title: string;
  description: string;
  repo: string;
  link: string;
  blog?: string;
  docs?: string;
  paper: string | null;
  paperName: string | null;
  /** Short evidence of adoption or recognition, shown as a list under the description. */
  impact?: string[];
}


/** GitHub and citation figures in `impact` were read in November 2026. */
export const projects: Project[] = [
  {
    title: "CBFKit: A Control Barrier Function Toolbox",
    description: "Build advanced, safe robotic systems with CBFKit. Powered by JAX, this extensible Python/ROS2 toolbox integrates CBFs (including with MPPI!), supports diverse robots, controllers, sensors, and estimators.",
    repo: "bardhh/cbfkit",
    link: "https://github.com/bardhh/cbfkit",
    blog: "https://bardhh.github.io/cbfkit/",
    paper: "https://arxiv.org/abs/2404.07158",
    paperName: "IROS2024",
    impact: [
      'Published at IROS 2024',
      '116 GitHub stars',
    ],
  },
  {
    title: "STREM: Spatio-Temporal Pattern Matching over Perception Streams",
    description: "STREM is a Rust command-line tool that matches spatio-temporal patterns against annotated perception streams. Using Spatial Regular Expressions (SpREs), it combines regular-expression-style temporal patterns with spatial reasoning over bounding-box detections, making it possible to query large video and autonomous driving datasets for specific scenarios.",
    repo: "cps-atlas/strem",
    link: "https://github.com/cps-atlas/strem",
    docs: "https://cps-atlas.github.io/strem/",
    paper: "https://arxiv.org/abs/2411.05946",
    paperName: "STTT2024",
    impact: [
      'Best paper finalist at RV 2023',
      'Journal version in STTT 2024',
      'Granted US patent 12,361,086 B2',
    ],
  },
  {
    title: "RTAMT: Runtime Robustness Monitors for STL",
    description: "RTAMT is a Python library for monitoring Signal Temporal Logic (STL) specifications. It supports offline and online (real-time) monitoring with both discrete- and dense-time semantics and quantitative robustness degrees, making it well-suited for runtime verification of Cyber-Physical Systems and robotics.",
    repo: "nickovic/rtamt",
    link: "https://github.com/nickovic/rtamt",
    paper: "/papers/rtamt2023.pdf",
    paperName: "STTT2023",
    impact: [
      '83 GitHub stars, 32 forks',
      'Tool paper cited 40+ times',
    ],
  },
  {
    title: "TLTk: Parallel Robustness Computation for Temporal Logic",
    description: "TLTk is a Python toolbox for computing robustness of Metric Temporal Logic (MTL) and Signal Temporal Logic (STL) specifications. It enables parallel robustness computation, making it well-suited for runtime verification and falsification-based testing of Cyber-Physical Systems.",
    repo: "versyslab/tltk",
    link: "https://bitbucket.org/versyslab/tltk/src/master/",
    paper: "/papers/RV2020.pdf",
    paperName: "RV2020",
    impact: [
      'Tool paper at RV 2020',
    ],
  },
  {
    title: "S-TaLiRo: Toolbox for Testing and Verification of CPS",
    description: "S-TaLiRo is a toolbox for Matlab/Simulink that supports testing and verification of hybrid and continuous Cyber-Physical Systems using Metric Temporal Logic (MTL). Widely used in automotive and medical domains.",
    repo: "s-taliro/s-taliro",
    link: "https://sites.google.com/a/asu.edu/s-taliro/s-taliro",
    paper: "/papers/DIFTS2014.pdf",
    paperName: "DIFTS2014",
    impact: [
      'Benchmarks used in the ARCH-COMP falsification competition',
      'Benchmark paper cited 160+ times',
      'Applied to industrial-size automotive models and the UxAS autonomy software',
    ],
  },
  {
    title: "VERITEX: Deep Neural Network Verification",
    description: "Veritex is a Python toolbox for verification and automated repair of Deep Neural Networks, supporting both exact and over-approximate analysis of reachable outputs.",
    repo: "Shaddadi/veritex",
    link: "https://github.com/Shaddadi/veritex",
    paper: null,
    paperName: null,
    impact: ['Best Software Artifact Award at FORMATS 2022', 'Repair paper cited 60+ times'],
  },
  {
    title: "NDF-CoRoCo: Cooperative Perception",
    description: "Companion codebase for the paper 'NDF-CoRoCo: Cooperative Perception and Recognition Using Neural Density Fields'. Focuses on cooperative perception using Neural Density Fields for robotics applications.",
    repo: "cps-atlas/ndf-coroco",
    link: "https://github.com/cps-atlas/ndf-coroco",
    paper: "https://arxiv.org/abs/2404.16704",
    paperName: "arXiv Paper"
  }
];

const resourceLink = "inline-flex min-h-7 items-center gap-1.5 rounded-sm text-xs font-medium text-blue-700 underline-offset-4 hover:underline dark:text-blue-300";

const Software = () => {
  return (
    <section tabIndex={-1} id="software" className="scroll-mt-24" role="region" aria-label="Software projects">
      <div className="flex items-center mb-5">
        <div className="h-10 w-1 bg-blue-500 rounded-full mr-4"></div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
          Software
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {projects.map((project) => (
          <div key={project.repo} className="glass-card rounded-lg px-4 py-3">
            <h3 className="text-base font-semibold leading-5 text-slate-900 dark:text-slate-100">
              {project.title}
            </h3>
            <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
              {project.description}
            </p>

            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              <a href={project.link} target="_blank" rel="noopener noreferrer" className={resourceLink}>
                <FaCode aria-hidden="true" /> Repository
              </a>

              {project.blog && (
                <a href={project.blog} target="_blank" rel="noopener noreferrer" className={resourceLink}>
                  <FaBlog aria-hidden="true" /> Blog
                </a>
              )}

              {project.docs && (
                <a href={project.docs} target="_blank" rel="noopener noreferrer" className={resourceLink}>
                  <FaBook aria-hidden="true" /> Docs
                </a>
              )}

              {project.paper && (
                <a href={project.paper} target="_blank" rel="noopener noreferrer" className={resourceLink}>
                  <FaFilePdf aria-hidden="true" /> {project.paperName}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Software;
