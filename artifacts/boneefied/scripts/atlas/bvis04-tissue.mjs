// BVIS04 tissue schematics: epithelia, connective tissues, cartilage, muscle, nervous tissue. All explicit schematics.
import { C, sm, poly, E, RR, tube, rng } from './bvis04-lib.mjs';

export const plates = [];
const MOD = 'cells-tissues';
const CELL = { fill: '#E8C7CC', line: '#9A6A74' }, NUC = { fill: '#A99ABD', line: '#6F6381' };
const PX = [30, 495, 960], PW = [450, 450, 460], names = ['a', 'b', 'c'];
let S;
const three = (n) => { PX.forEach((x, i) => S.panel(x, 30, PW[i], 940, n[i])); };
const nuc = (x, y, rx, ry = rx) => S.sh(null, E(x, y, rx, ry), { ...NUC, sw: 1.1 });
const BMY = 640;
function frame(i, bmId) {
  const x = PX[i] + 20, w = PW[i] - 40;
  S.sh(null, RR(x, 90, w, BMY - 90, 6), { fill: '#F6F2EA', line: '#DAD3C4', sw: 1 });
  S.sh(null, RR(x, BMY + 8, w, 270, 6), { fill: '#F3E3DA', line: '#D2B8A8', sw: 1.2 });
  S.sh(bmId, RR(x, BMY - 3, w, 11, 3), { fill: '#7E8FA3', line: '#4F6C86', sw: 1 });
  for (let k = 0; k < 6; k++) S.ln(null, sm([[x + 10, BMY + 60 + k * 38], [x + w / 2, BMY + 50 + k * 38 + (k % 2) * 12], [x + w - 10, BMY + 66 + k * 38]], false, 5), { color: '#D9C0B2', w: 3, op: 0.9 });
  nuc(x + 90, BMY + 120, 12, 6); nuc(x + w - 100, BMY + 220, 12, 6);
  return { x, w };
}
function row(id, x, w, cw, y0, h, rx, ry, o = {}) { const n = Math.floor(w / cw); for (let k = 0; k < n; k++) { const cx = x + (w - n * cw) / 2 + cw * (k + 0.5); S.sh(id, RR(cx - cw / 2 + 1.5, y0, cw - 3, h, o.r ?? 6), { ...CELL, sw: 1.4 }); nuc(cx, y0 + (o.ny ?? h / 2), rx, ry); } }

// ---------------------------------------------------------------- 1 simple epithelia
function simple(Sc) {
  S = Sc; three(['squamous', 'cuboidal', 'columnar']);
  let f = frame(0, null); const n0 = 5;
  for (let k = 0; k < n0; k++) { const cx = f.x + f.w * (k + 0.5) / n0; S.sh('simple-squamous-epithelium', E(cx, BMY - 16, f.w / n0 / 2 + 2, 11), { ...CELL, sw: 1.4 }); nuc(cx, BMY - 16, 14, 6); }
  f = frame(1, null); row('simple-cuboidal-epithelium', f.x + 20, f.w - 40, 56, BMY - 66, 62, 14, 14);
  f = frame(2, 'basement-membrane-tissue'); row('simple-columnar-epithelium', f.x + 10, f.w - 20, 44, BMY - 160, 156, 11, 20, { ny: 120, r: 8 });
  for (let k = 0; k < 8; k++) S.ln(null, `M${f.x + 20 + k * 52} ${BMY - 166}v-14`, { color: '#9A6A74', w: 2 });
  S.at('squamous'); S.pin('simple-squamous-epithelium', 'simple-squamous-epithelium', [240, BMY - 16]);
  S.at('cuboidal'); S.pin('simple-cuboidal-epithelium', 'simple-cuboidal-epithelium', [695, BMY - 50]);
  S.at('columnar'); S.pin('simple-columnar-epithelium', 'simple-columnar-epithelium', [1100, BMY - 100]);
  S.pin('basement-membrane-tissue', 'basement-membrane-tissue', [1190, BMY + 2]);
}
plates.push({ key: 'epithelia-simple', moduleId: MOD, kind: 'tissue-schematic', lessons: ['epithelial-patterns', 'histology-recognition'], purpose: 'Simple squamous, cuboidal and columnar epithelium with the basement membrane.',
  title: ['Simple epithelia: squamous, cuboidal, columnar (schematic)', 'Epitelios simples: plano, cúbico, cilíndrico (esquema)'],
  desc: ['Schematic, not a photomicrograph. Simple epithelia are one cell layer thick, resting on a thin basement membrane (blue band) above connective tissue. Left: flat squamous cells with flattened nuclei, thin for diffusion (air sacs, vessel lining). Middle: cuboidal cells as tall as wide with round central nuclei (kidney tubules, small ducts). Right: columnar cells taller than wide with oval basal nuclei and a brush of surface projections (gut lining). Cells and nuclei are idealised and evenly spaced.',
    'Esquema, no una fotomicrografía. Los epitelios simples tienen una sola capa de células y se apoyan sobre una delgada membrana basal (banda azul) por encima del tejido conectivo. Izquierda: células planas con núcleos aplanados, finas para la difusión (alvéolos, revestimiento vascular). Centro: células cúbicas, tan altas como anchas, con núcleo central redondo (túbulos renales, conductos pequeños). Derecha: células cilíndricas, más altas que anchas, con núcleo oval basal y un fleco de proyecciones superficiales (revestimiento intestinal). Células y núcleos idealizados y regularmente espaciados.'],
  orientation: ['schematic sections; apical surface at top, connective tissue below', 'cortes esquemáticos; superficie apical arriba, tejido conectivo abajo'], draw: simple });

// ---------------------------------------------------------------- 2 stratified keratinized/nonkeratinized + pseudostratified
function strat(Sc) {
  S = Sc; three(['pseudostratified', 'keratinized', 'nonkeratinized']);
  let f = frame(0, null); const r = rng(5);
  const n = 8, cw = f.w / n;
  for (let k = 0; k < n; k++) { const cx = f.x + cw * (k + 0.5), h = 150 + (k % 3) * 55, top = BMY - h;
    if (k === 3) { S.sh('goblet-cell-tissue', sm([[cx - 18, BMY - 2], [cx - 24, BMY - 70], [cx - 34, BMY - 150], [cx - 18, BMY - 200], [cx + 18, BMY - 200], [cx + 34, BMY - 150], [cx + 24, BMY - 70], [cx + 18, BMY - 2]], true, 4), { fill: '#BFD2DD', line: '#4F6C86', sw: 1.5 }); nuc(cx, BMY - 22, 9, 6); continue; }
    S.sh('pseudostratified-epithelium', sm([[cx - 12, BMY - 2], [cx - 18, BMY - h / 2], [cx - 11, top], [cx + 11, top], [cx + 18, BMY - h / 2], [cx + 12, BMY - 2]], true, 4), { ...CELL, sw: 1.4 });
    nuc(cx, BMY - 28 - ((k * 37) % 5) * 28 - r() * 4, 10, 15); if (h > 150) for (let c = -1; c <= 1; c++) S.ln(null, `M${cx + c * 6} ${top}l${c * 2} -24`, { color: '#9A6A74', w: 1.8 }); }
  f = frame(1, null);
  S.sh('stratified-squamous-keratinized', RR(f.x, 338, f.w, 62, 4), { fill: '#EFD3C6', line: '#B98A7A', sw: 1.2 });
  for (let y = 348; y < 394; y += 11) S.ln(null, `M${f.x + 8} ${y}H${f.x + f.w - 8}`, { color: '#C99C8A', w: 1.4, op: 0.7 });
  [[404, 16, 8, 40], [424, 20, 9, 38], [446, 34, 14, 38], [484, 38, 16, 40], [526, 42, 18, 44]].forEach(([y, h, rx, cw], j) => { for (let x = f.x + 14 + (j % 2) * 18; x + cw < f.x + f.w - 8; x += cw + 4) { S.sh('stratified-squamous-keratinized', E(x + cw / 2, y + h / 2, cw / 2, h / 2), { ...CELL, sw: 1.2 }); nuc(x + cw / 2, y + h / 2, Math.min(8, rx * 0.5), Math.min(8, h * 0.3)); } });
  row('stratified-squamous-keratinized', f.x + 6, f.w - 12, 30, BMY - 54, 52, 8, 10);
  f = frame(2, null);
  [[396, 16, 40, 8, 6], [416, 22, 36, 9, 8], [442, 34, 40, 12, 14], [482, 38, 44, 14, 16], [524, 42, 46, 15, 16]].forEach(([y, h, cw, nx, ny], j) => { for (let x = f.x + 10 + (j % 2) * 18; x + cw < f.x + f.w - 8; x += cw + 4) { S.sh('stratified-squamous-nonkeratinized', E(x + cw / 2, y + h / 2, cw / 2, h / 2), { ...CELL, sw: 1.2 }); nuc(x + cw / 2, y + h / 2, nx, Math.min(ny, h * 0.3)); } });
  row('stratified-squamous-nonkeratinized', f.x + 6, f.w - 12, 30, BMY - 54, 52, 8, 10);
  S.at('pseudostratified'); S.pin('pseudostratified-epithelium', 'pseudostratified-epithelium', [110, BMY - 90]); S.pin('goblet-cell-tissue', 'goblet-cell-tissue', [PX[0] + 20 + (450 - 40) / 8 * 3.5, BMY - 120]);
  S.at('keratinized'); S.pin('stratified-squamous-keratinized', 'stratified-squamous-keratinized', [700, 370]);
  S.at('nonkeratinized'); S.pin('stratified-squamous-nonkeratinized', 'stratified-squamous-nonkeratinized', [1120, 500]);
}
plates.push({ key: 'epithelia-stratified', moduleId: MOD, kind: 'tissue-schematic', lessons: ['epithelial-patterns', 'histology-recognition'], purpose: 'Pseudostratified, stratified squamous keratinized and non-keratinized epithelium.',
  title: ['Pseudostratified and stratified squamous epithelia (schematic)', 'Epitelios pseudoestratificado y plano estratificado (esquema)'],
  desc: ['Schematic, not a photomicrograph. Left: pseudostratified columnar epithelium, where every cell touches the basement membrane but only the tall ones reach the surface, so nuclei sit at several heights and it looks layered; a flask-shaped goblet cell secretes mucus and the tall cells carry cilia (airways). Middle: stratified squamous keratinized epithelium, with a cuboidal base, polygonal middle cells and flattened superficial cells ending in a dead keratin layer (skin). Right: non-keratinized stratified squamous, whose surface cells stay alive and nucleated and have no keratin layer (mouth, oesophagus, vagina). Idealised cells.',
    'Esquema, no una fotomicrografía. Izquierda: epitelio cilíndrico pseudoestratificado, donde todas las células tocan la membrana basal pero solo las altas llegan a la superficie, de modo que los núcleos quedan a varias alturas y parece estratificado; una célula caliciforme en forma de frasco secreta moco y las células altas llevan cilios (vías respiratorias). Centro: epitelio plano estratificado queratinizado, con base cúbica, células medias poligonales y células superficiales aplanadas que terminan en una capa muerta de queratina (piel). Derecha: epitelio plano estratificado no queratinizado, cuyas células superficiales siguen vivas y con núcleo y no tienen capa de queratina (boca, esófago, vagina). Células idealizadas.'],
  orientation: ['schematic sections; apical surface at top, connective tissue below', 'cortes esquemáticos; superficie apical arriba, tejido conectivo abajo'], draw: strat });

// ---------------------------------------------------------------- 3 strat cuboidal / columnar / transitional
function strat2(Sc) {
  S = Sc; three(['stratified-cuboidal', 'stratified-columnar', 'transitional']);
  let f = frame(0, null);
  for (let x = f.x + 14; x + 50 < f.x + f.w - 10; x += 54) { S.sh('stratified-cuboidal-epithelium', RR(x, BMY - 56, 50, 52, 8), { ...CELL, sw: 1.3 }); nuc(x + 25, BMY - 30, 11, 11); }
  for (let x = f.x + 40; x + 50 < f.x + f.w - 30; x += 54) { S.sh('stratified-cuboidal-epithelium', RR(x, BMY - 112, 50, 52, 8), { ...CELL, sw: 1.3 }); nuc(x + 25, BMY - 86, 11, 11); }
  f = frame(1, null);
  for (let x = f.x + 10; x + 44 < f.x + f.w - 8; x += 48) { S.sh('stratified-columnar-epithelium', RR(x, BMY - 52, 44, 50, 8), { ...CELL, sw: 1.3 }); nuc(x + 22, BMY - 28, 10, 10); }
  for (let x = f.x + 30; x + 46 < f.x + f.w - 20; x += 48) { S.sh('stratified-columnar-epithelium', RR(x, BMY - 186, 46, 130, 10), { ...CELL, sw: 1.3 }); nuc(x + 23, BMY - 108, 9, 16); S.ln(null, `M${x + 12} ${BMY - 186}l-2 -16M${x + 23} ${BMY - 186}v-18M${x + 34} ${BMY - 186}l2 -16`, { color: '#9A6A74', w: 1.6 }); }
  f = frame(2, null);
  for (let x = f.x + 10; x + 36 < f.x + f.w - 8; x += 40) { S.sh('transitional-epithelium', RR(x, BMY - 44, 36, 42, 8), { ...CELL, sw: 1.3 }); nuc(x + 18, BMY - 22, 9, 9); }
  for (let x = f.x + 30; x + 40 < f.x + f.w - 20; x += 44) { S.sh('transitional-epithelium', sm([[x + 20, BMY - 160], [x + 40, BMY - 86], [x + 30, BMY - 46], [x + 10, BMY - 46], [x, BMY - 86]], true, 4), { ...CELL, sw: 1.3 }); nuc(x + 20, BMY - 96, 10, 10); }
  [[f.x + 14, 4], [f.x + 134, 4], [f.x + 254, 4]].forEach(([x]) => { S.sh('transitional-epithelium', sm([[x, BMY - 232], [x + 34, BMY - 262], [x + 116, BMY - 262], [x + 150, BMY - 232], [x + 128, BMY - 170], [x + 24, BMY - 170]], true, 5), { fill: '#EDD0D3', line: '#9A6A74', sw: 1.5 }); nuc(x + 88, BMY - 214, 11, 11); nuc(x + 62, BMY - 214, 11, 11); });
  S.at('stratified-cuboidal'); S.pin('stratified-cuboidal-epithelium', 'stratified-cuboidal-epithelium', [250, BMY - 86]);
  S.at('stratified-columnar'); S.pin('stratified-columnar-epithelium', 'stratified-columnar-epithelium', [700, BMY - 130]);
  S.at('transitional'); S.pin('transitional-epithelium', 'transitional-epithelium', [1060, BMY - 110]);
}
plates.push({ key: 'epithelia-other-stratified', moduleId: MOD, kind: 'tissue-schematic', lessons: ['epithelial-patterns'], purpose: 'Stratified cuboidal, stratified columnar and transitional epithelium.',
  title: ['Stratified cuboidal, columnar and transitional epithelia (schematic)', 'Epitelios estratificado cúbico, cilíndrico y de transición (esquema)'],
  desc: ['Schematic, not a photomicrograph. Left: stratified cuboidal epithelium, usually just two rows of cuboidal cells lining a larger duct (sweat or salivary ducts). Middle: stratified columnar epithelium, rare, with small basal cells and a surface row of columnar cells (parts of large ducts and the male urethra). Right: transitional epithelium of the urinary tract, with small basal cells, pear-shaped middle cells and large rounded surface (umbrella) cells that flatten as the organ stretches. Idealised cells; the duct lumen is at the top.',
    'Esquema, no una fotomicrografía. Izquierda: epitelio cúbico estratificado, normalmente solo dos hileras de células cúbicas que revisten un conducto mayor (conductos sudoríparos o salivales). Centro: epitelio cilíndrico estratificado, raro, con pequeñas células basales y una hilera superficial de células cilíndricas (partes de grandes conductos y uretra masculina). Derecha: epitelio de transición de las vías urinarias, con pequeñas células basales, células medias piriformes y grandes células superficiales redondeadas (en paraguas) que se aplanan cuando el órgano se distiende. Células idealizadas; la luz del conducto está arriba.'],
  orientation: ['schematic sections; lumen at top, connective tissue below', 'cortes esquemáticos; luz arriba, tejido conectivo abajo'], draw: strat2 });

// ---------------------------------------------------------------- connective helpers
const BG = { fill: '#F3E3DA', line: '#D2B8A8' };
const bgPanel = (i) => S.sh(null, RR(PX[i] + 20, 90, PW[i] - 40, 840, 8), { ...BG, sw: 1.2 });
function fibro(x, y, a = 0) { S.sh(null, E(x, y, 22, 6, a), { fill: '#C9A3AE', line: '#8A6068', sw: 1 }); }

function loose(Sc) {
  S = Sc; three(['areolar', 'adipose', 'reticular']);
  [0, 1, 2].forEach(bgPanel);
  const x0 = PX[0] + 20, r = rng(9);
  for (let k = 0; k < 7; k++) S.tb('collagen-fiber-tissue', [[x0 + 10, 150 + k * 110], [x0 + 140, 120 + k * 110 + (k % 2 ? 40 : -20)], [x0 + 260, 190 + k * 110], [x0 + 420, 140 + k * 110]], 16, 16, { fill: '#F9F1E8', line: '#BFA18F', sw: 1.2 });
  for (let k = 0; k < 9; k++) S.ln('elastic-fiber-tissue', sm([[x0 + 10, 140 + k * 85], [x0 + 150, 170 + k * 85 - (k % 3) * 30], [x0 + 300, 120 + k * 85], [x0 + 420, 160 + k * 85]], false, 5), { color: '#6F4F66', w: 2.2 });
  for (let k = 0; k < 7; k++) { fibro(x0 + 80 + (k * 133) % 300, 180 + k * 108, (k * 40) % 90 - 45); }
  S.sh(null, sm([[x0 + 330, 300], [x0 + 360, 280], [x0 + 390, 310], [x0 + 372, 350], [x0 + 336, 340]]), { fill: '#C9B7D6', line: '#6F6381', sw: 1.4 });
  S.sh('areolar-connective-tissue', E(x0 + 100, 820, 70, 60), { fill: '#EFD3C6', line: '#B98A7A', sw: 1.2 });
  S.sh('areolar-connective-tissue', E(x0 + 300, 840, 60, 50), { fill: '#EFD3C6', line: '#B98A7A', sw: 1.2 });
  const x1 = PX[1] + 20;
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { const cx = x1 + 58 + i * 90 + (j % 2) * 26, cy = 180 + j * 170;
    S.sh('adipose-connective-tissue', E(cx, cy, 44, 70), { fill: '#F8F0CC', line: '#9A8A4A', sw: 1.8 }); S.sh(null, E(cx + 28, cy + 46, 9, 5, 40), { fill: '#A99ABD', line: '#6F6381', sw: 1 }); }
  const x2 = PX[2] + 20;
  for (let k = 0; k < 16; k++) S.ln('reticular-connective-tissue', sm([[x2 + 10 + (k * 71) % 400, 120 + ((k * 53) % 760)], [x2 + 60 + (k * 37) % 350, 220 + ((k * 91) % 600)], [x2 + 20 + (k * 131) % 400, 300 + ((k * 29) % 560)]], false, 5), { color: '#5E4A54', w: 3 });
  for (let k = 0; k < 22; k++) S.sh(null, E(x2 + 30 + (k * 97) % 390, 130 + (k * 163) % 760, 15, 15), { fill: '#B8A8CC', line: '#6F6381', sw: 1.4 });
  S.at('areolar'); S.pin('areolar-connective-tissue', 'areolar-connective-tissue', [PX[0] + 120, 820]);
  S.pin('collagen-fiber-tissue', 'collagen-fiber-tissue', [PX[0] + 160, 336]);
  S.pin('elastic-fiber-tissue', 'elastic-fiber-tissue', [PX[0] + 100, 480]);
  S.at('adipose'); S.pin('adipose-connective-tissue', 'adipose-connective-tissue', [PX[1] + 190, 400]);
  S.at('reticular'); S.pin('reticular-connective-tissue', 'reticular-connective-tissue', [PX[2] + 200, 400]);
}
plates.push({ key: 'connective-loose', moduleId: MOD, kind: 'tissue-schematic', lessons: ['connective-matrices', 'histology-recognition'], purpose: 'Areolar, adipose and reticular connective tissue.',
  title: ['Loose connective tissues: areolar, adipose, reticular (schematic)', 'Tejidos conectivos laxos: areolar, adiposo, reticular (esquema)'],
  desc: ['Schematic, not a photomicrograph. Left: areolar tissue, a loose mix of thick pale collagen fibres, thin dark elastic fibres, fibroblasts and an occasional immune cell, with open ground substance between. Middle: adipose tissue, packed with large fat cells whose single droplet pushes the nucleus and thin cytoplasm to the edge. Right: reticular tissue, a fine branching network of reticular fibres holding many round lymphoid cells (lymph node, spleen, bone marrow). Idealised fibres and cells.',
    'Esquema, no una fotomicrografía. Izquierda: tejido areolar, mezcla laxa de gruesas fibras de colágeno pálidas, finas fibras elásticas oscuras, fibroblastos y alguna célula inmunitaria ocasional, con sustancia fundamental abierta entre ellas. Centro: tejido adiposo, repleto de grandes células grasas cuya única gota empuja el núcleo y el citoplasma delgado hacia el borde. Derecha: tejido reticular, una fina red ramificada de fibras reticulares que sostiene muchas células linfoides redondas (ganglio linfático, bazo, médula ósea). Fibras y células idealizadas.'],
  orientation: ['schematic fields; no polarity', 'campos esquemáticos; sin polaridad'], draw: loose });

function dense(Sc) {
  S = Sc; three(['regular', 'irregular', 'elastic']); [0, 1, 2].forEach(bgPanel);
  const x0 = PX[0] + 20;
  for (let k = 0; k < 9; k++) { S.tb('dense-regular-connective-tissue', [[x0 + 6, 140 + k * 86], [x0 + 140, 134 + k * 86], [x0 + 300, 146 + k * 86], [x0 + 424, 138 + k * 86]], 52, 52, { fill: '#F2D9CF', line: '#B98A7A', sw: 1.3 }); for (let j = 0; j < 3; j++) S.ln(null, `M${x0 + 12} ${126 + k * 86 + j * 14}Q${x0 + 200} ${130 + k * 86 + j * 14 + (j % 2 ? 6 : -6)} ${x0 + 418} ${126 + k * 86 + j * 14}`, { color: '#D6A89A', w: 1.2, op: 0.8 }); if (k < 8) [60, 150, 240, 330].forEach((dx, q) => fibro(x0 + dx + (k % 2) * 30, 188 + k * 86, 0)); }
  const x1 = PX[1] + 20;
  [[[0, 160], [200, 90], [420, 200]], [[10, 300], [220, 360], [420, 280]], [[40, 80], [140, 300], [90, 520]], [[300, 60], [360, 280], [410, 480]], [[0, 640], [220, 540], [420, 620]], [[60, 880], [230, 760], [390, 860]], [[180, 100], [250, 420], [200, 700]], [[0, 460], [200, 480], [420, 440]], [[320, 560], [380, 700], [330, 900]]].forEach(([a, b, c]) => S.tb('dense-irregular-connective-tissue', [[x1 + a[0], a[1] + 60], [x1 + b[0], b[1] + 60], [x1 + c[0], c[1] + 60]], 46, 46, { fill: '#F2D9CF', line: '#B98A7A', sw: 1.3 }));
  [[70, 200], [250, 380], [150, 560], [330, 700], [90, 800]].forEach(([dx, y]) => fibro(x1 + dx, y, 30));
  const x2 = PX[2] + 20;
  for (let k = 0; k < 8; k++) S.ln('elastic-connective-tissue', sm([[x2 + 6, 130 + k * 100], [x2 + 120, 100 + k * 100 + 24], [x2 + 240, 140 + k * 100], [x2 + 330, 110 + k * 100 + 20], [x2 + 430, 130 + k * 100]], false, 6), { color: '#6F4F66', w: 11 });
  for (let k = 0; k < 8; k++) S.ln(null, sm([[x2 + 6, 130 + k * 100], [x2 + 120, 100 + k * 100 + 24], [x2 + 240, 140 + k * 100], [x2 + 330, 110 + k * 100 + 20], [x2 + 430, 130 + k * 100]], false, 6), { color: '#8E6B84', w: 6 });
  for (let k = 0; k < 7; k++) for (let j = 0; j < 3; j++) S.sh(null, E(x2 + 90 + j * 140, 190 + k * 100 + (j % 2) * 8, 22, 7), { fill: '#C9A3AE', line: '#8A6068', sw: 1 });
  S.at('regular'); S.pin('dense-regular-connective-tissue', 'dense-regular-connective-tissue', [PX[0] + 120, 226 + 4]);
  S.at('irregular'); S.pin('dense-irregular-connective-tissue', 'dense-irregular-connective-tissue', [PX[1] + 250, 430]);
  S.at('elastic'); S.pin('elastic-connective-tissue', 'elastic-connective-tissue', [PX[2] + 250, 436]);
}
plates.push({ key: 'connective-dense', moduleId: MOD, kind: 'tissue-schematic', lessons: ['connective-matrices', 'histology-recognition'], purpose: 'Dense regular, dense irregular and elastic connective tissue.',
  title: ['Dense connective tissues: regular, irregular, elastic (schematic)', 'Tejidos conectivos densos: regular, irregular, elástico (esquema)'],
  desc: ['Schematic, not a photomicrograph. Left: dense regular connective tissue (tendon, ligament) with thick collagen bundles all running one way and rows of flattened fibroblast nuclei squeezed between them, resisting pull in one direction. Middle: dense irregular tissue (dermis, organ capsules) with bundles woven in many directions, resisting pull from any side. Right: elastic connective tissue with thick wavy elastic fibres between cells (large artery walls, some ligaments), which recoil after stretch. Idealised bundles.',
    'Esquema, no una fotomicrografía. Izquierda: tejido conectivo denso regular (tendón, ligamento) con gruesos haces de colágeno que corren todos en un sentido y hileras de núcleos aplanados de fibroblastos entre ellos, que resisten la tracción en una dirección. Centro: tejido denso irregular (dermis, cápsulas de órganos) con haces entrelazados en muchas direcciones, que resisten la tracción desde cualquier lado. Derecha: tejido conectivo elástico con gruesas fibras elásticas onduladas entre las células (paredes de grandes arterias, algunos ligamentos), que recuperan su forma tras el estiramiento. Haces idealizados.'],
  orientation: ['schematic fields; regular tissue shown along the fibre axis', 'campos esquemáticos; el tejido regular se muestra a lo largo del eje de las fibras'], draw: dense });

// ---------------------------------------------------------------- cartilage
function cartilage(Sc) {
  S = Sc; three(['hyaline', 'elastic', 'fibro']); [0, 1, 2].forEach(bgPanel);
  const x0 = PX[0] + 20;
  S.sh(null, RR(x0, 100, 410, 60, 6), { fill: '#EFD3C6', line: '#B98A7A', sw: 1.2 });
  S.sh('hyaline-cartilage-tissue', RR(x0, 170, 410, 740, 6), { fill: '#CFE0E4', line: '#6F8D9A', sw: 1.4 });
  [[120, 300], [300, 280], [200, 470], [350, 520], [110, 640], [270, 700], [350, 840], [130, 820]].forEach(([dx, y], i) => { const cx = x0 + dx;
    if (i % 2 === 0) { S.sh('lacuna', E(cx - 24, y, 28, 34), { fill: '#F4F0E8', line: '#6F8D9A', sw: 1.4 }); S.sh('lacuna', E(cx + 24, y + 6, 28, 34), { fill: '#F4F0E8', line: '#6F8D9A', sw: 1.4 }); nuc(cx - 24, y, 12, 14); nuc(cx + 24, y + 6, 12, 14); }
    else { S.sh('lacuna', E(cx, y, 30, 36), { fill: '#F4F0E8', line: '#6F8D9A', sw: 1.4 }); nuc(cx, y, 13, 15); } });
  const x1 = PX[1] + 20;
  S.sh('elastic-cartilage-tissue', RR(x1, 100, 410, 810, 6), { fill: '#D8CCD9', line: '#6F6381', sw: 1.4 });
  for (let k = 0; k < 20; k++) S.ln(null, sm([[x1 + (k * 23) % 60, 110 + k * 40], [x1 + 140, 90 + k * 40 + (k % 3) * 30], [x1 + 280, 130 + k * 40 - (k % 2) * 20], [x1 + 410, 100 + k * 40 + 20]], false, 5), { color: '#5E4A66', w: 1.8, op: 0.9 });
  [[100, 220], [300, 300], [180, 420], [340, 560], [110, 640], [260, 760], [360, 860], [120, 860]].forEach(([dx, y]) => { S.sh(null, E(x1 + dx, y, 30, 34), { fill: '#F4F0E8', line: '#6F6381', sw: 1.4 }); nuc(x1 + dx, y, 13, 15); });
  const x2 = PX[2] + 20;
  S.sh('fibrocartilage-tissue', RR(x2, 100, 410, 810, 6), { fill: '#EFD3C6', line: '#B98A7A', sw: 1.4 });
  for (let k = 0; k < 9; k++) S.tb(null, [[x2 + 6, 140 + k * 92], [x2 + 200, 130 + k * 92], [x2 + 404, 144 + k * 92]], 34, 34, { fill: '#F9F1E8', line: '#BFA18F', sw: 1.2 });
  [0, 1, 2, 3, 4, 5, 6].forEach((k) => [90, 210, 330].forEach((dx) => { S.sh(null, E(x2 + dx, 186 + k * 92 - 22, 30, 16), { fill: '#F4F0E8', line: '#6F8D9A', sw: 1.3 }); nuc(x2 + dx, 186 + k * 92 - 22, 11, 8); }));
  S.at('hyaline'); S.pin('hyaline-cartilage-tissue', 'hyaline-cartilage-tissue', [PX[0] + 330, 400]);
  S.pin('lacuna-tissue', 'lacuna', [x0 + 96, 300]);
  S.at('elastic'); S.pin('elastic-cartilage-tissue', 'elastic-cartilage-tissue', [PX[1] + 230, 360]);
  S.at('fibro'); S.pin('fibrocartilage-tissue', 'fibrocartilage-tissue', [PX[2] + 200, 480]);
}
plates.push({ key: 'cartilage', moduleId: MOD, kind: 'tissue-schematic', lessons: ['connective-matrices', 'histology-recognition'], purpose: 'Hyaline, elastic and fibrocartilage.',
  title: ['Cartilages: hyaline, elastic, fibrocartilage (schematic)', 'Cartílagos: hialino, elástico, fibrocartílago (esquema)'],
  desc: ['Schematic, not a photomicrograph. Cartilage cells (chondrocytes) sit in small spaces called lacunae inside a firm, avascular matrix. Left: hyaline cartilage, with a smooth glassy matrix and chondrocytes often in pairs; a perichondrium (pink band) covers the top. Middle: elastic cartilage, with the matrix packed with dark wavy elastic fibres (ear, epiglottis). Right: fibrocartilage, with rows of chondrocytes between thick parallel collagen bundles (intervertebral discs, pubic symphysis, menisci). Idealised.',
    'Esquema, no una fotomicrografía. Las células del cartílago (condrocitos) se alojan en pequeños espacios llamados lagunas dentro de una matriz firme y avascular. Izquierda: cartílago hialino, con matriz lisa y vítrea y condrocitos a menudo en parejas; el pericondrio (banda rosa) cubre la parte superior. Centro: cartílago elástico, con la matriz llena de fibras elásticas oscuras y onduladas (oreja, epiglotis). Derecha: fibrocartílago, con hileras de condrocitos entre gruesos haces paralelos de colágeno (discos intervertebrales, sínfisis del pubis, meniscos). Idealizado.'],
  orientation: ['schematic fields; no polarity', 'campos esquemáticos; sin polaridad'], draw: cartilage });

// ---------------------------------------------------------------- muscle
function muscle(Sc) {
  S = Sc; three(['skeletal', 'cardiac', 'smooth']); [0, 1, 2].forEach(bgPanel);
  const x0 = PX[0] + 20;
  for (let k = 0; k < 6; k++) { const y = 130 + k * 135; S.sh('skeletal-muscle-tissue', RR(x0 + 4, y, 402, 110, 10), { fill: '#E4B7B2', line: '#8A4A47', sw: 1.6 }); for (let x = x0 + 24; x < x0 + 395; x += 14) S.ln(null, `M${x} ${y + 12}v86`, { color: '#B97E7A', w: 2.2, op: 0.75 }); [60, 160, 270, 360].forEach((dx, q) => S.sh(null, E(x0 + dx + (k % 2) * 14, y + 8 + (q % 2) * 2, 13, 5), { ...NUC, sw: 1.2 })); }
  const x1 = PX[1] + 20;
  const CM = { fill: '#E4B7B2', line: '#8A4A47', sw: 1.6 }, ys = [210, 380, 550, 720];
  ys.forEach((y, i) => S.tb('cardiac-muscle-tissue', [[x1 + 4, y + (i % 2) * 8], [x1 + 200, y - 8], [x1 + 406, y + 6]], 76, 76, CM));
  S.tb('cardiac-muscle-tissue', [[x1 + 120, ys[0]], [x1 + 140, (ys[0] + ys[1]) / 2], [x1 + 150, ys[1]]], 50, 50, CM);
  S.tb('cardiac-muscle-tissue', [[x1 + 290, ys[2]], [x1 + 270, (ys[2] + ys[3]) / 2], [x1 + 280, ys[3]]], 50, 50, CM);
  S.tb('cardiac-muscle-tissue', [[x1 + 300, ys[1]], [x1 + 320, (ys[1] + ys[2]) / 2], [x1 + 310, ys[2]]], 50, 50, CM);
  for (const y of ys) for (let x = x1 + 18; x < x1 + 392; x += 14) S.ln(null, `M${x} ${y - 28}v56`, { color: '#B97E7A', w: 1.5, op: 0.55 });
  [[110, 205], [330, 214], [90, 385], [230, 372], [370, 380], [100, 550], [210, 545], [390, 556], [110, 726], [350, 724], [150, 295], [290, 640]].forEach(([dx, y]) => S.sh(null, E(x1 + dx, y, 13, 9), { ...NUC, sw: 1.2 }));
  [[200, 210], [255, 372], [190, 545], [250, 722], [352, 470]].forEach(([dx, y], i) => { const d = (i === 4) ? 52 : 76; S.sh('intercalated-disc-tissue', RR(x1 + dx - 3, y - d / 2 - 2, 7, d + 4, 2), { fill: '#6F3E4A', line: '#4A2A32', sw: 1 }); });
  const x2 = PX[2] + 20, r = rng(21);
  for (let k = 0; k < 14; k++) { const cx = x2 + 70 + (k % 3) * 120 + (k % 2) * 20, cy = 150 + Math.floor(k / 3) * 160 + (k % 3) * 22;
    S.sh('smooth-muscle-tissue', sm([[cx - 70, cy + 6], [cx - 30, cy - 18], [cx + 30, cy - 16], [cx + 72, cy], [cx + 30, cy + 22], [cx - 30, cy + 20]], true, 5), { fill: '#E4B7B2', line: '#8A4A47', sw: 1.5 }); nuc(cx, cy + 2, 18, 8); void r; }
  S.at('skeletal'); S.pin('skeletal-muscle-tissue', 'skeletal-muscle-tissue', [x0 + 200, 190]);
  S.at('cardiac'); S.pin('cardiac-muscle-tissue', 'cardiac-muscle-tissue', [x1 + 60, 210]); S.pin('intercalated-disc-tissue', 'intercalated-disc-tissue', [x1 + 200, 210]);
  S.at('smooth'); S.pin('smooth-muscle-tissue', 'smooth-muscle-tissue', [x2 + 250, 300]);
}
plates.push({ key: 'muscle-tissue', moduleId: MOD, kind: 'tissue-schematic', lessons: ['muscle-histology', 'histology-recognition'], purpose: 'Skeletal, cardiac and smooth muscle with the intercalated disc.',
  title: ['Muscle tissues: skeletal, cardiac, smooth (schematic)', 'Tejidos musculares: esquelético, cardíaco, liso (esquema)'],
  desc: ['Schematic, not a photomicrograph. Left: skeletal muscle in long section, long cylindrical striated fibres, each with many nuclei pressed to the edge. Middle: cardiac muscle, striated but shorter, branching fibres with one central nucleus; dark intercalated discs mark the end-to-end junctions between cells. Right: smooth muscle, tapering spindle cells with one central nucleus and no striations, interlocking in sheets. Idealised cells; striations are drawn as faint lines.',
    'Esquema, no una fotomicrografía. Izquierda: músculo esquelético en corte longitudinal, fibras largas, cilíndricas y estriadas, cada una con muchos núcleos pegados al borde. Centro: músculo cardíaco, estriado pero con fibras más cortas y ramificadas con un núcleo central; los discos intercalares oscuros marcan las uniones extremo con extremo entre células. Derecha: músculo liso, células fusiformes afiladas con un núcleo central y sin estrías, que se entrelazan en láminas. Células idealizadas; las estrías se dibujan como líneas tenues.'],
  orientation: ['schematic longitudinal fields; no polarity', 'campos longitudinales esquemáticos; sin polaridad'], draw: muscle });

// ---------------------------------------------------------------- nervous tissue
function nervous(Sc) {
  S = Sc; S.panel(30, 30, 860, 940, 'neuron'); S.panel(910, 30, 510, 940, 'neuroglia');
  S.sh(null, RR(50, 50, 820, 900, 8), { fill: '#F3EBE0', line: '#DAD3C4', sw: 1 });
  const soma = sm([[160, 470], [200, 420], [270, 408], [320, 440], [316, 500], [260, 536], [190, 520]], true, 5);
  S.sh('neuron-tissue', soma, { fill: '#D8C3A0', line: '#8A6E3C', sw: 1.8 });
  [[[200, 430], [150, 340], [90, 250], [80, 160]], [[160, 480], [110, 500], [80, 560], [90, 650]], [[220, 520], [200, 600], [150, 700], [130, 800]], [[270, 412], [290, 330], [330, 250], [380, 200]]].forEach((p) => S.tb('neuron-tissue', p, 22, 6, { fill: '#D8C3A0', line: '#8A6E3C' }));
  [[[92, 270], [150, 230]], [[92, 270], [50, 230]], [[82, 560], [40, 585]], [[172, 650], [230, 690]]].forEach((p) => S.tb('neuron-tissue', p, 9, 3, { fill: '#D8C3A0', line: '#8A6E3C' }));
  S.sh(null, E(235, 472, 34, 30), { ...NUC, sw: 1.6 }); S.sh(null, E(240, 474, 9, 9), { fill: '#6F6381', line: '#6F6381', sw: 0.5 });
  S.tb('axon', [[320, 480], [420, 470], [520, 480], [620, 470], [700, 480]], 12, 10, { fill: '#D8C3A0', line: '#8A6E3C' });
  [[360, 44], [470, 60], [585, 56]].forEach(([x, w]) => S.sh('myelin', RR(x, 450, w, 56, 18), { fill: '#F4EEC8', line: '#9A8A4A', sw: 1.6 }));
  S.tb('axon', [[700, 480], [770, 440], [830, 400]], 10, 4, { fill: '#D8C3A0', line: '#8A6E3C' });
  S.tb('axon', [[700, 480], [770, 520], [840, 560]], 10, 4, { fill: '#D8C3A0', line: '#8A6E3C' });
  [[830, 400], [840, 560]].forEach(([x, y]) => S.sh('axon', E(x + 12, y, 12, 12), { fill: '#D8C3A0', line: '#8A6E3C', sw: 1.4 }));
  S.sh(null, E(412, 435, 14, 8), { ...NUC, sw: 1.2 }); S.sh(null, E(528, 524, 14, 8), { ...NUC, sw: 1.2 });
  S.at('neuron');
  S.pin('neuron-tissue', 'neuron-tissue', [240, 500]);
  S.at('neuroglia');
  S.sh(null, RR(930, 50, 470, 900, 8), { fill: '#F3EBE0', line: '#DAD3C4', sw: 1 });
  const star = (cx, cy, r, n, id, fill, line) => { const p = []; for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2, rr = i % 2 ? r * 0.38 : r * (0.85 + ((i * 7) % 3) * 0.12); p.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]); } S.sh(id, sm(p, true, 4), { fill, line, sw: 1.5 }); };
  star(1030, 230, 110, 7, 'neuroglia-tissue', '#B9D0C2', '#4F7A66'); S.sh(null, E(1030, 230, 16, 14), { ...NUC, sw: 1.2 });
  S.sh(null, tube([[1030, 230], [1100, 330], [1180, 400]], 7, 5), { fill: '#B9D0C2', line: '#4F7A66', sw: 1 });
  S.sh(null, E(1210, 410, 40, 24), { fill: '#E3C4D0', line: '#8A6068', sw: 1.4 });
  star(1290, 650, 60, 5, 'neuroglia-tissue', '#D4C2E0', '#6F6381'); S.sh(null, E(1290, 650, 10, 9), { ...NUC, sw: 1.2 });
  S.sh('neuroglia-tissue', E(1130, 800, 52, 40), { fill: '#E3D2A8', line: '#8A6E3C', sw: 1.6 }); S.sh(null, E(1130, 800, 14, 12), { ...NUC, sw: 1.2 });
  S.tb('neuroglia-tissue', [[1130, 800], [1100, 700], [1096, 575]], 8, 5, { fill: '#E3D2A8', line: '#8A6E3C' });
  S.sh(null, tube([[1000, 520], [1100, 560], [1200, 580]], 30, 30), { fill: '#F4EEC8', line: '#9A8A4A', sw: 1.4 });
  S.pin('neuroglia-tissue', 'neuroglia-tissue', [1030, 230]);
}
plates.push({ key: 'nervous-tissue', moduleId: MOD, kind: 'tissue-schematic', lessons: ['nervous-tissue-cues', 'histology-recognition'], purpose: 'Neuron structure and the supporting neuroglia.',
  title: ['Nervous tissue: neuron and neuroglia (schematic)', 'Tejido nervioso: neurona y neuroglía (esquema)'],
  desc: ['Schematic, not a photomicrograph. Left: a multipolar neuron with a cell body holding the nucleus and nucleolus, several branching dendrites that receive input, and one long axon, here wrapped in segments of pale myelin and ending in terminal branches. Right: neuroglia, the supporting cells: a star-shaped astrocyte reaching a capillary (pink), a small lilac microglial cell and a tan oligodendrocyte sending a process toward an axon (pale myelinated fibre). Group marker only: all glia share one label. Cell sizes and shapes are idealised and not to scale; only one of each is drawn.',
    'Esquema, no una fotomicrografía. Izquierda: una neurona multipolar con un cuerpo celular que contiene el núcleo y el nucléolo, varias dendritas ramificadas que reciben información y un largo axón, aquí envuelto en segmentos de mielina pálida y terminado en ramas terminales. Derecha: neuroglía, las células de sostén: un astrocito estrellado que alcanza un capilar (rosa), una pequeña célula microglial lila y un oligodendrocito beige que envía una prolongación hacia un axón (fibra mielínica pálida). Solo marcador de grupo: toda la glía comparte un marcador. Tamaños y formas idealizados y sin escala; solo se dibuja uno de cada tipo.'],
  orientation: ['schematic cells; no polarity', 'células esquemáticas; sin polaridad'], draw: nervous });
void C; void poly; void sm;
