"use client";

import React, { useState, useMemo, useRef } from 'react';
import { Publication, getPublicationType } from '@/lib/bibtex';
import { FaFilePdf, FaVideo, FaCode, FaAward, FaSearch, FaLayerGroup, FaUsers, FaBook, FaLaptopCode, FaCalendarAlt, FaBrain, FaRobot, FaCheckDouble, FaVial, FaShieldAlt, FaTimes } from 'react-icons/fa';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface PublicationsProps {
  publications: Publication[];
}

const Publications: React.FC<PublicationsProps> = ({ publications }) => {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev =>
      prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
    );
  };

  const filteredPubs = useMemo(() => {
    const searchLower = search.toLowerCase();
    return publications.filter(pub => {
      // Type Filter
      if (typeFilter !== 'all') {
        const type = getPublicationType(pub);
        if (typeFilter === 'recent') {
          const year = parseInt(pub.entryTags.year || '0');
          if (year < 2020) return false;
        } else if (typeFilter === 'paper-conf' && type !== 'conference') return false;
        else if (typeFilter === 'paper-jour' && type !== 'journal') return false;
        else if (typeFilter === 'paper-work' && type !== 'workshop') return false;
      }

      // Theme Filter
      if (selectedThemes.length > 0) {
        const keywords = pub.entryTags.keywords?.toLowerCase() || '';
        const matchesTheme = selectedThemes.every(theme => keywords.includes(theme));
        if (!matchesTheme) return false;
      }

      // Search Filter
      if (search) {
        const title = pub.entryTags.title?.toLowerCase() || '';
        const author = pub.entryTags.author?.toLowerCase() || '';
        const venue = pub.entryTags.booktitle?.toLowerCase() || '';
        const keywords = pub.entryTags.keywords?.toLowerCase() || '';
        
        return title.includes(searchLower) || 
               author.includes(searchLower) || 
               venue.includes(searchLower) ||
               keywords.includes(searchLower);
      }

      return true;
    });
  }, [publications, typeFilter, selectedThemes, search]);

  // Sort by year descending
  const sortedPubs = useMemo(() => {
    return [...filteredPubs].sort((a, b) => {
      const yearA = parseInt(a.entryTags.year || '0');
      const yearB = parseInt(b.entryTags.year || '0');
      return yearB - yearA;
    });
  }, [filteredPubs]);

  return (
    <section id="publications" className="scroll-mt-24">
      <div className="flex items-center mb-8">
        <div className="h-10 w-1 bg-blue-500 rounded-full mr-4"></div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
          Publications
        </h2>
      </div>

      <div className="glass rounded-2xl p-6 mb-8 border border-white/40 dark:border-slate-700/40">
        
        {/* Search */}
        <div className="relative mb-6 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" aria-hidden="true">
            <FaSearch className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="block w-full pl-11 pr-12 py-3 border-none rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="Search publications..."
            aria-label="Search publications"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => {
                setSearch('');
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
          <div className="flex flex-wrap gap-2">
            <FilterButton active={typeFilter === 'all'} onClick={() => setTypeFilter('all')} icon={<FaLayerGroup />}>All</FilterButton>
            <FilterButton active={typeFilter === 'paper-conf'} onClick={() => setTypeFilter('paper-conf')} icon={<FaUsers />}>Conferences</FilterButton>
            <FilterButton active={typeFilter === 'paper-jour'} onClick={() => setTypeFilter('paper-jour')} icon={<FaBook />}>Journals</FilterButton>
            <FilterButton active={typeFilter === 'paper-work'} onClick={() => setTypeFilter('paper-work')} icon={<FaLaptopCode />}>Workshops</FilterButton>
            <FilterButton active={typeFilter === 'recent'} onClick={() => setTypeFilter('recent')} icon={<FaCalendarAlt />}>Recent (2020+)</FilterButton>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
            <FilterButton active={selectedThemes.includes('learning')} onClick={() => toggleTheme('learning')} icon={<FaBrain />}>Learning</FilterButton>
            <FilterButton active={selectedThemes.includes('planning')} onClick={() => toggleTheme('planning')} icon={<FaRobot />}>Planning</FilterButton>
            <FilterButton active={selectedThemes.includes('verification')} onClick={() => toggleTheme('verification')} icon={<FaCheckDouble />}>Verification</FilterButton>
            <FilterButton active={selectedThemes.includes('testing')} onClick={() => toggleTheme('testing')} icon={<FaVial />}>Testing</FilterButton>
            <FilterButton active={selectedThemes.includes('risk')} onClick={() => toggleTheme('risk')} icon={<FaShieldAlt />}>Risk</FilterButton>
          </div>
        </div>
        
        <div className="mt-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
          Showing {sortedPubs.length} publications
        </div>
      </div>

      {/* List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {sortedPubs.map((pub, index) => (
            <motion.div
              key={pub.citationKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              layout
            >
              <PublicationCard pub={pub} index={sortedPubs.length - index} />
            </motion.div>
          ))}
        </AnimatePresence>
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
  const type = getPublicationType(pub);
  
  const outlineColors = {
    conference: 'border-blue-200 text-blue-700 dark:border-blue-500/30 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-500/5',
    journal: 'border-emerald-200 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/5',
    workshop: 'border-pink-200 text-pink-700 dark:border-pink-500/30 dark:text-pink-300 bg-pink-50/50 dark:bg-pink-500/5',
    other: 'border-slate-200 text-slate-700 dark:border-slate-500/30 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-500/5'
  };

  const badgeClass = outlineColors[type as keyof typeof outlineColors] || outlineColors.other;

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden group border-l-4 border-l-transparent hover:border-l-blue-500">
      {/* Decorative Index Number */}
      <div aria-hidden="true" className="absolute -right-6 -top-6 text-[8rem] font-bold text-slate-50 dark:text-slate-800/30 pointer-events-none select-none transition-transform group-hover:rotate-12 duration-700 ease-out">
        {index}
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-grow">
            {pub.entryTags.title}
          </h3>
          <span className={clsx("self-start md:self-center shrink-0 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide border", badgeClass)}>
            {type}
          </span>
        </div>
        
        <div className="text-slate-600 dark:text-slate-300 font-medium text-lg">
          {pub.entryTags.author?.replace(/ and /g, ', ')}
        </div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
          <span className="font-serif italic text-lg text-slate-800 dark:text-slate-200">
            {pub.entryTags.booktitle}
          </span>
          {pub.entryTags.year && (
            <span className="flex items-center text-slate-400 font-semibold before:content-['•'] before:mr-4 before:text-slate-300 dark:before:text-slate-700">
              {pub.entryTags.year}
            </span>
          )}
        </div>

        {pub.entryTags.award && (
          <div className="flex items-center text-amber-600 dark:text-amber-400 text-sm font-bold mt-1 animate-pulse">
            <FaAward className="mr-2 text-lg" /> {pub.entryTags.award}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-2 pt-4 border-t border-slate-100 dark:border-slate-700/50 items-center justify-end">
          {pub.entryTags.url && (
            <ActionButton href={pub.entryTags.url} icon={<FaFilePdf />} label="PDF" />
          )}
          
          {pub.entryTags.video && (
            <ActionButton href={pub.entryTags.video} icon={<FaVideo />} label="Video" />
          )}

          {pub.entryTags.code && (
            <ActionButton href={pub.entryTags.code} icon={<FaCode />} label="Code" />
          )}
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-white transition-all transform hover:-translate-y-0.5"
  >
    <span className="mr-1.5">{icon}</span> {label}
  </a>
);

export default Publications;
