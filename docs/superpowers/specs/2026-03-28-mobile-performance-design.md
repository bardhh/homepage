# Mobile Performance Optimization — Design Spec

**Date:** 2026-03-28
**Baseline:** Mobile Lighthouse Performance score 72 (PageSpeed Insights, Mar 28 2026)
**Target:** 85–90
**Strategy:** Remove Framer Motion, reduce CSS weight on mobile, trim font loads (Option B — reduce animations on mobile, preserve desktop experience)

## Context

The homepage is a Next.js 16 static export (`output: "export"`) deployed to Azure Static Web Apps. The current mobile performance score of 72 is driven by:

| Metric | Current | Target | Root Cause |
|--------|---------|--------|------------|
| FCP | 2.9s | ~2.2s | Render-blocking CSS, 5 font file preloads |
| LCP | 4.9s | ~3.5s | Main-thread contention from JS parsing |
| TBT | 170ms | ~80ms | ~130 KB Framer Motion bundle + scroll listeners |
| Speed Index | 5.2s | ~3.5s | Slow paint + animations blocking visual completeness |
| CLS | 0 | 0 | No change needed |

## Constraints

- **Static export stays.** `output: "export"` and `images: { unoptimized: true }` in `next.config.ts` are load-bearing — Next.js image optimization is not supported with static export. Do not change these.
- **Desktop UX unchanged.** All current animations, backdrop-blur effects, and visual richness remain on desktop viewports.
- **SEO preserved.** Publications HTML must remain in the static export for indexing. Any lazy-loading must use `ssr: true` so content renders at build time.

## Changes

### 1. Remove Framer Motion, Replace with CSS + IntersectionObserver

Framer Motion (`framer-motion@^12.23.24`, ~130 KB) is used in three components for simple opacity + translateY animations. All three get bounded rewrites to CSS equivalents, then the dependency is removed from `package.json`.

#### 1a. Reveal.tsx

**Current:** `motion.div` + `useInView` from Framer Motion. Scroll-triggered fade + slide up, `once: true`, `margin: "-50px 0px"`.

**New:** Vanilla `IntersectionObserver` toggles a CSS class.

Behavior:
- Component renders with class `reveal` (invisible: `opacity: 0; transform: translateY(30px)`)
- `IntersectionObserver` fires once (same margin), adds class `visible`
- Desktop (`width >= 768px`): `transition: opacity 0.5s ease-out, transform 0.5s ease-out` — same timing as current
- Mobile (`width < 768px`): no transition, content visible immediately (or a very brief 0.15s fade if instant feels jarring)
- The existing `delay` prop (used as `delay={0.1}` on most sections in `page.tsx`) maps to `transition-delay` on the element's inline style, desktop only. Mobile ignores it.
- Stays `"use client"` (needs DOM API for IntersectionObserver)

#### 1b. PageTransition.tsx

**Current:** `motion.div` wrapping `{children}` with fade + slide on mount and exit.

**New:** A div that applies a CSS animation class on mount via `useEffect` + `useState`.

Behavior:
- On mount, a state flag flips and a CSS class is applied
- Desktop (`width >= 768px`): `animation: page-enter 0.4s ease-in-out` (`@keyframes page-enter { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }`)
- Mobile (`width < 768px`): no animation, content renders immediately
- Exit animation dropped — it only fired on route changes, and this is a single-page static site

#### 1c. Publications.tsx

**Current:** `AnimatePresence` with `mode="popLayout"` + `motion.div` per list item, `layout` prop for reflow animation, staggered enter/exit.

**New:** CSS transitions on each publication card.

Behavior:
- Each card gets `transition: opacity 0.3s ease-out, transform 0.3s ease-out`
- Staggered `transition-delay` via inline style: `style={{ transitionDelay: \`${Math.min(index * 0.03, 0.3)}s\` }}` — same cap as current Framer Motion config
- Cards start with `opacity: 0; transform: translateY(20px)` and get a `.visible` class after mount/filter change via a `useEffect` that runs after render
- No exit animation — items disappear immediately on filter change (the current `exit: { opacity: 0, scale: 0.95 }` at 0.3s is barely perceptible)
- The `layout` prop's reflow animation is dropped. When filtering removes items and remaining ones shift up, they jump to new positions instantly rather than sliding. This is the intended behavior — the reflow animation is subtle and not worth the Framer Motion dependency.
- "No results" empty state: simple CSS `animation: fade-in 0.3s ease-out`
- Mobile (`width < 768px`): no stagger delay, no transition — instant rendering

#### 1d. Dependency removal

After all three rewrites, remove `framer-motion` from `dependencies` in `package.json`. Run `npm install` to update the lockfile.

### 2. Reduce Mobile CSS Weight (globals.css)

#### 2a. Blob animations

The `body::before` and `body::after` pseudo-elements run continuous 25s/30s infinite float animations with 70vw/80vw radial gradients.

On mobile (`width < 768px`): hide both pseudo-elements (`display: none`). These are decorative ambient effects that consume continuous GPU cycles with minimal visual payoff on small screens.

Desktop: unchanged.

#### 2b. Backdrop blur on mobile

The `.glass` utility applies `backdrop-blur-xl` and `.glass-card` applies `backdrop-blur-md`. These are the most expensive compositing operations on mobile GPUs.

On mobile (`width < 768px`):
- `.glass` → `bg-white/80 dark:bg-slate-900/80` with no blur, keep border and shadow
- `.glass-card` → `bg-white/70 dark:bg-slate-800/70` with no blur, keep border and shadow

Desktop: blur effects unchanged.

#### 2c. Other backdrop-blur sites

Several components use inline `backdrop-blur` classes that are not covered by the `.glass` / `.glass-card` utilities:

- **Header.tsx** line 19: background overlay uses `backdrop-blur-[1px]`. Retained — negligible cost (1px blur on an already composited gradient overlay).
- **Header.tsx** line 76: social link containers use `backdrop-blur-md`. On mobile, replace with solid `bg-white/20` without blur. Apply blur only at `md:` breakpoint.
- **Header.tsx** line 81: tooltip spans use `backdrop-blur-md`. No change needed — tooltips are `opacity-0` until hover, which does not fire on touch devices.
- **MobileNav.tsx** line 58: hamburger button uses `backdrop-blur-md`. This is a mobile-only element (`lg:hidden`) compositing on every mobile page view. Replace with solid `bg-white/90 dark:bg-slate-800/90` without blur.
- **MobileNav.tsx** line 67: overlay uses `backdrop-blur-sm`. Replace with solid `bg-black/60` without blur.
- **Footer.tsx** line 10: footer uses `backdrop-blur-sm`. Low priority — thin blur on a near-opaque background. Replace with no blur for consistency.

### 3. Trim Font Weights (layout.tsx)

Change Poppins from `weight: ['400', '500', '600', '700']` to `weight: ['400', '700']`.

This eliminates 2 WOFF2 file downloads from the critical path. Actual usage impact:
- `font-medium` (500) on some sub-elements → falls back to 400 (acceptable)
- `font-semibold` (600) on filter buttons and small labels → falls back to 700 (acceptable)

Inter stays unchanged (single variable font, one file).

### 4. Lazy-Load Publications (Conditional)

Publications is the heaviest client component: filter/search state, list rendering, many `react-icons` imports.

Use `next/dynamic` in `page.tsx` (default `ssr: true` — this is the default behavior of `next/dynamic`, no explicit option needed):
- Component still renders at build time → full HTML in the static export → SEO preserved
- The JS chunk is code-split into a separate file, loaded after initial paint
- Defers Publications JS + its react-icons imports off the critical path → reduces TBT
- No `loading` component needed — SSR guarantees the HTML is already present; the split chunk only hydrates interactivity
- The `Reveal` wrapper around Publications in `page.tsx` remains a static import and its animation timing is independent of the dynamic chunk load
- The `getPublications()` async call and `publications` prop flow in `page.tsx` remain unchanged — the data is serialized into page props at build time regardless of the dynamic import

**Revert condition:** If testing shows the split chunk causes a visible flash, layout shift, or hydration mismatch on the publications section, revert this change. The Framer Motion removal is the primary win; this is additive.

## Files Changed

| File | Change | Risk |
|------|--------|------|
| `package.json` | Remove `framer-motion` | Low — all usages rewritten first |
| `src/components/Reveal.tsx` | Full rewrite: IntersectionObserver + CSS | Low — same visual behavior |
| `src/components/PageTransition.tsx` | Full rewrite: CSS animation on mount | Low — simpler than current |
| `src/components/Publications.tsx` | Remove all `motion`/`AnimatePresence` imports and wrappers (list items + empty state), replace with CSS transitions | Medium — filter transition quality |
| `src/app/globals.css` | Add `@keyframes` (outside `@layer`), `.reveal`/`.visible` state classes (in `@layer components`), mobile media queries for blobs/blur | Low |
| `src/app/layout.tsx` | Poppins weights `['400', '700']` | Low — graceful fallback |
| `src/app/page.tsx` | `next/dynamic` for Publications | Medium — revert if issues |
| `src/components/Header.tsx` | Tailwind class change: apply `backdrop-blur-md` only at `md:` breakpoint on social links | Low |
| `src/components/MobileNav.tsx` | Replace `backdrop-blur-md` / `backdrop-blur-sm` with solid backgrounds | Low |
| `src/components/Footer.tsx` | Remove `backdrop-blur-sm`, use solid background | Low |

**Not changed:** `next.config.ts`, image files/pipeline, `Sidebar.tsx`, `GoogleAnalytics.tsx`, deployment config.

## Expected Impact

| Metric | Before | After (est.) | Driver |
|--------|--------|--------------|--------|
| FCP | 2.9s | ~2.2s | 2 fewer font files, no blob animation paint on mobile |
| LCP | 4.9s | ~3.5s | Less main-thread contention from JS parsing |
| TBT | 170ms | ~80ms | ~130 KB less JS to parse + code-split Publications |
| Speed Index | 5.2s | ~3.5s | Faster paint + less animation blocking visual completeness |
| CLS | 0 | 0 | No layout changes |

## Verification

After implementation:
1. `npm run build` succeeds with no errors
2. Local preview (`npx serve out`) — visual check on desktop (animations present) and mobile viewport (animations reduced/absent)
3. Re-run PageSpeed Insights on deployed site to measure actual score
4. Check that Publications section HTML is present in `out/index.html` (SEO preservation)
