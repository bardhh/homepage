import React from 'react';
import { FaGithub, FaFilePdf, FaExternalLinkAlt } from 'react-icons/fa';

const projects = [
  {
    title: "CBFKit: A Control Barrier Function Toolbox",
    description: "Build advanced, safe robotic systems with CBFKit. Powered by JAX, this extensible Python/ROS2 toolbox integrates CBFs (including with MPPI!), supports diverse robots, controllers, sensors, and estimators.",
    repo: "bardhh/cbfkit",
    link: "https://github.com/bardhh/cbfkit",
    paper: "https://arxiv.org/abs/2404.07158",
    paperName: "IROS2024"
  },
  {
    title: "TLTk: Parallel Robustness Computation for Temporal Logic",
    description: "TLTk is a Python toolbox for computing robustness of Metric Temporal Logic (MTL) and Signal Temporal Logic (STL) specifications. It enables parallel robustness computation, making it well-suited for runtime verification and falsification-based testing of Cyber-Physical Systems.",
    repo: "versyslab/tltk",
    link: "https://bitbucket.org/versyslab/tltk/src/master/",
    paper: "/papers/RV2020.pdf",
    paperName: "RV2020"
  },
  {
    title: "S-TaLiRo: Toolbox for Testing and Verification of CPS",
    description: "S-TaLiRo is a toolbox for Matlab/Simulink that supports testing and verification of hybrid and continuous Cyber-Physical Systems using Metric Temporal Logic (MTL). Widely used in automotive and medical domains.",
    repo: "s-taliro/s-taliro",
    link: "https://sites.google.com/a/asu.edu/s-taliro/s-taliro",
    paper: "/papers/DIFTS2014.pdf",
    paperName: "DIFTS2014"
  },
  {
    title: "VERITEX: Deep Neural Network Verification",
    description: "Veritex is a Python toolbox for verification and automated repair of Deep Neural Networks, supporting both exact and over-approximate analysis of reachable outputs.",
    repo: "Shaddadi/veritex",
    link: "https://github.com/Shaddadi/veritex",
    paper: null,
    paperName: null
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

const Software = () => {
  return (
    <section id="software" className="scroll-mt-24" role="region" aria-label="Software projects">
      <div className="flex items-center mb-8">
        <div className="h-10 w-1 bg-blue-500 rounded-full mr-4"></div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
          Software
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden group">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-white transition-all transform hover:-translate-y-0.5">
                <FaGithub className="mr-1.5" /> Repository <FaExternalLinkAlt className="ml-1.5 text-[0.6em] opacity-50" />
              </a>

              {project.paper && (
                <a href={project.paper} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-white transition-all transform hover:-translate-y-0.5">
                  <FaFilePdf className="mr-1.5" /> {project.paperName} <FaExternalLinkAlt className="ml-1.5 text-[0.6em] opacity-50" />
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
