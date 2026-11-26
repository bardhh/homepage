import Link from 'next/link';
import { FiShare2 } from 'react-icons/fi';
import type { MapPaper } from '@/lib/research-map';
import { publicationPath } from '@/lib/publication-utils';
import styles from './PaperTimeline.module.css';

interface TimelineProps {
  papers: MapPaper[];
  heading: string;
  year: string | null;
  onYearChange: (year: string | null) => void;
  notes: Map<string, string>;
  selectedPaper?: string;
}

export default function PaperTimeline({ papers, heading, year, onYearChange, notes, selectedPaper }: TimelineProps) {
  const groups = new Map<string, MapPaper[]>();
  for (const paper of papers) {
    const key = paper.year || 'Undated';
    const group = groups.get(key) || [];
    group.push(paper);
    groups.set(key, group);
  }

  const years = [...groups.keys()].sort();
  const activeYear = year && groups.has(year) ? year : null;
  const maxCount = Math.max(1, ...years.map(key => groups.get(key)!.length));
  const dates = years.filter(key => /^\d{4}$/.test(key)).map(Number);
  const axis = dates.length && dates.at(-1)! - dates[0] <= 40
    ? Array.from({ length: dates.at(-1)! - dates[0] + 1 }, (_, i) => String(dates[0] + i))
    : years.filter(key => /^\d{4}$/.test(key));
  axis.push(...years.filter(key => !/^\d{4}$/.test(key)));

  return <section className={styles.timeline} aria-label="Publication timeline">
    <div className={styles.figure}>
    <header className={styles.heading}>
      <p className={styles.kicker}>Publication years</p>
      <h2>{years[0]}{years.length > 1 && <>–{years.at(-1)}</>}</h2>
      <p className={styles.scope}>{heading}</p>
      <p className={styles.total}>{papers.length} {papers.length === 1 ? 'paper' : 'papers'}</p>
    </header>
    <div className={styles.chartWrap}><div className={styles.chart} data-dense={axis.length > 8} role="group" aria-label="Filter timeline by year">
      {axis.map(key => {
        const count = groups.get(key)?.length || 0;
        return <button type="button" key={key} disabled={!count} aria-pressed={key === activeYear}
          onClick={() => onYearChange(key === activeYear ? null : key)}
          aria-label={`${key}, ${count} ${count === 1 ? 'paper' : 'papers'}`}>

          <span className={styles.track} aria-hidden="true" style={{height:`max(44px, calc(var(--mark-step) * ${maxCount}))`}}>
            {count > 0 && <span className={styles.stack} style={{height:`calc(var(--mark-step) * ${count})`}}>
              <span className={styles.count}>{count}</span>
              {groups.get(key)!.map(p => <i key={p.id} data-review={p.underReview}/>)}
            </span>}
          </span>
          <span className={styles.axisYear}>{key}</span>
        </button>;
      })}
    </div>
    <p className={styles.caption}><i aria-hidden="true"/> One mark per paper <span>Choose a year to filter</span></p>
    </div></div>
    <div className={styles.listHead}>
      <h2>{activeYear ? 'Papers from ' + activeYear : 'Papers by year'}</h2>
    {activeYear && <button className={styles.clear} onClick={() => onYearChange(null)}>Show all years</button>}
    </div>
    <div aria-live="polite" className="sr-only">
      {activeYear ? `Showing ${groups.get(activeYear)!.length} papers from ${activeYear}.` : 'Showing all years.'}
    </div>
    <ol className={styles.groups}>
      {(activeYear ? [activeYear] : years).map(key => <li key={key} className={styles.group}>
        <div className={styles.yearLabel}><h3>{key}</h3><small>{groups.get(key)!.length} {groups.get(key)!.length===1?'paper':'papers'}</small></div>
        <ul aria-label={`Papers from ${key}`}>
          {groups.get(key)!.slice().sort((a,b) => a.title.localeCompare(b.title, 'en')).map(p => <li key={p.id}>
            <div className={styles.rowTitle}><Link prefetch={false} href={publicationPath({citationKey:p.id})}>{p.title}</Link>
              <p>{p.venue}</p></div>
            <a className={styles.networkLink} href={`?paper=${encodeURIComponent(p.id)}`} aria-label={'Explore connections for '+p.title} title="Explore paper connections"><FiShare2/></a>
            {(notes.has(p.id) || selectedPaper === p.id || p.underReview) && <small>
              {[selectedPaper === p.id ? 'Selected paper' : notes.get(p.id), p.underReview ? 'Under review' : ''].filter(Boolean).join(' · ')}
            </small>}
          </li>)}
        </ul>
      </li>)}
    </ol>
  </section>;
}
