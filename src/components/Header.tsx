"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaGithub, FaLinkedin, FaSitemap } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const path = usePathname();
  if (path === '/cv' || path === '/cv/' || path === '/publications' || path.startsWith('/publications/')) {
    return (
      <header className="document-header border-b border-[var(--edge)]">
        <div className="container mx-auto flex h-[72px] items-center px-4">
          <Link href="/" className="text-lg font-semibold tracking-tight hover:underline underline-offset-4">Bardh Hoxha</Link>
        </div>
      </header>
    );
  }
  return <ProfileHeader />;
}

const ProfileHeader = () => {
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
        <div className="absolute inset-0 hero-overlay backdrop-blur-[1px]"></div>
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
              <h1 className="text-[38px] md:text-[64px] leading-none font-semibold tracking-[-.035em] text-white font-heading">
                Bardh Hoxha
              </h1>
              <div className="space-y-1">
                <p className="text-xl md:text-2xl text-[#f4f6f8] font-medium">
                  Senior Principal Scientist
                </p>
                <p className="text-lg md:text-xl text-[#e0e5ec] font-normal">
                  Toyota Research Institute of North America (TRINA)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-2 md:justify-start md:gap-x-4">
              <div className="flex items-center gap-4 text-sm font-semibold text-white md:text-base">
                <Link href="/cv/" className="inline-flex min-h-11 items-center underline decoration-white/45 underline-offset-4 hover:decoration-white">CV</Link>
                <a href="https://scholar.google.com/citations?user=kK7LubkAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline decoration-white/45 underline-offset-4 hover:decoration-white">Google Scholar</a>
              </div>
              <div className="flex items-center border-l border-white/30 pl-2 md:pl-4">
                <SocialLink href="https://github.com/bardhh" icon={<FaGithub />} label="GitHub" />
                <SocialLink href="https://www.linkedin.com/in/bardhhoxha" icon={<FaLinkedin />} label="LinkedIn" />
                <SocialLink href="https://x.com/bardhhoxha" icon={<FaXTwitter />} label="X (Twitter)" />
                <SocialLink href="/media/geneaolgy.pdf" icon={<FaSitemap />} label="Mathematical Genealogy" />
              </div>
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
    className="grid size-9 place-items-center rounded-md text-base text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white md:size-11"
    aria-label={label}
    title={label}
  >
    {icon}
  </a>
);
