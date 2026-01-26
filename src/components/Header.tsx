import React from 'react';
import Image from 'next/image';
import { FaTwitter, FaGithub, FaLinkedin, FaSitemap } from 'react-icons/fa';
import { SiGooglescholar } from 'react-icons/si';

const Header = () => {
  return (
    <header className="relative w-full h-[500px] md:h-[400px] overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/bkg2.webp"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/90 backdrop-blur-[2px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12 pb-10">
          
          {/* Profile Image */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
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
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white font-heading">
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
              <SocialLink href="https://twitter.com/bardhhoxha" icon={<FaTwitter size={22} />} label="Twitter" />
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
    className="relative p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 group"
    aria-label={label}
    title={label}
  >
    {/* Tooltip */}
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900/95 text-white text-sm font-medium rounded-lg backdrop-blur-md border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-xl">
      {label}
      <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900/95"></span>
    </span>
    <span className="opacity-80 group-hover:opacity-100 transition-opacity">
      {icon}
    </span>
  </a>
);

export default Header;
