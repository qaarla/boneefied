// BVIS04 nervous plates 7-12: roots/rami, plexuses, upper limb, lower limb, CN I-VI, CN VII-XII.
import { C, sm, poly, E, RR, tube, along } from './bvis04-lib.mjs';

const MOD = 'nervous-system';
export const plates = [];
const NV = { fill: C.nerve, line: C.nerveLn };
const MUTE = { fill: '#DDD7C6', line: '#ABA494' };

// ---------------------------------------------------------------- 7 spinal roots and rami
function rootsRami(S) {
  S.panel(30, 30, 1390, 940, 'axial');
  const cx = 725;
  S.sh(null, tube([[cx, 250], [cx, 110]], 44, 34), { fill: C.bone, line: C.boneLn, sw: 1.6 });
  S.sh(null, tube([[640, 330], [520, 300], [430, 290]], 40, 28), { fill: C.bone, line: C.boneLn, sw: 1.6 });
  S.sh(null, tube([[810, 330], [930, 300], [1020, 290]], 40, 28), { fill: C.bone, line: C.boneLn, sw: 1.6 });
  S.sh(null, E(cx, 640, 170, 118), { fill: C.bone, line: C.boneLn, sw: 1.8 });
  S.sh(null, E(cx, 385, 175, 150), { fill: C.bone, line: C.boneLn, sw: 1.8 });
  S.sh(null, E(cx, 385, 108, 100), { fill: '#E4EAEF', line: '#6F8D9A', sw: 1.6 });
  S.sh(null, E(cx - 188, 470, 40, 30, 20), { fill: C.paper, line: C.boneLn, sw: 1.2, dash: '4 3' });
  S.sh('spinal-cord', E(cx, 385, 58, 48), { fill: C.white, line: C.whiteLn, sw: 2 });
  S.sh(null, sm([[cx - 38, 372], [cx - 12, 382], [cx, 392], [cx + 12, 382], [cx + 38, 372], [cx + 34, 405], [cx, 418], [cx - 34, 405]]), { fill: C.gray, line: C.brainLn, sw: 1 });
  const mirror = (s) => (p) => [cx + s * (p[0] - cx), p[1]];
  for (const s of [-1, 1]) {
    const m = mirror(s), L = s > 0;
    const root = (id, pts, w, st) => (L ? S.tb(id, pts.map(m), w, w, st) : S.tb(null, pts.map(m), w, w, st));
    root('dorsal-root', [[cx - 34, 350], [cx - 80, 350], [cx - 128, 372]], 11, NV);
    (L ? S.sh.bind(S, 'dorsal-root-ganglion') : S.sh.bind(S, null))(E(cx + s * -165, 388, 36, 22, 40 * -s), { fill: '#E3C46E', line: C.nerveLn, sw: 2 });
    root('ventral-root', [[cx - 36, 420], [cx - 90, 435], [cx - 130, 420]], 11, { fill: C.nerve2, line: C.nerveLn });
    S.tb(null, [[cx + s * -196, 400], [cx + s * -225, 430], [cx + s * -250, 462]], 16, 18, NV);
    S.tb(L ? 'dorsal-ramus' : null, [[cx + s * -250, 462], [cx + s * -285, 400], [cx + s * -320, 330], [cx + s * -335, 240], [cx + s * -330, 170]], 12, 9, NV);
    S.tb(L ? 'ventral-ramus' : null, [[cx + s * -250, 462], [cx + s * -300, 520], [cx + s * -330, 610], [cx + s * -320, 740], [cx + s * -270, 830]], 15, 11, { fill: C.nerve2, line: C.nerveLn });
  }
  S.pin('spinal-cord', 'spinal-cord', [cx, 385]);
  S.pin('dorsal-root', 'dorsal-root', [cx - 80, 350]);
  S.pin('ventral-root', 'ventral-root', [cx - 90, 435]);
  S.pin('dorsal-root-ganglion', 'dorsal-root-ganglion', [cx - 165, 388]);
  S.pin('dorsal-ramus', 'dorsal-ramus', [cx - 330, 300]);
  S.pin('ventral-ramus', 'ventral-ramus', [cx - 325, 640]);
}
plates.push({
  key: 'spinal-roots-rami', moduleId: MOD, kind: 'gross-diagram', lessons: ['spinal-cord'], purpose: 'How a spinal nerve forms from roots and splits into dorsal and ventral rami.',
  title: ['Spinal nerve: roots, ganglion and rami', 'Nervio espinal: raíces, ganglio y ramos'],
  desc: ['Axial view of one vertebra and its cord segment, posterior at the top. The dorsal (sensory) root swells into the dorsal root ganglion, the ventral (motor) root joins it beyond the ganglion to form the short mixed spinal nerve in the intervertebral foramen, and the nerve at once divides into a small dorsal ramus to the back and a larger ventral ramus to the body wall and limbs. Drawn on both sides; labelled on the viewer-left side. Gross diagram, simplified.',
    'Vista axial de una vértebra y su segmento medular, con la parte posterior arriba. La raíz dorsal (sensitiva) se engrosa en el ganglio de la raíz dorsal, la raíz ventral (motora) se une a ella más allá del ganglio y forma el corto nervio espinal mixto en el agujero intervertebral; el nervio se divide enseguida en un ramo dorsal pequeño para la espalda y un ramo ventral mayor para la pared del cuerpo y las extremidades. Se dibuja en ambos lados; marcado en el lado izquierdo de la imagen. Diagrama macroscópico simplificado.'],
  orientation: ['axial view from above; posterior at top; labels on viewer-left side', 'vista axial desde arriba; posterior arriba; marcadores en el lado izquierdo de la imagen'], draw: rootsRami,
});

// ---------------------------------------------------------------- 8 plexus overview
function plexusOverview(S) {
  S.panel(30, 30, 1390, 940, 'overview');
  const cx = 725;
  const skin = { fill: '#E8DCCD', line: '#B7A593', sw: 1.6 };
  const mir = (pts) => pts.map(([x, y]) => [2 * cx - x, y]);
  S.sh(null, E(cx, 95, 56, 66), skin);
  const torso = [[648, 190], [560, 215], [505, 255], [500, 330], [515, 480], [530, 620], [545, 760], [905, 760], [920, 620], [935, 480], [950, 330], [945, 255], [890, 215], [802, 190]];
  S.sh(null, sm(torso), skin);
  [-1, 1].forEach((s) => {
    S.sh(null, tube([[cx + s * 215, 240], [cx + s * 320, 400], [cx + s * 395, 590]], 85, 62), skin);
    S.sh(null, tube([[cx + s * 100, 740], [cx + s * 118, 860], [cx + s * 115, 985]], 135, 80), skin);
  });
  S.sh(null, E(cx, 482, 150, 44), { fill: '#D7B7B2', line: '#8A6060', sw: 1.6 });
  S.sh('spinal-cord', tube([[cx, 135], [cx, 560], [cx, 770], [cx, 795]], 34, 14), { fill: C.white, line: C.whiteLn, sw: 1.6 });
  S.sh(null, E(cx, 800, 11, 8), { fill: C.white, line: C.whiteLn, sw: 1.2 });
  const web = (id, color, starts, hub, ends, rw = 9) => {
    const o = { fill: color, line: C.nerveLn, sw: 1.2 };
    starts.forEach((p) => S.tb(id, [[cx - 14, p], [(cx + hub[0]) / 2, (p + hub[1]) / 2 + 6], hub], rw, rw + 2, o));
    ends.forEach((e) => S.tb(id, [hub, ...e], rw + 4, rw + 1, o));
  };
  const hubC = [636, 188], hubB = [585, 262], hubL = [612, 596], hubS = [640, 712];
  web('cervical-plexus', '#9FB9CC', [140, 154, 168, 182], hubC, [[[600, 140]], [[580, 178]], [[598, 224]]], 7);
  web('brachial-plexus', '#E2C66E', [208, 222, 236, 250, 262], hubB, [[[535, 295], [492, 350]], [[525, 285], [450, 330], [420, 410]], [[540, 305], [470, 380], [440, 470]]], 8);
  web('lumbar-plexus', '#A9C6A0', [566, 580, 594, 608], hubL, [[[585, 660], [575, 760], [595, 880]]], 8);
  web('sacral-plexus', '#E0B2AA', [640, 656, 672, 688], hubS, [[[630, 800], [618, 900], [615, 975]]], 8);
  S.tb('phrenic-nerve', [[630, 190], [650, 270], [655, 380], [648, 470]], 11, 9, { fill: '#7FA6BE', line: '#3E6579' });
  S.pin('spinal-cord', 'spinal-cord', [cx, 330]);
  S.pin('cervical-plexus', 'cervical-plexus', [596, 190]);
  S.pin('brachial-plexus', 'brachial-plexus', [578, 262]);
  S.pin('phrenic-nerve', 'phrenic-nerve', [655, 380]);
  S.pin('lumbar-plexus', 'lumbar-plexus', [608, 598]);
  S.pin('sacral-plexus', 'sacral-plexus', [640, 715]);
}
plates.push({
  key: 'plexus-overview', moduleId: MOD, kind: 'gross-diagram', lessons: ['plexuses-peripheral'], purpose: 'Where the four major plexuses sit on the cord and which region each serves; phrenic nerve to the diaphragm.',
  title: ['The four major plexuses and the phrenic nerve', 'Los cuatro plexos principales y el nervio frénico'],
  desc: ['Schematic body with the spinal cord down the midline. Ventral rami from neighbouring segments reshuffle into plexuses: cervical (neck, C1-C4), brachial (upper limb, C5-T1), lumbar (front of the thigh, L1-L4) and sacral (back of the thigh, leg and foot, L4-S4). The phrenic nerve arises mainly from C3-C5 in the cervical plexus and runs down the thorax to the diaphragm. Plexuses are drawn on the patient right (viewer left) only; roots and branches are simplified, not exact fascicles. Schematic, not to scale.',
    'Cuerpo esquemático con la médula espinal en la línea media. Los ramos ventrales de segmentos vecinos se reorganizan en plexos: cervical (cuello, C1-C4), braquial (miembro superior, C5-T1), lumbar (cara anterior del muslo, L1-L4) y sacro (cara posterior del muslo, pierna y pie, L4-S4). El nervio frénico nace sobre todo de C3-C5 en el plexo cervical y desciende por el tórax hasta el diafragma. Los plexos se dibujan solo en el lado derecho del paciente (izquierda del observador); raíces y ramos simplificados, no son fascículos exactos. Esquema sin escala.'],
  orientation: ['anterior-style body schematic; patient right at viewer left; plexuses drawn on patient right only; cord shown in the midline', 'esquema corporal tipo vista anterior; derecha del paciente a la izquierda del observador; plexos solo en el lado derecho del paciente'], draw: plexusOverview,
});

// ---------------------------------------------------------------- 9 upper limb nerves
function limbBase(S, ox, post) {
  const sk = { fill: '#E8DCCD', line: '#B7A593', sw: 1.6 };
  S.sh(null, tube([[ox + 400, 160], [ox + 385, 330], [ox + 375, 470]], 150, 112), sk);
  S.sh(null, tube([[ox + 375, 470], [ox + 365, 620], [ox + 358, 760]], 108, 66), sk);
  S.sh(null, sm([[ox + 322, 760], [ox + 395, 758], [ox + 405, 860], [ox + 385, 930], [ox + 335, 930], [ox + 318, 860]]), sk);
  S.sh(null, tube([[ox + 405, 130], [ox + 392, 330], [ox + 385, 462]], 30, 36), { fill: '#EFE8D6', line: '#B9AF98', sw: 1.2, op: 0.9 });
  S.sh(null, tube([[ox + 380, 470], [ox + 360, 620], [ox + 352, 745]], 20, 16), { fill: '#EFE8D6', line: '#B9AF98', sw: 1.2 });
  S.sh(null, tube([[ox + 366, 470], [ox + 342, 620], [ox + 332, 745]], 16, 14), { fill: '#EFE8D6', line: '#B9AF98', sw: 1.2 });
  void post;
}
function upperLimb(S) {
  S.panel(30, 30, 690, 940, 'anterior');
  S.panel(740, 30, 680, 940, 'posterior');
  limbBase(S, 0, false);
  limbBase(S, 720, true);
  const MED = { fill: '#E3C46E', line: C.nerveLn };
  // anterior panel (right arm anterior: lateral at viewer left)
  S.sh('brachial-plexus', sm([[372, 100], [440, 92], [480, 128], [452, 176], [400, 168], [366, 140]]), { fill: '#E2C66E', line: C.nerveLn, sw: 1.6 });
  S.tb('median-nerve', [[420, 170], [410, 300], [400, 430], [392, 500], [383, 640], [372, 760], [366, 840]], 11, 8, MED);
  S.tb('ulnar-nerve', [[452, 170], [458, 300], [455, 400], [448, 452], [430, 560], [408, 690], [398, 780], [398, 850]], 10, 7, { fill: '#E0B879', line: C.nerveLn });
  S.tb(null, [[352, 215], [330, 320]], 10, 10, { fill: '#E3C46E', line: C.nerveLn });
  S.ln(null, 'M350 210 Q330 260 334 330', { color: C.nerveLn, w: 2.4, dash: '5 4' });
  S.tb('radial-nerve', [[334, 330], [338, 400], [335, 470], [326, 560], [322, 680], [325, 745]], 10, 7, { fill: '#D6A25A', line: C.nerveLn });
  // posterior panel
  const o = 720;
  S.sh(null, sm([[o + 372, 100], [o + 440, 92], [o + 480, 128], [o + 452, 176], [o + 400, 168], [o + 366, 140]]), { fill: '#E2C66E', line: C.nerveLn, sw: 1.6 });
  S.tb('radial-nerve-p', [[o + 430, 180], [o + 408, 240], [o + 372, 300], [o + 340, 360], [o + 332, 420], [o + 336, 470]], 12, 9, { fill: '#D6A25A', line: C.nerveLn });
  S.tb('radial-nerve-p', [[o + 336, 470], [o + 343, 560], [o + 346, 650], [o + 348, 740]], 9, 6, { fill: '#D6A25A', line: C.nerveLn });
  S.ln(null, `M${o + 430} 178 Q${o + 400} 200 ${o + 380} 250`, { color: C.nerveLn, w: 2, dash: '5 4', op: 0.0 });
  S.sh(null, E(o + 442, 470, 14, 12), { fill: '#E3D5C6', line: '#B7A593', sw: 1.2 });
  S.at('anterior');
  S.pin('brachial-plexus', 'brachial-plexus', [425, 135]);
  S.pin('median-nerve', 'median-nerve', [400, 430]);
  S.pin('ulnar-nerve', 'ulnar-nerve', [455, 330]);
  S.pin('radial-nerve', 'radial-nerve', [338, 400]);
  S.at('posterior'); S.pin('radial-nerve', 'radial-nerve-p', [o + 360, 320]);
}
plates.push({
  key: 'upper-limb-nerves', moduleId: MOD, kind: 'gross-diagram', lessons: ['plexuses-peripheral'], purpose: 'Course of the median, ulnar and radial nerves from the brachial plexus into the right arm and forearm.',
  title: ['Median, ulnar and radial nerves of the right upper limb', 'Nervios mediano, cubital y radial del miembro superior derecho'],
  desc: ['Right arm in two panels with the bones faintly shown. Anterior panel: the median nerve runs down the middle of the arm and forearm to the hand; the ulnar nerve runs along the medial side and passes behind the medial epicondyle (elbow); the radial nerve, which spends the upper arm behind the humerus, emerges on the lateral side near the elbow (dashed = behind the bone). Posterior panel: the radial nerve winds from medial to lateral behind the humerus and continues in the posterior forearm. Courses are simplified. Gross diagram.',
    'Brazo derecho en dos paneles con los huesos tenuemente visibles. Panel anterior: el nervio mediano desciende por el centro del brazo y antebrazo hasta la mano; el nervio cubital recorre el lado medial y pasa por detrás del epicóndilo medial (codo); el nervio radial, que en el brazo queda detrás del húmero, emerge por el lado lateral cerca del codo (discontinuo = detrás del hueso). Panel posterior: el nervio radial rodea el húmero de medial a lateral por detrás y continúa en el antebrazo posterior. Trayectos simplificados. Diagrama macroscópico.'],
  orientation: ['right upper limb; anterior panel (patient right = viewer left, lateral at left) and posterior panel (lateral at left in this drawing)', 'miembro superior derecho; panel anterior (lateral a la izquierda) y panel posterior'], draw: upperLimb,
});

// ---------------------------------------------------------------- 10 lower limb nerves
function legBase(S, ox) {
  const sk = { fill: '#E8DCCD', line: '#B7A593', sw: 1.6 };
  S.sh(null, tube([[ox + 400, 90], [ox + 392, 300], [ox + 385, 470]], 230, 140), sk);
  S.sh(null, tube([[ox + 385, 470], [ox + 378, 700], [ox + 372, 890]], 125, 68), sk);
  S.sh(null, sm([[ox + 335, 890], [ox + 405, 888], [ox + 470, 930], [ox + 480, 965], [ox + 330, 965]]), sk);
  S.sh(null, tube([[ox + 405, 100], [ox + 392, 300], [ox + 388, 465]], 36, 34), { fill: '#EFE8D6', line: '#B9AF98', sw: 1.2 });
  S.sh(null, tube([[ox + 388, 475], [ox + 376, 700], [ox + 372, 885]], 24, 18), { fill: '#EFE8D6', line: '#B9AF98', sw: 1.2 });
}
function lowerLimb(S) {
  S.panel(30, 30, 690, 940, 'anterior');
  S.panel(740, 30, 680, 940, 'posterior');
  legBase(S, 0); legBase(S, 720);
  const o = 720, F = { fill: '#A9C6A0', line: '#4F7A4F' }, Sc = { fill: '#E0B2AA', line: '#8A5A52' };
  S.sh('lumbar-plexus', sm([[355, 62], [440, 55], [490, 90], [460, 130], [390, 125]]), { fill: '#A9C6A0', line: '#4F7A4F', sw: 1.6 });
  S.tb('femoral-nerve', [[440, 120], [432, 210], [415, 330], [400, 430], [390, 480]], 14, 9, F);
  [[[425, 250], [380, 310]], [[418, 300], [440, 360]], [[408, 360], [372, 410]]].forEach((b) => S.tb('femoral-nerve', [[b[0][0], b[0][1]], b[1]], 6, 4, F));
  S.tb('femoral-nerve', [[390, 480], [372, 590], [366, 720], [362, 860]], 8, 5, F);
  S.sh('sacral-plexus', sm([[o + 355, 62], [o + 440, 55], [o + 490, 90], [o + 460, 130], [o + 390, 125]]), { fill: '#E0B2AA', line: '#8A5A52', sw: 1.6 });
  S.tb('sciatic-nerve', [[o + 440, 120], [o + 436, 250], [o + 420, 390], [o + 405, 470]], 18, 14, Sc);
  S.tb(null, [[o + 405, 470], [o + 392, 600], [o + 385, 780], [o + 380, 880]], 9, 6, Sc);
  S.tb(null, [[o + 405, 470], [o + 360, 520], [o + 330, 600], [o + 345, 680]], 8, 5, Sc);
  S.at('anterior');
  S.pin('lumbar-plexus', 'lumbar-plexus', [430, 92]);
  S.pin('femoral-nerve', 'femoral-nerve', [415, 330]);
  S.pin('sacral-plexus', 'sacral-plexus', [o + 430, 92]);
  S.pin('sciatic-nerve', 'sciatic-nerve', [o + 428, 320]);
}
plates.push({
  key: 'lower-limb-nerves', moduleId: MOD, kind: 'gross-diagram', lessons: ['plexuses-peripheral'], purpose: 'Femoral nerve to the front of the thigh and sciatic nerve down the back of the thigh.',
  title: ['Femoral and sciatic nerves of the right lower limb', 'Nervios femoral e isquiático del miembro inferior derecho'],
  desc: ['Right lower limb in two panels. Anterior panel: the femoral nerve leaves the lumbar plexus, runs down the front of the thigh giving branches to the quadriceps and continues below the knee as a thin medial cutaneous branch. Posterior panel: the sciatic nerve, the thickest nerve in the body, leaves the sacral plexus, runs down the back of the thigh and divides near the knee into its tibial and common fibular parts (unlabelled). Courses simplified. Gross diagram.',
    'Miembro inferior derecho en dos paneles. Panel anterior: el nervio femoral sale del plexo lumbar, desciende por la cara anterior del muslo dando ramos al cuádriceps y continúa bajo la rodilla como fino ramo cutáneo medial. Panel posterior: el nervio isquiático, el más grueso del cuerpo, sale del plexo sacro, desciende por la cara posterior del muslo y se divide cerca de la rodilla en sus partes tibial y fibular común (sin marcador). Trayectos simplificados. Diagrama macroscópico.'],
  orientation: ['right lower limb; anterior panel then posterior panel; bones faint', 'miembro inferior derecho; panel anterior y panel posterior; huesos tenues'], draw: lowerLimb,
});

// ---------------------------------------------------------------- 11-12 cranial nerves on the inferior brain
// Paths are [dx, y] with dx measured outward from the midline; each runs from its brainstem origin to a ring cue at the skull-base exit side.
const CN = [
  { n: 'i', w: 4, p: [[70, 112], [70, 94], [70, 78]], t: 0.45 },
  { n: 'ii', w: 16, p: [[22, 376], [90, 342], [170, 306], [240, 286]], t: 0.55, ring: true },
  { n: 'iii', w: 9, p: [[14, 470], [80, 430], [190, 382], [322, 340]], t: 0.45, ring: true },
  { n: 'iv', w: 6, p: [[100, 515], [170, 474], [250, 410], [324, 350]], t: 0.45 },
  { n: 'v', w: 19, p: [[88, 606], [130, 584], [190, 560]], t: 0.4 },
  { n: 'vi', w: 7, p: [[22, 668], [26, 610], [40, 548], [70, 500], [150, 440], [250, 392], [326, 358]], t: 0.2 },
  { n: 'vii', w: 9, p: [[64, 646], [140, 626], [225, 590], [300, 556], [372, 548]], t: 0.55, ring: true },
  { n: 'viii', w: 12, p: [[68, 674], [145, 666], [228, 636], [305, 604], [376, 588]], t: 0.55 },
  { n: 'ix', w: 8, p: [[44, 712], [120, 708], [220, 716], [330, 724], [385, 728]], t: 0.55, ring: true },
  { n: 'x', w: 8, p: [[42, 738], [120, 754], [220, 766], [330, 772], [385, 770]], t: 0.55 },
  { n: 'xi', w: 8, p: [[40, 778], [120, 802], [220, 802], [330, 798], [385, 790]], t: 0.55 },
  { n: 'xii', w: 7, p: [[26, 750], [50, 800], [110, 842], [200, 872], [262, 888]], t: 0.55, ring: true },
];
const V_BR = [[[205, 556], [290, 500], [360, 455], [405, 430]], [[205, 566], [300, 536], [370, 512], [420, 500]]];
const ROMAN = { i: 'cranial-nerve-i', ii: 'cranial-nerve-ii', iii: 'cranial-nerve-iii', iv: 'cranial-nerve-iv', v: 'cranial-nerve-v', vi: 'cranial-nerve-vi', vii: 'cranial-nerve-vii', viii: 'cranial-nerve-viii', ix: 'cranial-nerve-ix', x: 'cranial-nerve-x', xi: 'cranial-nerve-xi', xii: 'cranial-nerve-xii' };
function cnBase(S, group) {
  S.panel(30, 30, 1390, 940, 'inferior');
  const cx = 725, X = (s) => ([dx, y]) => [cx + s * dx, y];
  const hp = [[0, 125], [40, 90], [120, 85], [205, 125], [255, 215], [268, 330], [295, 420], [300, 510], [270, 585], [205, 612], [150, 575], [112, 505], [80, 470], [60, 455]];
  [-1, 1].forEach((s) => {
    const cb = E(cx + s * 150, 760, 155, 112, s * 10);
    S.sh(null, cb, { fill: '#C3AAB3', line: C.brainLn, sw: 2 });
    S.squig(cb, cx - 320, 650, cx + 320, 880, 9, 4, { seed: 9 });
  });
  const full = [...hp.map(X(1)), ...hp.slice(1, -1).reverse().map(X(-1))];
  const cer = sm([...hp.map(X(1)), [cx, 450], ...hp.slice().reverse().map(X(-1))].filter((_, i, a) => i < a.length), true, 6);
  void full;
  S.sh(null, cer, { fill: '#DCC9CF', line: C.brainLn, sw: 2.4 });
  S.squig(cer, cx - 300, 90, cx + 300, 610, 10, 6, { seed: 21, vert: true });
  S.out.push(`<path d="M${cx - 62} 140V300M${cx + 62} 140V300" stroke="${C.brainLn}" stroke-width="1.6" fill="none" opacity="0.8"/>`);
  S.out.push(`<path d="M${cx} 125V330" stroke="${C.brainLn}" stroke-width="2.2" fill="none"/>`);
  S.sh(null, sm([[cx - 70, 430], [cx - 40, 420], [cx - 10, 440], [cx, 455], [cx + 10, 440], [cx + 40, 420], [cx + 70, 430], [cx + 75, 500], [cx + 55, 540], [cx - 55, 540], [cx - 75, 500]]), { fill: '#D4B8AE', line: C.brainLn, sw: 2 });
  S.sh(null, sm([[cx - 75, 540], [cx + 75, 540], [cx + 100, 590], [cx + 95, 640], [cx + 60, 668], [cx - 60, 668], [cx - 95, 640], [cx - 100, 590]]), { fill: '#D9C4A8', line: C.brainLn, sw: 2 });
  S.sh(null, sm([[cx - 62, 668], [cx + 62, 668], [cx + 58, 720], [cx + 50, 800], [cx + 36, 900], [cx - 36, 900], [cx - 50, 800], [cx - 58, 720]]), { fill: '#C9BFD2', line: C.brainLn, sw: 2 });
  S.sh(null, tube([[cx, 895], [cx, 985]], 62, 56), { fill: C.white, line: C.whiteLn, sw: 2 });
  [-1, 1].forEach((s) => { S.sh(null, E(cx + s * 38, 748, 14, 30), { fill: '#BDB2C8', line: C.brainLn, sw: 1.2 }); S.out.push(`<path d="M${cx + s * 12} 680V890" stroke="${C.brainLn}" stroke-width="1.2" opacity="0.7"/>`); });
  S.sh(null, E(cx, 470 + 0, 8, 12), { fill: C.paper, line: C.brainLn, sw: 1 });
  // optic chiasm and spinal root of XI
  S.sh('optic-chiasm-sense', E(cx, 372, 34, 15), { fill: '#EAD58A', line: C.nerveLn, sw: 1.8 });
  S.tb(null, [[cx - 20, 380], [cx - 60, 430], [cx - 82, 500]], 11, 9, MUTE);
  S.tb(null, [[cx + 20, 380], [cx + 60, 430], [cx + 82, 500]], 11, 9, MUTE);
  const cue = (x, y) => S.sh(null, E(x, y, 11, 11), { fill: C.paper, line: C.nerveLn, sw: 1.4, dash: '3 3' });
  const nerve = (id, pts, w, st, ring) => { S.tb(id, pts, w, Math.max(4, w - 3), st); S.sh(id, E(pts[0][0], pts[0][1], w / 2 + 1, w / 2 + 1), st); if (ring) cue(...pts[pts.length - 1]); };
  const spinal = [[40, 960], [48, 880], [120, 828], [220, 803]];
  S.tb(group.includes('xi') ? 'cranial-nerve-xi' : null, spinal.map(X(-1)), 6, 6, group.includes('xi') ? NV : MUTE);
  for (const s of [-1, 1]) {
    for (const nv of CN) {
      const on = group.includes(nv.n) && s < 0, pts = nv.p.map(X(s));
      const st = on ? { fill: nv.n === 'viii' ? '#D9B060' : C.nerve, line: C.nerveLn } : MUTE;
      const id = on ? ROMAN[nv.n] : null;
      if (nv.n === 'v') { nerve(id, pts, nv.w, st); S.sh(id, E(cx + s * 192, 560, 26, 20, -25 * s), st); V_BR.forEach((b, k) => nerve(id, b.map(X(s)), 8 - k, st, true)); }
      else if (nv.n === 'i') {
        // olfactory bulb and tract are CNS (unlabelled); CN I itself is the fila olfactoria entering the bulb through the cribriform cue
        const bst = s < 0 ? { fill: '#DDD7C6', line: '#ABA494' } : MUTE;
        S.sh(null, E(cx + s * 70, 150, 24, 40), bst); S.tb(null, [[70, 170], [66, 230], [62, 295]].map(X(s)), 12, 8, bst);
        S.sh(null, RR(cx + s * 70 - 40, 70, 80, 10, 4), { fill: C.bone, line: C.boneLn, sw: 1.2, dash: '3 3' });
        for (let k = -3; k <= 3; k++) S.tb(id, [[70 + k * 4, 112 - Math.abs(k)], [70 + k * 8, 92], [70 + k * 11, 72]].map(X(s)), 4, 3, st);
      }
      else nerve(id, pts, nv.w, st, true);
    }
  }
}
const pinsA = ['i', 'ii', 'iii', 'iv', 'v', 'vi'], pinsB = ['vii', 'viii', 'ix', 'x', 'xi', 'xii'];
const cnPins = (S, list) => list.forEach((n) => { const nv = CN.find((c) => c.n === n); const q = along(nv.p, nv.t); S.pin(ROMAN[n], ROMAN[n], [725 - q[0], q[1]]); });
plates.push({
  key: 'cranial-nerves-i-vi', moduleId: MOD, kind: 'gross-diagram', lessons: ['cranial-nerves'], purpose: 'Cranial nerves I to VI on the base of the brain.',
  title: ['Cranial nerves I-VI, inferior surface of the brain', 'Nervios craneales I-VI, superficie inferior del encéfalo'],
  desc: ['Base of the brain seen from below, frontal lobes at the top, with the first six cranial nerves marked on the viewer-left side (the right side repeats them in pale tone). I olfactory nerve, the many thin fila that pass up through the cribriform plate (dashed bar) into the olfactory bulb (the bulb and tract, drawn unlabelled in pale tone, are brain tissue, not part of the nerve); II optic nerve meeting at the optic chiasm; III from the groove between the midbrain peduncles; IV, the thin trochlear nerve, at the side of the midbrain; V trigeminal, the large root at the pons with its ganglion and three divisions; VI abducens at the pontomedullary junction. Each nerve runs continuously from its brainstem origin outward; the dashed ring at the end of a nerve is only a cue that it leaves through the skull base (III, IV, V1 and VI converge on one ring because they share the superior orbital fissure). Selected schematic origin cues, not a dissection and not a complete map of the skull foramina. Nerves VII-XII appear pale for context. Gross diagram, curricular level.',
    'Base del encéfalo vista desde abajo, con los lóbulos frontales arriba y los seis primeros nervios craneales marcados en el lado izquierdo de la imagen (el lado derecho los repite en tono pálido). I nervio olfatorio, los numerosos filetes finos que atraviesan la lámina cribosa (barra discontinua) hacia el bulbo olfatorio (el bulbo y el tracto, sin marcador y en tono pálido, son tejido encefálico, no parte del nervio); II nervio óptico que confluye en el quiasma óptico; III desde el surco entre los pedúnculos del mesencéfalo; IV, el delgado nervio troclear, al lado del mesencéfalo; V trigémino, la gran raíz en la protuberancia con su ganglio y tres divisiones; VI abducens en la unión pontobulbar. Cada nervio recorre de forma continua desde su origen en el tronco; el anillo discontinuo del extremo solo indica que sale por la base del cráneo (III, IV, V1 y VI convergen en un anillo porque comparten la fisura orbitaria superior). Señales esquemáticas seleccionadas del origen, no una disección ni un mapa completo de los forámenes craneales. Los nervios VII-XII aparecen pálidos como contexto. Diagrama macroscópico de nivel curricular.'],
  orientation: ['inferior view of the brain; frontal at top; labels on viewer-left nerves; selected origin cues, nerves end at skull-base ring cues', 'vista inferior del encéfalo; frontal arriba; marcadores en los nervios del lado izquierdo; señales de origen seleccionadas, los nervios terminan en anillos de salida de la base craneal'],
  draw: (S) => { cnBase(S, ['i', 'ii', 'iii', 'iv', 'v', 'vi']); cnPins(S, pinsA); S.pin('optic-chiasm-sense', 'optic-chiasm-sense', [725, 372]); },
});
plates.push({
  key: 'cranial-nerves-vii-xii', moduleId: MOD, kind: 'gross-diagram', lessons: ['cranial-nerves', 'special-senses-integration'], purpose: 'Cranial nerves VII to XII at the pontomedullary junction and medulla.',
  title: ['Cranial nerves VII-XII, brainstem and cerebellopontine angle', 'Nervios craneales VII-XII, tronco encefálico y ángulo pontocerebeloso'],
  desc: ['Base of the brain seen from below with cranial nerves VII to XII marked on the viewer-left side. VII facial and VIII vestibulocochlear leave together at the pontomedullary angle (VIII is the thicker, lateral one); IX glossopharyngeal, X vagus and XI accessory leave in line along the side of the medulla, with the spinal root of XI rising along the cord; XII hypoglossal emerges between pyramid and olive. Each nerve runs continuously from its origin outward; the dashed ring at the end of a nerve is only a cue that it leaves through the skull base (VII and VIII share the internal acoustic meatus; IX, X and XI the jugular foramen). Selected schematic origin cues, not a dissection and not a complete map of the skull foramina. Nerves I-VI appear pale for context. Gross diagram, curricular level.',
    'Base del encéfalo vista desde abajo con los nervios craneales VII a XII marcados en el lado izquierdo de la imagen. VII facial y VIII vestibulococlear salen juntos en el ángulo pontobulbar (el VIII es el más grueso y lateral); IX glosofaríngeo, X vago y XI accesorio salen alineados a lo largo del lado del bulbo, con la raíz espinal del XI ascendiendo junto a la médula; XII hipogloso emerge entre la pirámide y la oliva. Cada nervio recorre de forma continua desde su origen hacia fuera; el anillo discontinuo del extremo solo indica que sale por la base del cráneo (VII y VIII comparten el meato acústico interno; IX, X y XI el foramen yugular). Señales esquemáticas seleccionadas del origen, no una disección ni un mapa completo de los forámenes craneales. Los nervios I-VI aparecen pálidos como contexto. Diagrama macroscópico de nivel curricular.'],
  orientation: ['inferior view of the brain; frontal at top; labels on viewer-left nerves; selected origin cues, nerves end at skull-base ring cues', 'vista inferior del encéfalo; frontal arriba; marcadores en los nervios del lado izquierdo; señales de origen seleccionadas, los nervios terminan en anillos de salida de la base craneal'],
  draw: (S) => { cnBase(S, ['vii', 'viii', 'ix', 'x', 'xi', 'xii']); cnPins(S, pinsB); },
});
void RR; void poly;
