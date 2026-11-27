# Publication publishing

Use `public/publications.bib` for the publication record. The homepage search,
archive, paper page, CV and its PDF, timeline years, metadata, and downloadable
exports derive from it. Research-map groupings and documented connections are
curated separately by citation key. Edit the sources and regenerate `out/`.

## Generated addresses

- `/publications/`: complete HTML archive, readable without JavaScript.
- `/publications/<citationKey>/`: one static page per BibTeX entry, including
  its authors, venue, year, type, resource links, citation, and ScholarlyArticle JSON-LD.
- `/publications.json`: all publication records, including absolute resource URLs
  and a BibTeX citation for each entry.
- `/publications.md`: the complete archive as Markdown.
- `/publications.bib`: the original source file, still directly downloadable.
- `/sitemap.xml`: homepage, archive, and every publication page.

The homepage initially shows up to five papers. Older entries are available through
search or the full archive. The research map supports direct links of the form
`/research-map/?paper=<citationKey>`.

## Editing entries

Search the bibliography for the DOI, arXiv ID, and distinctive title words. When a
preprint is accepted, update the same entry and retain its citation key, including
capitalization. A distinct conference paper and a journal extension may each have
their own record. Citation keys form permanent URLs and must match
`[A-Za-z0-9_-]+` and be unique ignoring case.

Check title, author order and spelling, venue, year, and publication status against
the supplied paper, publisher record, or arXiv entry. Use `booktitle` for a
conference and `journal` for a journal. Use verified publication or posting data
for the year. A submission target alone does not establish acceptance.

Use standard BibTeX `and` separators between authors. Both `First Last` and
`Last, First` names are supported, as are the older comma-separated full-name lists
already in this bibliography. Prefer `and` for new entries to avoid ambiguity.

Optional fields `abstract`, `doi`, `keywords`, `award`, `url`, `pdf`, `website`
(project page or blog post), `code`, and `video` automatically appear in the
relevant generated views. No abstracts or
publication dates are inferred. Existing type classification is shared with the
homepage: an accepted paper with a named venue keeps its type even if hosted on arXiv.
For preprints, explicitly use an arXiv/preprint venue until the entry is updated.

For a local PDF, place the file in `public/papers/` and use a site-relative link
such as `papers/example.pdf`. For an arXiv paper, its abstract-page URL also
generates a PDF link. Homepage theme filters match text in BibTeX `keywords`
against learning, planning, verification, testing, risk, and monitoring. Include
the applicable terms.

## Research map and related features

| Review for a new paper | When to edit |
| --- | --- |
| `src/data/research-concepts.ts` | Add the exact key to the existing concepts the paper studies. These assignments drive the network and shared-concept suggestions on paper pages. BibTeX keywords do not populate them. |
| `src/data/research-applications.ts` | Add the key for a system used in experiments, data, or a case study, such as a quadrotor or tractor-trailer. A possible future application is insufficient. |
| `src/data/paper-connections.ts` | Add an edge when a source documents a specific extension, implementation, or reuse. Write both directional labels and note the supporting section or citation in a nearby comment. Shared concepts already generate related papers when no direct edge is warranted. |

The bibliography supplies the paper node and its timeline year automatically.
For an example, `Kim25-SafeMPD` appears in the tractor-trailer application and
the planning research area. An ordinary planning paper can join the relevant
map groups without replacing that featured paper.

Update `src/data/research-areas.ts` only when changing a featured example, and
`src/data/perception-reading-path.ts` when changing the curated reading sequence.
If a paper is the reference for a software project or worked example, check that
project’s `paperKey` in `src/components/Software.tsx`. A BibTeX `award`
feeds Honors and the CV. Existing residents’ Papers links use author matching.
CV publication counts are computed; Scholar citation metrics in
`src/data/profile.ts` need a separate dated source.

## Build and checks

Run `npm run lint`, `npm test`, and `npm run build` before publishing.
The build checks internal links and verifies all generated publication pages and
exports against the BibTeX source. The exported HTML must contain all archive
entries and each paper’s metadata without running JavaScript. Spot-check the new
paper at `/publications/<citationKey>/` and `/research-map/?paper=<citationKey>`.
Verify the intended labels, neighbors and timeline year, and open the paper or PDF
link. The build checks known map keys and internal links but cannot verify the
scientific meaning of a connection or the destination of an external link.

The JSON and Markdown route handlers use `dynamic = 'force-static'` and produce
ordinary files in `out/`. They require no deployed API or server runtime. HTML pages
use directory indexes (`trailingSlash: true`) for static hosting and local previews.
