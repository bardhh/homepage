'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { atLayer, cells, minMargin, maxMargin, unsafeAt, type Point } from './geometry';
import { sectionScrollTop } from '@/lib/section-navigation';
import styles from './verification.module.css';

const stages = [
  { section: 'bio', label: 'Input', title: 'Start with a region of inputs', formula: 'x ∈ [−1, 1]²', text: 'Each point in the square is a possible input. Verification follows the entire square through the network.' },
  { section: 'publications', label: 'Rotate', title: 'Rotate the input square', formula: 'r = R(45°)x', text: 'The first part of the hidden affine map rotates every input by 45 degrees.' },
  { section: 'patents', label: 'Scale', title: 'Scale the rotated region', formula: 's = √2 r', text: 'Uniform scaling gives the difference and sum of the input coordinates.' },
  { section: 'research', label: 'Affine', title: 'Mix the two coordinates', formula: 'z = (x₁ − x₂ + ½, x₁ + x₂ + ½)', text: 'The hidden layer rotates, scales and shifts the square. Its intersections with the two zero axes determine which neurons will be active.' },
  { section: 'teaching', label: 'ReLU', title: 'Split at the activation boundaries', formula: 'hᵢ = max(0, zᵢ)', text: 'Positive coordinates pass through. A region with one negative coordinate collapses onto an axis. The region with two negative coordinates collapses to the origin.' },
  { section: 'mentorship', label: 'Rotate', title: 'Rotate the activation regions', formula: 'u = R(−45°)h', text: 'The output map first rotates the activation regions clockwise.' },
  { section: 'software', label: 'Scale', title: 'Stretch the output coordinates', formula: 'v = (√2 u₁, u₂/√2)', text: 'The two axes scale differently, stretching each reachable region horizontally.' },
  { section: 'honors', label: 'Output', title: 'Collect every reachable output', formula: 'y = (h₁ + h₂ − 1, (h₂ − h₁)/2)', text: 'The output layer maps each activation region separately. Their union gives the exact reachable set for this two-neuron example.' },
  { section: 'talks', label: 'Align', title: 'Rotate the reachable output', formula: 'a = (y₂, −y₁)', text: 'A clockwise quarter-turn makes the safety boundary horizontal.' },
  { section: 'service', label: 'Margin', title: 'Measure clearance from the unsafe boundary', formula: `m = ${unsafeAt} − y₁`, text: 'Shift the rotated set upward so its height is the safety margin. Zero marks the boundary of the amber unsafe region.' },
  { section: 'contact', label: 'Verify', title: 'Project onto the safety margin axis', formula: `m ∈ [${minMargin}, ${maxMargin}]`, text: `The polygons collapse to the interval of reachable margins. Its lower endpoint is ${minMargin} above zero, so every input is safe.` },
];

const tones = ['#65d2f1', '#a398ff', '#60d5b4', '#ffbe83'];
// Project each two-dimensional layer onto a separate plane in the stack.
const plane: Point[] = [[-2,-2], [3,-2], [3,3], [-2,3]];
const corners: Point[] = [[-1,-1], [1,-1], [1,1], [-1,1]];
const vertices = cells.flat();
const tracks = corners.map(([x, y]) => vertices.find(v => v[0][0] === x && v[0][1] === y)!);

const hiddenAffine = 3;
const activation = 4;
const output = stages.findIndex(stage => stage.label === 'Output');
const lastPlane = stages.length - 1;
const fixedDepths = Array.from({ length: stages.length }, (_, i) => i);
const primaryDepths = new Set([0, hiddenAffine, activation, output, lastPlane]);

// This input corner switches the second hidden unit off at the ReLU.
const tracedVertex = tracks[0];

function NetworkGlyph({ progress }: { progress: number }) {
  const transfer = [Math.min(1, progress / hiddenAffine), Math.min(1, Math.max(0, (progress - activation) / (output - activation)))];
  const rows = [9, 29];
  return <g transform="translate(9 6)" aria-hidden="true">
    {transfer.map((t, i) => <g key={i}>
      {rows.flatMap((a, from) => rows.map((b, to) => {
        const start = 8 + 27 * i;
        const silenced = i === 1 && tracedVertex[activation][from] === 0;
        return <g key={from * 2 + to}>
          <line x1={start} y1={a} x2={start + 27} y2={b} stroke="#52667b" strokeWidth=".9" />
          {!silenced && <line x1={start} y1={a} x2={start + 27 * t} y2={a + (b-a)*t}
            stroke="#9cdaee" strokeWidth="1.2" opacity=".85" />}
        </g>;
      }))}
    </g>)}
    {[0,1,2].map(col => rows.map((row, i) => {
      const arrival = col === 0 ? 1 : transfer[col - 1];
      const off = col === 1 && tracedVertex[activation][i] === 0;
      const activity = arrival * (off ? 1 - Math.min(1,Math.max(0,progress - hiddenAffine)) : 1);
      return <g key={col * 2 + i}>
        <circle cx={8+27*col} cy={row} r="4.2" fill="#152538" stroke="#6a8094" />
        <circle cx={8+27*col} cy={row} r="3" fill="#bceafa" opacity={activity} />
      </g>;
    }))}
  </g>;
}

function screen([x,y]: Point, depth: number, spacing: number[]): Point {
  const index = Math.floor(depth);
  const from = spacing[index];
  const to = spacing[Math.min(index + 1, lastPlane)];
  return [106 + 15 * x - 13 * y, 84 + from + (to - from) * (depth - index) + 5 * x + 6 * y];
}

function contour(pts: Point[], depth: number, spacing: number[]) {
  return pts.map(p => screen(p, depth, spacing).join(',')).join(' ');
}

const marginPlane: Point[] = [[-2,-2.75], [3,-2.75], [3,3.5], [-2,3.5]];

const LayerPlane = memo(function LayerPlane({ depth, current, reached, spacing }: {
  depth: number; current: boolean; reached: boolean; spacing: number[];
}) {
  const whole = Number.isInteger(depth);
  const secondary = whole && !primaryDepths.has(depth) && !current;
  // Move the safety boundary along with the set during the translation.
  const boundary = -unsafeAt * Math.min(1, Math.max(0, output + 2 - depth));
  return (
    <g opacity={secondary ? 0.53 : 1}>
      {whole && <polygon points={contour(depth > output ? marginPlane : plane,depth,spacing)} fill="#193247" fillOpacity=".3"
        stroke={current ? '#7491a9' : '#496076'} strokeWidth=".75" />}
      {depth >= output + 1 && <g opacity={reached ? .9 : .16}>
        <polygon points={contour([marginPlane[0],marginPlane[1],[3,boundary],[-2,boundary]],depth,spacing)} fill="#ffc389" fillOpacity=".23" />
        <polyline points={contour([[-2,boundary],[3,boundary]],depth,spacing)} fill="none" stroke="#ffc389" strokeWidth=".9" />
      </g>}
      {cells.map((cell,i) => {
        const pts = cell.map(v => atLayer(v, depth));
        const outline = contour(pts,depth,spacing);
        return <g key={i} stroke={tones[i]} strokeLinejoin="round" opacity={reached ? 1 : 0.18}>
          {current && <polygon points={outline} fill="none" strokeWidth="4.5" opacity=".13" />}
          <polygon points={outline} fill={tones[i]} fillOpacity={current ? .35 : .13} strokeWidth={current ? 1.65 : 1} />
          {current && pts.map((p,j) => {
            const [cx,cy] = screen(p,depth,spacing);
            return <circle key={j} cx={cx} cy={cy} r="1.5" stroke="none" fill={tones[i]} />;
          })}
        </g>;
      })}
    </g>
  );
});

const viewWidth = 180;

type RailLayout = { height: number; spacing: number[] };

function TraceFigure({ progress, layout }: { progress: number; layout: RailLayout }) {
  const { height, spacing } = layout;
  const layer = progress;
  const active = Math.round(progress);
  const planes = Array.from(new Set([...fixedDepths, layer])).sort((a,b) => b-a);

  const traveled = planes.filter(depth => depth <= layer).reverse();
  const trail = traveled.map(depth => screen(atLayer(tracedVertex,depth),depth,spacing).join(',')).join(' ');
  const [tipX, tipY] = screen(atLayer(tracedVertex, layer), layer, spacing);

  return (
    <>
      <svg className={styles.layerArt} viewBox={`16 0 ${viewWidth} ${height}`} role="img"
        aria-label={`Neural network verification. ${stages[active].title}. ${stages[active].formula}. ${stages[active].text}`}>
        {spacing.map((offset, index) => (
          <line key={index} x1="26" x2="33" y1={84 + offset} y2={84 + offset} stroke="#8299ac" opacity=".5" />
        ))}
        {tracks.map((v,i) => (
          <g key={i} fill="none" stroke={tones[i]}>
            <polyline points={fixedDepths.map(j => screen(atLayer(v,j),j,spacing).join(',')).join(' ')} strokeOpacity=".16" strokeDasharray="2 4" />
            <polyline points={traveled.map(j => screen(atLayer(v,j),j,spacing).join(',')).join(' ')}
              strokeOpacity=".68" strokeWidth="1" />
          </g>
        ))}
        {planes.map(depth => (
          <LayerPlane key={Number.isInteger(depth) ? depth : 'moving'}
            depth={depth} spacing={spacing} current={depth === layer} reached={depth <= layer} />
        ))}
        <polyline points={trail} fill="none" stroke="#e8faff" strokeWidth="1" opacity=".72" />
        <g transform={`translate(${tipX} ${tipY})`}>
          <circle r="6" fill="#bdedff" opacity=".10" />
          <circle r="3.8" fill="none" stroke="#d8f5ff" strokeWidth=".75" opacity=".70" />
          <circle r="1.9" fill="#f3fcff" />
        </g>
        <g transform="translate(63 0)">
          <NetworkGlyph progress={progress} />
        </g>
      </svg>
    </>
  );
}

export default function VerificationRail() {
  const [progress, setProgress] = useState(0);

  const [shown, setShown] = useState(false);
  const [layout, setLayout] = useState<RailLayout>(() => ({
    height: 1000, spacing: fixedDepths.map(depth => depth * 878 / lastPlane),
  }));
  const figure = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = figure.current;
    const landmarks = stages
      .map(stage => document.getElementById(stage.section))
      .filter((node): node is HTMLElement => node !== null);
    const header = document.querySelector('header');
    if (!header || !element || landmarks.length !== stages.length) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let tops: number[] = [];
    let frame = 0;
    let inViewport = false;
    let headerEnd = 0;
    let previousOffset = -1;
    let layoutDirty = true;

    function update() {
      frame = 0;
      const y = window.scrollY;
      if (layoutDirty) {
        const bounds = element!.getBoundingClientRect();
        if (!bounds.width) return;
        const height = viewWidth * bounds.height / bounds.width;
        tops = landmarks.map(sectionScrollTop);
        const span = Math.max(1, tops[lastPlane] - tops[0]);
        const scale = (top: number) => (height - 122) * (top - tops[0]) / span;
        setLayout({ height, spacing: tops.map(scale) });
        headerEnd = header!.getBoundingClientRect().bottom + y;
        layoutDirty = false;
      }
      const offset = Math.max(0, headerEnd - y);
      if (offset !== previousOffset) {
        element!.style.setProperty('--header-offset', `${offset}px`);
        previousOffset = offset;
      }
      let value = 0;
      for (let i = 1; i < tops.length; i++) {
        value += Math.max(0, Math.min(1, (y - tops[i - 1]) / Math.max(1, tops[i] - tops[i - 1])));
      }
      const stage = reduced.matches ? Math.round(value) : value;
      // Ignore subpixel movement in this small illustration on long sections.
      setProgress(Math.round(stage * 256) / 256);
    }
    function schedule() {
      if (inViewport && !frame) frame = requestAnimationFrame(update);
    }
    function invalidateLayout() {
      layoutDirty = true;
      schedule();
    }
    const resize = new ResizeObserver(invalidateLayout);
    resize.observe(document.body);
    resize.observe(header);
    resize.observe(element);
    landmarks.forEach(node => resize.observe(node));

    const visibility = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      if (inViewport) {
        invalidateLayout();
        setShown(true);
        window.addEventListener('scroll', schedule, { passive: true });
      } else {
        setShown(false);
        window.removeEventListener('scroll', schedule);
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    visibility.observe(element);
    window.addEventListener('resize', invalidateLayout);
    reduced.addEventListener('change', schedule);
    return () => {
      visibility.disconnect();
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', invalidateLayout);
      reduced.removeEventListener('change', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div id="nn-verification" ref={figure} className={styles.edgeRail} data-shown={shown} aria-hidden={!shown}>
      <TraceFigure progress={progress} layout={layout} />
    </div>
  );
}
