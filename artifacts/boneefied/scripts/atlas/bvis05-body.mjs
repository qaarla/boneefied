// Shared anterior body outline and whole-body vessel tables (body units: centre line x=0, y 0 head top .. 880 feet).
// Patient right is NEGATIVE x (viewer left). Left-side copies mirror the right-side points unless `l` is given.
import { sm, E, tube, SK, A, V, mirX, vs } from './bvis05-lib.mjs';

export function skin(S, o = {}) {
  const half = [[0, 122], [45, 126], [100, 138], [114, 185], [100, 280], [82, 360], [84, 430], [76, 474]];
  const torso = sm([...half, [0, 484], ...mirX(half, 0).reverse().slice(0, -1)], true, 6);
  const ds = [E(0, 50, 40, 50), tube([[0, 90], [0, 140]], 36), torso];
  for (const s of [-1, 1]) {
    ds.push(tube([[s * 100, 145], [s * 150, 300], [s * 185, 450]], 46, 30), E(s * 190, 482, 17, 32, s * -10));
    if (o.legs !== false) ds.push(tube([[s * 38, 440], [s * 48, 640], [s * 50, 836]], 84, 46), E(s * 58, 860, 26, 14));
  }
  S.union(null, ds, { fill: SK.fill, line: SK.line, sw: 1.6 });
}
export const heartGhost = (S) => S.sh(null, sm([[-14, 204], [28, 196], [46, 226], [36, 268], [14, 292], [-8, 262]], true, 5), { fill: '#E2CFC8', line: '#C3AFA6', sw: 1.2 });

// id, right pts, width [w0,w1], group, optional left pts (null = same mirrored), one = right only
const D = (id, r, w, g, l, one) => ({ id, r, w, g, l, one });
export const ART = [
  D('ves-aorta', [[8, 232], [6, 185], [14, 155], [30, 160], [34, 200], [26, 300], [14, 420], [0, 452]], [26, 20], 'trunk', null, true),
  D(null, [[12, 153], [-8, 143], [-22, 133]], [12, 11], 'trunk', null, true),
  D('ves-subclavian', [[-22, 133], [-55, 134], [-88, 142]], [11, 10], 'arm', [[30, 158], [58, 140], [88, 142]]),
  D('ves-axillary', [[-88, 142], [-112, 168], [-128, 205]], [10, 9], 'arm'),
  D('ves-brachial', [[-128, 205], [-142, 260], [-152, 318]], [9, 8], 'arm'),
  D('ves-radial', [[-152, 318], [-166, 370], [-185, 445]], [6, 4], 'arm'),
  D('ves-ulnar', [[-152, 318], [-148, 380], [-160, 445]], [6, 4], 'arm'),
  D('ves-common-carotid', [[-22, 133], [-17, 112], [-13, 98]], [9, 8], 'head', [[24, 155], [14, 120], [12, 98]]),
  D('ves-internal-carotid', [[-13, 98], [-19, 72], [-21, 46]], [6, 5], 'head', [[12, 98], [18, 72], [20, 46]]),
  D('ves-external-carotid', [[-13, 98], [-8, 70], [-5, 40]], [6, 4], 'head', [[12, 98], [8, 70], [5, 40]]),
  D(null, [[0, 452], [-16, 478], [-30, 510]], [13, 12], 'leg'),
  D('ves-femoral', [[-30, 510], [-36, 580], [-40, 660]], [12, 11], 'leg'),
  D('ves-popliteal', [[-40, 660], [-42, 700], [-42, 725]], [10, 9], 'leg'),
  D('ves-anterior-tibial', [[-42, 725], [-46, 780], [-50, 845]], [6, 4], 'leg'),
  D('ves-posterior-tibial', [[-42, 725], [-36, 780], [-40, 840]], [6, 4], 'leg'),
];
export const VEIN = [
  D('cv-ivc', [[-8, 238], [-8, 330], [-8, 430], [0, 452]], [20, 18], 'trunk', null, true),
  D('cv-svc', [[-8, 140], [-6, 190], [-6, 238]], [20, 20], 'trunk', null, true),
  D('ves-brachiocephalic-vein', [[-30, 128], [-18, 134], [-8, 140]], [13, 14], 'trunk', [[30, 128], [18, 136], [-8, 140]]),
  D('ves-subclavian-vein', [[-90, 142], [-60, 132], [-30, 128]], [10, 11], 'arm'),
  D('ves-axillary-vein', [[-128, 205], [-112, 168], [-90, 142]], [9, 10], 'arm'),
  D('ves-internal-jugular', [[-20, 50], [-24, 90], [-30, 128]], [8, 10], 'head'),
  D('ves-jugular', [[-34, 62], [-36, 100], [-44, 124], [-56, 132]], [5, 6], 'head'),
  D('ves-cephalic', [[-185, 445], [-182, 390], [-172, 335], [-165, 300], [-156, 250], [-140, 200], [-112, 168]], [4, 7], 'arm'),
  D(null, [[-162, 400], [-152, 330], [-142, 285], [-134, 240], [-128, 205]], [4, 7], 'arm'),
  D('ves-median-cubital', [[-174, 336], [-142, 288]], [5, 5], 'arm'),
  D(null, [[0, 452], [-18, 480], [-32, 510]], [13, 12], 'leg'),
  D('ves-vein', [[-32, 510], [-38, 580], [-40, 660], [-42, 700], [-42, 725]], [12, 10], 'leg'),
  D('ves-great-saphenous', [[-30, 848], [-30, 780], [-30, 720], [-26, 690], [-26, 640], [-30, 580], [-35, 540]], [4, 7], 'leg'),
];
export function drawVessels(S, defs, st, filter, sfx = '') {
  for (const d of defs) {
    if (filter && !filter(d)) continue;
    vs(S, d.id && d.id + sfx, d.r, d.w[0], d.w[1], st);
    if (!d.one) vs(S, d.id && d.id + sfx, d.l ?? mirX(d.r, 0), d.w[0], d.w[1], st);
  }
}
void A; void V;
