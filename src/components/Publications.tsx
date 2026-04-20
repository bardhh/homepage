"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Publication, getPublicationType } from '@/lib/bibtex';
import { FaFilePdf, FaVideo, FaCode, FaAward, FaSearch, FaLayerGroup, FaUsers, FaBook, FaLaptopCode, FaCalendarAlt, FaBrain, FaRobot, FaCheckDouble, FaVial, FaShieldAlt, FaTimes, FaQuoteLeft, FaCheck, FaExternalLinkAlt } from 'react-icons/fa';
import clsx from 'clsx';

const ITEMS_PER_PAGE = 15;
const RECENT_YEARS = 5;

interface PublicationsProps {
  publications: Publication[];
}

const Publications: React.FC<PublicationsProps> = ({ publications }) => {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes('MAC'));
  }, []);

  const recentCutoff = useMemo(() => new Date().getFullYear() - RECENT_YEARS, []);

  // Cmd/Ctrl+K keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev =>
      prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
    );
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleTypeFilter = (filter: string) => {
    setTypeFilter(filter);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const filteredPubs = useMemo(() => {
    const searchLower = search.toLowerCase();
    return publications.filter(pub => {
      if (typeFilter !== 'all') {
        const type = getPublicationType(pub);
        if (typeFilter === 'recent') {
          const year = parseInt(pub.entryTags.year || '0');
          if (year < recentCutoff) return false;
        } else if (typeFilter === 'paper-conf' && type !== 'conference') return false;
        else if (typeFilter === 'paper-jour' && type !== 'journal') return false;
        else if (typeFilter === 'paper-work' && type !== 'workshop') return false;
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
    setCardsVisible(false);
    const id = requestAnimationFrame(() => setCardsVisible(true));
    return () => cancelAnimationFrame(id);
  }, [typeFilter, selectedThemes, search, visibleCount]);

  return (
    <section id="publications" className="scroll-mt-24" role="region" aria-label="Publications">
      <div className="flex items-center mb-8">
        <div className="h-10 w-1 bg-blue-500 rounded-full mr-4"></div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
          Publications
        </h2>
      </div>

      <div className="glass rounded-2xl p-6 mb-8 border border-blue-200/40 dark:border-blue-800/30 shadow-md shadow-blue-500/5">

        {/* Search */}
        <div className="relative mb-6 group">
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
        <div className="space-y-4">
          <fieldset>
            <legend className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Filter by type</legend>
            <div className="flex flex-wrap gap-2" role="group">
              <FilterButton active={typeFilter === 'all'} onClick={() => handleTypeFilter('all')} icon={<FaLayerGroup />}>All</FilterButton>
              <FilterButton active={typeFilter === 'paper-conf'} onClick={() => handleTypeFilter('paper-conf')} icon={<FaUsers />}>Conferences</FilterButton>
              <FilterButton active={typeFilter === 'paper-jour'} onClick={() => handleTypeFilter('paper-jour')} icon={<FaBook />}>Journals</FilterButton>
              <FilterButton active={typeFilter === 'paper-work'} onClick={() => handleTypeFilter('paper-work')} icon={<FaLaptopCode />}>Workshops</FilterButton>
              <FilterButton active={typeFilter === 'recent'} onClick={() => handleTypeFilter('recent')} icon={<FaCalendarAlt />}>Recent ({recentCutoff}+)</FilterButton>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 w-full block">Filter by theme (multi-select)</legend>
            <div className="flex flex-wrap gap-2" role="group">
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
              onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
              className="inline-flex items-center px-6 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-all border border-blue-200 dark:border-blue-800"
            >
              Show more ({sortedPubs.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const FilterButton = ({ active, onClick, children, icon }: { active: boolean, onClick: () => void, children: React.ReactNode, icon?: React.ReactNode }) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    className={clsx(
      "inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
      active
        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105"
        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
    )}
  >
    {icon && <span className="mr-2 opacity-80">{icon}</span>}
    {children}
  </button>
);

const PublicationCard = ({ pub, index }: { pub: Publication, index: number }) => {
  const [copied, setCopied] = useState(false);
  const type = getPublicationType(pub);

  const typeColors = {
    conference: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    journal: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    workshop: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300',
    other: 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
  };
  const borderColors = {
    conference: 'border-l-blue-500',
    journal: 'border-l-emerald-500',
    workshop: 'border-l-pink-500',
    other: 'border-l-slate-400',
  };
  const badgeClass = typeColors[type as keyof typeof typeColors] || typeColors.other;
  const borderClass = borderColors[type as keyof typeof borderColors] || borderColors.other;

  const copyBibtex = useCallback(() => {
    const entryType = pub.entryType || 'misc';
    const lines = Object.entries(pub.entryTags)
      .filter(([, v]) => v)
      .map(([k, v]) => `  ${k} = {${v}}`);
    navigator.clipboard.writeText(`@${entryType}{${pub.citationKey},\n${lines.join(',\n')}\n}`)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
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
        {pub.entryTags.url ? (
          <a
            href={pub.entryTags.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group/title"
          >
            <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors">
              {pub.entryTags.title}
            </h3>
          </a>
        ) : (
          <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
            {pub.entryTags.title}
          </h3>
        )}
        <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 truncate">
          {pub.entryTags.author?.replace(/ and /g, ', ')}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {pub.entryTags.booktitle}
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
      <div className="shrink-0 flex items-center gap-1 text-slate-500 dark:text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity">
        <IconBtn onClick={copyBibtex} label={copied ? 'Copied' : 'Cite'}>
          {copied ? <FaCheck className="text-emerald-500"/> : <FaQuoteLeft/>}
        </IconBtn>
        {pub.entryTags.url   && <IconLink href={pub.entryTags.url}   label="PDF"  ><FaFilePdf/></IconLink>}
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

const ActionButton = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-white transition-all transform hover:-translate-y-0.5"
  >
    <span className="mr-1.5">{icon}</span> {label} <FaExternalLinkAlt className="ml-1.5 text-[0.6em] opacity-50" />
  </a>
);

export default Publications;
