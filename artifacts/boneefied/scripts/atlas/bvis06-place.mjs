// BVIS06 placement plates: digestive abdominal placement and urinary kidney placement.
import { T, LUM, net, patch, circ, rect, sm, poly, E, scallop, A, V } from './bvis06-lib.mjs';
export const plates = [];
const D = (s) => 'digestive-system-' + s;
const U = (s) => 'urinary-system-' + s;
const UR = { fill: '#E9D3A0', line: '#8A7A3A' };
const torso = [[330, 60], [610, 60], [750, 150], [790, 400], [760, 700], [720, 950], [220, 950], [180, 700], [150, 400], [190, 150]];
const dome = [[200, 160], [330, 100], [470, 90], [610, 100], [740, 160], [740, 200], [610, 150], [470, 140], [330, 150], [200, 200]];

// transverse section (patient right at viewer left, seen from below)
function transverse(S, mode) {
  const cx = 1175, cy = 440;
  S.sh(null, E(cx, cy, 215, 175), { ...T.skin, sw: 1.8 });
  S.sh(null, E(cx, cy, 200, 160), { fill: '#EFE0D2', line: '#B58E82', sw: 1.2 });
  S.sh(null, E(cx - 62, 505, 42, 34), { ...T.muscle, sw: 1.3 }); S.sh(null, E(cx + 62, 505, 42, 34), { ...T.muscle, sw: 1.3 });
  S.sh(null, circ(cx, 530, 36), { ...T.bone, sw: 1.5 }); S.sh(null, circ(cx, 530, 13), { fill: LUM, line: '#B49C92', sw: 1.2 });
  S.sh(null, sm([[cx - 130, 560], [cx, 590], [cx + 130, 560], [cx + 110, 580], [cx, 596], [cx - 110, 580]], true, 3), { ...T.muscle, sw: 1.2 });
  if (mode === 'kidney') {
    S.sh(null, E(cx - 92, 480, 54, 66), { fill: '#EADFC8', line: '#A59A82', sw: 1.2 }); S.sh(null, E(cx + 92, 480, 54, 66), { fill: '#EADFC8', line: '#A59A82', sw: 1.2 });
    S.sh(U('kidney'), E(cx - 92, 480, 36, 50, 8), { ...T.kidney, sw: 1.7 }); S.sh('T-kidneyL', E(cx + 92, 480, 36, 50, -8), { ...T.kidney, sw: 1.7 });
    S.sh(U('kidney'), E(cx - 92, 480, 36, 50, 8), { ...T.kidney, sw: 1.7 });
    S.ln(null, `M${cx - 190} 420Q${cx} 440 ${cx + 190} 420`, { color: '#8A7A5A', w: 2 });
    S.sh('liver', sm([[cx - 190, 380], [cx - 150, 300], [cx - 80, 270], [cx - 40, 330], [cx - 50, 400], [cx - 100, 420], [cx - 160, 420]], true, 5), { ...T.liver, sw: 1.7 });
    S.sh(null, E(cx + 100, 330, 56, 34), { ...T.gut, sw: 1.2 }); S.sh(null, E(cx + 20, 300, 44, 28), { ...T.gut, sw: 1.2 });
  } else {
    S.sh(D('liver'), sm([[cx - 195, 400], [cx - 170, 280], [cx - 100, 230], [cx - 20, 250], [cx - 10, 340], [cx - 40, 400], [cx - 100, 440], [cx - 160, 450]], true, 5), { ...T.liver, sw: 1.7 });
    S.sh(D('stomach'), sm([[cx + 20, 250], [cx + 100, 230], [cx + 170, 290], [cx + 150, 380], [cx + 80, 390], [cx + 20, 350]], true, 5), { ...T.stomach, sw: 1.7 });
    S.sh(D('pancreas'), sm([[cx - 70, 400], [cx - 20, 380], [cx + 70, 390], [cx + 130, 410], [cx + 120, 440], [cx + 20, 430], [cx - 60, 440]], true, 4), { ...T.panc, sw: 1.5 });
    S.sh(D('duodenum'), circ(cx - 100, 425, 20), { ...T.gut, sw: 1.5 });
    S.sh(null, E(cx - 110, 495, 38, 50, 8), { ...T.kidney, sw: 1.3 }); S.sh(null, E(cx + 118, 490, 38, 50, -8), { ...T.kidney, sw: 1.3 });
  }
  net(S, [{ id: 'cv-ivc', pts: [[cx - 28, 468], [cx - 28, 469]], w: 32, fill: V.fill, line: V.line }, { id: 'ves-aorta', pts: [[cx + 22, 474], [cx + 22, 475]], w: 26, fill: A.fill, line: A.line }]);
}

// ---------------------------------------------------------------- digestive placement
function digest(S) {
  S.panel(30, 30, 880, 940, 'abdomen'); S.panel(930, 30, 490, 940, 'level'); S.at('abdomen');
  S.sh(null, sm(torso, true, 6), { ...T.skin, sw: 1.8 });
  S.sh('respiratory-system-diaphragm', sm(dome, true, 5), { ...T.muscle, sw: 1.5 });
  S.sh('pancreas-p', sm([[420, 540], [470, 520], [560, 520], [650, 490], [720, 440], [730, 470], [660, 530], [570, 560], [490, 585], [430, 590]], true, 4), { ...T.panc, sw: 1.6 });
  net(S, [{ id: D('esophagus'), pts: [[540, 110], [545, 190], [560, 240]], w: 26, fill: T.gut.fill, line: T.gut.line, lum: LUM, lw: 10 }]);
  S.sh(D('stomach'), sm([[580, 230], [650, 225], [710, 290], [715, 390], [670, 470], [590, 500], [510, 490], [470, 462], [470, 430], [520, 430], [560, 400], [560, 340], [548, 290]], true, 6), { ...T.stomach, sw: 1.8 });
  const G = { fill: T.gut.fill, line: T.gut.line };
  net(S, [
    { id: D('duodenum'), pts: [[480, 455], [420, 470], [380, 520], [384, 590], [430, 630], [492, 636]], w: 32, ...G, lum: LUM, lw: 14 },
    { id: D('jejunum'), pts: [[492, 636], [510, 690], [600, 700], [640, 730], [560, 750], [380, 752]], w: 30, fill: '#E2AE9E', line: T.gut.line, lum: LUM, lw: 12 },
    { id: D('ileum'), pts: [[380, 752], [330, 780], [420, 806], [600, 810], [640, 836], [540, 866], [330, 866], [296, 884]], w: 26, fill: '#DDBBAA', line: T.gut.line, lum: LUM, lw: 10 },
  ]);
  S.sh(D('left-lobe-of-liver'), sm([[430, 330], [440, 250], [520, 210], [600, 262], [612, 292], [520, 306], [440, 340]], true, 5), { ...T.liver, sw: 1.7 });
  S.sh(D('right-lobe-of-liver'), sm([[190, 230], [260, 175], [380, 160], [470, 190], [452, 330], [430, 390], [330, 420], [240, 380], [195, 310]], true, 5), { ...T.liver, sw: 1.7 });
  S.sh(D('gallbladder'), sm([[385, 400], [420, 394], [434, 444], [412, 486], [388, 466]], true, 4), { ...T.gb, sw: 1.6 });
  const col = { fill: '#E6BDAE', line: T.gut.line };
  scallop(S, [
    { id: D('cecum'), pts: [[250, 892], [250, 860]], r: 36, step: 36, ...col },
    { id: D('ascending-colon'), pts: [[250, 860], [250, 700], [250, 590]], r: 28, step: 36, ...col },
    { id: D('transverse-colon'), pts: [[250, 590], [330, 640], [470, 656], [620, 640], [700, 590]], r: 28, step: 36, ...col },
    { id: D('descending-colon'), pts: [[700, 590], [704, 700], [700, 800]], r: 28, step: 36, ...col },
    { id: D('sigmoid-colon'), pts: [[700, 800], [660, 880], [560, 902], [500, 880]], r: 26, step: 34, ...col },
    { id: D('rectum'), pts: [[500, 880], [482, 916], [482, 940]], r: 24, step: 28, ...col },
  ]);
  net(S, [{ pts: [[316, 880], [270, 874]], w: 8, fill: LUM, line: LUM }]);
  [['liver', D('left-lobe-of-liver') + '+' + D('right-lobe-of-liver'), [300, 280]], ['gallbladder', null, [408, 440]], ['stomach', null, [640, 330]], ['pancreas', 'pancreas-p', [650, 520]], ['duodenum', null, [384, 560]], ['jejunum', null, [600, 700]], ['ileum', null, [440, 806]], ['cecum', null, [250, 888]],
    ['ascending-colon', null, [250, 700]], ['transverse-colon', null, [470, 656]], ['descending-colon', null, [704, 700]], ['sigmoid-colon', null, [600, 900]], ['esophagus', null, [545, 180]]].forEach(([id, k, h]) => S.pin(D(id), k ?? D(id), h));
  S.pin('respiratory-system-diaphragm', 'respiratory-system-diaphragm', [330, 122]);
  S.at('level'); transverse(S, 'digest');
  S.pin(D('liver'), D('liver'), [1040, 330]); S.pin(D('stomach'), D('stomach'), [1300, 320]); S.pin(D('pancreas'), D('pancreas'), [1180, 410]); S.pin(D('duodenum'), D('duodenum'), [1075, 425]); S.pin('cv-ivc', 'cv-ivc', [1147, 468]); S.pin('ves-aorta', 'ves-aorta', [1197, 474]);
}
plates.push({
  key: 'abdominal-placement', moduleId: 'digestive-system', kind: 'gross-diagram', lessons: ['digestive-accessory', 'digestive-continuity'], purpose: 'Where the digestive organs sit in the abdomen: liver on the patient\'s right, stomach on the left, gallbladder under the liver, duodenum and pancreas, and the small and large intestine in context.',
  title: ['Abdominal placement of the digestive organs', 'Situación abdominal de los órganos digestivos'],
  desc: ['Left: anterior view of the trunk, patient right at viewer left. The diaphragm roofs the abdomen. The large liver lies mainly on the patient\'s right, with a small left lobe crossing the midline, and the gallbladder sits under its lower edge. The stomach lies on the left, receiving the oesophagus under the diaphragm; its outlet leads into the C-shaped duodenum, which wraps the head of the pancreas, and the pancreas runs behind the stomach toward the left. The jejunum and ileum coil in the central and lower abdomen and enter the cecum at the lower right; the large intestine frames them as ascending, transverse, descending and sigmoid colon, ending at the rectum. Positions are schematic and organs overlap in life. Right: transverse section at the upper abdomen seen from below, patient right at viewer left: liver on the right, stomach on the left, pancreas and duodenum in front of the inferior vena cava and aorta, in front of the spine.',
    'Izquierda: vista anterior del tronco, derecha del paciente a la izquierda. El diafragma cubre el abdomen. El gran hígado queda sobre todo a la derecha del paciente, con un pequeño lóbulo izquierdo que cruza la línea media, y la vesícula biliar está bajo su borde inferior. El estómago está a la izquierda y recibe el esófago bajo el diafragma; su salida conduce al duodeno en C, que rodea la cabeza del páncreas, y el páncreas discurre detrás del estómago hacia la izquierda. Yeyuno e íleon se enrollan en el abdomen central e inferior y entran en el ciego abajo a la derecha; el intestino grueso los enmarca como colon ascendente, transverso, descendente y sigmoide, y termina en el recto. Las posiciones son esquemáticas y los órganos se solapan en la vida real. Derecha: corte transversal del abdomen superior visto desde abajo, derecha del paciente a la izquierda: hígado a la derecha, estómago a la izquierda, páncreas y duodeno delante de la vena cava inferior y la aorta, delante de la columna.'],
  orientation: ['left: anterior view, patient right at viewer left; right: transverse section seen from below', 'izquierda: vista anterior, derecha del paciente a la izquierda; derecha: corte transversal visto desde abajo'], draw: digest,
});

// ---------------------------------------------------------------- kidney placement
function kidneyPlace(S) {
  S.panel(30, 30, 880, 940, 'front'); S.panel(930, 30, 490, 940, 'level'); S.at('front');
  S.sh(null, sm(torso, true, 6), { ...T.skin, sw: 1.8 });
  S.sh(null, poly([[440, 200], [500, 200], [500, 780], [440, 780]]), { ...T.bone, sw: 1.4 });
  for (let i = 0; i < 9; i++) S.ln(null, `M440 ${240 + i * 60}L500 ${240 + i * 60}`, { color: '#A59A82', w: 2 });
  S.sh(null, sm([[320, 400], [420, 380], [430, 640], [390, 800], [330, 760]], true, 5), { ...T.muscle, sw: 1.3 }); S.sh(null, sm([[620, 400], [520, 380], [510, 640], [550, 800], [610, 760]], true, 5), { ...T.muscle, sw: 1.3 });
  S.sh('respiratory-system-diaphragm', sm(dome, true, 5), { ...T.muscle, sw: 1.5 });
  S.sh('liver', sm([[190, 230], [260, 175], [380, 160], [470, 190], [452, 330], [430, 390], [330, 420], [240, 380], [195, 310]], true, 5), { ...T.liver, sw: 1.7 });
  net(S, [
    { id: U('renal-artery'), pts: [[480, 470], [440, 476], [400, 480]], w: 10, fill: A.fill, line: A.line },
    { id: U('renal-artery'), pts: [[480, 400], [530, 404], [572, 410]], w: 10, fill: A.fill, line: A.line },
  ]);
  S.sh(U('kidney'), sm([[345, 380], [390, 400], [404, 460], [388, 490], [404, 520], [380, 590], [330, 610], [284, 560], [280, 450]], true, 6), { ...T.kidney, sw: 1.8 });
  S.sh(U('kidney'), sm([[610, 320], [566, 342], [558, 402], [572, 432], [558, 462], [578, 510], [630, 530], [672, 490], [680, 390]], true, 6), { ...T.kidney, sw: 1.8 });
  net(S, [
    { id: U('ureter'), pts: [[396, 500], [388, 640], [412, 780]], w: 12, fill: UR.fill, line: UR.line, lum: LUM, lw: 5 },
    { id: U('ureter'), pts: [[566, 450], [572, 560], [548, 700], [522, 790]], w: 12, fill: UR.fill, line: UR.line, lum: LUM, lw: 5 },
    { id: 'ves-aorta', pts: [[500, 170], [500, 780]], w: 26, fill: A.fill, line: A.line },
    { id: 'cv-ivc', pts: [[448, 200], [448, 780]], w: 34, fill: V.fill, line: V.line },
  ]);
  net(S, [
    { id: U('renal-vein'), pts: [[448, 436], [424, 446], [402, 452]], w: 14, fill: V.fill, line: V.line },
    { id: U('renal-vein'), pts: [[560, 424], [520, 420], [470, 424], [448, 428]], w: 14, fill: V.fill, line: V.line },
  ]);
  S.sh(U('urinary-bladder'), E(470, 880, 100, 56), { ...T.bladder, sw: 1.7 });
  S.sh(U('urinary-bladder'), E(470, 880, 78, 38), { fill: LUM, line: '#B49C92', sw: 1.2 });
  patch(S, circ(414, 826, 7), LUM); patch(S, circ(524, 826, 7), LUM);
  [['kidney', [326, 540]], ['ureter', [388, 640]], ['renal-artery', [534, 405]], ['renal-vein', [490, 422]]].forEach(([id, h]) => S.pin(U(id), U(id), h));
  S.pin('digestive-system-liver', 'liver', [270, 260]); S.pin('respiratory-system-diaphragm', 'respiratory-system-diaphragm', [330, 122]); S.pin('ves-aorta', 'ves-aorta', [500, 620]); S.pin('cv-ivc', 'cv-ivc', [448, 620]);
  S.at('level'); transverse(S, 'kidney');
  S.pin(U('kidney'), U('kidney'), [1083, 480]); S.pin('digestive-system-liver', 'liver', [1050, 340]); S.pin('cv-ivc', 'cv-ivc', [1147, 468]); S.pin('ves-aorta', 'ves-aorta', [1197, 474]);
}
plates.push({
  key: 'kidney-placement', moduleId: 'urinary-system', kind: 'gross-diagram', lessons: ['urinary-kidney'], purpose: 'Where the kidneys sit: behind the peritoneum on the posterior abdominal wall, the right lower than the left, beside the liver, aorta and inferior vena cava.',
  title: ['Kidney placement in the abdomen', 'Situación de los riñones en el abdomen'],
  desc: ['Left: anterior view of the trunk drawn as if transparent, patient right at viewer left. The kidneys lie high on the posterior abdominal wall beside the spine, on either side of the aorta (red) and inferior vena cava (blue). The right kidney sits lower than the left because the liver lies above it. Renal arteries come off the aorta, renal veins join the vena cava, and each ureter descends to the bladder. The diaphragm roofs the abdomen. Right: transverse section at the level of the kidneys, seen from below with patient right at viewer left. Both kidneys are retroperitoneal: they lie in perirenal fat against the posterior wall, behind the peritoneal cavity (dashed line), beside the psoas muscles and vertebra, with the liver on the right and the aorta and vena cava in front of the spine. Positions are schematic.',
    'Izquierda: vista anterior del tronco dibujada como si fuera transparente, derecha del paciente a la izquierda. Los riñones están altos en la pared abdominal posterior junto a la columna, a cada lado de la aorta (roja) y la vena cava inferior (azul). El riñón derecho queda más bajo que el izquierdo porque el hígado está encima. Las arterias renales salen de la aorta, las venas renales llegan a la cava y cada uréter desciende a la vejiga. El diafragma cubre el abdomen. Derecha: corte transversal a nivel de los riñones, visto desde abajo con la derecha del paciente a la izquierda. Ambos riñones son retroperitoneales: están en la grasa perirrenal contra la pared posterior, detrás de la cavidad peritoneal (línea discontinua), junto a los músculos psoas y la vértebra, con el hígado a la derecha y la aorta y la cava delante de la columna. Posiciones esquemáticas.'],
  orientation: ['left: anterior view drawn transparent, patient right at viewer left; right: transverse section seen from below', 'izquierda: vista anterior transparente, derecha del paciente a la izquierda; derecha: corte transversal visto desde abajo'], draw: kidneyPlace,
});
