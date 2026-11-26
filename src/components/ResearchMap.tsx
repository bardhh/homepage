'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { FiArrowLeft, FiArrowRight, FiBarChart2, FiMoon, FiSun, FiShare2, FiX } from 'react-icons/fi';
import ResearchNetwork from './ResearchNetwork';
import MapSearch from './MapSearch';
import { applications, concepts, closestPapers, type MapPaper } from '@/lib/research-map';
import { publicationPath } from '@/lib/publication-utils';
import styles from './ResearchMap.module.css';
import PaperTimeline from './PaperTimeline';

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener('map-selection', callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('map-selection', callback);
  };
}
function updateMap(changes: Record<string, string | null>) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(changes)) {
    if (value === null) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  }
  url.hash = '';
  if (url.href === location.href) return;
  window.history.pushState(null, '', url);
  window.dispatchEvent(new Event('map-selection'));
}

function select(id: string) {
  const isConcept = concepts.some(c => c.id === id);
  const isApplication = applications.some(a => a.id === id);
  updateMap({
    paper: id && !isConcept && !isApplication ? id : null,
    concept: isConcept ? id : null,
    application: isApplication ? id : null,
    year: null,
  });
}

export default function ResearchMap({ papers }: { papers: MapPaper[] }) {
  const query = useSyncExternalStore(subscribe, () => location.search, () => '');
  const params = new URLSearchParams(query);
  const timeline = params.get('view') === 'timeline';
  const paper = papers.find(p => p.id === params.get('paper'));
  // Preserve links shared before the security concept was renamed.
  const conceptId = params.get('concept');
  const concept = concepts.find(c => c.id === (conceptId === 'interactions' ? 'security' : conceptId));
  const application = applications.find(a => a.id === params.get('application'));
  const group = concept || application;
  const selected = paper?.id || group?.id || '';
  const {resolvedTheme, setTheme} = useTheme();
  const dateYears = papers.map(p => p.year).filter(Boolean).sort();
  const nearby = paper ? closestPapers(paper,papers) : [];
  const members = group ? papers.filter(p =>
    (concept ? p.concepts : p.applications).includes(group.id)) : [];
  const relatedGroups = concept
    ? applications.filter(a => members.some(p => p.applications.includes(a.id)))
    : concepts.filter(c => members.some(p => p.concepts.includes(c.id)));
  return <>
    <header className={styles.mast}>
      <Link prefetch={false} className={styles.identity} href="/"><FiArrowLeft aria-hidden="true"/> Bardh Hoxha</Link>
      <nav aria-label="Map view" className={styles.switcher}>
        <button aria-pressed={!timeline} onClick={() => updateMap({view:null,year:null})}><FiShare2/>Network</button>
        <button aria-pressed={timeline} onClick={() => updateMap({view:'timeline'})}><FiBarChart2/>Timeline</button>
      </nav>
      <div className={styles.mastRight}>
        <Link prefetch={false} href="/publications/">Publication archive <span aria-hidden="true">↗</span></Link>
        <button aria-label="Switch color theme" onClick={() => setTheme(resolvedTheme==='dark'?'light':'dark')}>
          <FiSun className={styles.sun}/><FiMoon className={styles.moon}/>
        </button>
      </div>
    </header>
    <div className={styles.sheet}>
      <div className={styles.intro}>
        <div>
          <h1>{timeline ? 'Publication timeline' : 'Research network'}</h1>
          <p>{timeline ? 'Choose a year to explore its papers.' : 'Select a concept, paper, or application to trace its connections.'}</p>
        </div>
        <div className={styles.tools}><MapSearch papers={papers} choose={select}/></div>
      </div>
      {selected && <div className={styles.selection}>
        <button aria-label="Clear selection" onClick={() => select('')}><FiX/></button>
        <span>{paper?.title || group?.name}</span>
        {!timeline && <a href="#map-selection">Details ↓</a>}
      </div>}
      {timeline ? <PaperTimeline
        papers={paper ? [paper,...nearby.map(n=>n.paper)] : group ? members : papers}
        heading={paper ? 'Selected paper and connections' : group?.name || 'All publications'}
        year={params.get('year')} onYearChange={year=>updateMap({year})}
        notes={new Map(nearby.map(n=>[n.paper.id,n.direct?n.relation:'Shared · '+n.relation]))}
        selectedPaper={paper?.id}
      /> : <div className={styles.workspace}>
        <ResearchNetwork papers={papers} selected={selected} choose={select}
          chooseYear={year=>updateMap({view:'timeline',year,paper:null,concept:null,application:null})}/>
        <aside id="map-selection" className={styles.detail} aria-label="Map selection">
          {paper ? <>
            <p className={styles.micro}>Paper · {paper.year}</p>
            <h2>{paper.title}</h2>
            <a className={styles.open} href={publicationPath({citationKey:paper.id})}>Open paper <FiArrowRight/></a>
            <h3>Concepts</h3>
            <div className={styles.chips}>{paper.concepts.map(id=><button key={id} onClick={()=>select(id)}>{concepts.find(c=>c.id===id)!.name}</button>)}</div>
            {paper.applications.length > 0 && <>
              <h3>Applications</h3>
              <div className={styles.chips}>{applications.filter(a => paper.applications.includes(a.id)).map(a =>
                <button key={a.id} onClick={() => select(a.id)}>{a.name}</button>)}</div>
            </>}
            {nearby.length>0 && <h3>Closest papers</h3>}
            {nearby.map(n=><button key={n.paper.id} className={styles.entry} onClick={()=>select(n.paper.id)}>
              <small>{n.paper.year} · {n.direct?'Documented connection':'Shared concept'}</small>
              <strong>{n.paper.title}</strong><span>{n.relation}</span>
            </button>)}
          </> : group ? <>
            <p className={styles.micro}>{concept ? 'Concept' : 'Application'} · {members.length} {members.length===1?'paper':'papers'}</p>
            <h2>{group.name}</h2>
            {application && <p className={styles.scopeNote}>{application.description}</p>}
            <button className={styles.open} onClick={()=>updateMap({view:'timeline'})}>Follow over time <FiArrowRight/></button>
            {relatedGroups.length > 0 && <>
              <h3>{concept ? 'Applications' : 'Concepts'}</h3>
              <div className={styles.chips}>{relatedGroups.map(g =>
                <button key={g.id} onClick={() => select(g.id)}>{g.name}</button>)}</div>
            </>}
            <h3>Papers</h3>
            {members.map(p=><button key={p.id} className={styles.entry} onClick={()=>select(p.id)}><small>{p.year}</small><strong>{p.title}</strong></button>)}
          </> : <>
            <p className={styles.micro}>Collection</p>
            <div className={styles.facts}><div><b>{papers.length}</b><span>Papers</span></div><div><b>{concepts.length}</b><span>Concepts</span></div><div><b>{applications.length}</b><span>Applications</span></div></div>
            <p className={styles.range}>{dateYears[0]} — {dateYears.at(-1)}</p>
            <h3>Start with a paper</h3>
            {['Tran25-CAV','STTT2024','Zhao25'].map(id=>{
              const start = papers.find(p=>p.id===id);
              return start && <button key={id} className={styles.entry} onClick={()=>select(id)}>
                <small>{start.year} · {concepts.find(c=>c.id===start.concepts[0])?.name}</small>
                <strong>{start.title}</strong>
              </button>;
            })}
          </>}
        </aside>
      </div>}
    </div>
  </>;
}
