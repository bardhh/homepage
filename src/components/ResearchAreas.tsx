import React from 'react';
import { FaShieldAlt, FaRobot, FaBrain, FaNetworkWired } from 'react-icons/fa';

const areas = [
  {
    icon: FaShieldAlt,
    title: "Safe Learning-Based Control",
    subtitle: "Control Theory + Machine Learning",
    description: "Developing methods that combine the performance of learning-based controllers (like Neural Networks) with the safety guarantees of formal control theory.",
    color: "blue",
    headerClass: "bg-blue-600 text-white",
    subtitleClass: "text-blue-100",
    iconBgClass: "bg-white/20",
    tagClass: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-200/50 dark:border-blue-500/20",
    tags: ["Control Barrier Functions", "Neural Lyapunov", "Safe RL"],
  },
  {
    icon: FaRobot,
    title: "Autonomous Systems",
    subtitle: "Multi-Agent Systems",
    description: "Designing algorithms for coordination, planning, and control of multiple autonomous agents in complex, dynamic environments.",
    color: "amber",
    headerClass: "bg-amber-400 text-slate-900",
    subtitleClass: "text-slate-800/80",
    iconBgClass: "bg-black/10",
    tagClass: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border border-amber-200/50 dark:border-amber-500/20",
    tags: ["Multi-Robot Planning", "Decentralized Control", "Swarm Robotics"],
  },
  {
    icon: FaBrain,
    title: "Formal Methods",
    subtitle: "Verification & Synthesis",
    description: "Applying rigorous mathematical techniques to specify, develop, and verify software and hardware systems.",
    color: "emerald",
    headerClass: "bg-emerald-500 text-white",
    subtitleClass: "text-emerald-100",
    iconBgClass: "bg-white/20",
    tagClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-500/20",
    tags: ["Temporal Logic", "Reachability Analysis", "Falsification"],
  },
  {
    icon: FaNetworkWired,
    title: "Runtime Monitoring",
    subtitle: "System Health & Safety",
    description: "Techniques for observing system behavior during execution to detect violations of safety properties or performance requirements.",
    color: "purple",
    headerClass: "bg-purple-600 text-white",
    subtitleClass: "text-purple-100",
    iconBgClass: "bg-white/20",
    tagClass: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300 border border-purple-200/50 dark:border-purple-500/20",
    tags: ["Signal Temporal Logic", "Online Verification", "Predictive Monitoring"],
  },
];

const ResearchAreas = () => {
  return (
    <section id="research" className="scroll-mt-24" role="region" aria-label="Research areas">
      <div className="flex items-center mb-8">
        <div className="h-10 w-1 bg-blue-500 rounded-full mr-4"></div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
          Research Areas
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {areas.map((area) => {
          const Icon = area.icon;
          return (
            <div key={area.title} className="glass-card rounded-2xl overflow-hidden group">
              <div className={`${area.headerClass} p-4 flex items-center relative overflow-hidden`}>
                {/* Decorative background circle */}
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" aria-hidden="true" />
                <div className="absolute -right-2 -bottom-8 w-16 h-16 rounded-full bg-white/5" aria-hidden="true" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className={`${area.iconBgClass} p-2.5 rounded-xl`}>
                    <Icon className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">{area.title}</h3>
                    <p className={`${area.subtitleClass} text-sm`}>{area.subtitle}</p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                  {area.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {area.tags.map((tag) => (
                    <span key={tag} className={`px-2.5 py-1 text-xs rounded-full font-medium ${area.tagClass}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ResearchAreas;
