import React from 'react';
import fs from 'fs';
import path from 'path';
import { parseBibtex } from '@/lib/bibtex';
import dynamic from 'next/dynamic';

const Publications = dynamic(() => import('@/components/Publications'));
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
    <div className="space-y-12 pb-24">

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
              (<ExternalLink href="https://amrd.toyota.com/division/trina/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium no-underline border-b-2 border-blue-500/30 hover:border-blue-500 transition-colors" showIcon={false}>TRINA</ExternalLink>)
              in Ann Arbor, Michigan. My research interests include Testing and Verification of Cyber-Physical Systems (CPS),
              Temporal Logics, and Motion Planning and Control for Autonomous Systems. Over the past few years, I have worked on
              verification and synthesis methods for autonomous mobile systems to support future mobility initiatives. In particular,
              applying formal methods in the perception - planning - control loop in open-world environments.
            </p>
            <p>
              I have served on the program committee for{' '}
              <ExternalLink href="https://www.usenix.org/conference/vehiclesec26#organizers" className={linkClass} showIcon={false}>VehicleSec 26</ExternalLink>,{' '}
              <ExternalLink href="https://rv2026.smithengineering.queensu.ca/committees/" className={linkClass} showIcon={false}>RV 26</ExternalLink>,{' '}
              <ExternalLink href="https://easychair.org/cfp/nfm-2026" className={linkClass} showIcon={false}>NFM 26</ExternalLink>,{' '}
              <ExternalLink href="https://hscc-iccps26.hotcrp.com/users/pc" className={linkClass} showIcon={false}>ICCPS/HSCC 26</ExternalLink>,{' '}
              <ExternalLink href="https://rv25.isec.tugraz.at/committees/" className={linkClass} showIcon={false}>RV 25</ExternalLink>,{' '}
              <ExternalLink href="https://hscc.acm.org/2025/organizers/" className={linkClass} showIcon={false}>HSCC 25</ExternalLink>,{' '}
              <ExternalLink href="https://hscc.acm.org/2024/organizers/" className={linkClass} showIcon={false}>HSCC 24</ExternalLink>,{' '}
              AAAI 23,{' '}
              <ExternalLink href="https://hscc.acm.org/2023/organizers/" className={linkClass} showIcon={false}>HSCC 23</ExternalLink>,{' '}
              <ExternalLink href="https://conf.researchr.org/profile/nfm-2023/bardhhoxha" className={linkClass} showIcon={false}>NFM 23</ExternalLink>,{' '}
              AutoSec 22,{' '}
              <ExternalLink href="https://hscc.acm.org/2022/organizers/" className={linkClass} showIcon={false}>HSCC 22</ExternalLink>,{' '}
              <ExternalLink href="https://nfm2022.caltech.edu/#organization" className={linkClass} showIcon={false}>NFM 22</ExternalLink>,{' '}
              <ExternalLink href="https://sites.google.com/virginia.edu/mt-cps2021/committes" className={linkClass} showIcon={false}>MT-CPS 21</ExternalLink>,{' '}
              <ExternalLink href="https://www.ieee-security.org/TC/SPW2020/SafeThings/" className={linkClass} showIcon={false}>SafeThings 20</ExternalLink>,{' '}
              <ExternalLink href="https://sites.google.com/view/mt-cps2020/" className={linkClass} showIcon={false}>MT-CPS 20</ExternalLink>.
              I have chaired repeatability evaluation for{' '}
              <ExternalLink href="https://hscc.acm.org/2021/organizers/" className={linkClass} showIcon={false}>HSCC 2021</ExternalLink>,{' '}
              <ExternalLink href="https://berkeleylearnverify.github.io/HSCC_2020/" className={linkClass} showIcon={false}>HSCC 2020</ExternalLink>.
            </p>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <Reveal>
        <div className="section-divider">
          <Publications publications={publications} />
        </div>
      </Reveal>

      {/* Research Areas Section */}
      <Reveal delay={0.1}>
        <div className="section-divider">
          <ResearchAreas />
        </div>
      </Reveal>

      {/* Teaching Section */}
      <Reveal delay={0.1}>
        <div className="section-divider">
          <Teaching />
        </div>
      </Reveal>

      {/* Software Section */}
      <Reveal delay={0.1}>
        <div className="section-divider">
          <Software />
        </div>
      </Reveal>

      {/* Contact Section */}
      <Reveal delay={0.1}>
        <div className="section-divider">
          <Contact />
        </div>
      </Reveal>

    </div>
  );
}
