import React from 'react';
import fs from 'fs';
import path from 'path';
import { parseBibtex } from '@/lib/bibtex';
import Publications from '@/components/Publications';
import ResearchAreas from '@/components/ResearchAreas';
import Software from '@/components/Software';
import Teaching from '@/components/Teaching';
import Contact from '@/components/Contact';

// Note: In a real Next.js app with "use client", we can't use fs directly.
// However, for this specific setup where data is static or passed down, we might need a different approach.
// Since the original file used fs in a server component (default), and I'm switching to client for animations,
// I should ideally keep the data fetching on the server.
// BUT, to keep it simple and consistent with the "visual overhaul" request without refactoring the entire data flow,
// I will assume the data fetching happens in a parent or I'll revert to a server component that passes data to a client wrapper.
// ACTUALLY, the best approach here is to keep the page as a Server Component and use a Client Component wrapper for the animations.
// OR, just make the sections themselves client components (which they likely are or can be).
// Let's check the imports. Publications is a client component.
// The page itself was async, so it's a server component. I should NOT make the page "use client".
// I will revert the "use client" at the top and keep it as a server component, but I can't use motion.div directly in the server component body easily without a wrapper.
// However, I can style the static HTML and let the client components handle their own animations.
// Wait, I want to animate the SECTIONS.
// I will create a simple "SectionWrapper" client component to handle the reveal animation.

// Let's write the SectionWrapper first in a separate file? No, I can't create new files easily without asking.
// I will just style the page for now and maybe add a simple client wrapper if needed, or just rely on the components being animated.
// Actually, I can make a `Reveal` component in this file if I make the whole file client? No, `fs` will break.
// Okay, I will keep `page.tsx` as a Server Component. I will improve the styling of the "Welcome" section.
// I will leave the scroll animations to the individual components if possible, or just use CSS animations for the server rendered parts.
// Let's stick to CSS animations for the Welcome section to avoid complexity.

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

export default async function Home() {
  const publications = await getPublications();

  return (
    <div className="space-y-24 pb-24">
      
      {/* About Me Section */}
      <section id="bio" className="scroll-mt-32 animate-fade-in-up">
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
              (<a href="https://amrd.toyota.com/division/trina/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium no-underline border-b-2 border-blue-500/30 hover:border-blue-500 transition-colors">TRINA</a>) 
              in Ann Arbor, Michigan. My research interests include Testing and Verification of Cyber-Physical Systems (CPS), 
              Temporal Logics, and Motion Planning and Control for Autonomous Systems. Over the past few years, I have worked on 
              verification and synthesis methods for autonomous mobile systems to support future mobility initiatives. In particular, 
              applying formal methods in the perception - planning - control loop in open-world environments.
            </p>
            <p>
              I have served on the program committee for AAAI 23,{' '}
              <a href="https://hscc.acm.org/2023/organizers/" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 no-underline hover:underline">HSCC 23</a>,{' '}
              <a href="https://hscc.acm.org/2022/organizers/" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 no-underline hover:underline">HSCC 22</a>,{' '}
              <a href="https://conf.researchr.org/committee/nfm-2023/nfm-2023-papers-program-committee" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 no-underline hover:underline">NFM 23</a>,{' '}
              <a href="https://nfm2022.caltech.edu/#organization" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 no-underline hover:underline">NFM 22</a>. 
              I have chaired repeatability evaluation for{' '}
              <a href="https://hscc.acm.org/2021/" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 no-underline hover:underline">HSCC 2021</a>,{' '}
              <a href="https://berkeleylearnverify.github.io/HSCC_2020/#committees" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 no-underline hover:underline">HSCC 2020</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <Publications publications={publications} />

      {/* Research Areas Section */}
      <ResearchAreas />

      {/* Teaching Section */}
      <Teaching />

      {/* Software Section */}
      <Software />

      {/* Contact Section */}
      <Contact />

    </div>
  );
}
