// BVIS06 digestive / urinary / reproductive atlas helpers. Reuses (does not modify) the BVIS05 scene renderer.
import { sm, poly, E, RR, tube, mirX, shift, scale, lerp, cr, rng, C } from './bvis05-lib.mjs';
export * from './bvis05-lib.mjs';
export const LUM = '#F3E8E0', LUML = '#B49C92';
export const T = {
  skin: { fill: '#EADFD0', line: '#8A6E5E' }, bone: { fill: '#E4D6BC', line: '#8B8168' },
  muc: { fill: '#DDADA8', line: '#9A6A66' }, tongue: { fill: '#D69A94', line: '#8A5C54' }, muscle: { fill: '#C9958B', line: '#8A524D' },
  gut: { fill: '#E2B3A4', line: '#8A5A50' }, stomach: { fill: '#DFA89F', line: '#8A524D' }, liver: { fill: '#C28E80', line: '#7A4F44' },
  gb: { fill: '#B5BC86', line: '#69723F' }, bile: { fill: '#A9BA84', line: '#5F7040' }, panc: { fill: '#E3C892', line: '#8A6E3C' },
  pduct: { fill: '#F0E2AE', line: '#9A8A4A' }, fat: { fill: '#EFE3B2', line: '#9A8A4A' }, urine: { fill: '#EFE1A6', line: '#9A8A3A' },
  kcort: { fill: '#CC9488', line: '#8A524D' }, kmed: { fill: '#AE6F68', line: '#7A4A46' }, kidney: { fill: '#C58B80', line: '#7E4A46' },
  bladder: { fill: '#D9B5A4', line: '#8A6050' }, gland: { fill: '#D8BC92', line: '#8A6E3C' }, testis: { fill: '#E2CBA6', line: '#8A7248' },
  ovary: { fill: '#E3C4B4', line: '#8A6256' }, uterus: { fill: '#D8A9A6', line: '#8A5A58' }, lymph: { fill: '#B7CBA6', line: '#5F7A4F' },
  conn: { fill: '#EADFC8', line: '#A59A82' }, cell: { fill: '#E7C6C0', line: '#8A5C58' }, nuc: { fill: '#9C7C96', line: '#5E4A5A' },
};
const stk = (d, c, w) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
/** Connected tube network: all outlines first, then all fills, then lumen strokes, so junctions are open (no seams). */
export function net(S, items) {
  const ds = items.map((it) => ({ ...it, d: sm(it.pts, false, 8) }));
  ds.forEach((it) => S.out.push(stk(it.d, it.line, it.w + 3)));
  ds.forEach((it) => S.out.push(stk(it.d, it.fill, it.w)));
  ds.forEach((it) => { if (it.lum) S.out.push(stk(it.d, it.lum, it.lw ?? Math.max(2, it.w * 0.45))); });
  ds.forEach((it) => S.idm.push(stk(it.d, it.id ? S.hex(it.id) : '#fff', it.w + 3)));
}
/** Cosmetic patch (no id) used to open a junction. */
export const patch = (S, d, fill) => S.sh(null, d, { fill, line: fill, sw: 0.6 });
export const circ = (x, y, r) => E(x, y, r, r);
export const rect = (x, y, w, h) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
export const mir = (pts, cx) => mirX(pts, cx);
export const st = (o, sw = 1.6) => ({ fill: o.fill, line: o.line, sw });
/** Point list sampled along centreline c, offset sideways by a function of t (for folds). */
export const wav = (a, b, n, amp, ph = 0) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n; return [a[0] + (b[0] - a[0]) * t + Math.sin(t * 9 + ph) * amp * 0.3, a[1] + (b[1] - a[1]) * t + Math.sin(t * 7 + ph) * amp]; });
export { sm, poly, E, RR, tube, shift, scale, lerp, cr, rng, C };
/** Resample a smooth centreline at roughly constant arclength spacing. */
export function resample(pts, step) {
  const d = cr(pts, false, 12), out = [d[0]]; let acc = 0;
  for (let i = 1; i < d.length; i++) { acc += Math.hypot(d[i][0] - d[i - 1][0], d[i][1] - d[i - 1][1]); if (acc >= step) { out.push(d[i]); acc = 0; } }
  out.push(d[d.length - 1]); return out;
}
/** Scalloped (haustrated) tube: circles unioned with one outline, per-circle ids allowed. */
export function scallop(S, items) {
  const cs = [];
  items.forEach((it) => resample(it.pts, it.step ?? 46).forEach((c, k) => cs.push({ c, r: it.r, id: it.idAt ? it.idAt(k) : it.id, fill: it.fill, line: it.line })));
  S.out.push(`<g stroke-linejoin="round">${cs.map((o) => `<path d="${E(o.c[0], o.c[1], o.r + 1.8, o.r + 1.8)}" fill="${o.line}" stroke="${o.line}" stroke-width="1"/>`).join('')}</g>`);
  S.out.push(`<g>${cs.map((o) => `<path d="${E(o.c[0], o.c[1], o.r, o.r)}" fill="${o.fill}" stroke="${o.fill}" stroke-width="0.5"/>`).join('')}</g>`);
  cs.forEach((o) => S.idm.push(`<path d="${E(o.c[0], o.c[1], o.r + 1.8, o.r + 1.8)}" fill="${o.id ? S.hex(o.id) : '#fff'}"/>`));
}
