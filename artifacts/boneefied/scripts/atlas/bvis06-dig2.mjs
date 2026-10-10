// BVIS06 digestive plates 4-10: accessory organs, liver lobule/pancreas, wall layers, small intestine, large intestine, peritoneum.
import { T, LUM, net, patch, circ, rect, sm, poly, E, RR, tube, scallop, resample, cr, A, V } from './bvis06-lib.mjs';
const MOD = 'digestive-system';
const D = (s) => 'digestive-system-' + s;
export const plates = [];
const G = { fill: T.gut.fill, line: T.gut.line };

// ---------------------------------------------------------------- accessory organs
function accessory(S) {
  S.panel(30, 30, 880, 940, 'abdomen'); S.panel(930, 30, 490, 940, 'papilla'); S.at('abdomen');
  // pancreas (head in the duodenal C, body crossing, tail to the left)
  const pan = sm([[352, 640], [380, 610], [440, 600], [520, 590], [600, 570], [690, 520], [730, 530], [722, 562], [640, 612], [560, 652], [500, 682], [470, 730], [430, 770], [380, 760], [352, 700]], true, 6);
  S.sh(null, pan, { ...T.panc, sw: 1.8 });
  S.clipBoth(pan);
  S.sh(D('head-of-pancreas'), poly([[300, 500], [470, 500], [470, 900], [300, 900]]), { fill: '#E3C892', line: '#E3C892', sw: 0.5 });
  S.sh(D('body-of-pancreas'), poly([[470, 500], [650, 500], [650, 900], [470, 900]]), { fill: '#E8D09C', line: '#E8D09C', sw: 0.5 });
  S.sh(D('tail-of-pancreas'), poly([[650, 400], [800, 400], [800, 900], [650, 900]]), { fill: '#DEC18A', line: '#DEC18A', sw: 0.5 });
  S.clipBothEnd();
  S.out.push(`<path d="${pan}" fill="none" stroke="${T.panc.line}" stroke-width="1.8"/>`);
  net(S, [
    { id: D('duodenum'), pts: [[432, 560], [360, 572], [334, 620], [336, 700], [372, 772], [450, 792], [540, 776], [566, 730]], w: 36, ...G, lum: LUM, lw: 16 },
    { id: D('jejunum'), pts: [[566, 730], [600, 700], [640, 706]], w: 30, ...G, lum: LUM, lw: 12 },
  ]);
  // liver
  S.sh(D('left-lobe-of-liver'), sm([[430, 200], [540, 196], [650, 238], [706, 290], [640, 332], [540, 352], [440, 372]], true, 5), { ...T.liver, sw: 1.8 });
  S.sh(D('right-lobe-of-liver'), sm([[100, 320], [140, 232], [250, 180], [380, 168], [442, 198], [452, 330], [446, 430], [404, 484], [320, 504], [220, 484], [140, 430]], true, 6), { ...T.liver, sw: 1.8 });
  S.ln(null, 'M444 200Q452 300 452 360', { color: '#8A5A4C', w: 2.4 });
  // biliary tree and vessels
  net(S, [
    { pts: [[300, 340], [360, 380], [420, 412]], w: 6, fill: T.bile.fill, line: T.bile.line },
    { pts: [[560, 316], [500, 360], [436, 410]], w: 6, fill: T.bile.fill, line: T.bile.line },
    { id: D('common-hepatic-duct'), pts: [[428, 408], [431, 446], [432, 482]], w: 9, fill: T.bile.fill, line: T.bile.line },
    { id: D('common-bile-duct'), pts: [[432, 482], [438, 560], [440, 620], [410, 682], [380, 690], [346, 694]], w: 9, fill: T.bile.fill, line: T.bile.line },
    { id: D('cystic-duct'), pts: [[388, 450], [410, 470], [432, 484]], w: 8, fill: T.bile.fill, line: T.bile.line },
    { id: D('pancreatic-duct'), pts: [[704, 540], [600, 588], [500, 634], [444, 690], [402, 698], [346, 694]], w: 9, fill: T.pduct.fill, line: T.pduct.line },
  ]);
  S.sh(D('gallbladder'), sm([[372, 444], [404, 436], [424, 486], [404, 548], [376, 568], [352, 520]], true, 5), { ...T.gb, sw: 1.8 });
  net(S, [{ id: D('cystic-duct'), pts: [[388, 450], [410, 470], [432, 484]], w: 8, fill: T.bile.fill, line: T.bile.line }]);
  net(S, [
    { id: D('hepatic-portal-vein'), pts: [[524, 650], [486, 548], [452, 432]], w: 13, fill: V.fill, line: V.line },
    { id: D('hepatic-artery'), pts: [[548, 600], [496, 524], [460, 428]], w: 7, fill: A.fill, line: A.line },
  ]);
  [['liver', D('left-lobe-of-liver') + '+' + D('right-lobe-of-liver'), [240, 300]], ['right-lobe-of-liver', null, [300, 250]], ['left-lobe-of-liver', null, [600, 280]], ['gallbladder', null, [388, 510]], ['cystic-duct', null, [414, 472]], ['common-hepatic-duct', null, [430, 446]],
    ['common-bile-duct', null, [440, 580]], ['pancreas', D('head-of-pancreas') + '+' + D('body-of-pancreas') + '+' + D('tail-of-pancreas'), [560, 628]], ['head-of-pancreas', null, [410, 700]], ['body-of-pancreas', null, [560, 600]], ['tail-of-pancreas', null, [700, 546]],
    ['pancreatic-duct', null, [580, 596]], ['hepatic-artery', null, [478, 480]], ['hepatic-portal-vein', null, [500, 560]]].forEach(([id, k, h]) => S.pin(D(id), k ?? D(id), h));
  // opened duodenum: both ducts open together at the papilla
  S.at('papilla');
  S.sh(null, RR(1250, 300, 156, 540, 24), { ...T.panc, sw: 1.8 });
  net(S, [{ pts: [[1130, 150], [1130, 830]], w: 230, ...G, lum: LUM, lw: 170 }]);
  S.sh(D('major-duodenal-papilla'), sm([[1262, 484], [1214, 494], [1186, 520], [1214, 550], [1262, 560]], true, 4), { fill: '#CC918A', line: '#7E4A49', sw: 1.6 });
  net(S, [
    { id: D('common-bile-duct'), pts: [[1372, 96], [1362, 300], [1320, 430], [1264, 518]], w: 14, fill: T.bile.fill, line: T.bile.line },
    { id: D('pancreatic-duct'), pts: [[1392, 800], [1342, 650], [1294, 566], [1264, 522]], w: 12, fill: T.pduct.fill, line: T.pduct.line },
    { id: D('hepatopancreatic-ampulla'), pts: [[1264, 520], [1226, 520], [1198, 520]], w: 20, fill: '#CFC596', line: '#7E7A48', lum: '#E6DDB4', lw: 8 },
  ]);
  patch(S, circ(1196, 520, 6), LUM);
  [['major-duodenal-papilla', [1230, 498]], ['hepatopancreatic-ampulla', [1236, 520]], ['common-bile-duct', [1360, 280]], ['pancreatic-duct', [1360, 690]]].forEach(([id, h]) => S.pin(D(id), D(id), h));
}
plates.push({
  key: 'liver-biliary-pancreas', moduleId: MOD, kind: 'gross-diagram', lessons: ['digestive-accessory', 'digestive-portal'], purpose: 'Liver, gallbladder and pancreas with the connected bile and pancreatic ducts reaching the duodenum.',
  title: ['Liver, gallbladder, pancreas and their ducts', 'Hígado, vesícula biliar, páncreas y sus conductos'],
  desc: ['Left: anterior view, patient right at viewer left; stomach and most intestine removed. The liver lies mainly on the patient\'s right, its small left lobe extending across the midline. Bile leaves the liver by hepatic ducts that join as the common hepatic duct; the cystic duct from the gallbladder joins it to form the common bile duct, which runs down behind the duodenum to the pancreatic head. The pancreatic duct runs the length of the pancreas (head in the duodenal C, body crossing the midline, tail toward the spleen) and meets the bile duct at the duodenum. At the porta hepatis the hepatic artery and portal vein enter the liver. Right: the descending duodenum opened: the common bile duct and pancreatic duct unite in the hepatopancreatic ampulla, which opens at the major duodenal papilla. Simplified.',
    'Izquierda: vista anterior, derecha del paciente a la izquierda; sin estómago y casi todo el intestino. El hígado queda sobre todo a la derecha del paciente y su pequeño lóbulo izquierdo cruza la línea media. La bilis sale del hígado por conductos hepáticos que se unen en el conducto hepático común; el conducto cístico de la vesícula se une a él para formar el colédoco, que baja por detrás del duodeno hasta la cabeza del páncreas. El conducto pancreático recorre el páncreas (cabeza en la C duodenal, cuerpo cruzando la línea media, cola hacia el bazo) y se encuentra con el colédoco en el duodeno. En el hilio hepático entran la arteria hepática y la vena porta. Derecha: duodeno descendente abierto: el colédoco y el conducto pancreático se unen en la ampolla hepatopancreática, que se abre en la papila duodenal mayor. Simplificado.'],
  orientation: ['left: anterior view, patient right at viewer left; right: opened descending duodenum', 'izquierda: vista anterior, derecha del paciente a la izquierda; derecha: duodeno descendente abierto'], draw: accessory,
});

// ---------------------------------------------------------------- liver lobule and pancreatic acinus
function lobule(S) {
  S.panel(30, 30, 900, 940, 'lobule'); S.panel(950, 30, 470, 940, 'pancreas'); S.at('lobule');
  const cx = 480, cy = 500, R = 330, pt = (r, a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  S.sh(D('liver-lobule'), poly([0, 60, 120, 180, 240, 300].map((a) => pt(R + 8, a))), { fill: '#F0DCD2', line: '#B58E82', sw: 2 });
  for (let k = 0; k < 6; k++) { const [x, y] = pt(300, k * 60); S.sh(D('portal-triad'), circ(x, y, 52), { fill: '#EADFC8', line: '#A59A82', sw: 1.4 }); }
  [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].forEach((a) => { if (a % 60 === 0) return;
    for (let r = 108; r < 280; r += 36) { const [x, y] = pt(r, a); S.sh(D('hepatocyte'), circ(x, y, 17), { fill: '#E3B4AA', line: '#8A5C58', sw: 1.3 }); S.sh(null, circ(x, y, 5), { fill: '#9C7C96', line: '#5E4A5A', sw: 0.8 }); } });
  for (let k = 0; k < 6; k++) { const a = k * 60;
    for (let r = 108; r < 250; r += 36) { const [x, y] = pt(r, a); S.sh(D('hepatocyte'), circ(x, y, 17), { fill: '#E3B4AA', line: '#8A5C58', sw: 1.3 }); S.sh(null, circ(x, y, 5), { fill: '#9C7C96', line: '#5E4A5A', sw: 0.8 }); } }
  const items = [{ id: D('central-vein'), pts: [[cx, cy], [cx + 1, cy]], w: 70, fill: V.fill, line: V.line, lum: '#C7D6E4', lw: 52 }];
  for (let k = 0; k < 6; k++) { const a = k * 60, P = pt(300, a);
    items.push({ id: D('hepatic-portal-vein'), pts: [P, [P[0] + 0.5, P[1]]], w: 30, fill: V.fill, line: V.line, lum: '#C7D6E4', lw: 18 });
    [-14, 14].forEach((da) => items.push({ id: D('hepatic-sinusoid'), pts: [P, pt(258, a + da * 0.5), pt(230, a + da), pt(150, a + da * 0.9), pt(80, a + da * 0.6), pt(30, a + da * 0.4)], w: 12, fill: '#A9BFD3', line: V.line, lum: '#D3DFEA', lw: 5 })); }
  net(S, items);
  for (let k = 0; k < 6; k++) { const a = k * 60, P = pt(300, a), n = [Math.cos(((a + 90) * Math.PI) / 180), Math.sin(((a + 90) * Math.PI) / 180)];
    S.sh(D('hepatic-artery'), circ(P[0] + n[0] * 30, P[1] + n[1] * 30, 8), { fill: A.fill, line: A.line, sw: 1.3 });
    S.sh(null, circ(P[0] - n[0] * 30, P[1] - n[1] * 30, 11), { fill: T.bile.fill, line: T.bile.line, sw: 1.4 }); S.sh(null, circ(P[0] - n[0] * 30, P[1] - n[1] * 30, 5), { fill: LUM, line: T.bile.line, sw: 1 }); }
  S.pin(D('liver-lobule'), D('liver-lobule'), pt(220, 30)); S.pin(D('central-vein'), D('central-vein'), [cx, cy]); S.pin(D('portal-triad'), D('portal-triad'), pt(330, 60)); S.pin(D('hepatic-sinusoid'), D('hepatic-sinusoid'), pt(150, 194));
  S.pin(D('hepatocyte'), D('hepatocyte'), pt(144, 90)); S.pin(D('hepatic-portal-vein'), D('hepatic-portal-vein'), pt(300, 120));
  // pancreas: acini drain by small ducts into the pancreatic duct; islet among them
  S.at('pancreas');
  const acini = [[1090, 160], [1250, 150], [1330, 260], [1070, 300], [1230, 330], [1100, 450], [1260, 470], [1340, 620], [1090, 600], [1250, 640]];
  acini.forEach(([x, y]) => { for (let i = 0; i < 7; i++) { const a = (i * 360) / 7; S.sh(D('pancreatic-acinus'), circ(x + 21 * Math.cos((a * Math.PI) / 180), y + 21 * Math.sin((a * Math.PI) / 180), 15), { fill: '#C8A4B8', line: '#76566A', sw: 1.3 }); } S.sh(D('pancreatic-acinus'), circ(x, y, 8), { fill: LUM, line: '#76566A', sw: 1 }); });
  S.sh(D('pancreatic-islet'), sm([[1290, 770], [1340, 744], [1396, 768], [1404, 830], [1350, 876], [1296, 850]], true, 5), { fill: '#EBDDB8', line: '#9A8A4A', sw: 1.6 });
  [[1330, 790], [1372, 796], [1380, 836], [1330, 846], [1350, 818]].forEach(([x, y]) => S.sh(null, circ(x, y, 6), { fill: '#C9A9A0', line: '#8A6A60', sw: 0.8 }));
  const dk = { fill: T.pduct.fill, line: T.pduct.line };
  net(S, [
    { id: D('pancreatic-duct'), pts: [[1200, 930], [1196, 700], [1190, 560], [1180, 380], [1176, 110]], w: 24, ...dk, lum: LUM, lw: 12 },
    ...[[1090, 160, 1176, 190], [1250, 150, 1176, 130], [1330, 260, 1182, 300], [1070, 300, 1180, 260], [1230, 330, 1182, 380], [1100, 450, 1186, 500], [1260, 470, 1188, 480], [1340, 620, 1196, 640], [1090, 600, 1194, 590], [1250, 640, 1196, 660]].map(([x, y, jx, jy]) => ({ pts: [[x, y], [(x + jx) / 2, (y + jy) / 2 - 8], [jx, jy]], w: 8, ...dk, lum: LUM, lw: 3 })),
  ]);
  S.pin(D('pancreatic-acinus'), D('pancreatic-acinus'), [1065, 300]); S.pin(D('pancreatic-islet'), D('pancreatic-islet'), [1346, 860]); S.pin(D('pancreatic-duct'), D('pancreatic-duct'), [1196, 620]);
}
plates.push({
  key: 'liver-lobule-pancreas', moduleId: MOD, kind: 'tissue-schematic', lessons: ['digestive-accessory', 'digestive-portal', 'digestive-histology'], purpose: 'Classic hexagonal liver lobule with portal triads, sinusoids and central vein, and a schematic of pancreatic acini, ducts and an islet.',
  title: ['Liver lobule and pancreatic acini', 'Lobulillo hepático y acinos pancreáticos'],
  desc: ['Left: schematic hepatic lobule. A portal triad (portal vein, hepatic artery and bile duct in connective tissue) sits at each corner. Blood (blue) flows from portal vein and artery through the sinusoids between plates of hepatocytes to the central vein at the centre, which drains the lobule. Bile moves the opposite way, from hepatocytes toward the bile ducts in the triads, not through the sinusoids. Right: pancreatic acini (rings of exocrine cells around a small lumen) empty through small ducts into the pancreatic duct; a pale pancreatic islet (endocrine) lies among them and has no duct. Schematic, not a photomicrograph; cell number and size are simplified.',
    'Izquierda: lobulillo hepático esquemático. En cada vértice hay una tríada portal (vena porta, arteria hepática y conducto biliar en tejido conjuntivo). La sangre (azul) fluye desde la vena porta y la arteria por los sinusoides entre láminas de hepatocitos hasta la vena central, que drena el lobulillo. La bilis se mueve en sentido contrario, desde los hepatocitos hacia los conductos biliares de las tríadas, no por los sinusoides. Derecha: acinos pancreáticos (anillos de células exocrinas alrededor de una luz pequeña) vacían por conductillos en el conducto pancreático; un islote pancreático pálido (endocrino) queda entre ellos y no tiene conducto. Esquema, no fotomicrografía; número y tamaño de células simplificados.'],
  orientation: ['left: lobule seen in transverse section; right: pancreatic tissue', 'izquierda: lobulillo en corte transversal; derecha: tejido pancreático'], draw: lobule,
});

// ---------------------------------------------------------------- wall layers
function wall(S) {
  S.panel(30, 30, 900, 940, 'ring'); S.panel(950, 30, 470, 940, 'layers'); S.at('ring');
  const cx = 480, cy = 500, lay = (id, r, f, l, sw = 1.4) => S.sh(id, circ(cx, cy, r), { fill: f, line: l, sw });
  lay(D('serosa'), 372, '#EAD9B6', '#A59A82'); lay(D('longitudinal-muscle-layer'), 354, '#C9958B', '#8A524D'); lay(D('circular-muscle-layer'), 318, '#D6A59B', '#8A524D'); lay(D('submucosa'), 280, '#EADFC8', '#A59A82');
  lay(D('muscularis-mucosae'), 228, '#C4857E', '#8A524D', 1); lay(D('lamina-propria'), 217, '#F0DCD2', '#B58E82', 1); lay(D('mucosa'), 190, '#E3B4AA', '#9A6A66', 1.4); lay(null, 178, LUM, '#B49C92', 1.4);
  for (let i = 0; i < 36; i++) { const a = (i * 10 * Math.PI) / 180; S.ln(null, `M${cx + 322 * Math.cos(a)} ${cy + 322 * Math.sin(a)}L${cx + 340 * Math.cos(a + 0.1)} ${cy + 340 * Math.sin(a + 0.1)}`, { color: '#A8736C', w: 2 }); }
  [30, 130, 220, 300].forEach((d) => { const a = (d * Math.PI) / 180; S.sh(null, E(cx + 250 * Math.cos(a), cy + 250 * Math.sin(a), 11, 11), { fill: A.fill, line: A.line, sw: 1.2 }); });
  S.pin(D('serosa'), D('serosa'), [cx + 363, cy]); S.pin(D('longitudinal-muscle-layer'), D('longitudinal-muscle-layer'), [cx, cy - 336]); S.pin(D('circular-muscle-layer'), D('circular-muscle-layer'), [cx - 298, cy]);
  S.pin(D('submucosa'), D('submucosa'), [cx, cy + 262]); S.pin(D('muscularis-mucosae'), D('muscularis-mucosae'), [cx + 223, cy - 20]); S.pin(D('lamina-propria'), D('lamina-propria'), [cx - 204, cy - 20]); S.pin(D('mucosa'), D('mucosa'), [cx, cy - 184]);
  S.pin(D('muscularis-externa'), D('circular-muscle-layer') + '+' + D('longitudinal-muscle-layer'), [cx, cy - 336 + 18]);
  // longitudinal block: circular fibres run along the cut, longitudinal fibres are cut across
  S.at('layers');
  const x0 = 980, w = 410;
  S.sh('B-mucosa', rect(x0, 190, w, 26), { fill: '#E3B4AA', line: '#9A6A66', sw: 1.2 });
  S.sh('B-lamina-propria', rect(x0, 216, w, 100), { fill: '#F0DCD2', line: '#B58E82', sw: 1.2 });
  S.sh('B-muscularis-mucosae', rect(x0, 316, w, 22), { fill: '#C4857E', line: '#8A524D', sw: 1.2 });
  S.sh('B-submucosa', rect(x0, 338, w, 160), { fill: '#EADFC8', line: '#A59A82', sw: 1.2 });
  S.sh('B-circular-muscle-layer', rect(x0, 498, w, 110), { fill: '#D6A59B', line: '#8A524D', sw: 1.2 });
  S.sh('B-longitudinal-muscle-layer', rect(x0, 608, w, 110), { fill: '#C9958B', line: '#8A524D', sw: 1.2 });
  S.sh('B-serosa', rect(x0, 718, w, 34), { fill: '#EAD9B6', line: '#A59A82', sw: 1.2 });
  for (let y = 520; y < 600; y += 16) S.ln(null, `M${x0 + 10} ${y}Q${x0 + 200} ${y - 6} ${x0 + w - 10} ${y}`, { color: '#A8736C', w: 2 });
  for (let x = x0 + 24; x < x0 + w - 10; x += 34) for (let y = 636; y < 704; y += 26) S.sh(null, E(x, y, 11, 8), { fill: '#BF8479', line: '#8A524D', sw: 1 });
  S.sh(null, E(1180, 420, 26, 14), { fill: A.fill, line: A.line, sw: 1.2 }); S.sh(null, E(1300, 440, 22, 12), { fill: V.fill, line: V.line, sw: 1.2 });
  S.pin(D('mucosa'), 'B-mucosa', [1180, 203]); S.pin(D('lamina-propria'), 'B-lamina-propria', [1180, 266]); S.pin(D('muscularis-mucosae'), 'B-muscularis-mucosae', [1180, 327]); S.pin(D('submucosa'), 'B-submucosa', [1180, 380]);
  S.pin(D('circular-muscle-layer'), 'B-circular-muscle-layer', [1180, 552]); S.pin(D('muscularis-externa'), 'B-circular-muscle-layer+B-longitudinal-muscle-layer', [1180, 604]); S.pin(D('longitudinal-muscle-layer'), 'B-longitudinal-muscle-layer', [1180, 660]); S.pin(D('serosa'), 'B-serosa', [1180, 735]);
}
plates.push({
  key: 'digestive-wall-layers', moduleId: MOD, kind: 'tissue-schematic', lessons: ['digestive-wall'], purpose: 'The four-layer plan of the gut wall in cross-section and in longitudinal section.',
  title: ['Layers of the digestive wall', 'Capas de la pared digestiva'],
  desc: ['Left: schematic transverse section of a generic gut tube, lumen at the centre. From the lumen outward: mucosa (epithelium, lamina propria and a thin muscularis mucosae), submucosa with larger vessels, muscularis externa (the combined inner circular and outer longitudinal muscle layers) and the serosa, where the tube is covered by peritoneum. Right: the same layers in a longitudinal section: circular fibres are cut lengthwise in the circular layer, whereas longitudinal fibres are cut across. Simplified: villi, glands and nerve plexuses are omitted; layer thickness varies by organ. Schematic, not a photomicrograph.',
    'Izquierda: corte transversal esquemático de un tubo digestivo genérico, luz en el centro. De la luz hacia fuera: mucosa (epitelio, lámina propia y una delgada muscular de la mucosa), submucosa con vasos mayores, muscular externa (capa circular interna y longitudinal externa) y serosa, donde el tubo está cubierto por peritoneo. Derecha: las mismas capas en corte longitudinal: las fibras de la capa circular se cortan a lo largo y las longitudinales se cortan transversalmente. Simplificado: se omiten vellosidades, glándulas y plexos nerviosos; el grosor varía según el órgano. Esquema, no fotomicrografía.'],
  orientation: ['left: transverse section, lumen at centre; right: longitudinal section, lumen above', 'izquierda: corte transversal, luz en el centro; derecha: corte longitudinal, luz arriba'], draw: wall,
});

// ---------------------------------------------------------------- small intestine regions and villus
function small(S) {
  S.panel(30, 30, 880, 940, 'regions'); S.panel(930, 30, 490, 940, 'villus'); S.at('regions');
  const jej = { fill: '#E2AE9E', line: T.gut.line }, ile = { fill: '#DDBBAA', line: T.gut.line };
  net(S, [
    { pts: [[640, 70], [520, 80]], w: 50, fill: T.stomach.fill, line: T.stomach.line, lum: LUM, lw: 26 },
    { id: D('duodenum'), pts: [[520, 80], [420, 94], [360, 170], [366, 300], [430, 372], [510, 366]], w: 42, ...G, lum: LUM, lw: 18 },
    { id: D('jejunum'), pts: [[510, 366], [580, 330], [800, 322], [850, 366], [780, 410], [590, 410], [560, 456], [640, 494], [820, 484], [858, 530], [790, 568], [600, 568]], w: 34, ...jej, lum: LUM, lw: 14 },
    { id: D('ileum'), pts: [[600, 568], [480, 580], [260, 600], [180, 650], [250, 700], [560, 690], [800, 710], [850, 770], [760, 820], [520, 800], [300, 820], [180, 880]], w: 28, ...ile, lum: LUM, lw: 11 },
  ]);
  [['duodenum', [364, 240]], ['jejunum', [700, 322]], ['ileum', [400, 598]]].forEach(([id, h]) => S.pin(D(id), D(id), h));
  S.at('villus');
  const P = [[955, 420], [1000, 410], [1020, 300], [1030, 170], [1060, 118], [1100, 170], [1112, 300], [1128, 380], [1136, 470], [1140, 560], [1160, 592], [1190, 592], [1206, 560], [1208, 470], [1216, 380], [1232, 300], [1244, 170], [1276, 118], [1316, 170], [1328, 300], [1348, 410], [1395, 420]];
  const pd = sm(P, false, 8), lp = poly([...cr(P, false, 8), [1395, 650], [955, 650]]);
  S.sh(null, lp, { fill: '#F0DCD2', line: '#F0DCD2', sw: 0.5 });
  S.sh(null, poly([[955, 650], [1395, 650], [1395, 930], [955, 930]]), { ...T.conn, sw: 1.2 });
  S.sh(null, poly([[955, 650], [1395, 650], [1395, 674], [955, 674]]), { fill: '#C4857E', line: '#8A524D', sw: 1.2 });
  S.sh(D('villi'), sm([[1008, 410], [1020, 300], [1030, 170], [1060, 118], [1100, 170], [1112, 300], [1122, 410]], true, 6), { fill: '#F0DCD2', line: '#F0DCD2', sw: 0.5 });
  S.sh(D('villi'), sm([[1222, 410], [1232, 300], [1244, 170], [1276, 118], [1316, 170], [1328, 300], [1340, 410]], true, 6), { fill: '#F0DCD2', line: '#F0DCD2', sw: 0.5 });
  S.sh(D('intestinal-crypt'), poly([[1132, 380], [1214, 380], [1214, 592], [1132, 592]]), { fill: LUM, line: LUM, sw: 0.5 });
  S.out.push(`<path d="${pd}" fill="none" stroke="#9A6A66" stroke-width="22" stroke-linejoin="round" stroke-linecap="round"/>`);
  S.ln(D('enterocyte'), pd, { color: '#E9C9C2', w: 19 });
  // brush border on the lumen side
  const pts = resample(P, 6), inside = (q) => { let c = false; const L = cr(P, false, 8).concat([[1395, 650], [955, 650]]); for (let i = 0, j = L.length - 1; i < L.length; j = i++) if ((L[i][1] > q[1]) !== (L[j][1] > q[1]) && q[0] < ((L[j][0] - L[i][0]) * (q[1] - L[i][1])) / (L[j][1] - L[i][1]) + L[i][0]) c = !c; return c; };
  const off = [], ticks = [];
  pts.forEach((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l; if (inside([p[0] + nx * 16, p[1] + ny * 16])) { nx = -nx; ny = -ny; }
    off.push([p[0] + nx * 14, p[1] + ny * 14]); if (i % 2 === 0) ticks.push(`M${p[0] + nx * 10} ${p[1] + ny * 10}L${p[0] + nx * 20} ${p[1] + ny * 20}`); });
  S.out.push(`<path d="${ticks.join('')}" stroke="#8A5C58" stroke-width="1.6" fill="none"/>`);
  S.ln(D('microvilli'), 'M' + off.map((q) => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L'), { color: '#B98F86', w: 5 });
  [[1062, 120], [1050, 214], [1100, 220], [1276, 120], [1262, 230], [1318, 230]].forEach(([x, y]) => S.sh(D('goblet-cell'), E(x, y, 9, 11), { fill: '#F4EFE2', line: '#9A9280', sw: 1.2 }));
  [[1147, 560], [1203, 560]].forEach(([x, y]) => S.sh(D('paneth-cell'), circ(x, y, 9), { fill: '#C97F86', line: '#7E4A49', sw: 1.2 }));
  [[1140, 750, 30, 22], [1200, 730, 30, 22], [1250, 770, 30, 22], [1170, 800, 30, 22], [1230, 820, 30, 22]].forEach(([x, y, rx, ry]) => S.sh(D('brunner-gland'), E(x, y, rx, ry), { fill: '#D8BC92', line: '#8A6E3C', sw: 1.4 }));
  net(S, [{ pts: [[1190, 780], [1182, 700], [1176, 640], [1175, 604], [1175, 590]], w: 14, fill: '#D8BC92', line: '#8A6E3C', lum: LUM, lw: 8 }]);
  patch(S, rect(1168, 578, 14, 18), LUM);
  [['villi', [1066, 270]], ['intestinal-crypt', [1172, 480]], ['enterocyte', null], ['microvilli', null], ['goblet-cell', [1100, 220]], ['paneth-cell', [1147, 560]], ['brunner-gland', [1140, 750]]].forEach(([id, h]) => S.pin(D(id), D(id), h ?? undefined));
  S.pins.find((p) => p.structureId === D('enterocyte')).hint = [1030, 260]; S.pins.find((p) => p.structureId === D('microvilli')).hint = [1000, 260];
}
plates.push({
  key: 'small-intestine', moduleId: MOD, kind: 'tissue-schematic', lessons: ['digestive-small', 'digestive-histology'], purpose: 'The three small-intestinal regions in order, and a schematic villus, crypt and duodenal submucosal gland.',
  title: ['Small intestine: regions and mucosa', 'Intestino delgado: regiones y mucosa'],
  desc: ['Left: the small intestine in order from the pylorus, patient right at viewer left: the duodenum (C-shaped, shortest), the jejunum (upper left abdomen) and the ileum (lower, ending at the cecum). Coils are simplified; the mesentery that suspends jejunum and ileum is omitted here. Right: schematic section of small-intestinal mucosa. Two villi project into the lumen; between them a crypt (intestinal gland) dips into the mucosa. Enterocytes cover the surface and carry a brush border of microvilli; goblet cells are pale mucus-secreting cells; Paneth cells sit at the crypt base. Below the muscularis mucosae, in the submucosa, lie Brunner glands, a duodenal feature whose duct opens into the crypts. Schematic, not a photomicrograph; the ileocecal valve is shown on the alimentary canal plate.',
    'Izquierda: el intestino delgado en orden desde el píloro, derecha del paciente a la izquierda: duodeno (en C, el más corto), yeyuno (abdomen superior izquierdo) e íleon (inferior, que termina en el ciego). Las asas están simplificadas; se omite el mesenterio que suspende yeyuno e íleon. Derecha: sección esquemática de la mucosa del intestino delgado. Dos vellosidades se proyectan a la luz; entre ellas una cripta (glándula intestinal) se hunde en la mucosa. Los enterocitos cubren la superficie y llevan un borde en cepillo de microvellosidades; las células caliciformes son pálidas y secretan moco; las células de Paneth están en la base de la cripta. Bajo la muscular de la mucosa, en la submucosa, están las glándulas de Brunner, propias del duodeno, cuyo conducto desemboca en las criptas. Esquema, no fotomicrografía; la válvula ileocecal se muestra en la lámina del tubo digestivo.'],
  orientation: ['left: anterior view, patient right at viewer left; right: mucosal section, lumen above', 'izquierda: vista anterior, derecha del paciente a la izquierda; derecha: sección de mucosa, luz arriba'], draw: small,
});

// ---------------------------------------------------------------- large intestine and anal canal
function large(S) {
  S.panel(30, 30, 880, 940, 'colon'); S.panel(930, 30, 490, 940, 'anal'); S.at('colon');
  const col = { fill: '#E6BDAE', line: T.gut.line }, r = 36;
  net(S, [{ pts: [[246, 850], [292, 906], [282, 950]], w: 24, ...col, lum: LUM, lw: 8 }]);
  scallop(S, [
    { id: D('cecum'), pts: [[215, 800], [215, 840]], r: 46, step: 40, ...col },
    { id: D('ascending-colon'), pts: [[215, 790], [212, 600], [210, 420], [214, 270]], r, step: 46, ...col },
    { idAt: (k) => (k % 3 === 1 ? D('haustra') : D('transverse-colon')), pts: [[214, 270], [260, 222], [340, 238], [440, 258], [540, 244], [630, 220], [694, 236]], r, step: 46, ...col },
    { id: D('descending-colon'), pts: [[694, 236], [696, 330], [696, 520], [690, 700]], r, step: 46, ...col },
    { id: D('sigmoid-colon'), pts: [[690, 700], [672, 786], [600, 826], [536, 796], [520, 744], [492, 774], [488, 832]], r: 32, step: 42, ...col },
    { id: D('rectum'), pts: [[488, 832], [480, 872], [480, 902]], r: 30, step: 30, ...col },
  ]);
  patch(S, circ(250, 852, 9), col.fill);
  S.sh(D('appendix'), sm([[282, 940], [288, 922], [296, 910], [290, 946]], true, 3), { fill: '#E6BDAE', line: T.gut.line, sw: 1.2 });
  S.ln(D('taeniae-coli'), 'M232 760L232 300', { color: '#F0DCCE', w: 11 }); S.ln(D('taeniae-coli'), 'M684 270L684 690', { color: '#F0DCCE', w: 11 });
  [['cecum', [215, 850]], ['appendix', [291, 927]], ['ascending-colon', [212, 520]], ['transverse-colon', [440, 258]], ['descending-colon', [696, 440]], ['sigmoid-colon', [600, 826]], ['rectum', [480, 888]], ['haustra', null], ['taeniae-coli', [232, 420]]].forEach(([id, h]) => S.pin(D(id), D(id), h ?? undefined));
  S.pins.find((p) => p.structureId === D('haustra')).hint = [340, 226]; 
  S.pins.find((p) => p.structureId === D('taeniae-coli')).hint = [232, 420];
  // anorectal section
  S.at('anal');
  const cx = 1175;
  const rw = sm([[1060, 90], [1290, 90], [1300, 430], [1270, 572], [1080, 572], [1050, 430]], true, 5), cw = poly([[1080, 566], [1270, 566], [1292, 840], [1058, 840]]);
  S.sh(null, rw, { fill: '#E2B3A4', line: T.gut.line, sw: 1.8 }); S.sh(null, cw, { fill: '#D8A99A', line: T.gut.line, sw: 1.8 });
  S.sh(D('rectum'), sm([[1100, 112], [1250, 112], [1262, 430], [1220, 540], [1210, 570], [1140, 570], [1128, 540], [1088, 430]], true, 5), { fill: LUM, line: '#B49C92', sw: 1.4 });
  S.sh(D('internal-anal-sphincter'), poly([[1100, 580], [1148, 580], [1148, 770], [1108, 770]]), { fill: '#DBA79F', line: '#8A524D', sw: 1.4 });
  S.sh(D('internal-anal-sphincter'), poly([[1202, 580], [1250, 580], [1242, 770], [1202, 770]]), { fill: '#DBA79F', line: '#8A524D', sw: 1.4 });
  S.sh(D('external-anal-sphincter'), sm([[1066, 600], [1100, 610], [1102, 776], [1146, 780], [1148, 826], [1066, 834]], true, 3), { fill: '#B77872', line: '#7E4A49', sw: 1.4 });
  S.sh(D('external-anal-sphincter'), sm([[1284, 600], [1250, 610], [1248, 776], [1204, 780], [1202, 826], [1284, 834]], true, 3), { fill: '#B77872', line: '#7E4A49', sw: 1.4 });
  S.sh(D('anal-canal'), poly([[1148, 566], [1202, 566], [1202, 830], [1148, 830]]), { fill: LUM, line: '#B49C92', sw: 1.2 });
  patch(S, poly([[1138, 560], [1212, 560], [1212, 574], [1138, 574]]), LUM);
  S.sh(D('anus'), E(cx, 842, 30, 9), { fill: '#C27E7A', line: '#7E4A49', sw: 1.4 });
  [['rectum', [1100, 300]], ['anal-canal', [1175, 700]], ['internal-anal-sphincter', [1124, 680]], ['external-anal-sphincter', [1084, 700]], ['anus', [1175, 842]]].forEach(([id, h]) => S.pin(D(id), D(id), h));
}
plates.push({
  key: 'large-intestine', moduleId: MOD, kind: 'gross-diagram', lessons: ['digestive-large', 'digestive-continuity'], purpose: 'Large intestine regions with haustra and taeniae coli, and the anal canal with its two sphincters.',
  title: ['Large intestine and anal canal', 'Intestino grueso y conducto anal'],
  desc: ['Left: the colon framing the abdomen, patient right at viewer left. The terminal ileum enters the cecum; the appendix hangs from the cecum. The colon continues as ascending, transverse, descending and sigmoid colon, then the rectum. Haustra are the sacculations of the wall; taeniae coli are three longitudinal ribbons of muscle (two are drawn) whose tone gathers the wall into haustra. Right: coronal section of the rectum and anal canal. The internal anal sphincter is a thickening of the smooth-muscle circular layer (involuntary); the external anal sphincter is skeletal muscle outside it (voluntary). The canal ends at the anus. Simplified; the anorectal mucosal folds and venous cushions are omitted.',
    'Izquierda: el colon enmarca el abdomen, derecha del paciente a la izquierda. El íleon terminal entra en el ciego; el apéndice cuelga del ciego. El colon continúa como colon ascendente, transverso, descendente y sigmoide, y luego el recto. Las haustras son las saculaciones de la pared; las tenias del colon son tres cintas longitudinales de músculo (se dibujan dos) cuyo tono recoge la pared en haustras. Derecha: corte coronal del recto y del conducto anal. El esfínter anal interno es un engrosamiento de la capa circular de músculo liso (involuntario); el esfínter anal externo es músculo esquelético por fuera (voluntario). El conducto termina en el ano. Simplificado; se omiten los pliegues mucosos anorrectales y los cojinetes venosos.'],
  orientation: ['left: anterior view, patient right at viewer left; right: coronal section, anus below', 'izquierda: vista anterior, derecha del paciente a la izquierda; derecha: corte coronal, ano abajo'], draw: large,
});

// ---------------------------------------------------------------- peritoneal relationships
function peri(S) {
  S.panel(30, 30, 880, 940, 'sagittal'); S.panel(930, 30, 490, 940, 'anterior'); S.at('sagittal');
  // body wall and spine (front at viewer left)
  S.sh(null, sm([[236, 110], [170, 300], [150, 520], [180, 740], [240, 900], [330, 940], [330, 880], [270, 780], [236, 560], [250, 330], [290, 150]], true, 6), { ...T.muscle, sw: 1.6 });
  for (let y = 120; y < 880; y += 74) S.sh(null, RR(780, y, 80, 60, 14), { ...T.bone, sw: 1.4 });
  S.sh(null, sm([[330, 90], [520, 72], [720, 110], [770, 150], [740, 170], [520, 120], [330, 140]], true, 5), { ...T.muscle, sw: 1.5 });
  // retroperitoneal pancreas behind the stomach
  S.sh(null, E(690, 420, 40, 20, -20), { ...T.panc, sw: 1.4 });
  // liver, stomach, lesser omentum
  S.sh(null, sm([[290, 150], [380, 130], [480, 150], [500, 220], [440, 290], [320, 280], [262, 220]], true, 5), { ...T.liver, sw: 1.6 });
  S.sh(null, sm([[470, 280], [560, 250], [650, 310], [660, 420], [590, 470], [510, 440], [468, 370]], true, 5), { ...T.stomach, sw: 1.6 });
  S.sh(D('lesser-omentum'), sm([[440, 282], [492, 246], [506, 310], [476, 346]], true, 4), { fill: '#F0E4B4', line: '#9A8A4A', sw: 1.4 });
  // transverse colon (section) and greater omentum hanging from the stomach
  S.sh(D('greater-omentum'), sm([[552, 462], [470, 480], [372, 570], [318, 700], [306, 790], [338, 794], [380, 690], [440, 586], [500, 528], [590, 480]], true, 5), { fill: '#F0E4B4', line: '#9A8A4A', sw: 1.4 });
  S.sh(null, E(520, 520, 36, 30), { ...T.gut, sw: 1.5 });
  // mesentery: fan of peritoneum from the posterior wall to the small bowel
  S.sh(D('mesentery'), sm([[776, 440], [660, 530], [570, 640], [520, 740], [548, 770], [640, 720], [720, 640], [776, 560]], true, 5), { fill: '#F0E4B4', line: '#9A8A4A', sw: 1.4 });
  [[640, 600], [690, 560], [610, 660]].forEach(([x, y], i) => S.ln(null, `M776 ${480 + i * 20}L${x} ${y}`, { color: '#B67A74', w: 2 }));
  [[500, 730], [548, 770], [470, 782], [520, 810], [440, 740], [570, 812]].forEach(([x, y]) => S.sh(null, circ(x, y, 26), { ...T.gut, sw: 1.5 }));
  S.sh(null, E(400, 870, 62, 34), { ...T.bladder, sw: 1.5 }); S.sh(null, E(640, 860, 44, 40), { ...T.gut, sw: 1.5 });
  S.pin(D('lesser-omentum'), D('lesser-omentum'), [474, 290]); S.pin(D('greater-omentum'), D('greater-omentum'), [336, 720]); S.pin(D('mesentery'), D('mesentery'), [680, 580]);
  // anterior view
  S.at('anterior');
  S.sh(null, sm([[960, 220], [990, 160], [1090, 140], [1200, 160], [1290, 190], [1330, 240], [1240, 280], [1100, 300], [990, 300]], true, 5), { ...T.liver, sw: 1.6 });
  S.sh(null, sm([[1170, 300], [1260, 290], [1340, 350], [1370, 470], [1320, 560], [1230, 560], [1180, 480]], true, 6), { ...T.stomach, sw: 1.6 });
  S.sh(D('lesser-omentum'), sm([[1100, 302], [1170, 296], [1186, 360], [1182, 440], [1150, 410], [1110, 340]], true, 4), { fill: '#F0E4B4', line: '#9A8A4A', sw: 1.4 });
  net(S, [{ pts: [[975, 660], [1000, 580], [1100, 560], [1190, 592], [1290, 560], [1385, 590], [1400, 660]], w: 30, ...G, lum: LUM, lw: 13 }]);
  [[1080, 640], [1160, 680], [1240, 640], [1320, 690], [1020, 700], [1200, 740]].forEach(([x, y]) => S.sh(null, circ(x, y, 24), { ...T.gut, sw: 1.4 }));
  S.sh(D('greater-omentum'), sm([[1020, 560], [1180, 590], [1380, 560], [1396, 700], [1380, 840], [1300, 905], [1190, 920], [1090, 905], [1010, 840], [980, 700]], true, 6), { fill: '#F0E4B4', line: '#9A8A4A', sw: 1.6 });
  [[1090, 640, 1100, 840], [1190, 600, 1190, 900], [1290, 640, 1280, 850]].forEach(([x, y, x2, y2]) => S.ln(null, `M${x} ${y}Q${(x + x2) / 2 + 10} ${(y + y2) / 2} ${x2} ${y2}`, { color: '#C7A04E', w: 2.6 }));
  S.pin(D('lesser-omentum'), D('lesser-omentum'), [1160, 352]); S.pin(D('greater-omentum'), D('greater-omentum'), [1190, 780]);
}
plates.push({
  key: 'peritoneal-folds', moduleId: MOD, kind: 'gross-diagram', lessons: ['digestive-peritoneum'], purpose: 'Introductory view of the mesentery and the greater and lesser omenta as peritoneal folds.',
  title: ['Peritoneal folds: mesentery and omenta', 'Pliegues peritoneales: mesenterio y epiplones'],
  desc: ['Left: midline sagittal schematic, front at viewer left. The mesentery is a double fold of peritoneum, not an organ: it runs from the posterior abdominal wall to the small intestine and carries its vessels and nerves. The lesser omentum spans from the liver to the lesser curvature of the stomach; the greater omentum hangs from the greater curvature like an apron in front of the intestines. The pancreas lies behind the peritoneum. Right: anterior view: the greater omentum drapes over the small intestine, and the lesser omentum links liver and stomach. This is a simplified schematic of the folds, not a section through a specimen.',
    'Izquierda: esquema sagital medio, frente a la izquierda. El mesenterio es un pliegue doble de peritoneo, no un órgano: va de la pared abdominal posterior al intestino delgado y lleva sus vasos y nervios. El epiplón menor se extiende del hígado a la curvatura menor del estómago; el epiplón mayor cuelga de la curvatura mayor como un delantal delante de los intestinos. El páncreas queda detrás del peritoneo. Derecha: vista anterior: el epiplón mayor cubre el intestino delgado y el menor une hígado y estómago. Es un esquema simplificado de los pliegues, no un corte de un espécimen.'],
  orientation: ['left: sagittal, front at viewer left; right: anterior view, patient right at viewer left', 'izquierda: sagital, frente a la izquierda; derecha: vista anterior, derecha del paciente a la izquierda'], draw: peri,
});
