import { researchAreas } from '@/data/research-areas';

export default function ResearchAreas() {
  return (
    <section tabIndex={-1} id="research" aria-labelledby="research-title">
      <h2 id="research-title" className="profile-title mb-6">Research Areas</h2>
      <ul className="divide-y divide-[var(--edge)] border-y border-[var(--edge)]">
        {researchAreas.map(area => (
          <li key={area.title} className="relative grid items-baseline gap-1.5 py-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-8 sm:py-5">
            <h3 className="text-base font-semibold leading-snug">
              <a href={`/?${area.filter}&start=${area.paper}#publications`} aria-label={`View papers on ${area.title}`}
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
