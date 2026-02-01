"use client";

import React, { useState, useMemo } from 'react';
import { Publication, getPublicationType } from '@/lib/bibtex';
import { FaFilePdf, FaVideo, FaCode, FaAward, FaSearch, FaLayerGroup, FaUsers, FaBook, FaLaptopCode, FaCalendarAlt, FaBrain, FaRobot, FaCheckDouble, FaVial, FaShieldAlt, FaTimes } from 'react-icons/fa';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface PublicationsProps {
  publications: Publication[];
}

const Publications: React.FC<PublicationsProps> = ({ publications }) => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredPubs = useMemo(() => {
    const searchLower = search.toLowerCase();
    return publications.filter(pub => {
      // Type Filter
      if (filter !== 'all') {
        const type = getPublicationType(pub);
        if (filter === 'recent') {
          const year = parseInt(pub.entryTags.year || '0');
          if (year < 2020) return false;
        } else if (filter === 'paper-conf' && type !== 'conference') return false;
        else if (filter === 'paper-jour' && type !== 'journal') return false;
        else if (filter === 'paper-work' && type !== 'workshop') return false;
        else if (filter.startsWith('kw-')) {
          const keywords = pub.entryTags.keywords?.toLowerCase() || '';
          if (filter === 'kw-learning' && !keywords.includes('learning')) return false;
          if (filter === 'kw-planning' && !keywords.includes('planning')) return false;
          if (filter === 'kw-verification' && !keywords.includes('verification')) return false;
          if (filter === 'kw-testing' && !keywords.includes('testing')) return false;
          if (filter === 'kw-risk' && !keywords.includes('risk')) return false;
        }
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
  }, [publications, filter, search]);

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
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-12 py-3 border-none rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="Search publications..."
            aria-label="Search publications"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
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
            <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} icon={<FaLayerGroup />}>All</FilterButton>
            <FilterButton active={filter === 'paper-conf'} onClick={() => setFilter('paper-conf')} icon={<FaUsers />}>Conferences</FilterButton>
            <FilterButton active={filter === 'paper-jour'} onClick={() => setFilter('paper-jour')} icon={<FaBook />}>Journals</FilterButton>
            <FilterButton active={filter === 'paper-work'} onClick={() => setFilter('paper-work')} icon={<FaLaptopCode />}>Workshops</FilterButton>
            <FilterButton active={filter === 'recent'} onClick={() => setFilter('recent')} icon={<FaCalendarAlt />}>Recent (2020+)</FilterButton>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
            <FilterButton active={filter === 'kw-learning'} onClick={() => setFilter('kw-learning')} icon={<FaBrain />}>Learning</FilterButton>
            <FilterButton active={filter === 'kw-planning'} onClick={() => setFilter('kw-planning')} icon={<FaRobot />}>Planning</FilterButton>
            <FilterButton active={filter === 'kw-verification'} onClick={() => setFilter('kw-verification')} icon={<FaCheckDouble />}>Verification</FilterButton>
            <FilterButton active={filter === 'kw-testing'} onClick={() => setFilter('kw-testing')} icon={<FaVial />}>Testing</FilterButton>
            <FilterButton active={filter === 'kw-risk'} onClick={() => setFilter('kw-risk')} icon={<FaShieldAlt />}>Risk</FilterButton>
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
  
  const typeColors = {
    conference: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    journal: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    workshop: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300',
    other: 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300'
  };

  const badgeClass = typeColors[type as keyof typeof typeColors] || typeColors.other;

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden group">
      {/* Decorative Index Number */}
      <div aria-hidden="true" className="absolute -right-4 -top-4 text-9xl font-bold text-slate-100 dark:text-slate-800/50 opacity-50 pointer-events-none select-none transition-transform group-hover:scale-110 duration-500">
        {index}
      </div>

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {pub.entryTags.title}
          </h3>
        </div>
        
        <div className="text-slate-600 dark:text-slate-300 font-medium">
          {pub.entryTags.author?.replace(/ and /g, ', ')}
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 italic">
          <span className="font-semibold not-italic text-slate-700 dark:text-slate-200">
            {pub.entryTags.booktitle}
          </span>
          {pub.entryTags.year && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 not-italic font-medium">
              {pub.entryTags.year}
            </span>
          )}
        </div>

        {pub.entryTags.award && (
          <div className="flex items-center text-amber-600 dark:text-amber-400 text-sm font-bold mt-1 animate-pulse">
            <FaAward className="mr-2 text-lg" /> {pub.entryTags.award}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 items-center">
          <span className={clsx("text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide", badgeClass)}>
            {type}
          </span>

          <div className="flex-grow"></div>

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
