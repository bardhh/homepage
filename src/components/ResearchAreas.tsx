import React from 'react';

const areas = [
  {
    title: "Safe Learning-Based Control",
    theme: "learning",
    subtitle: "Control Theory + Machine Learning",
    description: "Developing methods that combine the performance of learning-based controllers (like Neural Networks) with the safety guarantees of formal control theory.",
    tags: ["Control Barrier Functions", "Neural Lyapunov", "Safe RL"],
  },
  {
    title: "Autonomous Systems",
    theme: "planning",
    subtitle: "Multi-Agent Systems",
    description: "Designing algorithms for coordination, planning, and control of multiple autonomous agents in complex, dynamic environments.",
    tags: ["Multi-Robot Planning", "Decentralized Control", "Swarm Robotics"],
  },
  {
    title: "Formal Methods",
    theme: "verification",
    subtitle: "Verification & Synthesis",
    description: "Applying rigorous mathematical techniques to specify, develop, and verify software and hardware systems.",
    tags: ["Temporal Logic", "Reachability Analysis", "Falsification"],
  },
  {
    title: "Runtime Monitoring",
    theme: "monitoring",
    subtitle: "System Health & Safety",
    description: "Techniques for observing system behavior during execution to detect violations of safety properties or performance requirements.",
    tags: ["Signal Temporal Logic", "Online Verification", "Predictive Monitoring"],
  },
];

const ResearchAreas = () => {
  return (
    <section tabIndex={-1} id="research" className="scroll-mt-24" role="region" aria-label="Research areas">
      <div className="flex items-center mb-8">
        <div className="h-10 w-1 bg-blue-500 rounded-full mr-4"></div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
          Research Areas
        </h2>
      </div>

      <ul className="divide-y divide-slate-300/70 border-y border-slate-300/70 dark:divide-slate-700/60 dark:border-slate-700/60">
        {areas.map((area) => (
          <li key={area.title} className="group relative grid gap-3 py-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-8">
            <div>
              <h3 className="font-heading text-lg font-semibold leading-snug text-slate-900 dark:text-slate-100">
                <a
                  href={`/?themes=${area.theme}#publications`}
                  aria-label={`View publications on ${area.title}`}
                  className="after:absolute after:inset-0 group-hover:underline focus-visible:underline underline-offset-4"
                >
                  {area.title}<span aria-hidden="true" className="ml-1.5 inline-block text-sm text-slate-500 dark:text-slate-400">→</span>
                </a>
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{area.subtitle}</p>
            </div>
            <div>
              <p className="max-w-prose text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {area.description}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {area.tags.join(' · ')}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ResearchAreas;
