// BVIS04 neuro / senses / skin / tissue atlas: scene renderer + geometry helpers.
// Flat matte fills only. Every labelled shape is authored first; pins are derived from the
// rendered semantic id-map (own-colour interior pixels), never from free-floating coordinates.
export const W = 1450, H = 1000;
export const C = {
  paper: '#ECEAE2', panel: '#F2EFE8', panelLine: '#CFCABD', ink: '#4C5760', soft: '#8A949B',
  brain: '#D2BEC4', brainDk: '#BFA6AE', brainLn: '#7E6670', white: '#E9E4DA', whiteLn: '#8F8A7E', gray: '#B9B2B8',
  csf: '#C4D4DC', csfLn: '#6F8D9A', bone: '#E7DFCC', boneLn: '#8B8168', skin: '#E8D6C6', skinLn: '#8A6E5E',
  nerve: '#D8B65A', nerveLn: '#8F7424', nerve2: '#C99A4A', red: '#B87472', redLn: '#7E4A49', blue: '#8DA8C0', blueLn: '#4F6C86',
  fat: '#E9DCA6', fatLn: '#9A8A4A', pink: '#DDB8B6', pinkLn: '#8A6060', lilac: '#C9BCD6', lilacLn: '#6F6381', teal: '#A9C6C0', tealLn: '#4F7A74',
  green: '#B9CBA8', greenLn: '#5F7A4F', ochre: '#DDC08E', ochreLn: '#8A6E3C', mute: '#D9D4C8', muteLn: '#A59F90', ink2: '#7A858C',
};
const f = (n) => Math.round(n * 100) / 100;
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
export function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

/** Catmull-Rom sampled polyline through vertices (vertex k sits at index k*n). */
export function cr(pts, closed = false, n = 8) {
  const out = [], N = pts.length, g = (i) => (closed ? pts[(i + N) % N] : pts[clamp(i, 0, N - 1)]);
  const segs = closed ? N : N - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((a) => 0.5 * (2 * p1[a] + (-p0[a] + p2[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3)));
    }
  }
  if (!closed) out.push(pts[N - 1]);
  return out;
}
export const poly = (pts, closed = true) => 'M' + pts.map((p) => f(p[0]) + ' ' + f(p[1])).join('L') + (closed ? 'Z' : '');
export const sm = (pts, closed = true, n = 8) => poly(cr(pts, closed, n), closed);
export function E(cx, cy, rx, ry, rot = 0) {
  const a = (rot * Math.PI) / 180, dx = rx * Math.cos(a), dy = rx * Math.sin(a);
  return `M${f(cx - dx)} ${f(cy - dy)}A${rx} ${ry} ${rot} 1 0 ${f(cx + dx)} ${f(cy + dy)}A${rx} ${ry} ${rot} 1 0 ${f(cx - dx)} ${f(cy - dy)}Z`;
}
export const RR = (x, y, w, h, r = 10) => `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
/** Offset a centreline into a tube polygon (width function w(t)). */
export function tube(center, w0, w1 = w0, closedEnds = true) {
  const pts = cr(center, false, 10), N = pts.length, L = [], R = [];
  for (let i = 0; i < N; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const hw = (w0 + (w1 - w0) * (i / (N - 1))) / 2;
    L.push([pts[i][0] - dy * hw, pts[i][1] + dx * hw]); R.push([pts[i][0] + dy * hw, pts[i][1] - dx * hw]);
  }
  void closedEnds;
  return poly([...L, ...R.reverse()]);
}
export const along = (pts, t) => { const d = cr(pts, false, 10); return d[Math.round(clamp(t, 0, 1) * (d.length - 1))]; };

export class Scene {
  constructor(key) { this.key = key; this.out = []; this.idm = []; this.keys = new Map(); this.pins = []; this.panelName = ''; this.cn = 0; this.panels = []; }
  hex(key) {
    if (!this.keys.has(key)) { const n = this.keys.size + 1; this.keys.set(key, '#' + [(n * 53) % 251 + 2, (n * 97) % 241 + 6, (n * 29) % 233 + 10].map((v) => v.toString(16).padStart(2, '0')).join('')); }
    return this.keys.get(key);
  }
  panel(x, y, w, h, name, fill = C.panel) {
    this.panelName = name; this.panels.push({ name, x, y, w, h });
    const d = RR(x, y, w, h, 14);
    this.out.push(`<path d="${d}" fill="${fill}" stroke="${C.panelLine}" stroke-width="1.4"/>`);
    this.idm.push(`<path d="${d}" fill="#fff"/>`);
  }
  /** Closed filled shape. id => registers a pickable region. */
  sh(id, d, o = {}) {
    const { fill = C.mute, line = C.muteLn, sw = 1.6, dash, op } = o;
    this.out.push(`<path d="${d}" fill="${fill}" stroke="${line}" stroke-width="${sw}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}${op ? ` opacity="${op}"` : ''}/>`);
    if (op && op < 1) return; // translucent decoration does not occlude
    this.idm.push(`<path d="${d}" fill="${id ? this.hex(id) : '#fff'}"/>`);
  }
  /** Open stroked path (nerve, vessel, fibre). id => pickable with min 9px id-width. */
  ln(id, d, o = {}) {
    const { color = C.nerveLn, w = 3, dash, cap = 'round', occ = false, op } = o;
    this.out.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="${cap}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}${op ? ` opacity="${op}"` : ''}/>`);
    if (id) this.idm.push(`<path d="${d}" fill="none" stroke="${this.hex(id)}" stroke-width="${Math.max(w, 11)}" stroke-linecap="round" stroke-linejoin="round"/>`);
    else if (occ) this.idm.push(`<path d="${d}" fill="none" stroke="#fff" stroke-width="${w}" stroke-linecap="round"/>`);
  }
  /** Tube nerve/vessel with a visible edge: filled polygon from a centreline. */
  tb(id, center, w0, w1, o = {}) { this.sh(id, tube(center, w0, w1), { fill: o.fill ?? C.nerve, line: o.line ?? C.nerveLn, sw: o.sw ?? 1.3 }); }
  /** Union of several closed shapes with a single outer outline (no internal seams). */
  union(id, ds, o = {}) {
    const { fill = C.mute, line = C.muteLn, sw = 1.6 } = o;
    this.out.push(`<g fill="${line}" stroke="${line}" stroke-width="${sw * 2}" stroke-linejoin="round">${ds.map((d) => `<path d="${d}"/>`).join('')}</g>`);
    this.out.push(`<g fill="${fill}" stroke="${fill}" stroke-width="0.6">${ds.map((d) => `<path d="${d}"/>`).join('')}</g>`);
    this.idm.push(`<g fill="${id ? this.hex(id) : '#fff'}">${ds.map((d) => `<path d="${d}"/>`).join('')}</g>`);
  }
  beginT(tx, ty, sc) { const t = `<g transform="translate(${tx} ${ty}) scale(${sc})">`; this.out.push(t); this.idm.push(t); }
  endT() { this.out.push('</g>'); this.idm.push('</g>'); }
  arrow(x, y, ang, len = 16, color = C.ink2) {
    const a = (ang * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a), p = (u, v) => [x + u * c - v * s, y + u * s + v * c];
    this.sh(null, poly([p(len, 0), p(-len * 0.5, len * 0.55), p(-len * 0.2, 0), p(-len * 0.5, -len * 0.55)]), { fill: color, line: color, sw: 0.5 });
  }
  clip(d) { this.cn++; this.out.push(`<clipPath id="c${this.cn}"><path d="${d}"/></clipPath><g clip-path="url(#c${this.cn})">`); }
  clipBoth(d) { this.cn++; const c = `<clipPath id="k${this.cn}"><path d="${d}"/></clipPath><g clip-path="url(#k${this.cn})">`; this.out.push(c); this.idm.push(c); }
  clipBothEnd() { this.out.push('</g>'); this.idm.push('</g>'); }
  pipe(id, pts, w, fill, line, closed = false) { const d = sm(pts, closed, 8); this.ln(id, d, { color: line, w }); this.out.push(`<path d="${d}" fill="none" stroke="${fill}" stroke-width="${w - 3}" stroke-linecap="round" stroke-linejoin="round"/>`); }
  clipEnd() { this.out.push('</g>'); }
  /** Decorative curved lines (gyri etc.) clipped to d. */
  squig(d, x0, y0, x1, y1, count, amp, o = {}) {
    const r = rng(o.seed ?? 7), { color = C.brainLn, w = 1.1, vert = false } = o;
    this.clip(d);
    for (let i = 0; i < count; i++) {
      const pts = [], n = 9, t0 = i / count;
      for (let k = 0; k <= n; k++) {
        const a = k / n;
        const u = (vert ? x0 + (x1 - x0) * t0 + (r() - 0.5) * 18 : y0 + (y1 - y0) * t0 + (r() - 0.5) * 18) + Math.sin(a * 9 + r() * 6) * amp * (0.4 + r());
        pts.push(vert ? [u, y0 + (y1 - y0) * a] : [x0 + (x1 - x0) * a, u]);
      }
      this.out.push(`<path d="${sm(pts, false, 4)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" opacity="0.55"/>`);
    }
    this.clipEnd();
  }
  /** Request a pin (structure id) on the shape registered under `key`; hint picks the spot. */
  pin(structureId, key, hint, o = {}) { this.pins.push({ structureId, key: key ?? structureId, hint, panel: o.panel ?? this.panelName, radius: o.radius ?? 0.018 }); }
  at(name) { this.panelName = name; }
  svg() { return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${C.paper}"/>\n${this.out.join('\n')}\n</svg>\n`; }
  idsvg() { return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" shape-rendering="crispEdges"><rect width="${W}" height="${H}" fill="#fff"/>${this.idm.join('')}</svg>`; }
}
