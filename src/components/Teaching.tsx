"use client";

import React, { useState, useId } from 'react';
import { FaChalkboardTeacher, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import clsx from 'clsx';

const courses = [
  {
    title: "CS 591: Testing and Verification of Cyber-Physical Systems",
    semester: "Fall 2018",
    university: "Southern Illinois University",
    description: "This course focused on the verification and testing of Cyber-Physical Systems (CPS). Topics included: Hybrid Automata, Reachability Analysis, Temporal Logics (LTL, MTL, STL), Falsification, and Data-Driven Verification.",
    link: "/legacy_site/CS591F18.html"
  },
  {
    title: "CS 499: Senior Project",
    semester: "Spring 2018",
    university: "Southern Illinois University",
    description: "Capstone project course for computer science seniors. Students worked in teams to design and implement significant software projects.",
    link: "/legacy_site/CS499S18.html"
  },
  {
    title: "CS 498: Senior Project",
    semester: "Fall 2017",
    university: "Southern Illinois University",
    description: "First part of the senior capstone sequence. Focus on requirements analysis, design, and prototyping.",
    link: "/legacy_site/CS498F17.html"
  },
  {
    title: "CS 290: Communication Skills",
    semester: "Fall 2017",
    university: "Southern Illinois University",
    description: "Course designed to improve technical communication skills, including writing technical reports and giving presentations.",
    link: "/legacy_site/CS290F17.html"
  }
];

const Teaching = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="teaching" className="scroll-mt-24" role="region" aria-label="Teaching experience">
      <div className="flex items-center mb-8">
        <div className="h-10 w-1 bg-blue-500 rounded-full mr-4"></div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
          Teaching
        </h2>
      </div>

      <div className="space-y-4">
        {courses.map((course, index) => {
          const isOpen = openIndex === index;
          const headerId = `${baseId}-header-${index}`;
          const panelId = `${baseId}-panel-${index}`;

          return (
            <div key={index} className="glass-card rounded-2xl overflow-hidden">
              <button
                id={headerId}
                onClick={() => toggleAccordion(index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={clsx(
                  "w-full px-6 py-4 text-left flex items-center justify-between transition-colors",
                  isOpen
                    ? "bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "hover:bg-slate-50/50 dark:hover:bg-slate-700/30 text-slate-800 dark:text-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <FaChalkboardTeacher className={clsx("text-xl", isOpen ? "text-blue-500" : "text-slate-400")} />
                  <div>
                    <span className="font-semibold block">{course.title}</span>
                    <span className="text-sm opacity-75 font-normal">{course.university} &bull; {course.semester}</span>
                  </div>
                </div>
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className="px-6 py-4 border-t border-slate-100/50 dark:border-slate-700/50"
                >
                  <p className="text-slate-600 dark:text-slate-300 mb-3 text-sm leading-relaxed">
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
