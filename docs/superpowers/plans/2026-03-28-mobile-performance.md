# Mobile Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise mobile Lighthouse Performance from 72 to 85–90 by removing Framer Motion, reducing mobile CSS weight, and trimming font loads.

**Architecture:** Replace all Framer Motion usage (Reveal, PageTransition, Publications) with CSS transitions + IntersectionObserver. Disable expensive GPU effects (backdrop-blur, ambient blob animations) on mobile via media queries. Code-split Publications with `next/dynamic`.

**Tech Stack:** Next.js 16 (static export), React 19, Tailwind CSS v4, vanilla IntersectionObserver

**Spec:** `docs/superpowers/specs/2026-03-28-mobile-performance-design.md`

---

## Chunk 1: CSS Foundation + Component Rewrites

### Task 1: Add CSS keyframes and animation classes to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add `@keyframes page-enter` and `@keyframes fade-in` outside `@layer` blocks**

Add after the existing `@keyframes fade-in-up` block (after line 101):

```css
@keyframes page-enter {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

- [ ] **Step 2: Add `.reveal` / `.visible` state classes in a new `@layer components` block**

Add after the `@layer utilities` block (after line 48):

```css
@layer components {
  .reveal {
    opacity: 0;
    transform: translateY(30px);
  }

  @media (width >= 768px) {
    .reveal {
      transition: opacity 0.5s ease-out, transform 0.5s ease-out;
    }
  }

  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .page-enter {
    opacity: 0;
  }

  @media (width >= 768px) {
    .page-enter.mounted {
      animation: page-enter 0.4s ease-in-out forwards;
    }
  }

  @media (width < 768px) {
    .page-enter.mounted {
      opacity: 1;
    }
  }

  .pub-card {
    opacity: 0;
    transform: translateY(20px);
  }

  @media (width >= 768px) {
    .pub-card {
      transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    }
  }

  .pub-card.visible {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- [ ] **Step 3: Add mobile media query to disable blob animations and backdrop blur**

Add at the end of the file, after the scrollbar styles:

```css
/* Mobile performance: disable expensive GPU effects */
@media (width < 768px) {
  body::before,
  body::after {
    display: none;
  }

  .glass {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: rgb(255 255 255 / 0.8);
  }

  .dark .glass {
    background: rgb(15 23 42 / 0.8);
  }

  .glass-card {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: rgb(255 255 255 / 0.7);
  }

  .dark .glass-card {
    background: rgb(30 41 59 / 0.7);
  }
}
```

- [ ] **Step 4: Verify the build compiles with the new CSS**

Run: `cd /Users/bardhh/code/homepage && npm run build`
Expected: Build succeeds (no CSS syntax errors). Existing components still work since the new classes aren't applied yet.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add CSS animation classes and mobile perf media queries

Add reveal/page-enter/pub-card animation classes as CSS replacements
for Framer Motion. Disable blob animations and backdrop-blur on mobile
to reduce GPU compositing."
```

---

### Task 2: Rewrite Reveal.tsx — IntersectionObserver + CSS

**Files:**
- Modify: `src/components/Reveal.tsx`

- [ ] **Step 1: Rewrite Reveal.tsx**

Replace the entire file content with:

```tsx
"use client";

import React, { useRef, useEffect, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${visible ? ' visible' : ''}${className ? ` ${className}` : ''}`}
      style={delay > 0 ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
};

export default Reveal;
```

Key differences from original:
- No `framer-motion` imports
- `IntersectionObserver` replaces `useInView`
- CSS class `reveal` / `visible` replaces `motion.div` `initial`/`animate`
- `delay` prop maps to `transition-delay` inline style (only applies on desktop where the transition is defined in CSS)

- [ ] **Step 2: Verify the build compiles**

Run: `cd /Users/bardhh/code/homepage && npm run build`
Expected: Build succeeds. Reveal sections still render (now using CSS transitions instead of Framer Motion).

- [ ] **Step 3: Commit**

```bash
git add src/components/Reveal.tsx
git commit -m "refactor: rewrite Reveal.tsx with IntersectionObserver + CSS

Replace Framer Motion useInView + motion.div with vanilla
IntersectionObserver and CSS class toggle. Animations play on
desktop only; mobile gets instant reveal."
```

---

### Task 3: Rewrite PageTransition.tsx — CSS animation on mount

**Files:**
- Modify: `src/components/PageTransition.tsx`

- [ ] **Step 1: Rewrite PageTransition.tsx**

Replace the entire file content with:

```tsx
'use client';

import { useEffect, useState } from 'react';

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`page-enter${mounted ? ' mounted' : ''}`}>
      {children}
    </div>
  );
}
```

Key differences from original:
- No `framer-motion` imports
- `useState` + `useEffect` to toggle `mounted` class after first render
- CSS class `page-enter` / `page-enter.mounted` handles animation (desktop) or instant show (mobile) — defined in globals.css from Task 1

- [ ] **Step 2: Verify the build compiles**

Run: `cd /Users/bardhh/code/homepage && npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/PageTransition.tsx
git commit -m "refactor: rewrite PageTransition.tsx with CSS animation

Replace Framer Motion motion.div with CSS page-enter animation.
Desktop gets 0.4s fade+slide; mobile renders immediately."
```

---

### Task 4: Rewrite Publications.tsx — remove Framer Motion, use CSS transitions

**Files:**
- Modify: `src/components/Publications.tsx`

This is the largest change. Three areas of the file use Framer Motion:
1. The `import { motion, AnimatePresence } from 'framer-motion'` line
2. The `<AnimatePresence>` + `<motion.div>` wrapper around each publication card
3. The `<motion.div>` wrapper around the "no results" empty state

**Note:** Line numbers below refer to the original file. After each step, subsequent line numbers shift. Use the code patterns (not line numbers) to locate each block.

- [ ] **Step 1: Remove the framer-motion import**

In `src/components/Publications.tsx`, find and delete this line:

```tsx
import { motion, AnimatePresence } from 'framer-motion';
```

- [ ] **Step 2: Add a `useEffect` for card visibility after render/filter changes**

Add a state variable and effect inside the `Publications` component. After the existing `const hasMore` line (line 106), add:

```tsx
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    setCardsVisible(false);
    const id = requestAnimationFrame(() => setCardsVisible(true));
    return () => cancelAnimationFrame(id);
  }, [typeFilter, selectedThemes, search, visibleCount]);
```

This resets visibility on every filter/search/pagination change, then triggers the CSS transition on the next frame. Uses stable primitive dependencies rather than `visiblePubs` (which creates a new array reference on every render via `.slice()`).

- [ ] **Step 3: Replace the AnimatePresence + motion.div list wrapper**

Find the `<AnimatePresence mode="popLayout">` block and replace it:

```tsx
        <AnimatePresence mode="popLayout">
          {visiblePubs.map((pub, index) => (
            <motion.div
              key={pub.citationKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
              layout
            >
              <PublicationCard pub={pub} index={sortedPubs.length - index} />
            </motion.div>
          ))}
        </AnimatePresence>
```

with:

```tsx
        {visiblePubs.map((pub, index) => (
          <div
            key={pub.citationKey}
            className={`pub-card${cardsVisible ? ' visible' : ''}`}
            style={{ transitionDelay: `${Math.min(index * 0.03, 0.3)}s` }}
          >
            <PublicationCard pub={pub} index={sortedPubs.length - index} />
          </div>
        ))}
```

- [ ] **Step 4: Replace the motion.div "no results" empty state**

Find the `<motion.div>` wrapping the "no results" empty state (the `{sortedPubs.length === 0 &&` block):

```tsx
        {sortedPubs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-block p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <FaSearch className="text-4xl text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-lg">No publications found matching your criteria.</p>
          </motion.div>
        )}
```

with:

```tsx
        {sortedPubs.length === 0 && (
          <div
            className="text-center py-20"
            style={{ animation: 'fade-in 0.3s ease-out' }}
          >
            <div className="inline-block p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <FaSearch className="text-4xl text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-lg">No publications found matching your criteria.</p>
          </div>
        )}
```

- [ ] **Step 5: Verify the build compiles**

Run: `cd /Users/bardhh/code/homepage && npm run build`
Expected: Build succeeds. No remaining references to `framer-motion` in Publications.tsx.

- [ ] **Step 6: Commit**

```bash
git add src/components/Publications.tsx
git commit -m "refactor: remove Framer Motion from Publications.tsx

Replace AnimatePresence + motion.div with CSS transitions.
Cards use pub-card/visible class toggle with staggered
transition-delay. Empty state uses CSS fade-in animation."
```

---

## Chunk 2: Dependency Removal + Remaining Optimizations

### Task 5: Remove framer-motion dependency

**Prerequisite:** Tasks 2, 3, and 4 must be complete (all framer-motion usages replaced). Step 1 verifies this.

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Verify no remaining framer-motion imports in the codebase**

Run: `cd /Users/bardhh/code/homepage && grep -r "framer-motion\|from 'framer-motion'\|from \"framer-motion\"" src/`
Expected: No output (zero matches). If any matches remain, go back and fix them before proceeding.

- [ ] **Step 2: Remove framer-motion from package.json**

Run: `cd /Users/bardhh/code/homepage && npm uninstall framer-motion`
Expected: `framer-motion` removed from `package.json` dependencies and `node_modules`. `package-lock.json` updated.

- [ ] **Step 3: Verify the build still compiles**

Run: `cd /Users/bardhh/code/homepage && npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: remove framer-motion dependency

All Framer Motion usages have been replaced with CSS animations.
Saves ~130 KB from the client JS bundle."
```

---

### Task 6: Remove backdrop-blur from mobile components

**Files:**
- Modify: `src/components/Header.tsx:76`
- Modify: `src/components/MobileNav.tsx:58,67`
- Modify: `src/components/Footer.tsx:10`

- [ ] **Step 1: Update Header.tsx social link backdrop-blur**

In `src/components/Header.tsx`, in the `SocialLink` component (line 76), change:

```tsx
    className="relative p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 group"
```

to:

```tsx
    className="relative p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl max-md:bg-white/20 md:backdrop-blur-md border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 group"
```

This applies `backdrop-blur-md` only at `md:` (768px+) and uses a solid `bg-white/20` on mobile via `max-md:`.

- [ ] **Step 2: Update MobileNav.tsx hamburger button backdrop-blur**

In `src/components/MobileNav.tsx`, line 58, change:

```tsx
        className="fixed top-4 right-4 z-50 p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-all"
```

to:

```tsx
        className="fixed top-4 right-4 z-50 p-3 bg-white/90 dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-all"
```

- [ ] **Step 3: Update MobileNav.tsx overlay backdrop-blur**

In `src/components/MobileNav.tsx`, line 67, change:

```tsx
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
```

to:

```tsx
          className="fixed inset-0 z-50 bg-black/60"
```

- [ ] **Step 4: Update Footer.tsx backdrop-blur**

In `src/components/Footer.tsx`, line 10, change:

```tsx
    <footer className="mt-12 border-t border-slate-200 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm">
```

to:

```tsx
    <footer className="mt-12 border-t border-slate-200 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-900/80">
```

- [ ] **Step 5: Verify the build compiles**

Run: `cd /Users/bardhh/code/homepage && npm run build`
Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/components/Header.tsx src/components/MobileNav.tsx src/components/Footer.tsx
git commit -m "perf: remove backdrop-blur from mobile-visible elements

Apply backdrop-blur only at md: breakpoint on Header social links.
Remove blur entirely from MobileNav and Footer for reduced GPU
compositing on mobile."
```

---

### Task 7: Trim Poppins font weights

**Files:**
- Modify: `src/app/layout.tsx:14-18`

- [ ] **Step 1: Change Poppins weight array**

In `src/app/layout.tsx`, find the Poppins configuration and change the weight array:

```tsx
  weight: ['400', '500', '600', '700'],
```

to:

```tsx
  weight: ['400', '700'],
```

- [ ] **Step 2: Verify the build compiles**

Run: `cd /Users/bardhh/code/homepage && npm run build`
Expected: Build succeeds. Font subset now downloads 2 fewer WOFF2 files.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "perf: trim Poppins font weights to 400 and 700

Eliminates 2 WOFF2 file downloads from the critical rendering path.
Weights 500 and 600 fall back gracefully to 400 and 700 respectively."
```

---

### Task 8: Lazy-load Publications with next/dynamic

**Files:**
- Modify: `src/app/page.tsx:5`

- [ ] **Step 1: Change Publications import to dynamic**

In `src/app/page.tsx`, replace line 5:

```tsx
import Publications from '@/components/Publications';
```

with:

```tsx
import dynamic from 'next/dynamic';

const Publications = dynamic(() => import('@/components/Publications'));
```

No other changes to `page.tsx` — the `<Publications publications={publications} />` JSX and `getPublications()` call stay the same.

- [ ] **Step 2: Verify the build compiles and Publications HTML is in the static export**

Run: `cd /Users/bardhh/code/homepage && npm run build`
Expected: Build succeeds.

Then verify Publications content is in the static HTML:

Run: `cd /Users/bardhh/code/homepage && grep -c "publications" out/index.html`
Expected: A positive number (> 0), confirming publication content is server-rendered in the static export.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "perf: lazy-load Publications with next/dynamic

Code-splits the heaviest client component into a separate JS chunk,
reducing main-thread blocking time during initial page load.
SSR default preserves HTML in static export for SEO."
```

---

## Chunk 3: Verification

### Task 9: Full build verification and visual check

- [ ] **Step 1: Clean build from scratch**

Run: `cd /Users/bardhh/code/homepage && rm -rf .next out && npm run build`
Expected: Build succeeds with zero errors, zero warnings related to our changes.

- [ ] **Step 2: Verify no framer-motion references remain**

Run: `cd /Users/bardhh/code/homepage && grep -r "framer-motion" src/`
Expected: No output.

- [ ] **Step 3: Verify Publications HTML is in static export**

Run: `cd /Users/bardhh/code/homepage && grep -l "publications" out/index.html`
Expected: `out/index.html` (confirms the file matches).

- [ ] **Step 4: Check JS bundle size reduction**

Run: `cd /Users/bardhh/code/homepage && du -sh out/_next/static/chunks/`
Expected: Noticeably smaller than before (~1.3 MB → ~1.1 MB or less).

- [ ] **Step 5: Serve locally and visually verify**

Run: `cd /Users/bardhh/code/homepage && npx serve out -l 3000`

Manual checks:
1. **Desktop (wide viewport):** Scroll down — reveal animations play (fade+slide up). Filter publications — cards animate in with stagger. Page loads with fade-in animation. Glass blur effects visible on sidebar and cards.
2. **Mobile (narrow viewport or DevTools mobile emulation):** Sections appear instantly (no reveal delay). No backdrop-blur on glass cards. No ambient blob animations. Publications cards appear instantly on filter. Hamburger menu works without blur effects.
3. **Both:** All content renders. No layout shifts. No flash of invisible content.

Stop the server after checking.

- [ ] **Step 6: Note any issues for revert**

If the dynamic import of Publications causes a visible flash or hydration error, revert Task 8:

```bash
# Only if needed:
git revert HEAD --no-edit  # reverts Task 8 commit
```
