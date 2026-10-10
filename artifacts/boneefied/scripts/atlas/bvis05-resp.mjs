// BVIS05 respiratory plates: upper airway, larynx, bronchial tree, lungs, pleura and diaphragm, alveolar unit, respiratory membrane and airway wall.
import { C, sm, poly, E, RR, tube, A, V, SK, MY, vs, mirX, rng } from './bvis05-lib.mjs';

const MOD = 'respiratory-system';
const R = (s) => 'respiratory-system-' + s;
export const plates = [];
const AIR = '#DCE8EA', AIRL = '#7E9AA3', TEAL = { fill: '#B4CFCB', line: '#4F7A74' }, CART = { fill: '#CAD7D6', line: '#6F8D8A' };
const MUC = '#DDADA8', MUCL = '#9A6A66', BONE = '#E4D6BC', BONEL = '#8B8168', LUNG = ['#D9B4B0', '#CFA9A8', '#E0C0BC'], LUNGL = '#8A5F60';
const CAP = { fill: '#B592A0', line: '#76566A' };
const circ = (cx, cy, r) => E(cx, cy, r, r);
const rect = (x, y, w, h) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
const mir = (pts, cx) => mirX(pts, cx);
const full = (half, cx) => [...half, ...mir(half, cx).reverse()];

// ------------------------------------------------------------ 1 upper airway
function upper(S) {
  S.panel(30, 30, 880, 940, 'sagittal'); S.panel(930, 30, 490, 940, 'coronal');
  S.at('sagittal');
  // head in profile facing viewer left
  S.sh('head', sm([[255, 190], [200, 380], [188, 440], [214, 468], [212, 500], [222, 560], [238, 650], [330, 700], [352, 930], [690, 930], [690, 700], [770, 560], [790, 400], [740, 220], [580, 100], [400, 100]], true, 8), { fill: '#EADFD0', line: SK.line, sw: 2 });
  S.sh('nose', sm([[250, 330], [196, 430], [188, 452], [214, 470], [262, 448], [300, 380]]), { fill: '#E4D3C0', line: SK.line, sw: 1.6 });
  S.sh('nasalcav', sm([[236, 440], [300, 372], [405, 358], [432, 390], [436, 470], [330, 488], [246, 476]]), { fill: AIR, line: AIRL, sw: 1.6 });
  S.sh('vest', sm([[224, 444], [262, 424], [276, 440], [276, 474], [234, 480]], true, 4), { fill: '#E9F1F2', line: AIRL, sw: 1.4 });
  [[[300, 395], [350, 376], [410, 392], [380, 404], [330, 405]], [[298, 428], [350, 412], [420, 430], [384, 442], [330, 442]], [[310, 462], [356, 450], [420, 466], [380, 478], [336, 478]]].forEach((p, i) => S.sh(i === 1 ? 'conch' : 'conch0', sm(p, true, 5), { fill: MUC, line: MUCL, sw: 1.4 }));
  S.sh('frontal', E(305, 262, 40, 24, -10), { fill: AIR, line: AIRL, sw: 1.4 });
  S.sh('sphen', E(452, 348, 36, 28), { fill: AIR, line: AIRL, sw: 1.4 });
  [[350, 322], [376, 314], [402, 322], [364, 338], [392, 342]].forEach(([x, y]) => S.sh('ethm', E(x, y, 13, 11), { fill: AIR, line: AIRL, sw: 1.2 }));
  S.sh('choana', sm([[428, 400], [446, 396], [448, 468], [430, 472]], true, 3), { fill: '#F1F6F7', line: AIRL, sw: 1.2, dash: '5 3' });
  S.sh('palate', sm([[236, 484], [330, 494], [420, 496], [424, 512], [330, 514], [240, 504]], true, 4), { fill: BONE, line: BONEL, sw: 1.5 });
  S.sh('soft', sm([[420, 496], [470, 504], [492, 546], [478, 566], [452, 530], [424, 512]], true, 4), { fill: MUC, line: MUCL, sw: 1.5 });
  S.sh(null, sm([[240, 506], [330, 516], [424, 516], [432, 580], [330, 612], [244, 580]]), { fill: '#EAD9D2', line: MUCL, sw: 1.3 });
  S.sh(null, sm([[246, 560], [300, 530], [400, 534], [430, 580], [380, 620], [290, 618]]), { fill: '#D69A94', line: '#8A5C54', sw: 1.4 });
  S.sh('naso', sm([[446, 396], [520, 380], [562, 398], [564, 500], [494, 506], [456, 470]], true, 4), { fill: AIR, line: AIRL, sw: 1.6 });
  S.sh('oro', sm([[494, 506], [564, 500], [566, 590], [488, 592], [482, 540]], true, 4), { fill: '#E3EDEE', line: AIRL, sw: 1.6 });
  S.sh('laryngo', sm([[488, 592], [566, 590], [564, 706], [506, 706], [490, 650]], true, 4), { fill: '#D5E4E6', line: AIRL, sw: 1.6 });
  S.sh(null, sm([[476, 590], [496, 588], [498, 640], [482, 640]], true, 3), { fill: CART.fill, line: CART.line, sw: 1.2 });
  S.sh(null, tube([[506, 712], [506, 920]], 46), { fill: TEAL.fill, line: TEAL.line, sw: 1.4 });
  S.sh(null, tube([[560, 712], [560, 920]], 30), { fill: '#D9B9B3', line: '#8A6060', sw: 1.2 });
  S.at('sagittal');
  [['nose', 'nose', [212, 440]], ['nasal-cavity', 'nasalcav', [350, 470]], ['nasal-vestibule', 'vest', [250, 452]], ['nasal-concha', 'conch', [352, 427]], ['choanae', 'choana', [438, 440]], ['hard-palate', 'palate', [320, 504]],
    ['soft-palate', 'soft', [452, 514]], ['frontal-sinus', 'frontal', [305, 262]], ['sphenoidal-sinus', 'sphen', [452, 348]], ['ethmoidal-sinus', 'ethm', [376, 314]], ['nasopharynx', 'naso', [520, 440]], ['oropharynx', 'oro', [526, 548]], ['laryngopharynx', 'laryngo', [535, 660]]]
    .forEach(([id, k, h]) => S.pin(R(id), k, h));
  // coronal inset
  S.at('coronal');
  S.sh('skull', sm([[1175, 110], [1310, 150], [1370, 300], [1360, 560], [1300, 760], [1175, 830], [1050, 760], [990, 560], [980, 300], [1040, 150]], true, 8), { fill: '#EADFD0', line: SK.line, sw: 2 });
  [[1110, 330], [1240, 330]].forEach(([x, y]) => S.sh(null, E(x, y, 48, 42), { fill: '#E1D0BD', line: SK.line, sw: 1.4 }));
  S.sh('frontal2', E(1175, 190, 56, 30), { fill: AIR, line: AIRL, sw: 1.4 });
  [[1140, 425], [1210, 425], [1128, 460], [1222, 460], [1148, 395], [1202, 395]].forEach(([x, y]) => S.sh('ethm2', E(x, y, 14, 13), { fill: AIR, line: AIRL, sw: 1.2 }));
  [[1105, 520, -1], [1245, 520, 1]].forEach(([x, y]) => { S.sh('nasalcav2', sm([[x - 28, y - 70], [x + 28, y - 70], [x + 34, y + 130], [x - 34, y + 130]], true, 4), { fill: AIR, line: AIRL, sw: 1.6 });
    S.sh('conch2', sm([[x - 28 * -1 * -1, y], [x + 34 * -1 * 0 + 6, y - 10], [x + 8, y + 24], [x - 20, y + 20]], true, 4), { fill: MUC, line: MUCL, sw: 1.3 }); });
  S.sh('septum', poly([[1152, 450], [1198, 450], [1200, 650], [1150, 650]]), { fill: BONE, line: BONEL, sw: 1.5 });
  [[1000, 580], [1350, 580]].forEach(([x, y]) => S.sh('maxsin', E(x, y, 66, 74), { fill: AIR, line: AIRL, sw: 1.6 }));
  S.sh(null, RR(1040, 668, 270, 36, 8), { fill: BONE, line: BONEL, sw: 1.5 });
  S.sh(null, sm([[1060, 710], [1290, 710], [1280, 800], [1175, 825], [1070, 800]]), { fill: '#D69A94', line: '#8A5C54', sw: 1.4 });
  S.pin(R('nasal-septum'), 'septum', [1175, 550]);
  S.pin(R('maxillary-sinus'), 'maxsin', [1000, 580]);
  S.pin(R('nasal-cavity'), 'nasalcav2', [1105, 590]);
  S.pin(R('nasal-concha'), 'conch2', [1105, 520]);
  S.pin(R('ethmoidal-sinus'), 'ethm2', [1140, 425]);
  S.pin(R('frontal-sinus'), 'frontal2', [1175, 190]);
}
plates.push({
  key: 'upper-airway', moduleId: MOD, kind: 'gross-diagram', lessons: ['respiratory-upper-airway', 'respiratory-airflow'], purpose: 'Nose, nasal cavity, sinuses, palate and the three parts of the pharynx in sagittal section, with a coronal view of septum and maxillary sinus.',
  title: ['Upper airway: nasal cavity, sinuses and pharynx', 'Vía aérea superior: cavidad nasal, senos y faringe'],
  desc: ['Left: midline sagittal section of the head, face at viewer left. Air enters through the nostril into the nasal vestibule and the nasal cavity, whose lateral wall carries the nasal conchae (the nasal septum has been removed to show them, and is drawn in the coronal view). The hard palate and soft palate separate the nasal passage from the mouth. Behind the cavity the choanae open into the nasopharynx; below the soft palate the oropharynx is shared with food and the laryngopharynx lies behind the larynx, above the trachea (front tube) and oesophagus (back tube). The paranasal sinuses are air spaces drained into the nose: frontal above, sphenoidal behind and ethmoidal cells between. Right: coronal section of the face: the nasal septum divides the two nasal cavities and the large maxillary sinuses lie beside them. Simplified.',
    'Izquierda: corte sagital medio de la cabeza, cara a la izquierda del observador. El aire entra por la fosa nasal al vestíbulo nasal y a la cavidad nasal, cuya pared lateral lleva los cornetes nasales (se ha retirado el tabique nasal para verlos; se dibuja en la vista coronal). El paladar duro y el blando separan la vía nasal de la boca. Detrás de la cavidad las coanas se abren a la nasofaringe; bajo el paladar blando la orofaringe es común con los alimentos y la laringofaringe queda tras la laringe, sobre la tráquea (tubo anterior) y el esófago (tubo posterior). Los senos paranasales son cavidades aéreas que drenan en la nariz: frontal arriba, esfenoidal detrás y celdillas etmoidales entre ambos. Derecha: corte coronal de la cara: el tabique nasal separa las dos cavidades nasales y los grandes senos maxilares quedan a los lados. Simplificado.'],
  orientation: ['left: sagittal head, face at viewer left; right: coronal face', 'izquierda: cabeza en corte sagital, cara a la izquierda; derecha: cara en corte coronal'], draw: upper,
});

// ------------------------------------------------------------ 2 larynx
function larynx(S) {
  S.panel(30, 30, 690, 940, 'coronal'); S.panel(740, 30, 680, 940, 'superior');
  S.at('coronal');
  const cx = 380;
  S.sh('tc', sm([[188, 262], [262, 250], [284, 330], [286, 520], [236, 566], [190, 500]], true, 5), { fill: CART.fill, line: CART.line, sw: 1.8 });
  S.sh('tc', sm(mir([[188, 262], [262, 250], [284, 330], [286, 520], [236, 566], [190, 500]], cx), true, 5), { fill: CART.fill, line: CART.line, sw: 1.8 });
  S.sh('cric', sm([[262, 586], [310, 574], [304, 700], [268, 716]], true, 4), { fill: CART.fill, line: CART.line, sw: 1.8 });
  S.sh('cric', sm(mir([[262, 586], [310, 574], [304, 700], [268, 716]], cx), true, 4), { fill: CART.fill, line: CART.line, sw: 1.8 });
  // laryngeal cavity (half profile then mirrored)
  const half = [[296, 196], [300, 300], [346, 306], [346, 332], [302, 338], [300, 352], [358, 372], [358, 400], [296, 424], [300, 520], [310, 590]];
  S.sh('cavity', sm(full(half, cx), true, 3), { fill: AIR, line: AIRL, sw: 1.4 });
  S.sh('vest', poly([[300, 200], [460, 200], [460, 298], [300, 298]]), { fill: '#E6EFF0', line: AIRL, sw: 1.2 });
  S.sh('vfold', sm([[296, 352], [358, 372], [358, 400], [296, 424]], true, 3), { fill: '#D9908A', line: '#8A5C54', sw: 1.4 });
  S.sh('vfold', sm(mir([[296, 352], [358, 372], [358, 400], [296, 424]], cx), true, 3), { fill: '#D9908A', line: '#8A5C54', sw: 1.4 });
  S.sh('rima', poly([[358, 372], [402, 372], [402, 400], [358, 400]]), { fill: '#F2F7F8', line: AIRL, sw: 1.2, dash: '4 3' });
  S.sh('fold', sm([[300, 300], [346, 306], [346, 332], [302, 338]], true, 3), { fill: MUC, line: MUCL, sw: 1.4 });
  S.sh('fold', sm(mir([[300, 300], [346, 306], [346, 332], [302, 338]], cx), true, 3), { fill: MUC, line: MUCL, sw: 1.4 });
  S.sh('epi', sm([[346, 70], [414, 70], [440, 130], [430, 196], [380, 240], [334, 196], [322, 130]], true, 5), { fill: CART.fill, line: CART.line, sw: 1.8 });
  S.sh('inlet', E(380, 214, 82, 14), { fill: '#EEF4F5', line: AIRL, sw: 1.3, dash: '5 3' });
  S.sh('trach', tube([[380, 720], [380, 920]], 150, 150), { fill: AIR, line: TEAL.line, sw: 1.8 });
  [[300, 596], [340, 596]].forEach(([x]) => void x);
  S.arrow(380, 880, 90, 16, '#8AA3AB');
  S.pin(R('epiglottis'), 'epi', [380, 140]);
  S.pin(R('laryngeal-inlet'), 'inlet', [380, 214]);
  S.pin(R('laryngeal-vestibule'), 'vest', [330, 260]);
  S.pin(R('vestibular-folds'), 'fold', [322, 318]);
  S.pin(R('vocal-folds'), 'vfold', [322, 388]);
  S.pin(R('rima-glottidis'), 'rima', [380, 386]);
  S.pin(R('glottis'), 'vfold+rima', [440, 396]);
  S.pin(R('thyroid-cartilage'), 'tc', [236, 400]);
  S.pin(R('cricoid-cartilage'), 'cric', [287, 640]);
  S.pin(R('trachea'), 'trach', [380, 820]);
  S.pin(R('larynx'), 'cavity', [300, 480]);
  // superior view
  S.at('superior');
  const hx = 1080;
  S.sh('tc2', tube([[1076, 200], [1010, 262], [960, 410], [962, 560]], 36, 30), { fill: CART.fill, line: CART.line, sw: 1.6 });
  S.sh('tc2', tube([[1084, 200], [1150, 262], [1200, 410], [1198, 560]], 36, 30), { fill: CART.fill, line: CART.line, sw: 1.6 });
  S.sh('lum', sm([[1080, 232], [1150, 330], [1170, 480], [1150, 620], [1080, 660], [1010, 620], [990, 480], [1010, 330]], true, 6), { fill: MUC, line: MUCL, sw: 1.6 });
  S.sh('fold2', sm([[1060, 330], [1040, 420], [1018, 540], [1000, 520], [1010, 400], [1040, 320]], true, 4), { fill: '#E5B7B1', line: MUCL, sw: 1.2 });
  S.sh('fold2', sm([[1100, 330], [1120, 420], [1142, 540], [1160, 520], [1150, 400], [1120, 320]], true, 4), { fill: '#E5B7B1', line: MUCL, sw: 1.2 });
  S.sh('vfold2', sm([[1078, 270], [1054, 380], [1040, 530], [1068, 536], [1076, 400]], true, 4), { fill: '#F0D9D4', line: '#8A5C54', sw: 1.4 });
  S.sh('vfold2', sm([[1082, 270], [1106, 380], [1120, 530], [1092, 536], [1084, 400]], true, 4), { fill: '#F0D9D4', line: '#8A5C54', sw: 1.4 });
  S.sh('rima2', poly([[1080, 280], [1090, 400], [1094, 530], [1066, 530], [1070, 400]]), { fill: '#5C6A72', line: '#3F4A52', sw: 1 });
  S.sh('ary', E(1036, 586, 22, 30, -10), { fill: CART.fill, line: CART.line, sw: 1.6 });
  S.sh('ary', E(1124, 586, 22, 30, 10), { fill: CART.fill, line: CART.line, sw: 1.6 });
  S.sh('epi2', sm([[1020, 170], [1080, 140], [1140, 170], [1130, 235], [1080, 262], [1030, 235]], true, 5), { fill: CART.fill, line: CART.line, sw: 1.6 });
  S.pin(R('arytenoid-cartilage'), 'ary', [1036, 586]);
  S.pin(R('vestibular-folds'), 'fold2', [1022, 460]);
  S.pin(R('vocal-folds'), 'vfold2', [1054, 420]);
  S.pin(R('rima-glottidis'), 'rima2', [1080, 460]);
  S.pin(R('glottis'), 'vfold2+rima2', [1100, 480]);
  S.pin(R('epiglottis'), 'epi2', [1080, 190]);
}
plates.push({
  key: 'larynx-glottis', moduleId: MOD, kind: 'gross-diagram', lessons: ['respiratory-larynx'], purpose: 'Larynx in coronal section and from above: cartilages, vestibular folds, vocal folds and the rima glottidis (glottis = folds plus gap).',
  title: ['Larynx and glottis', 'Laringe y glotis'],
  desc: ['Left: coronal section of the larynx. The thyroid cartilage forms the front and sides and the cricoid cartilage the ring below it, continuing into the trachea. The epiglottis (elastic cartilage) lies above the laryngeal inlet, which opens into the laryngeal vestibule. Two pairs of folds project into the lumen: the upper vestibular folds (false cords, mucosa only) and the lower vocal folds (true cords, with the vocalis muscle and ligament). The glottis is the vocal folds together with the slit between them, the rima glottidis; it is not just the opening. Below the vocal folds the airway continues into the trachea. Right: view from above, front at top: the vocal folds meet at the front and diverge backward to the arytenoid cartilages, so the rima glottidis is a V-shaped slit between them. Simplified.',
    'Izquierda: corte coronal de la laringe. El cartílago tiroides forma el frente y los lados y el cricoides el anillo inferior, que continúa con la tráquea. La epiglotis (cartílago elástico) queda sobre el aditus laríngeo, que se abre al vestíbulo laríngeo. Dos pares de pliegues se proyectan en la luz: los pliegues vestibulares superiores (falsas cuerdas, solo mucosa) y los pliegues vocales inferiores (cuerdas verdaderas, con músculo vocal y ligamento). La glotis son los pliegues vocales junto con la hendidura entre ellos, la rima glótica; no es solo la abertura. Bajo los pliegues vocales la vía continúa en la tráquea. Derecha: vista desde arriba, frente arriba: los pliegues vocales se unen delante y divergen hacia atrás hasta los cartílagos aritenoides, de modo que la rima glótica es una hendidura en V entre ellos. Simplificado.'],
  orientation: ['left: coronal section; right: view from above, front at top', 'izquierda: corte coronal; derecha: vista desde arriba, frente arriba'], draw: larynx,
});

// ------------------------------------------------------------ 3 trachea and bronchial tree
function seg(S, p, ang, k) {
  // three segmental bronchi from a lobar end p, each ending in bronchioles and terminal bronchioles; returns first segmental midpoint
  const mids = [];
  [-32, 0, 32].forEach((da) => {
    const a = ((ang + da) * Math.PI) / 180, e = [p[0] + 64 * Math.cos(a), p[1] + 64 * Math.sin(a)], m = [(p[0] + e[0]) / 2, (p[1] + e[1]) / 2];
    vs(S, R('seg'), [p, m, e], 14, 10, TEAL); mids.push(m);
    [-26, 26].forEach((db) => { const b = ((ang + da + db) * Math.PI) / 180, e2 = [e[0] + 36 * Math.cos(b), e[1] + 36 * Math.sin(b)], e3 = [e2[0] + 24 * Math.cos(b), e2[1] + 24 * Math.sin(b)];
      vs(S, R('bronchiole'), [e, e2], 7, 5, TEAL); vs(S, R('termb'), [e2, e3], 5, 4, TEAL); });
  });
  void k; return mids;
}
function bronchi(S) {
  S.panel(30, 30, 880, 940, 'tree'); S.panel(930, 30, 490, 940, 'section');
  S.at('tree');
  const tx = 60, T = ([x, y]) => [x + tx, y];
  S.beginT(tx, 0, 1);
  vs(S, R('trachea'), [[360, 90], [360, 335]], 56, 56, TEAL);
  for (let y = 112; y < 330; y += 22) S.sh(R('trachea'), RR(334, y, 52, 11, 4), { fill: CART.fill, line: CART.line, sw: 1 });
  S.sh(R('carina'), poly([[346, 322], [374, 322], [360, 352]]), { fill: '#7FA39E', line: '#3E625D', sw: 1.4 });
  vs(S, R('rmain'), [[360, 335], [340, 390], [297, 470]], 40, 34, TEAL);
  vs(S, R('lmain'), [[360, 335], [440, 415], [516, 491]], 36, 30, TEAL);
  const lob = (id, pts, w0, w1) => vs(S, R('lobar'), pts, w0, w1, TEAL);
  lob(0, [[303, 440], [250, 420], [190, 380]], 26, 20); lob(0, [[297, 470], [240, 500], [185, 540]], 26, 20); lob(0, [[297, 470], [280, 560], [250, 650]], 28, 22);
  lob(0, [[516, 491], [560, 430], [600, 380]], 26, 20); lob(0, [[516, 491], [558, 580], [585, 650]], 28, 22);
  const m1 = seg(S, [190, 380], 215, 1); seg(S, [185, 540], 160, 2); seg(S, [250, 650], 100, 3); seg(S, [600, 380], -45, 4); seg(S, [585, 650], 75, 5);
  S.endT();
  S.pin(R('trachea'), R('trachea'), T([360, 200]));
  S.pin(R('carina'), R('carina'), T([360, 334]));
  S.pin(R('right-main-bronchus'), R('rmain'), T([340, 390]));
  S.pin(R('left-main-bronchus'), R('lmain'), T([430, 405]));
  S.pin(R('lobar-bronchus'), R('lobar'), T([225, 405]));
  S.pin(R('segmental-bronchus'), R('seg'), T(m1[0]));
  S.pin(R('bronchiole'), R('bronchiole'), T([107, 292]));
  S.pin(R('terminal-bronchiole'), R('termb'), T([105, 302]));
  // trachea in cross-section: C-shaped ring, trachealis closes the back
  S.at('section');
  const cx = 1175, cy = 440;
  S.sh('esoph', E(cx, cy + 232, 90, 44), { fill: '#D9B9B3', line: '#8A6060', sw: 1.4 });
  S.sh('ring', sm([[cx - 120, cy + 74], [cx - 168, cy - 10], [cx - 130, cy - 130], [cx, cy - 178], [cx + 130, cy - 130], [cx + 168, cy - 10], [cx + 120, cy + 74], [cx + 96, cy + 56], [cx + 132, cy - 6], [cx + 100, cy - 100], [cx, cy - 140], [cx - 100, cy - 100], [cx - 132, cy - 6], [cx - 96, cy + 56]], true, 6), { fill: CART.fill, line: CART.line, sw: 1.8 });
  S.sh('tmus', sm([[cx - 120, cy + 74], [cx - 96, cy + 56], [cx, cy + 62], [cx + 96, cy + 56], [cx + 120, cy + 74], [cx, cy + 86]], true, 4), { fill: '#C7867C', line: '#8A524D', sw: 1.6 });
  S.sh('tlum', sm([[cx - 96, cy + 56], [cx - 132, cy - 6], [cx - 100, cy - 100], [cx, cy - 140], [cx + 100, cy - 100], [cx + 132, cy - 6], [cx + 96, cy + 56], [cx, cy + 62]], true, 6), { fill: AIR, line: AIRL, sw: 1.4 });
  S.pin(R('trachea'), 'ring', [cx - 150, cy - 10]);
  S.pin(R('trachealis-muscle'), 'tmus', [cx, cy + 72]);
}
plates.push({
  key: 'trachea-bronchial-tree', moduleId: MOD, kind: 'gross-diagram', lessons: ['respiratory-larynx', 'respiratory-airflow'], purpose: 'Trachea, carina, main bronchi (right shorter, wider, more vertical), lobar and segmental bronchi and bronchioles; trachea cross-section with trachealis.',
  title: ['Trachea, bronchi and bronchioles', 'Tráquea, bronquios y bronquiolos'],
  desc: ['Left: anterior view of the airway tree, patient right at viewer left. The trachea, held open by C-shaped cartilage rings, divides at the carina into the main bronchi. The right main bronchus is shorter, wider and more vertical than the left, so inhaled objects tend to enter it. Each main bronchus divides into lobar bronchi (three on the right, two on the left, one per lobe), then segmental bronchi, then ever smaller bronchioles ending as terminal bronchioles, which have no cartilage. Branching is simplified: many more generations exist. Right: trachea in cross-section: the cartilage rings are open at the back, where the smooth trachealis muscle bridges the gap against the oesophagus.',
    'Izquierda: vista anterior del árbol aéreo, derecha del paciente a la izquierda. La tráquea, abierta por anillos cartilaginosos en C, se divide en la carina en los bronquios principales. El bronquio principal derecho es más corto, ancho y vertical que el izquierdo, por lo que los cuerpos extraños tienden a entrar en él. Cada bronquio principal se divide en bronquios lobares (tres a la derecha, dos a la izquierda, uno por lóbulo), luego segmentarios y después bronquiolos cada vez menores que terminan como bronquiolos terminales, sin cartílago. La ramificación está simplificada: existen muchas más generaciones. Derecha: corte transversal de la tráquea: los anillos cartilaginosos están abiertos por detrás, donde el músculo traqueal liso cierra el hueco frente al esófago.'],
  orientation: ['left: anterior view, patient right at viewer left; right: cross-section, back at bottom', 'izquierda: vista anterior, derecha del paciente a la izquierda; derecha: corte transversal, parte posterior abajo'], draw: bronchi,
});

// ------------------------------------------------------------ 4 lungs
const RL = [[420, 150], [360, 120], [290, 160], [240, 280], [210, 500], [225, 720], [270, 800], [340, 830], [430, 820], [455, 780], [452, 500], [440, 300]];
const LL = [[510, 150], [570, 118], [645, 170], [695, 300], [715, 520], [695, 730], [640, 805], [560, 830], [498, 815], [486, 770], [486, 708], [528, 640], [540, 572], [498, 510], [480, 430], [484, 300]];
function lungs(S) {
  S.panel(30, 30, 890, 940, 'anterior'); S.panel(940, 30, 480, 940, 'medial');
  S.at('anterior');
  S.sh(null, sm([[438, 500], [520, 520], [590, 600], [570, 720], [500, 780], [440, 740]], true, 6), { fill: MY.fill, line: MY.line, sw: 1.6 });
  S.sh('notch', poly([[486, 560], [540, 574], [528, 640], [486, 706], [476, 640]]), { fill: '#E9D3CE', line: MUCL, sw: 1.4, dash: '5 4' });
  vs(S, null, [[465, 80], [465, 200]], 44, 44, TEAL);
  vs(S, null, [[465, 195], [440, 250], [415, 290]], 28, 24, TEAL); vs(S, null, [[465, 195], [500, 250], [530, 290]], 28, 24, TEAL);
  const RLd = sm(RL, true, 6), LLd = sm(LL, true, 6);
  S.sh('rlung', RLd, { fill: LUNG[0], line: LUNGL, sw: 2 });
  S.clipBoth(RLd);
  S.sh('slobe', poly([[150, 60], [520, 60], [520, 456], [340, 450], [225, 438], [150, 430]]), { fill: LUNG[0], line: LUNGL, sw: 0.5 });
  S.sh('mlobe', poly([[225, 440], [340, 452], [520, 468], [520, 740], [455, 735], [380, 650], [300, 560], [222, 470]]), { fill: LUNG[2], line: LUNGL, sw: 0.5 });
  S.sh('ilobe', poly([[222, 470], [300, 560], [380, 650], [455, 735], [520, 740], [520, 900], [150, 900], [150, 470]]), { fill: LUNG[1], line: LUNGL, sw: 0.5 });
  S.clipBothEnd();
  S.ln('hfis', 'M222 440L340 452L456 468', { color: LUNGL, w: 3 }); S.ln('ofis', 'M220 470L300 560L380 650L456 735', { color: LUNGL, w: 3 });
  S.out.push(`<path d="${RLd}" fill="none" stroke="${LUNGL}" stroke-width="2"/>`);
  S.sh('llung', LLd, { fill: LUNG[0], line: LUNGL, sw: 2 });
  S.clipBoth(LLd);
  S.sh('lup', poly([[460, 60], [760, 60], [760, 420], [698, 432], [610, 540], [520, 690], [500, 800], [460, 800]]), { fill: LUNG[0], line: LUNGL, sw: 0.5 });
  S.sh('llow', poly([[698, 432], [760, 420], [760, 900], [480, 900], [500, 800], [520, 690], [610, 540]]), { fill: LUNG[1], line: LUNGL, sw: 0.5 });
  S.clipBothEnd();
  S.ln(null, 'M698 432L610 540L520 690L500 800', { color: LUNGL, w: 3 });
  S.out.push(`<path d="${LLd}" fill="none" stroke="${LUNGL}" stroke-width="2"/>`);
  S.sh(null, tube([[200, 840], [725, 840]], 12, 12), { fill: 'none', line: 'none', sw: 0 });
  [['right-lung', 'slobe+mlobe+ilobe', [260, 640]], ['left-lung', 'lup+llow', [640, 300]], ['superior-lobe', 'slobe', [320, 300]], ['middle-lobe', 'mlobe', [390, 560]], ['inferior-lobe', 'ilobe', [300, 700]],
    ['cardiac-notch', 'notch', [510, 618]], ['oblique-fissure', 'ofis', [338, 608]], ['horizontal-fissure', 'hfis', [340, 452]]].forEach(([id, k, h]) => S.pin(R(id), k, h));
  // medial surface of the right lung with the hilum
  S.at('medial');
  S.sh('mlung', sm([[1040, 170], [1150, 130], [1260, 170], [1330, 300], [1350, 520], [1320, 720], [1240, 820], [1120, 840], [1050, 760], [1020, 560], [1010, 340]], true, 8), { fill: LUNG[0], line: LUNGL, sw: 2 });
  S.ln(null, 'M1100 190Q1200 350 1300 560Q1320 640 1310 760', { color: LUNGL, w: 2.4 });
  S.sh('hilum', E(1170, 500, 112, 150, -6), { fill: '#E9D3CE', line: MUCL, sw: 1.6 });
  S.sh('root', sm([[1100, 400], [1220, 395], [1330, 410], [1330, 600], [1230, 610], [1105, 600]], true, 5), { fill: '#E4CFC0', line: '#A8817C', sw: 1.4 });
  vs(S, null, [[1100, 440], [1210, 442], [1320, 440]], 32, 30, TEAL);
  vs(S, null, [[1100, 500], [1210, 498], [1320, 500]], 34, 32, V);
  vs(S, null, [[1105, 560], [1215, 558], [1325, 556]], 28, 26, A);
  S.pin(R('hilum-of-lung'), 'hilum', [1170, 372]);
  S.pin(R('root-of-lung'), 'root', [1280, 590]);
  void mir;
}
plates.push({
  key: 'lung-lobes', moduleId: MOD, kind: 'gross-diagram', lessons: ['respiratory-lungs'], purpose: 'Right lung with three lobes, left lung with two lobes and the cardiac notch, fissures, and the hilum and root of the lung.',
  title: ['Lungs: lobes, fissures and hilum', 'Pulmones: lóbulos, cisuras y hilio'],
  desc: ['Left: anterior view, patient right at viewer left. The right lung has three lobes: superior and middle lobes are separated by the horizontal fissure, middle and inferior by the oblique fissure. The left lung has two lobes, superior and inferior, separated by an oblique fissure, and its front edge is indented by the cardiac notch where the heart lies against the chest wall (the heart is the muscle-coloured shape behind). Right: medial surface of the right lung. The hilum is the recess where the root of the lung enters and leaves: the main bronchus (airway colour), the pulmonary artery carrying deoxygenated blood from the heart (blue) and the pulmonary veins carrying oxygenated blood to the heart (red). The relative order of the structures differs between the two lungs; the right lung is shown. Simplified.',
    'Izquierda: vista anterior, derecha del paciente a la izquierda. El pulmón derecho tiene tres lóbulos: superior y medio separados por la cisura horizontal, medio e inferior por la cisura oblicua. El pulmón izquierdo tiene dos lóbulos, superior e inferior, separados por una cisura oblicua, y su borde anterior está escotado por la incisura cardíaca, donde el corazón apoya en la pared torácica (el corazón es la forma de color muscular detrás). Derecha: cara medial del pulmón derecho. El hilio es la depresión por donde entra y sale la raíz del pulmón: el bronquio principal (color de vía aérea), la arteria pulmonar que lleva sangre desoxigenada del corazón (azul) y las venas pulmonares que llevan sangre oxigenada al corazón (rojo). El orden relativo de las estructuras difiere entre ambos pulmones; se muestra el derecho. Simplificado.'],
  orientation: ['left: anterior view, patient right at viewer left; right: medial surface of the right lung', 'izquierda: vista anterior, derecha del paciente a la izquierda; derecha: cara medial del pulmón derecho'], draw: lungs,
});

// ------------------------------------------------------------ 5 pleura and diaphragm
function pleura(S) {
  S.panel(30, 30, 900, 940, 'thorax'); S.panel(950, 30, 470, 940, 'mech');
  S.at('thorax');
  const cx = 480;
  const wall = [[cx, 90], [650, 120], [770, 260], [800, 520], [770, 720], [700, 810], [260, 810], [190, 720], [160, 520], [190, 260], [310, 120]];
  S.sh('wall', sm(wall, true, 6), { fill: BONE, line: BONEL, sw: 2 });
  // right dome (viewer left) is higher: apex y 560; left dome apex y 612
  const sacR = [[466, 128], [380, 100], [290, 140], [235, 270], [205, 500], [212, 700], [250, 740], [330, 575], [410, 590], [462, 640]];
  const sacL = [[494, 128], [580, 100], [670, 140], [725, 270], [755, 500], [748, 700], [710, 740], [630, 625], [550, 640], [498, 690]];
  S.sh('par', sm(sacR, true, 6), { fill: '#E4B9B3', line: '#9A6A66', sw: 2 }); S.sh('par', sm(sacL, true, 6), { fill: '#E4B9B3', line: '#9A6A66', sw: 2 });
  const inset = (pts, d, cxx) => pts.map(([x, y]) => [x + (cxx - x) * d / 260 * 1.0, y + (400 - y) * d / 900 * 1.0]);
  void inset;
  const cavR = [[462, 150], [384, 126], [304, 160], [256, 280], [228, 500], [236, 690], [258, 712], [336, 598], [408, 612], [458, 650]];
  const cavL = [[498, 150], [576, 126], [656, 160], [704, 280], [732, 500], [724, 690], [702, 712], [624, 648], [552, 662], [502, 700]];
  S.sh('cav', sm(cavR, true, 6), { fill: '#F3E8EB', line: '#C7A9B0', sw: 1.2 }); S.sh('cav', sm(cavL, true, 6), { fill: '#F3E8EB', line: '#C7A9B0', sw: 1.2 });
  const lungR = [[460, 176], [394, 150], [322, 182], [278, 290], [254, 500], [262, 676], [278, 692], [338, 616], [406, 630], [452, 660]];
  const lungL = [[500, 176], [566, 150], [638, 182], [682, 290], [706, 500], [698, 676], [682, 692], [622, 668], [554, 680], [508, 710]];
  S.sh('vis', sm(lungR, true, 6), { fill: LUNG[0], line: '#9A6A66', sw: 2.2 }); S.sh('vis', sm(lungL, true, 6), { fill: LUNG[0], line: '#9A6A66', sw: 2.2 });
  S.sh('rlung2', sm(lungR.map(([x, y]) => [x + (466 - x) * 0.03 + (x < 466 ? 4 : 0), y + 6]), true, 6), { fill: LUNG[1], line: LUNGL, sw: 0.8 });
  S.sh('rlung2', sm(lungL.map(([x, y]) => [x + (494 - x) * 0.03 + (x > 494 ? -4 : 0), y + 6]), true, 6), { fill: LUNG[1], line: LUNGL, sw: 0.8 });
  // mediastinum: heart, great vessels
  S.sh(null, sm([[470, 500], [540, 470], [600, 540], [590, 630], [530, 700], [470, 640]], true, 5), { fill: MY.fill, line: MY.line, sw: 1.6 });
  vs(S, null, [[480, 100], [480, 260]], 34, 34, TEAL);
  // diaphragm: muscle band under the domes, central tendon pale
  const domeR = [[205, 720], [246, 738], [330, 590], [410, 602], [462, 650], [498, 700], [550, 676], [624, 662], [702, 724], [750, 722]];
  S.sh('diaph', sm([[205, 716], [250, 750], [330, 604], [410, 618], [462, 664], [500, 710], [552, 690], [624, 678], [702, 744], [755, 716], [750, 760], [700, 790], [624, 722], [552, 736], [500, 764], [462, 710], [410, 664], [330, 650], [256, 800], [210, 760]], true, 5), { fill: '#C7867C', line: '#8A524D', sw: 1.8 });
  // liver under the RIGHT dome (viewer left), stomach and spleen under the left
  S.sh(null, sm([[236, 790], [256, 804], [330, 654], [410, 666], [462, 712], [520, 780], [500, 880], [400, 920], [290, 900], [236, 840]], true, 6), { fill: LIV.fill, line: LIV.line, sw: 2 });
  S.sh(null, sm([[560, 740], [640, 728], [700, 790], [680, 880], [600, 900], [550, 840]], true, 5), { fill: '#E4CFC0', line: '#A8817C', sw: 1.6 });
  S.sh(null, sm([[708, 796], [750, 790], [770, 850], [740, 900], [705, 860]], true, 4), { fill: '#B79DB0', line: '#76566A', sw: 1.4 });
  S.pin(R('diaphragm'), 'diaph', [556, 702]);
  S.pin(R('parietal-pleura'), 'par', [186, 380]);
  S.pin(R('pleural-cavity'), 'cav', [247, 400]);
  S.pin(R('visceral-pleura'), 'vis', [268, 400]);
  S.pin(R('right-lung'), 'rlung2', [350, 400]);
  S.pin(R('left-lung'), 'rlung2', [620, 400]);
  // mechanics panel (sagittal side, relaxed dashed vs contracted)
  S.at('mech');
  S.sh(null, sm([[1100, 120], [1250, 90], [1340, 220], [1360, 520], [1330, 760], [1210, 840], [1090, 780], [1060, 520], [1070, 240]], true, 7), { fill: BONE, line: BONEL, sw: 2 });
  const mlungPts = [[1120, 190], [1250, 160], [1310, 270], [1320, 500], [1290, 700], [1200, 700], [1110, 640], [1090, 460], [1100, 270]];
  const sacPts = mlungPts.map(([x, y]) => [1205 + (x - 1205) * 1.12, 430 + (y - 430) * 1.12]);
  S.sh('mcav', sm(sacPts, true, 7), { fill: '#F3E8EB', line: '#9A6A66', sw: 2 });
  S.sh('mlung3', sm(mlungPts, true, 7), { fill: LUNG[0], line: LUNGL, sw: 2 });
  S.out.push(`<path d="${sm([[1090, 700], [1200, 640], [1300, 700]], false, 8)}" fill="none" stroke="#8A524D" stroke-width="3" stroke-dasharray="9 6"/>`);
  S.sh('diaph2', sm([[1086, 760], [1200, 744], [1318, 760], [1318, 790], [1200, 776], [1086, 792]], true, 5), { fill: '#C7867C', line: '#8A524D', sw: 1.8 });
  S.arrow(1200, 826, 90, 20, '#8A524D'); S.arrow(1130, 300, -90, 16, '#8A949B'); S.arrow(1290, 300, -90, 16, '#8A949B');
  S.pin(R('diaphragm'), 'diaph2', [1200, 760]);
  S.pin(R('pleural-cavity'), 'mcav', [1083, 460]);
  S.pin(R('right-lung'), 'mlung3', [1200, 420]);
}
plates.push({
  key: 'pleura-diaphragm', moduleId: MOD, kind: 'gross-diagram', lessons: ['respiratory-lungs', 'respiratory-mechanics'], purpose: 'Pleural layers and cavity, the diaphragm domes and organ placement beneath them; diaphragm flattening in inspiration.',
  title: ['Pleura and diaphragm', 'Pleura y diafragma'],
  desc: ['Left: coronal schematic of the chest, patient right at viewer left. Each lung is wrapped by a visceral pleura stuck to its surface; the parietal pleura lines the chest wall and diaphragm; between the two layers lies the pleural cavity. In life this is only a thin film of fluid; here it is drawn as an exaggerated gap for clarity. The diaphragm forms two domes, the right higher than the left because the liver lies beneath the right dome (viewer left); the stomach and spleen lie under the left dome. The heart sits between the lungs. Right: side-view schematic of breathing: when the diaphragm contracts its dome flattens (solid band, arrow down; dashed line shows the relaxed dome), the chest volume increases and the lungs follow because pleural layers cling together. In this side view the pleural cavity is the thin pale ring between the outer parietal outline and the lung surface (exaggerated); the lung itself is the pink area inside it. Simplified.',
    'Izquierda: esquema coronal del tórax, derecha del paciente a la izquierda. Cada pulmón está envuelto por una pleura visceral adherida a su superficie; la pleura parietal tapiza la pared torácica y el diafragma; entre ambas capas queda la cavidad pleural. En vida es solo una fina película de líquido; aquí se dibuja como un hueco exagerado para mayor claridad. El diafragma forma dos cúpulas, la derecha más alta que la izquierda porque el hígado está bajo la cúpula derecha (a la izquierda del observador); el estómago y el bazo están bajo la izquierda. El corazón queda entre los pulmones. Derecha: esquema lateral de la respiración: al contraerse el diafragma su cúpula se aplana (banda continua, flecha abajo; la línea discontinua marca la cúpula relajada), aumenta el volumen torácico y los pulmones lo siguen porque las capas pleurales se adhieren. En esta vista lateral la cavidad pleural es el fino anillo pálido entre el contorno parietal externo y la superficie del pulmón (exagerado); el pulmón es la zona rosada interior. Simplificado.'],
  orientation: ['left: coronal view, patient right at viewer left; right: side view of breathing', 'izquierda: vista coronal, derecha del paciente a la izquierda; derecha: vista lateral de la respiración'], draw: pleura,
});
const LIV = { fill: '#C9A08F', line: '#8A6455' };

// ------------------------------------------------------------ 6 alveolar unit
function alveoli(S) {
  S.panel(30, 30, 1390, 940, 'unit');
  S.sh(null, RR(60, 60, 1330, 880, 16), { fill: '#EFE9E0', line: '#DCD3C6', sw: 1.2 });
  const cy = 500, SX = 1030, TIS = { fill: '#E8D3CF', line: '#E8D3CF' };
  const dg = (d) => (d * Math.PI) / 180, at = (r, d) => [SX + r * Math.cos(dg(d)), cy + r * Math.sin(dg(d))];
  S.sh(null, circ(SX, cy, 262), { fill: TIS.fill, line: '#D6BDB8', sw: 1.2 });
  S.sh(null, RR(330, 400, 480, 200, 40), { fill: TIS.fill, line: '#D6BDB8', sw: 1.2 });
  // septa (shared tissue wall) with an interseptal capillary inside, joined by an outer ring
  const septa = [36, 108, 252, 324];
  septa.forEach((d) => { const u = [Math.cos(dg(d)), Math.sin(dg(d))], q = [-u[1], u[0]], p0 = at(98, d), p1 = at(236, d);
    S.sh(R('septum'), poly([[p0[0] + q[0] * 15, p0[1] + q[1] * 15], [p1[0] + q[0] * 15, p1[1] + q[1] * 15], [p1[0] - q[0] * 15, p1[1] - q[1] * 15], [p0[0] - q[0] * 15, p0[1] - q[1] * 15]]), { fill: '#F0DEDA', line: '#C9A7A3', sw: 1.2 });
    vs(S, 'pcap', [at(98, d), at(167, d), at(232, d)], 8, 8, CAP); });
  const ringPts = []; for (let d = 108; d >= -108; d -= 12) ringPts.push(at(232, d));
  vs(S, 'pcap', ringPts, 10, 10, CAP);
  // air spaces: outline pass for the union, then fill pass so the lumen is continuous
  const air = [];
  [0, 72, 144, 216, 288].forEach((d) => { const c = at(140, d); air.push(['alv', E(c[0], c[1], 66, 66)]); air.push(['alv', tube([at(60, d), at(140, d)], 46, 46)]); });
  [[560, -1], [560, 1], [690, -1], [690, 1]].forEach(([x, sg]) => {
    air.push(['alv', E(x, cy + sg * 64, 48, 48)]);
    air.push(['alv', tube([[x, cy], [x, cy + sg * 64]], 20, 20)]);
  });
  [[340, -1], [400, 1]].forEach(([x, sg]) => {
    air.push(['alv', E(x, cy + sg * 62, 38, 38)]);
    air.push(['alv', tube([[x, cy], [x, cy + sg * 62]], 16, 16)]);
  });
  air.push([R('sacc'), E(SX, cy, 82, 82)]);
  air.push([R('duct'), tube([[440, cy], [700, cy], [980, cy]], 40, 40)]);
  air.push([R('rbr'), tube([[290, cy], [350, cy], [450, cy]], 46, 42)]);
  air.push([R('tbr'), tube([[90, cy], [200, cy], [300, cy]], 56, 50)]);
  air.forEach(([, sh]) => S.sh(null, sh, { fill: AIRL, line: AIRL, sw: 4.6 }));
  air.forEach(([id, sh]) => S.sh(id === 'alv' ? R('alv') : id, sh, { fill: AIR, line: AIR, sw: 0.4 }));
  S.sh(null, E(SX, cy, 40, 40), { fill: '#EAF2F3', line: '#EAF2F3', sw: 0.4 });
  // pulmonary artery branch (blue) into the capillary ring, pulmonary vein branch (red) out
  const a0 = at(232, 108), v0 = at(232, -108);
  vs(S, null, [[110, 850], [600, 850], [900, 800], a0], 22, 14, V);
  vs(S, null, [v0, [940, 190], [760, 140], [110, 140]], 14, 22, A);
  S.arrow(300, 850, 0, 12, '#F2EFE8'); S.arrow(300, 140, 180, 12, '#F2EFE8');
  S.arrow(190, cy, 0, 18, '#8AA3AB');
  const sp = at(150, 324), qq = [-Math.sin(dg(324)), Math.cos(dg(324))];
  S.pin(R('respiratory-bronchiole'), R('rbr'), [380, cy]);
  S.pin(R('alveolar-duct'), R('duct'), [600, cy]);
  S.pin(R('alveolar-sac'), R('sacc'), [SX + 20, cy]);
  S.pin(R('alveolus'), R('alv'), [at(150, 0)[0] + 20, cy]);
  S.pin(R('alveolar-septum'), R('septum'), [sp[0] + qq[0] * 9, sp[1] + qq[1] * 9]);
  S.pin(R('pulmonary-capillary'), 'pcap', at(232, 72));
  void rng;
}
plates.push({
  key: 'alveolar-unit', moduleId: MOD, kind: 'tissue-schematic', lessons: ['respiratory-exchange', 'respiratory-airflow'], purpose: 'Respiratory bronchiole to alveolar duct and alveolar sac, alveoli wrapped by a capillary network.',
  title: ['Alveolar unit: bronchiole, duct, sac and alveoli', 'Unidad alveolar: bronquiolo, conducto, saco y alvéolos'],
  desc: ['Schematic, not a lung section. Air passes from a terminal bronchiole (airway only) to a respiratory bronchiole, which has a few alveoli budding from its wall and so begins gas exchange. It continues as an alveolar duct whose wall is nearly all alveoli, ending in an alveolar sac, a cluster of alveoli sharing a common space. Each alveolus is a thin-walled air pocket; the thin shared wall between neighbouring alveoli is the alveolar septum, which carries the capillaries. The air space is one connected lumen: bronchiole, duct, common sac, and alveoli that open into it through wide necks. The mauve pulmonary capillary runs inside the septa and around the outside of the sac, joined to the blood vessels, not through the air. The pulmonary artery branch (blue, bottom, deoxygenated blood from the heart) feeds the capillary and the pulmonary vein branch (red, top, oxygenated blood) drains it: in the lungs the usual colours are reversed. Sizes are not to scale.',
    'Esquema, no un corte de pulmón. El aire pasa de un bronquiolo terminal (solo conducción) a un bronquiolo respiratorio, que tiene algunos alvéolos en su pared y por eso inicia el intercambio de gases. Continúa como conducto alveolar, cuya pared son casi solo alvéolos, y termina en un saco alveolar, un grupo de alvéolos con un espacio común. Cada alvéolo es una bolsa de aire de pared fina; la delgada pared compartida entre alvéolos vecinos es el tabique alveolar, que lleva los capilares. El espacio aéreo es una luz continua: bronquiolo, conducto, saco común y alvéolos que se abren a él por cuellos anchos. El capilar pulmonar malva discurre dentro de los tabiques y por fuera del saco, unido a los vasos sanguíneos, no por el aire. La rama de la arteria pulmonar (azul, abajo, sangre desoxigenada del corazón) alimenta el capilar y la de la vena pulmonar (roja, arriba, sangre oxigenada) lo drena: en el pulmón los colores habituales se invierten. Los tamaños no están a escala.'],
  orientation: ['air flows left to right from the bronchiole to the alveolar sac', 'el aire fluye de izquierda a derecha, del bronquiolo al saco alveolar'], draw: alveoli,
});

// ------------------------------------------------------------ 7 membrane and airway wall
function membrane(S) {
  S.panel(30, 30, 880, 940, 'membrane'); S.panel(930, 30, 490, 940, 'wall');
  S.at('membrane');
  S.sh(null, rect(60, 60, 820, 300), { fill: '#E8F0F1', line: '#E8F0F1', sw: 0.5 });
  S.sh('surf', RR(60, 356, 820, 14, 3), { fill: '#E6D9A0', line: '#B7A453', sw: 1 });
  S.sh('tissue', rect(60, 404, 820, 420), { fill: '#E4CFC0', line: '#A8917C', sw: 1.2 });
  // capillary cut into the septum on the right
  S.sh('endo', RR(420, 424, 440, 130, 40), { fill: '#C2A0AB', line: '#76566A', sw: 1.6 });
  S.sh('cap', RR(432, 436, 416, 106, 32), { fill: '#EBD0CC', line: '#A8817C', sw: 1.2 });
  [[520, 490], [640, 484], [760, 492]].forEach(([x, y], i) => { S.sh(null, E(x, y, 42, 34, i * 20), { fill: '#CC8F88', line: '#8A524D', sw: 1.2 }); S.sh(null, E(x, y, 16, 12, i * 20), { fill: '#E3B5AE', line: '#CC8F88', sw: 0.8 }); });
  S.sh('bm', RR(410, 410, 460, 12, 5), { fill: '#C9B18A', line: '#8A6E3C', sw: 1 });
  // epithelium: thin type I over capillary, type II bump at left, thin type I between
  S.sh('t1', sm([[60, 388], [300, 394], [300, 404], [60, 404]], true, 3), { fill: '#F0E2DC', line: '#A8817C', sw: 1.2 });
  S.sh('t1', sm([[380, 394], [880, 388], [880, 404], [380, 404]], true, 3), { fill: '#F0E2DC', line: '#A8817C', sw: 1.2 });
  S.sh('t2', sm([[250, 404], [250, 372], [292, 360], [340, 366], [356, 392], [346, 404]], true, 4), { fill: '#EBC9BF', line: '#8A524D', sw: 1.6 });
  S.sh(null, E(300, 384, 12, 10), { fill: '#C7867C', line: '#8A524D', sw: 1 });
  [[270, 392], [300, 396], [326, 390]].forEach(([x, y]) => S.sh(null, E(x, y, 6, 5), { fill: '#E6D9A0', line: '#B7A453', sw: 0.8 }));
  // macrophage in the air space
  S.sh('mac', sm([[560, 230], [620, 200], [690, 214], [716, 262], [690, 316], [610, 336], [556, 300]], true, 5), { fill: '#C9BFD8', line: '#6F6381', sw: 1.6 });
  S.sh(null, E(618, 268, 28, 24), { fill: '#8E83A6', line: '#5E5578', sw: 1.2 });
  [[580, 290], [680, 300], [670, 232]].forEach(([x, y]) => S.sh(null, E(x, y, 8, 8), { fill: '#6C6A62', line: '#4C5760', sw: 1 }));
  // elastic fibres in the septum
  [[110, 600, 420, 560], [90, 680, 360, 650], [150, 520, 380, 520]].forEach(([x0, y0, x1, y1]) => S.ln('elast', `M${x0} ${y0}Q${(x0 + x1) / 2} ${y0 + 40} ${x1} ${y1 - 8}`, { color: '#8A6060', w: 3 }));
  S.arrow(500, 330, 90, 14, '#8AA3AB'); S.arrow(800, 600, -90, 14, '#8A949B');
  S.pin(R('surfactant'), 'surf', [180, 363]);
  S.pin(R('type-i-pneumocyte'), 't1', [150, 396]);
  S.pin(R('type-ii-pneumocyte'), 't2', [300, 380]);
  S.pin(R('alveolar-macrophage'), 'mac', [640, 300]);
  S.pin(R('respiratory-membrane'), 'bm', [640, 416]);
  S.pin(R('pulmonary-capillary'), 'cap', [800, 520]);
  S.pin(R('elastic-fiber'), 'elast', [250, 595]);
  // airway wall histology
  S.at('wall');
  const g = rng(5);
  S.sh(null, rect(960, 60, 430, 160), { fill: '#E8F0F1', line: '#E8F0F1', sw: 0.5 });
  S.sh('lam', rect(960, 400, 430, 190), { fill: '#EAD7CB', line: '#A8917C', sw: 1.2 });
  S.sh('epi', rect(960, 260, 430, 140), { fill: '#E7C9C3', line: '#9A6A66', sw: 1.4 });
  for (let i = 0; i < 9; i++) {
    const x = 975 + i * 47;
    if (i === 3 || i === 6) { S.sh('gob', sm([[x + 6, 400], [x - 2, 330], [x + 4, 280], [x + 24, 280], [x + 32, 330], [x + 28, 400]], true, 4), { fill: '#F2ECDA', line: '#B7A453', sw: 1.4 }); continue; }
    S.sh('epi', sm([[x + 4, 400], [x, 330], [x + 4, 262], [x + 26, 262], [x + 30, 330], [x + 26, 400]], true, 3), { fill: '#E2B8B0', line: '#9A6A66', sw: 1.2 });
    S.sh(null, E(x + 15, 340 + (i % 3) * 14, 8, 14), { fill: '#A08AA6', line: '#6F6381', sw: 1 });
    for (let k = 0; k < 4; k++) S.ln(null, `M${x + 6 + k * 6} 262l${(k - 1.5) * 1.5} -26`, { color: '#9A6A66', w: 1.4 });
  }
  S.sh('smus', RR(960, 600, 430, 70, 20), { fill: '#C7867C', line: '#8A524D', sw: 1.6 });
  for (let i = 0; i < 10; i++) S.sh(null, E(985 + i * 42, 635, 16, 6, 0), { fill: '#8E524C', line: '#8E524C', sw: 0.5 });
  S.sh(null, rect(960, 670, 430, 250), { fill: '#EAD7CB', line: '#A8917C', sw: 1.2 });
  [[980, 440, 1380, 470], [990, 520, 1370, 500], [980, 710, 1380, 750], [1000, 820, 1370, 800]].forEach(([x0, y0, x1, y1]) => S.ln('elast2', `M${x0} ${y0}Q${(x0 + x1) / 2} ${y0 + 36} ${x1} ${y1}`, { color: '#8A6060', w: 3 }));
  void g;
  S.pin(R('ciliated-pseudostratified-epithelium'), 'epi', [1010, 330]);
  S.pin(R('goblet-cell'), 'gob', [1167, 330]);
  S.pin(R('smooth-muscle-of-airway'), 'smus', [1170, 635]);
  S.pin(R('elastic-fiber'), 'elast2', [1180, 478]);
}
plates.push({
  key: 'respiratory-membrane-histology', moduleId: MOD, kind: 'tissue-schematic', lessons: ['respiratory-exchange', 'respiratory-histology'], purpose: 'Alveolar wall as a gas-exchange barrier, and the layers of an airway wall.',
  title: ['Respiratory membrane and airway wall', 'Membrana respiratoria y pared de la vía aérea'],
  desc: ['Schematic, not a photomicrograph. Left: a thin slice of alveolar wall, air space on top. A film of surfactant (from type II pneumocytes, the cuboidal cells) lines the surface and lowers surface tension so alveoli do not collapse. Type I pneumocytes are very thin flat cells that cover most of the surface. An alveolar macrophage in the air space engulfs dust and microbes. Where a capillary lies against the wall, the respiratory membrane is thinnest: type I cell, a fused basement membrane and capillary endothelium, only a fraction of a micrometre thick, so oxygen diffuses into the red cells and carbon dioxide out. Elastic fibres in the septum let the lung recoil. Right: airway wall (bronchus): ciliated pseudostratified epithelium with mucus-secreting goblet cells, a lamina propria with elastic fibres, and a band of airway smooth muscle. Simplified; thickness exaggerated.',
    'Esquema, no una fotomicrografía. Izquierda: un corte fino de la pared alveolar, con la luz arriba. Una película de surfactante (de los neumocitos tipo II, células cúbicas) cubre la superficie y reduce la tensión superficial para que los alvéolos no colapsen. Los neumocitos tipo I son células planas muy finas que cubren casi toda la superficie. Un macrófago alveolar en la luz fagocita polvo y microbios. Donde un capilar se apoya en la pared, la membrana respiratoria es más delgada: célula tipo I, membrana basal fusionada y endotelio capilar, de una fracción de micra, de modo que el oxígeno difunde a los eritrocitos y el dióxido de carbono sale. Las fibras elásticas del tabique permiten el retroceso del pulmón. Derecha: pared de la vía aérea (bronquio): epitelio pseudoestratificado ciliado con células caliciformes mucosecretoras, lámina propia con fibras elásticas y una banda de músculo liso de la vía aérea. Simplificado; espesores exagerados.'],
  orientation: ['left: alveolar wall, air at top; right: airway wall, lumen at top', 'izquierda: pared alveolar, aire arriba; derecha: pared de la vía aérea, luz arriba'], draw: membrane,
});
void C; void mir; void full;
