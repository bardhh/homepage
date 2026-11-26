const areas = [
  {
    title: 'Requirements-driven testing',
    question: 'How can a specification guide the search for experiments that expose failures and inform the next design revision?',
    filter: 'themes=testing',
  },
  {
    title: 'Verification of learning-enabled systems',
    question: 'Which behaviors can a learned component or closed-loop system exhibit, and which requirements hold across those behaviors?',
    filter: 'themes=learning,verification',
  },
  {
    title: 'Statistical guarantees and runtime monitoring',
    question: 'What can observations tell us about risk when the system state, its environment, or its model is uncertain?',
    filter: 'themes=risk,monitoring&match=any',
  },
  {
    title: 'Safe planning and control',
    question: 'How can safety requirements shape the decisions of a robot, a vehicle, or a team of agents?',
    filter: 'themes=planning',
  },
];

export default function ResearchAreas() {
  return (
    <section tabIndex={-1} id="research" aria-labelledby="research-title">
      <h2 id="research-title" className="profile-title mb-6">Research Areas</h2>
      <ul className="divide-y divide-[var(--edge)] border-y border-[var(--edge)]">
        {areas.map(area => (
          <li key={area.title} className="relative grid items-baseline gap-1.5 py-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-8 sm:py-5">
            <h3 className="text-base font-semibold leading-snug">
              <a href={`/?${area.filter}#publications`} aria-label={`View papers on ${area.title}`}
                className="after:absolute after:inset-0 hover:underline focus-visible:underline underline-offset-4">
                {area.title}<span className="whitespace-nowrap text-[var(--link)]" aria-hidden="true">&nbsp;→</span>
              </a>
            </h3>
            <p className="max-w-prose text-sm leading-relaxed text-[var(--muted)]">{area.question}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
