// Boneefied foundational atlas: reusable vector primitives and anatomy shapes.
// All shapes are authored here from scratch; nothing is traced or imported.
import { PALETTE as C, STROKE as S } from './tokens.mjs';

const f = (n) => Math.round(n * 100) / 100;

/** Catmull-Rom spline through points -> cubic bezier path data. */
export function smooth(points, closed = false) {
  const n = points.length;
  const p = (i) => closed ? points[(i + n) % n] : points[Math.max(0, Math.min(n - 1, i))];
  let d = `M${f(points[0][0])} ${f(points[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? d + 'Z' : d;
}

/** Mirror a right-half contour (top to bottom, ends on the midline) into a closed smooth path. */
export function mirrored(half) {
  const left = half.slice(1, -1).reverse().map(([x, y]) => [-x, y]);
  return smooth([...half, ...left], true);
}

/** Variable-width capsule along a smoothed axis [[x, y, halfWidth], ...]. */
export function limb(axis, steps = 10) {
  const dense = [];
  for (let i = 0; i < axis.length - 1; i++) {
    const p0 = axis[Math.max(0, i - 1)], p1 = axis[i], p2 = axis[i + 1], p3 = axis[Math.min(axis.length - 1, i + 2)];
    for (let k = 0; k < steps; k++) {
      const t = k / steps, t2 = t * t, t3 = t2 * t;
      const q = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      dense.push([q(p0[0], p1[0], p2[0], p3[0]), q(p0[1], p1[1], p2[1], p3[1]), p1[2] + (p2[2] - p1[2]) * t]);
    }
  }
  dense.push(axis[axis.length - 1]);
  const L = [], R = [];
  dense.forEach((pt, i) => {
    const a = dense[Math.max(0, i - 1)], b = dense[Math.min(dense.length - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    const m = Math.hypot(tx, ty) || 1; tx /= m; ty /= m;
    L.push([pt[0] - ty * pt[2], pt[1] + tx * pt[2]]);
    R.push([pt[0] + ty * pt[2], pt[1] - tx * pt[2]]);
  });
  const tan = (i, j) => Math.atan2(dense[j][1] - dense[i][1], dense[j][0] - dense[i][0]);
  const cap = (pt, base, from) => {
    const out = [];
    for (let k = 1; k < 7; k++) { const a = base + from - (Math.PI * k) / 7; out.push([pt[0] + Math.cos(a) * pt[2], pt[1] + Math.sin(a) * pt[2]]); }
    return out;
  };
  const first = dense[0], end = dense[dense.length - 1];
  const endBase = tan(dense.length - 2, dense.length - 1), startBase = tan(0, 1);
  // offsets: L = tangent rotated +90deg, R = -90deg. End cap sweeps +90 -> -90 through the tangent; start cap sweeps -90 -> -270 through the reverse.
  const pts = [...L, ...cap(end, endBase, Math.PI / 2), ...R.slice().reverse(), ...cap(first, startBase, -Math.PI / 2)];
  return 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z';
}

export const ellipse = (cx, cy, rx, ry) => `M${f(cx - rx)} ${f(cy)}a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0Z`;
export const line = (pts) => 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L');

/** Two-pass fill: a thick outline layer under a flat fill, so overlapping parts never show seams. */
export function unit(paths, { fill, line: stroke, width = S.outline, id, extra = '' }) {
  const body = paths.join('');
  const attrs = id ? ` id="${id}"` : '';
  return `<g${attrs}${extra}><path d="${body}" fill="${stroke}" stroke="${stroke}" stroke-width="${f(width * 2)}" stroke-linejoin="round" stroke-linecap="round"/><path d="${body}" fill="${fill}" stroke="none"/></g>`;
}
export const stroked = (d, color, width = S.detail, extra = '') => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
export const filled = (d, fill, line2, width = S.detail, extra = '') => `<path d="${d}" fill="${fill}" stroke="${line2}" stroke-width="${width}" stroke-linejoin="round"${extra}/>`;

/* ---------- Surface body (local units, midline x=0, head top y=0) ---------- */

const torsoHalf = [[0, 126], [44, 132], [92, 142], [112, 158], [106, 195], [92, 245], [82, 300], [80, 350], [88, 400], [98, 440], [90, 468], [0, 472]];
const headHalf = [[0, 0], [36, 5], [53, 32], [54, 62], [46, 92], [28, 110], [0, 117]];
const neckHalf = [[0, 100], [22, 104], [24, 138], [0, 138]];

export const torsoPath = () => mirrored(torsoHalf);
/** Cropped torso study silhouette (neck stub to groin) used by the abdominal map plates. */
export const torsoCropPath = () => mirrored([[0, 104], [22, 106], [26, 132], [60, 138], [92, 146], [112, 160], [106, 195], [92, 245], [82, 300], [80, 350], [88, 400], [98, 440], [92, 466], [60, 476], [0, 480]]);

function handShapes() {
  const fingers = [
    [[9, 44, 4.8], [10, 66, 4.2], [10.5, 88, 3.6]],
    [[3, 44, 4.8], [3, 74, 4.2], [3, 96, 3.6]],
    [[-3, 44, 4.6], [-4, 70, 4], [-4, 90, 3.4]],
    [[-9, 43, 4.2], [-11, 62, 3.7], [-11, 78, 3.2]],
  ];
  const thumb = [[11, 8, 5.8], [21, 28, 5.2], [26, 48, 4.6], [28, 62, 3.6]]; // thumb is lateral (+x)
  return [limb([[0, 0, 10], [0, 20, 13.5], [0, 44, 12.5]]), ...fingers.map((a) => limb(a)), limb(thumb)];
}

/** Viewer-right half: arm, hand, leg, foot. Same geometry serves anterior and posterior views. */
export function sideSurface(view) {
  const arm = limb([[106, 170, 26], [121, 232, 22], [140, 318, 17], [158, 390, 15], [176, 452, 11]]);
  const hand = `<g transform="translate(176 452) rotate(-15)"><path d="${handShapes().join('')}"/></g>`;
  const leg = limb([[52, 430, 46], [51, 520, 43], [41, 612, 29], [46, 712, 28], [44, 790, 19], [42, 812, 17]]);
  const foot = view === 'anterior'
    ? smooth([[24, 804], [60, 804], [66, 828], [80, 852], [80, 868], [62, 874], [30, 874], [20, 860], [22, 828]], true)
    : smooth([[26, 806], [58, 806], [64, 830], [60, 856], [44, 864], [26, 858], [20, 830]], true);
  return { arm, hand, leg, foot };
}

/** Skin-tone silhouette group (outline + fill). `fill` may be lightened for organ plates. */
export function bodySilhouette(view, { fill = C.skin } = {}) {
  const s = sideSurface(view);
  const half = (paths) => `${paths.join('')}`;
  const centre = [mirrored(headHalf), mirrored(neckHalf), torsoPath(), ellipse(-55, 62, 7, 14), ellipse(55, 62, 7, 14)];
  const defs = `<defs><g id="surface-half"><path d="${s.arm}"/><path d="${s.leg}"/><path d="${s.foot}"/>${s.hand}</g></defs>`;
  const layer = (style) => `<g ${style}><path d="${half(centre)}"/><use xlink:href="#surface-half" href="#surface-half"/><use xlink:href="#surface-half" href="#surface-half" transform="scale(-1 1)"/></g>`;
  return defs + `<g id="body-silhouette">${layer(`fill="${C.skinLine}" stroke="${C.skinLine}" stroke-width="${S.outline * 2}" stroke-linejoin="round"`)}${layer(`fill="${fill}" stroke="none"`)}</g>`;
}

export function surfaceDetail(view) {
  const d = [];
  const L = C.skinLine;
  if (view === 'anterior') {
    d.push(filled(ellipse(0, 332, 3, 4.2), C.skin, L, S.detail));
    d.push(stroked(line([[-6, 118], [-14, 126]]), L, S.fine), stroked(line([[6, 118], [14, 126]]), L, S.fine));
    d.push(stroked(smooth([[-4, 66], [-2, 74], [4, 76]]), L, S.fine));
    d.push(stroked(smooth([[-12, 96], [0, 99], [12, 96]]), L, S.fine));
    d.push(stroked(smooth([[-50, 432], [-30, 446], [-8, 462]]), L, S.fine), stroked(smooth([[50, 432], [30, 446], [8, 462]]), L, S.fine));
    d.push(filled(ellipse(-50, 226, 3.2, 3.2), C.skin, L, S.fine), filled(ellipse(50, 226, 3.2, 3.2), C.skin, L, S.fine));
    d.push(stroked(smooth([[-14, 150], [-48, 146], [-92, 154]]), L, S.fine, ' opacity=".7"'), stroked(smooth([[14, 150], [48, 146], [92, 154]]), L, S.fine, ' opacity=".7"'));
  } else {
    d.push(`<path d="${smooth([[-53, 62], [-50, 24], [-26, 4], [0, 0], [26, 4], [50, 24], [53, 62], [44, 50], [24, 40], [0, 36], [-24, 40], [-44, 50]], true)}" fill="${C.hair}" stroke="${C.skinLine}" stroke-width="${S.detail}"/>`);
    d.push(stroked(line([[0, 138], [0, 440]]), L, S.fine, ' opacity=".7"'));
    d.push(stroked(smooth([[-60, 440], [-40, 462], [0, 468]]), L, S.fine), stroked(smooth([[60, 440], [40, 462], [0, 468]]), L, S.fine));
    d.push(stroked(line([[0, 432], [0, 470]]), L, S.detail));
  }
  const side = (sx) => {
    const t = sx < 0 ? ' transform="scale(-1 1)"' : '';
    const lines = view === 'anterior'
      ? [stroked(smooth([[34, 612], [49, 622], [62, 612]]), L, S.fine), `<g transform="translate(176 452) rotate(-15)">${stroked(smooth([[7, 8], [-2, 24], [-6, 40]]), L, S.fine)}${stroked(smooth([[-8, 14], [0, 18], [8, 20]]), L, S.fine)}</g>`]
      : [stroked(smooth([[30, 590], [42, 600], [54, 592]]), L, S.fine), stroked(smooth([[34, 450], [52, 470], [76, 456]]), L, S.fine, ' opacity=".6"')];
    return `<g${t}>${lines.join('')}</g>`;
  };
  return `<g id="surface-detail">${d.join('')}${side(1)}${side(-1)}</g>`;
}

/* ---------- Skeleton ---------- */

const ribW = [56, 68, 76, 82, 84, 86, 84, 80, 74, 66, 54, 42];
const sternumJunction = [152, 168, 184, 198, 212, 226, 238];
const ribFrontEnd = { 1: [34, 173], 2: [42, 190], 3: [48, 207], 4: [54, 221], 5: [58, 236], 6: [62, 252], 7: [62, 266], 8: [72, 296], 9: [74, 308], 10: [68, 318], 11: [46, 318], 12: [34, 326] };
const cartilageEnd = { 8: [18, 248], 9: [44, 274], 10: [56, 288] };

export const ribGeometry = (i, view) => {
  const ay = 150 + 13 * (i - 1);
  const lx = ribW[i - 1], ly = i <= 7 ? ay + 14 + 1.6 * i : [268, 282, 297, 296, 308][i - 8];
  if (view === 'posterior') return { axis: [[12, ay, 2.3], [(12 + lx) / 2 + 6, ay + 6 + i * 0.8, 2.5], [lx, ly + 2, 2.5]], lateral: [lx, ly], cart: null };
  const b = ribFrontEnd[i];
  const axis = [[12, ay, 2.5], [lx * 0.6 + 8, ay + 4 + i * 0.5, 2.7], [lx, ly, 2.7], [(lx + b[0]) / 2 + 6, (ly + b[1]) / 2 - 2, 2.6], [b[0], b[1], 2.5]];
  let cart = null;
  if (i <= 7) cart = [[b[0], b[1], 2], [(b[0] + 9) / 2 + 4, (b[1] + sternumJunction[i - 1]) / 2 - 4, 2], [9, sternumJunction[i - 1], 2]];
  else if (i <= 10) cart = [[b[0], b[1], 2], [(b[0] + cartilageEnd[i][0]) / 2, (b[1] + cartilageEnd[i][1]) / 2, 2], [cartilageEnd[i][0], cartilageEnd[i][1], 2]];
  return { axis, lateral: [lx, ly], cart };
};

/** Skeleton as role-tagged units. mode 'plain' uses one bone colour; 'divisions' separates axial and appendicular. */
export function skeleton(view, mode = 'plain') {
  const roles = {
    axial: mode === 'divisions' ? { fill: C.axial, line: C.axialLine } : { fill: C.bone, line: C.boneLine },
    appendicular: mode === 'divisions' ? { fill: C.appendicular, line: C.appendicularLine } : { fill: C.bone, line: C.boneLine },
  };
  const shade = (role) => mode === 'divisions' ? (role === 'axial' ? C.axialShade : C.appendicularShade) : C.boneShade;
  const ax = roles.axial, ap = roles.appendicular;
  const u = (role, paths, id, extra) => unit(paths, { fill: roles[role].fill, line: roles[role].line, width: S.bone, id, extra });
  const out = { axial: [], appendicular: [] };
  const post = view === 'posterior';

  // ---- axial: skull
  if (!post) {
    const cranium = ellipse(0, 44, 42, 44);
    const face = smooth([[-31, 70], [-24, 98], [0, 106], [24, 98], [31, 70]], true);
    const zyg = [ellipse(-33, 76, 6, 5), ellipse(33, 76, 6, 5)];
    out.axial.push(u('axial', [cranium, face, ...zyg], 'skull'));
    const sk = [filled(ellipse(-16, 62, 9, 8), C.paper, ax.line, S.detail), filled(ellipse(16, 62, 9, 8), C.paper, ax.line, S.detail),
      filled(smooth([[0, 70], [-5, 84], [0, 82], [5, 84]], true), C.paper, ax.line, S.fine),
      filled(`M${-13} 95H13V101H${-13}Z`, C.paper, ax.line, S.fine), stroked(line([[-6, 95], [-6, 101], [0, 95], [0, 101], [6, 95], [6, 101]]), ax.line, 0.5)];
    out.axial.push(`<g id="skull-detail">${sk.join('')}</g>`);
    out.axial.push(u('axial', [limb([[-32, 84, 3.2], [-24, 102, 3.4], [0, 110, 3.6], [24, 102, 3.4], [32, 84, 3.2]])], 'mandible'));
  } else {
    out.axial.push(u('axial', [ellipse(0, 44, 42, 44), smooth([[-31, 74], [-25, 98], [0, 106], [25, 98], [31, 74]], true)], 'skull'));
    out.axial.push(`<g id="skull-detail">${stroked(line([[0, 4], [0, 58]]), ax.line, S.detail)}${stroked(smooth([[0, 58], [-20, 62], [-36, 76]]), ax.line, S.detail)}${stroked(smooth([[0, 58], [20, 62], [36, 76]]), ax.line, S.detail)}${stroked(smooth([[-38, 60], [-42, 80], [-34, 92]]), ax.line, S.fine)}${stroked(smooth([[38, 60], [42, 80], [34, 92]]), ax.line, S.fine)}</g>`);
  }

  // ---- axial: column
  const blocks = [];
  const bl = (y, h, w) => post
    ? `${ellipse(0, y + h / 2, w / 2, h / 2)}${ellipse(0, y + h * 0.5, 2.6, h * 0.62)}M${-(w / 2 + 6)} ${f(y + h * 0.35)}H${w / 2 + 6}V${f(y + h * 0.7)}H${-(w / 2 + 6)}Z`
    : ellipse(0, y + h / 2, w / 2, h / 2);
  for (let i = 0; i < 7; i++) blocks.push(bl(119 + i * 4.3, 3.5, 17));
  for (let i = 0; i < 12; i++) blocks.push(bl(150 + i * 11.8, 9.6, 21));
  for (let i = 0; i < 5; i++) blocks.push(bl(292 + i * 16.6, 13.5, 29));
  out.axial.push(u('axial', blocks, 'vertebral-column'));
  out.axial.push(u('axial', [mirrored([[0, 372], [30, 376], [27, 392], [19, 414], [9, 436], [0, 442]]), limb([[0, 438, 4.2], [0, 454, 2.4]])], 'sacrum-coccyx'));

  // ---- appendicular: pelvic inlet shade + hip bones (drawn before sacrum would hide them, so insert early)
  const hip = smooth([[12, 372], [34, 340], [62, 333], [80, 346], [82, 372], [74, 396], [82, 424], [76, 452], [62, 466], [46, 462], [30, 458], [6, 456], [4, 432], [20, 424], [36, 404], [24, 390]], true);
  const hipPaths = [hip];
  const hipUnit = (sx) => `<g${sx < 0 ? ' transform="scale(-1 1)"' : ''}>${unit(hipPaths, { fill: ap.fill, line: ap.line, width: S.bone })}${post ? stroked(smooth([[24, 392], [40, 408], [52, 416]]), ap.line, S.detail) : filled(ellipse(46, 442, 10, 13), C.paper, ap.line, S.detail)}</g>`;
  out.appendicular.push(`<g id="hip-bones">${hipUnit(1)}${hipUnit(-1)}${filled(mirrored([[0, 396], [24, 400], [38, 414], [30, 430], [14, 440], [0, 442]]), shade('appendicular'), ap.line, S.detail)}</g>`);

  // ---- ribs (+ cartilage), sternum
  const ribParts = [];
  for (let i = 1; i <= 12; i++) {
    const g = ribGeometry(i, view);
    ribParts.push({ i, bone: limb(g.axis), cart: g.cart ? limb(g.cart) : null });
  }
  const ribGroup = (sx) => {
    const t = sx < 0 ? ' transform="scale(-1 1)"' : '';
    return `<g${t}>${post ? '' : unit(ribParts.filter((r) => r.cart).map((r) => r.cart), { fill: C.cartilage, line: ax.line, width: 1.2 })}${unit(ribParts.map((r) => r.bone), { fill: ax.fill, line: ax.line, width: S.bone })}</g>`;
  };
  out.axial.push(`<g id="ribs-12-pairs">${ribGroup(1)}${ribGroup(-1)}</g>`);
  if (!post) out.axial.push(u('axial', [limb([[0, 142, 13], [0, 160, 12]]), limb([[0, 170, 7.5], [0, 234, 8]]), limb([[0, 238, 3.4], [0, 252, 2]])], 'sternum'));

  // ---- appendicular: clavicle, scapula, arm/hand, leg/foot (viewer-right unit, mirrored)
  const clav = limb([[9, 143, 4], [34, 142, 3.2], [62, 136, 3], [86, 141, 3.2], [106, 152, 3.8]]);
  const scap = smooth([[26, 168], [60, 162], [90, 166], [98, 178], [88, 202], [70, 232], [48, 262], [30, 264], [24, 232], [24, 192]], true);
  const sideBones = [];
  const humerus = [limb([[112, 186, 6], [122, 236, 6.5], [134, 300, 6.5], [140, 314, 9]]), ellipse(110, 178, 11, 11), ellipse(140, 318, 11, 7)];
  const forearm = `<g transform="translate(140 318) rotate(-15)"><path d="${[limb([[-3, 6, 5.5], [-4, 70, 3.8], [-3, 126, 4.6]]), limb([[7, 16, 4.2], [8, 70, 4.4], [10, 128, 6.2]])].join('')}" fill="${ap.fill}" stroke="${ap.line}" stroke-width="${S.bone}"/></g>`;
  const fing = (x, y, dx, segs, w) => { let yy = y; return segs.map((l) => { const d = limb([[x + dx * (yy - y), yy, w], [x + dx * (yy + l - y), yy + l, w]]); yy += l + 2; return d; }); };
  const handB = [
    ...[[-8, 6], [-2.5, 5], [3, 5], [8, 7], [-9, 13], [-3, 12], [3, 12], [9, 13], [13, 9]].map(([x, y]) => ellipse(x, y, 3.3, 3.3)),
    limb([[9, 17, 2.6], [9.5, 46, 2.6]]), limb([[3, 16, 2.6], [3, 48, 2.6]]), limb([[-3, 16, 2.6], [-4, 46, 2.6]]), limb([[-9, 17, 2.4], [-11, 42, 2.4]]), limb([[13, 12, 2.8], [21, 30, 2.8]]),
    ...fing(9.7, 48.5, 0.03, [14, 10, 9], 2.4), ...fing(3, 50, 0, [17, 12, 10], 2.4), ...fing(-4, 48, -0.03, [15, 10, 9], 2.3), ...fing(-11, 44, -0.04, [11, 8, 7], 2.1), ...fing(22, 32, 0.4, [14, 12], 2.6),
  ];
  const handBones = `<g transform="translate(176 452) rotate(-15)"><path d="${handB.join('')}" fill="${ap.fill}" stroke="${ap.line}" stroke-width="${S.fine}"/></g>`;
  const femur = [ellipse(68, 424, 11, 11), limb([[68, 424, 6], [82, 440, 6.5]]), ellipse(86, 446, 8, 9), limb([[80, 448, 7.5], [70, 520, 7], [58, 600, 8]]), ellipse(50, 612, 16, 9)];
  const patella = ellipse(49, 620, 8.5, 10.5);
  const tibia = limb([[44, 626, 9.5], [44, 640, 6], [42, 720, 5.2], [40, 796, 6], [37, 808, 8]]);
  const fibula = limb([[62, 636, 3.6], [61, 720, 3], [57, 800, 3.6], [57, 812, 4.5]]);
  const footB = post ? [ellipse(42, 830, 15, 17)] : [
    ellipse(42, 822, 17, 15),
    limb([[32, 836, 3.4], [30, 856, 3.4]]), limb([[40, 836, 2.6], [40, 860, 2.6]]), limb([[48, 836, 2.6], [50, 858, 2.6]]), limb([[55, 836, 2.5], [59, 855, 2.5]]), limb([[62, 832, 2.4], [70, 850, 2.4]]),
    limb([[30, 859, 3], [30, 864, 3]]), limb([[30, 866, 2.6], [30, 871, 2.6]]), limb([[40, 863, 2], [40, 868, 2]]), limb([[50, 861, 2], [51, 866, 2]]), limb([[59, 858, 2], [61, 863, 2]]), limb([[71, 853, 1.8], [73, 857, 1.8]]),
  ];
  const mk = (sx) => {
    const t = sx < 0 ? ' transform="scale(-1 1)"' : '';
    const parts = [
      `<g id="${sx > 0 ? 'right' : 'left'}-pectoral-girdle"${t}>${unit([clav], { fill: ap.fill, line: ap.line, width: S.bone })}${post ? scapulaPost(scap, ap, shade('appendicular')) : unit([smooth([[60, 162], [90, 164], [98, 176], [92, 200], [80, 222]], true)], { fill: ap.fill, line: ap.line, width: S.bone })}</g>`,
    ];
    return { t, parts };
  };
  // scapula behind ribs in anterior view must be drawn before ribs; handled by ordering below.
  const limbs = (sx) => {
    const t = sx < 0 ? ' transform="scale(-1 1)"' : '';
    return `<g${t}>${unit(humerus, { fill: ap.fill, line: ap.line, width: S.bone })}${forearm}${handBones}${unit(femur, { fill: ap.fill, line: ap.line, width: S.bone })}${post ? '' : unit([patella], { fill: ap.fill, line: ap.line, width: S.bone })}${unit([tibia], { fill: ap.fill, line: ap.line, width: S.bone })}${unit([fibula], { fill: ap.fill, line: ap.line, width: S.bone })}${unit(footB, { fill: ap.fill, line: ap.line, width: S.fine * 1.5 })}</g>`;
  };
  const girdle = (sx) => mk(sx).parts[0];
  return {
    // z-order: scapula glimpse + hip bones + girdle sit behind the ribs/sternum/column where anatomy overlaps
    behind: `<g id="appendicular-skeleton-girdles">${post ? '' : girdle(1) + girdle(-1)}${out.appendicular.join('')}</g>`,
    axial: `<g id="axial-skeleton">${out.axial.join('')}</g>`,
    front: `<g id="appendicular-skeleton-limbs">${post ? girdle(1) + girdle(-1) : ''}${limbs(1)}${limbs(-1)}</g>`,
    postClavicle: '',
    clavicleFront: post ? '' : '',
    clavicles: !post ? `<g id="clavicles">${[1, -1].map((sx) => `<g${sx < 0 ? ' transform="scale(-1 1)"' : ''}>${unit([clav], { fill: ap.fill, line: ap.line, width: S.bone })}</g>`).join('')}</g>` : '',
  };
}

function scapulaPost(path, ap, shadeColor) {
  return unit([path], { fill: ap.fill, line: ap.line, width: S.bone })
    + unit([limb([[24, 188, 3], [60, 172, 3.2], [96, 158, 3.8]]), limb([[92, 160, 4], [110, 152, 3.6]])], { fill: shadeColor, line: ap.line, width: S.fine * 1.5 });
}

export function skeletonFigure(view, mode = 'plain') {
  const k = skeleton(view, mode);
  // order: hip bones/scapulae, axial (ribs/column/sternum/skull), then limbs and clavicles on top
  return k.behind + k.axial + k.front + k.clavicles;
}

/* ---------- Organs on the anterior surface (local units) ---------- */
export function organFigure() {
  const o = (d, fill, id, dash = false) => `<path id="${id}" d="${d}" fill="${fill}" stroke="${C.ink}" stroke-width="${S.detail}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${S.dash}"` : ''}/>`;
  const out = [];
  out.push(o(smooth([[-42, 44], [-34, 18], [0, 10], [34, 18], [42, 44], [30, 64], [0, 70], [-30, 64]], true), C.brain, 'brain'));
  out.push(stroked(line([[0, 12], [0, 66]]), C.ink, S.fine), stroked(smooth([[-30, 62], [-12, 56], [0, 66]]), C.ink, S.fine));
  // viscera, back to front
  out.push(o(smooth([[-52, 372], [-44, 394], [-48, 424], [-24, 446], [24, 446], [48, 424], [44, 394], [52, 372], [0, 380]], true), C.intestine, 'small-intestine'));
  out.push(stroked(smooth([[-40, 396], [-14, 404], [10, 396], [36, 404]]), C.intestineDark, 1.2), stroked(smooth([[-42, 414], [-16, 424], [14, 414], [40, 422]]), C.intestineDark, 1.2), stroked(smooth([[-30, 432], [0, 438], [30, 432]]), C.intestineDark, 1.2));
  out.push(o(smooth([[-34, 330], [-24, 326], [-14, 340], [-18, 372], [-30, 384], [-46, 372], [-46, 346]], true), C.kidney, 'kidney-right', true));
  out.push(o(smooth([[34, 322], [44, 318], [52, 336], [48, 366], [38, 376], [26, 364], [24, 340]], true), C.kidney, 'kidney-left', true));
  out.push(o(smooth([[64, 296], [74, 300], [78, 324], [72, 342], [62, 340], [60, 314]], true), C.spleen, 'spleen'));
  out.push(o(smooth([[-14, 384], [-6, 360], [16, 358], [44, 362], [60, 366], [58, 378], [30, 380], [8, 384], [-6, 394]], true), C.pancreas, 'pancreas'));
  out.push(`<path id="large-intestine" d="${smooth([[-60, 436], [-64, 384], [-40, 364], [-12, 382], [14, 392], [40, 376], [62, 372], [64, 400], [60, 424], [46, 440], [26, 434]])}" fill="none" stroke="${C.ink}" stroke-width="13.5" stroke-linecap="round" stroke-linejoin="round"/><path d="${smooth([[-60, 436], [-64, 384], [-40, 364], [-12, 382], [14, 392], [40, 376], [62, 372], [64, 400], [60, 424], [46, 440], [26, 434]])}" fill="none" stroke="${C.intestineDark}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>`);
  out.push(o(smooth([[-76, 296], [-50, 290], [-12, 294], [26, 304], [20, 326], [-24, 350], [-60, 346], [-80, 322]], true), C.liver, 'liver'));
  out.push(o(smooth([[32, 302], [54, 300], [66, 322], [62, 348], [44, 364], [24, 356], [22, 338], [30, 322]], true), C.stomach, 'stomach'));
  out.push(stroked(line([[0, 120], [0, 184]]), C.ink, 7), stroked(line([[0, 120], [0, 184]]), C.paper, 4.6), stroked(smooth([[0, 184], [-14, 196], [-26, 206]]), C.ink, 6), stroked(smooth([[0, 184], [-14, 196], [-26, 206]]), C.paper, 3.6), stroked(smooth([[0, 184], [14, 196], [26, 206]]), C.ink, 6), stroked(smooth([[0, 184], [14, 196], [26, 206]]), C.paper, 3.6));
  out.push(o(smooth([[-8, 170], [-32, 160], [-62, 176], [-76, 214], [-76, 262], [-62, 284], [-18, 284], [-8, 250]], true), C.lung, 'lung-right'));
  out.push(o(smooth([[8, 170], [30, 160], [60, 176], [72, 214], [72, 262], [58, 284], [26, 284], [12, 264], [22, 236], [10, 206]], true), C.lung, 'lung-left'));
  out.push(stroked(smooth([[-52, 230], [-40, 252], [-34, 276]]), C.ink, S.fine), stroked(smooth([[-62, 204], [-40, 206], [-24, 214]]), C.ink, S.fine));
  out.push(o(smooth([[-10, 214], [8, 200], [32, 208], [40, 236], [36, 262], [20, 258], [2, 238]], true), C.heart, 'heart'));
  out.push(stroked(smooth([[-6, 286], [10, 276], [36, 284], [72, 292]]), C.muscle, 5), stroked(smooth([[-6, 286], [-40, 284], [-80, 292]]), C.muscle, 5));
  out.push(o(smooth([[-16, 440], [-12, 428], [12, 428], [16, 440], [10, 450], [-10, 450]], true), C.bladder, 'urinary-bladder'));
  return `<g id="organs">${out.join('')}</g>`;
}
