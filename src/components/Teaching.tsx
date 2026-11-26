"use client";

import React, { useState, useId } from 'react';
import { FaChalkboardTeacher, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import clsx from 'clsx';
import { courses } from '@/data/courses';

const Teaching = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section tabIndex={-1} id="teaching" className="scroll-mt-24" role="region" aria-label="Teaching experience">
      <div className="mb-4">
        <h2 className="profile-title">Teaching</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Southern Illinois University</p>
      </div>

      <div className="space-y-1.5">
        {courses.map((course, index) => {
          const isOpen = openIndex === index;
          const headerId = `${baseId}-header-${index}`;
          const panelId = `${baseId}-panel-${index}`;
          const summary = (
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <FaChalkboardTeacher aria-hidden="true" className={clsx("shrink-0 text-sm", isOpen ? "text-blue-500" : "text-slate-400")} />
              <div className="min-w-0 flex-1 sm:flex sm:items-baseline sm:justify-between sm:gap-3">
                <h3 className="font-semibold text-sm leading-5">{course.title}</h3>
                <span className="block text-xs leading-4 text-slate-600 dark:text-slate-400 sm:shrink-0">{course.semester}</span>
              </div>
            </div>
          );

          if (!course.description && !course.link) {
            return (
              <div key={course.title} className="glass-card flex min-h-11 items-center rounded-lg px-4 py-2 sm:pr-10 text-slate-800 dark:text-slate-200">
                {summary}
              </div>
            );
          }

          return (
            <div key={course.title} className="glass-card rounded-lg">
              <button
                id={headerId}
                onClick={() => toggleAccordion(index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={clsx(
                  "flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-4 py-2 text-left transition-colors",
                  isOpen
                    ? "bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "hover:bg-slate-50/50 dark:hover:bg-slate-700/30 text-slate-800 dark:text-slate-200"
                )}
              >
                {summary}
                {isOpen ? <FaChevronUp aria-hidden="true" className="shrink-0 text-xs" /> : <FaChevronDown aria-hidden="true" className="shrink-0 text-xs" />}
              </button>

              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className="px-4 py-2 sm:pl-10 border-t border-slate-100/50 dark:border-slate-700/50"
                >
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-5">
                    {course.description}
                  </p>
                  {course.link && (
                    <a href={course.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
                      View Course Page &rarr;
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Teaching;
