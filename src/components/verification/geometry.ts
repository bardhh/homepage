// Each cell has a fixed ReLU sign pattern, so every layer is affine on it.
// Clipping the input square before mapping its vertices preserves exact edges.
export type Point = [number, number];
type Polygon = Point[];
export const unsafeAt = 2.25;
const affine = ([a, b]: Point): Point => [a - b + 0.5, a + b + 0.5];
const square: Polygon = [[-1, -1], [1, -1], [1, 1], [-1, 1]];

function clip(poly: Polygon, axis: 0 | 1, sign: number): Polygon {
  return poly.flatMap((a, i) => {
    const b = poly[(i + 1) % poly.length];
    const va = affine(a)[axis] * sign, vb = affine(b)[axis] * sign;
    const edge: Polygon = va >= 0 ? [a] : [];
    if (va * vb < 0) edge.push(mix(a, b, va / (va - vb)));
    return edge;
  });
}

export function mix(a: Point, b: Point, t: number): Point {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function layers(p: Point): Point[] {
  const z = affine(p);
  const h: Point = [Math.max(0, z[0]), Math.max(0, z[1])];
  // Factor the two affine maps into observable steps on either side of the ReLU.
  const linear: Point = [p[0] - p[1], p[0] + p[1]];
  const rotated: Point = [linear[0] / Math.SQRT2, linear[1] / Math.SQRT2];
  const sum = h[0] + h[1];
  const difference = h[1] - h[0];
  const y: Point = [sum - 1, difference / 2];
  // Rotate the output, shift the unsafe boundary to zero, then project onto the margin axis.
  const aligned: Point = [y[1], -y[0]];
  const margin: Point = [aligned[0], aligned[1] + unsafeAt];
  return [p, rotated, linear, z, h, [sum / Math.SQRT2, difference / Math.SQRT2],
    [sum, difference / 2], y, aligned, margin, [0, margin[1]]];
}

export const cells = [1, -1].flatMap(a =>
  [1, -1].map(b => clip(clip(square, 0, a), 1, b).map(layers)));

export function atLayer(vertex: Point[], progress: number): Point {
  const p = Math.min(vertex.length - 1, Math.max(0, progress));
  const i = Math.floor(p);
  return mix(vertex[i], vertex[Math.min(i + 1, vertex.length - 1)], p - i);
}

const margins = cells.flat().map(v => v[v.length - 1][1]);
export const minMargin = Math.min(...margins);
export const maxMargin = Math.max(...margins);
