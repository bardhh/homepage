import React from 'react';
import fs from 'fs';
import path from 'path';
import { parseBibtex } from '@/lib/bibtex';
import Publications from '@/components/Publications';
import ResearchAreas from '@/components/ResearchAreas';
import Software from '@/components/Software';
import Teaching from '@/components/Teaching';
import Contact from '@/components/Contact';
import Reveal from '@/components/Reveal';
import ExternalLink from '@/components/ExternalLink';

async function getPublications() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'publications.bib');
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    const parsed = parseBibtex(fileContent);
    return parsed;
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as { code: string }).code === 'ENOENT') {
      console.error('File not found:', path.join(process.cwd(), 'public', 'publications.bib'));
      return [];
    }
    console.error('Error in getPublications:', error);
    return [];
  }
}

const linkClass = "font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 no-underline hover:underline";

export default async function Home() {
  const publications = await getPublications();

  return (
    <div className="space-y-24 pb-24">

      {/* About Me Section */}
      <section id="bio" className="scroll-mt-32 animate-fade-in-up" role="region" aria-label="About me">
        <div className="flex items-center mb-8">
          <div className="h-10 w-1 bg-blue-500 rounded-full mr-4"></div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
            Welcome
          </h2>
        </div>

        <div className="glass rounded-2xl p-8 border border-white/40 dark:border-slate-700/40 shadow-sm">
          <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
            <p className="mb-6 first-letter:text-5xl first-letter:font-bold first-letter:text-blue-600 first-letter:mr-3 first-letter:float-left">
              I am a Senior Principal Scientist at Toyota Research Institute of North America
              (<ExternalLink href="https://amrd.toyota.com/division/trina/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium no-underline border-b-2 border-blue-500/30 hover:border-blue-500 transition-colors">TRINA</ExternalLink>)
              in Ann Arbor, Michigan. My research interests include Testing and Verification of Cyber-Physical Systems (CPS),
              Temporal Logics, and Motion Planning and Control for Autonomous Systems. Over the past few years, I have worked on
              verification and synthesis methods for autonomous mobile systems to support future mobility initiatives. In particular,
              applying formal methods in the perception - planning - control loop in open-world environments.
            </p>
            <p>
              I have served on the program committee for AAAI 23,{' '}
              <ExternalLink href="https://hscc.acm.org/2023/organizers/" className={linkClass}>HSCC 23</ExternalLink>,{' '}
              <ExternalLink href="https://hscc.acm.org/2022/organizers/" className={linkClass}>HSCC 22</ExternalLink>,{' '}
              <ExternalLink href="https://conf.researchr.org/committee/nfm-2023/nfm-2023-papers-program-committee" className={linkClass}>NFM 23</ExternalLink>,{' '}
              <ExternalLink href="https://nfm2022.caltech.edu/#organization" className={linkClass}>NFM 22</ExternalLink>.
              I have chaired repeatability evaluation for{' '}
              <ExternalLink href="https://hscc.acm.org/2021/" className={linkClass}>HSCC 2021</ExternalLink>,{' '}
              <ExternalLink href="https://berkeleylearnverify.github.io/HSCC_2020/#committees" className={linkClass}>HSCC 2020</ExternalLink>.
            </p>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <Reveal>
        <Publications publications={publications} />
      </Reveal>

      {/* Research Areas Section */}
      <Reveal delay={0.1}>
        <ResearchAreas />
      </Reveal>

      {/* Teaching Section */}
      <Reveal delay={0.1}>
        <Teaching />
      </Reveal>

      {/* Software Section */}
      <Reveal delay={0.1}>
        <Software />
      </Reveal>

      {/* Contact Section */}
      <Reveal delay={0.1}>
        <Contact />
      </Reveal>

    </div>
  );
}
