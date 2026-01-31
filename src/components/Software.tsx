import React from 'react';
import { FaGithub, FaFilePdf } from 'react-icons/fa';

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
    <section id="software" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6 border-l-4 border-blue-500 pl-4">
        Software
      </h2>
      
      <div className="grid grid-cols-1 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
              {project.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm leading-relaxed">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-3">
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600">
                <FaGithub className="mr-2" /> Repository
              </a>
              
              {project.paper && (
                <a href={project.paper} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 bg-white rounded-md hover:bg-slate-50 dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-slate-600">
                  <FaFilePdf className="mr-2" /> {project.paperName}
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
