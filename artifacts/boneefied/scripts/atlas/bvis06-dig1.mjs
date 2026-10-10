// BVIS06 digestive plates 1-3: oral cavity, stomach, whole alimentary canal route.
import { T, LUM, LUML, net, patch, circ, rect, sm, poly, E, RR, tube } from './bvis06-lib.mjs';
const MOD = 'digestive-system';
const D = (s) => 'digestive-system-' + s;
export const plates = [];

// ---------------------------------------------------------------- 1 oral cavity
function oral(S) {
  S.panel(30, 30, 880, 940, 'sagittal'); S.panel(930, 30, 490, 940, 'lateral');
  S.at('sagittal');
  S.sh(null, sm([[255, 190], [205, 380], [192, 440], [216, 470], [214, 505], [224, 560], [238, 650], [330, 740], [352, 930], [690, 930], [690, 700], [770, 560], [790, 400], [740, 220], [580, 100], [400, 100]], true, 8), { ...T.skin, sw: 2 });
  S.sh(null, sm([[240, 440], [300, 376], [405, 360], [432, 392], [436, 470], [330, 488], [250, 478]]), { fill: '#DCE8EA', line: '#7E9AA3' });
  // airway (decor) in front of the oesophagus
  net(S, [{ pts: [[492, 716], [492, 925]], w: 40, fill: '#B4CFCB', line: '#4F7A74' }]);
  net(S, [
    { id: D('pharynx'), pts: [[540, 420], [540, 560], [542, 690]], w: 90, fill: T.muc.fill, line: T.muc.line, lum: '#EBCFCB', lw: 70 },
    { id: D('esophagus'), pts: [[542, 690], [556, 800], [560, 925]], w: 36, fill: T.gut.fill, line: T.gut.line, lum: LUM, lw: 14 },
  ]);
  S.sh(null, sm([[470, 598], [498, 598], [498, 654], [476, 660]], true, 3), { fill: '#CAD7D6', line: '#6F8D8A', sw: 1.2 }); // epiglottis/larynx hint
  S.sh(D('hard-palate'), sm([[236, 486], [330, 496], [424, 498], [426, 514], [330, 516], [240, 508]], true, 4), { ...T.bone, sw: 1.5 });
  S.sh(D('soft-palate'), sm([[420, 498], [470, 506], [498, 552], [482, 574], [452, 534], [424, 516]], true, 4), { ...T.muc, sw: 1.5 });
  // floor of mouth + mandible
  S.sh(null, sm([[248, 640], [330, 664], [430, 652], [444, 700], [340, 704], [262, 680]], true, 4), { ...T.muscle, sw: 1.4 });
  S.sh(null, sm([[226, 640], [246, 712], [340, 736], [440, 716], [446, 696], [340, 706], [262, 684], [256, 640]], true, 4), { ...T.bone, sw: 1.5 });
  S.sh('mouth', sm([[228, 512], [330, 520], [426, 520], [470, 548], [500, 562], [506, 612], [470, 642], [440, 660], [330, 666], [246, 644], [232, 580]], true, 5), { fill: LUM, line: T.muc.line, sw: 1.5 });
  S.sh(D('tongue'), sm([[284, 616], [312, 576], [392, 566], [442, 584], [472, 620], [466, 654], [400, 664], [312, 646], [284, 640]], true, 5), { ...T.tongue, sw: 1.6 });
  patch(S, poly([[486, 576], [512, 576], [512, 606], [486, 606]]), '#EBCFCB');
  // lips and teeth
  S.sh(null, sm([[204, 484], [248, 482], [256, 518], [224, 524]], true, 4), { ...T.muc, sw: 1.4 });
  S.sh(null, sm([[212, 596], [256, 604], [262, 646], [226, 636]], true, 4), { ...T.muc, sw: 1.4 });
  S.sh(D('teeth'), poly([[246, 518], [266, 518], [262, 552], [248, 552]]), { fill: '#F2ECE0', line: '#9A9280', sw: 1.4 });
  S.sh(D('teeth'), RR(342, 520, 30, 24, 5), { fill: '#F2ECE0', line: '#9A9280', sw: 1.4 });
  S.sh(D('teeth'), poly([[258, 576], [276, 580], [274, 614], [260, 610]]), { fill: '#F2ECE0', line: '#9A9280', sw: 1.4 });
  S.sh(null, RR(350, 646, 34, 14, 4), { fill: '#F2ECE0', line: '#9A9280', sw: 1.2 });
  // glands in the floor of the mouth (shown projected on the midline) and their ducts
  net(S, [
    { id: D('sublingual-duct'), pts: [[296, 670], [296, 656]], w: 6, fill: '#E4C7A0', line: '#8A6E3C' },
  ]);
  S.sh(D('sublingual-gland'), E(286, 678, 34, 11), { ...T.gland, sw: 1.4 });
  net(S, [{ id: null, pts: [[372, 678], [330, 670], [306, 662]], w: 5, fill: '#E4C7A0', line: '#8A6E3C' }]);
  S.sh(D('submandibular-gland'), E(410, 684, 40, 15), { ...T.gland, sw: 1.4 });
  net(S, [{ id: null, pts: [[392, 682], [350, 672], [312, 664]], w: 5, fill: '#E4C7A0', line: '#8A6E3C' }]);
  [['mouth', [330, 538]], ['tongue', [380, 620]], ['hard-palate', [330, 506]], ['soft-palate', [466, 530]], ['teeth', [356, 532]], ['pharynx', [540, 560]], ['esophagus', [556, 840]],
    ['sublingual-gland', [284, 678]], ['sublingual-duct', [296, 663]], ['submandibular-gland', [416, 686]]].forEach(([id, h]) => S.pin(D(id), D(id), h));
  S.pin(D('mouth'), 'mouth', [330, 538]); S.pins.splice(S.pins.findIndex((p) => p.structureId === D('mouth') && p.key === D('mouth')), 1);
  S.pins.splice(S.pins.findIndex((p) => p.structureId === D('teeth')), 1); S.pin(D('teeth'), D('teeth'), [356, 532]);
  // lateral view: skin and cheek removed
  S.at('lateral');
  S.sh(null, sm([[1010, 200], [960, 360], [950, 450], [975, 480], [972, 530], [985, 600], [1000, 700], [1090, 770], [1110, 930], [1330, 930], [1340, 740], [1390, 600], [1395, 420], [1350, 260], [1230, 140], [1100, 130]], true, 8), { ...T.skin, sw: 2 });
  S.sh(null, E(1315, 470, 20, 34), { ...T.skin, sw: 1.4 });
  S.sh(null, sm([[985, 470], [1060, 480], [1182, 486], [1186, 524], [1080, 526], [988, 520]], true, 4), { ...T.bone, sw: 1.5 });
  S.sh(null, sm([[990, 598], [1030, 690], [1150, 716], [1250, 694], [1264, 420], [1230, 418], [1216, 590], [1120, 640], [1030, 612]], true, 5), { ...T.bone, sw: 1.5 });
  for (let i = 0; i < 8; i++) { const x = 992 + i * 22, w = i < 2 ? 18 : i > 4 ? 24 : 20; S.sh(D('teeth'), RR(x, 526, w, 28, 5), { fill: '#F2ECE0', line: '#9A9280', sw: 1.4 }); S.sh(null, RR(x + 2, 562, w, 28, 5), { fill: '#F2ECE0', line: '#9A9280', sw: 1.2 }); }
  S.sh(D('submandibular-gland'), sm([[1100, 700], [1170, 690], [1220, 722], [1190, 768], [1120, 764]], true, 4), { ...T.gland, sw: 1.5 });
  net(S, [{ id: null, pts: [[1210, 466], [1172, 496], [1150, 526]], w: 6, fill: '#E4C7A0', line: '#8A6E3C' }]);
  S.sh(D('parotid-gland'), sm([[1196, 380], [1252, 366], [1296, 440], [1282, 530], [1230, 572], [1190, 504]], true, 5), { ...T.gland, sw: 1.6 });
  S.pin(D('parotid-gland'), D('parotid-gland'), [1244, 470]); S.pin(D('submandibular-gland'), D('submandibular-gland'), [1160, 730]); S.pin(D('teeth'), D('teeth'), [1100, 540]);
}
plates.push({
  key: 'oral-cavity', moduleId: MOD, kind: 'gross-diagram', lessons: ['digestive-oral'], purpose: 'Oral cavity in midline sagittal section, and the three paired salivary glands from the side.',
  title: ['Oral cavity, pharynx and salivary glands', 'Cavidad oral, faringe y glándulas salivales'],
  desc: ['Left: midline sagittal section of the head, face at viewer left. The hard palate (bony, anterior) and soft palate (muscular, posterior) form the roof of the mouth; the tongue fills the floor. Teeth sit in the upper and lower arches. The mouth opens behind into the pharynx, which passes into the oesophagus; the airway (teal tube) lies in front of the oesophagus. In the floor of the mouth the sublingual gland opens by small sublingual ducts and the submandibular gland by a duct beside the lingual frenulum (both glands lie to the side of the midline and are projected here). Right: lateral view with skin and cheek removed: the parotid gland lies over the ramus of the mandible and its duct opens in the cheek near an upper molar; the submandibular gland lies below the jaw. Simplified.',
    'Izquierda: corte sagital medio de la cabeza, cara a la izquierda. El paladar duro (óseo, anterior) y el blando (muscular, posterior) forman el techo de la boca; la lengua ocupa el suelo. Los dientes se disponen en las arcadas superior e inferior. La boca se continúa atrás con la faringe, que pasa al esófago; la vía aérea (tubo verde azulado) queda delante del esófago. En el suelo de la boca la glándula sublingual se abre por pequeños conductos sublinguales y la submandibular por un conducto junto al frenillo lingual (ambas glándulas quedan a los lados de la línea media y aquí se proyectan). Derecha: vista lateral sin piel ni mejilla: la parótida cubre la rama mandibular y su conducto se abre en la mejilla junto a un molar superior; la submandibular queda bajo la mandíbula. Simplificado.'],
  orientation: ['left: midline sagittal, face at viewer left; right: lateral view, face at viewer left', 'izquierda: corte sagital, cara a la izquierda; derecha: vista lateral, cara a la izquierda'], draw: oral,
});

// ---------------------------------------------------------------- 2 stomach
const STO = [[350, 258], [372, 190], [450, 135], [560, 125], [650, 180], [712, 300], [756, 420], [764, 540], [722, 650], [640, 730], [520, 742], [400, 712], [300, 680], [236, 668], [196, 650], [180, 628], [196, 606], [236, 592], [310, 586], [390, 578], [445, 555], [395, 505], [345, 420], [326, 300]];
function stomach(S) {
  S.panel(30, 30, 880, 940, 'stomach'); S.panel(930, 30, 490, 940, 'wall');
  S.at('stomach');
  net(S, [{ id: D('esophagus'), pts: [[262, 60], [292, 170], [352, 262]], w: 52, fill: T.gut.fill, line: T.gut.line, lum: LUM, lw: 24 }]);
  const od = sm(STO, true, 7);
  S.sh(null, od, { fill: LUM, line: T.stomach.line, sw: 1.8 });
  S.clipBoth(od);
  S.sh(D('body-of-stomach'), poly([[100, 40], [900, 40], [900, 900], [100, 900]]), { fill: '#EBC0B6', line: '#EBC0B6', sw: 0.5 });
  S.sh(D('fundus'), poly([[300, 40], [820, 40], [820, 262], [300, 262]]), { fill: '#E5B2A8', line: '#E5B2A8', sw: 0.5 });
  S.sh(D('pyloric-antrum'), poly([[300, 500], [445, 556], [492, 780], [300, 780]]), { fill: '#E9CDA8', line: '#E9CDA8', sw: 0.5 });
  S.sh(D('pyloric-canal'), poly([[140, 560], [300, 560], [300, 780], [140, 780]]), { fill: '#E4C29C', line: '#E4C29C', sw: 0.5 });
  S.sh(D('cardia'), circ(362, 288, 56), { fill: '#DFA89F', line: '#DFA89F', sw: 0.5 });
  for (let i = 0; i < 6; i++) { const y0 = 320 + i * 50; S.ln(D('rugae'), `M${372 + i * 6} ${y0 + 24}Q480 ${y0 - 22} 570 ${y0 + 12}T 735 ${y0 + 22 + i * 4}`, { color: '#C98881', w: 9 }); }
  S.clipBothEnd();
  S.ln(D('stomach'), od, { color: '#D79A90', w: 22 });
  S.out.push(`<path d="${od}" fill="none" stroke="${T.stomach.line}" stroke-width="1.8" stroke-linejoin="round"/>`);
  net(S, [{ id: D('duodenum'), pts: [[172, 630], [140, 650], [112, 710], [130, 790], [214, 850]], w: 46, fill: T.gut.fill, line: T.gut.line, lum: LUM, lw: 20 }]);
  S.sh(D('pyloric-sphincter'), sm([[190, 596], [228, 588], [232, 616], [190, 616]], true, 3), { fill: '#B87972', line: '#7E4A49', sw: 1.4 });
  S.sh(D('pyloric-sphincter'), sm([[190, 646], [232, 646], [228, 674], [190, 664]], true, 3), { fill: '#B87972', line: '#7E4A49', sw: 1.4 });
  patch(S, poly([[170, 616], [236, 616], [236, 646], [170, 646]]), LUM);
  S.ln(null, 'M150 630L214 630', { color: '#EADBD2', w: 18 });
  [['stomach', [330, 330]], ['cardia', [372, 300]], ['fundus', [560, 190]], ['body-of-stomach', [520, 480]], ['pyloric-antrum', [380, 640]], ['pyloric-canal', [262, 632]], ['pyloric-sphincter', [208, 600]], ['rugae', [480, 360]], ['esophagus', [290, 170]], ['duodenum', [118, 730]]].forEach(([id, h]) => S.pin(D(id), D(id), h));
  S.pin(D('pylorus'), D('pyloric-canal') + '+' + D('pyloric-sphincter'), [236, 640]);
  // gastric mucosa section
  S.at('wall');
  S.sh(null, rect(960, 60, 430, 90), { fill: LUM, line: LUM, sw: 0.5 });
  S.sh(null, rect(960, 700, 430, 240), { fill: T.conn.fill, line: T.conn.line, sw: 1 });
  S.sh(null, rect(960, 150, 430, 550), { fill: '#EFD9CE', line: '#EFD9CE', sw: 0.5 });
  S.sh(null, rect(960, 128, 430, 24), { fill: '#E8BBB2', line: '#B58078', sw: 1.2 });
  S.sh(null, poly([[960, 676], [1390, 676], [1390, 704], [960, 704]]), { fill: '#C9958B', line: '#8A524D', sw: 1.4 });
  const gx = [1020, 1110, 1200, 1290, 1360];
  net(S, gx.map((x) => ({ pts: [[x, 250], [x + 6, 450], [x - 4, 640]], w: 66, fill: '#E3B4AC', line: '#9A6A66', lum: LUM, lw: 12 })));
  net(S, gx.map((x) => ({ id: D('gastric-pit'), pts: [[x, 140], [x + 2, 200], [x + 2, 262]], w: 24, fill: '#E8BBB2', line: '#9A6A66', lum: LUM, lw: 14 })));
  gx.forEach((x) => patch(S, rect(x - 9, 112, 18, 56), LUM));
  gx.forEach((x, i) => { [[-26, 330], [24, 370], [-24, 430], [26, 480]].forEach(([dx, y], k) => S.sh(D('parietal-cell'), circ(x + dx + 2, y + i * 2, 15), { fill: '#CC8A86', line: '#7E4A49', sw: 1.4 }));
    [[-14, 580], [14, 590], [-10, 620], [12, 624], [0, 560]].forEach(([dx, y]) => S.sh(D('chief-cell'), E(x + dx, y, 12, 9), { fill: '#B592C0', line: '#6F5280', sw: 1.2 })); });
  S.pin(D('gastric-pit'), D('gastric-pit'), [1110, 150]); S.pin(D('parietal-cell'), D('parietal-cell'), [1136, 370]); S.pin(D('chief-cell'), D('chief-cell'), [1124, 590]);
}
plates.push({
  key: 'stomach', moduleId: MOD, kind: 'gross-diagram', lessons: ['digestive-stomach'], purpose: 'Stomach regions in an opened anterior view, with a schematic section of the gastric mucosa showing pits and glands.',
  title: ['Stomach: regions, rugae and gastric glands', 'Estómago: regiones, pliegues y glándulas gástricas'],
  desc: ['Left: anterior view of the stomach opened to show the lining, patient right at viewer left. The oesophagus enters at the cardia; the fundus rises above that level; the body is the broad central region; the pyloric antrum narrows into the pyloric canal, whose thick muscular outlet is the pyloric sphincter, together forming the pylorus, which opens into the duodenum. Rugae are lining folds that flatten when the stomach is distended. Right: schematic section of gastric mucosa: each gastric pit opens onto the surface and leads into a gland; parietal cells (large, pink) lie in the upper gland and chief cells (small, purple) at the base. Schematic, not a photomicrograph.',
    'Izquierda: vista anterior del estómago abierto para ver la mucosa, derecha del paciente a la izquierda. El esófago entra por el cardias; el fundus se eleva por encima de ese nivel; el cuerpo es la región central ancha; el antro pilórico se estrecha en el canal pilórico, cuya salida muscular gruesa es el esfínter pilórico; juntos forman el píloro, que se abre al duodeno. Los pliegues (rugas) son repliegues de la mucosa que se aplanan con la distensión. Derecha: sección esquemática de mucosa gástrica: cada foveola gástrica se abre en la superficie y conduce a una glándula; las células parietales (grandes, rosadas) están en la parte alta y las principales (pequeñas, moradas) en la base. Esquema, no fotomicrografía.'],
  orientation: ['left: anterior view, patient right at viewer left; right: schematic mucosal section, lumen at top', 'izquierda: vista anterior, derecha del paciente a la izquierda; derecha: sección esquemática de mucosa, luz arriba'], draw: stomach,
});

// ---------------------------------------------------------------- 3 canal route
function canal(S) {
  S.panel(30, 30, 880, 940, 'route'); S.panel(930, 30, 490, 940, 'valve'); S.at('route');
  S.sh(null, sm([[450, 226], [560, 236], [648, 262], [660, 420], [640, 640], [656, 820], [610, 960], [290, 960], [244, 820], [260, 640], [240, 420], [252, 262], [340, 236]], true, 6), { ...T.skin, sw: 1.8 });
  net(S, [{ pts: [[450, 160], [450, 230]], w: 54, fill: T.skin.fill, line: T.skin.line }]);
  S.sh(null, E(450, 112, 58, 66), { ...T.skin, sw: 1.8 });
  const g = { fill: T.gut.fill, line: T.gut.line };
  const items = [
    { id: D('pharynx'), pts: [[450, 128], [450, 205]], w: 24, ...g, lum: LUM, lw: 12 },
    { id: D('esophagus'), pts: [[450, 205], [452, 300], [488, 350]], w: 18, ...g, lum: LUM, lw: 8 },
    { id: D('stomach'), pts: [[497, 358], [556, 392], [552, 450], [498, 480], [446, 476]], w: 56, fill: T.stomach.fill, line: T.stomach.line, lum: LUM, lw: 32 },
    { id: D('duodenum'), pts: [[446, 476], [404, 486], [388, 520], [398, 560], [440, 575]], w: 20, ...g, lum: LUM, lw: 8 },
    { id: D('jejunum'), pts: [[440, 575], [520, 580], [540, 604], [452, 608], [420, 630], [520, 636], [538, 660], [432, 664]], w: 20, ...g, lum: LUM, lw: 8 },
    { id: D('ileum'), pts: [[432, 664], [404, 690], [520, 698], [540, 722], [430, 726], [420, 750], [510, 756], [470, 782], [398, 776], [366, 768]], w: 20, fill: '#DDAF9E', line: T.gut.line, lum: LUM, lw: 8 },
    { id: D('cecum'), pts: [[340, 800], [340, 740]], w: 46, ...g, lum: LUM, lw: 30 },
    { id: D('ascending-colon'), pts: [[340, 740], [340, 600], [338, 520]], w: 34, ...g, lum: LUM, lw: 20 },
    { id: D('transverse-colon'), pts: [[338, 520], [372, 548], [450, 556], [528, 540], [560, 508]], w: 34, ...g, lum: LUM, lw: 20 },
    { id: D('descending-colon'), pts: [[560, 508], [562, 600], [562, 720], [558, 800]], w: 34, ...g, lum: LUM, lw: 20 },
    { id: D('sigmoid-colon'), pts: [[558, 800], [548, 846], [500, 856], [476, 826], [462, 854], [470, 880]], w: 30, ...g, lum: LUM, lw: 16 },
    { id: D('rectum'), pts: [[470, 880], [452, 900], [450, 918]], w: 28, ...g, lum: LUM, lw: 14 },
    { id: D('anal-canal'), pts: [[450, 912], [450, 940]], w: 18, fill: '#D3A090', line: T.gut.line, lum: LUM, lw: 5 },
  ];
  net(S, items.slice(0, 6));
  net(S, items.slice(6));
  net(S, [{ pts: [[372, 768], [344, 768]], w: 8, fill: LUM, line: LUM }]);
  S.sh(D('mouth'), E(450, 118, 20, 8), { fill: '#C27E7A', line: '#7E4A49', sw: 1.4 });
  S.sh(D('anus'), E(450, 948, 14, 7), { fill: '#C27E7A', line: '#7E4A49', sw: 1.4 });
  [['mouth', [450, 118]], ['pharynx', [450, 175]], ['esophagus', [452, 280]], ['stomach', [540, 450]], ['duodenum', [390, 526]], ['jejunum', [520, 636]], ['ileum', [510, 756]], ['cecum', [340, 790]], ['ascending-colon', [340, 640]], ['transverse-colon', [450, 556]],
    ['descending-colon', [562, 660]], ['sigmoid-colon', [510, 856]], ['rectum', [456, 892]], ['anal-canal', [450, 928]], ['anus', [450, 948]]].forEach(([id, h]) => S.pin(D(id), D(id), h));
  S.at('valve');
  net(S, [
    { id: D('appendix'), pts: [[1232, 745], [1290, 840], [1300, 900], [1262, 935]], w: 26, ...g, lum: LUM, lw: 10 },
    { id: D('ascending-colon'), pts: [[1180, 120], [1180, 420]], w: 200, ...g, lum: LUM, lw: 164 },
    { id: D('cecum'), pts: [[1180, 420], [1180, 700]], w: 200, ...g, lum: LUM, lw: 164 },
    { id: D('ileum'), pts: [[1412, 524], [1344, 492], [1296, 482]], w: 30, fill: '#DDAF9E', line: T.gut.line, lum: LUM, lw: 12 },
  ]);
  S.sh(D('ileocecal-valve'), sm([[1292, 446], [1236, 462], [1228, 476], [1292, 478]], true, 4), { fill: '#C07F78', line: '#7E4A49', sw: 1.5 });
  S.sh(D('ileocecal-valve'), sm([[1292, 486], [1228, 490], [1236, 506], [1292, 522]], true, 4), { fill: '#C07F78', line: '#7E4A49', sw: 1.5 });
  net(S, [{ pts: [[1412, 524], [1344, 492], [1262, 482]], w: 8, fill: LUM, line: LUM }]);
  [['ascending-colon', [1180, 260]], ['cecum', [1150, 620]], ['ileocecal-valve', [1250, 468]], ['appendix', [1296, 880]], ['ileum', [1380, 508]]].forEach(([id, h]) => S.pin(D(id), D(id), h));
}
plates.push({
  key: 'alimentary-canal', moduleId: MOD, kind: 'gross-diagram', lessons: ['digestive-continuity'], purpose: 'One continuous schematic lumen from mouth to anus, with accessory organs deliberately absent.',
  title: ['Alimentary canal: mouth to anus', 'Tubo digestivo: de la boca al ano'],
  desc: ['Anterior schematic of the whole canal, patient right at viewer left, drawn as one continuous tube: mouth, pharynx, oesophagus, stomach, duodenum, jejunum and ileum, then cecum, ascending, transverse, descending and sigmoid colon, rectum, anal canal and anus. The small intestine lies within the frame of the large intestine, entering the cecum at the patient\'s lower right. The duodenum runs behind the transverse colon, which is drawn in front. The mouth and pharynx are shown face-on although the pharynx lies behind the mouth. Liver, gallbladder and pancreas are accessory organs and are not part of this route; they appear in their own plate. Schematic, not to scale.',
    'Esquema anterior de todo el tubo, derecha del paciente a la izquierda, dibujado como un tubo continuo: boca, faringe, esófago, estómago, duodeno, yeyuno e íleon, luego ciego, colon ascendente, transverso, descendente y sigmoide, recto, conducto anal y ano. El intestino delgado queda dentro del marco del intestino grueso y entra en el ciego en la parte inferior derecha del paciente. El duodeno discurre por detrás del colon transverso, que se dibuja delante. La boca y la faringe se muestran de frente aunque la faringe está detrás de la boca. Hígado, vesícula biliar y páncreas son órganos accesorios y no forman parte de este recorrido; aparecen en su propia lámina. Esquema, sin escala.'],
  orientation: ['anterior view, patient right at viewer left', 'vista anterior, derecha del paciente a la izquierda'], draw: canal,
});
