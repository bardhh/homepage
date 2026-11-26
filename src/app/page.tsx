import React from 'react';
import { getPublications } from '@/lib/publications';
import dynamic from 'next/dynamic';

const Publications = dynamic(() => import('@/components/Publications'));
import Patents from '@/components/Patents';
import ResearchAreas from '@/components/ResearchAreas';
import Software from '@/components/Software';
import Teaching from '@/components/Teaching';
import ResearchMentorship from '@/components/ResearchMentorship';
import Contact from '@/components/Contact';
import Honors, { InvitedTalks } from '@/components/Honors';
import Service from '@/components/Service';
import Reveal from '@/components/Reveal';
import ExternalLink from '@/components/ExternalLink';


export default async function Home() {
  const publications = await getPublications();

  return (
    <div className="profile-content space-y-12 pb-24">

      {/* About Me Section */}
      <section tabIndex={-1} id="bio" className="scroll-mt-32 animate-fade-in-up" role="region" aria-label="About me">
        <div className="flex items-center mb-8">

          <h2 className="profile-title">
            Building Safer Autonomous Systems
          </h2>
        </div>

        <div className="glass rounded-2xl p-5 md:p-8 border border-white/40 dark:border-slate-700/40 shadow-sm">
          <div className="max-w-[70ch] text-[17px] leading-[1.55] text-slate-700 dark:text-slate-300">
            <p>
              My research at <ExternalLink href="https://amrd.toyota.com/division/trina/" className="font-medium text-blue-600 hover:underline dark:text-blue-400" showIcon={false}>Toyota Research Institute of North America</ExternalLink> focuses
              on the design and verification of autonomous and cyber-physical systems. Across perception, planning,
              and control, I use formal requirements both to design systems that are correct by construction and
              to determine what guarantees an existing design can support. My work also draws on statistical
              methods to quantify risk and on testing and runtime monitoring to identify where behavior departs
              from a specification. Those findings help identify which assumptions to revisit, which
              experiments to run next, and where to revise the design.
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

      {/* Patents Section */}
      <Reveal delay={0.1}>
        <div className="section-divider">
          <Patents />
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
