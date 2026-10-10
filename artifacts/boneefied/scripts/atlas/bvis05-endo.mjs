// BVIS05 endocrine plates: body map, hypothalamus-pituitary, thyroid/parathyroid, adrenal, pancreas, gonads.
import { sm, poly, E, RR, tube, vs, rng, A, V, MY } from './bvis05-lib.mjs';
import { skin, heartGhost } from './bvis05-body.mjs';

const MOD = 'endocrine-system';
const D = (s) => 'endo-' + s;
export const plates = [];
const GL = { fill: '#E2D5A4', line: '#9A8A4A' }, CAP = { fill: '#B592A0', line: '#76566A' }, NV = { fill: '#DDC08E', line: '#8A6E3C' };
const KID = { fill: '#C9998F', line: '#8A5C54' };
const circ = (cx, cy, r) => E(cx, cy, r, r);
const rect = (x, y, w, h) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
const ring = (cx, cy, r0, r1, a0, a1, n = 10) => { const pt = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)], o = [], i = []; for (let k = 0; k <= n; k++) { const a = a0 + ((a1 - a0) * k) / n; o.push(pt(r1, a)); i.push(pt(r0, a)); } return poly([...o, ...i.reverse()]); };

// ------------------------------------------------------------ 1 body map
function body(S) {
  S.panel(30, 30, 690, 940, 'body'); S.panel(740, 30, 680, 560, 'head'); S.panel(740, 610, 680, 360, 'testis');
  S.at('body');
  const cx = 375, top = 60, P = ([x, y]) => [cx + x, top + y];
  S.beginT(cx, top, 1);
  skin(S); heartGhost(S);
  [[-30, 372, 6, 'k'], [30, 360, -6, 'k']].forEach(([x, y, r]) => S.sh(null, E(x, y, 18, 36, r), { fill: KID.fill, line: KID.line, sw: 1.4 }));
  S.sh(D('uterus'), sm([[-12, 440], [12, 440], [20, 468], [0, 484], [-20, 468]]), { fill: '#E2CFC8', line: '#C3AFA6', sw: 1.2 });
  S.sh(D('pancreas'), tube([[-30, 303], [-5, 298], [22, 292], [44, 286]], 18, 11), { fill: GL.fill, line: GL.line, sw: 1.3 });
  S.sh(D('adr'), E(-28, 330, 13, 8, 12), { fill: GL.fill, line: GL.line, sw: 1.3 }); S.sh(D('adr'), E(30, 318, 13, 8, -12), { fill: GL.fill, line: GL.line, sw: 1.3 });
  S.sh(D('thymus'), sm([[-18, 142], [-2, 138], [-2, 184], [-14, 192], [-24, 170]], true, 4), { fill: GL.fill, line: GL.line, sw: 1.3 });
  S.sh(D('thymus'), sm([[18, 142], [2, 138], [2, 184], [14, 192], [24, 170]], true, 4), { fill: GL.fill, line: GL.line, sw: 1.3 });
  S.sh(D('thyroid'), E(-13, 110, 9, 17, -6), { fill: GL.fill, line: GL.line, sw: 1.3 }); S.sh(D('thyroid'), E(13, 110, 9, 17, 6), { fill: GL.fill, line: GL.line, sw: 1.3 });
  S.sh(D('thyroid'), rect(-6, 108, 12, 8), { fill: GL.fill, line: GL.line, sw: 1.3 });
  S.sh(D('ovary'), E(-28, 452, 12, 8, 10), { fill: GL.fill, line: GL.line, sw: 1.3 }); S.sh(D('ovary'), E(28, 452, 12, 8, -10), { fill: GL.fill, line: GL.line, sw: 1.3 });
  S.endT();
  [['thyroid', [-13, 108]], ['thymus', [-12, 168]], ['adrenal', [-28, 330]], ['pancreas', [-8, 298]], ['ovary', [-28, 452]]].forEach(([id, h]) => S.pin(D(id), D(id === 'adrenal' ? 'adr' : id), P(h)));
  S.at('head');
  S.sh(null, sm([[900, 300], [920, 190], [1010, 110], [1140, 90], [1260, 150], [1310, 260], [1270, 370], [1180, 420], [1060, 420], [960, 400]], true, 6), { fill: '#EADFD0', line: '#B7A593', sw: 2 });
  S.sh(null, sm([[930, 310], [945, 210], [1020, 135], [1140, 115], [1240, 170], [1280, 260], [1245, 350], [1170, 392], [1060, 392], [980, 372]], true, 6), { fill: '#D2BEC4', line: '#7E6670', sw: 1.8 });
  S.ln(null, sm([[990, 210], [1060, 150], [1160, 150], [1230, 210]], false, 8), { color: '#7E6670', w: 1.4 });
  S.sh(null, sm([[1000, 260], [1050, 215], [1160, 212], [1230, 262], [1160, 280], [1060, 282]], true, 6), { fill: '#E9E4DA', line: '#8F8A7E', sw: 1.4 });
  S.sh(null, E(1110, 322, 74, 38), { fill: '#C8B0B8', line: '#7E6670', sw: 1.4 });
  S.sh(null, tube([[1160, 360], [1180, 450], [1190, 560]], 70, 56), { fill: '#C8B0B8', line: '#7E6670', sw: 1.6 });
  S.sh(D('hypothalamus'), sm([[1020, 352], [1090, 352], [1096, 388], [1060, 400], [1020, 382]], true, 4), { fill: '#C79FA4', line: '#7E4A49', sw: 1.6 });
  S.sh(null, rect(1040, 400, 14, 38), { fill: '#C79FA4', line: '#7E4A49', sw: 1 });
  S.sh(null, sm([[990, 440], [1010, 492], [1080, 498], [1100, 448]], true, 4), { fill: '#E4D6BC', line: '#8B8168', sw: 1.4 });
  S.sh(D('pituitary'), E(1050, 462, 30, 20), { fill: GL.fill, line: GL.line, sw: 1.6 });
  S.sh(D('pineal'), sm([[1160, 330], [1196, 322], [1216, 350], [1192, 372], [1166, 362]], true, 4), { fill: GL.fill, line: GL.line, sw: 1.6 });
  S.pin(D('hypothalamus'), D('hypothalamus'), [1054, 372]);
  S.pin(D('pituitary'), D('pituitary'), [1050, 462]);
  S.pin(D('pineal'), D('pineal'), [1192, 346]);
  S.at('testis');
  S.sh(null, RR(1000, 640, 160, 80, 14), { fill: '#E8DCCD', line: '#B7A593', sw: 1.6 });
  S.sh(null, sm([[950, 720], [1210, 720], [1250, 800], [1230, 900], [1080, 950], [930, 900], [910, 800]], true, 6), { fill: '#E8DCCD', line: '#B7A593', sw: 1.8 });
  S.ln(null, 'M1080 720L1080 940', { color: '#B7A593', w: 3 });
  [[1000, 830], [1160, 830]].forEach(([x, y]) => { S.sh(D('testis'), E(x, y, 52, 70, 0), { fill: GL.fill, line: GL.line, sw: 1.6 }); S.ln(null, sm([[x + (x < 1080 ? 36 : -36), y - 56], [x + (x < 1080 ? 62 : -62), y - 10], [x + (x < 1080 ? 50 : -50), y + 50]], false, 6), { color: '#9A8A4A', w: 3 }); });
  S.pin(D('testis'), D('testis'), [1000, 830]);
}
plates.push({
  key: 'endocrine-body-map', moduleId: MOD, kind: 'gross-diagram', lessons: ['endo-pineal-thymus', 'endo-central-control', 'endo-thyroid-parathyroid', 'endo-adrenal', 'endo-pancreas-gonads'], purpose: 'Whole-body map of the main endocrine glands, with a sagittal head panel for pineal, hypothalamus and pituitary, and the testes.',
  title: ['Endocrine glands of the body', 'Glándulas endocrinas del cuerpo'],
  desc: ['Left, anterior view, patient right at viewer left (female pelvis shown): thyroid in the neck, thymus behind the breastbone, adrenal glands on top of the kidneys (grey-rose; retroperitoneal, left kidney slightly higher), pancreas across the upper abdomen in front of them, and the ovaries on each side of the uterus (pale shape). Glands are enlarged for visibility. Upper right: midline sagittal head, face at viewer left: the hypothalamus lies under the thalamus and is joined by the stalk to the pituitary in the bony sella, and the small pineal gland sits behind the third ventricle. Lower right: the testes hang in the scrotum, shown separately. The parathyroid glands lie on the back of the thyroid and are drawn on a separate plate. Simplified.',
    'Izquierda, vista anterior, derecha del paciente a la izquierda (se muestra una pelvis femenina): tiroides en el cuello, timo tras el esternón, suprarrenales sobre los riñones (gris rosado; retroperitoneales, el izquierdo algo más alto), páncreas cruzando el abdomen superior por delante de ellos y ovarios a cada lado del útero (forma pálida). Las glándulas están ampliadas para verse. Arriba a la derecha: cabeza en corte sagital medio, cara a la izquierda: el hipotálamo está bajo el tálamo y se une por el tallo a la hipófisis en la silla turca, y la pequeña glándula pineal queda detrás del tercer ventrículo. Abajo a la derecha: los testículos cuelgan en el escroto, mostrados aparte. Las paratiroides están en la cara posterior del tiroides y se dibujan en otra lámina. Simplificado.'],
  orientation: ['left: anterior body view, patient right at viewer left; upper right: sagittal head, face at viewer left; lower right: testes', 'izquierda: vista anterior, derecha del paciente a la izquierda; arriba derecha: cabeza sagital, cara a la izquierda; abajo derecha: testículos'], draw: body,
});

// ------------------------------------------------------------ 2 hypothalamus-pituitary
function hypo(S) {
  S.panel(30, 30, 1390, 940, 'hp');
  S.sh(null, RR(60, 60, 1330, 880, 16), { fill: '#EFE9E0', line: '#DCD3C6', sw: 1.2 });
  S.sh('hyp', sm([[520, 90], [920, 90], [960, 190], [900, 280], [740, 300], [560, 280], [490, 190]], true, 6), { fill: '#C79FA4', line: '#7E4A49', sw: 2 });
  S.sh(null, rect(716, 100, 18, 180), { fill: '#E6D9DD', line: '#7E4A49', sw: 1 });
  // stalk
  S.sh('stalk', tube([[726, 290], [730, 380], [730, 470]], 90, 70), { fill: '#E4D6BC', line: '#8B8168', sw: 1.8 });
  // lobes: anterior (viewer left), posterior (viewer right), intermedia between
  S.sh('ant', sm([[500, 520], [560, 460], [680, 450], [700, 540], [690, 680], [600, 740], [510, 690]], true, 5), { fill: GL.fill, line: GL.line, sw: 2 });
  S.sh('pi', rect(700, 480, 18, 230), { fill: '#D6C07F', line: GL.line, sw: 1.4 });
  S.sh('post', sm([[722, 490], [820, 480], [880, 560], [850, 690], [770, 720], [722, 700]], true, 5), { fill: '#EADFB8', line: GL.line, sw: 2 });
  // portal: primary plexus, portal veins, secondary plexus, vein out
  S.sh('plex', sm([[648, 290], [690, 280], [704, 322], [660, 336], [640, 316]], true, 4), { fill: '#E2C9D3', line: CAP.line, sw: 1.6 });
  [[656, 306, 690, 304], [652, 322, 696, 316]].forEach(([a, b, c, d]) => S.ln(null, `M${a} ${b}L${c} ${d}`, { color: CAP.line, w: 3 }));
  vs(S, D('portal'), [[672, 336], [668, 400], [650, 470], [630, 540]], 14, 14, V);
  vs(S, D('portal'), [[690, 336], [694, 400], [680, 470], [660, 540]], 12, 12, V);
  [[560, 560], [610, 620], [650, 680], [580, 660]].forEach(([x, y]) => S.sh(D('portal'), circ(x, y, 18), { fill: '#E2C9D3', line: CAP.line, sw: 1.6 }));
  vs(S, null, [[620, 700], [650, 790], [700, 880]], 16, 20, V);
  // parvocellular neurosecretory cell: short axon to the primary plexus
  S.sh('nsc', E(570, 180, 28, 34), { fill: '#E6C7A0', line: NV.line, sw: 1.6 }); S.sh(null, circ(570, 180, 10), { fill: '#A8855A', line: NV.line, sw: 1 });
  S.ln(null, sm([[590, 205], [620, 250], [660, 285]], false, 6), { color: NV.line, w: 6 });
  // magnocellular neurosecretory cell: long axon down the stalk to the posterior lobe
  S.sh('nsc', E(850, 180, 34, 40), { fill: '#E6C7A0', line: NV.line, sw: 1.6 }); S.sh(null, circ(850, 180, 12), { fill: '#A8855A', line: NV.line, sw: 1 });
  S.ln('axon', sm([[836, 218], [790, 290], [752, 380], [772, 480], [800, 580], [820, 640]], false, 8), { color: NV.line, w: 8 });
  [[780, 620], [820, 660], [850, 600]].forEach(([x, y]) => S.sh(null, circ(x, y, 12), { fill: NV.fill, line: NV.line, sw: 1.4 }));
  vs(S, null, [[800, 700], [840, 790], [840, 880]], 14, 16, V);
  S.pin(D('hypothalamus'), 'hyp', [720, 230]);
  S.pin(D('neurosecretory-cell'), 'nsc', [570, 180]);
  S.pin(D('pituitary-stalk'), 'stalk', [730, 400]);
  S.pin(D('anterior-pituitary'), 'ant', [560, 590]);
  S.pin(D('posterior-pituitary'), 'post', [830, 560]);
  S.pin(D('pars-intermedia'), 'pi', [709, 600]);
  S.pin(D('portal-system'), D('portal'), [670, 400]);
  S.pin(D('pituitary'), 'ant+post', [590, 500]);
}
plates.push({
  key: 'hypothalamus-pituitary-axis', moduleId: MOD, kind: 'tissue-schematic', lessons: ['endo-central-control'], purpose: 'Hypothalamus joined to the anterior pituitary by a portal blood route and to the posterior pituitary by a neural route.',
  title: ['Hypothalamus and pituitary: portal and neural links', 'Hipotálamo e hipófisis: conexión portal y neural'],
  desc: ['Schematic in the midline, anterior at viewer left. The hypothalamus (dusty rose, top) controls the pituitary in two different ways. Anterior pituitary: small neurosecretory cells in the hypothalamus release regulating hormones into a first capillary network at the base of the hypothalamus; short portal veins (blue) carry them down the stalk to a second capillary network in the anterior lobe, which makes its own hormones and releases them into blood. This is a blood (portal) connection, with no nerve fibres going to the anterior lobe. Posterior pituitary: large neurosecretory cells in the hypothalamus send long nerve fibres (ochre) down the stalk; the posterior lobe is nervous tissue that stores and releases the hormones those cells make (ADH and oxytocin) into capillaries. A thin pars intermedia lies between the lobes. Sizes and the number of cells are not to scale.',
    'Esquema en la línea media, anterior a la izquierda. El hipotálamo (rosa apagado, arriba) controla la hipófisis de dos maneras distintas. Adenohipófisis: pequeñas células neurosecretoras del hipotálamo liberan hormonas reguladoras en una primera red capilar en la base del hipotálamo; cortas venas porta (azul) las llevan por el tallo hasta una segunda red capilar en el lóbulo anterior, que fabrica sus propias hormonas y las libera a la sangre. Es una conexión sanguínea (portal), sin fibras nerviosas hacia el lóbulo anterior. Neurohipófisis: grandes células neurosecretoras del hipotálamo envían largas fibras nerviosas (ocre) por el tallo; el lóbulo posterior es tejido nervioso que almacena y libera en capilares las hormonas que esas células fabrican (ADH y oxitocina). Una fina pars intermedia queda entre los lóbulos. Tamaños y número de células no están a escala.'],
  orientation: ['midline sagittal schematic, anterior at viewer left, hypothalamus at top', 'esquema sagital medio, anterior a la izquierda, hipotálamo arriba'], draw: hypo,
});

// ------------------------------------------------------------ 3 thyroid / parathyroid
function thy(S) {
  S.panel(30, 30, 440, 940, 'ant'); S.panel(490, 30, 440, 940, 'post'); S.panel(950, 30, 470, 940, 'hist');
  S.at('ant');
  S.sh(null, sm([[170, 130], [250, 90], [330, 130], [326, 250], [170, 250]]), { fill: '#CAD7D6', line: '#6F8D8A', sw: 1.6 });
  S.sh(null, tube([[250, 250], [250, 900]], 64, 64), { fill: '#B4CFCB', line: '#4F7A74', sw: 1.6 });
  for (let y = 270; y < 900; y += 24) S.sh(null, RR(222, y, 56, 12, 4), { fill: '#CAD7D6', line: '#6F8D8A', sw: 1 });
  S.sh('lobe', E(180, 420, 56, 126, -8), { fill: GL.fill, line: GL.line, sw: 2 });
  S.sh('lobe', E(320, 420, 56, 126, 8), { fill: GL.fill, line: GL.line, sw: 2 });
  S.sh('isth', poly([[206, 440], [294, 440], [294, 490], [206, 490]]), { fill: '#D6C888', line: GL.line, sw: 2 });
  S.pin(D('thyroid'), 'lobe+isth', [180, 520]);
  S.pin(D('thyroid-lobe'), 'lobe', [160, 340]);
  S.pin(D('thyroid-isthmus'), 'isth', [250, 466]);
  S.at('post');
  S.sh(null, tube([[710, 120], [710, 900]], 70, 70), { fill: '#D9B9B3', line: '#8A6060', sw: 1.6 });
  S.sh(null, E(710, 420, 30, 126), { fill: '#D9B9B3', line: '#8A6060', sw: 0.5 });
  S.sh(null, E(634, 420, 56, 126, 8), { fill: GL.fill, line: GL.line, sw: 2 });
  S.sh(null, E(786, 420, 56, 126, -8), { fill: GL.fill, line: GL.line, sw: 2 });
  [[672, 356], [748, 356], [668, 486], [752, 486]].forEach(([x, y]) => S.sh('para', E(x, y, 16, 11, x < 710 ? 20 : -20), { fill: '#C9A85A', line: '#7F6A2E', sw: 1.6 }));
  S.pin(D('parathyroids'), 'para', [672, 356]);
  S.at('hist');
  // follicle
  S.sh(null, RR(970, 60, 430, 470, 14), { fill: '#EFE9E0', line: '#DCD3C6', sw: 1.2 });
  S.sh('fol', circ(1185, 290, 140), { fill: '#EFD6D0', line: '#9A6A66', sw: 1.4 });
  for (let i = 0; i < 12; i++) S.sh('fc', ring(1185, 290, 70, 104, (i * Math.PI) / 6, ((i + 1) * Math.PI) / 6, 3), { fill: '#E5B8B0', line: '#9A6A66', sw: 1.2 });
  S.sh('colloid', circ(1185, 290, 70), { fill: '#E8D9A8', line: '#B7A453', sw: 1.4 });
  S.sh('pf', sm([[1275, 372], [1316, 352], [1346, 384], [1330, 424], [1290, 424]], true, 4), { fill: '#EAD3C9', line: '#8A5C54', sw: 1.6 }); S.sh(null, circ(1318, 390, 10), { fill: '#A8855A', line: '#8A5C54', sw: 1 });
  [[1020, 160], [1360, 170], [1040, 470]].forEach(([x, y]) => S.sh(null, circ(x, y, 22), { fill: '#EFD6D0', line: '#9A6A66', sw: 1.2 }));
  S.pin(D('thyroid-follicle'), 'fol', [1185, 168]);
  S.pin(D('thyroid-colloid'), 'colloid', [1185, 300]);
  S.pin(D('follicular-cell'), 'fc', [1185, 214]);
  S.pin(D('parafollicular-cell'), 'pf', [1310, 400]);
  // parathyroid chief cells
  S.sh(null, RR(970, 550, 430, 400, 14), { fill: '#EFE9E0', line: '#DCD3C6', sw: 1.2 });
  const g = rng(8);
  [[1070, 660], [1150, 640], [1230, 670], [1310, 650], [1100, 740], [1190, 760], [1270, 740], [1350, 770], [1060, 840], [1150, 860], [1240, 850], [1320, 860]].forEach(([x, y]) => {
    const r = 34 + g() * 4; S.sh('chief', circ(x, y, r), { fill: '#E3C4BC', line: '#8A5C54', sw: 1.4 }); S.sh(null, circ(x + 4, y - 2, 11), { fill: '#A8855A', line: '#8A5C54', sw: 1 }); });
  vs(S, null, [[990, 700], [1100, 700], [1180, 710], [1380, 710]], 7, 7, CAP);
  S.pin(D('parathyroid-chief-cell'), 'chief', [1150, 640]);
}
plates.push({
  key: 'thyroid-parathyroid', moduleId: MOD, kind: 'gross-diagram', lessons: ['endo-thyroid-parathyroid'], purpose: 'Thyroid in front, parathyroids behind, thyroid follicle and parathyroid chief cells.',
  title: ['Thyroid and parathyroid glands', 'Glándulas tiroides y paratiroides'],
  desc: ['Left, front view of the neck: the thyroid is a butterfly-shaped gland of two lobes joined across the trachea by a narrow isthmus, below the larynx. Middle, back view: the four small parathyroid glands (ochre ovals) are embedded in the back of the thyroid lobes, two on each side, but are separate glands with a different job (calcium balance). Top right: a thyroid follicle, the working unit: a ring of follicular cells around a store of colloid; a larger parafollicular (C) cell sits between follicles. Bottom right: parathyroid chief cells in a cluster beside a capillary. Cell sizes are schematic.',
    'Izquierda, vista anterior del cuello: el tiroides es una glándula en forma de mariposa con dos lóbulos unidos sobre la tráquea por un istmo estrecho, bajo la laringe. Centro, vista posterior: las cuatro pequeñas paratiroides (óvalos ocre) están incluidas en la cara posterior de los lóbulos tiroideos, dos a cada lado, pero son glándulas distintas con otra función (equilibrio del calcio). Arriba a la derecha: un folículo tiroideo, la unidad funcional: un anillo de células foliculares alrededor de un depósito de coloide; una célula parafolicular (C) mayor se sitúa entre folículos. Abajo a la derecha: células principales paratiroideas agrupadas junto a un capilar. Los tamaños celulares son esquemáticos.'],
  orientation: ['left: anterior view; middle: posterior view; right: microscopic schematics', 'izquierda: vista anterior; centro: vista posterior; derecha: esquemas microscópicos'], draw: thy,
});

// ------------------------------------------------------------ 4 adrenal
function adr(S) {
  S.panel(30, 30, 600, 940, 'gross'); S.panel(650, 30, 770, 940, 'layers');
  S.at('gross');
  S.sh(null, E(330, 700, 190, 250), { fill: KID.fill, line: KID.line, sw: 2 });
  S.sh(null, E(190, 700, 40, 70), { fill: '#EFE6E2', line: KID.line, sw: 1.2 });
  const cap = sm([[210, 470], [330, 330], [450, 470], [420, 520], [330, 480], [240, 520]], true, 6);
  S.sh('cort', cap, { fill: GL.fill, line: GL.line, sw: 2 });
  S.sh('med', sm([[290, 440], [330, 380], [372, 440], [330, 462]], true, 4), { fill: '#C79B8A', line: '#8A6455', sw: 1.6 });
  S.pin(D('adrenal'), 'cort+med', [250, 490]);
  S.at('layers');
  S.sh('capsule', rect(680, 70, 710, 22), { fill: '#EDE3DA', line: '#B7A593', sw: 1.4 });
  S.sh('gl', rect(680, 92, 710, 120), { fill: '#E9D79E', line: GL.line, sw: 1.4 });
  for (let i = 0; i < 11; i++) { const x = 720 + i * 62; S.ln(null, `M${x - 26} 130Q${x} 100 ${x + 26} 130`, { color: GL.line, w: 4 }); S.ln(null, `M${x - 26} 160Q${x} 190 ${x + 26} 160`, { color: GL.line, w: 3, op: 0.6 }); }
  S.sh('fas', rect(680, 212, 710, 250), { fill: '#EBDDAE', line: GL.line, sw: 1.4 });
  for (let i = 0; i < 17; i++) { const x = 704 + i * 41; for (let k = 0; k < 6; k++) S.sh(null, E(x, 236 + k * 38, 15, 15), { fill: '#F2E8C6', line: GL.line, sw: 1.1 }); }
  S.sh('ret', rect(680, 462, 710, 150), { fill: '#E0C98E', line: GL.line, sw: 1.4 });
  const g = rng(2); for (let i = 0; i < 46; i++) { const x = 696 + g() * 678, y = 476 + g() * 120; S.sh(null, circ(x, y, 12), { fill: '#EDDDAA', line: GL.line, sw: 1 }); }
  S.sh('med', rect(680, 612, 710, 330), { fill: '#D8B3A4', line: '#8A6455', sw: 1.4 });
  [[760, 700], [880, 740], [1000, 690], [1130, 750], [1250, 700], [800, 860], [940, 840], [1080, 870], [1220, 850]].forEach(([x, y]) => { S.sh('chrom', E(x, y, 34, 30), { fill: '#E9CFC2', line: '#8A6455', sw: 1.4 }); S.sh(null, circ(x, y, 10), { fill: '#A8855A', line: '#8A6455', sw: 1 }); });
  vs(S, null, [[680, 790], [800, 780], [900, 800]], 14, 16, V);
  S.pin(D('adrenal-cortex'), 'gl+fas+ret', [1380, 300]);
  S.pin(D('zona-glomerulosa'), 'gl', [1330, 150]);
  S.pin(D('zona-fasciculata'), 'fas', [1370, 340]);
  S.pin(D('zona-reticularis'), 'ret', [1340, 540]);
  S.pin(D('adrenal-medulla'), 'med', [1360, 900]);
  S.pin(D('chromaffin-cell'), 'chrom', [880, 740]);
}
plates.push({
  key: 'adrenal-zones', moduleId: MOD, kind: 'tissue-schematic', lessons: ['endo-adrenal'], purpose: 'Adrenal gland on the kidney, with cortex zones and medulla in order.',
  title: ['Adrenal gland: cortex zones and medulla', 'Glándula suprarrenal: zonas corticales y médula'],
  desc: ['Left: the adrenal gland sits on top of the kidney (the kidney is retroperitoneal; the adrenal is above it, never below), with the yellow cortex around a darker inner medulla. Right: the layers from the surface inward, schematic. Under the thin capsule come the three cortical zones: zona glomerulosa (cells in rounded clusters; makes aldosterone), zona fasciculata (cells in long straight columns; cortisol) and zona reticularis (cells in a network; sex hormone precursors). Remember them from outside in as glomerulosa, fasciculata, reticularis. The medulla in the centre is a different tissue: large chromaffin cells that release adrenaline and noradrenaline, next to a central vein. Proportions are not to scale.',
    'Izquierda: la glándula suprarrenal se asienta sobre el riñón (el riñón es retroperitoneal; la suprarrenal queda por encima, nunca por debajo), con la corteza amarilla alrededor de una médula interna más oscura. Derecha: las capas de la superficie hacia dentro, esquemáticas. Bajo la fina cápsula están las tres zonas corticales: zona glomerular (células en grupos redondeados; produce aldosterona), zona fascicular (células en largas columnas rectas; cortisol) y zona reticular (células en red; precursores de hormonas sexuales). Del exterior al interior: glomerular, fascicular, reticular. La médula central es otro tejido: grandes células cromafines que liberan adrenalina y noradrenalina, junto a una vena central. Las proporciones no están a escala.'],
  orientation: ['left: adrenal on kidney, anterior view; right: layers, capsule at top and medulla at bottom', 'izquierda: suprarrenal sobre el riñón, vista anterior; derecha: capas, cápsula arriba y médula abajo'], draw: adr,
});

// ------------------------------------------------------------ 5 pancreas and islet
function panc(S) {
  S.panel(30, 30, 640, 940, 'gross'); S.panel(690, 30, 730, 940, 'islet');
  S.at('gross');
  S.sh(null, sm([[110, 520], [140, 330], [250, 220], [330, 280], [260, 420], [250, 560], [210, 640], [130, 620]]), { fill: '#E8D6C8', line: '#A8917C', sw: 1.8 });
  S.sh('panc', sm([[200, 440], [250, 420], [380, 370], [500, 300], [600, 250], [632, 290], [590, 340], [470, 410], [330, 470], [240, 520]], true, 6), { fill: GL.fill, line: GL.line, sw: 2 });
  S.sh('panc', sm([[190, 420], [240, 410], [255, 520], [225, 600], [170, 590], [150, 500]], true, 5), { fill: GL.fill, line: GL.line, sw: 2 });
  S.sh(null, sm([[560, 180], [650, 150], [660, 270], [600, 300]]), { fill: '#B79DB0', line: '#76566A', sw: 1.6 });
  S.ln(null, 'M200 500Q330 460 520 340', { color: '#B7A453', w: 5 });
  S.pin(D('pancreas'), 'panc', [420, 410]);
  S.at('islet');
  S.sh(null, RR(710, 60, 690, 880, 16), { fill: '#EFE9E0', line: '#DCD3C6', sw: 1.2 });
  // exocrine acini around, with a duct
  const ac = [[780, 150], [900, 120], [1040, 130], [1180, 140], [1320, 170], [770, 300], [790, 480], [770, 640], [800, 800], [940, 860], [1100, 860], [1260, 840], [1340, 700], [1330, 300], [1340, 480], [1360, 580]];
  ac.forEach(([x, y]) => { for (let k = 0; k < 7; k++) { const a = (k * Math.PI * 2) / 7; S.sh('acini', E(x + 38 * Math.cos(a), y + 38 * Math.sin(a), 24, 24), { fill: '#E9DAD0', line: '#A8817C', sw: 1.3 }); } S.sh(null, circ(x, y, 12), { fill: '#F4EDE5', line: '#A8817C', sw: 1 }); });
  vs(S, null, [[780, 910], [1000, 910], [1200, 900]], 18, 18, { fill: '#F4EDE5', line: '#A8817C' });
  S.arrow(1250, 910, 0, 14, '#8A949B');
  S.sh('isl', sm([[900, 380], [1010, 320], [1150, 340], [1230, 440], [1210, 600], [1100, 690], [960, 660], [890, 540]], true, 6), { fill: '#EADFE4', line: '#8A6070', sw: 2 });
  vs(S, null, [[920, 640], [1020, 560], [1100, 480], [1220, 400]], 12, 12, CAP);
  vs(S, null, [[900, 450], [1000, 480], [1120, 560], [1200, 620]], 10, 10, CAP);
  const g = rng(31), cells = [], first = {};
  for (let i = 0; i < 46; i++) {
    const x = 930 + g() * 280, y = 350 + g() * 320;
    const inside = (x - 1060) ** 2 / 150 ** 2 + (y - 510) ** 2 / 150 ** 2 < 0.78;
    if (!inside) continue;
    if (cells.some(([a, b]) => Math.hypot(a - x, b - y) < 36)) continue;
    const r = g(), t = r < 0.2 ? 'al' : r < 0.82 ? 'be' : 'de'; cells.push([x, y, t]); if (!first[t]) first[t] = [x, y];
  }
  const col = { al: '#D9A59A', be: '#9DB4C9', de: '#C7B3D6' }, ln = { al: '#8A5C54', be: '#4F6C86', de: '#6F6381' };
  if (!first.al) { first.al = [1180, 400]; cells.push([1180, 400, 'al']); } if (!first.de) { first.de = [960, 600]; cells.push([960, 600, 'de']); }
  cells.forEach(([x, y, t]) => { S.sh(t, circ(x, y, 17), { fill: col[t], line: ln[t], sw: 1.4 }); S.sh(null, circ(x, y, 6), { fill: ln[t], line: ln[t], sw: 0.5 }); });
  S.pin(D('pancreatic-islet'), 'isl', [915, 470]);
  S.pin(D('endocrine-gland'), 'isl', [1130, 640], { panel: 'islet' });
  S.pin(D('alpha-cell'), 'al', first.al);
  S.pin(D('beta-cell'), 'be', first.be);
  S.pin(D('delta-cell'), 'de', first.de);
  S.pin(D('exocrine-gland'), 'acini', [780, 320]);
}
plates.push({
  key: 'pancreas-islet', moduleId: MOD, kind: 'tissue-schematic', lessons: ['endo-pancreas-gonads', 'endo-gland-types'], purpose: 'Pancreas as one organ with two jobs: exocrine acini with a duct, and an endocrine islet with alpha, beta and delta cells.',
  title: ['Pancreas: exocrine acini and the endocrine islet', 'Páncreas: acinos exocrinos e islote endocrino'],
  desc: ['Left: the pancreas lies across the back of the upper abdomen, with its head tucked in the curve of the duodenum and its tail reaching the spleen (plum). Right: a microscopic schematic of the two parts of this one gland. Exocrine glands release their product through a duct onto a surface or into a cavity: the clusters of acinar cells around the edge make digestive enzymes that travel by the duct (bottom, arrow) to the duodenum. Endocrine glands have no duct and release hormones straight into blood: in the pale pancreatic islet (islet of Langerhans) alpha cells (rose) make glucagon, beta cells (blue; the most numerous) make insulin and delta cells (lilac; the fewest) make somatostatin, beside capillaries. The three cell types are mixed through the islet rather than in strict layers. Schematic; cell numbers and sizes simplified.',
    'Izquierda: el páncreas cruza la parte posterior del abdomen superior, con la cabeza en la curva del duodeno y la cola hacia el bazo (ciruela). Derecha: esquema microscópico de las dos partes de esta única glándula. Las glándulas exocrinas liberan su producto por un conducto a una superficie o cavidad: los grupos de células acinares del borde producen enzimas digestivas que viajan por el conducto (abajo, flecha) hasta el duodeno. Las glándulas endocrinas no tienen conducto y liberan hormonas directamente a la sangre: en el pálido islote pancreático (de Langerhans) las células alfa (rosa) producen glucagón, las beta (azul; las más numerosas) insulina y las delta (lila; las menos) somatostatina, junto a capilares. Los tres tipos celulares están mezclados por el islote, no en capas estrictas. Esquemático; número y tamaño de células simplificados.'],
  orientation: ['left: anterior view, head of pancreas at viewer left; right: microscopic schematic', 'izquierda: vista anterior, cabeza del páncreas a la izquierda; derecha: esquema microscópico'], draw: panc,
});

// ------------------------------------------------------------ 6 gonads
function gon(S) {
  S.panel(30, 30, 690, 940, 'ovary'); S.panel(740, 30, 680, 940, 'testis');
  S.at('ovary');
  S.sh('ovary', sm([[130, 520], [180, 300], [370, 190], [570, 290], [630, 540], [540, 780], [340, 860], [190, 740]], true, 6), { fill: '#E7D9B8', line: GL.line, sw: 2 });
  S.clipBoth(sm([[130, 520], [180, 300], [370, 190], [570, 290], [630, 540], [540, 780], [340, 860], [190, 740]], true, 6));
  [[230, 330, 16], [300, 270, 18], [470, 270, 20], [560, 360, 16]].forEach(([x, y, r]) => { S.sh(null, circ(x, y, r), { fill: '#F2EAD0', line: GL.line, sw: 1.3 }); S.sh(null, circ(x, y, r * 0.4), { fill: '#D9A59A', line: '#8A5C54', sw: 1 }); });
  [[190, 480, 36], [250, 640, 40]].forEach(([x, y, r]) => { S.sh(null, circ(x, y, r), { fill: '#F2EAD0', line: GL.line, sw: 1.3 }); S.sh(null, circ(x, y, r * 0.6), { fill: '#FAF4E0', line: GL.line, sw: 1 }); S.sh(null, circ(x, y, r * 0.22), { fill: '#D9A59A', line: '#8A5C54', sw: 1 }); });
  S.sh(null, circ(380, 470, 98), { fill: '#F2EAD0', line: GL.line, sw: 1.6 }); S.sh(null, circ(380, 470, 72), { fill: '#FAF4E0', line: GL.line, sw: 1.2 }); S.sh(null, circ(380, 470, 20), { fill: '#D9A59A', line: '#8A5C54', sw: 1.2 });
  S.sh('cl', sm([[470, 600], [540, 580], [590, 640], [580, 720], [510, 750], [450, 700]], true, 4), { fill: '#E3C98A', line: '#9A7C3A', sw: 2 });
  for (let k = 0; k < 4; k++) S.ln(null, `M${480 + k * 20} ${620 + k * 10}Q${520 + k * 14} ${660 - k * 8} ${500 + k * 18} ${720 - k * 6}`, { color: '#B79A52', w: 2.4 });
  S.sh(null, E(330, 740, 26, 20), { fill: '#EFE6D6', line: '#B7A593', sw: 1.4 });
  S.clipBothEnd();
  S.pin(D('ovary'), 'ovary', [260, 400]);
  S.pin(D('corpus-luteum'), 'cl', [520, 660]);
  S.at('testis');
  S.sh('testis', sm([[800, 300], [900, 150], [1080, 120], [1190, 210], [1210, 400], [1150, 520], [1000, 540], [850, 480]], true, 6), { fill: '#E7D9B8', line: GL.line, sw: 2 });
  S.clipBoth(sm([[800, 300], [900, 150], [1080, 120], [1190, 210], [1210, 400], [1150, 520], [1000, 540], [850, 480]], true, 6));
  [[860, 300], [900, 220], [960, 180], [1060, 170], [1140, 250], [1130, 400], [1020, 470], [900, 420]].forEach(([x, y]) => S.ln(null, `M${x} ${y}Q${x + 90} ${y + 40} ${1000} ${340}`, { color: '#B79A52', w: 6 }));
  S.sh(null, circ(1000, 340, 30), { fill: '#EFE6D6', line: '#B7A593', sw: 1.4 });
  S.clipBothEnd();
  // magnified tubule in cross-section with interstitium
  S.sh(null, RR(760, 570, 640, 380, 14), { fill: '#EFE9E0', line: '#DCD3C6', sw: 1.2 });
  S.sh(null, rect(770, 580, 620, 360), { fill: '#EBDDC5', line: '#EBDDC5', sw: 0.5 });
  const cx = 1010, cy = 760, R = 130;
  S.sh(null, circ(cx, cy, R + 14), { fill: '#CFC3A4', line: '#8B8168', sw: 1.4 });
  S.sh(null, circ(cx, cy, R), { fill: '#EAD7D0', line: '#9A6A66', sw: 1.2 });
  for (let i = 0; i < 6; i++) { const a = (i * Math.PI) / 3 + 0.3, x0 = cx + (R - 6) * Math.cos(a), y0 = cy + (R - 6) * Math.sin(a), x1 = cx + 54 * Math.cos(a + 0.12), y1 = cy + 54 * Math.sin(a + 0.12); S.sh('ser', tube([[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]], 36, 12), { fill: '#EAC9B6', line: '#8A5C54', sw: 1.4 }); S.sh(null, E(x0 - 18 * Math.cos(a), y0 - 18 * Math.sin(a), 11, 15, (a * 180) / Math.PI + 90), { fill: '#A8855A', line: '#8A5C54', sw: 1 }); }
  [[0.9, 0.55], [1.9, 0.55], [2.9, 0.55], [3.9, 0.55], [4.9, 0.55], [5.9, 0.55]].forEach(([a, f]) => S.sh(null, circ(cx + R * f * Math.cos(a), cy + R * f * Math.sin(a), 11), { fill: '#C9BFD8', line: '#6F6381', sw: 1 }));
  S.sh(null, circ(cx, cy, 36), { fill: '#F4EDE5', line: '#9A6A66', sw: 1 });
  [[1230, 700], [1290, 840], [1170, 900]].forEach(([x, y]) => { S.sh('ley', sm([[x - 40, y], [x - 10, y - 38], [x + 34, y - 30], [x + 46, y + 10], [x + 10, y + 40], [x - 28, y + 30]], true, 4), { fill: '#E6C7A0', line: '#8A6E3C', sw: 1.6 }); S.sh(null, circ(x + 4, y, 10), { fill: '#A8855A', line: '#8A6E3C', sw: 1 }); });
  vs(S, null, [[1370, 620], [1330, 760], [1360, 920]], 14, 14, CAP);
  S.pin(D('testis'), 'testis', [1000, 250]);
  S.pin(D('sertoli-cell'), 'ser', [cx + 80 * Math.cos(0.3), cy + 80 * Math.sin(0.3)]);
  S.pin(D('leydig-cell'), 'ley', [1230, 700]);
  void A; void MY;
}
plates.push({
  key: 'ovary-testis', moduleId: MOD, kind: 'tissue-schematic', lessons: ['endo-pancreas-gonads'], purpose: 'Ovary with follicles and corpus luteum; testis with seminiferous tubules (Sertoli cells) and Leydig cells in the interstitium.',
  title: ['Gonads: ovary and testis', 'Gónadas: ovario y testículo'],
  desc: ['Left: section of an ovary, schematic. Follicles at several stages sit in the stroma: small ones near the surface, then a large fluid-filled follicle. The corpus luteum (golden, folded body, lower right) forms from the follicle after ovulation and makes progesterone. Right, top: a testis in section, with coiled seminiferous tubules gathering towards the centre. Right, bottom: enlarged view of one tubule in cross-section and the tissue between tubules. The tall Sertoli cells (peach) lie inside the tubule wall among developing sperm cells and support them; the Leydig cells (ochre, in clusters) lie outside the tubules in the interstitium, beside capillaries, and make testosterone. Sizes and stages are simplified.',
    'Izquierda: corte esquemático de un ovario. Folículos en varias etapas están en el estroma: los pequeños cerca de la superficie y luego un gran folículo lleno de líquido. El cuerpo lúteo (cuerpo dorado y plegado, abajo a la derecha) se forma a partir del folículo tras la ovulación y produce progesterona. Derecha, arriba: un testículo en corte, con túbulos seminíferos enrollados que convergen hacia el centro. Derecha, abajo: vista ampliada de un túbulo en corte transversal y del tejido entre túbulos. Las altas células de Sertoli (melocotón) están en la pared del túbulo entre las células espermáticas en desarrollo y las sostienen; las células de Leydig (ocre, en grupos) están fuera de los túbulos, en el intersticio, junto a capilares, y producen testosterona. Tamaños y etapas simplificados.'],
  orientation: ['left: ovary section; right: testis section above, tubule and interstitium enlarged below', 'izquierda: corte de ovario; derecha: corte de testículo arriba, túbulo e intersticio ampliados abajo'], draw: gon,
});
void sm; void E; void tube;
