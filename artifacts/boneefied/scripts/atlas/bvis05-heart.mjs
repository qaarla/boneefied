// BVIS05 heart plates: anterior surface, opened section, valves from above, wall/pericardium, coronary anterior/posterior, conduction.
import { C, sm, poly, E, RR, tube, A, V, MY, vs, scale, along } from './bvis05-lib.mjs';

const MOD = 'cardiovascular-system';
export const plates = [];
const FAT = { fill: '#E9DDA8', line: '#9A8A4A' };
const RVC = '#DDB9B2', LVC = '#D2A8A4';
const REFS_NOTE = 'Gross diagram, simplified.';

// ------------------------------------------------------------------ 1 anterior heart
function drawAnt(S, o = {}) {
  const q = o.quiet;
  // descending aorta continues behind the heart (visible only beside the left border)
  vs(S, q ? null : 'cv-descending-aorta', [[897, 330], [935, 400], [962, 520], [968, 700], [962, 900]], 52, 50, A);
  vs(S, q ? null : 'cv-right-pulmonary-artery', [[805, 335], [740, 340], [660, 335], [580, 330], [500, 335]], 44, 38, V);
  vs(S, q ? null : 'cv-pulmonary-veins', [[540, 450], [460, 445], [400, 435]], 34, 32, A);
  vs(S, q ? null : 'cv-pulmonary-veins', [[880, 440], [950, 430], [1000, 420]], 32, 30, A);
  vs(S, q ? null : 'cv-ivc', [[545, 640], [540, 700], [538, 780]], 56, 56, V);
  S.sh('rv', sm([[540, 470], [640, 445], [740, 435], [775, 445], [790, 560], [800, 700], [800, 860], [700, 845], [610, 795], [550, 725], [520, 610]]), { fill: RVC, line: MY.line, sw: 2.2 });
  S.sh('lv', sm([[775, 445], [860, 440], [925, 495], [945, 620], [905, 765], [835, 842], [800, 862], [800, 700], [790, 560]]), { fill: LVC, line: MY.line, sw: 2.2 });
  S.sh('apex', sm([[802, 850], [835, 830], [856, 796], [836, 780], [806, 802]], true, 4), { fill: '#C9A09C', line: '#C9A09C', sw: 0.5 });
  S.sh('ra', sm([[500, 390], [560, 375], [640, 405], [650, 470], [640, 560], [615, 645], [560, 655], [512, 605], [492, 500]]), { fill: '#D4B2AE', line: MY.line, sw: 2.2 });
  vs(S, q ? null : 'cv-ascending-aorta', [[722, 445], [705, 350], [705, 260], [715, 215]], 62, 60, A);
  vs(S, q ? null : 'cv-aortic-arch', [[705, 255], [712, 190], [755, 150], [820, 148], [875, 190], [895, 260], [897, 345]], 60, 58, A);
  vs(S, q ? null : 'cv-brachiocephalic', [[740, 156], [700, 110], [670, 65]], 34, 30, A);
  vs(S, q ? null : 'cv-left-common-carotid', [[790, 149], [790, 110], [790, 64]], 30, 28, A);
  vs(S, q ? null : 'cv-left-subclavian', [[838, 163], [870, 110], [900, 66]], 30, 28, A);
  vs(S, q ? null : 'cv-left-pulmonary-artery', [[805, 335], [860, 348], [930, 352], [995, 368]], 38, 32, V);
  vs(S, q ? null : 'cv-svc', [[565, 62], [565, 220], [568, 330], [570, 410]], 52, 52, V);
  const tr = tube([[772, 445], [788, 390], [800, 340], [805, 322]], 74, 68);
  S.sh(q ? null : 'cv-pulmonary-trunk', tr, { fill: V.fill, line: V.line, sw: 1.2 });
  S.sh(q ? null : 'cv-pulmonary-trunk', E(805, 322, 34, 20), { fill: V.fill, line: V.line, sw: 1.2 });
  S.sh(q ? null : 'cv-pulmonary-trunk', tube([[790, 380], [805, 322]], 62, 62), { fill: V.fill, line: V.fill, sw: 0.5 });
  if (!o.noSulcus) vs(S, 'sulcus', [[612, 648], [640, 590], [650, 500], [665, 460], [720, 448], [775, 448], [860, 445], [925, 498]], 10, 10, FAT);
  if (o.coronary) o.coronary(S);
  S.sh(q ? null : 'rauricle', sm([[600, 392], [630, 352], [690, 350], [712, 390], [692, 440], [652, 456], [622, 440]], true, 6), { fill: '#D9BAB6', line: MY.line, sw: 2 });
  S.sh(q ? null : 'lauricle', sm([[832, 402], [870, 372], [920, 382], [936, 422], [902, 462], [852, 456]], true, 6), { fill: '#D9BAB6', line: MY.line, sw: 2 });
}
const T1 = ([x, y]) => [x - 200, y];
function antHeart(S) {
  S.panel(30, 30, 990, 940, 'anterior'); S.panel(1040, 30, 380, 940, 'axis');
  S.at('anterior'); S.beginT(-200, 0, 1); drawAnt(S); S.endT();
  S.pin('cv-heart', 'rv', T1([660, 640]));
  S.pin('cv-apex', 'apex', T1([830, 812]));
  S.pin('cv-coronary-sulcus', 'sulcus', T1([650, 505]));
  S.pin('cv-right-auricle', 'rauricle', T1([655, 395]));
  S.pin('cv-left-auricle', 'lauricle', T1([890, 410]));
  S.pin('cv-right-atrium', 'ra', T1([560, 520]));
  S.pin('cv-right-ventricle', 'rv', T1([700, 700]));
  S.pin('cv-left-ventricle', 'lv', T1([880, 600]));
  S.pin('cv-pulmonary-trunk', 'cv-pulmonary-trunk', T1([785, 390]));
  S.pin('cv-svc', 'cv-svc', T1([565, 160]));
  S.pin('cv-ivc', 'cv-ivc', T1([540, 720]));
  S.pin('cv-ascending-aorta', 'cv-ascending-aorta', T1([706, 300]));
  S.pin('cv-aortic-arch', 'cv-aortic-arch', T1([820, 148]));
  S.pin('cv-brachiocephalic', 'cv-brachiocephalic', T1([700, 110]));
  S.pin('cv-left-common-carotid', 'cv-left-common-carotid', T1([790, 95]));
  S.pin('cv-left-subclavian', 'cv-left-subclavian', T1([872, 108]));
  S.pin('cv-right-pulmonary-artery', 'cv-right-pulmonary-artery', T1([590, 330]));
  S.pin('cv-left-pulmonary-artery', 'cv-left-pulmonary-artery', T1([930, 352]));
  S.pin('cv-pulmonary-veins', 'cv-pulmonary-veins', T1([440, 442]));
  S.pin('cv-descending-aorta', 'cv-descending-aorta', T1([962, 700]));
  // axis panel
  S.at('axis');
  S.sh('silh', sm([[1110, 330], [1230, 290], [1330, 330], [1345, 430], [1340, 600], [1320, 740], [1300, 810], [1230, 720], [1130, 580], [1090, 430]]), { fill: MY.fill, line: MY.line, sw: 2.2 });
  S.sh('base', sm([[1110, 330], [1230, 290], [1330, 330], [1345, 430], [1200, 448], [1090, 430]]), { fill: '#D9C6B8', line: MY.line, sw: 2 });
  S.sh('apex2', sm([[1300, 812], [1322, 742], [1312, 696], [1265, 706], [1250, 746]]), { fill: '#C9A09C', line: MY.line, sw: 2 });
  S.ln(null, 'M1215 380L1297 800', { color: C.ink, w: 2.2, dash: '9 6' });
  S.arrow(1297, 790, 78, 15, C.ink);
  S.pin('cv-base', 'base', [1220, 370]);
  S.pin('cv-apex', 'apex2', [1288, 760]);
}
plates.push({
  key: 'heart-anterior', moduleId: MOD, kind: 'gross-diagram', lessons: ['cv-orientation', 'cv-chambers', 'cv-great-vessels'], purpose: 'Anterior surface of the heart: orientation, apex and base, chambers seen from the front and the great vessels.',
  title: ['Heart from the front: chambers, apex and great vessels', 'Corazón visto de frente: cámaras, vértice y grandes vasos'],
  desc: ['Anterior view, patient right at viewer left. The right atrium forms the right border and the right ventricle most of the front; the left ventricle forms the left border and apex, which points down and to the left. Only the auricles of the atria show in front; the coronary sulcus (fat-filled groove) separates atria from ventricles. The superior vena cava and inferior vena cava enter the right atrium; the pulmonary trunk leaves the right ventricle and splits into right and left pulmonary arteries. Colour follows oxygenation: pulmonary arteries carry deoxygenated blood and are blue; pulmonary veins carry oxygenated blood and are red. The ascending aorta rises behind the pulmonary trunk, arches to the left and gives the brachiocephalic, left common carotid and left subclavian arteries; the descending aorta runs behind the heart. Right panel: heart axis, base (broad upper surface, mostly left atrium, facing back) and apex. ' + REFS_NOTE,
    'Vista anterior, derecha del paciente a la izquierda del observador. La aurícula derecha forma el borde derecho y el ventrículo derecho la mayor parte de la cara anterior; el ventrículo izquierdo forma el borde izquierdo y el vértice, que apunta hacia abajo y a la izquierda. Solo se ven las orejuelas de las aurículas; el surco coronario (surco con grasa) separa aurículas y ventrículos. Las venas cavas superior e inferior entran en la aurícula derecha; el tronco pulmonar sale del ventrículo derecho y se divide en arterias pulmonares derecha e izquierda. El color sigue la oxigenación: las arterias pulmonares llevan sangre desoxigenada y son azules; las venas pulmonares llevan sangre oxigenada y son rojas. La aorta ascendente sube detrás del tronco pulmonar, forma el arco hacia la izquierda y da el tronco braquiocefálico, la carótida común izquierda y la subclavia izquierda; la aorta descendente discurre detrás del corazón. Panel derecho: eje del corazón, base (superficie superior ancha, sobre todo aurícula izquierda, dirigida hacia atrás) y vértice. Diagrama macroscópico simplificado.'],
  orientation: ['anterior view; patient right at viewer left; right panel shows the long axis from base to apex', 'vista anterior; derecha del paciente a la izquierda; el panel derecho muestra el eje de base a vértice'], draw: antHeart,
});

// ------------------------------------------------------------------ 2/7 opened heart (shared base)
const OUT = [[260, 380], [400, 310], [560, 290], [720, 320], [850, 400], [900, 520], [890, 680], [830, 810], [760, 880], [660, 850], [520, 760], [380, 630], [280, 500]];
const RA = [[285, 400], [390, 335], [505, 318], [545, 340], [548, 470], [500, 505], [400, 505], [305, 465]];
const LA = [[580, 342], [690, 330], [790, 362], [828, 420], [815, 470], [775, 498], [690, 505], [582, 498]];
const RV = [[345, 520], [420, 512], [540, 518], [580, 612], [620, 720], [650, 800], [610, 808], [525, 745], [430, 655], [372, 585]];
const LV = [[586, 520], [690, 505], [790, 520], [815, 600], [805, 700], [780, 780], [735, 830], [700, 815], [666, 720], [626, 612]];
function sectionBase(S, o = {}) {
  const ids = !o.plain;
  const outer = sm(OUT);
  S.sh(ids ? 'epi' : null, outer, { fill: '#E4D5A2', line: '#9A8A4A', sw: 2.2 });
  S.sh(ids ? 'myo' : null, sm(scale(OUT, 0.972, [570, 590])), { fill: MY.fill, line: MY.line, sw: 1.2 });
  S.sh(ids ? 'ias' : null, poly([[545, 322], [580, 322], [582, 500], [548, 505]]), { fill: '#CFA6A2', line: MY.line, sw: 1 });
  S.sh(ids ? 'ivs' : null, poly([[540, 518], [580, 612], [620, 720], [650, 800], [700, 815], [666, 720], [626, 612], [586, 520]]), { fill: '#CFA6A2', line: MY.line, sw: 1 });
  for (const ch of [RA, LA, RV, LV]) S.ln(ids ? 'endo' : null, sm(ch), { color: '#EBD0CC', w: 14 });
  const blue = '#B2C3D4', red = '#DCA9A6', ln = '#6F6068';
  S.sh(ids ? 'ra' : null, sm(RA), { fill: blue, line: ln, sw: 1 });
  S.sh(ids ? 'la' : null, sm(LA), { fill: red, line: ln, sw: 1 });
  S.sh(ids ? 'rv' : null, sm(RV), { fill: blue, line: ln, sw: 1 });
  S.sh(ids ? 'lv' : null, sm(LV), { fill: red, line: ln, sw: 1 });
  // great veins stubs
  vs(S, ids ? 'cv-pulmonary-veins' : null, [[690, 345], [700, 260], [700, 190]], 40, 40, A);
  vs(S, null, [[418, 345], [418, 260], [418, 190]], 46, 46, V);
  // valves
  const lf = { fill: '#EDE2CC', line: '#8B8168', sw: 1.4 };
  S.sh(ids ? 'tri' : null, poly([[362, 510], [440, 512], [428, 590]]), lf);
  S.sh(ids ? 'tri' : null, poly([[460, 512], [545, 516], [505, 592]]), lf);
  S.sh(ids ? 'mit' : null, poly([[600, 508], [690, 510], [672, 612]]), lf);
  S.sh(ids ? 'mit' : null, poly([[702, 510], [792, 516], [772, 600]]), lf);
  S.sh(ids ? 'pap' : null, E(440, 655, 17, 28, -35), { fill: '#C79E9A', line: MY.line, sw: 1.4 });
  S.sh(ids ? 'pap' : null, E(790, 700, 26, 38, 18), { fill: '#C79E9A', line: MY.line, sw: 1.4 });
  S.sh(ids ? 'pap' : null, E(745, 790, 24, 28, 10), { fill: '#C79E9A', line: MY.line, sw: 1.4 });
  const ch = (a, b) => S.ln(ids ? 'chordae' : null, `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`, { color: '#8B8168', w: 1.6 });
  ch([428, 590], [440, 640]); ch([505, 592], [448, 640]); ch([672, 612], [778, 670]); ch([772, 600], [786, 668]); ch([650, 600], [745, 770]); ch([730, 598], [748, 768]);
}
const T2 = ([x, y]) => [x + 155, y - 40];
function heartSection(S) {
  S.panel(30, 30, 1390, 940, 'section');
  S.beginT(155, -40, 1); sectionBase(S);
  S.arrow(440, 430, 90, 17, '#5F7C99'); S.arrow(700, 430, 90, 17, '#A35F5C'); S.arrow(480, 590, 70, 15, '#5F7C99'); S.arrow(690, 612, 70, 15, '#A35F5C');
  S.endT();
  [['cv-right-atrium', 'ra', [400, 420]], ['cv-left-atrium', 'la', [700, 420]], ['cv-right-ventricle', 'rv', [450, 560]], ['cv-left-ventricle', 'lv', [740, 650]],
    ['cv-interatrial-septum', 'ias', [563, 400]], ['cv-interventricular-septum', 'ivs', [640, 700]], ['cv-tricuspid', 'tri', [440, 540]], ['cv-mitral', 'mit', [690, 540]],
    ['cv-chordae', 'chordae', [435, 620]], ['cv-papillary', 'pap', [790, 700]], ['cv-myocardium', 'myo', [855, 600]], ['cv-endocardium', 'endo', [818, 600]], ['cv-epicardium', 'epi', [280, 470]], ['cv-pulmonary-veins', 'cv-pulmonary-veins', [700, 250]]]
    .forEach(([id, k, h]) => S.pin(id, k, T2(h)));
}
plates.push({
  key: 'heart-chambers-valves', moduleId: MOD, kind: 'gross-diagram', lessons: ['cv-chambers', 'cv-valves'], purpose: 'Four chambers, atrioventricular valves, chordae and papillary muscles, wall layers and the direction of blood flow in an opened heart.',
  title: ['Opened heart: chambers, valves and flow', 'Corazón abierto: cámaras, válvulas y flujo'],
  desc: ['Frontal section of the heart seen from the front, patient right at viewer left. Blue-toned right atrium and right ventricle receive and pump deoxygenated blood; red-toned left atrium and left ventricle handle oxygenated blood. Blood flows atrium to ventricle through the tricuspid valve (three leaflets, right) and mitral valve (two leaflets, left); leaflet edges are tethered by chordae tendineae to papillary muscles, which stop the valves everting. The interatrial septum divides the atria, the thicker interventricular septum the ventricles. The left ventricular myocardium is much thicker than the right. Wall layers from outside in: epicardium, myocardium, endocardium (thin lining on every chamber). Arrows show forward flow. The aortic and pulmonary valves lie out of this plane (next plate). ' + REFS_NOTE,
    'Corte frontal del corazón visto de frente, derecha del paciente a la izquierda. La aurícula y el ventrículo derechos (tono azul) reciben e impulsan sangre desoxigenada; la aurícula y el ventrículo izquierdos (tono rojo) manejan sangre oxigenada. La sangre pasa de aurícula a ventrículo por la válvula tricúspide (tres valvas, derecha) y la mitral (dos valvas, izquierda); los bordes de las valvas se anclan por las cuerdas tendinosas a los músculos papilares, que impiden su eversión. El tabique interauricular separa las aurículas y el interventricular, más grueso, los ventrículos. El miocardio del ventrículo izquierdo es mucho más grueso que el derecho. Capas de la pared de fuera adentro: epicardio, miocardio y endocardio (revestimiento fino de cada cámara). Las flechas muestran el flujo hacia delante. Las válvulas aórtica y pulmonar quedan fuera de este plano (siguiente lámina). Diagrama macroscópico simplificado.'],
  orientation: ['frontal section from the front; patient right at viewer left; apex down and to viewer right', 'corte frontal visto de frente; derecha del paciente a la izquierda; vértice abajo y a la derecha del observador'], draw: heartSection,
});

// ------------------------------------------------------------------ 3 valves from above
function valvesTop(S) {
  S.panel(30, 30, 1390, 940, 'superior');
  const FB = '#E3D9C4';
  S.sh(null, sm([[330, 560], [400, 330], [650, 190], [940, 220], [1130, 380], [1160, 640], [1000, 830], [720, 880], [450, 800]]), { fill: '#D6AFAA', line: MY.line, sw: 2.2 });
  S.sh(null, sm([[430, 540], [470, 360], [660, 270], [920, 290], [1060, 420], [1070, 620], [950, 760], [720, 800], [500, 740]]), { fill: '#CFA7A2', line: '#A8817C', sw: 1.2 });
  const ring = (key, cx, cy, r, n, rot, fill) => {
    S.sh(key, E(cx, cy, r + 16, r + 16), { fill: FB, line: '#8B8168', sw: 1.8 });
    S.sh(key, E(cx, cy, r, r), { fill: '#C6B49A', line: '#8B8168', sw: 1.2 });
    for (let i = 0; i < n; i++) {
      const a0 = rot + (i * 360) / n, a1 = rot + ((i + 1) * 360) / n, pt = (a, rr) => [cx + rr * Math.cos((a * Math.PI) / 180), cy + rr * Math.sin((a * Math.PI) / 180)];
      S.sh(key, poly([[cx, cy], pt(a0, r - 3), pt((a0 + a1) / 2, r + 0.5), pt(a1, r - 3)]), { fill, line: '#8B8168', sw: 1.6 });
    }
  };
  ring('pul', 820, 340, 70, 3, 100, '#EBDDCB');
  ring('ao', 690, 490, 74, 3, 90, '#EBDDCB');
  // tricuspid (3 leaflets) and mitral (2 leaflets)
  S.sh('tri', E(480, 560, 98, 84, -10), { fill: FB, line: '#8B8168', sw: 1.8 });
  S.sh('tri', E(480, 560, 78, 64, -10), { fill: '#C6B49A', line: '#8B8168', sw: 1.2 });
  for (const a of [210, 330, 90]) { const p = (rr) => [480 + rr * Math.cos((a * Math.PI) / 180), 560 + rr * 0.85 * Math.sin((a * Math.PI) / 180)]; S.sh('tri', poly([[480, 560], p(76), p(81)].concat([[480 + 70 * Math.cos(((a + 60) * Math.PI) / 180), 560 + 60 * Math.sin(((a + 60) * Math.PI) / 180)]])), { fill: '#EBDDCB', line: '#8B8168', sw: 1.4 }); }
  S.sh('mit', E(880, 650, 110, 78, 12), { fill: FB, line: '#8B8168', sw: 1.8 });
  S.sh('mit', E(880, 650, 90, 58, 12), { fill: '#C6B49A', line: '#8B8168', sw: 1.2 });
  S.sh('mit', poly([[800, 636], [870, 600], [930, 618], [960, 650], [900, 650], [810, 660]]), { fill: '#EBDDCB', line: '#8B8168', sw: 1.4 });
  S.sh('mit', poly([[810, 668], [900, 664], [958, 664], [940, 692], [880, 706], [820, 690]]), { fill: '#EBDDCB', line: '#8B8168', sw: 1.4 });
  // coronary ostia from the aortic sinuses (right sinus faces upper left, left sinus upper right)
  const ost = (id, ang, len, w) => { const a = (ang * Math.PI) / 180, p = (r) => [690 + r * Math.cos(a), 490 + r * Math.sin(a)]; vs(S, id, [p(70), p(len)], w, w, A); };
  ost('cv-right-coronary', -150, 125, 14);
  ost('cv-left-coronary', -38, 120, 16);
  S.sh('cv-right-coronary', E(690 + 66 * Math.cos((-150 * Math.PI) / 180), 490 + 66 * Math.sin((-150 * Math.PI) / 180), 8, 8), { fill: '#7E4A49', line: '#7E4A49', sw: 1 });
  S.sh('cv-left-coronary', E(690 + 66 * Math.cos((-38 * Math.PI) / 180), 490 + 66 * Math.sin((-38 * Math.PI) / 180), 8, 8), { fill: '#7E4A49', line: '#7E4A49', sw: 1 });
  S.pin('cv-pulmonary-valve', 'pul', [820, 400]);
  S.pin('cv-aortic-valve', 'ao', [690, 540]);
  S.pin('cv-tricuspid', 'tri', [440, 610]);
  S.pin('cv-mitral', 'mit', [900, 665]);
  S.pin('cv-right-coronary', 'cv-right-coronary', [596, 427]);
  S.pin('cv-left-coronary', 'cv-left-coronary', [800, 420]);
}
plates.push({
  key: 'heart-valves-superior', moduleId: MOD, kind: 'gross-diagram', lessons: ['cv-valves', 'cv-coronary'], purpose: 'The four valves in one plane seen from above with the atria and great vessels removed, and the coronary ostia in the aortic sinuses.',
  title: ['Valves of the heart from above', 'Válvulas del corazón vistas desde arriba'],
  desc: ['Superior view of the heart base after removal of the atria and great vessels; anterior at the top, patient right at viewer left. The pulmonary valve lies in front and to the left of the central aortic valve; the tricuspid valve lies to the right and the mitral valve behind and to the left. The pulmonary and aortic valves each have three semilunar cusps; the tricuspid valve has three leaflets and the mitral valve two. All four rings are bound by the fibrous skeleton (pale ring). The right coronary artery arises from the right aortic sinus and the left coronary artery from the left aortic sinus, just above the cusps; the third (non-coronary) sinus faces backward. Simplified, valves drawn closed in one plane for comparison.',
    'Vista superior de la base del corazón sin aurículas ni grandes vasos; anterior arriba, derecha del paciente a la izquierda. La válvula pulmonar queda delante y a la izquierda de la válvula aórtica central; la tricúspide a la derecha y la mitral detrás y a la izquierda. Las válvulas pulmonar y aórtica tienen tres válvulas semilunares; la tricúspide tiene tres valvas y la mitral dos. Los cuatro anillos se unen al esqueleto fibroso (anillo pálido). La arteria coronaria derecha nace del seno aórtico derecho y la izquierda del seno aórtico izquierdo, justo por encima de las valvas; el tercer seno (no coronario) mira hacia atrás. Simplificado, con las válvulas cerradas en un plano para compararlas.'],
  orientation: ['superior view; anterior at top; patient right at viewer left', 'vista superior; anterior arriba; derecha del paciente a la izquierda'], draw: valvesTop,
});

// ------------------------------------------------------------------ 4 pericardium and wall
function wallPlate(S) {
  S.panel(30, 30, 690, 940, 'sac'); S.panel(740, 30, 680, 940, 'wall'); S.at('sac');
  // pericardial sac around heart (coronal)
  S.sh('fib', sm([[375, 140], [570, 120], [650, 260], [680, 520], [650, 760], [520, 890], [330, 900], [150, 790], [90, 560], [130, 300], [230, 170]]), { fill: '#E3D9C4', line: '#8B8168', sw: 2.4 });
  S.sh('par', sm([[375, 160], [555, 142], [630, 270], [658, 520], [628, 745], [510, 868], [335, 878], [170, 775], [115, 560], [150, 315], [245, 190]]), { fill: '#EAD3CB', line: '#A8817C', sw: 1.6 });
  S.sh('cav', sm([[375, 178], [540, 162], [610, 280], [636, 520], [606, 730], [500, 848], [338, 858], [188, 760], [136, 560], [168, 330], [258, 206]]), { fill: '#EEE6EA', line: '#CDB9BF', sw: 1 });
  S.sh('epi', sm([[375, 196], [525, 182], [590, 290], [616, 520], [586, 715], [492, 830], [342, 840], [206, 746], [156, 560], [186, 345], [270, 225]]), { fill: '#E4D5A2', line: '#9A8A4A', sw: 1.4 });
  S.sh('myo', sm([[375, 216], [510, 204], [570, 300], [594, 520], [566, 700], [482, 806], [346, 818], [226, 732], [178, 560], [204, 360], [282, 244]]), { fill: MY.fill, line: MY.line, sw: 1.4 });
  S.sh('lum', sm([[380, 290], [480, 280], [520, 340], [540, 520], [520, 660], [450, 740], [350, 750], [270, 680], [236, 560], [254, 410], [310, 322]]), { fill: '#C9B8C0', line: '#7E6670', sw: 1 });
  vs(S, 'cv-aortic-arch', [[400, 232], [420, 120], [470, 60]], 36, 34, A);
  S.pin('cv-fibrous-pericardium', 'fib', [100, 560]);
  S.at('sac'); S.pin('cv-pericardial-cavity', 'cav', [616, 520]);
  // wall layer stack (outside at top, lumen at bottom)
  S.at('wall');
  const L = (k, y, h, fill, line, pk) => S.sh(pk ?? k, RR(790, y, 580, h, 8), { fill, line, sw: 1.4 });
  L('fibw', 90, 130, '#E3D9C4', '#8B8168');
  for (let i = 0; i < 9; i++) S.ln(null, `M${800 + i * 62} 110Q${830 + i * 62} 150 ${800 + i * 62 + 40} 200`, { color: '#B4A888', w: 2, op: 0.8 });
  L('parw', 226, 34, '#EAD3CB', '#A8817C');
  L('cavw', 266, 66, '#EEE6EA', '#CDB9BF');
  L('epiw', 338, 40, '#E4D5A2', '#9A8A4A');
  L('myow', 384, 340, MY.fill, MY.line);
  for (let i = 0; i < 7; i++) S.ln(null, `M800 ${420 + i * 46}Q1080 ${400 + i * 46 + (i % 2 ? 30 : -30)} 1360 ${420 + i * 46}`, { color: '#B58B87', w: 1.4, op: 0.8 });
  L('endow', 730, 40, '#EBD0CC', '#A8817C');
  L('lumw', 776, 160, '#DCA9A6', '#A35F5C');
  S.arrow(1080, 856, 0, 18, '#A35F5C');
  S.pin('cv-fibrous-pericardium', 'fibw', [1000, 150]);
  S.pin('cv-serous-pericardium', 'parw', [1100, 243]);
  S.pin('cv-pericardial-cavity', 'cavw', [1100, 300]);
  S.pin('cv-epicardium', 'epiw', [1100, 358]);
  S.pin('cv-myocardium', 'myow', [1100, 560]);
  S.pin('cv-endocardium', 'endow', [1100, 750]);
  S.at('sac'); S.pin('cv-myocardium', 'myo', [200, 460]); S.pin('cv-serous-pericardium', 'par', [640, 520]);
}
plates.push({
  key: 'heart-wall-pericardium', moduleId: MOD, kind: 'gross-diagram', lessons: ['cv-valves', 'cv-chambers'], purpose: 'Pericardial sac and the layered heart wall, with the pericardial cavity as a potential space drawn open.',
  title: ['Pericardium and layers of the heart wall', 'Pericardio y capas de la pared del corazón'],
  desc: ['Left: heart in its pericardial sac (coronal schematic). The tough fibrous pericardium forms the outer bag; inside it the serous pericardium has a parietal layer lining the fibrous sac and a visceral layer (the epicardium) on the heart, with the pericardial cavity between them. In life the cavity holds only a thin film of serous fluid; it is drawn as a wide gap here for clarity. Right: the wall from outside to lumen: fibrous pericardium, parietal serous layer, pericardial cavity, epicardium, thick myocardium (cardiac muscle) and the thin endocardium lining the blood-filled chamber. Schematic, layer thicknesses exaggerated.',
    'Izquierda: corazón en su saco pericárdico (esquema coronal). El pericardio fibroso, resistente, forma la bolsa externa; dentro, el pericardio seroso tiene una capa parietal que tapiza el saco fibroso y una capa visceral (el epicardio) sobre el corazón, con la cavidad pericárdica entre ambas. En vida la cavidad solo contiene una fina película de líquido seroso; aquí se dibuja como un hueco amplio para mayor claridad. Derecha: la pared de fuera a la luz: pericardio fibroso, capa serosa parietal, cavidad pericárdica, epicardio, miocardio grueso (músculo cardíaco) y el endocardio fino que reviste la cámara con sangre. Esquema, con espesores exagerados.'],
  orientation: ['left: coronal schematic of heart in sac; right: wall layers, outside at top', 'izquierda: esquema coronal; derecha: capas de la pared, exterior arriba'], draw: wallPlate,
});

// ------------------------------------------------------------------ 5 coronary anterior
function corAnt(S) {
  S.panel(30, 30, 1390, 940, 'anterior');
  const cor = (S2) => {
    vs(S2, 'cv-great-cardiac-vein', [[822, 790], [822, 700], [820, 580], [818, 505], [826, 478], [865, 482], [912, 508], [928, 548]], 10, 9, V);
    vs(S2, 'cv-right-coronary', [[705, 445], [665, 458], [650, 500], [642, 560], [620, 640], [600, 668]], 12, 11, A);
    vs(S2, 'cv-right-marginal', [[614, 654], [586, 704], [602, 768], [660, 818], [738, 846]], 10, 8, A);
    vs(S2, 'cv-circumflex', [[792, 462], [850, 460], [902, 486], [930, 536]], 11, 9, A);
    vs(S2, 'cv-lad', [[792, 462], [794, 520], [796, 600], [798, 700], [800, 800], [796, 850]], 12, 9, A);
    vs(S2, 'cv-left-coronary', [[762, 430], [776, 446], [792, 464]], 14, 14, A);
  };
  drawAnt(S, { quiet: true, noSulcus: true, coronary: cor });
  S.pin('cv-right-coronary', 'cv-right-coronary', [645, 530]);
  S.pin('cv-right-marginal', 'cv-right-marginal', [596, 750]);
  S.pin('cv-left-coronary', 'cv-left-coronary', [776, 446]);
  S.pin('cv-lad', 'cv-lad', [797, 650]);
  S.pin('cv-circumflex', 'cv-circumflex', [880, 468]);
  S.pin('cv-great-cardiac-vein', 'cv-great-cardiac-vein', [821, 740]);
}
plates.push({
  key: 'coronary-anterior', moduleId: MOD, kind: 'gross-diagram', lessons: ['cv-coronary'], purpose: 'Coronary arteries and the great cardiac vein on the front of the heart.',
  title: ['Coronary vessels, anterior surface', 'Vasos coronarios, cara anterior'],
  desc: ['Anterior view, patient right at viewer left. The right coronary artery arises from the right aortic sinus, runs in the right atrioventricular groove under the right auricle and gives the right marginal artery along the lower border of the right ventricle. The short left main coronary artery arises from the left aortic sinus behind the pulmonary trunk and divides into the left anterior descending artery (LAD), in the anterior interventricular groove toward the apex, and the circumflex artery in the left atrioventricular groove. The great cardiac vein accompanies the LAD up the interventricular groove, then follows the circumflex around the left side to the back of the heart. The coronary sinus and middle cardiac vein are on the posterior plate. Arteries red, vein blue; great vessels are unlabelled context. Simplified.',
    'Vista anterior, derecha del paciente a la izquierda. La arteria coronaria derecha nace del seno aórtico derecho, discurre por el surco auriculoventricular derecho bajo la orejuela derecha y da la arteria marginal derecha por el borde inferior del ventrículo derecho. La arteria coronaria izquierda (tronco común), corta, nace del seno aórtico izquierdo detrás del tronco pulmonar y se divide en la arteria descendente anterior izquierda (DAI), en el surco interventricular anterior hacia el vértice, y la arteria circunfleja en el surco auriculoventricular izquierdo. La vena cardíaca magna acompaña a la DAI por el surco interventricular y luego sigue a la circunfleja alrededor del lado izquierdo hasta la parte posterior. El seno coronario y la vena cardíaca media están en la lámina posterior. Arterias rojas, vena azul; los grandes vasos sin marcador son contexto. Simplificado.'],
  orientation: ['anterior view; patient right at viewer left', 'vista anterior; derecha del paciente a la izquierda'], draw: corAnt,
});

// ------------------------------------------------------------------ 6 coronary posterior
function corPost(S) {
  S.panel(30, 30, 1390, 940, 'posterior');
  const sx = -60; // slight centering
  S.beginT(sx, 0, 1);
  const T = ([x, y]) => [x + sx, y];
  vs(S, 'cv-svc', [[985, 440], [990, 300], [995, 60]], 52, 52, V);
  vs(S, 'cv-ivc', [[1000, 610], [1004, 700], [1006, 800]], 50, 50, V);
  for (const p of [[[880, 345], [960, 335], [1050, 320], [1130, 300]], [[890, 410], [960, 405], [1050, 412], [1130, 420]], [[510, 335], [440, 310], [370, 290]], [[505, 430], [430, 440], [360, 445]]]) vs(S, 'cv-pulmonary-veins', p, 34, 32, A);
  S.sh('lv', sm([[470, 560], [560, 540], [690, 550], [722, 640], [735, 760], [715, 860], [690, 885], [620, 870], [560, 800], [490, 700]]), { fill: LVC, line: MY.line, sw: 2.2 });
  S.sh('rv', sm([[748, 560], [860, 545], [950, 570], [960, 650], [925, 745], [850, 815], [740, 868], [722, 760], [735, 640]]), { fill: RVC, line: MY.line, sw: 2.2 });
  S.sh('la', sm([[520, 300], [640, 270], [790, 285], [880, 330], [905, 420], [870, 505], [740, 535], [600, 525], [510, 470], [495, 380]]), { fill: '#D4B2AE', line: MY.line, sw: 2.2 });
  S.sh('ra', sm([[905, 450], [960, 430], [1020, 455], [1035, 520], [1010, 610], [950, 640], [915, 590], [905, 520]]), { fill: '#D4B2AE', line: MY.line, sw: 2.2 });
  vs(S, 'groove', [[732, 588], [722, 700], [706, 870]], 52, 40, FAT);
  vs(S, 'cv-middle-cardiac-vein', [[704, 856], [708, 780], [716, 690], [720, 592], [722, 566]], 10, 10, V);
  vs(S, 'cv-posterior-interventricular', [[716, 848], [726, 780], [738, 690], [742, 640], [742, 606]], 10, 9, A);
  vs(S, 'cv-great-cardiac-vein', [[398, 604], [440, 572], [486, 549]], 14, 18, V);
  vs(S, 'cv-coronary-sinus', [[486, 548], [560, 549], [660, 560], [760, 570], [850, 588], [930, 606]], 32, 34, V);
  vs(S, 'cv-circumflex', [[410, 650], [460, 612], [520, 582], [610, 584], [690, 590]], 11, 9, A);
  vs(S, 'cv-right-coronary', [[950, 702], [900, 670], [840, 646], [790, 628], [742, 606]], 12, 11, A);
  vs(S, 'cv-small-cardiac-vein', [[958, 660], [945, 635], [930, 608]], 9, 9, V);
  S.endT();
  S.pin('cv-coronary-sinus', 'cv-coronary-sinus', T([700, 565]));
  S.pin('cv-middle-cardiac-vein', 'cv-middle-cardiac-vein', T([710, 770]));
  S.pin('cv-posterior-interventricular', 'cv-posterior-interventricular', T([733, 720]));
  S.pin('cv-small-cardiac-vein', 'cv-small-cardiac-vein', T([950, 640]));
  S.pin('cv-great-cardiac-vein', 'cv-great-cardiac-vein', T([430, 580]));
  S.pin('cv-circumflex', 'cv-circumflex', T([540, 584]));
  S.pin('cv-right-coronary', 'cv-right-coronary', T([845, 646]));
  S.pin('cv-pulmonary-veins', 'cv-pulmonary-veins', T([1060, 318]));
  S.pin('cv-ivc', 'cv-ivc', T([1004, 740]));
  S.pin('cv-svc', 'cv-svc', T([990, 200]));
}
plates.push({
  key: 'coronary-posterior', moduleId: MOD, kind: 'gross-diagram', lessons: ['cv-coronary', 'cv-great-vessels'], purpose: 'Posterior (diaphragmatic) surface: coronary sinus in the left atrioventricular groove, middle and small cardiac veins and the posterior interventricular artery.',
  title: ['Coronary sinus and posterior coronary vessels', 'Seno coronario y vasos coronarios posteriores'],
  desc: ['Posterior view, so patient right is at viewer right. The left atrium forms most of the base, with the pulmonary veins entering on both sides; the left ventricle lies at viewer left and the right ventricle lower right. The coronary sinus is the large vein lying in the left posterior atrioventricular groove; it is the continuation of the great cardiac vein and opens into the right atrium beside the inferior vena cava. The middle cardiac vein rises in the posterior interventricular groove beside the posterior interventricular artery and drains into the coronary sinus; the small cardiac vein runs with the right coronary artery and also joins the sinus. In most hearts (right dominance) the right coronary artery gives the posterior interventricular artery; the circumflex runs in the left groove alongside the sinus. Pulmonary veins red (oxygenated), caval veins blue. Simplified.',
    'Vista posterior, por lo que la derecha del paciente queda a la derecha del observador. La aurícula izquierda forma casi toda la base, con las venas pulmonares entrando por ambos lados; el ventrículo izquierdo queda a la izquierda y el derecho abajo a la derecha. El seno coronario es la gran vena situada en el surco auriculoventricular posterior izquierdo; continúa la vena cardíaca magna y desemboca en la aurícula derecha junto a la vena cava inferior. La vena cardíaca media asciende por el surco interventricular posterior junto a la arteria interventricular posterior y drena en el seno coronario; la vena cardíaca parva acompaña a la coronaria derecha y también desemboca en el seno. En la mayoría de los corazones (dominancia derecha) la coronaria derecha da la interventricular posterior; la circunfleja discurre por el surco izquierdo junto al seno. Venas pulmonares rojas (oxigenadas), venas cavas azules. Simplificado.'],
  orientation: ['posterior view; patient right at viewer right', 'vista posterior; derecha del paciente a la derecha del observador'], draw: corPost,
});

// ------------------------------------------------------------------ 7 conduction
function conduction(S) {
  S.panel(30, 30, 1390, 940, 'section');
  S.beginT(155, -40, 1);
  sectionBase(S, { plain: true });
  const G = { color: '#B07D2E' };
  const cpath = (pts) => sm(pts, false, 8);
  S.sh('sa', E(470, 330, 26, 11, -8), { fill: '#E3C46E', line: '#8A6E2C', sw: 1.8 });
  S.sh('av', E(522, 482, 22, 11, 20), { fill: '#E3C46E', line: '#8A6E2C', sw: 1.8 });
  S.ln('bundle', cpath([[524, 486], [548, 505], [565, 524]]), { color: '#B07D2E', w: 5 });
  S.ln('bundle', cpath([[565, 524], [582, 606], [616, 716], [644, 796]]), { color: '#B07D2E', w: 4 });
  S.ln('bundle', cpath([[565, 524], [600, 560], [632, 612], [672, 718], [706, 808]]), { color: '#B07D2E', w: 4 });
  S.ln('purk', cpath([[646, 798], [608, 802], [528, 738], [436, 650], [385, 588]]), { color: '#B07D2E', w: 2.2 });
  S.ln('purk', cpath([[706, 808], [736, 822], [776, 776], [802, 700], [810, 610]]), { color: '#B07D2E', w: 2.2 });
  for (const [a, b] of [[[600, 802], [585, 765]], [[528, 738], [560, 712]], [[436, 650], [470, 650]], [[740, 818], [716, 770]], [[780, 772], [752, 748]], [[802, 700], [770, 690]]]) S.ln('purk', `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`, { color: '#B07D2E', w: 1.6 });
  S.ln(null, cpath([[470, 332], [490, 400], [515, 470]]), { color: '#D6B05A', w: 2, dash: '3 4' });
  S.arrow(500, 420, 90, 12, '#B07D2E');
  S.endT();
  S.pin('cv-sa-node', 'sa', T2([470, 330]));
  S.pin('cv-av-node', 'av', T2([522, 482]));
  S.pin('cv-av-bundle', 'bundle', T2([560, 520]));
  S.pin('cv-purkinje', 'purk', T2([476, 700]));
}
plates.push({
  key: 'conduction-system', moduleId: MOD, kind: 'gross-diagram', lessons: ['cv-conduction'], purpose: 'Impulse route from sinoatrial node to Purkinje fibres.',
  title: ['Conduction system of the heart', 'Sistema de conducción del corazón'],
  desc: ['Frontal section, patient right at viewer left. The sinoatrial (SA) node, the pacemaker, sits in the wall of the right atrium near the opening of the superior vena cava. The impulse spreads through the atrial muscle (dotted route) to the atrioventricular (AV) node low in the septum near the tricuspid valve, where it is briefly delayed. It passes into the atrioventricular bundle (bundle of His) through the fibrous skeleton, which divides at the top of the interventricular septum into right and left bundle branches running down each side of the septum to the apex, and then spreads through Purkinje fibres under the endocardium of both ventricles. Conduction tissue is a specialized muscle, drawn here as a thin ochre pathway; it is simplified and thicker than in life.',
    'Corte frontal, derecha del paciente a la izquierda. El nodo sinoauricular (SA), el marcapasos, está en la pared de la aurícula derecha cerca de la desembocadura de la vena cava superior. El impulso se propaga por el músculo auricular (ruta punteada) hasta el nodo auriculoventricular (AV), situado en la parte baja del tabique cerca de la válvula tricúspide, donde se retrasa brevemente. Pasa al haz auriculoventricular (haz de His) a través del esqueleto fibroso, que se divide en la parte alta del tabique interventricular en ramas derecha e izquierda que descienden por cada lado del tabique hasta el vértice, y luego se extiende por las fibras de Purkinje bajo el endocardio de ambos ventrículos. El tejido de conducción es músculo especializado, dibujado como una vía fina ocre; simplificado y más grueso que en la realidad.'],
  orientation: ['frontal section from the front; patient right at viewer left', 'corte frontal visto de frente; derecha del paciente a la izquierda'], draw: conduction,
});
void C; void RR; void along;
