// BVIS04 skin plates: overview, thick vs thin epidermis, dermis/hypodermis, hair follicle, sweat and oil glands.
import { C, sm, poly, E, RR, tube } from './bvis04-lib.mjs';

const MOD = 'integumentary-system';
export const plates = [];
const EPI = { fill: '#E9C6B4', line: '#A07A68' }, DER = { fill: '#F1DFD2', line: '#C3A593' }, HYP = { fill: '#F2E6B4', line: '#B8A560' };
const GOLD = { fill: '#E3C46E', line: C.nerveLn }, HAIR = { fill: '#7A5A4A', line: '#4A3228' };
const wave = (x, y0, a, p) => y0 + a * Math.sin(x / p);
const waveTop = (x0, x1, y0, a, p) => { const o = []; for (let x = x0; x <= x1; x += 12) o.push([x, wave(x, y0, a, p)]); return o; };
function coil(S, id, cx, cy, rx, ry, w, st, turns = 5) { const pts = []; for (let i = 0; i <= turns * 12; i++) { const t = (i / 12) * Math.PI; pts.push([cx + rx * Math.cos(t * 1.0) * (0.6 + 0.4 * Math.sin(t * 0.37 + 1)), cy + ry * Math.sin(t * 1.7)]); } S.tb(id, pts, w, w, st); }
const L = (id, pts, w, st) => S.tb(id, pts, w, w, st);
let S;

// ---------------------------------------------------------------- 1 overview
function overview(Sc) {
  S = Sc; S.panel(30, 30, 1390, 940, 'section');
  const top = waveTop(60, 1390, 215, 13, 38);
  S.sh(null, RR(60, 620, 1330, 300, 8), { ...HYP, sw: 1.4 });
  [[200, 730], [420, 770], [650, 740], [860, 790], [1060, 745], [1270, 790], [330, 850], [760, 860], [1130, 860]].forEach(([x, y]) => S.sh(null, E(x, y, 92, 52), { fill: '#F8F0CC', line: HYP.line, sw: 1.2 }));
  S.sh('hypodermis', RR(60, 880, 1330, 36, 8), { ...HYP, sw: 1.4 });
  S.sh('dermis', poly([...top, [1390, 640], [60, 640]]), { ...DER, sw: 1.4 });
  S.sh('epidermis', poly([[60, 130], [1390, 130], ...waveTop(60, 1390, 215, 13, 38).reverse()]), { ...EPI, sw: 1.6 });
  S.sh(null, RR(60, 130, 1330, 22, 4), { fill: '#EFD9CB', line: EPI.line, sw: 1 });
  for (let x = 90; x < 1390; x += 70) S.ln(null, `M${x} 175h46M${x + 30} 195h40`, { color: '#C99C8A', w: 1.4, op: 0.7 });
  for (let k = 0; k < 7; k++) S.ln(null, sm([[80, 340 + k * 38], [400, 330 + k * 38 + (k % 2) * 14], [800, 350 + k * 38], [1370, 336 + k * 38]], false, 6), { color: '#DEC6B6', w: 3.2, op: 0.9 });
  // hair follicle + shaft
  L('hair-follicle', [[560, 150], [562, 400], [560, 620], [560, 660]], 46, { fill: '#E3C9D0', line: '#8A6068' });
  S.sh('bulb', E(560, 668, 36, 30), { fill: '#E0B8A8', line: '#8A6068', sw: 1.4 });
  S.sh(null, E(560, 690, 14, 14), { fill: '#C98C6E', line: '#8A5A48', sw: 1 });
  L('hair-shaft', [[560, 62], [560, 150], [560, 400], [560, 640]], 13, HAIR);
  // sebaceous gland and duct
  [[640, 330, 30, 22], [676, 358, 28, 22], [640, 388, 30, 22], [610, 360, 24, 20]].forEach(([x, y, a, b]) => S.sh('sebaceous-gland', E(x, y, a, b), { fill: '#F0E0A0', line: '#9A8A4A', sw: 1.6 }));
  L(null, [[612, 340], [580, 330]], 14, { fill: '#F0E0A0', line: '#9A8A4A' });
  // arrector pili
  L('arrector-pili', [[548, 430], [520, 360], [470, 290], [430, 240]], 18, { fill: '#C98C8E', line: '#7E4A49' });
  // hair root plexus
  L('hair-root-plexus', [[640, 520], [606, 540], [585, 570], [582, 600]], 8, GOLD);
  L('hair-root-plexus', [[640, 520], [608, 500], [588, 470]], 6, GOLD);
  L('hair-root-plexus', [[640, 520], [700, 480], [760, 380], [790, 300]], 6, GOLD);
  // eccrine gland and duct
  coil(S, 'eccrine', 900, 690, 70, 40, 14, { fill: '#C9A8B8', line: '#7E5A6E' }, 5);
  L('eccrine', [[900, 150], [880, 300], [905, 420], [890, 560], [900, 650]], 12, { fill: '#C9A8B8', line: '#7E5A6E' });
  S.sh('pore', E(900, 134, 10, 7), { fill: '#7E5A6E', line: '#4A3228', sw: 1.2 });
  // second follicle and apocrine
  L(null, [[1160, 150], [1162, 420], [1160, 560]], 40, { fill: '#E3C9D0', line: '#8A6068' });
  L(null, [[1160, 80], [1160, 150], [1160, 520]], 11, HAIR);
  coil(S, 'apocrine', 1260, 720, 86, 52, 22, { fill: '#B9C4D8', line: '#4F6C86' }, 4);
  L('apocrine', [[1230, 680], [1210, 600], [1170, 540]], 14, { fill: '#B9C4D8', line: '#4F6C86' });
  // receptors
  S.sh('tactile', E(402, 243, 16, 24), { fill: '#CDB8DA', line: '#6F6381', sw: 1.6 });
  S.ln(null, 'M402 270Q420 320 430 400', { color: C.nerveLn, w: 3 });
  L('free-nerve', [[720, 450], [726, 330], [720, 210], [722, 168]], 3, GOLD);
  S.ln('free-nerve', 'M722 250l-26 -52M722 262l28 -60', { color: C.nerveLn, w: 2.4 });
  S.sh('lamellated', E(300, 770, 38, 58), { fill: '#CDB8DA', line: '#6F6381', sw: 1.8 });
  [46, 34, 22].forEach((r, i) => S.ln(null, E(300, 770, r * 0.8, r * 1.2).replace('Z', ''), { color: '#6F6381', w: 1.4, op: 0.7 + i * 0 }));
  S.sh(null, E(300, 770, 8, 20), { fill: '#E3C46E', line: C.nerveLn, sw: 1 });
  L(null, [[300, 828], [330, 700], [420, 560], [430, 280]], 4, GOLD);
  L('vessels', [[100, 470], [300, 456], [520, 470]], 12, { fill: C.red, line: C.redLn });
  L('vessels', [[100, 500], [300, 492], [520, 500]], 12, { fill: C.blue, line: C.blueLn });
  [[250, 238], [330, 236], [470, 236]].forEach(([x, y]) => S.sh('vessels', E(x, y, 5, 12), { fill: C.red, line: C.redLn, sw: 1.2 }));
  S.pin('epidermis-skin', 'epidermis', [300, 175]);
  S.pin('dermis-skin', 'dermis', [200, 400]);
  S.pin('hypodermis-skin', 'hypodermis', [900, 898]);
  S.pin('hair-follicle-skin', 'hair-follicle', [560, 300]);
  S.pin('hair-shaft-skin', 'hair-shaft', [560, 100]);
  S.pin('sebaceous-gland-skin', 'sebaceous-gland', [660, 360]);
  S.pin('arrector-pili-skin', 'arrector-pili', [490, 320]);
  S.pin('hair-root-plexus-skin', 'hair-root-plexus', [585, 570]);
  S.pin('eccrine-sweat-gland', 'eccrine', [880, 690]);
  S.pin('sweat-pore-skin', 'pore', [900, 134]);
  S.pin('apocrine-sweat-gland', 'apocrine', [1320, 720]);
  S.pin('tactile-corpuscle-skin', 'tactile', [402, 243]);
  S.pin('free-nerve-ending-skin', 'free-nerve', [722, 190]);
  S.pin('lamellated-corpuscle-skin', 'lamellated', [300, 770]);
  S.pin('cutaneous-blood-vessels-skin', 'vessels', [300, 456]);
}
plates.push({
  key: 'skin-overview', replaces: 'asset-openstax-historical-skin-structure', moduleId: MOD, kind: 'gross-diagram', lessons: ['skin-layers-strata', 'dermis-hypodermis', 'cutaneous-glands', 'hair-nails', 'skin-sensation-function'], purpose: 'Skin in section: three layers and the appendages and receptors found in each.',
  title: ['Skin in section: layers, appendages and receptors', 'Piel en corte: capas, anexos y receptores'],
  desc: ['Block of thin, hairy skin cut vertically. Epidermis on top (the thin outer keratinized layer), dermis below it with papillae pushing up into the epidermis, then the hypodermis (fat) at the bottom. A hair follicle holds the hair shaft; a sebaceous gland opens into it and the arrector pili muscle runs from its side up to the papillary dermis; nerve fibres wrap the follicle as the hair root plexus. An eccrine sweat gland coils deep in the dermis and its duct reaches the surface at a pore; an apocrine gland, larger and deeper, opens into a follicle. Receptors: free nerve endings in the epidermis, a tactile corpuscle in a dermal papilla and a lamellated corpuscle in the deep layers. Simplified original drawing; one hair follicle is unlabelled.',
    'Bloque de piel fina con vello cortado verticalmente. Epidermis arriba (la capa externa queratinizada, delgada), debajo la dermis con papilas que empujan hacia la epidermis y, al fondo, la hipodermis (grasa). Un folículo piloso contiene el tallo del pelo; una glándula sebácea desemboca en él y el músculo erector del pelo va desde su lado hasta la dermis papilar; fibras nerviosas rodean el folículo como plexo de la raíz del pelo. Una glándula sudorípara ecrina se enrolla en la dermis profunda y su conducto llega a la superficie en un poro; una glándula apocrina, mayor y más profunda, desemboca en un folículo. Receptores: terminaciones nerviosas libres en la epidermis, un corpúsculo táctil en una papila dérmica y un corpúsculo laminar en las capas profundas. Dibujo original simplificado; un folículo piloso queda sin marcador.'],
  orientation: ['vertical section of thin hairy skin; surface at top', 'corte vertical de piel fina con vello; superficie arriba'], draw: overview,
});

// ---------------------------------------------------------------- 2 strata, thick vs thin
function strata(x0, x1, hC, hL, hG, hS, hB, cells, yb, wob) {
  const w = x1 - x0, yB0 = yb - hB, yS0 = yB0 - hS, yG0 = yS0 - hG, yL0 = yG0 - hL, yC0 = yL0 - hC;
  S.sh('stratum-corneum', RR(x0, yC0, w, hC, 6), { fill: '#EFD9CB', line: EPI.line, sw: 1.4 });
  for (let y = yC0 + 10; y < yL0 - 4; y += 12) S.ln(null, `M${x0 + 8} ${y}H${x1 - 8}`, { color: '#C99C8A', w: 1.4, op: 0.6 });
  if (hL) S.sh('stratum-lucidum', RR(x0, yL0, w, hL, 4), { fill: '#F5ECE4', line: '#C3A593', sw: 1.2 });
  S.sh('stratum-granulosum', RR(x0, yG0, w, hG, 4), { fill: '#DDB8B8', line: EPI.line, sw: 1.2 });
  S.sh('stratum-spinosum', RR(x0, yS0, w, hS, 4), { fill: '#E6BFAE', line: EPI.line, sw: 1.2 });
  S.sh('stratum-basale', RR(x0, yB0, w, hB + 10, 4), { fill: '#D9AA98', line: EPI.line, sw: 1.2 });
  const cw = cells;
  for (let x = x0 + 14; x + cw < x1 - 10; x += cw + 4) S.sh('stratum-granulosum', E(x + cw / 2, yG0 + hG / 2, cw / 2, Math.min(11, hG / 2 - 3)), { fill: '#CFA2A6', line: '#8A6068', sw: 1.2 });
  const rows = Math.max(2, Math.floor(hS / 44)); let kcDone = false;
  for (let r = 0; r < rows; r++) for (let x = x0 + 18 + (r % 2) * cw / 2; x + cw < x1 - 10; x += cw + 4) { const cy = yS0 + 26 + r * ((hS - 44) / Math.max(1, rows - 1));
    const id = (!kcDone && r === 1 && x > x0 + w * 0.55) ? (kcDone = true, 'keratinocyte') : 'stratum-spinosum';
    S.sh(id, E(x + cw / 2, cy, cw / 2, 20), { fill: id === 'keratinocyte' ? '#E3A99A' : '#D9A99A', line: '#8A6068', sw: 1.2 }); S.sh(null, E(x + cw / 2, cy, 7, 7), { fill: '#A99ABD', line: '#6F6381', sw: 1 }); }
  const base = []; for (let x = x0 + 8; x <= x1 - 8; x += 6) base.push([x, yb + 12 + wob * Math.sin((x - x0) / 36)]);
  S.sh(null, poly([[x0, yb + 70], ...base, [x1, yb + 70]]), { ...DER, sw: 1.4 });
  for (let x = x0 + 8, i = 0; x + cw < x1 - 8; x += cw + 4, i++) S.sh('stratum-basale', RR(x, yB0 + 4, cw, hB + 10 + wob * Math.sin((x + cw / 2 - x0) / 36) * 0.5 - 4, 6), { fill: '#C9917E', line: '#8A5A4C', sw: 1.2 });
  return { yC0, yL0, yG0, yS0, yB0, yb };
}
function thickThin(Sc) {
  S = Sc; S.panel(30, 30, 860, 940, 'thick-skin'); S.panel(910, 30, 510, 940, 'thin-skin');
  const g = strata(70, 850, 270, 46, 66, 190, 70, 32, 800, 12);
  S.sh(null, E(220, g.yb + 10, 40, 55), { fill: '#F6E6D8', line: DER.line, sw: 1 });
  S.sh('dermal-papilla', sm([[560, g.yb + 80], [570, g.yb + 38], [610, g.yb + 20], [650, g.yb + 38], [660, g.yb + 80]], true, 4), { fill: '#EAD4C4', line: DER.line, sw: 1.4 });
  S.sh('tactile', E(610, g.yb + 56, 20, 22), { fill: '#CDB8DA', line: '#6F6381', sw: 1.6 });
  // melanocyte with processes
  const mx = 300, my = g.yB0 + 38;
  S.sh('melanocyte', sm([[mx - 14, my - 12], [mx, my - 22], [mx + 14, my - 10], [mx + 12, my + 12], [mx - 12, my + 14]], true, 4), { fill: '#8A6A5A', line: '#4A3228', sw: 1.6 });
  [[-1, -1], [1, -1], [-1, 0.2], [1, 0.2]].forEach(([sx, sy]) => S.tb('melanocyte', [[mx + sx * 10, my + sy * 6], [mx + sx * 36, my + sy * 38 - 16], [mx + sx * 58, my + sy * 80 - 28]], 8, 4, { fill: '#8A6A5A', line: '#4A3228' }));
  [[270, g.yS0 + 150], [320, g.yS0 + 160], [350, g.yS0 + 118], [250, g.yS0 + 120]].forEach(([x, y]) => S.sh(null, E(x, y, 5, 4), { fill: '#6A4A3A', line: '#6A4A3A', sw: 0.5 }));
  // merkel cell + nerve disc
  const kx = 470, ky = g.yB0 + 36;
  S.sh('merkel', E(kx, ky, 17, 21), { fill: '#C2A9D2', line: '#6F6381', sw: 1.6 });
  S.sh('merkel', RR(kx - 15, ky + 22, 30, 7, 3), { fill: '#E3C46E', line: C.nerveLn, sw: 1.2 });
  S.ln(null, `M${kx} ${ky + 30}Q${kx + 10} ${ky + 80} ${kx + 40} ${ky + 120}`, { color: C.nerveLn, w: 3 });
  // langerhans
  const lx = 640, ly = g.yS0 + 70;
  S.sh('langerhans', poly([[lx, ly - 22], [lx + 8, ly - 6], [lx + 28, ly - 12], [lx + 14, ly + 2], [lx + 24, ly + 22], [lx + 4, ly + 12], [lx - 10, ly + 28], [lx - 10, ly + 8], [lx - 30, ly + 4], [lx - 12, ly - 6]]), { fill: '#A9BCA0', line: '#5F7A4F', sw: 1.6 });
  S.at('thick-skin');
  S.pin('stratum-corneum', 'stratum-corneum', [200, g.yC0 + 80]);
  S.pin('stratum-lucidum', 'stratum-lucidum', [200, g.yL0 + 23]);
  S.pin('stratum-granulosum', 'stratum-granulosum', [300, g.yG0 + 33]);
  S.pin('stratum-spinosum', 'stratum-spinosum', [180, g.yS0 + 70]);
  S.pin('stratum-basale', 'stratum-basale', [120, g.yB0 + 30]);
  S.pin('keratinocyte-skin', 'keratinocyte', [620, g.yS0 + 150]);
  S.pin('melanocyte-skin', 'melanocyte', [mx, my]);
  S.pin('merkel-cell-skin', 'merkel', [kx, ky - 4]);
  S.pin('langerhans-cell-skin', 'langerhans', [lx, ly]);
  S.pin('tactile-corpuscle-skin', 'tactile', [610, g.yb + 56]);
  S.pin('dermal-papilla-skin', 'dermal-papilla', [565, g.yb + 70]);
  S.at('thin-skin');
  const t = strata(940, 1390, 50, 0, 30, 90, 46, 24, 780, 10);
  S.pin('stratum-corneum', 'stratum-corneum', [1100, t.yC0 + 25]);
  S.pin('stratum-granulosum', 'stratum-granulosum', [1100, t.yG0 + 15]);
  S.pin('stratum-spinosum', 'stratum-spinosum', [1030, t.yS0 + 45]);
  S.pin('stratum-basale', 'stratum-basale', [980, t.yB0 + 25]);
}
plates.push({
  key: 'epidermis-strata', moduleId: MOD, kind: 'tissue-schematic', lessons: ['skin-layers-strata', 'epidermal-cells'], purpose: 'Epidermal strata in thick skin with the four cell types, compared with thin skin that lacks a lucidum.',
  title: ['Epidermis: strata and cell types (schematic)', 'Epidermis: estratos y tipos celulares (esquema)'],
  desc: ['Left: schematic thick skin (palm or sole). From deep to superficial: stratum basale (one row of dividing cells on the dermis), stratum spinosum (polygonal keratinocytes joined by spiny bridges), stratum granulosum (flattened cells with dark granules), the clear stratum lucidum (present only in thick skin) and the very thick stratum corneum of dead, keratin-filled cells. Cell types: melanocyte in the basale with pigment passed to keratinocytes, Merkel cell with its nerve disc, Langerhans cell in the spinosum; a tactile corpuscle sits in the dermal papilla below. Right: thin skin has the same strata but a much thinner corneum and no lucidum. Original schematic, not a photomicrograph; cells are enlarged and spaced out.',
    'Izquierda: piel gruesa esquemática (palma o planta). De profundo a superficial: estrato basal (una hilera de células en división sobre la dermis), estrato espinoso (queratinocitos poligonales unidos por puentes espinosos), estrato granuloso (células aplanadas con gránulos oscuros), el claro estrato lúcido (solo en piel gruesa) y el grueso estrato córneo de células muertas llenas de queratina. Tipos celulares: melanocito en el basal, que cede pigmento a los queratinocitos, célula de Merkel con su disco nervioso y célula de Langerhans en el espinoso; abajo, un corpúsculo táctil en la papila dérmica. Derecha: la piel fina tiene los mismos estratos, pero con córneo mucho más delgado y sin lúcido. Esquema original, no una fotomicrografía; las células están ampliadas y separadas.'],
  orientation: ['vertical sections; surface at top', 'cortes verticales; superficie arriba'], draw: thickThin,
});

// ---------------------------------------------------------------- 3 dermis + hypodermis
function dermisHyp(Sc) {
  S = Sc; S.panel(30, 30, 1390, 940, 'dermis');
  const top = waveTop(60, 1390, 215, 16, 34);
  S.sh('hypodermis', RR(60, 640, 1330, 290, 8), { ...HYP, sw: 1.4 });
  [[200, 750], [420, 790], [650, 760], [880, 800], [1100, 760], [1290, 800]].forEach(([x, y]) => S.sh('hypodermis', E(x, y, 90, 60), { fill: '#F8F0CC', line: HYP.line, sw: 1.2 }));
  S.sh('papillary', poly([...top, ...[...waveTop(60, 1390, 345, 6, 60)].reverse()]), { fill: '#F4E6DA', line: DER.line, sw: 1.4 });
  S.sh('reticular', poly([...waveTop(60, 1390, 345, 6, 60), [1390, 640], [60, 640]]), { fill: '#EBD3C4', line: DER.line, sw: 1.4 });
  S.sh(null, poly([[60, 130], [1390, 130], ...[...top].reverse()]), { ...EPI, sw: 1.4 });
  // collagen bundles
  [[390, 0], [440, 14], [490, -10], [545, 12], [590, 0]].forEach(([y, d], i) => S.tb('collagen', [[90, y + d], [400, y - d], [800, y + d * 1.5], [1360, y - d]], 22, 22, { fill: '#F9F1E8', line: '#BFA18F', sw: 1.2 }));
  [[255, 0], [290, 8]].forEach(([y, d]) => S.tb('collagen', [[90, y + d], [500, y - d], [900, y + d], [1360, y]], 9, 9, { fill: '#F9F1E8', line: '#BFA18F', sw: 1 }));
  for (let k = 0; k < 6; k++) S.ln('elastic', sm([[100 + k * 20, 600 - k * 40], [350, 588 - k * 40], [700, 610 - k * 40], [1100, 590 - k * 40], [1350, 600 - k * 40]], false, 5), { color: '#6F4F66', w: 2.2, op: 1 });
  // papillary capillary loops and vessels
  [[240, 232], [560, 230], [900, 232], [1210, 230]].forEach(([x, y]) => { S.tb('vessels', [[x - 10, y + 70], [x - 10, y], [x + 10, y], [x + 10, y + 70]], 9, 9, { fill: C.red, line: C.redLn }); });
  S.tb('vessels', [[100, 620], [450, 630], [800, 610], [1350, 620]], 18, 18, { fill: C.red, line: C.redLn });
  S.tb('vessels', [[100, 665], [500, 672], [900, 662], [1350, 672]], 22, 22, { fill: C.blue, line: C.blueLn });
  S.out.push('');
  S.pin('papillary-layer-skin', 'papillary', [150, 290]);
  S.pin('reticular-layer-skin', 'reticular', [900, 520]);
  S.pin('dermis-skin', 'papillary+reticular', [760, 470]);
  S.pin('dermal-papilla-skin', 'papillary', [320, 225]);
  S.pin('collagen-skin', 'collagen', [600, 400]);
  S.pin('elastic-fibers-skin', 'elastic', [1000, 575]);
  S.pin('cutaneous-blood-vessels-skin', 'vessels', [250, 615]);
  S.pin('hypodermis-skin', 'hypodermis', [200, 820]);
}
plates.push({
  key: 'dermis-hypodermis', moduleId: MOD, kind: 'gross-diagram', lessons: ['dermis-hypodermis', 'skin-layers-strata'], purpose: 'Papillary versus reticular dermis, their fibres and vessels, and the fatty hypodermis.',
  title: ['Dermis and hypodermis: fibres and vessels', 'Dermis e hipodermis: fibras y vasos'],
  desc: ['Vertical block under a thin epidermis. The papillary layer, the upper dermis, is loose areolar tissue forming the dermal papillae, each with a capillary loop and fine fibres. The deeper reticular layer is dense irregular tissue with thick collagen bundles (pale, wide) and a mesh of thin dark elastic fibres, with larger vessels along its base. Beneath it the hypodermis is made of fat lobules. Dermis is a group marker spanning both layers. Simplified original drawing; fibre density is stylised.',
    'Bloque vertical bajo una epidermis delgada. La capa papilar, dermis superior, es tejido areolar laxo que forma las papilas dérmicas, cada una con un asa capilar y fibras finas. La capa reticular, más profunda, es tejido denso irregular con gruesos haces de colágeno (pálidos y anchos) y una malla de finas fibras elásticas oscuras, con vasos mayores en su base. Debajo, la hipodermis está formada por lóbulos de grasa. Dermis es un marcador de grupo que abarca ambas capas. Dibujo original simplificado; la densidad de fibras está estilizada.'],
  orientation: ['vertical section; surface at top', 'corte vertical; superficie arriba'], draw: dermisHyp,
});

// ---------------------------------------------------------------- 4 hair follicle
function hairFollicle(Sc) {
  S = Sc; S.panel(30, 30, 1390, 940, 'follicle');
  S.sh(null, RR(60, 190, 1330, 740, 8), { ...DER, sw: 1.4 });
  S.sh(null, RR(60, 110, 1330, 80, 6), { ...EPI, sw: 1.4 });
  for (let k = 0; k < 5; k++) S.ln(null, sm([[80, 780 + k * 28], [500, 770 + k * 28], [1370, 790 + k * 28]], false, 5), { color: '#DEC6B6', w: 3, op: 0.9 });
  S.tb('hair-follicle', [[725, 190], [727, 450], [725, 700], [725, 740]], 124, 130, { fill: '#EBCDD2', line: '#8A6068', sw: 1.8 });
  S.tb(null, [[725, 190], [725, 450], [725, 690]], 76, 78, { fill: '#F3E0D4', line: '#B98A7A', sw: 1.2 });
  S.sh('bulb', E(725, 745, 78, 64), { fill: '#E0B8A8', line: '#8A6068', sw: 1.8 });
  S.sh('papilla', E(725, 790, 34, 32), { fill: '#C98C6E', line: '#8A5A48', sw: 1.6 });
  S.tb('hair-root', [[725, 190], [725, 450], [725, 700]], 38, 52, { fill: '#8A6A5A', line: '#4A3228', sw: 1.4 });
  S.tb('hair-shaft', [[725, 40], [727, 120], [725, 190]], 36, 36, HAIR);
  [[860, 400, 36, 28], [915, 440, 34, 28], [860, 470, 34, 28], [830, 430, 26, 24]].forEach(([x, y, a, b]) => S.sh('sebaceous', E(x, y, a, b), { fill: '#F0E0A0', line: '#9A8A4A', sw: 1.8 }));
  S.tb('sebduct', [[830, 405], [790, 360], [765, 330]], 22, 18, { fill: '#F5EBBE', line: '#9A8A4A' });
  S.tb('arrector', [[700, 520], [640, 440], [560, 330], [500, 230]], 26, 26, { fill: '#C98C8E', line: '#7E4A49' });
  S.pin('hair-shaft-skin', 'hair-shaft', [725, 100]);
  S.pin('hair-root-skin', 'hair-root', [725, 500]);
  S.pin('hair-follicle-skin', 'hair-follicle', [663, 330]);
  S.pin('hair-bulb-skin', 'bulb', [690, 755]);
  S.pin('dermal-papilla-hair', 'papilla', [725, 792]);
  S.pin('sebaceous-gland-skin', 'sebaceous', [880, 440]);
  S.pin('sebaceous-duct-skin', 'sebduct', [795, 365]);
  S.pin('arrector-pili-skin', 'arrector', [590, 365]);
}
plates.push({
  key: 'hair-follicle', moduleId: MOD, kind: 'gross-diagram', lessons: ['hair-nails'], purpose: 'Hair follicle in longitudinal section with root, bulb, papilla, sebaceous gland and arrector pili.',
  title: ['Hair follicle in longitudinal section', 'Folículo piloso en corte longitudinal'],
  desc: ['One hair follicle cut lengthways and enlarged. The part of the hair above the skin is the shaft; the part inside the follicle is the root, which ends in the expanded bulb. A dermal papilla pushes into the base of the bulb and feeds the dividing matrix cells around it. A sebaceous gland empties through a short duct into the upper follicle, and the arrector pili muscle runs from the follicle wall up to the superficial dermis, standing the hair when it contracts. Simplified original drawing; the sheath layers are not separated.',
    'Un folículo piloso cortado a lo largo y ampliado. La parte del pelo que sobresale de la piel es el tallo; la parte dentro del folículo es la raíz, que termina en el bulbo ensanchado. Una papila dérmica penetra en la base del bulbo y nutre las células de la matriz en división que la rodean. Una glándula sebácea vierte su contenido por un conducto corto en la parte superior del folículo, y el músculo erector del pelo va de la pared del folículo a la dermis superficial y levanta el pelo al contraerse. Dibujo original simplificado; no se separan las capas de la vaina.'],
  orientation: ['longitudinal section of one hair follicle; skin surface at top', 'corte longitudinal de un folículo piloso; superficie cutánea arriba'], draw: hairFollicle,
});

// ---------------------------------------------------------------- 5 glands
function glands(Sc) {
  S = Sc; S.panel(30, 30, 690, 940, 'eccrine'); S.panel(740, 30, 680, 940, 'apocrine');
  S.sh(null, RR(60, 110, 630, 70, 6), { ...EPI, sw: 1.4 });
  S.sh(null, RR(60, 180, 630, 600, 6), { ...DER, sw: 1.4 });
  S.sh(null, RR(60, 780, 630, 160, 6), { ...HYP, sw: 1.4 });
  S.tb('eccrine', [[375, 130], [345, 250], [385, 380], [350, 520], [370, 640]], 16, 16, { fill: '#C9A8B8', line: '#7E5A6E', sw: 1.6 });
  S.sh('pore', E(375, 114, 12, 8), { fill: '#7E5A6E', line: '#4A3228', sw: 1.4 });
  coil(S, 'eccrine', 365, 720, 120, 62, 34, { fill: '#C9A8B8', line: '#7E5A6E' }, 6);
  [[300, 700], [400, 745], [440, 690]].forEach(([x, y]) => S.sh(null, E(x, y, 6, 5), { fill: '#A99ABD', line: '#6F6381', sw: 1 }));
  S.at('eccrine');
  S.pin('sweat-pore-skin', 'pore', [375, 114]);
  S.pin('eccrine-sweat-gland', 'eccrine', [345, 250]);
  S.at('apocrine');
  S.sh(null, RR(770, 110, 620, 70, 6), { ...EPI, sw: 1.4 });
  S.sh(null, RR(770, 180, 620, 520, 6), { ...DER, sw: 1.4 });
  S.sh(null, RR(770, 700, 620, 240, 6), { ...HYP, sw: 1.4 });
  S.tb(null, [[1030, 190], [1030, 450], [1030, 560]], 62, 62, { fill: '#EBCDD2', line: '#8A6068', sw: 1.6 });
  S.tb(null, [[1030, 60], [1030, 190], [1030, 540]], 16, 16, HAIR);
  [[1130, 380, 30, 24], [1176, 408, 28, 22], [1130, 436, 28, 22]].forEach(([x, y, a, b]) => S.sh('sebaceous', E(x, y, a, b), { fill: '#F0E0A0', line: '#9A8A4A', sw: 1.8 }));
  S.tb('sebduct', [[1110, 395], [1080, 390], [1055, 385]], 16, 14, { fill: '#F5EBBE', line: '#9A8A4A' });
  coil(S, 'apocrine', 1130, 800, 180, 80, 44, { fill: '#B9C4D8', line: '#4F6C86' }, 5);
  S.tb('apocrine', [[1000, 760], [1010, 680], [1030, 600], [1030, 540]], 18, 16, { fill: '#B9C4D8', line: '#4F6C86', sw: 1.6 });
  S.pin('apocrine-sweat-gland', 'apocrine', [1250, 790]);
  S.pin('sebaceous-gland-skin', 'sebaceous', [1130, 410]);
  S.pin('sebaceous-duct-skin', 'sebduct', [1082, 390]);
}
plates.push({
  key: 'sweat-glands', replaces: 'asset-gray946-sweat-gland', moduleId: MOD, kind: 'gross-diagram', lessons: ['cutaneous-glands'], purpose: 'Eccrine versus apocrine sweat gland, with the sebaceous gland and duct on a hair follicle.',
  title: ['Sweat and sebaceous glands', 'Glándulas sudoríparas y sebáceas'],
  desc: ['Left: eccrine sweat gland. A coiled secretory part deep in the dermis sends a straight duct up through the epidermis to a sweat pore on the surface; it is found over most of the body and cools by evaporation. Right: apocrine sweat gland, larger and deeper (hypodermis), whose duct empties into a hair follicle rather than onto the skin (armpit, groin); a sebaceous gland also opens by a short duct into the follicle, oiling the hair. Simplified original drawing; secretory cells are not shown.',
    'Izquierda: glándula sudorípara ecrina. Una porción secretora enrollada en la dermis profunda envía un conducto recto hacia arriba a través de la epidermis hasta un poro sudoríparo en la superficie; se encuentra en casi todo el cuerpo y enfría por evaporación. Derecha: glándula sudorípara apocrina, mayor y más profunda (hipodermis), cuyo conducto desemboca en un folículo piloso y no en la piel (axila, ingle); una glándula sebácea también se abre por un conducto corto en el folículo y engrasa el pelo. Dibujo original simplificado; no se muestran las células secretoras.'],
  orientation: ['vertical sections; skin surface at top', 'cortes verticales; superficie cutánea arriba'], draw: glands,
});
void tube;
