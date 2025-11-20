"use client";

import React from 'react';
import { useTheme } from 'next-themes';
import { FaUser, FaBookOpen, FaMicroscope, FaChalkboardTeacher, FaLaptopCode, FaEnvelope, FaSun, FaMoon } from 'react-icons/fa';

const Sidebar = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="hidden lg:block col-span-3 sticky top-8 h-fit">
      <div className="glass rounded-2xl p-6 space-y-8 transition-all duration-300 hover:shadow-xl border border-white/40 dark:border-slate-700/40">
        <nav className="flex flex-col space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-4">Navigation</p>
          <NavButton onClick={() => scrollToSection('bio')} icon={<FaUser />} label="About Me" />
          <NavButton onClick={() => scrollToSection('publications')} icon={<FaBookOpen />} label="Publications" />
          <NavButton onClick={() => scrollToSection('research')} icon={<FaMicroscope />} label="Research Areas" />
          <NavButton onClick={() => scrollToSection('teaching')} icon={<FaChalkboardTeacher />} label="Teaching" />
          <NavButton onClick={() => scrollToSection('software')} icon={<FaLaptopCode />} label="Software" />
          <NavButton onClick={() => scrollToSection('contact')} icon={<FaEnvelope />} label="Contact" />
        </nav>
        
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
};

const NavButton = ({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button 
    onClick={onClick} 
    className="group flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all duration-200 font-medium"
  >
    <span className="mr-3 text-slate-400 group-hover:text-blue-500 transition-colors">{icon}</span>
    {label}
  </button>
);

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 group"
    >
      <span className="group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </span>
      {theme === 'dark' ? (
        <FaSun className="text-yellow-500 group-hover:rotate-90 transition-transform duration-500" />
      ) : (
        <FaMoon className="text-blue-500 group-hover:-rotate-12 transition-transform duration-500" />
      )}
    </button>
  );
}

export default Sidebar;
