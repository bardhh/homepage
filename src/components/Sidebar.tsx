"use client";

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { FaUser, FaAward, FaMicrophoneAlt, FaUsers, FaBookOpen, FaCertificate, FaMicroscope, FaChalkboardTeacher, FaUserGraduate, FaLaptopCode, FaEnvelope, FaSun, FaMoon, FaSearch } from 'react-icons/fa';
import clsx from 'clsx';
import { sectionScrollStops } from '@/lib/section-navigation';
import VerificationRail from './verification/NetworkVerification';
import styles from './verification/verification.module.css';
import { usePathname } from 'next/navigation';

const emptySubscribe = () => () => {};

const sections = [
  { id: 'bio', label: 'About Me', icon: <FaUser /> },
  { id: 'research', label: 'Research Areas', icon: <FaMicroscope /> },
  { id: 'publications', label: 'Publications', icon: <FaBookOpen /> },
  { id: 'patents', label: 'Patents', icon: <FaCertificate /> },
  { id: 'teaching', label: 'Teaching', icon: <FaChalkboardTeacher /> },
  { id: 'mentorship', label: 'Mentorship', icon: <FaUserGraduate /> },
  { id: 'software', label: 'Software', icon: <FaLaptopCode /> },
  { id: 'honors', label: 'Honors', icon: <FaAward /> },
  { id: 'talks', label: 'Invited Talks', icon: <FaMicrophoneAlt /> },
  { id: 'service', label: 'Service', icon: <FaUsers /> },
  { id: 'contact', label: 'Contact', icon: <FaEnvelope /> },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('bio');
  const currentSection = pathname === '/' ? activeSection
    : pathname === '/publications' || pathname.startsWith('/publications/') ? 'publications' : '';

  useEffect(() => {
    if (pathname !== '/') return;
    const targets = sections.map(({ id }) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    let stops: number[] = [];
    let pending = -1;

    function currentIndex() {
      return stops.findLastIndex(top => top <= window.scrollY + 2);
    }
    function updateActive() {
      const current = targets[Math.max(0, currentIndex())];
      if (current) setActiveSection(current.id);
    }
    function measure() {
      stops = sectionScrollStops(targets);
      updateActive();
    }
    function clearPending() { pending = -1; }
    function onKey(event: KeyboardEvent) {
      if (event.key !== ' ' || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey ||
          event.isComposing || document.querySelector('dialog[open]')) return;
      const el = event.target;
      if (el instanceof HTMLElement && (el.isContentEditable ||
          el.closest('input, textarea, select, button, a[href], summary, video, audio, [role="button"], [role="textbox"]'))) return;

      let index: number;
      if (pending >= 0) index = pending + (event.shiftKey ? -1 : 1);
      else if (event.shiftKey) index = stops.findLastIndex(top => top < window.scrollY - 2);
      else index = currentIndex() + 1;
      const target = targets[index];
      if (!target) return;
      event.preventDefault();
      if (event.repeat) return;
      pending = index;
      if (location.hash !== '#' + target.id) window.history.pushState(null, '', '#' + target.id);
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: 'start' });
    }

    const resize = new ResizeObserver(measure);
    targets.forEach(target => resize.observe(target));
    resize.observe(document.body);
    measure();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('scrollend', clearPending);
    window.addEventListener('wheel', clearPending, { passive: true });
    window.addEventListener('pointerdown', clearPending);
    window.addEventListener('resize', measure);
    document.addEventListener('keydown', onKey);
    return () => {
      resize.disconnect();
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('scrollend', clearPending);
      window.removeEventListener('wheel', clearPending);
      window.removeEventListener('pointerdown', clearPending);
      window.removeEventListener('resize', measure);
      document.removeEventListener('keydown', onKey);
    };
  }, [pathname]);

  return (
    <>
      <aside className={clsx("hidden lg:block col-span-3 sticky top-8 h-fit", pathname === "/" && styles.profileRail)}>
        <div className="glass rounded-2xl p-6 space-y-8 transition-all duration-300 hover:shadow-xl border border-white/40 dark:border-slate-700/40">
          <nav className="flex flex-col space-y-2" aria-label="Page sections">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-4">Navigation</p>
            {sections.map(({ id, label, icon }) => (
              <a
                key={id}
                href={`${pathname === "/" ? "" : "/"}#${id}`}
                className={clsx(
                  "group flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                  currentSection === id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                )}
                aria-current={currentSection === id ? "location" : undefined}
              >
                <span className={clsx(
                  "mr-3 transition-colors",
                  currentSection === id
                    ? "text-blue-500"
                    : "text-slate-400 group-hover:text-blue-500"
                )}>
                  {icon}
                </span>
                {label}
                {currentSection === id && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" aria-hidden="true" />
                )}
              </a>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <ThemeToggle />
          </div>
        </div>
        {pathname === '/' && (
          <a
            href="#publication-search"
            className="mt-3 flex min-h-11 items-center gap-2.5 rounded-lg px-4 text-sm font-medium text-slate-600 underline-offset-4 hover:text-blue-700 hover:underline dark:text-slate-400 dark:hover:text-blue-300"
          >
            <FaSearch aria-hidden="true" className="text-xs" />
            Find a paper
          </a>
        )}
      </aside>
      {pathname === "/" && <VerificationRail />}
    </>
  );
};

function ThemeToggle() {
  const { resolvedTheme: theme, setTheme } = useTheme();
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
