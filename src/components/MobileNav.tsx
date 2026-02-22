"use client";

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import {
  FaUser,
  FaBookOpen,
  FaMicroscope,
  FaChalkboardTeacher,
  FaLaptopCode,
  FaEnvelope,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

const sections = [
  { id: 'bio', label: 'About', icon: <FaUser /> },
  { id: 'publications', label: 'Publications', icon: <FaBookOpen /> },
  { id: 'research', label: 'Research', icon: <FaMicroscope /> },
  { id: 'teaching', label: 'Teaching', icon: <FaChalkboardTeacher /> },
  { id: 'software', label: 'Software', icon: <FaLaptopCode /> },
  { id: 'contact', label: 'Contact', icon: <FaEnvelope /> },
];

const emptySubscribe = () => () => {};

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      {/* Floating hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-all"
        aria-label="Open navigation menu"
      >
        <FaBars className="text-lg" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out menu */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full p-6">
          {/* Close button */}
          <div className="flex justify-between items-center mb-8">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close navigation menu"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col space-y-1 flex-grow">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all duration-200 font-medium"
              >
                <span className="mr-3 text-slate-400">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </nav>

          {/* Theme toggle */}
          {mounted && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 group"
              >
                <span className="group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
                {theme === 'dark' ? (
                  <FaSun className="text-yellow-500" />
                ) : (
                  <FaMoon className="text-blue-500" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
