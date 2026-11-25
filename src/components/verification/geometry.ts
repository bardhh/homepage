// Each cell has a fixed ReLU sign pattern, so every layer is affine on it.
// Clipping the input square before mapping its vertices preserves exact edges.
export type Point = [number, number];
type Polygon = Point[];
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
  return [p, z, h, [h[0] + h[1] - 1, (h[1] - h[0]) / 2]];
}

export const cells = [1, -1].flatMap(a =>
  [1, -1].map(b => clip(clip(square, 0, a), 1, b).map(layers)));

export function atLayer(vertex: Point[], progress: number): Point {
  const p = Math.min(3, Math.max(0, progress));
  const i = Math.floor(p);
  return mix(vertex[i], vertex[Math.min(i + 1, 3)], p - i);
}

export const maxOutput = Math.max(...cells.flat().map(v => v[3][0]));
export const unsafeAt = 2.25;
