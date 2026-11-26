'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { byId, landmarks, rootScholar, scholars, type Scholar } from '@/lib/genealogy';
import styles from './Genealogy.module.css';

type Point = {x: number; y: number};

const lastColumn = Math.max(...scholars.map(p => p.column));
const firstRow = Math.min(...scholars.map(p => p.row));
const lastRow = Math.max(...scholars.map(p => p.row));
const links = scholars.flatMap(student => student.advisors.map(advisor => ({
  student: student.id, advisor,
})));

const named = new Map(landmarks.map(p => [p.id, p.label]));
named.set(rootScholar.id, rootScholar.name);

// Keep the overview sparse. As the drawing expands, use the available gaps for names.
function placeLabels(points: Map<string, Point>, width: number, height: number, zoom: number, selected: Scholar) {
  const allPoints = [...points.values()];
  const labels: {id: string; text: string; x: number; y: number; halfWidth: number; leader?: string}[] = [];
  const candidates = new Set([selected.id, rootScholar.id, ...named.keys()]);
  if (zoom > 1) for (const person of scholars) candidates.add(person.id);
  for (const id of candidates) {
    const person = byId.get(id)!;
    const name = named.get(id) || person.name.replace(/ \([^)]*\)/g, '');
    const text = zoom === 1 && width < 900 && named.has(id) && id !== rootScholar.id
      ? name.split(' ').at(-1)! : name;
    const halfWidth = Math.min(width / 2 - 6, text.length * 3.5 + 3);
    const pt = points.get(id)!;
    const required = id === selected.id || named.has(id);
    const side = halfWidth + 12;
    const offsets = [[0, -14], [0, 20], [0, -23], [0, 29]];
    if (required) offsets.push([side, 4], [-side, 4], [side, -14], [-side, -14], [side, 20], [-side, 20], [0, -35], [0, 41]);
    for (const [dx, dy] of offsets) {
      const x = Math.max(halfWidth + 4, Math.min(width - halfWidth - 4, pt.x + dx));
      const y = pt.y + dy;
      if (y < 14 || y > height - 3) continue;
      if (labels.some(l => Math.abs(y - l.y) < 17 && Math.abs(x - l.x) < halfWidth + l.halfWidth + 5)) continue;
      const crossesNode = allPoints.some(p => Math.abs(p.x - x) < halfWidth + 2 && p.y >= y - 14 && p.y <= y + 5);
      if (crossesNode && (!required || dy !== 41)) continue;
      const endX = Math.max(x - halfWidth, Math.min(x + halfWidth, pt.x));
      const endY = Math.max(y - 13, Math.min(y + 3, pt.y));
      const leader = required && Math.hypot(endX - pt.x, endY - pt.y) > 7
        ? `M${pt.x},${pt.y} L${endX},${endY}` : undefined;
      labels.push({id, text, x, y, halfWidth, leader});
      break;
    }
  }
  return labels;
}

function makePlot(width: number, zoom: number) {
  const vertical = width < 620;
  const frameHeight = vertical ? 550 : Math.max(345, Math.min(470, width * .46));
  const height = frameHeight * zoom;
  const canvasWidth = width * zoom;
  const points = new Map(scholars.map(person => {
    const rank = person.column / lastColumn;
    const spread = (person.row - firstRow) / (lastRow - firstRow);
    const point = vertical
      ? {x: 14 + spread * (canvasWidth - 28), y: 32 + rank * (height - 73)}
      : {x: 26 + rank * (canvasWidth - 55), y: 30 + spread * (height - 65)};
    return [person.id, point];
  }));
  function curve(start: Point, end: Point) {
    const mx = (start.x + end.x) / 2, my = (start.y + end.y) / 2;
    return vertical
      ? `M${start.x},${start.y} C${start.x},${my} ${end.x},${my} ${end.x},${end.y}`
      : `M${start.x},${start.y} C${mx},${start.y} ${mx},${end.y} ${end.x},${end.y}`;
  }
  return {points, height, frameHeight, canvasWidth, vertical, paths: links.map(link => ({
    ...link, d: curve(points.get(link.student)!, points.get(link.advisor)!),
  }))};
}

export default function GenealogyChart({selected, trail, openRecord}: {
  selected: Scholar; trail: Scholar[]; openRecord: () => void;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(880);
  const [hover, setHover] = useState('');
  const [zoom, setZoom] = useState(1);
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<{x: number; y: number; left: number; top: number} | null>(null);
  const moved = useRef(false);
  const zoomAnchor = useRef<Point | null>(null);
  useEffect(() => {
    if (!frame.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(220, Math.round(entry.contentRect.width))));
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);
  const { points, height, frameHeight, canvasWidth, vertical, paths } = useMemo(() => makePlot(width, zoom), [width, zoom]);
  const route = new Set(trail.map((p, i) => i ? trail[i - 1].id + '/' + p.id : ''));
  const onTrail = new Set(trail.map(p => p.id));
  const labels = useMemo(() => placeLabels(points, canvasWidth, height, zoom, selected), [points, canvasWidth, height, zoom, selected]);
  const selectedPoint = points.get(selected.id)!;
  function changeZoom(next: number) {
    const view = viewport.current;
    if (!view || next === zoom) return;
    zoomAnchor.current = zoom === 1 && selected !== rootScholar ? null : {
      x: (view.scrollLeft + view.clientWidth / 2) / canvasWidth,
      y: (view.scrollTop + view.clientHeight / 2) / height,
    };
    setZoom(next);
  }
  useEffect(() => {
    const view = viewport.current;
    if (!view || zoom === 1) { zoomAnchor.current = null; return; }
    const anchor = zoomAnchor.current;
    zoomAnchor.current = null;
    // Wait for the resized SVG to establish the scroll range before centering.
    const drawing = view.querySelector('svg')!;
    const observer = new ResizeObserver(center);
    function center() {
      if (Math.abs(drawing.getBoundingClientRect().width - canvasWidth) > 1) return;
      view!.scrollTo({
        left: (anchor ? anchor.x * canvasWidth : selectedPoint.x) - view!.clientWidth / 2,
        top: (anchor ? anchor.y * height : selectedPoint.y) - view!.clientHeight / 2,
        behavior: 'instant',
      });
      observer.disconnect();
    }
    observer.observe(drawing);
    center();
    return () => observer.disconnect();
  }, [zoom, canvasWidth, height, selectedPoint]);

  function startPan(event: PointerEvent<HTMLDivElement>) {
    moved.current = false;
    if (zoom === 1 || event.pointerType !== 'mouse' || event.button !== 0) return;
    const view = event.currentTarget;
    drag.current = {x: event.clientX, y: event.clientY, left: view.scrollLeft, top: view.scrollTop};
  }
  function pan(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start || !event.buttons) { drag.current = null; return; }
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    if (!moved.current && Math.hypot(dx, dy) < 5) return;
    moved.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.scrollTo({left: start.left - dx, top: start.top - dy, behavior: 'instant'});
  }
  function moveFocus(event: KeyboardEvent<Element>, person: Scholar) {
    const direction: Record<string, Point> = {ArrowRight: {x:1,y:0}, ArrowLeft: {x:-1,y:0}, ArrowDown: {x:0,y:1}, ArrowUp: {x:0,y:-1}};
    const unit = direction[event.key];
    if (!unit) return;
    event.preventDefault();
    const from = points.get(person.id)!;
    let best = '', distance = Infinity;
    for (const [id, point] of points) {
      const dx = point.x - from.x, dy = point.y - from.y;
      const forward = dx * unit.x + dy * unit.y;
      const perpendicular = Math.abs(dx * unit.y - dy * unit.x);
      if (forward <= 0 || perpendicular > forward * 2) continue;
      const score = forward + perpendicular * 3;
      if (score < distance) {best = id; distance = score;}
    }
    if (best) frame.current?.querySelector<SVGAElement>('[data-scholar="' + best + '"]')?.focus();
  }
  return <div className={styles.plot} ref={frame} id="lineage-map">
    <div className={styles.plotHead}><h2>Lineage map</h2>
      <div className={styles.zoom} role="group" aria-label="Map zoom">
        <button aria-label="Zoom out" disabled={zoom === 1} onClick={() => changeZoom(zoom - 1)}><FiMinus/></button>
        <button aria-label="Fit entire lineage" title="Fit entire lineage" onClick={() => changeZoom(1)}>{zoom * 100}%</button>
        <button aria-label="Zoom in" disabled={zoom === 3} onClick={() => changeZoom(zoom + 1)}><FiPlus/></button>
      </div>
      <span>{zoom > 1 ? 'Pan to explore' : vertical ? 'Earlier advisors ↓' : 'Earlier advisors →'}</span></div>
    <div className={styles.viewport} ref={viewport} style={{height:frameHeight}} data-zoomed={zoom > 1}
      onPointerDown={startPan} onPointerMove={pan} onPointerUp={() => {drag.current = null;}}
      onPointerCancel={() => {drag.current = null;}} onDragStart={e => e.preventDefault()}
      onClickCapture={e => {if (moved.current) { e.preventDefault(); e.stopPropagation(); moved.current = false; }}}>
    <svg style={{width: canvasWidth, height}} viewBox={`0 0 ${canvasWidth} ${height}`} role="group" aria-label="Academic lineage map. Use the arrow keys between scholars and Enter to select.">
      <g className={styles.branches}>{paths.map(e => <path key={e.student+'/'+e.advisor} d={e.d}/>)}</g>
      <g className={styles.route}>{paths.filter(e => route.has(e.student+'/'+e.advisor)).map(e =>
        <path key={e.student+'/'+e.advisor} d={e.d}/>)}</g>
      <circle className={styles.halo} cx={selectedPoint.x} cy={selectedPoint.y} r="10" />
      <g className={styles.labels}>{labels.map(label =>
        <a key={label.id} tabIndex={-1} href={'?scholar='+label.id} aria-label={'Explore '+(named.get(label.id) || label.text)} onClick={openRecord}>
          {label.leader && <path d={label.leader} className={styles.labelLeader} aria-hidden="true"/>}
          <text x={label.x} y={label.y} textAnchor="middle">{label.text}</text>
        </a>)}</g>
      {scholars.map(person => {
        const {x,y} = points.get(person.id)!;
        const active = person.id === selected.id;
        return <a key={person.id} href={'?scholar='+person.id} data-scholar={person.id} aria-label={person.name}
          aria-current={active ? 'true' : undefined} tabIndex={active ? 0 : -1} onKeyDown={e => moveFocus(e, person)}
          onMouseEnter={() => setHover(person.id)} onMouseLeave={() => setHover('')}
          onFocus={() => setHover(person.id)} onBlur={() => setHover('')} onClick={openRecord}>
          <circle cx={x} cy={y} r={vertical ? 5.1 : 5.8} fill="transparent" />
          <circle cx={x} cy={y} r={active ? 4.8 : named.has(person.id) ? 3.8 : 2.5}
            className={styles.point} data-on={onTrail.has(person.id)} data-named={named.has(person.id)} />
        </a>;
      })}
    </svg></div>
    {hover && <output className={styles.tooltip}>{byId.get(hover)!.name}</output>}
    <div className={styles.legend}><span><i/>Scholar</span><span><i/>Advisor link</span><span><i/>Highlighted path</span></div>
  </div>;
}
