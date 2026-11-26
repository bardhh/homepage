'use client';

import { useRef, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { applications, concepts, type MapPaper } from '@/lib/research-map';
import styles from './ResearchMap.module.css';

export default function MapSearch({papers, choose}: {papers: MapPaper[]; choose: (id: string) => void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState('');
  const terms = query.toLowerCase().trim().split(/\s+/);
  const matches = (s: string) => terms.every(term => s.toLowerCase().includes(term));
  const topics = concepts.filter(c => matches(c.name));
  const domains = applications.filter(a => matches(a.name));
  const results = papers.filter(p => matches(p.title+' '+p.year));
  function pick(id: string) {
    choose(id);
    dialog.current?.close();
  }
  return <>
    <button ref={trigger} type="button" className={styles.find} aria-haspopup="dialog" onClick={() => {
      setQuery(''); dialog.current?.showModal(); input.current?.focus();
    }}><FaSearch aria-hidden="true" /> Search the map</button>
    <dialog aria-labelledby="map-search-title" className={styles.dialog} ref={dialog} onClose={() => trigger.current?.focus()}>
      <header><h2 id="map-search-title">Search the map</h2><button aria-label="Close search" onClick={() => dialog.current?.close()}><FaTimes /></button></header>
      <input ref={input} type="search" value={query} placeholder="Title, concept, application or year" aria-label="Title, concept, application or year" onChange={e => setQuery(e.target.value)} />
      <div className={styles.results}>
        {!!topics.length && <h3>Concepts</h3>}
        {topics.map(c => <button key={c.id} onClick={() => pick(c.id)}>{c.name}</button>)}
        {!!domains.length && <h3>Applications</h3>}
        {domains.map(a => <button key={a.id} onClick={() => pick(a.id)}>{a.name}</button>)}
        {!!results.length && <h3>Papers</h3>}
        {results.map(p => <button key={p.id} onClick={() => pick(p.id)}><small>{p.year}</small>{p.title}</button>)}
        {!topics.length && !domains.length && !results.length && <p>No matches. Try a shorter title or a year.</p>}
      </div>
    </dialog>
  </>;
}
