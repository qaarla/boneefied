// BVIS03 muscular atlas: scene renderer + shape helpers. Every labelled shape is authored first;
// the pin is derived from that shape and later verified against an occlusion (id) map.
import { smooth } from './base.mjs';

export const W = 1450, H = 1000;
const f = (n) => Math.round(n * 100) / 100;
export const T = {
  m1: '#C79A8D', m2: '#BE8D84', m3: '#D3AB9D', md: '#B88B80', mdd: '#AD8076', grey: '#C9B1A5', tend: '#E6DBCB',
  bone: '#E9E2D1', skin: '#E8DFD4', lung: '#B9CBD1', paper: '#ECEAE2', hole: '#D9D3C6',
};
export const LINE = { m: '#7D5A53', fib: '#946C63', bone: '#A39A84', tend: '#A8977F', skin: '#9C8D84' };

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const box = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };

/** Fusiform / strap belly between two points; fibres follow the axis. */
export function bel(a, b, w, o = {}) {
  const { bu = 0.5, e = 0.7, bend = 0, min = 0.1, fibers = 3, t0 = 0, t1 = 1, at } = o;
  const N = 30, dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
  const C = [], L = [], R = [], HW = [];
  for (let i = 0; i <= N; i++) {
    const t = t0 + (t1 - t0) * (i / N), tp = t < bu ? 0.5 * t / bu : 0.5 + 0.5 * (t - bu) / (1 - bu);
    const hw = (w / 2) * (min + (1 - min) * Math.pow(Math.max(0, Math.sin(Math.PI * tp)), e));
    const off = bend * len * Math.sin(Math.PI * t);
    const c = [a[0] + dx * t + nx * off, a[1] + dy * t + ny * off];
    C.push(c); HW.push(hw); L.push([c[0] + nx * hw, c[1] + ny * hw]); R.push([c[0] - nx * hw, c[1] - ny * hw]);
  }
  const fr = fibers === 0 ? [] : fibers === 1 ? [0] : fibers === 2 ? [-0.3, 0.3] : [-0.5, 0, 0.5];
  const fib = fr.map((k) => C.map((c, i) => [c[0] + nx * HW[i] * k, c[1] + ny * HW[i] * k]).slice(3, N - 2));
  const pts = [...L, ...R.reverse()];
  const ai = Math.max(0, Math.min(N, Math.round((((at ?? bu) - t0) / (t1 - t0)) * N)));
  return { pts, sm: false, fib, c: C[ai], bb: box(pts) };
}
export const tn = (a, b, w, o = {}) => bel(a, b, w, { e: 0.3, min: 0.55, fibers: 0, ...o });
export function pol(pts, o = {}) {
  const c = o.anchor ?? [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  return { pts, sm: o.sm ?? true, fib: o.fib ?? [], c, bb: box(pts) };
}
export const ell = (cx, cy, rx, ry, o = {}) => pol(Array.from({ length: 28 }, (_, i) => [cx + rx * Math.cos((i / 28) * 6.2832), cy + ry * Math.sin((i / 28) * 6.2832)]), { sm: false, ...o, anchor: o.anchor ?? [cx, cy] });

export class Scene {
  constructor() { this.out = []; this.idm = []; this.items = []; this.seen = new Set(); this.n = 0; this.col = {}; this.v = { s: 1, tx: 0, ty: 0, y0: 0, sg: 1 }; this.label = new Set(); this.hide = new Set(); this.panel = ''; }
  view(s, tx, ty, y0 = 0, sg = 1) { this.v = { s, tx, ty, y0, sg }; return this; }
  P(p) { const v = this.v; return [v.tx + v.sg * p[0] * v.s, v.ty + (p[1] - v.y0) * v.s]; }
  d(pts, sm) { const q = pts.map((p) => this.P(p)); return sm ? smooth(q, true) : 'M' + q.map((p) => `${f(p[0])} ${f(p[1])}`).join('L') + 'Z'; }
  raw(s) { this.out.push(s); }
  /** Draw a shape. sid = canonical muscle id (or null for unlabelled context). */
  draw(sid, g, fill, line, o = {}) {
    if (sid && this.hide.has(sid)) return;
    const d = this.d(g.pts, g.sm), id = ++this.n, hex = `#${(id >> 8).toString(16).padStart(2, '0')}${(id & 255).toString(16).padStart(2, '0')}80`;
    let attrs = '';
    if (sid) {
      attrs = ` data-structure-id="${sid}"`;
      if (this.label.has(sid) && !this.seen.has(sid)) {
        this.seen.add(sid); this.col[sid] = hex;
        const a = this.P(o.anchor ?? g.c);
        this.items.push({ structureId: sid, x: Math.round((a[0] / W) * 10000) / 10000, y: Math.round((a[1] / H) * 10000) / 10000, radius: o.r ?? 0.018, px: a, hex, panel: this.panel, kind: o.kind ?? 'muscle', note: o.note ?? '' });
        attrs += ` data-anchor="${Math.round(a[0])},${Math.round(a[1])}"`;
      } else attrs += ' data-pin="false"';
    }
    this.out.push(`<path d="${d}" fill="${fill}" stroke="${line}" stroke-width="${o.w ?? 1.4}" stroke-linejoin="round"${attrs}/>`);
    this.idm.push(`<path d="${d}" fill="${hex}" stroke="none"/>`);
    for (const fl of g.fib ?? []) {
      if (fl.length < 2) continue;
      const q = fl.map((p) => this.P(p));
      this.out.push(`<path d="${smooth(q)}" fill="none" stroke="${LINE.fib}" stroke-width="0.8" stroke-opacity="0.55" stroke-linecap="round"/>`);
    }
  }
  m(sid, g, tone = 'm1', o = {}) { this.draw(sid, g, T[tone], LINE.m, o); }
  t(g, sid = null, o = {}) { this.draw(sid, g, T.tend, LINE.tend, { w: 1.1, ...o }); }
  b(g) { this.draw(null, g, T.bone, LINE.bone, { w: 1.4 }); }
  skin(g) { this.draw(null, g, T.skin, LINE.skin, { w: 1.4 }); }
  line(pts, color = LINE.fib, w = 0.9) { this.out.push(`<path d="${smooth(pts.map((p) => this.P(p)))}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`); }
  begin(x, y, w, h, frame = true) {
    this.cn = (this.cn ?? 0) + 1;
    const cp = `<clipPath id="c${this.cn}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18"/></clipPath>`;
    if (frame) this.out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#F3F1EA" stroke="#8A949B" stroke-width="1.2" stroke-dasharray="5 4"/>`);
    this.out.push(cp, `<g clip-path="url(#c${this.cn})">`); this.idm.push(cp, `<g clip-path="url(#c${this.cn})">`);
  }
  end() { this.out.push('</g>'); this.idm.push('</g>'); }
  svg() { return this.out.join('\n'); }
  idsvg() { return this.idm.join(''); }
}
export const mirror = (pts) => pts.map(([x, y]) => [-x, y]);
