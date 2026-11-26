'use client';

import { useRef, useState } from 'react';

const actionClass = 'min-h-9 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline underline-offset-4';

export default function PublicationCitation({ bibtex, paperUrl }: { bibtex: string; paperUrl: string }) {
  const [status, setStatus] = useState('');
  const [showUrl, setShowUrl] = useState(false);
  const details = useRef<HTMLDetailsElement>(null);
  async function copy(kind: 'link' | 'citation') {
    try {
      await navigator.clipboard.writeText(kind === 'link' ? paperUrl : bibtex);
      setShowUrl(false);
      setStatus(kind === 'link' ? 'Paper link copied.' : 'Citation copied.');
    } catch {
      setShowUrl(kind === 'link');
      if (kind === 'citation' && details.current) details.current.open = true;
      setStatus(kind === 'link' ? 'Select the link below to copy it.' : 'Select the citation below to copy it.');
    }
  }
  return (
    <section aria-labelledby="citation-heading" className="mt-8">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
        <h2 id="citation-heading" className="text-xl font-bold font-heading">Citation</h2>
        <button type="button" onClick={() => copy('citation')} className={actionClass}>Copy BibTeX</button>
        <button type="button" onClick={() => copy('link')} className={actionClass}>Copy paper link</button>
        <span role="status" className="text-sm text-slate-600 dark:text-slate-400">{status}</span>
      </div>
      {showUrl && <input aria-label="Permanent paper link" readOnly value={paperUrl}
        onFocus={event => event.currentTarget.select()}
        className="mb-3 w-full rounded border border-[var(--edge)] bg-transparent p-2 text-sm" />}
      <details ref={details}>
        <summary className="w-fit cursor-pointer text-sm font-medium text-[var(--muted)] hover:underline">View BibTeX</summary>
        <pre className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-slate-100 dark:bg-slate-900 p-4 text-xs leading-relaxed select-text"><code>{bibtex}</code></pre>
      </details>
    </section>
  );
}
