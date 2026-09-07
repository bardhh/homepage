# Homepage improvement plan

Updated September 7, 2026 after reviewing the local implementation.

## Current approved scope

Restore the original design and content. Keep only:

1. Accurate preprint labels and shareable publication filters.
2. Fixed broken links and improved keyboard navigation.
3. Automated internal-link checks.

## Restored

- Original header, background, portrait, typography, colors, translucent cards, spacing, and publication-card layout.
- Original Welcome text, committee history within the introduction, and section order.
- Original research cards, teaching accordion, sidebar, footer, and mobile menu appearance.
- Removed Selected Work and the separate Professional Service section and their supporting components.

## Retained implementation

- Preprints are classified separately from conference publications; accepted papers retain their venue classification even when hosted on arXiv.
- Paper-page and PDF destinations are distinguished using the original compact icon controls.
- Search, type, themes, and displayed count are stored in the URL (`q`, `type`, `themes`, `count`). Filters and pagination create history entries; typing replaces the current entry. Unrelated query parameters are preserved.
- Four unavailable legacy course links are removed; original course descriptions and accordion styling are retained.
- TLTk's stale code link points to the repository already listed in Software.
- Native section links work on the homepage and from the 404 page. Section targets accept programmatic focus.
- The mobile menu uses a native modal dialog with the original styling, Tab/Shift+Tab wrapping, Escape dismissal, focus restoration, and no closed-menu tab stops.
- Keyboard focus outlines and reduced-motion accommodations remain. Theme controls use the resolved theme.
- Production builds check local file and anchor targets in exported HTML and in the full bibliography, including publications hidden by pagination. PR checks also run lint and publication tests.

## Verification after restoring the design

- [x] Lint passes.
- [x] All 5 publication tests pass.
- [x] Production build and TypeScript pass.
- [x] Internal links: 174 references across 3 HTML pages and 87 bibliography entries pass.
- [x] Original layout and seven-section order confirmed in the browser; no Selected Work section remains.
- [x] Mobile menu focus wrapping, Escape restoration, and section focus pass.
- [x] Preprints: 8 results; journals: 14 results. Browser Back restores the preprint selection.
- [x] Unicode search for “Schön” restores its query and single result after reload.

Changes remain local and unpublished. Preview: http://127.0.0.1:4173/ while the preview server runs.

External destinations are not comprehensively crawled by the build check. The original Google Fonts build step requires network access.
