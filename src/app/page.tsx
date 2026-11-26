import React from 'react';
import { researchSummary } from '@/data/profile';
import { getPublications } from '@/lib/publications';
import dynamic from 'next/dynamic';

const Publications = dynamic(() => import('@/components/Publications'));
import Patents from '@/components/Patents';
import ResearchAreas from '@/components/ResearchAreas';
import Software, { projects } from '@/components/Software';
import Teaching from '@/components/Teaching';
import ResearchMentorship from '@/components/ResearchMentorship';
import Contact from '@/components/Contact';
import Honors, { InvitedTalks } from '@/components/Honors';
import Service from '@/components/Service';
import Reveal from '@/components/Reveal';


export default async function Home() {
  const publications = await getPublications();

  const softwareNames = Object.fromEntries(projects.map(project => [project.paperKey, project.title.split(':')[0]]));

  return (
    <div className="profile-content space-y-12">

      {/* About Me Section */}
      <section tabIndex={-1} id="bio" className="scroll-mt-32 animate-fade-in-up" role="region" aria-label="About me">
        <div className="flex items-center mb-8">

          <h2 className="profile-title">
            Building Safer Autonomous Systems
          </h2>
        </div>

        <div className="glass rounded-2xl p-5 md:p-8 border border-white/40 dark:border-slate-700/40 shadow-sm">
          <div className="max-w-[70ch] text-[17px] leading-[1.55] text-slate-700 dark:text-slate-300">
            <p>{researchSummary}</p>
          </div>
        </div>
      </section>

      {/* Research Areas Section */}
      <Reveal delay={0.1}>
        <div className="section-divider">
          <ResearchAreas />
        </div>
      </Reveal>

      {/* Publications Section */}
      <Reveal>
        <div className="section-divider">
          <Publications publications={publications} softwareNames={softwareNames} />
        </div>
      </Reveal>

      {/* Patents Section */}
      <Reveal delay={0.1}>
        <div className="section-divider">
          <Patents />
        </div>
      </Reveal>

      {/* Teaching Section */}
      <Reveal delay={0.1}>
        <div className="section-divider">
          <Teaching />
        </div>
      </Reveal>

      <Reveal>
        <div className="section-divider"><ResearchMentorship publications={publications} /></div>
      </Reveal>

      {/* Software Section */}
      <Reveal delay={0.1}>
        <div className="section-divider">
          <Software />
        </div>
      </Reveal>

      <Reveal>
        <div className="section-divider"><Honors publications={publications} /></div>
      </Reveal>
      <Reveal>
        <div className="section-divider"><InvitedTalks /></div>
      </Reveal>
      <Reveal>
        <div className="section-divider"><Service /></div>
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
