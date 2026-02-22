"use client";

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { FaUser, FaBookOpen, FaMicroscope, FaChalkboardTeacher, FaLaptopCode, FaEnvelope, FaSun, FaMoon } from 'react-icons/fa';
import clsx from 'clsx';

const emptySubscribe = () => () => {};

const sections = [
  { id: 'bio', label: 'About Me', icon: <FaUser /> },
  { id: 'publications', label: 'Publications', icon: <FaBookOpen /> },
  { id: 'research', label: 'Research Areas', icon: <FaMicroscope /> },
  { id: 'teaching', label: 'Teaching', icon: <FaChalkboardTeacher /> },
  { id: 'software', label: 'Software', icon: <FaLaptopCode /> },
  { id: 'contact', label: 'Contact', icon: <FaEnvelope /> },
];

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState('bio');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="hidden lg:block col-span-3 sticky top-8 h-fit">
      <div className="glass rounded-2xl p-6 space-y-8 transition-all duration-300 hover:shadow-xl border border-white/40 dark:border-slate-700/40">
        <nav className="flex flex-col space-y-2" aria-label="Page sections">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-4">Navigation</p>
          {sections.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={clsx(
                "group flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                activeSection === id
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
              )}
              aria-current={activeSection === id ? "true" : undefined}
            >
              <span className={clsx(
                "mr-3 transition-colors",
                activeSection === id
                  ? "text-blue-500"
                  : "text-slate-400 group-hover:text-blue-500"
              )}>
                {icon}
              </span>
              {label}
              {activeSection === id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" aria-hidden="true" />
              )}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
};

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
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
