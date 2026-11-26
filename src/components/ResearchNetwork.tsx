'use client';

import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { applications, concepts, type MapPaper } from '@/lib/research-map';
import { paperConnections } from '@/data/paper-connections';
import styles from './ResearchMap.module.css';

type Point = { x: number; y: number };
type GraphNode = Point & { id: string; name: string };
type Edge = { from: GraphNode; to: GraphNode; kind: 'concept' | 'application' | 'direct' };

function spaceLabels<T extends Point>(items: T[], top: number, bottom: number, gap: number) {
  let y = top - gap;
  const spaced = items.map(item => ({ ...item, labelY: y = Math.max(item.y, y + gap) }));
  y = bottom + gap;
  for (let i = spaced.length - 1; i >= 0; i--) {
    y = Math.min(spaced[i].labelY, y - gap);
    spaced[i].labelY = y;
  }
  return spaced;
}

function layout(papers: MapPaper[], width: number) {
  const compact = width < 640;
  const row = 29;
  const firstAppY = 25 + row * concepts.length + 30;
  const height = compact ? firstAppY + row * (applications.length - 1) + 26 : Math.max(550, Math.min(650, width * .62));
  const cx = width * (compact ? .65 : .54);
  const cy = (height - 54) / 2;
  const rx = Math.min(width * .275, cy - 6);
  const ry = cy - 30;
  function onCircle(degrees: number): Point {
    const angle = degrees * Math.PI / 180;
    return { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
  }
  const leftX = Math.min(171, width * .43);
  const topics = spaceLabels(concepts.map((c, i) => ({
    ...c, ...(compact ? { x: leftX, y: 25 + row * i } : onCircle(-102 - 132 * i / (concepts.length - 1))),
  })), 17, compact ? firstAppY - 50 : height - 94, compact ? row : 24);
  const apps = applications.map((app, i) => {
    const t = i / (applications.length - 1);
    return {
      ...app, ...(compact ? { x: leftX, y: firstAppY + row * i } : onCircle(121 - 64 * t)),
      labelX: compact ? leftX - 12 : width * (.18 + .71 * t),
    };
  });
  const ordered = [...papers].sort((a, b) =>
    (a.year || '9999').localeCompare(b.year || '9999') || a.title.localeCompare(b.title, 'en'));
  const groups = new Map<string, MapPaper[]>();
  for (const paper of ordered) {
    const year = paper.year || 'Undated';
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(paper);
  }
  const slots = Math.max(1, ordered.length - 1 + (groups.size - 1) * .85);
  const spacing = Math.min(rx, ry) * (130 * Math.PI / 180) / slots;
  const hitRadius = compact ? 4.2 : Math.min(6, spacing * .64);
  const dotRadius = compact ? 2.9 : Math.min(3.1, spacing * .46);
  let index = 0;
  const byYear = [...groups].map(([year, group], yearIndex) => {
    const yearY = 25 + (height - 50) * yearIndex / Math.max(1, groups.size - 1);
    const nodes = group.map((paper, i) => {
      const fraction = (index++ + yearIndex * .85) / slots;
      const degrees = -81 + 130 * fraction;
      const position = compact ? {
        x: width - 53 - (i % 5) * 9,
        y: yearY + (Math.floor(i / 5) - (Math.ceil(group.length / 5) - 1) / 2) * 8,
      } : onCircle(degrees);
      return { id: paper.id, name: paper.title, year, degrees, ...position };
    });
    const first = nodes[0].degrees, last = nodes[nodes.length - 1].degrees;
    const start = onCircle(first - .25), end = onCircle(last + .25);
    const arc = 'M ' + start.x + ' ' + start.y + ' A ' + rx + ' ' + ry + ' 0 0 1 ' + end.x + ' ' + end.y;
    return { year, nodes, arc, ...(compact ? { x: width - 50, y: yearY } : onCircle((first + last) / 2)) };
  });
  const years = spaceLabels(byYear, 14, compact ? height - 14 : height - 85, compact ? 26 : 20);
  const nodes = byYear.flatMap(g => g.nodes);
  const positions = new Map([...topics, ...apps, ...nodes].map(n => [n.id, n]));
  const edges: Edge[] = [];
  for (const paper of papers) {
    const to = positions.get(paper.id)!;
    for (const id of paper.concepts) edges.push({ from: positions.get(id)!, to, kind: 'concept' });
    for (const id of paper.applications) edges.push({ from: positions.get(id)!, to, kind: 'application' });
  }
  for (const e of paperConnections) edges.push({ from: positions.get(e.from)!, to: positions.get(e.to)!, kind: 'direct' });
  return { compact, height, cx, cy, topics, apps, nodes, years, edges, firstAppY, hitRadius, dotRadius };
}

function labelLines(name: string, narrow: boolean) {
  if (name === 'Specification mining & debugging') return ['Specification mining', '& debugging'];
  if (narrow && name.length > 19) {
    const split = name.lastIndexOf(' ');
    return [name.slice(0, split), name.slice(split + 1)];
  }
  return [name];
}

export default function ResearchNetwork({ papers, selected, choose, chooseYear }: {
  papers: MapPaper[]; selected: string; choose: (id: string) => void; chooseYear: (year: string) => void;
}) {
  const plot = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(870);
  const [hover, setHover] = useState('');
  useEffect(() => {
    if (!plot.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(250, Math.floor(entry.contentRect.width))));
    observer.observe(plot.current);
    return () => observer.disconnect();
  }, []);
  const { compact, height, cx, cy, topics, apps, nodes, years, edges, firstAppY, hitRadius, dotRadius } = useMemo(() => layout(papers, width), [papers, width]);
  const focus = hover || selected;
  const isConcept = topics.some(n => n.id === focus);
  const isApplication = apps.some(n => n.id === focus);
  const members = new Set(edges.filter(e => e.from.id === focus).map(e => e.to.id));
  const lit = new Set([focus]);
  const paths = edges.map(e => {
    const {from, to, kind} = e;
    const direct = from.id === focus || to.id === focus;
    const throughPaper = members.has(to.id) &&
      ((isConcept && kind === 'application') || (isApplication && kind === 'concept'));
    if (direct || throughPaper) { lit.add(from.id); lit.add(to.id); }
    const state = direct ? 'on' : throughPaper ? 'via' : focus ? 'off' : 'normal';
    const curve = kind === 'direct'
      ? `M ${from.x} ${from.y} Q ${cx} ${(from.y + to.y) / 2} ${to.x} ${to.y}`
      : `M ${from.x} ${from.y} C ${from.x * .35 + cx * .65} ${from.y * .65 + cy * .35}, ${to.x * .35 + cx * .65} ${to.y * .65 + cy * .35}, ${to.x} ${to.y}`;
    return <path key={from.id + '/' + to.id} d={curve} className={styles[kind]} data-state={state} />;
  });
  function activate(event: MouseEvent, action: () => void) {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    event.preventDefault();
    setHover('');
    action();
  }
  function events(id: string) {
    return { onMouseEnter: () => setHover(id), onMouseLeave: () => setHover(''),
      onFocus: () => setHover(id), onBlur: () => setHover('') };
  }
  const hoverPaper = nodes.find(n => n.id === hover);
  return <div className={styles.diagram} ref={plot}>
    <div className={styles.axis}><span>Concepts</span><span>Papers by year</span></div>
    <svg className={styles.svg} data-narrow={width < 820} viewBox={`0 0 ${width} ${height}`} aria-label="Graph of research concepts, papers and applications">
      <g aria-hidden="true" fill="none">{paths}</g>
      {topics.map(n => {
        const x = compact ? n.x - 12 : Math.min(width * .25, n.x - 18);
        const words = labelLines(n.name, compact);
        return <a key={n.id} href={'?concept=' + n.id} aria-label={'Concept: ' + n.name} {...events(n.id)}
          className={styles.topic} data-dim={!!focus && !lit.has(n.id)} onClick={e => activate(e, () => choose(n.id))}>
          <rect x={x - 150} y={n.labelY - 11} width="155" height="23" fill="transparent" />
          <path d={`M${n.x} ${n.y} L${x + 5} ${n.labelY}`} className={styles.leader} />
          <circle cx={n.x} cy={n.y} r="5" className={styles.hub} /><circle cx={n.x} cy={n.y} r="10" fill="transparent" />
          <text x={x} y={n.labelY + (words.length === 2 ? -2 : 4)} textAnchor="end">
            {words.map((s, i) => <tspan key={s} x={x} dy={i ? 12 : 0}>{s}</tspan>)}
          </text>
        </a>;
      })}
      <text className={styles.appHeading} x={compact ? 8 : 24} y={compact ? firstAppY - 19 : height - 45}>Applications</text>
      {apps.map(n => {
        const y = compact ? n.y + 4 : height - 24;
        const words = !compact && width < 970 ? n.name.split(' ') : [n.name];
        return <a key={n.id} href={'?application=' + n.id} aria-label={'Application: ' + n.name}
          {...events(n.id)} className={styles.appNode} data-dim={!!focus && !lit.has(n.id)}
          onClick={e => activate(e, () => choose(n.id))}>
          {!compact && <path d={`M${n.x} ${n.y} L${n.labelX} ${y - 19} v6`} className={styles.leader} />}
          <rect x={compact ? n.labelX - 115 : n.labelX - 45} y={y - 14} width={compact ? 120 : 90} height="28" fill="transparent"/>
          <path transform={`translate(${n.x} ${n.y})`} d="M0 -5.5 L5.5 0 0 5.5 -5.5 0 Z" className={styles.diamond}/>
          <circle cx={n.x} cy={n.y} r="10" fill="transparent" />
          <text x={n.labelX} y={y} textAnchor={compact ? 'end' : 'middle'}>
            {words.map((s, i) => <tspan key={s} x={n.labelX} dy={i ? 13 : 0}>{s}</tspan>)}
          </text>
        </a>;
      })}
      {nodes.map(n => <a key={n.id} aria-label={`Paper: ${n.name}, ${n.year}`} href={'?paper=' + encodeURIComponent(n.id)}
        className={styles.paperNode} data-dim={!!focus && !lit.has(n.id)} {...events(n.id)} onClick={e => activate(e, () => choose(n.id))}>
        <circle cx={n.x} cy={n.y} r={hitRadius} fill="transparent"/>
        <circle cx={n.x} cy={n.y} r={n.id === focus ? dotRadius + 1 : dotRadius} pointerEvents="none" className={styles.dot}/>
      </a>)}
      {years.map(n => {
        const x = width - (compact ? 5 : 25);
        return <a key={n.year} href={'?view=timeline&year=' + n.year} aria-label={'Open ' + n.year + ' in timeline'} className={styles.year}
          onClick={e => activate(e, () => chooseYear(n.year))}>
          {!compact && <path d={n.arc} transform={`translate(${cx} ${cy}) scale(1.035) translate(${-cx} ${-cy})`} className={styles.yearArc}/>}
          <path d={`M${n.x + 7} ${n.y} L${x - 42} ${n.labelY} H${x - 33}`} className={styles.leader}/>
          <rect x={x - 35} y={n.labelY - 10} width="40" height="20" fill="transparent"/>
          <text x={x} y={n.labelY + 4} textAnchor="end">{n.year}</text>
        </a>;
      })}
    </svg>
    {hoverPaper && <div className={styles.tip} aria-hidden="true">{hoverPaper.year} · {hoverPaper.name}</div>}
    <div className={styles.legend}><span><i className={styles.conceptKey}/>Concept</span><span><i className={styles.paperKey}/>Paper</span><span><i className={styles.appKey}/>Application</span><span><i className={styles.edgeKey}/>Documented paper link</span></div>
  </div>;
}
