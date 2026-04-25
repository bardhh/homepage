"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaGithub, FaLinkedin, FaSitemap } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiGooglescholar } from 'react-icons/si';

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mql.matches) return;

  const onScroll = () => {
    const bg = bgRef.current;
    const el = headerRef.current;
    if (!bg || !el) return;
    // How far the page has scrolled, normalized by the header's own height.
    // At scrollY=0 -> 0px offset. At scrollY=headerHeight -> 80px offset.
    const progress = Math.min(1, Math.max(0, window.scrollY / el.offsetHeight));
    bg.style.setProperty('--par-y', `${progress * 80}px`);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}, []);

  return (
    <header ref={headerRef} className="relative w-full h-[400px] overflow-hidden">
      <style>{`
        @keyframes bkgPan {
          from { background-position: 0% center; }
          to   { background-position: 30% center; }
        }
        .bkg-pan-parallax {
          position: absolute; inset: -12% 0;
          background-image: url('/assets/bkg2.webp');
          background-size: 140% auto;
          background-repeat: no-repeat;
          transform: translateY(var(--par-y, 0px)) scale(1.08);
          will-change: transform, background-position;
          animation: bkgPan 45s linear infinite alternate;
          transition: transform 0.08s linear;
        }
        @media (max-width: 767px) {
          .bkg-pan-parallax {
            background-size: cover;
            background-position: center 30%;
            animation: none;
            transform: none;
            inset: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .bkg-pan-parallax { animation: none; transform: none; }
        }
      `}</style>

      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div ref={bgRef} className="bkg-pan-parallax" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/40 via-70% to-slate-50 dark:to-slate-900 backdrop-blur-[1px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-12 pb-4 md:pb-10">

          {/* Profile Image */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-white/30 to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative w-[140px] h-[140px] md:w-[220px] md:h-[220px] rounded-2xl overflow-hidden ring-1 ring-white/15 shadow-lg shadow-black/30">
              <Image 
                src="/assets/profile.webp" 
                alt="Dr. Bardh Hoxha" 
                fill 
                className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                priority
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-grow text-center md:text-left space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white font-heading">
                Bardh Hoxha
              </h1>
              <div className="space-y-1">
                <p className="text-xl md:text-2xl text-blue-200 font-light tracking-wide">
                  Senior Principal Scientist
                </p>
                <p className="text-lg md:text-xl text-slate-300 font-medium">
                  Toyota Research Institute of North America (TRINA)
                </p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-5 justify-center md:justify-start pt-2">
              <SocialLink href="https://x.com/bardhhoxha" icon={<FaXTwitter size={22} />} label="X (Twitter)" />
              <SocialLink href="https://github.com/bardhh" icon={<FaGithub size={22} />} label="GitHub" />
              <SocialLink href="https://www.linkedin.com/in/bardhhoxha" icon={<FaLinkedin size={22} />} label="LinkedIn" />
              <SocialLink href="https://scholar.google.com/citations?user=kK7LubkAAAAJ&hl=en" icon={<SiGooglescholar size={22} />} label="Google Scholar" />
              <SocialLink href="/media/geneaolgy.pdf" icon={<FaSitemap size={22} />} label="Mathematical Genealogy" />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="relative p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl max-md:bg-white/20 md:backdrop-blur-md border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 group"
    aria-label={label}
    title={label}
  >
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900/95 text-white text-sm font-medium rounded-lg backdrop-blur-md border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity duration-200 shadow-xl">
      {label}
      <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900/95"></span>
    </span>
    <span className="opacity-80 group-hover:opacity-100 transition-opacity">
      {icon}
    </span>
  </a>
);

export default Header;
