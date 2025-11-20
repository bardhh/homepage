import React from 'react';
import { FaShieldAlt, FaRobot, FaBrain, FaNetworkWired, FaChevronDown } from 'react-icons/fa';

const ResearchAreas = () => {
  return (
    <section id="research" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6 border-l-4 border-blue-500 pl-4">
        Research Areas
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Safe Learning-Based Control */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
          <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-2xl" />
              <div>
                <h3 className="font-semibold text-lg leading-tight">Safe Learning-Based Control</h3>
                <p className="text-blue-100 text-sm">Control Theory + Machine Learning</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
              Developing methods that combine the performance of learning-based controllers (like Neural Networks) with the safety guarantees of formal control theory.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">Control Barrier Functions</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">Neural Lyapunov</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">Safe RL</span>
            </div>
          </div>
        </div>

        {/* Autonomous Systems */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
          <div className="bg-amber-400 p-4 text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaRobot className="text-2xl" />
              <div>
                <h3 className="font-semibold text-lg leading-tight">Autonomous Systems</h3>
                <p className="text-slate-800/80 text-sm">Multi-Agent Systems</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
              Designing algorithms for coordination, planning, and control of multiple autonomous agents in complex, dynamic environments.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">Multi-Robot Planning</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">Decentralized Control</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">Swarm Robotics</span>
            </div>
          </div>
        </div>

        {/* Formal Methods */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
          <div className="bg-emerald-500 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaBrain className="text-2xl" />
              <div>
                <h3 className="font-semibold text-lg leading-tight">Formal Methods</h3>
                <p className="text-emerald-100 text-sm">Verification & Synthesis</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
              Applying rigorous mathematical techniques to specify, develop, and verify software and hardware systems.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">Temporal Logic</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">Reachability Analysis</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">Falsification</span>
            </div>
          </div>
        </div>

        {/* Runtime Monitoring */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
          <div className="bg-purple-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaNetworkWired className="text-2xl" />
              <div>
                <h3 className="font-semibold text-lg leading-tight">Runtime Monitoring</h3>
                <p className="text-purple-100 text-sm">System Health & Safety</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
              Techniques for observing system behavior during execution to detect violations of safety properties or performance requirements.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">Signal Temporal Logic</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">Online Verification</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">Predictive Monitoring</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ResearchAreas;
