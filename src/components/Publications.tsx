"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import type { Publication } from '@/lib/bibtex';
import { getPublicationType, publicationLinks, publicationPath, publicationBibtex, readPublicationState, writePublicationState, type PublicationState } from '@/lib/publication-utils';
import { FaFilePdf, FaVideo, FaCode, FaAward, FaSearch, FaLayerGroup, FaUsers, FaBook, FaLaptopCode, FaCalendarAlt, FaBrain, FaRobot, FaCheckDouble, FaVial, FaShieldAlt, FaTimes, FaQuoteLeft, FaCheck, FaExternalLinkAlt } from 'react-icons/fa';
import clsx from 'clsx';

const ITEMS_PER_PAGE = 15;
const RECENT_YEARS = 5;

const stateEvent = 'publication-state-change';
function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener(stateEvent, callback);
  return () => { window.removeEventListener('popstate', callback); window.removeEventListener(stateEvent, callback); };
}
const getSnapshot = () => window.location.search;
const getServerSnapshot = () => '';
const emptySubscribe = () => () => {};

interface PublicationsProps {
  publications: Publication[];
}

const Publications: React.FC<PublicationsProps> = ({ publications }) => {
  const query = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const state = useMemo(() => readPublicationState(query), [query]);
  const { type: typeFilter, themes: selectedThemes, search, count: visibleCount } = state;
  const update = (patch: Partial<PublicationState>, replace = false) => {
    const next = writePublicationState(window.location.search, { ...state, ...patch });
    const url = `${window.location.pathname}${next ? `?${next}` : ''}#publications`;
    if (replace) window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
    window.dispatchEvent(new Event(stateEvent));
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const isMac = useSyncExternalStore(emptySubscribe, () => navigator.platform.toUpperCase().includes('MAC'), () => false);

  const recentCutoff = useMemo(() => new Date().getFullYear() - RECENT_YEARS, []);

  // Cmd/Ctrl+K keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = (theme: string) => {
    update({ themes: selectedThemes.includes(theme) ? selectedThemes.filter(t => t !== theme) : [...selectedThemes, theme], count: ITEMS_PER_PAGE });
  };
  const handleTypeFilter = (type: string) => update({ type, count: ITEMS_PER_PAGE });
  const handleSearch = (search: string) => update({ search, count: ITEMS_PER_PAGE }, true);

  const filteredPubs = useMemo(() => {
    const searchLower = search.toLowerCase();
    return publications.filter(pub => {
      if (typeFilter !== 'all') {
        const type = getPublicationType(pub);
        if (typeFilter === 'recent') {
          const year = parseInt(pub.entryTags.year || '0');
          if (year < recentCutoff) return false;
        } else if (typeFilter === 'conference' && type !== 'conference') return false;
        else if (typeFilter === 'journal' && type !== 'journal') return false;
        else if (typeFilter === 'workshop' && type !== 'workshop') return false;
        else if (typeFilter === 'preprint' && type !== 'preprint') return false;
      }

      if (selectedThemes.length > 0) {
        const keywords = pub.entryTags.keywords?.toLowerCase() || '';
        const matchesTheme = selectedThemes.every(theme => keywords.includes(theme));
        if (!matchesTheme) return false;
      }

      if (search) {
        const title = pub.entryTags.title?.toLowerCase() || '';
        const author = pub.entryTags.author?.toLowerCase() || '';
        const venue = pub.entryTags.booktitle?.toLowerCase() || '';
        const journal = pub.entryTags.journal?.toLowerCase() || '';
        const keywords = pub.entryTags.keywords?.toLowerCase() || '';

        return title.includes(searchLower) ||
               author.includes(searchLower) ||
               venue.includes(searchLower) ||
               journal.includes(searchLower) ||
               keywords.includes(searchLower);
      }

      return true;
    });
  }, [publications, typeFilter, selectedThemes, search, recentCutoff]);

  const sortedPubs = useMemo(() => {
    return [...filteredPubs].sort((a, b) => {
      const yearA = parseInt(a.entryTags.year || '0');
      const yearB = parseInt(b.entryTags.year || '0');
      return yearB - yearA;
    });
  }, [filteredPubs]);

  const visiblePubs = sortedPubs.slice(0, visibleCount);
  const hasMore = visibleCount < sortedPubs.length;

  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    let showFrame = 0;
    const resetFrame = requestAnimationFrame(() => {
      setCardsVisible(false);
      showFrame = requestAnimationFrame(() => setCardsVisible(true));
    });
    return () => { cancelAnimationFrame(resetFrame); cancelAnimationFrame(showFrame); };
  }, [typeFilter, selectedThemes, search, visibleCount]);

  return (
    <section tabIndex={-1} id="publications" className="scroll-mt-24" role="region" aria-label="Publications">
      <div className="flex items-center mb-8">
        <div className="h-10 w-1 bg-blue-500 rounded-full mr-4"></div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
          Publications
        </h2>
      </div>

      <div className="glass rounded-2xl p-4 md:p-6 mb-8 border border-blue-200/40 dark:border-blue-800/30 shadow-md shadow-blue-500/5">

        {/* Search */}
        <div className="relative mb-4 md:mb-6 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" aria-hidden="true">
            <FaSearch className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="block w-full pl-11 pr-12 py-3 border-none rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder={`Search publications... (${isMac ? '⌘' : 'Ctrl+'}K)`}
            aria-label="Search publications"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => {
                handleSearch('');
                inputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-r-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <fieldset>
            <legend className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Filter by type</legend>
            <div className="flex flex-wrap gap-x-4 gap-y-3 md:gap-2" role="group">
              <FilterButton active={typeFilter === 'all'} onClick={() => handleTypeFilter('all')} icon={<FaLayerGroup />}>All</FilterButton>
              <FilterButton active={typeFilter === 'conference'} onClick={() => handleTypeFilter('conference')} icon={<FaUsers />}>Conferences</FilterButton>
              <FilterButton active={typeFilter === 'journal'} onClick={() => handleTypeFilter('journal')} icon={<FaBook />}>Journals</FilterButton>
              <FilterButton active={typeFilter === 'workshop'} onClick={() => handleTypeFilter('workshop')} icon={<FaLaptopCode />}>Workshops</FilterButton>
              <FilterButton active={typeFilter === 'preprint'} onClick={() => handleTypeFilter('preprint')} icon={<FaFilePdf />}>Preprints</FilterButton>
              <FilterButton active={typeFilter === 'recent'} onClick={() => handleTypeFilter('recent')} icon={<FaCalendarAlt />}>Recent ({recentCutoff}+)</FilterButton>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 w-full block">Filter by theme (multi-select)</legend>
            <div className="flex flex-wrap gap-x-4 gap-y-3 md:gap-2" role="group">
              <FilterButton active={selectedThemes.includes('learning')} onClick={() => toggleTheme('learning')} icon={<FaBrain />}>Learning</FilterButton>
              <FilterButton active={selectedThemes.includes('planning')} onClick={() => toggleTheme('planning')} icon={<FaRobot />}>Planning</FilterButton>
              <FilterButton active={selectedThemes.includes('verification')} onClick={() => toggleTheme('verification')} icon={<FaCheckDouble />}>Verification</FilterButton>
              <FilterButton active={selectedThemes.includes('testing')} onClick={() => toggleTheme('testing')} icon={<FaVial />}>Testing</FilterButton>
              <FilterButton active={selectedThemes.includes('risk')} onClick={() => toggleTheme('risk')} icon={<FaShieldAlt />}>Risk</FilterButton>
            </div>
          </fieldset>
        </div>

        <div className="mt-4 text-xs font-medium text-slate-400 uppercase tracking-wider" aria-live="polite">
          Showing {visiblePubs.length} of {sortedPubs.length} publications
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {visiblePubs.map((pub, index) => (
          <div
            key={pub.citationKey}
            className={`pub-card${cardsVisible ? ' visible' : ''}`}
            style={{ transitionDelay: `${Math.min(index * 0.03, 0.3)}s` }}
          >
            <PublicationCard pub={pub} index={sortedPubs.length - index} />
          </div>
        ))}

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

        {hasMore && (
          <div className="text-center pt-4">
            <button
              onClick={() => update({ count: visibleCount + ITEMS_PER_PAGE })}
              className="inline-flex items-center px-6 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-all border border-blue-200 dark:border-blue-800"
            >
              Show more ({sortedPubs.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
      <p className="mt-6 text-center text-sm">
        <Link prefetch={false} href="/publications/" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Full publication archive</Link>
      </p>
    </section>
  );
};

const FilterButton = ({ active, onClick, children, icon }: { active: boolean, onClick: () => void, children: React.ReactNode, icon?: React.ReactNode }) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    className={clsx(
      "inline-flex items-center px-2.5 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200",
      active
        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105"
        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
    )}
  >
    {icon && <span className="mr-2 opacity-80">{icon}</span>}
    {children}
  </button>
);

function fallbackCopy(text: string, onSuccess: () => void) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;left:-9999px';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  onSuccess();
}

const PublicationCard = ({ pub, index }: { pub: Publication, index: number }) => {
  const [copied, setCopied] = useState(false);
  const type = getPublicationType(pub);
  const links = publicationLinks(pub);

  const typeColors = {
    conference: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    journal: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    workshop: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300',
    preprint: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200',
    other: 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
  };
  const borderColors = {
    conference: 'border-l-blue-500',
    journal: 'border-l-emerald-500',
    workshop: 'border-l-pink-500',
    preprint: 'border-l-amber-500',
    other: 'border-l-slate-400',
  };
  const badgeClass = typeColors[type as keyof typeof typeColors] || typeColors.other;
  const borderClass = borderColors[type as keyof typeof borderColors] || borderColors.other;

  const copyBibtex = useCallback(() => {
    const text = publicationBibtex(pub);

    const onSuccess = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
        fallbackCopy(text, onSuccess);
      });
    } else {
      fallbackCopy(text, onSuccess);
    }
  }, [pub]);

  return (
    <div className={clsx(
      "glass-card rounded-lg px-4 py-3 relative group border-l-4 flex items-start gap-4",
      borderClass
    )}>
      {/* Index */}
      <div className="shrink-0 pt-0.5 w-8 text-right font-mono text-xs text-slate-400 dark:text-slate-500 tabular-nums">
        {index}
      </div>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        <Link
          prefetch={false}
          href={publicationPath(pub)}
          className="block group/title"
        >
          <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors">
            {pub.entryTags.title}
          </h3>
        </Link>
        <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 truncate">
          {pub.entryTags.author?.replace(/ and /g, ', ')}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {pub.entryTags.booktitle || pub.entryTags.journal}
          </span>
          {pub.entryTags.year && <span className="text-slate-400">· {pub.entryTags.year}</span>}
          <span className={clsx("px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide", badgeClass)}>
            {type}
          </span>
          {pub.entryTags.award && (
            <span className="inline-flex items-center text-amber-600 dark:text-amber-400 font-semibold">
              <FaAward className="mr-1 text-[0.85em]" />{pub.entryTags.award}
            </span>
          )}
        </div>
      </div>

      {/* Action icons */}
      <div className="shrink-0 flex items-center gap-1 text-slate-500 dark:text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity relative">
        <div className="relative">
          <IconBtn onClick={copyBibtex} label={copied ? 'Copied' : 'Cite'}>
            {copied ? <FaCheck className="text-emerald-500"/> : <FaQuoteLeft/>}
          </IconBtn>
          {copied && (
            <span className="absolute bottom-full right-0 mb-1 px-2 py-1 bg-emerald-600 text-white text-[10px] font-medium rounded-md whitespace-nowrap animate-fade-in shadow-lg">
              Copied to clipboard
            </span>
          )}
        </div>
        {links.paper && <IconLink href={links.paper} label="Paper"><FaExternalLinkAlt/></IconLink>}
        {links.pdf && <IconLink href={links.pdf} label="PDF"><FaFilePdf/></IconLink>}
        {pub.entryTags.video && <IconLink href={pub.entryTags.video} label="Video"><FaVideo/></IconLink>}
        {pub.entryTags.code  && <IconLink href={pub.entryTags.code}  label="Code" ><FaCode/></IconLink>}
      </div>
    </div>
  );
};

const IconBtn = ({ onClick, label, children }: { onClick: () => void, label: string, children: React.ReactNode }) => (
  <button onClick={onClick} aria-label={label} title={label}
    className="w-7 h-7 grid place-items-center rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs">
    {children}
  </button>
);

const IconLink = ({ href, label, children }: { href: string, label: string, children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}
    className="w-7 h-7 grid place-items-center rounded hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs">
    {children}
  </a>
);

export default Publications;
