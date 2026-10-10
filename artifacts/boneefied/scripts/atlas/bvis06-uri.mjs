// BVIS06 urinary plates: tract placement + bladder, kidney section, renal vessels, nephron, renal corpuscle.
import { T, LUM, net, patch, circ, rect, sm, poly, E, RR, cr, A, V, wav } from './bvis06-lib.mjs';
const MOD = 'urinary-system';
const U = (s) => 'urinary-system-' + s;
export const plates = [];
const K = T.kidney, UR = { fill: '#E9D3A0', line: '#8A7A3A' };
const rad = (a) => (a * Math.PI) / 180;

// ------------------------------------------------------------ 1 tract
function tract(S) {
  S.panel(30, 30, 880, 940, 'placement'); S.panel(930, 30, 490, 940, 'bladder'); S.at('placement');
  S.sh('diaphragm', sm([[120, 130], [260, 70], [450, 56], [640, 70], [790, 130], [790, 170], [640, 116], [450, 104], [260, 116], [120, 170]], true, 5), { ...T.muscle, sw: 1.6 });
  S.sh('liver', sm([[110, 180], [240, 140], [400, 150], [452, 220], [440, 290], [380, 330], [250, 336], [150, 280]], true, 5), { ...T.liver, sw: 1.7 });
  net(S, [
    { id: U('renal-artery'), pts: [[480, 436], [440, 440], [392, 428]], w: 10, fill: A.fill, line: A.line },
    { id: U('renal-artery'), pts: [[480, 346], [520, 352], [550, 366]], w: 10, fill: A.fill, line: A.line },
  ]);
  S.sh(U('kidney'), sm([[330, 310], [380, 330], [394, 384], [378, 412], [394, 442], [372, 504], [322, 524], [274, 474], [270, 376]], true, 6), { ...K, sw: 1.8 });
  S.sh(U('kidney'), sm([[598, 258], [556, 280], [548, 336], [562, 368], [548, 398], [568, 438], [620, 456], [664, 416], [670, 322]], true, 6), { ...K, sw: 1.8 });
  net(S, [
    { id: U('ureter'), pts: [[384, 420], [376, 500], [396, 620], [428, 780]], w: 12, fill: UR.fill, line: UR.line, lum: LUM, lw: 5 },
    { id: U('ureter'), pts: [[556, 380], [560, 460], [526, 620], [484, 780]], w: 12, fill: UR.fill, line: UR.line, lum: LUM, lw: 5 },
    { id: 'ves-aorta', pts: [[480, 150], [480, 740]], w: 28, fill: A.fill, line: A.line },
    { id: 'cv-ivc', pts: [[420, 190], [420, 740]], w: 36, fill: V.fill, line: V.line },
  ]);
  net(S, [
    { id: U('renal-vein'), pts: [[420, 402], [402, 408], [388, 410]], w: 14, fill: V.fill, line: V.line },
    { id: U('renal-vein'), pts: [[552, 386], [500, 392], [440, 390], [420, 392]], w: 14, fill: V.fill, line: V.line },
  ]);
  S.sh(U('urinary-bladder'), sm([[455, 770], [540, 790], [570, 850], [530, 910], [455, 925], [380, 910], [340, 850], [372, 790]], true, 6), { ...T.bladder, sw: 1.8 });
  net(S, [{ id: U('urethra'), pts: [[455, 915], [455, 950]], w: 24, fill: UR.fill, line: UR.line, lum: LUM, lw: 10 }]);
  [['kidney', [326, 480]], ['ureter', [394, 600]], ['urinary-bladder', [455, 850]], ['urethra', [455, 938]], ['renal-artery', [526, 350]], ['renal-vein', [470, 390]]].forEach(([id, h]) => S.pin(U(id), U(id), h));
  S.pin('ves-aorta', 'ves-aorta', [480, 600]); S.pin('cv-ivc', 'cv-ivc', [420, 600]); S.pin('digestive-system-liver', 'liver', [260, 240]); S.pin('respiratory-system-diaphragm', 'diaphragm', [450, 80]);
  // opened bladder
  S.at('bladder');
  const cx = 1175, mir = (p) => [2 * cx - p[0], p[1]];
  const wallP = [[1020, 160], [1330, 160], [1360, 420], [1300, 640], [1230, 704], [1120, 704], [1050, 640], [990, 420]];
  S.sh('detrusor', sm(wallP, true, 6), { ...T.muscle, sw: 1.8 });
  const ur = [[1008, 150], [990, 330], [1020, 500], [1080, 584]];
  net(S, [
    { id: 'ureter', pts: ur, w: 12, fill: UR.fill, line: UR.line, lum: LUM, lw: 5 },
    { id: 'ureter', pts: ur.map(mir), w: 12, fill: UR.fill, line: UR.line, lum: LUM, lw: 5 },
    { id: 'urethra', pts: [[1175, 650], [1175, 720], [1175, 900]], w: 34, fill: UR.fill, line: UR.line, lum: LUM, lw: 18 },
  ]);
  S.sh('lumen', sm([[1072, 214], [1278, 214], [1306, 420], [1262, 590], [1210, 650], [1140, 650], [1088, 590], [1044, 420]], true, 6), { fill: '#EBCFC6', line: '#9A6A66', sw: 1.4 });
  S.sh('trigone', poly([[1112, 586], [1238, 586], [1175, 668]]), { fill: '#DDB0A6', line: '#9A6A66', sw: 1.4 });
  S.sh('isph', sm([[1112, 650], [1158, 664], [1158, 724], [1122, 716]], true, 3), { fill: '#B87972', line: '#7E4A49', sw: 1.4 });
  S.sh('isph', sm([[1238, 650], [1192, 664], [1192, 724], [1228, 716]], true, 3), { fill: '#B87972', line: '#7E4A49', sw: 1.4 });
  patch(S, circ(1090, 592, 8), LUM); patch(S, circ(2 * cx - 1090, 592, 8), LUM);
  patch(S, rect(1166, 646, 18, 70), LUM);
  S.sh('esph', RR(1124, 790, 32, 70, 8), { fill: '#A8645F', line: '#6E403C', sw: 1.4 });
  S.sh('esph', RR(1194, 790, 32, 70, 8), { fill: '#A8645F', line: '#6E403C', sw: 1.4 });
  [['urinary-bladder', 'lumen', [1175, 330]], ['detrusor-muscle', 'detrusor', [1017, 430]], ['trigone', 'trigone', [1175, 604]], ['ureter', 'ureter', [992, 330]], ['internal-urethral-sphincter', 'isph', [1138, 690]], ['urethra', 'urethra', [1175, 850]], ['external-urethral-sphincter', 'esph', [1140, 826]]].forEach(([id, k, h]) => S.pin(U(id), k, h));
}
plates.push({
  key: 'urinary-tract', moduleId: MOD, kind: 'gross-diagram', lessons: ['urinary-tract', 'urinary-pathway'], purpose: 'Placement of kidneys, ureters, bladder and urethra against liver, aorta and inferior vena cava, plus an opened bladder.',
  title: ['Urinary tract and the opened bladder', 'Vías urinarias y vejiga abierta'],
  desc: ['Left: anterior view, patient right at viewer left. The liver lies on the right under the diaphragm and pushes the right kidney slightly lower than the left. The aorta (red) and inferior vena cava (blue) run vertically beside the spine; renal arteries leave the aorta and renal veins join the vena cava. Each ureter leaves the renal hilum and descends to the bladder; the urethra leaves the bladder. Right: bladder opened from the front. The thick detrusor muscle forms the wall; the trigone is the smooth triangle between the two ureteric openings and the urethral opening. The internal urethral sphincter (smooth muscle, involuntary) surrounds the bladder neck and the external urethral sphincter (skeletal muscle, voluntary) surrounds the urethra lower down. Simplified; the ureters are drawn in their path, not to scale.',
    'Izquierda: vista anterior, derecha del paciente a la izquierda. El hígado queda a la derecha bajo el diafragma y empuja algo más abajo el riñón derecho que el izquierdo. La aorta (roja) y la vena cava inferior (azul) corren verticales junto a la columna; las arterias renales salen de la aorta y las venas renales llegan a la cava. Cada uréter sale del hilio renal y desciende a la vejiga; la uretra sale de la vejiga. Derecha: vejiga abierta por delante. El grueso músculo detrusor forma la pared; el trígono es el triángulo liso entre los dos orificios ureterales y el orificio uretral. El esfínter uretral interno (músculo liso, involuntario) rodea el cuello vesical y el externo (músculo esquelético, voluntario) rodea la uretra más abajo. Simplificado; los uréteres se dibujan en su trayecto, sin escala.'],
  orientation: ['left: anterior view, patient right at viewer left; right: bladder opened from the front', 'izquierda: vista anterior, derecha del paciente a la izquierda; derecha: vejiga abierta por delante'], draw: tract,
});

// ------------------------------------------------------------ 2 kidney section
function kidney(S) {
  S.panel(30, 30, 880, 940, 'section'); S.at('section');
  const c = [405, 505], rx = 295, ry = 410, pt = (r, a) => [c[0] + rx * r * Math.cos(rad(a)), c[1] + ry * r * Math.sin(rad(a))];
  const OUT = [[330, 90], [470, 100], [600, 170], [680, 290], [700, 400], [650, 456], [650, 556], [700, 610], [680, 720], [600, 830], [470, 900], [330, 910], [200, 840], [130, 700], [110, 500], [130, 300], [200, 170]];
  const od = sm(OUT, true, 7);
  S.sh('cortex', od, { fill: '#D29C90', line: K.line, sw: 1.8 });
  S.clipBoth(od);
  const angs = [-125, -85, -45, 45, 85, 125, 180];
  angs.forEach((a) => S.sh('pyr', poly([pt(0.8, a - 17), pt(0.8, a + 17), pt(0.46, a + 5), pt(0.46, a - 5)]), { fill: '#B07068', line: '#7A4A46', sw: 1.4 }));
  [[-125, -85], [-85, -45], [45, 85], [85, 125], [125, 180]].forEach(([a, b]) => { const m = (a + b) / 2; S.sh('col', poly([pt(0.5, m - 3), pt(0.5, m + 3), pt(0.82, m + 4), pt(0.82, m - 4)]), { fill: '#D29C90', line: '#D29C90', sw: 0.5 }); });
  S.clipBothEnd();
  S.union('sinus', [E(420, 505, 160, 175), poly([[520, 470], [660, 462], [660, 550], [520, 540]])], { fill: '#EAD9AE', line: K.line, sw: 1.8 });
  S.sh('hilum', poly([[560, 468], [655, 464], [655, 548], [560, 542]]), { fill: '#EAD9AE', line: '#EAD9AE', sw: 0.5 });
  const cup = (a) => pt(0.31, a), items = [], g = { fill: UR.fill, line: UR.line, lum: LUM };
  items.push({ id: U('major-calyx'), pts: [[560, 500], ...[-45, -85, -125].map(cup)], w: 24, ...g, lw: 12 });
  items.push({ id: U('major-calyx'), pts: [[560, 510], ...[45, 85, 125].map(cup)], w: 24, ...g, lw: 12 });
  items.push({ id: U('minor-calyx'), pts: [cup(180), [470, 505]], w: 16, ...g, lw: 7 });
  angs.forEach((a) => { const q = cup(a); items.push({ id: U('minor-calyx'), pts: [q, [q[0] + 0.5, q[1]]], w: 30, ...g, lw: 12 }); });
  items.push({ id: U('renal-pelvis'), pts: [[500, 505], [590, 505]], w: 46, ...g, lw: 26 });
  items.push({ id: U('ureter'), pts: [[590, 505], [660, 506], [740, 540], [780, 700], [790, 930]], w: 22, ...g, lw: 9 });
  net(S, items);
  angs.forEach((a) => S.sh('pap', poly([pt(0.45, a - 4.5), pt(0.45, a + 4.5), pt(0.29, a)]), { fill: '#C58A80', line: '#7A4A46', sw: 1.2 }));
  S.ln('capsule', od, { color: '#EAD9C4', w: 7 });
  const ang = (a, r) => pt(r, a);
  [['kidney', 'cortex', [130, 700]], ['renal-cortex', 'cortex', [300, 130]], ['renal-capsule', 'capsule', [110, 500]], ['renal-pyramid', 'pyr', ang(85, 0.64)], ['renal-medulla', 'pyr', ang(-85, 0.64)], ['renal-column', 'col', ang(105, 0.64)],
    ['renal-papilla', 'pap', ang(-85, 0.4)], ['minor-calyx', U('minor-calyx'), ang(-45, 0.31)], ['major-calyx', U('major-calyx'), [520, 458]], ['renal-pelvis', U('renal-pelvis'), [546, 505]], ['renal-hilum', 'hilum', [640, 478]], ['renal-sinus', 'sinus', [380, 560]], ['ureter', U('ureter'), [770, 640]]]
    .forEach(([id, k, h]) => S.pin(U(id), k, h));
  // panel 2: schematic key of a renal lobe (pyramid + overlying cortex)
  S.panel(930, 30, 490, 940, 'lobe'); S.at('lobe');
  S.sh('cortex', poly([[960, 80], [1390, 80], [1390, 450], [960, 450]]), { fill: '#D29C90', line: K.line, sw: 1.6 });
  S.sh('pyr', poly([[1010, 450], [1340, 450], [1250, 760], [1100, 760]]), { fill: '#B07068', line: '#7A4A46', sw: 1.6 });
  S.sh('col', poly([[960, 450], [1010, 450], [1100, 760], [960, 760]]), { fill: '#D29C90', line: K.line, sw: 1.6 });
  S.sh('col', poly([[1340, 450], [1390, 450], [1390, 760], [1250, 760]]), { fill: '#D29C90', line: K.line, sw: 1.6 });
  S.sh('pap', poly([[1100, 760], [1250, 760], [1198, 820], [1152, 820]]), { fill: '#C58A80', line: '#7A4A46', sw: 1.4 });
  net(S, [{ id: U('minor-calyx'), pts: [[1175, 790], [1175, 880]], w: 150, ...g, lw: 120 }]);
  S.sh('pap', poly([[1100, 760], [1250, 760], [1198, 820], [1152, 820]]), { fill: '#C58A80', line: '#7A4A46', sw: 1.4 });
  S.pin(U('renal-cortex'), 'cortex', [1180, 260]); S.pin(U('renal-medulla'), 'pyr', [1175, 560]); S.pin(U('renal-column'), 'col', [985, 600]); S.pin(U('renal-papilla'), 'pap', [1175, 786]); S.pin(U('minor-calyx'), U('minor-calyx'), [1175, 868]);
}
plates.push({
  key: 'kidney-section', moduleId: MOD, kind: 'gross-diagram', lessons: ['urinary-kidney'], purpose: 'Coronal kidney section with cortex, medulla, calyces, pelvis and ureter, plus one renal lobe.',
  title: ['Kidney in section: cortex, medulla and collecting system', 'Riñón en corte: corteza, médula y sistema colector'],
  desc: ['Left: coronal section of a kidney; the hilum faces the viewer\'s right. The capsule covers the surface. Cortex is the outer zone and continues between the pyramids as renal columns. The medulla is made of renal pyramids whose tips, the renal papillae, project into minor calyces. Minor calyces merge into major calyces, which join the renal pelvis; the pelvis leaves through the hilum as the ureter. The central renal sinus is the fat-filled space around the calyces. Pyramid count (7) is simplified. Right: one renal lobe: a pyramid with its papilla opening into a minor calyx, flanked by columns and capped by cortex. Schematic; vessels and nephrons are shown on other plates.',
    'Izquierda: corte coronal de un riñón; el hilio mira a la derecha del observador. La cápsula cubre la superficie. La corteza es la zona externa y se continúa entre las pirámides como columnas renales. La médula está formada por pirámides renales cuyas puntas, las papilas renales, se proyectan en los cálices menores. Los cálices menores confluyen en cálices mayores, que se unen a la pelvis renal; la pelvis sale por el hilio como uréter. El seno renal central es el espacio con grasa alrededor de los cálices. El número de pirámides (7) está simplificado. Derecha: un lóbulo renal: una pirámide con su papila que se abre en un cáliz menor, flanqueada por columnas y cubierta por corteza. Esquema; los vasos y nefronas están en otras láminas.'],
  orientation: ['left: coronal section, hilum at viewer right; right: one renal lobe', 'izquierda: corte coronal, hilio a la derecha del observador; derecha: un lóbulo renal'], draw: kidney,
});

// ------------------------------------------------------------ 3 renal vessels
function vessels(S) {
  S.panel(30, 30, 1390, 940, 'tree'); S.at('tree');
  // schematic lobe: cortex over a pyramid, sinus below
  S.sh(null, rect(60, 70, 1330, 700), { fill: '#EBCFC6', line: '#9A6A66', sw: 1.4 });
  S.sh(null, poly([[330, 440], [1100, 440], [900, 760], [560, 760]]), { fill: '#C4857E', line: '#8A524D', sw: 1.4 });
  S.sh(null, rect(60, 770, 1330, 180), { fill: '#EAD9AE', line: '#9A8A4A', sw: 1.4 });
  const AR = { fill: A.fill, line: A.line }, VN = { fill: V.fill, line: V.line }, PC = { fill: '#B58AA6', line: '#6F4C66' };
  // glomerulus (capillary tuft)
  const gl = [[560, 300], [720, 410]];
  gl.forEach(([x, y]) => { S.sh(null, circ(x, y, 34), { fill: '#E8C0BC', line: '#7E4A49', sw: 1.4 }); for (let i = 0; i < 5; i++) S.sh(null, circ(x + 16 * Math.cos(i * 1.26), y + 16 * Math.sin(i * 1.26), 10), { fill: A.fill, line: A.line, sw: 1.1 }); });
  net(S, [
    { id: U('renal-artery'), pts: [[80, 880], [180, 850], [280, 820]], w: 36, ...AR },
    { id: U('segmental-artery'), pts: [[280, 820], [330, 790], [338, 700]], w: 26, ...AR },
    { id: U('interlobar-artery'), pts: [[338, 700], [342, 600], [340, 470]], w: 18, ...AR },
    { id: U('arcuate-artery'), pts: [[340, 470], [372, 424], [500, 418], [660, 424], [760, 430]], w: 14, ...AR },
    { id: U('cortical-radiate-artery'), pts: [[500, 420], [498, 320], [492, 170]], w: 12, ...AR },
    { id: U('afferent-arteriole'), pts: [[498, 320], [530, 308], [556, 302]], w: 9, ...AR },
    { id: U('afferent-arteriole'), pts: [[660, 424], [690, 414], [716, 410]], w: 9, ...AR },
    { id: U('cortical-radiate-vein'), pts: [[960, 120], [962, 300], [964, 424]], w: 14, ...VN },
    { id: 'v', pts: [[964, 440], [1100, 450], [1230, 470], [1244, 640], [1244, 780]], w: 20, ...VN },
    { id: U('renal-vein'), pts: [[1244, 780], [1290, 850], [1380, 890]], w: 34, ...VN },
    { id: U('efferent-arteriole'), pts: [[584, 290], [630, 250], [690, 224]], w: 8, ...AR },
    { id: U('peritubular-capillary'), pts: [[690, 224], [720, 190], [770, 176], [830, 190]], w: 6, ...PC },
    { id: U('peritubular-capillary'), pts: [[690, 224], [740, 238], [800, 232], [860, 214]], w: 6, ...PC },
    { id: U('peritubular-capillary'), pts: [[770, 176], [790, 140], [850, 126], [900, 130], [958, 140]], w: 6, ...PC },
    { id: U('peritubular-capillary'), pts: [[830, 190], [880, 200], [920, 190], [962, 200]], w: 6, ...PC },
    { id: U('peritubular-capillary'), pts: [[860, 214], [900, 250], [940, 270], [962, 266]], w: 6, ...PC },
    { id: U('efferent-arteriole'), pts: [[722, 444], [730, 540], [726, 640], [736, 700], [770, 700]], w: 8, ...AR },
    { id: U('vasa-recta'), pts: [[736, 700], [770, 700], [786, 640], [800, 540], [840, 470], [900, 452], [964, 444]], w: 8, fill: '#A9879E', line: PC.line },
  ]);
  [['renal-artery', [150, 862]], ['segmental-artery', [326, 780]], ['interlobar-artery', [340, 580]], ['arcuate-artery', [610, 420]], ['cortical-radiate-artery', [497, 240]], ['afferent-arteriole', [530, 308]], ['efferent-arteriole', [650, 244]], ['peritubular-capillary', [900, 130]], ['vasa-recta', [790, 600]], ['cortical-radiate-vein', [962, 260]], ['renal-vein', [1330, 872]]].forEach(([id, h]) => S.pin(U(id), U(id), h));
}
plates.push({
  key: 'renal-vessels', moduleId: MOD, kind: 'tissue-schematic', lessons: ['urinary-vessels'], purpose: 'Blood route through the kidney from renal artery to renal vein, with the glomerular capillaries between two arterioles.',
  title: ['Renal blood vessels, hilum to nephron and back', 'Vasos renales, del hilio a la nefrona y de regreso'],
  desc: ['Schematic of one renal lobe: cortex above, a pyramid (medulla) in the centre and the sinus below. Arterial blood (red) enters by the renal artery and branches into segmental, interlobar (between pyramids), arcuate (along the cortex-medulla border) and cortical radiate arteries. An afferent arteriole feeds each glomerulus; an efferent arteriole, not a vein, leaves it. The efferent arteriole of a cortical nephron supplies peritubular capillaries (purple) that drain into the cortical radiate vein; that of a juxtamedullary nephron forms the long hairpin vasa recta that run into the medulla and return. Veins (blue) run back through arcuate and interlobar veins to the renal vein, which leaves at the hilum. One glomerulus of each kind is drawn; tubules are omitted. Filtrate does not travel in these vessels.',
    'Esquema de un lóbulo renal: corteza arriba, una pirámide (médula) en el centro y el seno debajo. La sangre arterial (roja) entra por la arteria renal y se ramifica en arterias segmentarias, interlobulares (entre las pirámides), arcuatas (en el límite corticomedular) y radiales corticales. Una arteriola aferente alimenta cada glomérulo; de él sale una arteriola eferente, no una vena. La eferente de una nefrona cortical irriga capilares peritubulares (morados) que drenan en la vena radial cortical; la de una nefrona yuxtamedular forma los largos vasos rectos en horquilla que entran en la médula y regresan. Las venas (azules) vuelven por venas arcuatas e interlobulares hasta la vena renal, que sale por el hilio. Se dibuja un glomérulo de cada tipo; se omiten los túbulos. El filtrado no viaja por estos vasos.'],
  orientation: ['schematic lobe: cortex above, medulla centre, hilum and sinus below', 'lóbulo esquemático: corteza arriba, médula al centro, hilio y seno abajo'], draw: vessels,
});

// ------------------------------------------------------------ 4 nephron
function nephron(S) {
  S.panel(30, 30, 880, 940, 'nephron'); S.panel(930, 30, 490, 940, 'path'); S.at('nephron');
  S.sh(null, rect(50, 50, 840, 430), { fill: '#EFD8CE', line: '#EFD8CE', sw: 0.5 });
  S.sh(null, rect(50, 480, 840, 470), { fill: '#E3BFB4', line: '#E3BFB4', sw: 0.5 });
  const t = (fill) => ({ fill, line: '#7A4A46' });
  net(S, [
    { id: U('proximal-convoluted-tubule'), pts: wav([250, 232], [340, 410], 10, 34), w: 26, ...t('#E3B4AC'), lum: LUM, lw: 11 },
    { id: U('descending-limb'), pts: [[340, 410], [342, 640], [346, 780]], w: 14, ...t('#EAC9B4'), lum: LUM, lw: 5 },
    { id: U('nephron-loop'), pts: [[346, 780], [372, 832], [412, 832], [434, 780]], w: 14, ...t('#EAC9B4'), lum: LUM, lw: 5 },
    { id: U('ascending-limb'), pts: [[434, 780], [436, 640], [438, 470], [430, 360], [396, 290], [336, 226]], w: 20, ...t('#D9A89C'), lum: LUM, lw: 9 },
    { id: U('distal-convoluted-tubule'), pts: wav([336, 226], [640, 270], 10, 30), w: 24, ...t('#D8B79E'), lum: LUM, lw: 10 },
    { id: U('collecting-duct'), pts: [[640, 100], [640, 430], [650, 700], [660, 860]], w: 32, ...t('#E4C9A4'), lum: LUM, lw: 15 },
    { id: U('papillary-duct'), pts: [[660, 840], [660, 934]], w: 40, ...t('#E9D3A0'), lum: LUM, lw: 20 },
  ]);
  S.sh(U('renal-corpuscle'), circ(250, 200, 58), { fill: '#E5D4C0', line: '#8A7A60', sw: 1.6 });
  S.sh(null, circ(250, 200, 48), { fill: LUM, line: '#B49C92', sw: 1 }); S.sh(U('glomerulus'), circ(250, 200, 34), { fill: '#D8B0AA', line: '#7E4A49', sw: 1.4 });
  patch(S, rect(244, 240, 12, 36), LUM);
  [['renal-corpuscle', null, [208, 170]], ['glomerulus', null, [250, 200]], ['proximal-convoluted-tubule', null, [286, 330]], ['descending-limb', null, [343, 600]], ['nephron-loop', null, [392, 834]], ['ascending-limb', null, [436, 600]], ['distal-convoluted-tubule', null, [500, 250]], ['collecting-duct', null, [645, 560]], ['papillary-duct', null, [660, 904]]]
    .forEach(([id, k, h]) => S.pin(U(id), k ?? U(id), h));
  S.pin(U('nephron'), U('proximal-convoluted-tubule') + '+' + U('distal-convoluted-tubule') + '+' + U('nephron-loop'), [378, 354]);
  // right panel: the urine pathway after the collecting duct
  S.at('path');
  S.sh(null, rect(960, 60, 430, 340), { fill: '#E3BFB4', line: '#E3BFB4', sw: 0.5 });
  S.sh(null, poly([[1000, 120], [1350, 120], [1230, 400], [1120, 400]]), { fill: '#C4857E', line: '#8A524D', sw: 1.4 });
  S.sh(null, rect(960, 400, 430, 110), { fill: '#EAD9AE', line: '#EAD9AE', sw: 0.5 });
  S.sh(null, poly([[1120, 400], [1230, 400], [1205, 428], [1145, 428]]), { fill: '#C58A80', line: '#8A524D', sw: 1.4 });
  net(S, [
    { id: U('major-calyx'), pts: [[1175, 470], [1175, 560]], w: 80, ...t(UR.fill), lum: LUM, lw: 56 },
    { id: U('renal-pelvis'), pts: [[1175, 560], [1175, 620]], w: 110, ...t(UR.fill), lum: LUM, lw: 84 },
    { id: U('ureter'), pts: [[1175, 620], [1176, 700], [1178, 780], [1178, 840]], w: 28, ...t(UR.fill), lum: LUM, lw: 12 },
    { id: U('urethra'), pts: [[1179, 905], [1179, 950]], w: 26, ...t(UR.fill), lum: LUM, lw: 10 },
  ]);
  S.sh(U('minor-calyx'), rect(1105, 420, 140, 80), { fill: UR.fill, line: UR.line, sw: 1.6 });
  S.sh(U('minor-calyx'), rect(1117, 426, 116, 68), { fill: LUM, line: LUM, sw: 0.5 });
  S.sh(null, poly([[1120, 400], [1230, 400], [1205, 428], [1145, 428]]), { fill: '#C58A80', line: '#8A524D', sw: 1.4 });
  patch(S, rect(1147, 486, 56, 26), LUM);
  net(S, [
    { id: U('collecting-duct'), pts: [[1175, 130], [1175, 340]], w: 28, ...t('#E4C9A4'), lum: LUM, lw: 12 },
    { id: U('papillary-duct'), pts: [[1175, 340], [1175, 426]], w: 24, ...t('#E9D3A0'), lum: LUM, lw: 12 },
  ]);
  patch(S, rect(1164, 424, 22, 14), LUM);
  S.sh(U('urinary-bladder'), E(1178, 872, 84, 48), { fill: '#D9B5A4', line: '#7A4A46', sw: 1.6 });
  S.sh(U('urinary-bladder'), E(1178, 872, 66, 34), { fill: LUM, line: '#B49C92', sw: 1.2 });
  patch(S, rect(1172, 824, 12, 36), LUM); patch(S, rect(1173, 890, 12, 28), LUM);
  [['collecting-duct', [1175, 220]], ['papillary-duct', [1175, 386]], ['minor-calyx', [1175, 440]], ['major-calyx', [1175, 505]], ['renal-pelvis', [1175, 610]], ['ureter', [1177, 720]], ['urinary-bladder', [1110, 880]], ['urethra', [1179, 935]]].forEach(([id, h]) => S.pin(U(id), U(id), h));
}
plates.push({
  key: 'nephron-pathway', moduleId: MOD, kind: 'tissue-schematic', lessons: ['urinary-nephron', 'urinary-pathway'], purpose: 'One nephron in order with its filtrate route, and the onward urine pathway to the urethra.',
  title: ['Nephron segments and the urine pathway', 'Segmentos de la nefrona y vía de la orina'],
  desc: ['Left: one nephron stretched out (not to scale), cortex above and medulla below. Filtrate is formed in the renal corpuscle (glomerulus inside its capsule) and enters the proximal convoluted tubule, then the descending limb, the hairpin of the nephron loop and the ascending limb, which returns to the cortex beside its own corpuscle, then the distal convoluted tubule. Many nephrons empty into a collecting duct that runs down the medulla to a papillary duct at the papilla. The nephron proper ends at the distal tubule; the collecting duct is not part of the nephron. Right: onward flow of urine, without the nephron: papillary duct, minor calyx, major calyx, renal pelvis, ureter, bladder and urethra. Blood vessels are omitted. Schematic.',
    'Izquierda: una nefrona estirada (sin escala), corteza arriba y médula abajo. El filtrado se forma en el corpúsculo renal (glomérulo dentro de su cápsula) y entra en el túbulo contorneado proximal, luego la rama descendente, el asa de la nefrona y la rama ascendente, que vuelve a la corteza junto a su propio corpúsculo, y después el túbulo contorneado distal. Muchas nefronas desembocan en un túbulo colector que baja por la médula hasta un conducto papilar en la papila. La nefrona propiamente dicha termina en el túbulo distal; el túbulo colector no forma parte de ella. Derecha: continuación de la orina, sin la nefrona: conducto papilar, cáliz menor, cáliz mayor, pelvis renal, uréter, vejiga y uretra. Se omiten los vasos. Esquema.'],
  orientation: ['left: one nephron, cortex above and medulla below; right: urine pathway, top to bottom', 'izquierda: una nefrona, corteza arriba y médula abajo; derecha: vía de la orina, de arriba abajo'], draw: nephron,
});

// ------------------------------------------------------------ 5 corpuscle
function corpuscle(S) {
  S.panel(30, 30, 900, 940, 'corpuscle'); S.panel(950, 30, 470, 940, 'membrane'); S.at('corpuscle');
  const cx = 480, cy = 480;
  S.sh(U('glomerular-capsule'), circ(cx, cy, 360), { fill: '#E5D4C0', line: '#8A7A60', sw: 1.8 });
  S.sh(null, circ(cx, cy, 322), { fill: LUM, line: '#B49C92', sw: 1.2 });
  S.sh(U('juxtaglomerular-apparatus'), sm([[150, 120], [230, 90], [300, 110], [310, 160], [250, 190], [160, 170]], true, 5), { fill: '#E6C9D2', line: '#9A6A7A', sw: 1.4 });
  S.sh(U('glomerulus'), circ(cx, cy, 238), { fill: '#EBD0CA', line: '#C9A9A0', sw: 1 });
  for (let i = 0; i < 18; i++) { const a = (i * 20 * Math.PI) / 180; S.sh(U('podocyte'), circ(cx + 246 * Math.cos(a), cy + 246 * Math.sin(a), 18), { fill: '#C9A9C4', line: '#76566A', sw: 1.3 }); }
  const AR = { fill: A.fill, line: A.line }, Ep = [318, 322], Xp = [328, 352], Pc = (r, a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
  const loops = [-60, -10, 40, 90, 140].map((a) => ({ id: U('glomerulus'), pts: [Ep, Pc(130, a), Pc(205, a + 24), Pc(130, a + 48), Xp], w: 26, ...AR, lum: '#D9A3A0', lw: 10 }));
  net(S, [
    { id: U('afferent-arteriole'), pts: [[70, 110], [170, 190], [250, 250], Ep], w: 38, ...AR, lum: '#D9A3A0', lw: 18 },
    { id: U('efferent-arteriole'), pts: [Xp, [250, 292], [190, 262], [110, 330], [90, 520]], w: 26, ...AR, lum: '#D9A3A0', lw: 10 },
    ...loops,
    { id: U('distal-convoluted-tubule'), pts: [[880, 60], [700, 70], [520, 80], [420, 100], [326, 122]], w: 40, fill: '#D8B79E', line: '#7A4A46', lum: LUM, lw: 22 },
    { id: U('proximal-convoluted-tubule'), pts: [[cx, 860], [cx, 940]], w: 70, fill: '#E3B4AC', line: '#7A4A46', lum: LUM, lw: 36 },
  ]);
  patch(S, rect(462, 795, 36, 80), LUM);
  [[326, 112], [334, 128], [318, 130], [338, 114]].forEach(([x, y]) => S.sh(U('macula-densa'), E(x, y, 7, 11, -35), { fill: '#7A5A82', line: '#4A3652', sw: 1 }));
  [[196, 208], [212, 222], [226, 236]].forEach(([x, y]) => S.sh(U('juxtaglomerular-cell'), circ(x, y, 8), { fill: '#C47E8A', line: '#7E4A5A', sw: 1.2 }));
  [['renal-corpuscle', U('glomerular-capsule') + '+' + U('glomerulus'), [480, 760]], ['glomerular-capsule', null, [480, 130]], ['glomerulus', null, [480, 480]], ['podocyte', null, [722, 480]], ['juxtaglomerular-apparatus', null, [200, 130]], ['macula-densa', null, [326, 120]], ['juxtaglomerular-cell', null, [204, 214]], ['afferent-arteriole', null, [120, 150]], ['efferent-arteriole', null, [110, 400]]]
    .forEach(([id, k, h]) => S.pin(U(id), k ?? U(id), h));
  S.pins.find((p) => p.structureId === U('glomerular-capsule')).hint = [480, 140];
  // filtration barrier, magnified
  S.at('membrane');
  S.sh(null, rect(980, 120, 410, 160), { fill: '#C7D6E4', line: '#4F6C86', sw: 1.4 });
  [[1060, 200], [1160, 190], [1280, 205]].forEach(([x, y]) => S.sh(null, E(x, y, 34, 26), { fill: A.fill, line: A.line, sw: 1.2 }));
  S.sh('endo', rect(980, 280, 410, 26), { fill: '#E8C0BC', line: '#7E4A49', sw: 1.2 });
  for (let x = 1000; x < 1380; x += 44) S.sh(null, E(x, 293, 8, 5), { fill: '#C7D6E4', line: '#C7D6E4', sw: 0.5 });
  S.sh(U('filtration-membrane'), rect(980, 306, 410, 54), { fill: '#C6B49A', line: '#7A6A4A', sw: 1.4 });
  S.sh(null, rect(980, 360, 410, 40), { fill: '#EADFC8', line: '#EADFC8', sw: 0.5 });
  for (let x = 996; x < 1380; x += 36) S.sh(U('podocyte'), poly([[x, 360], [x + 22, 360], [x + 20, 400], [x + 2, 400]]), { fill: '#C9A9C4', line: '#76566A', sw: 1.2 });
  S.sh(null, rect(980, 400, 410, 150), { fill: LUM, line: '#B49C92', sw: 1.2 });
  [['filtration-membrane', [1180, 332]], ['podocyte', [1100, 388]]].forEach(([id, h]) => S.pin(U(id), U(id), h));
}
plates.push({
  key: 'renal-corpuscle', moduleId: MOD, kind: 'tissue-schematic', lessons: ['urinary-corpuscle', 'urinary-histology'], purpose: 'Renal corpuscle with glomerular capsule, tuft, podocytes, arterioles and juxtaglomerular apparatus, plus the filtration barrier magnified.',
  title: ['Renal corpuscle and filtration barrier', 'Corpúsculo renal y barrera de filtración'],
  desc: ['Left: schematic renal corpuscle. The glomerulus is a tuft of capillaries with an afferent arteriole bringing blood in and an efferent arteriole taking it away. The glomerular capsule surrounds it; the clear capsular space between capsule and tuft collects filtrate and leads to the proximal tubule at the urinary pole (below). Podocytes cover the capillaries. At the vascular pole the distal tubule touches the afferent arteriole: macula densa cells in the tubule wall and juxtaglomerular cells in the arteriole wall form the juxtaglomerular apparatus. Right: the filtration barrier magnified: blood in the capillary lumen (top) is separated from the capsular space (bottom) by fenestrated endothelium, a basement membrane and the slits between podocyte foot processes. Filtrate crosses this barrier into the capsular space, a different space from the capillary blood. Schematic, not a photomicrograph.',
    'Izquierda: corpúsculo renal esquemático. El glomérulo es un ovillo de capilares con una arteriola aferente que trae la sangre y una eferente que se la lleva. La cápsula glomerular lo rodea; el espacio capsular claro entre cápsula y ovillo recoge el filtrado y conduce al túbulo proximal en el polo urinario (abajo). Los podocitos cubren los capilares. En el polo vascular el túbulo distal toca la arteriola aferente: las células de la mácula densa en la pared del túbulo y las células yuxtaglomerulares en la pared arteriolar forman el aparato yuxtaglomerular. Derecha: la barrera de filtración ampliada: la sangre de la luz capilar (arriba) se separa del espacio capsular (abajo) por endotelio fenestrado, una membrana basal y las hendiduras entre los pedicelos de los podocitos. El filtrado cruza esta barrera hacia el espacio capsular, distinto de la sangre capilar. Esquema, no fotomicrografía.'],
  orientation: ['left: corpuscle, vascular pole upper left, urinary pole below; right: filtration barrier, blood above and capsular space below', 'izquierda: corpúsculo, polo vascular arriba a la izquierda, polo urinario abajo; derecha: barrera de filtración, sangre arriba y espacio capsular abajo'], draw: corpuscle,
});
