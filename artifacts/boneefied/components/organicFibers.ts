/**
 * Original Boneefied decorative material, purpose-drawn October 2026.
 * Short interlocking spindle-shaped fascicles (120-220 units long, 20-50 wide) in
 * staggered flow bands: lens-shaped fiber bundles, fine internal strands that
 * pinch to local tips, and small filaments joining neighbours. A gently curved
 * flow field turns the motifs; nothing runs the length of the tile. Nonliteral,
 * smooth-muscle / dendritic inspired, NOT a histology illustration.
 * Deterministic (sine jitter, no randomness), vertically periodic, static,
 * self-contained. Shared by the native app and the website; never drawn over
 * educational assets.
 */
export const ORGANIC_VIEWBOX = '0 0 1000 1000';
/** Design scale: one tile unit is about this many CSS pixels. */
export const ORGANIC_UNIT_PX = 1.3;
export const ORGANIC_STRENGTH = 0.22;
export const ORGANIC_SURFACE_STRENGTH = 0.16;
export const ORGANIC_STRAND_WIDTH = 0.55;
export const ORGANIC_BRANCH_WIDTH = 0.6;

type Pt = [number, number];
const TAU = Math.PI * 2;
const N = 8; // samples per curve
const r = (n: number) => String(Math.round(n * 10) / 10);

function smooth(points: Pt[], move = true): string {
  let d = move ? `M ${r(points[0][0])} ${r(points[0][1])}` : '';
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const [nx, ny] = points[i + 1];
    d += ` Q ${r(x)} ${r(y)} ${r((x + nx) / 2)} ${r((y + ny) / 2)}`;
  }
  const last = points[points.length - 1];
  return `${d} L ${r(last[0])} ${r(last[1])}`;
}

export interface OrganicBundle { x: number; minX: number; maxX: number; fibers: string[]; strands: string[]; branches: string[] }
export const ORGANIC_MOTIF_LENGTHS: number[] = [];
let maxRibbon = 0;

interface Motif { cx: number; cy: number; L: number; W: number; phi: number; bend: number; col: number }
const ROWS = 10, COLS = 7, COL_STEP = 170;
const motifs: Motif[] = [];
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const cx = -30 + col * COL_STEP + (row % 2) * (COL_STEP / 2) + 22 * Math.sin(row * 1.7 + col);
    const cy = row * 100 + 16 * Math.sin(col * 2.3 + row * 0.9);
    const phi = 0.55 + 0.75 * Math.sin(TAU * cy / 1000 + cx / 260) + 0.45 * Math.sin(TAU * cx / 1000 + 1.1 * Math.sin(TAU * 2 * cy / 1000));
    motifs.push({
      cx, cy, phi, col,
      L: 130 + 90 * (0.5 + 0.5 * Math.sin(col * 1.9 + row * 2.7)),
      W: 22 + 26 * (0.5 + 0.5 * Math.sin(col * 3.1 + row * 1.3)),
      bend: 0.5 * Math.sin(col * 1.3 + row * 0.9),
    });
  }
}

const point = (m: Motif, t: number, u: number): Pt => {
  const along = t * m.L / 2;
  const across = m.bend * m.L * 0.18 * (1 - t * t) + u;
  const c = Math.cos(m.phi), s = Math.sin(m.phi);
  return [m.cx + along * c - across * s, m.cy + along * s + across * c];
};
const lens = (m: Motif, t: number) => (m.W / 2) * Math.pow(Math.max(0, 1 - t * t), 0.75);
const ts = Array.from({ length: N + 1 }, (_, i) => -1 + (2 * i) / N);

const bundles: OrganicBundle[] = Array.from({ length: COLS }, (_, col) => ({ x: -30 + col * COL_STEP + COL_STEP / 4, minX: 1e9, maxX: -1e9, fibers: [], strands: [], branches: [] }));
const shifts = [0, 1000, -1000];
function emit(bundle: OrganicBundle, list: string[], pts: Pt[], build: (dy: number) => string) {
  for (const p of pts) { bundle.minX = Math.min(bundle.minX, p[0]); bundle.maxX = Math.max(bundle.maxX, p[0]); }
  const ys = pts.map(p => p[1]);
  for (const dy of shifts) if (Math.max(...ys) + dy > 0 && Math.min(...ys) + dy < 1000) list.push(build(dy));
}
const shiftPts = (pts: Pt[], dy: number): Pt[] => pts.map(([x, y]) => [x, y + dy] as Pt);

motifs.forEach((m, mi) => {
  const b = bundles[m.col];
  ORGANIC_MOTIF_LENGTHS.push(Math.round(m.L));
  // Two slender lens ribbons that cross inside the fascicle and taper to tips.
  for (let j = 0; j < 2; j++) {
    const lane = (t: number) => (j ? 1 : -1) * 0.34 * lens(m, t) * 2 * (1 + 0.5 * Math.sin(Math.PI * t * 1.5 + mi));
    const hw = (t: number) => 0.8 * Math.pow(Math.max(0, 1 - t * t), 0.6);
    const left = ts.map(t => point(m, t, lane(t) - hw(t)));
    const right = ts.map(t => point(m, t, lane(t) + hw(t)));
    left.forEach((p, i) => { maxRibbon = Math.max(maxRibbon, Math.hypot(p[0] - right[i][0], p[1] - right[i][1])); });
    emit(b, b.fibers, [...left, ...right], dy => {
      const l = shiftPts(left, dy), rr = shiftPts(right, dy).reverse();
      return `${smooth(l)} L ${r(rr[0][0])} ${r(rr[0][1])} ${smooth(rr, false)} Z`;
    });
  }
  // Five fine internal strands that pinch together at both tips.
  const n = 5;
  for (let j = 0; j < n; j++) {
    const f = (j / (n - 1)) * 2 - 1;
    const pts = ts.map(t => point(m, t, (0.86 * f + 0.14 * Math.sin(Math.PI * t * (1 + (j % 2)) + j + mi)) * lens(m, t)));
    emit(b, b.strands, pts, dy => smooth(shiftPts(pts, dy)));
  }
  // Small filaments: a side twig, and a link from this tip toward the nearest neighbour tip.
  const twig: Pt[] = [0.15, 0.35, 0.6, 0.85].map((t, i) => {
    const base = point(m, t, 0.5 * lens(m, t));
    const a = m.phi + 0.9 + i * 0.12;
    return [base[0] + Math.cos(a) * (i * 9), base[1] + Math.sin(a) * (i * 9)] as Pt;
  });
  emit(b, b.branches, twig, dy => smooth(shiftPts(twig, dy)));
  const tip = point(m, 1, 0);
  let best: { d: number; pts: Pt[] } | null = null;
  motifs.forEach((o, oi) => {
    if (oi === mi) return;
    for (const dy of shifts) for (const e of [-1, 1]) {
      const q = point(o, e, 0);
      const d = Math.hypot(q[0] - tip[0], q[1] + dy - tip[1]);
      if (d > 14 && d < 95 && (!best || d < best.d)) {
        const qy = q[1] + dy;
        const mid: Pt = [(tip[0] + q[0]) / 2 + (tip[1] - qy) * 0.18, (tip[1] + qy) / 2 + (q[0] - tip[0]) * 0.18];
        best = { d, pts: [tip, mid, [q[0], qy]] };
      }
    }
  });
  if (best) { const link = (best as { pts: Pt[] }).pts; emit(b, b.branches, link, dy => smooth(shiftPts(link, dy))); }
});

export const organicBundles: OrganicBundle[] = bundles;
export const organicFibers: string[] = bundles.flatMap(b => b.fibers);
export const organicStrands: string[] = bundles.flatMap(b => b.strands);
export const organicBranches: string[] = bundles.flatMap(b => b.branches);
/** Widest actual ribbon across its width, tile units. */
export const ORGANIC_MAX_RIBBON = maxRibbon;

/** Self-contained SVG used as an alpha mask on the website (vertically tileable). */
export function organicFiberSvg(ink: string): string {
  const g = (list: string[]) => list.map(d => `<path d="${d}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${ORGANIC_VIEWBOX}" preserveAspectRatio="none"><g fill="${ink}">${g(organicFibers)}</g><g fill="none" stroke="${ink}" stroke-width="${ORGANIC_STRAND_WIDTH}" stroke-linecap="round">${g(organicStrands)}</g><g fill="none" stroke="${ink}" stroke-width="${ORGANIC_BRANCH_WIDTH}" stroke-linecap="round">${g(organicBranches)}</g></svg>`;
}
