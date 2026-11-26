'use client';

import Link from 'next/link';
import { useRef, useState, useSyncExternalStore, type MouseEvent } from 'react';
import { useTheme } from 'next-themes';
import { FiArrowLeft, FiArrowUpRight, FiChevronRight, FiDownload, FiMoon, FiSearch, FiSun, FiX } from 'react-icons/fi';
import { byId, landmarks, lineageTo, linkCount, normalizeName, recentLine, rootScholar, scholars, students, type Scholar } from '@/lib/genealogy';
import GenealogyChart from './GenealogyChart';
import styles from './Genealogy.module.css';

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener('genealogy-selection', callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('genealogy-selection', callback);
  };
}
const readSelection = () => new URLSearchParams(location.search).get('scholar') || '';
function navigate(event: MouseEvent<HTMLElement>) {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  const link = (event.target as Element).closest('a[href^="?scholar="]');
  if (!link) return;
  event.preventDefault();
  const target = new URL(link.getAttribute('href')!, location.href);
  if (target.href !== location.href) {
    history.pushState(null, '', target);
    window.dispatchEvent(new Event('genealogy-selection'));
  }
}
const readServerSelection = () => '';
const alphabetical = [...scholars].sort((a,b) => a.name.localeCompare(b.name, 'en'));
const searchable = alphabetical.map(person => ({
  person, text: normalizeName([person.name, person.institution, person.year].join(' ')),
}));

function ScholarSearch({openRecord}: {openRecord: () => void}) {
  const modal = useRef<HTMLDialogElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const terms = normalizeName(query).trim().split(/\s+/);
  const matches = searchable.filter(item => terms.every(term => item.text.includes(term)));
  return <>
    <button type="button" className={styles.searchButton} aria-haspopup="dialog" onClick={() => {
      setQuery(''); modal.current?.showModal(); field.current?.focus();
    }}><FiSearch aria-hidden="true"/> Find a scholar</button>
    <dialog ref={modal} className={styles.dialog} aria-labelledby="scholar-search-title">
      <header><h2 id="scholar-search-title">Find a scholar</h2><button aria-label="Close search" onClick={() => modal.current?.close()}><FiX/></button></header>
      <input ref={field} type="search" placeholder="Name, institution, or year" aria-label="Name, institution, or year"
        value={query} onChange={event => setQuery(event.target.value)} />
      <p aria-live="polite">{matches.length} {matches.length === 1 ? 'scholar' : 'scholars'}</p>
      <ul>{matches.map(({person}) => <li key={person.id}><a href={'?scholar='+person.id} onClick={() => {
        modal.current?.close(); openRecord();
      }}><span>{person.name}</span><small>{person.year}</small></a></li>)}</ul>
      {!matches.length && <p>Try another spelling or a shorter name.</p>}
    </dialog>
  </>;
}

function Relations({title, people}: {title: string; people: Scholar[]}) {
  if (!people.length) return null;
  return <div className={styles.relations}><h3>{title}</h3><ul>{people.map(p => <li key={p.id}>
    <a href={'?scholar='+p.id}><span>{p.name}</span><FiChevronRight aria-hidden="true"/></a>
  </li>)}</ul></div>;
}

export default function Genealogy() {
  const id = useSyncExternalStore(subscribe, readSelection, readServerSelection);
  const person = byId.get(id) || rootScholar;
  const atRoot = person === rootScholar;
  const trail = atRoot ? recentLine : lineageTo(person);
  const record = useRef<HTMLElement>(null);
  const {resolvedTheme, setTheme} = useTheme();
  function openRecord() {
    if (window.matchMedia('(max-width: 790px)').matches) requestAnimationFrame(() => {
      record.current?.focus({preventScroll:true});
      record.current?.scrollIntoView({block:'start'});
    });
  }
  const advisors = person.advisors.map(key => byId.get(key)!);
  const advisees = students.get(person.id)!;
  return <div className={styles.page} onClick={navigate}>
    <header className={styles.mast}>
      <Link href="/" className={styles.identity}><FiArrowLeft aria-hidden="true"/>Bardh Hoxha</Link>
      <nav aria-label="Genealogy navigation"><Link href="/research-map/">Research map <FiArrowUpRight aria-hidden="true"/></Link>
        <button aria-label="Switch color theme" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
          <FiSun className={styles.sun}/><FiMoon className={styles.moon}/></button></nav>
    </header>
    <div className={styles.sheet}>
      <div className={styles.intro}>
        <div><h1>Academic genealogy</h1><p>Trace my academic lineage through {scholars.length} scholars and {linkCount} advisor relationships.</p></div>
        <ScholarSearch openRecord={openRecord}/>
      </div>
      <section className={styles.workspace} aria-label="Explore the genealogy">
        <GenealogyChart selected={person} trail={trail} openRecord={openRecord}/>
        <aside ref={record} tabIndex={-1} className={styles.record} aria-label="Selected scholar">
          <p className={styles.eyebrow}>Selected scholar</p>
          <h2 aria-live="polite">{person.name}</h2>
          {person.year && <p className={styles.year}>{person.year}</p>}
          {person.institution && <p className={styles.institution}>{person.institution}</p>}
          <Relations title={advisors.length === 1 ? 'Advisor' : 'Advisors'} people={advisors}/>
          {!advisors.length && <p className={styles.endNote}>This branch ends here in the archived chart.</p>}
          <Relations title={advisees.length === 1 ? 'Student in this lineage' : 'Students in this lineage'} people={advisees}/>
          <div className={styles.recordActions}>
            {!atRoot && <a href={'?scholar='+rootScholar.id}><FiArrowLeft aria-hidden="true"/> Return to Bardh</a>}
            <button className={styles.backMap} onClick={() => {
              document.querySelector<SVGAElement>('[data-scholar="'+person.id+'"]')?.focus({preventScroll:true});
              document.getElementById('lineage-map')?.scrollIntoView({block:'start'});
            }}>Back to map ↑</button>
          </div>
        </aside>
      </section>
      <nav className={styles.landmarks} aria-label="Explore a branch">
        <strong>Explore a branch</strong>
        {landmarks.map(l => <a href={'?scholar='+l.id} key={l.id} onClick={openRecord}>{l.label}<FiArrowUpRight aria-hidden="true"/></a>)}
      </nav>
      <section className={styles.path} aria-labelledby="lineage-path-title">
        <div className={styles.pathHeading}><h2 id="lineage-path-title">{atRoot ? 'Recent advisor chain' : 'Path from Bardh Hoxha'}</h2>
          <p>{atRoot ? 'To the first branching point' : (trail.length - 1) + ' advisor ' + (trail.length === 2 ? 'link' : 'links') + ' · shortest recorded path'}</p></div>
        <ol>{trail.map((p,i) => <li key={p.id}><a href={'?scholar='+p.id} aria-current={p === person ? 'true' : undefined} onClick={openRecord}>
          <span className={styles.step}>{String(i + 1).padStart(2, '0')}</span>
          <span className={styles.pathName}>{p.name}</span>
          {p.year && <span className={styles.pathYear}>{p.year}</span>}
        </a></li>)}</ol>
      </section>
      <footer className={styles.source}>
        <p>Based on the 2017 lineage chart. Earlier links include historical teacher–student relationships.</p>
        <div><a href="/media/geneaolgy.pdf"><FiDownload aria-hidden="true"/> Original PDF</a>
          <a href="https://www.mathgenealogy.org/">Mathematics Genealogy Project <FiArrowUpRight aria-hidden="true"/></a>
          <a href="https://github.com/oblazy/math-genealogy">math-genealogy on GitHub <FiArrowUpRight aria-hidden="true"/></a></div>
      </footer>
    </div>
  </div>;
}
