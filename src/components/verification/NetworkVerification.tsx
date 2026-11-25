'use client';

import { useEffect, useState } from 'react';
import { atLayer, cells, maxOutput, unsafeAt, type Point } from './geometry';
import styles from './verification.module.css';

const stages = [
  { label: 'Input', title: 'Start with a region of inputs', formula: 'x ∈ [−1, 1]²', text: 'Each point in the square is a possible input. Verification follows the entire square through the network.' },
  { label: 'Affine', title: 'Mix the two coordinates', formula: 'z = (x₁ − x₂ + ½, x₁ + x₂ + ½)', text: 'The hidden layer rotates, scales and shifts the square. Its intersections with the two zero axes determine which neurons will be active.' },
  { label: 'ReLU', title: 'Split at the activation boundaries', formula: 'hᵢ = max(0, zᵢ)', text: 'Positive coordinates pass through. A region with one negative coordinate collapses onto an axis. The region with two negative coordinates collapses to the origin.' },
  { label: 'Output', title: 'Collect every reachable output', formula: 'y = (h₁ + h₂ − 1, (h₂ − h₁)/2)', text: 'The output layer maps each activation region separately. Their union gives the exact reachable set for this two-neuron example.' },
  { label: 'Verify', title: 'Check for an unsafe output', formula: `max y₁ = ${maxOutput} < ${unsafeAt}`, text: 'The amber half-plane contains all unsafe outputs. Maximizing the first coordinate over the mapped polygons gives a gap of 0.25 for the entire input domain.' },
];

const tones = ['#65d2f1', '#a398ff', '#60d5b4', '#ffbe83'];
// Project each two-dimensional layer onto a separate plane in the stack.
const plane: Point[] = [[-2,-2], [3,-2], [3,3], [-2,3]];
const corners: Point[] = [[-1,-1], [1,-1], [1,1], [-1,1]];
const vertices = cells.flat();
const tracks = corners.map(([x, y]) => vertices.find(v => v[0][0] === x && v[0][1] === y)!);

// Let the nonlinear step occupy more of the scroll than either linear map.
// These stops also locate the stage controls on the mobile scroll track.
const scrollStops = [0, 0.9, 2.32, 3.12, 4];

function stageAtScroll(value: number, reducedMotion: boolean) {
  const next = scrollStops.findIndex(stop => stop > value);
  if (next < 1) return stages.length - 1;
  const index = next - 1;
  const fraction = (value - scrollStops[index]) / (scrollStops[next] - scrollStops[index]);
  // Briefly hold the completed ReLU image before starting the output map.
  const t = Math.min(1, Math.max(0, index === 2 ? (fraction - 0.15) / 0.85 : fraction));
  return reducedMotion ? Math.round(index + t) : index + t * t * (3 - 2 * t);
}

// This input corner switches the second hidden unit off at the ReLU.
const tracedVertex = tracks[0];

function NetworkGlyph({ progress }: { progress: number }) {
  const transfer = [Math.min(1, progress), Math.min(1, Math.max(0, progress - 2))];
  const rows = [9, 29];
  return <g transform="translate(9 6)" aria-hidden="true">
    {transfer.map((t, i) => <g key={i}>
      {rows.flatMap((a, from) => rows.map((b, to) => {
        const start = 8 + 27 * i;
        const silenced = i === 1 && tracedVertex[2][from] === 0;
        return <g key={from * 2 + to}>
          <line x1={start} y1={a} x2={start + 27} y2={b} stroke="#52667b" strokeWidth=".9" />
          {!silenced && <line x1={start} y1={a} x2={start + 27 * t} y2={a + (b-a)*t}
            stroke="#9cdaee" strokeWidth="1.2" opacity=".85" />}
        </g>;
      }))}
    </g>)}
    {[0,1,2].map(col => rows.map((row, i) => {
      const arrival = col === 0 ? 1 : transfer[col - 1];
      const off = col === 1 && tracedVertex[2][i] === 0;
      const activity = arrival * (off ? 1 - Math.min(1,Math.max(0,progress - 1)) : 1);
      return <g key={col * 2 + i}>
        <circle cx={8+27*col} cy={row} r="4.2" fill="#152538" stroke="#6a8094" />
        <circle cx={8+27*col} cy={row} r="3" fill="#bceafa" opacity={activity} />
      </g>;
    }))}
  </g>;
}

function TraceFigure({ progress, onSelect, vertical = false }: { progress: number; onSelect?: (i: number) => void; vertical?: boolean }) {
  function screen([x,y]: Point, depth: number): Point {
    if (vertical) return [106 + 15 * x - 13 * y, 34 + depth * 59 + 5 * x + 6 * y];
    return [48 + depth * 61 + x * 12 + y * 4, 152 - depth * 32 + x * 4 - y * 13];
  }
  function contour(pts: Point[], depth: number) {
    return pts.map(p => screen(p, depth).join(',')).join(' ');
  }

  const layer = Math.min(3, progress);
  const active = Math.round(progress);
  const planes = Array.from(new Set([0, 1, 2, 3, layer])).sort((a,b) => b-a);
  const unsafeBand: Point[] = [[unsafeAt,-2],[3,-2],[3,3],[unsafeAt,3]];

  const traveled = planes.filter(depth => depth <= layer).reverse();
  const trail = traveled.map(depth => screen(atLayer(tracedVertex,depth),depth).join(',')).join(' ');
  const [tipX, tipY] = screen(atLayer(tracedVertex, layer), layer);
  const clearance: Point[] = [[maxOutput,-1],[unsafeAt,-1],[unsafeAt,1],[maxOutput,1]];

  return (
    <>
      <svg className={styles.layerArt} viewBox={vertical ? "0 0 212 255" : "0 0 292 205"} role="img"
        aria-label={`Neural network verification. ${stages[active].title}. ${stages[active].formula}. ${stages[active].text}`}>
        {tracks.map((v,i) => (
          <g key={i} fill="none" stroke={tones[i]}>
            <polyline points={v.map((p,j) => screen(p,j).join(',')).join(' ')} strokeOpacity=".16" strokeDasharray="2 4" />
            <polyline points={traveled.map(j => screen(atLayer(v,j),j).join(',')).join(' ')}
              strokeOpacity=".68" strokeWidth="1" />
          </g>
        ))}
        {planes.map(depth => {
          const current = depth === layer;
          const reached = depth <= layer;
          const whole = Number.isInteger(depth);
          return <g key={depth}>
            {whole && <polygon points={contour(plane,depth)} fill="#193247" fillOpacity=".3"
              stroke={current ? '#7491a9' : '#496076'} strokeWidth=".75" />}
            {depth === 3 && progress > 3 && <g opacity={progress - 3}>
              <polygon points={contour(clearance,3)} fill="#08121e" />
              <polygon points={contour(unsafeBand,3)} fill="#ffc389" fillOpacity=".34" />
              <polyline points={contour([unsafeBand[0],unsafeBand[3]],3)} fill="none" stroke="#ffdaa9" strokeWidth="1.05" />
            </g>}
            {cells.map((cell,i) => {
              const pts = cell.map(v => atLayer(v, depth));
              const outline = contour(pts,depth);
              return <g key={i} stroke={tones[i]} strokeLinejoin="round" opacity={reached ? 1 : 0.18}>
                {current && <polygon points={outline} fill="none" strokeWidth="4.5" opacity=".13" />}
                <polygon points={outline} fill={tones[i]} fillOpacity={current ? .35 : .13} strokeWidth={current ? 1.65 : 1} />
                {current && pts.map((p,j) => {
                  const [cx,cy] = screen(p,depth);
                  return <circle key={j} cx={cx} cy={cy} r="1.5" stroke="none" fill={tones[i]} />;
                })}
              </g>;
            })}
          </g>;
        })}
        <polyline points={trail} fill="none" stroke="#e8faff" strokeWidth="1" opacity=".72" />
        <g transform={`translate(${tipX} ${tipY})`}>
          <circle r="6" fill="#bdedff" opacity=".10" />
          <circle r="3.8" fill="none" stroke="#d8f5ff" strokeWidth=".75" opacity=".70" />
          <circle r="1.9" fill="#f3fcff" />
        </g>
        <g transform={vertical ? "translate(27 -2) rotate(90) scale(.62)" : undefined}>
          <NetworkGlyph progress={progress} />
        </g>
      </svg>
      {onSelect && <div className={styles.traceSteps} role="group" aria-label="Inspect a network stage">
        {stages.map(({label}, i) => (
          <button key={label} type="button" aria-label={label} aria-pressed={i === active}
            data-past={progress > i} onClick={() => onSelect(i)} />
        ))}
      </div>}
    </>
  );
}

export default function SidebarTrace() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Each interval of the existing page advances one layer. Reading in reverse
    // retraces the same computation, including after publication filters resize it.
    const landmarks = ['bio', 'publications', 'research', 'service', 'contact']
      .map(id => document.getElementById(id));
    if (landmarks.some(el => !el)) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const tops = landmarks.map(el => el!.getBoundingClientRect().top);
      const cursor = Math.min(window.innerHeight * 0.24, 160);
      let value = 0;
      for (let i = 1; i < tops.length; i++) {
        value += Math.max(0, Math.min(1, (cursor - tops[i - 1]) / Math.max(1, tops[i] - tops[i - 1])));
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) value = stages.length - 1;
      setProgress(stageAtScroll(value, reduced.matches));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div id="nn-verification">
      <TraceFigure progress={progress} vertical />
    </div>
  );
}
