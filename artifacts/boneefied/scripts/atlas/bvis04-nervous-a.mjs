// BVIS04 nervous system plates 1-6: brain lateral/medial, deep nuclei, brainstem, CSF/meninges, spinal cross-section.
import { C, W, H, cr, sm, poly, E, RR, tube, along } from './bvis04-lib.mjs';

const MOD = 'nervous-system';
const LOBE = { frontal: '#DCC7C0', parietal: '#CBD2BF', temporal: '#BFCDD4', occipital: '#CFC2D5' };
const LOBE_LN = '#7C6670';

export const plates = [];

// ---------------------------------------------------------------- 1 brain lateral
const V = [[110, 430], [130, 330], [200, 255], [300, 205], [420, 180], [520, 172], [650, 195], [715, 228], [795, 300], [850, 400], [838, 480], [790, 525], [720, 548], [640, 575], [560, 597], [470, 600], [390, 582], [330, 552], [300, 530], [285, 497], [200, 480], [140, 458]];
const Sd = cr(V, true, 8);
const arcS = (i, j) => { const out = []; let k = i * 8; const end = j * 8, n = Sd.length; for (;;) { out.push(Sd[k % n]); if (k % n === end % n && out.length > 1) break; k++; } return out; };
const LSd = cr([V[19], [360, 478], [452, 452], [540, 425], [620, 398]], false, 8);
const CSd = cr([V[5], [505, 230], [485, 300], [470, 370], [452, 452]], false, 8);
const POd = cr([V[7], [725, 300], [735, 380], [740, 450], [728, 500], V[12]], false, 8);
const TBd = cr([[620, 398], [680, 430], [740, 450]], false, 8);
const rev = (a) => [...a].reverse();
const lobes = {
  frontal: [...arcS(19, 5), ...CSd.slice(1), ...rev(LSd.slice(0, 17)).slice(1)],
  parietal: [...arcS(5, 7), ...POd.slice(1, 25), ...rev(TBd).slice(1), ...rev(LSd.slice(16)).slice(1), ...rev(CSd).slice(1)],
  occipital: [...arcS(7, 12), ...rev(POd).slice(1)],
  temporal: [...arcS(12, 19), ...LSd.slice(1), ...TBd.slice(1), ...POd.slice(24)],
};
function brainLateral(S) {
  S.panel(30, 30, 950, 940, 'lateral');
  // cerebellum and brainstem sit behind / below the cerebrum
  const cbl = sm([[600, 612], [680, 585], [780, 575], [850, 595], [885, 645], [855, 700], [775, 728], [685, 722], [628, 690]]);
  S.sh('cerebellum', cbl, { fill: '#C3AAB3', line: LOBE_LN });
  S.squig(cbl, 600, 590, 890, 730, 9, 5, { seed: 3 });
  S.sh(null, poly(cr([[500, 575], [600, 590], [620, 700], [610, 820], [560, 905], [500, 900], [490, 780], [470, 650]], true, 6)), { fill: '#D2BEC4', line: LOBE_LN });
  S.sh(null, RR(500, 880, 70, 90, 8), { fill: C.white, line: C.whiteLn });
  S.sh('cerebellum', cbl, { fill: '#C3AAB3', line: LOBE_LN });
  S.squig(cbl, 600, 590, 890, 730, 9, 5, { seed: 3 });
  for (const k of Object.keys(lobes)) {
    const d = poly(lobes[k]);
    S.sh(k, d, { fill: LOBE[k], line: LOBE_LN, sw: 2 });
    const bb = lobes[k]; const xs = bb.map((p) => p[0]), ys = bb.map((p) => p[1]);
    S.squig(d, Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), 10, 10, { seed: k.length * 5 });
  }
  S.out.push(`<path d="${poly(LSd, false)}" fill="none" stroke="${LOBE_LN}" stroke-width="3" stroke-linecap="round"/>`);
  S.out.push(`<path d="${poly(CSd, false)}" fill="none" stroke="${LOBE_LN}" stroke-width="2.4" stroke-linecap="round"/>`);
  S.out.push(`<path d="${poly(Sd)}" fill="none" stroke="${LOBE_LN}" stroke-width="2.4"/>`);
  // locator ring over the lateral sulcus
  S.out.push(`<circle cx="410" cy="470" r="78" fill="none" stroke="${C.ink}" stroke-width="2" stroke-dasharray="7 6"/>`);
  S.out.push(`<path d="M480 440Q760 120 1000 170" fill="none" stroke="${C.ink}" stroke-width="1.6" stroke-dasharray="7 6"/>`);
  // inset: lateral sulcus opened to show the insula
  S.panel(1010, 40, 410, 520, 'insula-inset');
  const fo = sm([[1030, 190], [1090, 110], [1210, 70], [1300, 100], [1330, 150], [1260, 200], [1150, 215], [1070, 230]]);
  const po = sm([[1330, 150], [1400, 190], [1410, 280], [1380, 330], [1310, 300], [1290, 230], [1260, 200]]);
  const to = sm([[1040, 420], [1090, 380], [1190, 395], [1290, 380], [1370, 400], [1390, 470], [1300, 520], [1170, 540], [1070, 500]]);
  S.sh(null, E(1215, 300, 190, 150), { fill: C.csf, line: LOBE_LN });
  S.sh(null, fo, { fill: LOBE.frontal, line: LOBE_LN, sw: 2 });
  S.sh(null, po, { fill: LOBE.parietal, line: LOBE_LN, sw: 2 });
  S.sh(null, to, { fill: LOBE.temporal, line: LOBE_LN, sw: 2 });
  const ins = sm([[1080, 320], [1150, 240], [1250, 250], [1330, 300], [1290, 360], [1200, 370], [1120, 360]]);
  S.sh('insula', ins, { fill: '#B8D0C8', line: '#4F7A74', sw: 2.2 });
  S.squig(ins, 1080, 240, 1330, 370, 6, 5, { seed: 11, color: '#4F7A74', vert: true });
  S.out.push(`<path d="${poly(cr([[1160, 250], [1210, 310], [1250, 365]], false, 6), false)}" fill="none" stroke="#4F7A74" stroke-width="2.2"/>`);
  S.at('lateral');
  S.pin('cerebrum', 'frontal+parietal+temporal+occipital', [330, 275]);
  S.pin('frontal-lobe', 'frontal', [215, 370]);
  S.pin('parietal-lobe', 'parietal', [600, 270]);
  S.pin('temporal-lobe', 'temporal', [450, 540]);
  S.pin('occipital-lobe', 'occipital', [800, 410]);
  S.pin('insula', 'insula', [1210, 310], { panel: 'insula-inset' });
}
plates.push({
  key: 'brain-lateral', replaces: 'asset-servier-brain-lateral', moduleId: MOD, kind: 'gross-diagram', lessons: ['brain-lobes'], purpose: 'Lobes of the cerebrum on the lateral surface, with the deep insula in a labelled inset.',
  title: ['Brain, lateral surface: lobes and insula', 'Encéfalo, superficie lateral: lóbulos e ínsula'],
  desc: ['Left cerebral hemisphere seen from the side, frontal pole to the left. The central sulcus separates frontal from parietal lobe, the lateral sulcus separates temporal lobe from the two above it, and an occipital boundary closes the posterior lobe; cerebellum sits below the occipital lobe. The dashed ring marks the lateral sulcus; the inset shows it opened, with the insula buried at its floor under the frontal, parietal and temporal opercula. Gross diagram with simplified gyri.',
    'Hemisferio cerebral izquierdo visto de lado, con el polo frontal a la izquierda. El surco central separa el lóbulo frontal del parietal, el surco lateral separa el lóbulo temporal de los dos superiores y un límite occipital cierra el lóbulo posterior; el cerebelo queda bajo el occipital. El círculo discontinuo marca el surco lateral; el recuadro lo muestra abierto, con la ínsula en su fondo bajo los opérculos frontal, parietal y temporal. Diagrama macroscópico con giros simplificados.'],
  orientation: ['left lateral view; frontal pole at viewer left; right inset is the lateral sulcus opened (opercula retracted)', 'vista lateral izquierda; polo frontal a la izquierda del observador; el recuadro derecho muestra el surco lateral abierto (opérculos separados)'], draw: brainLateral,
});

// ---------------------------------------------------------------- stem model shared by plates 2 and 4 (local coords of plate 2)
export function stem(S, o = {}) {
  const cbl = sm([[905, 650], [980, 625], [1070, 640], [1130, 690], [1125, 760], [1060, 805], [970, 810], [905, 780], [885, 720]]);
  S.sh('cerebellum', cbl, { fill: '#C3AAB3', line: C.brainLn, sw: 2 });
  S.clip(cbl);
  for (let i = 0; i < 9; i++) S.out.push(`<path d="${E(1000, 725, 125 - i * 13, 95 - i * 10, 0).replace(/Z$/, '')}" fill="none" stroke="${C.brainLn}" stroke-width="1" opacity="0.5"/>`);
  S.clipEnd();
  const trunk = [[935, 735], [990, 725], [1030, 715]];
  const branches = [[trunk[2], [1075, 690], [1105, 700]], [trunk[2], [1085, 735], [1110, 745]], [trunk[1], [1030, 770], [1050, 795]], [trunk[1], [1000, 680], [1010, 650]], [trunk[0], [950, 775], [965, 795]], [trunk[2], [1060, 665], [1070, 650]]];
  S.tb('arbor-vitae', trunk, 26, 18, { fill: C.white, line: C.whiteLn });
  branches.forEach((b) => S.tb('arbor-vitae', b, 15, 5, { fill: C.white, line: C.whiteLn }));
  if (o.cord) S.sh('spinal-cord', tube([[858, 925], [858, 1010], [860, 1100]], 54, 50), { fill: C.white, line: C.whiteLn, sw: 2 });
  const mid = sm([[760, 590], [850, 575], [885, 625], [870, 680], [800, 690], [765, 640]]);
  const pons = sm([[770, 690], [810, 680], [880, 685], [895, 745], [870, 785], [800, 785], [758, 745]]);
  const med = sm([[805, 785], [875, 785], [895, 860], [890, 935], [840, 935], [825, 860]]);
  S.sh('midbrain', mid, { fill: '#D4B8AE', line: C.brainLn, sw: 2 });
  S.sh('pons', pons, { fill: '#D9C4A8', line: C.brainLn, sw: 2 });
  S.sh('medulla-oblongata', med, { fill: '#C9BFD2', line: C.brainLn, sw: 2 });
  S.sh('fourth-ventricle', sm([[880, 665], [930, 705], [912, 770], [890, 790], [878, 735]]), { fill: C.csf, line: C.csfLn, sw: 1.6 });
  S.tb('cerebral-aqueduct', [[703, 560], [780, 600], [840, 640], [885, 668]], 11, 11, { fill: C.csf, line: C.csfLn });
}
const mkTxt = (a, b) => [a, b];

function brainMedial(S) {
  S.panel(30, 30, 1390, 940, 'sagittal');
  const cx = sm([[300, 440], [325, 345], [400, 265], [520, 212], [660, 190], [800, 192], [930, 222], [1030, 285], [1085, 370], [1100, 450], [1075, 520], [1010, 550], [920, 545], [830, 535], [760, 545], [690, 560], [600, 555], [500, 540], [400, 515], [325, 485]]);
  S.sh('cerebrum', cx, { fill: '#DCC9CF', line: C.brainLn, sw: 2.4 });
  S.squig(cx, 300, 200, 1100, 540, 11, 9, { seed: 5 });
  stem(S);
  S.sh('thalamus', E(775, 450, 92, 60, -6), { fill: '#C3AEBC', line: C.brainLn, sw: 2 });
  S.sh('hypothalamus', sm([[648, 540], [690, 565], [765, 570], [772, 598], [730, 618], [680, 612], [650, 582]]), { fill: '#D2A9A9', line: C.brainLn, sw: 2 });
  S.sh('third-ventricle', sm([[648, 420], [676, 412], [692, 460], [700, 520], [712, 555], [690, 565], [660, 540], [645, 490]]), { fill: C.csf, line: C.csfLn, sw: 1.6 });
  S.sh('lateral-ventricle', tube([[530, 425], [600, 385], [720, 362], [840, 378], [930, 430], [950, 490], [900, 525]], 20, 30), { fill: C.csf, line: C.csfLn, sw: 1.8 });
  S.sh('corpus-callosum', tube([[520, 470], [468, 430], [480, 385], [560, 340], [690, 312], [830, 318], [930, 350], [985, 400], [975, 445]], 32, 46), { fill: C.white, line: C.whiteLn, sw: 2 });
  S.sh('epithalamus', E(882, 497, 22, 14, 20), { fill: '#B9A7C9', line: C.brainLn, sw: 1.8 });
  // optic chiasm and pituitary (unlabelled landmarks)
  S.sh(null, E(668, 604, 24, 9, 10), { fill: '#E3D5A8', line: C.whiteLn, sw: 1.2 });
  S.sh(null, tube([[700, 618], [706, 645], [704, 662]], 7, 7), { fill: '#E3D5A8', line: C.whiteLn, sw: 1 });
  S.sh(null, E(700, 676, 22, 14), { fill: '#D6C3A0', line: C.whiteLn, sw: 1.2 });
  S.pin('cerebrum', 'cerebrum', [420, 330]);
  S.pin('corpus-callosum', 'corpus-callosum', [690, 312]);
  S.pin('lateral-ventricle', 'lateral-ventricle', [840, 378]);
  S.pin('thalamus', 'thalamus', [790, 450]);
  S.pin('third-ventricle', 'third-ventricle', [690, 470]);
  S.pin('hypothalamus', 'hypothalamus', [715, 590]);
  S.pin('epithalamus', 'epithalamus', [882, 497]);
  S.pin('cerebral-aqueduct', 'cerebral-aqueduct', [800, 620]);
  S.pin('fourth-ventricle', 'fourth-ventricle', [905, 725]);
  S.pin('midbrain', 'midbrain', [820, 640]);
  S.pin('pons', 'pons', [820, 730]);
  S.pin('medulla-oblongata', 'medulla-oblongata', [850, 870]);
  S.pin('cerebellum', 'cerebellum', [1090, 780]);
}
plates.push({
  key: 'brain-medial', replaces: 'asset-servier-brain-sagittal', moduleId: MOD, kind: 'gross-diagram', lessons: ['brain-lobes', 'deep-brain', 'ventricles-csf', 'brainstem-cerebellum'], purpose: 'Midsagittal brain: corpus callosum, diencephalon, ventricular chain and brainstem.',
  title: ['Brain, midsagittal view: callosum, diencephalon, ventricles', 'Encéfalo, corte sagital medio: cuerpo calloso, diencéfalo y ventrículos'],
  desc: ['Medial face of the brain, frontal lobe to the left. The corpus callosum arches over the diencephalon: thalamus above, hypothalamus below, with the pineal body (epithalamus) behind. The third ventricle lies between the two halves of the diencephalon; the cerebral aqueduct crosses the midbrain to the fourth ventricle between pons and cerebellum. The thin septum pellucidum is cut away so the left lateral ventricle can be seen. Gross diagram, simplified.',
    'Cara medial del encéfalo, con el lóbulo frontal a la izquierda. El cuerpo calloso se arquea sobre el diencéfalo: tálamo arriba, hipotálamo abajo y cuerpo pineal (epitálamo) detrás. El tercer ventrículo queda entre las dos mitades del diencéfalo; el acueducto cerebral cruza el mesencéfalo hasta el cuarto ventrículo, entre la protuberancia y el cerebelo. Se retira el delgado tabique pelúcido para ver el ventrículo lateral izquierdo. Diagrama macroscópico simplificado.'],
  orientation: ['midsagittal cut, medial surface; frontal pole at viewer left; septum pellucidum cut away to show the lateral ventricle', 'corte sagital medio, superficie medial; polo frontal a la izquierda; tabique pelúcido retirado para mostrar el ventrículo lateral'], draw: brainMedial,
});

// ---------------------------------------------------------------- 3 deep nuclei coronal
function half(S, s, pin) {
  const X = (dx) => 725 + s * dx, k = (n) => (pin ? n : n + '-L');
  const rot = (r) => r * s;
  // internal capsule
  S.sh(null, tube([[X(170), 295], [X(160), 360], [X(140), 430], [X(120), 480]], 34, 26), { fill: '#F1EDE2', line: C.whiteLn, sw: 1 });
  S.sh(k('thalamus'), E(X(88), 448, 74, 56, rot(-6)), { fill: '#C3AEBC', line: C.brainLn, sw: 2 });
  S.sh(k('hypothalamus'), E(X(48), 548, 44, 42), { fill: '#D2A9A9', line: C.brainLn, sw: 2 });
  S.sh(k('lateral-ventricle'), sm([[X(14), 305], [X(100), 300], [X(128), 340], [X(112), 395], [X(70), 400], [X(30), 372]]), { fill: C.csf, line: C.csfLn, sw: 1.8 });
  S.sh(k('caudate-nucleus'), E(X(120), 345, 22, 44, rot(12)), { fill: '#A99FB4', line: C.brainLn, sw: 2 });
  S.sh(k('globus-pallidus'), E(X(192), 430, 24, 50, rot(-8)), { fill: '#BDB3C6', line: C.brainLn, sw: 2 });
  S.sh(k('putamen'), E(X(240), 420, 36, 72, rot(-12)), { fill: '#A99FB4', line: C.brainLn, sw: 2 });
  if (pin) {
    S.pin('thalamus', 'thalamus', [X(88), 450]); S.pin('hypothalamus', 'hypothalamus', [X(48), 548]); S.pin('lateral-ventricle', 'lateral-ventricle', [X(70), 335]);
    S.pin('caudate-nucleus', 'caudate-nucleus', [X(122), 340]); S.pin('globus-pallidus', 'globus-pallidus', [X(192), 425]); S.pin('putamen', 'putamen', [X(244), 430]);
    S.pin('basal-nuclei', 'caudate-nucleus+globus-pallidus+putamen', [X(215), 475]);
  }
}
function deepNuclei(S) {
  S.panel(30, 30, 1390, 940, 'coronal');
  const hp = [[0, 100], [125, 108], [245, 150], [345, 230], [405, 330], [425, 430], [410, 520], [375, 590], [315, 640], [245, 655], [175, 640], [110, 690], [60, 730], [0, 745]];
  const full = [...hp.map(([x, y]) => [725 + x, y]), ...[...hp].reverse().slice(1, -1).map(([x, y]) => [725 - x, y])];
  const outer = sm(full), cxs = full.map(([x, y]) => [725 + (x - 725) * 0.93, 430 + (y - 430) * 0.92]);
  S.sh(null, outer, { fill: '#BDB0B9', line: C.brainLn, sw: 2.4 });
  S.sh(null, sm(cxs), { fill: C.white, line: C.whiteLn, sw: 1.2 });
  for (const s of [-1, 1]) {
    S.sh(null, poly([[725 + s * 440, 440], [725 + s * 392, 466], [725 + s * 440, 486]]), { fill: C.csf, line: C.csfLn, sw: 1.2 });
    S.sh(s < 0 ? 'insula' : 'insula-L', E(725 + s * 366, 470, 26, 56), { fill: '#B8D0C8', line: '#4F7A74', sw: 2 });
  }
  S.sh('corpus-callosum', tube([[570, 300], [660, 268], [725, 262], [790, 268], [880, 300]], 30, 30), { fill: '#F1EDE2', line: C.whiteLn, sw: 1.6 });
  for (const s of [-1, 1]) half(S, s, s < 0);
  S.sh(null, RR(718, 300, 14, 95, 3), { fill: '#E4E0D6', line: C.whiteLn, sw: 1 });
  S.sh('third-ventricle', sm([[711, 395], [739, 395], [736, 520], [738, 590], [725, 610], [712, 590], [714, 520]]), { fill: C.csf, line: C.csfLn, sw: 1.6 });
  S.out.push(`<path d="M725 100V262" stroke="${C.brainLn}" stroke-width="2.2"/>`);
  S.pin('corpus-callosum', 'corpus-callosum', [660, 268]);
  S.pin('third-ventricle', 'third-ventricle', [725, 500]);
  S.pin('insula', 'insula', [359, 470]);
}
plates.push({
  key: 'deep-nuclei', moduleId: MOD, kind: 'gross-diagram', lessons: ['deep-brain'], purpose: 'Coronal slice showing the basal nuclei, thalamus and hypothalamus relative to the ventricles.',
  title: ['Deep brain nuclei, coronal slice', 'Núcleos profundos del encéfalo, corte coronal'],
  desc: ['Frontal (coronal) slice through both hemispheres at the level of the lateral ventricles and third ventricle. On the left of the image: caudate nucleus bulging into the lateral ventricle, internal capsule (pale band), globus pallidus and putamen lateral to it, then thalamus beside the third ventricle with hypothalamus below. Basal nuclei is the group name for caudate, putamen and globus pallidus. The right half of the slice is drawn without labels. Gross diagram, simplified.',
    'Corte frontal (coronal) de ambos hemisferios a la altura de los ventrículos laterales y del tercer ventrículo. A la izquierda de la imagen: núcleo caudado que protruye en el ventrículo lateral, cápsula interna (banda clara), globo pálido y putamen lateral a ella, después el tálamo junto al tercer ventrículo con el hipotálamo debajo. Núcleos basales es el nombre del grupo formado por caudado, putamen y globo pálido. La mitad derecha del corte se dibuja sin marcadores. Diagrama macroscópico simplificado.'],
  orientation: ['coronal slice viewed from the front; patient right is at viewer left; labelled structures are on the viewer-left side', 'corte coronal visto de frente; derecha del paciente a la izquierda del observador; las estructuras marcadas están a la izquierda de la imagen'], draw: deepNuclei,
});

// ---------------------------------------------------------------- 4 brainstem + cerebellum
const T = (x, y) => [x * 1.6 - 694, y * 1.6 - 836];
function brainstem(S) {
  S.panel(30, 30, 1390, 940, 'sagittal');
  S.beginT(-694, -836, 1.6);
  S.sh(null, tube([[690, 640], [740, 780], [790, 925]], 24, 20), { fill: C.bone, line: C.boneLn, sw: 1.4 });
  S.sh(null, tube([[1170, 700], [1160, 850], [1050, 930], [925, 955]], 24, 20), { fill: C.bone, line: C.boneLn, sw: 1.4 });
  S.sh(null, tube([[925, 1000], [1000, 1010]], 22, 22), { fill: C.bone, line: C.boneLn, sw: 1.4 });
  stem(S, { cord: true });
  S.endT();
  S.pin('midbrain', 'midbrain', T(820, 640));
  S.pin('pons', 'pons', T(820, 730));
  S.pin('medulla-oblongata', 'medulla-oblongata', T(850, 870));
  S.pin('cerebellum', 'cerebellum', T(1090, 780));
  S.pin('arbor-vitae', 'arbor-vitae', T(1040, 715));
  S.pin('fourth-ventricle', 'fourth-ventricle', T(905, 725));
  S.pin('spinal-cord', 'spinal-cord', T(858, 1060));
}
plates.push({
  key: 'brainstem-cerebellum', moduleId: MOD, kind: 'gross-diagram', lessons: ['brainstem-cerebellum', 'spinal-cord'], purpose: 'Brainstem levels, cerebellar white-matter tree and continuity with the spinal cord.',
  title: ['Brainstem, cerebellum and spinal cord, midsagittal', 'Tronco encefálico, cerebelo y médula espinal, corte sagital'],
  desc: ['Midsagittal enlargement with the cerebrum removed. Midbrain, pons and medulla stack from top to bottom; the pons bulges anteriorly. The cerebellum lies behind with the fourth ventricle between; its central white matter branches like a tree (arbor vitae). The medulla continues through the foramen magnum, between the clivus in front and the occipital bone behind, as the spinal cord. Gross diagram, simplified.',
    'Ampliación sagital media sin el cerebro. Mesencéfalo, protuberancia y bulbo se apilan de arriba abajo; la protuberancia sobresale anteriormente. El cerebelo queda detrás, con el cuarto ventrículo entre ambos; su sustancia blanca central se ramifica como un árbol (árbol de la vida). El bulbo continúa a través del foramen magno, entre el clivus por delante y el hueso occipital por detrás, como médula espinal. Diagrama macroscópico simplificado.'],
  orientation: ['midsagittal view; anterior at viewer left; cerebrum removed; bone at the foramen magnum is unlabelled context', 'vista sagital media; anterior a la izquierda; cerebro retirado; el hueso en el foramen magno es contexto sin marcador'], draw: brainstem,
});

// ---------------------------------------------------------------- 5 CSF and meninges
function csfMeninges(S) {
  S.panel(30, 30, 690, 940, 'ventricles');
  S.panel(740, 30, 680, 940, 'meninges');
  const cx = sm([[110, 520], [130, 380], [220, 260], [360, 210], [500, 215], [620, 280], [680, 400], [660, 520], [610, 600], [520, 640], [420, 650], [330, 610], [230, 590], [150, 570]]);
  S.sh(null, cx, { fill: '#E3D7DB', line: C.brainLn, sw: 2 });
  S.sh(null, E(500, 640, 150, 90, 0), { fill: '#D2BEC4', line: C.brainLn, sw: 2 });
  S.sh(null, tube([[400, 620], [430, 760], [480, 900], [490, 960]], 80, 50), { fill: C.white, line: C.whiteLn, sw: 2 });
  S.sh('lateral-ventricle', tube([[240, 430], [300, 385], [400, 360], [500, 375], [570, 425], [585, 480], [540, 545], [480, 575], [430, 560]], 34, 34), { fill: C.csf, line: C.csfLn, sw: 1.8 });
  S.sh('lateral-ventricle', tube([[570, 430], [640, 455]], 26, 14), { fill: C.csf, line: C.csfLn, sw: 1.8 });
  S.sh('third-ventricle', sm([[335, 400], [370, 400], [380, 470], [392, 540], [360, 548], [342, 480]]), { fill: C.csf, line: C.csfLn, sw: 1.6 });
  S.tb('cerebral-aqueduct', [[378, 535], [420, 572], [465, 610]], 11, 11, { fill: C.csf, line: C.csfLn });
  S.sh('fourth-ventricle', sm([[460, 600], [510, 640], [498, 695], [470, 670]]), { fill: C.csf, line: C.csfLn, sw: 1.6 });
  S.sh(null, tube([[484, 690], [490, 790], [494, 940]], 8, 8), { fill: C.csf, line: C.csfLn, sw: 1 });
  const tufts = [[405, 375], [435, 368], [470, 369], [505, 378], [535, 398], [558, 425], [570, 465], [556, 510], [532, 548], [500, 566], [465, 568], [352, 405], [358, 440], [490, 625], [478, 650]];
  tufts.forEach(([x, y], i) => S.sh('choroid-plexus', E(x, y, 11, 10), { fill: '#C98C8E', line: '#7E4A49', sw: 1.2 }));
  [[355, 440, 90], [420, 556, 40], [540, 410, 60], [440, 580, 35]].forEach(([x, y, a]) => S.arrow(x, y, a, 11));
  S.at('ventricles');
  S.pin('lateral-ventricle', 'lateral-ventricle', [300, 392]);
  S.pin('third-ventricle', 'third-ventricle', [366, 505]);
  S.pin('cerebral-aqueduct', 'cerebral-aqueduct', [420, 572]);
  S.pin('fourth-ventricle', 'fourth-ventricle', [488, 655]);
  S.pin('choroid-plexus', 'choroid-plexus', [558, 428]);
  // meninges panel: vertex coronal section
  const cx0 = 1080, cy0 = 640, P = (r, a) => [cx0 + r * Math.cos((a * Math.PI) / 180), cy0 - r * Math.sin((a * Math.PI) / 180)];
  const ann = (r0, r1, a0, a1) => { const pts = []; for (let a = a0; a <= a1; a += 2) pts.push(P(r1, a)); for (let a = a1; a >= a0; a -= 2) pts.push(P(r0, a)); return poly(pts); };
  S.sh(null, ann(290, 340, 18, 162), { fill: C.skin, line: C.skinLn, sw: 1.6 });
  S.sh(null, ann(300, 322, 18, 162), { fill: C.bone, line: C.boneLn, sw: 1.4 });
  S.sh('dura-mater', ann(276, 292, 18, 162), { fill: '#A9B8C9', line: '#4F6C86', sw: 1.6 });
  S.sh('subarachnoid', ann(250, 276, 18, 162), { fill: C.csf, line: C.csfLn, sw: 0.8 });
  const pia = []; for (let a = 18; a <= 162; a += 1.5) pia.push(P(250 + 5 * Math.sin(a * 0.9), a));
  const cortex = poly([...pia, P(120, 162), P(120, 18)]);
  S.sh(null, cortex, { fill: '#BDB0B9', line: C.brainLn, sw: 1 });
  S.sh(null, ann(120, 232, 18, 162), { fill: C.white, line: C.whiteLn, sw: 0.8 });
  S.sh(null, poly([[1064, 390], [1096, 390], [1096, 470], [1064, 470]]), { fill: C.csf, line: C.csfLn, sw: 0.8 });
  S.sh(null, poly([[1077, 340], [1083, 340], [1083, 470], [1077, 470]]), { fill: '#A9B8C9', line: '#4F6C86', sw: 1 });
  S.sh(null, poly([[1052, 350], [1108, 350], [1080, 385]]), { fill: C.blue, line: C.blueLn, sw: 1.4 });
  S.sh(null, poly([[1128, 360], [1124, 350], [1140, 352]]), { fill: C.csf, line: C.csfLn, sw: 1 });
  S.ln('arachnoid-mater', poly(Array.from({ length: 73 }, (_, i) => P(274, 18 + i * 2)), false), { color: '#6B5F8A', w: 5 });
  S.ln('pia-mater', poly(pia, false), { color: '#A8576B', w: 4 });
  for (let a = 26; a < 160; a += 14) S.ln(null, poly([P(274, a), P(264, a + 3), P(254, a)], false), { color: C.csfLn, w: 1, op: 0.7 });
  S.at('meninges');
  S.pin('dura-mater', 'dura-mater', P(284, 135));
  S.pin('arachnoid-mater', 'arachnoid-mater', P(274, 110));
  S.pin('pia-mater', 'pia-mater', P(251, 45));
  S.pin('cerebrospinal-fluid', 'subarachnoid', P(263, 65));
  S.pin('meninges', 'dura-mater+arachnoid-mater+pia-mater', P(284, 30));
}
plates.push({
  key: 'csf-meninges', moduleId: MOD, kind: 'gross-diagram', lessons: ['ventricles-csf'], purpose: 'Ventricular chain with choroid plexus, and the three meningeal layers around the brain.',
  title: ['Ventricles, CSF and meninges', 'Ventrículos, LCR y meninges'],
  desc: ['Left panel: lateral view of the ventricular system inside a faint brain outline; choroid plexus tufts line the lateral, third and fourth ventricles, and arrows show CSF flow from lateral to third ventricle, through the aqueduct, to the fourth and down the central canal. Right panel: coronal slice through the top of the head, outside to inside: scalp, skull, dura mater (with the superior sagittal sinus and a falx fold), thin arachnoid mater, CSF-filled subarachnoid space, and pia mater on the brain surface. Meninges is the group name for the three layers. Gross diagram, simplified.',
    'Panel izquierdo: vista lateral del sistema ventricular dentro de un contorno tenue del encéfalo; los penachos del plexo coroideo recubren los ventrículos lateral, tercero y cuarto, y las flechas muestran el flujo del LCR del ventrículo lateral al tercero, por el acueducto, al cuarto y hacia abajo por el conducto central. Panel derecho: corte coronal de la parte superior de la cabeza, de fuera adentro: cuero cabelludo, cráneo, duramadre (con el seno sagital superior y un pliegue de la hoz), aracnoides delgada, espacio subaracnoideo con LCR y piamadre sobre la superficie cerebral. Meninges es el nombre del grupo de las tres capas. Diagrama macroscópico simplificado.'],
  orientation: ['left panel: left lateral view, frontal at viewer left; right panel: coronal slice of the vertex, scalp at top', 'panel izquierdo: vista lateral izquierda, frontal a la izquierda; panel derecho: corte coronal del vértice, cuero cabelludo arriba'], draw: csfMeninges,
});

// ---------------------------------------------------------------- 6 spinal cord cross-section
function spinalCross(S) {
  S.panel(30, 30, 1390, 940, 'cross-section');
  const cx = 725, cy = 500;
  // meningeal sleeve context
  S.sh(null, E(cx, cy, 345, 300), { fill: '#E4EAEF', line: '#6F8D9A', sw: 1.6, dash: '6 4' });
  S.sh('cord-white', E(cx, cy, 300, 252), { fill: C.white, line: C.whiteLn, sw: 2.4 });
  S.out.push(`<path d="M${cx} ${cy - 252}V${cy - 150}" stroke="${C.whiteLn}" stroke-width="2.4"/>`);
  S.out.push(`<path d="M${cx - 18} ${cy + 252}L${cx} ${cy + 130}L${cx + 18} ${cy + 252}" fill="${C.csf}" stroke="${C.whiteLn}" stroke-width="2"/>`);
  const dh = (s) => sm([[cx + s * 25, cy - 20], [cx + s * 62, cy - 52], [cx + s * 100, cy - 118], [cx + s * 140, cy - 190], [cx + s * 156, cy - 214], [cx + s * 170, cy - 198], [cx + s * 152, cy - 140], [cx + s * 126, cy - 70], [cx + s * 96, cy - 24]]);
  const vh = (s) => sm([[cx + s * 25, cy + 6], [cx + s * 70, cy - 14], [cx + s * 128, cy - 6], [cx + s * 168, cy + 44], [cx + s * 160, cy + 104], [cx + s * 112, cy + 140], [cx + s * 58, cy + 120], [cx + s * 36, cy + 62]]);
  S.union(null, [E(cx, cy, 100, 46), dh(-1), dh(1), vh(-1), vh(1)], { fill: C.gray, line: C.brainLn, sw: 2 });
  S.sh('dorsal-column', sm([[cx - 15, cy - 240], [cx - 75, cy - 232], [cx - 90, cy - 150], [cx - 40, cy - 110], [cx - 14, cy - 150]]), { fill: '#BFCFE0', line: '#4F6C86', sw: 1.6 });
  S.sh('corticospinal-tract', sm([[cx - 205, cy - 120], [cx - 262, cy - 100], [cx - 280, cy - 30], [cx - 232, cy - 12], [cx - 192, cy - 60]]), { fill: '#E2B7B2', line: '#8A4A47', sw: 1.6 });
  S.sh('spinothalamic-tract', sm([[cx - 215, cy + 60], [cx - 275, cy + 80], [cx - 240, cy + 170], [cx - 175, cy + 170], [cx - 190, cy + 110]]), { fill: '#E6D090', line: '#8A6E2C', sw: 1.6 });
  S.sh('dorsal-horn', dh(-1), { fill: '#A6B8CE', line: C.brainLn, sw: 1.4 });
  S.sh('ventral-horn', vh(-1), { fill: '#D1A3A3', line: C.brainLn, sw: 1.4 });
  S.sh(null, E(cx, cy, 52, 26), { fill: C.gray, line: C.gray, sw: 0.5 });
  S.sh('central-canal', E(cx, cy - 4, 11, 11), { fill: C.csf, line: C.csfLn, sw: 1.6 });
  S.tb('dorsal-root', [[cx - 168, cy - 216], [cx - 215, cy - 245], [cx - 258, cy - 262]], 13, 13, { fill: C.nerve, line: C.nerveLn });
  S.sh('dorsal-root-ganglion', E(cx - 302, cy - 262, 46, 28, 28), { fill: '#E3C46E', line: C.nerveLn, sw: 2 });
  S.tb(null, [[cx - 340, cy - 245], [cx - 380, cy - 180], [cx - 392, cy - 60]], 13, 13, { fill: C.nerve, line: C.nerveLn });
  S.tb('ventral-root', [[cx - 128, cy + 234], [cx - 220, cy + 270], [cx - 330, cy + 190], [cx - 390, cy - 40]], 13, 13, { fill: C.nerve2, line: C.nerveLn });
  S.tb(null, [[cx - 392, cy - 55], [cx - 470, cy - 40], [cx - 560, cy - 20]], 22, 22, { fill: C.nerve, line: C.nerveLn });
  S.ln(null, `M${cx + 168} ${cy - 216}l50 -40M${cx + 128} ${cy + 234}l60 50`, { color: C.nerveLn, w: 3 });
  S.pin('spinal-cord', 'cord-white', [cx + 200, cy + 150]);
  S.pin('dorsal-horn', 'dorsal-horn', [cx - 105, cy - 110]);
  S.pin('ventral-horn', 'ventral-horn', [cx - 100, cy + 60]);
  S.pin('central-canal', 'central-canal', [cx, cy - 4]);
  S.pin('dorsal-column', 'dorsal-column', [cx - 50, cy - 175]);
  S.pin('corticospinal-tract', 'corticospinal-tract', [cx - 235, cy - 70]);
  S.pin('spinothalamic-tract', 'spinothalamic-tract', [cx - 225, cy + 100]);
  S.pin('dorsal-root', 'dorsal-root', [cx - 215, cy - 245]);
  S.pin('dorsal-root-ganglion', 'dorsal-root-ganglion', [cx - 302, cy - 262]);
  S.pin('ventral-root', 'ventral-root', [cx - 300, cy + 220]);
}
plates.push({
  key: 'spinal-cross-section', moduleId: MOD, kind: 'gross-diagram', lessons: ['spinal-cord', 'neural-tracts'], purpose: 'Spinal cord cross-section: gray butterfly, white columns, taught tracts, roots and ganglion.',
  title: ['Spinal cord in cross-section: gray matter, tracts and roots', 'Médula espinal en corte transversal: sustancia gris, haces y raíces'],
  desc: ['Cross-section of the cord, posterior at the top. The central gray matter is an H: narrow dorsal (posterior) horns receive sensory input and broad ventral (anterior) horns hold motor neurons around the central canal. White matter surrounds it. Three taught tracts are tinted on the viewer-left half only (the tracts are bilateral): dorsal column in the posterior funiculus, lateral corticospinal tract behind the horn level, spinothalamic tract in the anterolateral white matter. The dorsal root carries a dorsal root ganglion; the ventral root leaves the ventral horn. Schematic positions, not every tract is drawn.',
    'Corte transversal de la médula, con la parte posterior arriba. La sustancia gris central tiene forma de H: astas dorsales (posteriores) estrechas que reciben la información sensitiva y astas ventrales (anteriores) anchas con las motoneuronas, alrededor del conducto central. La sustancia blanca la rodea. Tres haces estudiados se tiñen solo en la mitad izquierda de la imagen (los haces son bilaterales): columna dorsal en el funículo posterior, haz corticoespinal lateral a nivel posterior y haz espinotalámico en la sustancia blanca anterolateral. La raíz dorsal lleva el ganglio de la raíz dorsal; la raíz ventral sale del asta ventral. Posiciones esquemáticas; no se dibujan todos los haces.'],
  orientation: ['transverse section; posterior at top, anterior at bottom; tracts and roots drawn on the viewer-left half only', 'corte transversal; posterior arriba, anterior abajo; haces y raíces dibujados solo en la mitad izquierda de la imagen'], draw: spinalCross,
});
void W; void H; void along; void mkTxt;
