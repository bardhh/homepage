export const publicationLinkClass = 'font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline';

export default function PublicationResources() {
  return (
    <nav aria-label="Publication downloads" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
      <a href="/publications.bib" className={publicationLinkClass}>BibTeX</a>
      <a href="/publications.md" className={publicationLinkClass}>Markdown</a>
      <a href="/publications.json" className={publicationLinkClass}>JSON</a>
    </nav>
  );
}
