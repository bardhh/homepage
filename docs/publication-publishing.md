# Publication publishing

Edit only `public/publications.bib` to add or update a publication. The homepage,
archive, individual paper pages, metadata, and downloadable exports are generated
from that file during `npm run build`. Do not edit generated files in `out/`.

## Generated addresses

- `/publications/`: complete HTML archive, readable without JavaScript.
- `/publications/<citationKey>/`: one static page per BibTeX entry, including
  its authors, venue, year, type, resource links, citation, and ScholarlyArticle JSON-LD.
- `/publications.json`: all publication records, including absolute resource URLs
  and a BibTeX citation for each entry.
- `/publications.md`: the complete archive as Markdown.
- `/publications.bib`: the original source file, still directly downloadable.
- `/sitemap.xml`: homepage, archive, and every publication page.

The homepage retains its 15-card initial view and interactive filters. Titles open
the individual paper pages; the Paper/PDF icons still link directly to those resources.
The full-archive link uses a normal anchor, so opening the homepage does not prefetch
the archive or every paper page.

## Editing entries

Keep citation keys stable: they determine each paper's permanent URL. Keys must use
letters, numbers, underscores, or hyphens and must be unique ignoring case. Every
entry needs a title and author. A missing file or invalid key fails the build.

Use standard BibTeX `and` separators between authors. Both `First Last` and
`Last, First` names are supported, as are the older comma-separated full-name lists
already in this bibliography. Prefer `and` for new entries to avoid ambiguity.

Optional fields `abstract`, `doi`, `keywords`, `award`, `url`, `pdf`, `code`, and
`video` automatically appear in the relevant generated views. No abstracts or
publication dates are inferred. Existing type classification is shared with the
homepage: an accepted paper with a named venue keeps its type even if hosted on arXiv.
For preprints, explicitly use an arXiv/preprint venue until the entry is updated.

Relative asset links such as `papers/example.pdf` resolve from the site root in all
exports. No independent publication database or external metadata fetch is involved.

## Build and checks

Run `npm run lint`, `npm test`, and `npm run build` before publishing.
The build checks internal links and verifies all generated publication pages and
exports against the BibTeX source. The exported HTML must contain all archive
entries and each paper's metadata without running JavaScript; the homepage must
still initially render 15 cards.

The JSON and Markdown route handlers use `dynamic = 'force-static'` and produce
ordinary files in `out/`. They require no deployed API or server runtime. HTML pages
use directory indexes (`trailingSlash: true`) for static hosting and local previews.
