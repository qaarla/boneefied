// BVIS02 skeletal atlas: semantic-geometry helpers on top of the BVIS01 tokens and base strokes.
// Every labelled shape is authored first; the pin is DERIVED from that shape (centroid or a bbox fraction).
import { CANVAS, PALETTE as C, STROKE as S } from './tokens.mjs';
import { smooth, limb, unit, stroked } from './base.mjs';

export const W = CANVAS.width, H = CANVAS.height;
const f = (n) => Math.round(n * 10) / 10;
const geom = (d, pts, pad = 0) => {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  return { d, c: [xs.reduce((a, b) => a + b, 0) / xs.length, ys.reduce((a, b) => a + b, 0) / ys.length], bb: [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) + pad, Math.max(...ys) + pad] };
};
export const ell = (cx, cy, rx, ry, rot = 0) => {
  const a = (rot * Math.PI) / 180, pts = [];
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * Math.PI * 2, x = Math.cos(t) * rx, y = Math.sin(t) * ry;
    pts.push([cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]);
  }
  const g = geom(smooth(pts, true), pts); g.c = [cx, cy]; return g;
};
export const pg = (pts, sm = true) => geom(sm ? smooth(pts, true) : 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z', pts);
export const lm = (axis) => { const g = geom(limb(axis), axis.map(([x, y]) => [x, y])); const w = Math.max(...axis.map((p) => p[2])); g.bb = [g.bb[0] - w, g.bb[1] - w, g.bb[2] + w, g.bb[3] + w]; return g; };
export const rc = (x, y, w, h) => pg([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], false);
export const mx = (x) => W - x;
export const mp = (pts) => pts.map(([x, y, ...r]) => [mx(x), y, ...r]);

export const STYLES = {
  ax: { fill: C.axial, line: C.axialLine }, ap: { fill: C.appendicular, line: C.appendicularLine },
  axs: { fill: C.axialShade, line: C.axialLine }, aps: { fill: C.appendicularShade, line: C.appendicularLine },
  bone: { fill: C.bone, line: C.boneLine }, bones: { fill: C.boneShade, line: C.boneLine },
  hole: { fill: '#56636A', line: '#38434A' }, orb: { fill: '#DAD6CA', line: C.axialLine },
  art: { fill: C.cartilage, line: C.axialLine }, lig: { fill: '#C9A3A0', line: '#7C5552' },
  reg1: { fill: '#D4DADC', line: C.inkSoft }, reg2: { fill: '#DDD4C6', line: C.inkSoft }, reg3: { fill: '#D8D2DD', line: C.inkSoft },
  cap: { fill: '#E4D7B0', line: '#8A7146' }, fluid: { fill: '#C6D6DC', line: '#6C8A94' },
};

export class Plate {
  constructor() { this.out = []; this.items = []; this.seen = new Set(); }
  raw(s) { this.out.push(s); }
  panel(x, y, w, h) { this.raw(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="#F3F1EA" stroke="${C.inkSoft}" stroke-width="1.4" stroke-dasharray="${S.dash}"/>`); }
  /** Unlabelled supporting shape. */
  u(g, st = 'bone', o = {}) { this.s(null, g, st, o); }
  /** Semantic shape. First shape per structure id becomes the single pin (unless pin:false). */
  s(sid, g, st = 'bone', o = {}) {
    const style = STYLES[st];
    let attrs = '';
    if (sid) {
      attrs = ` data-structure-id="${sid}"`;
      if (o.pin !== false && !this.seen.has(sid)) {
        this.seen.add(sid);
        const [x0, y0, x1, y1] = g.bb;
        const a = o.anchor ?? (o.at ? [x0 + o.at[0] * (x1 - x0), y0 + o.at[1] * (y1 - y0)] : g.c);
        this.items.push({ structureId: sid, x: Math.round((a[0] / W) * 10000) / 10000, y: Math.round((a[1] / H) * 10000) / 10000, radius: o.r ?? 0.016, shapeBox: g.bb.map(Math.round), anchor: o.anchor ? 'authored-feature-point' : o.at ? `bbox-fraction(${o.at.join(',')})` : 'shape-centroid' });
        attrs += ` data-anchor="${Math.round(a[0])},${Math.round(a[1])}"`;
      } else attrs += ' data-pin="false"';
    }
    this.raw(unit([g.d], { fill: o.fill ?? style.fill, line: o.line ?? style.line, width: o.w ?? 1.5, extra: attrs }));
  }
  /** Fine detail line (suture, ridge, edge). */
  ln(pts, color = C.axialLine, w = S.detail, sm = true) { this.raw(stroked(sm ? smooth(pts) : 'M' + pts.map((p) => p.join(' ')).join('L'), color, w)); }
  get labels() { return this.items; }
  svg() { return this.out.join(''); }
}
