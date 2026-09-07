'use client';

import { useState } from 'react';

export default function PublicationCitation({ bibtex }: { bibtex: string }) {
  const [status, setStatus] = useState('');
  async function copy() {
    try {
      await navigator.clipboard.writeText(bibtex);
      setStatus('Citation copied.');
    } catch {
      setStatus('Select the citation below to copy it.');
    }
  }
  return (
    <section aria-labelledby="citation-heading" className="mt-8">
      <div className="flex flex-wrap items-center gap-4 mb-3">
        <h2 id="citation-heading" className="text-xl font-bold font-heading">Citation</h2>
        <button type="button" onClick={copy} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">Copy BibTeX</button>
        <span role="status" className="text-sm text-slate-600 dark:text-slate-400">{status}</span>
      </div>
      <pre className="whitespace-pre-wrap break-words rounded-xl bg-slate-100 dark:bg-slate-900 p-4 text-xs leading-relaxed select-text"><code>{bibtex}</code></pre>
    </section>
  );
}
