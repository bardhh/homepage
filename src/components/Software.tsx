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
  homepageNote?: string;
}


/** GitHub and citation figures in `impact` were read in November 2026. */
export const projects: Project[] = [
  {
    title: "CBFKit: A Control Barrier Function Toolbox",
    description: "Design and simulate robot controllers with control barrier functions in Python, then run them with ROS 2.",
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
    description: "Search annotated video for sequences of spatial events using regular expressions.",
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
    description: "Monitor a signal as it arrives and measure how closely it satisfies a Signal Temporal Logic specification.",
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
    description: "Compute temporal logic robustness in parallel across recorded signals to evaluate test runs.",
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
    description: "Search MATLAB and Simulink models for trajectories that violate a temporal logic requirement.",
    homepageNote: "Its falsification benchmarks have been used in ARCH-COMP.",
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
    description: "Compute the reachable outputs of a neural network and use the resulting sets to guide repairs.",
    repo: "Shaddadi/veritex",
    link: "https://github.com/Shaddadi/veritex",
    paper: null,
    paperName: null,
    impact: ['Best Software Artifact Award at FORMATS 2022', 'Repair paper cited 60+ times'],
  },
  {
    title: "NDF-CoRoCo: Cooperative Perception",
    description: "Use neural density fields to combine observations from multiple agents for cooperative perception and recognition.",
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

        <h2 className="profile-title">
          Software
        </h2>
      </div>

      <div className="@container grid grid-cols-1 gap-2">
        {projects.map((project) => (
          <div key={project.repo} className="glass-card rounded-lg px-4 py-2.5 @min-[44rem]:grid @min-[44rem]:grid-cols-[minmax(0,1fr)_auto] @min-[44rem]:items-center @min-[44rem]:gap-x-5">
            <div>
              <h3 className="text-base font-semibold leading-5 text-slate-900 dark:text-slate-100">
                {project.title}
              </h3>
              <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
                {project.description}{project.homepageNote && <> {project.homepageNote}</>}
              </p>
            </div>

            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 @min-[44rem]:mt-0">
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
