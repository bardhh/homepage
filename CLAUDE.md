# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start development server
- `npm run build` — Production build (static export to `out/`)
- `npm run lint` — Run ESLint
- No test framework is configured

## Architecture

Static academic portfolio for bhoxha.com built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4. Deployed as a static export to Azure Static Web Apps.

### Critical Constraints

- **Static export only** (`output: "export"` in next.config.ts). No server-side features: no API routes, no ISR, no server actions, no `next/image` optimization. These settings are load-bearing for the Azure SWA deployment.
- **No Framer Motion or animation libraries.** All animations use CSS transitions + IntersectionObserver (`Reveal.tsx`). Framer Motion was intentionally removed for ~130 KB savings. Do not re-introduce it.
- **Mobile performance budget.** Backdrop-blur and heavy animations are disabled below 768px via media queries.

### Data Flow

`page.tsx` reads `public/publications.bib` at build time via `fs.promises.readFile()`, parses it with `bibtex-parse-js`, and passes the result to the client-side `<Publications>` component (lazy-loaded via `next/dynamic`). All other section content (Research, Teaching, Software, Contact) is hardcoded in their respective components.

### Key Directories

- `src/app/` — App Router pages, layout, providers, SEO (robots.ts, sitemap.ts)
- `src/components/` — All UI components; most are server components, interactive ones use `'use client'`
- `src/lib/bibtex.ts` — BibTeX parsing utilities
- `public/publications.bib` — Publication data source (BibTeX format)
- `public/papers/` — PDF files for publications

### Styling

Tailwind CSS 4 with `@import "tailwindcss"` syntax. Custom utilities (`.glass`, `.glass-card`, `.text-gradient`) and animations (`fade-in`, `fade-in-up`) defined in `globals.css`. Dark mode via `class` strategy with `next-themes`. Fonts: Inter (body) and Poppins (headings, weights 400/700 only).

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

### Deployment

Auto-deploys from `master` via GitHub Actions to Azure Static Web Apps. PRs run build-only verification.
