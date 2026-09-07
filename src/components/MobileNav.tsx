"use client";

import React, { useRef, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import {
  FaUser,
  FaBookOpen,
  FaCertificate,
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
  { id: 'patents', label: 'Patents', icon: <FaCertificate /> },
  { id: 'research', label: 'Research', icon: <FaMicroscope /> },
  { id: 'teaching', label: 'Teaching', icon: <FaChalkboardTeacher /> },
  { id: 'software', label: 'Software', icon: <FaLaptopCode /> },
  { id: 'contact', label: 'Contact', icon: <FaEnvelope /> },
];

const emptySubscribe = () => () => {};

const MobileNav = () => {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef('');
  const navigating = useRef(false);
  const { resolvedTheme: theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const open = () => {
    navigating.current = false;
    previousOverflow.current = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = 'hidden';
  };
  const closed = () => {
    document.body.style.overflow = previousOverflow.current;
    if (!navigating.current) trigger.current?.focus();
  };

  return (
    <div className="lg:hidden">
      {/* Floating hamburger button */}
      <button
        ref={trigger}
        onClick={open}
        aria-haspopup="dialog"
        aria-controls="mobile-navigation"
        className="fixed top-4 right-4 z-50 p-3 bg-white/90 dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-all"
        aria-label="Open navigation menu"
      >
        <FaBars className="text-lg" />
      </button>

      <dialog
        ref={dialog}
        id="mobile-navigation"
        aria-label="Navigation menu"
        className="fixed top-0 left-auto right-0 m-0 h-dvh max-h-none w-72 max-w-[90vw] bg-white dark:bg-slate-900 shadow-2xl border-none p-0 text-inherit backdrop:bg-black/60 overflow-y-auto overscroll-contain"
        onClose={closed}
        onKeyDown={event => {
          if (event.key !== 'Tab') return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }}
        onClick={event => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current?.close();
        }}
      >
        <div className="flex flex-col h-full p-6">
          {/* Close button */}
          <div className="flex justify-between items-center mb-8">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </span>
            <button
              onClick={() => dialog.current?.close()}
              className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close navigation menu"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Nav links */}
          <nav aria-label="Mobile page sections" className="flex flex-col space-y-1 flex-grow">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`${pathname === "/" ? "" : "/"}#${section.id}`}
                onClick={() => { navigating.current = true; dialog.current?.close(); }}
                className="flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all duration-200 font-medium"
              >
                <span className="mr-3 text-slate-400">{section.icon}</span>
                {section.label}
              </a>
            ))}
          </nav>

          {/* Theme toggle */}
          {mounted && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
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
      </dialog>
    </div>
  );
};

export default MobileNav;
