import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiGooglescholar } from 'react-icons/si';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-slate-200 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-10">
        {/* Quick Links + Social */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500 dark:text-slate-400" aria-label="Footer navigation">
            <a href="#bio" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</a>
            <a href="#publications" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Publications</a>
            <a href="#research" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Research</a>
            <a href="#teaching" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Teaching</a>
            <a href="#software" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Software</a>
            <a href="#contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a>
          </nav>

          <div className="flex gap-3">
            <FooterSocial href="https://github.com/bardhh" label="GitHub" icon={<FaGithub />} />
            <FooterSocial href="https://www.linkedin.com/in/bardhhoxha" label="LinkedIn" icon={<FaLinkedin />} />
            <FooterSocial href="https://x.com/bardhhoxha" label="X (Twitter)" icon={<FaXTwitter />} />
            <FooterSocial href="https://scholar.google.com/citations?user=kK7LubkAAAAJ&hl=en" label="Google Scholar" icon={<SiGooglescholar />} />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent mb-6" />

        {/* Copyright */}
        <p className="text-center text-slate-400 dark:text-slate-500 text-sm">
          &copy; {year} Bardh Hoxha. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

const FooterSocial = ({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
  >
    <span className="text-lg">{icon}</span>
  </a>
);

export default Footer;
