// BVIS05 blood plates: composition, smear field, leukocyte comparison, marrow and haematopoiesis (all schematic, not specimens).
import { C, sm, poly, E, RR, tube, rng } from './bvis05-lib.mjs';

const MOD = 'cardiovascular-system';
export const plates = [];
const PURP = '#8E83A6', PURPL = '#5E5578';

// cell helpers ---------------------------------------------------------------
const rbcCell = (S, id, pal, x, y, r, rot = 0) => {
  S.sh(id, E(x, y, r, r * 0.94, rot), { fill: '#CC8F88', line: '#8A524D', sw: 1.3 });
  S.sh(pal ?? id, E(x, y, r * 0.42, r * 0.38, rot), { fill: '#E3B5AE', line: '#CC8F88', sw: 0.8 });
};
const plt = (S, id, x, y, r = 11) => { S.sh(id, sm([[x - r, y], [x - r * 0.4, y - r * 0.8], [x + r * 0.7, y - r * 0.7], [x + r, y + r * 0.1], [x + r * 0.2, y + r * 0.8], [x - r * 0.7, y + r * 0.6]], true, 4), { fill: '#BDAAD0', line: '#6F6381', sw: 1.1 });
  const g = rng(Math.round(x + y)); for (let i = 0; i < 4; i++) S.sh(null, E(x + (g() - 0.5) * r, y + (g() - 0.5) * r * 0.8, 1.5, 1.5), { fill: '#7A6A92', line: '#7A6A92', sw: 0.3 }); };
const lobes = (S, id, pts, rr, o = {}) => {
  pts.forEach(([x, y], i) => { S.sh(id, E(x, y, rr, rr * 0.86, i * 25), { fill: o.fill ?? PURP, line: o.line ?? PURPL, sw: 1.4 });
    if (i && !o.noLink) S.ln(null, `M${pts[i - 1][0]} ${pts[i - 1][1]}L${x} ${y}`, { color: o.line ?? PURPL, w: 2 }); });
};
function wbc(S, kind, x, y, r, ids = {}) {
  const k = (n) => ids[n] ?? kind;
  const g = rng(x * 3 + y);
  if (kind === 'neu') {
    S.sh(k('cell'), E(x, y, r, r), { fill: '#E7DFDC', line: '#A59490', sw: 1.6 });
    for (let i = 0; i < 18; i++) { const a = g() * 6.28, d = g() * r * 0.88; S.sh(null, E(x + Math.cos(a) * d, y + Math.sin(a) * d, 1.6, 1.6), { fill: '#D2B5B0', line: '#D2B5B0', sw: 0.3 }); }
    lobes(S, k('nuc'), [[x - r * 0.5, y - r * 0.2], [x - r * 0.1, y - r * 0.5], [x + r * 0.35, y - r * 0.2], [x + r * 0.35, y + r * 0.3], [x - r * 0.1, y + r * 0.5]], r * 0.22);
  } else if (kind === 'lym') {
    S.sh(k('cell'), E(x, y, r, r), { fill: '#BBD0DC', line: '#6F8D9A', sw: 1.6 });
    S.sh(k('nuc'), E(x - r * 0.05, y, r * 0.8, r * 0.76), { fill: '#7F7699', line: PURPL, sw: 1.4 });
    S.sh(null, E(x - r * 0.2, y - r * 0.1, r * 0.16, r * 0.14), { fill: '#968DAE', line: '#968DAE', sw: 0.3 });
  } else if (kind === 'mon') {
    S.sh(k('cell'), E(x, y, r, r), { fill: '#CBD0DA', line: '#7F8798', sw: 1.6 });
    S.sh(k('nuc'), sm([[x - r * 0.55, y - r * 0.1], [x - r * 0.3, y - r * 0.55], [x + r * 0.25, y - r * 0.6], [x + r * 0.6, y - r * 0.2], [x + r * 0.35, y + r * 0.05], [x + r * 0.05, y - r * 0.15], [x - r * 0.1, y + r * 0.3], [x - r * 0.4, y + r * 0.5]], true, 5), { fill: '#9A8FB0', line: PURPL, sw: 1.4 });
  } else if (kind === 'eos') {
    S.sh(k('cell'), E(x, y, r, r), { fill: '#E4C2A8', line: '#A8745A', sw: 1.6 });
    for (let i = 0; i < 46; i++) { const a = g() * 6.28, d = Math.sqrt(g()) * r * 0.9; S.sh(null, E(x + Math.cos(a) * d, y + Math.sin(a) * d, 3, 3), { fill: '#D08A66', line: '#A8605A', sw: 0.6 }); }
    lobes(S, k('nuc'), [[x - r * 0.35, y - r * 0.05], [x + r * 0.35, y + r * 0.05]], r * 0.3);
  } else if (kind === 'bas') {
    S.sh(k('cell'), E(x, y, r, r), { fill: '#CFC9DA', line: '#7A7292', sw: 1.6 });
    lobes(S, k('nuc'), [[x - r * 0.35, y - r * 0.1], [x + r * 0.15, y + r * 0.1], [x + r * 0.5, y - r * 0.15]], r * 0.28, { fill: '#8E86AE' });
    for (let i = 0; i < 30; i++) { const a = g() * 6.28, d = Math.sqrt(g()) * r * 0.9; S.sh(null, E(x + Math.cos(a) * d, y + Math.sin(a) * d, 4.4, 4.4), { fill: '#5E5688', line: '#3F3A66', sw: 0.6 }); }
  }
}

// ------------------------------------------------------------------ 1 composition
function composition(S) {
  S.panel(30, 30, 760, 940, 'tubes'); S.panel(810, 30, 610, 940, 'cells'); S.at('tubes');
  const tube1 = (x, w) => `M${x} 110H${x + w}V${850}A${w / 2} ${w / 2} 0 0 1 ${x} 850Z`;
  for (const [x, nm] of [[190, 'a'], [490, 'b']]) {
    S.sh(null, RR(x - 12, 76, 144, 40, 8), { fill: '#CFC9BD', line: '#8E897C', sw: 1.6 });
    S.clipBoth(tube1(x, 120));
    if (nm === 'a') {
      S.sh('plasma', RR(x - 4, 110, 130, 440, 0), { fill: '#EBDFA6', line: '#EBDFA6', sw: 0.5 });
      S.sh('buffy', RR(x - 4, 550, 130, 20, 0), { fill: '#F2EEE2', line: '#C9C3B0', sw: 1 });
      S.sh('rbcl', RR(x - 4, 570, 130, 400, 0), { fill: '#B87472', line: '#B87472', sw: 0.5 });
    } else {
      S.sh('serum', RR(x - 4, 110, 130, 440, 0), { fill: '#EFE4B8', line: '#EFE4B8', sw: 0.5 });
      S.sh('clot', RR(x - 4, 550, 130, 420, 0), { fill: '#8F4F4E', line: '#8F4F4E', sw: 0.5 });
      for (let i = 0; i < 9; i++) S.ln(null, `M${x} ${560 + i * 36}Q${x + 40} ${580 + i * 36} ${x + 120} ${555 + i * 36}`, { color: '#B58381', w: 1.4, op: 0.7 });
    }
    S.clipBothEnd();
    S.out.push(`<path d="${tube1(x, 120)}" fill="none" stroke="#7A858C" stroke-width="2.4"/>`);
  }
  S.ln(null, 'M332 330H440', { color: C.soft, w: 1.4, dash: '4 4' });
  S.arrow(440, 330, 0, 12, C.soft);
  // right panel: three elements, drawn at comparable scale
  S.at('cells');
  rbcCell(S, 'rbc', 'pal', 960, 280, 110);
  wbc(S, 'neu', 1230, 280, 100, { cell: 'leuk', nuc: 'leuk' });
  plt(S, 'plt', 960, 640, 56); plt(S, 'plt', 1060, 700, 40); plt(S, 'plt', 1130, 610, 48); plt(S, 'plt', 1020, 560, 32);
  S.pin('cv-blood-plasma', 'plasma', [250, 330]);
  S.pin('cv-blood-serum', 'serum', [550, 330]);
  S.pin('cv-blood-buffy-coat', 'buffy', [250, 560]);
  S.pin('cv-blood-formed-elements', 'rbcl+buffy', [250, 700]);
  S.pin('cv-blood-erythrocyte', 'rbc', [900, 330]);
  S.pin('cv-blood-leukocyte', 'leuk', [1210, 330]);
  S.pin('cv-blood-platelet', 'plt', [960, 640]);
}
plates.push({
  key: 'blood-composition', moduleId: MOD, kind: 'tissue-schematic', lessons: ['cv-blood-tissue'], purpose: 'Blood as plasma plus formed elements: layers of a spun anticoagulated tube, serum from clotted blood, and the three formed elements.',
  title: ['Composition of blood: plasma, serum and formed elements', 'Composición de la sangre: plasma, suero y elementos formados'],
  desc: ['Schematic, not a photograph. Left tube: anticoagulated blood spun in a centrifuge separates into straw-coloured plasma on top (about half or more of the volume), a thin pale buffy coat (white blood cells and platelets) and packed red cells at the bottom; the buffy coat and red cells together are the formed elements. Right tube: blood allowed to clot; the clot traps cells in a fibrin meshwork and the straw liquid left above it is serum, which is plasma without the clotting factors. Right panel, shapes at about comparable relative size: a red blood cell (erythrocyte) with a pale centre, a white blood cell (leukocyte, a neutrophil shown) with a lobed nucleus, and platelets, which are cell fragments, not whole cells. Layer proportions are illustrative.',
    'Esquema, no una fotografía. Tubo izquierdo: la sangre con anticoagulante centrifugada se separa en plasma amarillo pajizo arriba (la mitad o más del volumen), una fina capa pálida leucoplaquetaria (leucocitos y plaquetas) y los eritrocitos empaquetados abajo; la capa leucoplaquetaria y los eritrocitos juntos son los elementos formados. Tubo derecho: sangre dejada coagular; el coágulo atrapa células en una malla de fibrina y el líquido pajizo que queda arriba es suero, plasma sin los factores de coagulación. Panel derecho, formas a tamaño relativo aproximado: un glóbulo rojo (eritrocito) con centro pálido, un glóbulo blanco (leucocito, se muestra un neutrófilo) con núcleo lobulado y plaquetas, fragmentos celulares y no células completas. Las proporciones de las capas son ilustrativas.'],
  orientation: ['left: two upright tubes, top = lightest layer; right: three cell types', 'izquierda: dos tubos verticales, arriba la capa más ligera; derecha: tres tipos de célula'], draw: composition,
});

// ------------------------------------------------------------------ 2 schematic smear field
function smear(S) {
  S.panel(30, 30, 1390, 940, 'field');
  S.sh('field', RR(70, 70, 1310, 860, 20), { fill: '#EFE3E0', line: '#CFC1BE', sw: 1.4 });
  const g = rng(11), spots = [];
  const ok = (x, y, r) => spots.every(([a, b, c]) => Math.hypot(a - x, b - y) > r + c + 6);
  const wb = [['neu', 330, 330, 74], ['lym', 640, 640, 52], ['mon', 980, 330, 92], ['eos', 1180, 660, 76], ['bas', 420, 700, 62]];
  wb.forEach(([, x, y, r]) => spots.push([x, y, r]));
  const pl = [[560, 260], [820, 560], [1250, 400], [200, 560], [760, 800]];
  pl.forEach(([x, y]) => spots.push([x, y, 14]));
  const rb = [];
  for (let i = 0; i < 900 && rb.length < 52; i++) { const x = 110 + g() * 1230, y = 110 + g() * 780, r = 38 + g() * 6; if (ok(x, y, r)) { spots.push([x, y, r]); rb.push([x, y, r, g() * 180]); } }
  rb.forEach(([x, y, r, rot], i) => rbcCell(S, 'rbc' + (i % 2 ? '' : ''), 'pal', x, y, r, rot));
  wb.forEach(([k, x, y, r]) => wbc(S, k, x, y, r));
  pl.forEach(([x, y]) => plt(S, 'plt', x, y, 14));
  S.pin('cv-blood-peripheral-blood-smear', 'field', [90, 90], { radius: 0.02 });
  S.pin('cv-blood-erythrocyte', 'rbc', [rb[3][0] + 22, rb[3][1] + 24]);
  S.pin('cv-blood-central-pallor', 'pal', [rb[8][0], rb[8][1]]);
  S.pin('cv-blood-platelet', 'plt', [pl[0][0], pl[0][1]]);
  S.pin('cv-blood-neutrophil', 'neu', [330, 330 - 56]);
  S.pin('cv-blood-lymphocyte', 'lym', [640, 640]);
  S.pin('cv-blood-monocyte', 'mon', [980, 330 - 60]);
  S.pin('cv-blood-eosinophil', 'eos', [1180, 660]);
  S.pin('cv-blood-basophil', 'bas', [420, 700]);
}
plates.push({
  key: 'blood-smear-schematic', moduleId: MOD, kind: 'tissue-schematic', lessons: ['cv-blood-smear', 'cv-blood-red-cells-platelets'], purpose: 'Schematic stained-smear field: red cells with central pallor, platelets and one of each white cell type.',
  title: ['Peripheral blood smear (schematic field)', 'Frotis de sangre periférica (campo esquemático)'],
  desc: ['An original schematic of what a stained peripheral blood smear shows, not a photomicrograph and not a real specimen. Biconcave red cells dominate and look like discs with a pale centre (central pallor) because they are thinner in the middle and have no nucleus. Platelets are small purple fragments. One white cell of each kind is shown at a larger relative size so features are visible: neutrophil (multilobed nucleus, pale cytoplasm), lymphocyte (round nucleus filling the cell), monocyte (largest, kidney-shaped nucleus), eosinophil (bilobed nucleus, bright coarse granules) and basophil (dark granules covering the nucleus). In a real smear red cells are far more numerous than shown relative to white cells.',
    'Esquema original de lo que muestra un frotis de sangre periférica teñido, no una fotomicrografía ni un espécimen real. Predominan los glóbulos rojos bicóncavos, que parecen discos con el centro pálido (palidez central) porque son más finos en el centro y no tienen núcleo. Las plaquetas son pequeños fragmentos púrpura. Se muestra un leucocito de cada tipo, a mayor tamaño relativo para ver sus rasgos: neutrófilo (núcleo multilobulado, citoplasma pálido), linfocito (núcleo redondo que llena la célula), monocito (el mayor, núcleo en forma de riñón), eosinófilo (núcleo bilobulado, gránulos gruesos brillantes) y basófilo (gránulos oscuros que cubren el núcleo). En un frotis real los eritrocitos son mucho más numerosos respecto a los leucocitos que aquí.'],
  orientation: ['schematic microscope field; no orientation', 'campo microscópico esquemático; sin orientación'], draw: smear,
});

// ------------------------------------------------------------------ 3 leukocyte comparison
function leuk(S) {
  S.panel(30, 30, 1390, 940, 'gran');
  S.sh(null, RR(60, 60, 830, 880, 14), { fill: '#F5F1EA', line: '#DAD3C4', sw: 1.2 });
  S.sh(null, RR(900, 60, 490, 880, 14), { fill: '#F5F1EA', line: '#DAD3C4', sw: 1.2 });
  S.ln(null, 'M120 150H830', { color: C.soft, w: 2 }); S.ln(null, 'M960 150H1330', { color: C.soft, w: 2 });
  wbc(S, 'neu', 220, 420, 130, { cell: 'neu', nuc: 'neuN' });
  wbc(S, 'eos', 520, 420, 130, { cell: 'eos', nuc: 'eosN' });
  wbc(S, 'bas', 760, 650, 100, { cell: 'bas', nuc: 'basN' });
  wbc(S, 'lym', 1010, 420, 100, { cell: 'lym', nuc: 'lymN' });
  wbc(S, 'mon', 1230, 640, 140, { cell: 'mon', nuc: 'monN' });
  rbcCell(S, null, null, 240, 760, 80); rbcCell(S, null, null, 400, 800, 80); rbcCell(S, null, null, 1050, 760, 80);
  S.pin('cv-blood-leukocyte', 'mon', [1230, 760]);
  S.pin('cv-blood-granulocyte', 'eos', [520, 540]);
  S.pin('cv-blood-agranulocyte', 'lym', [1010, 505]);
  S.pin('cv-blood-neutrophil', 'neu', [220, 530]);
  S.pin('cv-blood-eosinophil', 'eosN', [490, 420]);
  S.pin('cv-blood-basophil', 'bas', [760, 735]);
  S.pin('cv-blood-lymphocyte', 'lymN', [1010, 420]);
  S.pin('cv-blood-monocyte', 'monN', [1230, 600]);
}
plates.push({
  key: 'leukocyte-types', moduleId: MOD, kind: 'tissue-schematic', lessons: ['cv-blood-white-cells', 'cv-blood-tissue'], purpose: 'Five white cell types side by side: granulocytes (neutrophil, eosinophil, basophil) versus agranulocytes (lymphocyte, monocyte).',
  title: ['The five leukocytes, compared', 'Los cinco leucocitos, comparados'],
  desc: ['Schematic comparison, not specimen images. Left group, granulocytes (visible cytoplasmic granules, lobed nucleus): neutrophil with a nucleus of several lobes and faint pale granules; eosinophil with a bilobed nucleus and bright coarse granules; basophil with large dark granules that cover the nucleus. Right group, agranulocytes (no prominent granules): lymphocyte, small, with a round nucleus filling most of the cell; monocyte, the largest, with a kidney or horseshoe-shaped nucleus. Red cells are drawn at the same scale for size comparison. Relative sizes are approximate and the group markers sit on a member cell of each group.',
    'Comparación esquemática, no imágenes de especímenes. Grupo izquierdo, granulocitos (gránulos citoplásmicos visibles, núcleo lobulado): neutrófilo con núcleo de varios lóbulos y gránulos pálidos tenues; eosinófilo con núcleo bilobulado y gránulos gruesos brillantes; basófilo con grandes gránulos oscuros que cubren el núcleo. Grupo derecho, agranulocitos (sin gránulos prominentes): linfocito, pequeño, con núcleo redondo que llena casi toda la célula; monocito, el mayor, con núcleo en forma de riñón o herradura. Los eritrocitos se dibujan a la misma escala para comparar tamaños. Los tamaños relativos son aproximados y los marcadores de grupo se colocan sobre una célula del grupo.'],
  orientation: ['schematic cell comparison; granulocytes at left, agranulocytes at right', 'comparación esquemática; granulocitos a la izquierda, agranulocitos a la derecha'], draw: leuk,
});

// ------------------------------------------------------------------ 4 marrow + haematopoiesis
function marrow(S) {
  S.panel(30, 30, 700, 940, 'marrow'); S.panel(750, 30, 670, 940, 'lineage');
  S.sh('bone', RR(60, 60, 640, 80, 10), { fill: '#E7DFCC', line: '#8B8168', sw: 1.6 });
  S.sh('bone', RR(60, 860, 640, 80, 10), { fill: '#E7DFCC', line: '#8B8168', sw: 1.6 });
  S.sh('rbm', RR(60, 140, 640, 720, 6), { fill: '#D7B4AE', line: '#A8817C', sw: 1.4 });
  const tr = [[[80, 180], [200, 320], [140, 450]], [[690, 200], [560, 330], [620, 470]], [[330, 855], [420, 780], [350, 700]], [[250, 150], [300, 230]]];
  tr.forEach((p) => S.tb('bone', p, 24, 16, { fill: '#E7DFCC', line: '#8B8168' }));
  S.sh('sinus', sm([[140, 640], [260, 600], [420, 610], [560, 650], [640, 690], [560, 740], [420, 720], [260, 730], [150, 700]], true, 5), { fill: '#C98583', line: '#7E4A49', sw: 1.8 });
  rbcCell(S, 'rbc', 'pal', 260, 660, 22); rbcCell(S, 'rbc', 'pal', 360, 680, 22); rbcCell(S, 'rbc', 'pal', 470, 666, 22, 30);
  plt(S, 'plt', 330, 640, 11); plt(S, 'plt', 420, 700, 10);
  wbc(S, 'neu', 540, 690, 26, { cell: 'leu', nuc: 'leu' });
  // megakaryocyte against the sinusoid
  S.sh('mk', sm([[430, 480], [470, 440], [540, 440], [590, 480], [585, 560], [530, 600], [460, 590], [425, 540]], true, 5), { fill: '#C4B4D2', line: '#6F6381', sw: 1.8 });
  [[500, 490], [540, 520], [500, 550], [470, 520]].forEach(([x, y]) => S.sh('mk', E(x, y, 20, 17), { fill: '#8E83A6', line: PURPL, sw: 1.2 }));
  S.sh('mk', sm([[505, 596], [515, 626], [490, 650]], false, 4), { fill: 'none', line: '#6F6381', sw: 2 });
  plt(S, 'plt', 510, 622, 8);
  // stem cell and precursors
  S.sh('hsc', E(220, 520, 24, 24), { fill: '#CDBFD8', line: '#6F6381', sw: 1.6 }); S.sh('hsc', E(220, 520, 15, 15), { fill: '#8E83A6', line: PURPL, sw: 1 });
  [[150, 400], [200, 380], [175, 420]].forEach(([x, y]) => S.sh('eb', E(x, y, 16, 16), { fill: '#C7A0A0', line: '#8A524D', sw: 1.2 }));
  [[300, 250], [340, 300], [290, 330], [250, 280]].forEach(([x, y]) => { S.sh('gp', E(x, y, 20, 20), { fill: '#D9D2E0', line: '#8F849E', sw: 1.2 }); S.sh('gp', E(x, y, 10, 11), { fill: '#8E83A6', line: PURPL, sw: 1 }); });
  S.at('marrow');
  S.pin('cv-blood-red-bone-marrow', 'rbm', [330, 160]);
  S.pin('cv-blood-hematopoietic-stem-cell', 'hsc', [220, 520]);
  S.pin('cv-blood-megakaryocyte', 'mk', [545, 480]);
  S.pin('cv-blood-platelet', 'plt', [510, 622]);
  S.pin('cv-blood-erythrocyte', 'rbc', [360, 680]);
  S.pin('cv-blood-leukocyte', 'leu', [540, 690]);
  // lineage tree (arrows are continuous branches)
  S.at('lineage');
  const br = (d, w = 4) => S.ln('tree', d, { color: '#8E83A6', w });
  S.sh('hsc2', E(1085, 130, 56, 56), { fill: '#CDBFD8', line: '#6F6381', sw: 2 }); S.sh('hsc2', E(1085, 130, 30, 30), { fill: '#8E83A6', line: PURPL, sw: 1 });
  br('M1085 190V250M1085 250H900V330M1085 250H1270V330');
  br('M900 330V420M900 420H820V500M900 420H1000V500');
  br('M1270 330V440M1270 440H1190V520M1270 440H1350V520');
  [[820, 520], [1000, 520]].forEach(([x, y]) => S.sh(null, E(x, y, 28, 28), { fill: '#E3D2CF', line: '#A8817C', sw: 1.4 }));
  br('M820 548V640M1000 548V640M1000 640H1080M1000 640H920');
  S.sh('rbc2', E(820, 690, 48, 44), { fill: '#CC8F88', line: '#8A524D', sw: 1.6 }); S.sh('rbc2', E(820, 690, 20, 18), { fill: '#E3B5AE', line: '#CC8F88', sw: 1 });
  S.sh('mk2', sm([[900, 640], [940, 610], [1000, 620], [1020, 660], [990, 700], [930, 700]], true, 5), { fill: '#C4B4D2', line: '#6F6381', sw: 1.6 });
  S.sh('plt2', E(1090, 640, 24, 18), { fill: '#BDAAD0', line: '#6F6381', sw: 1.4 });
  S.sh(null, E(1190, 540, 28, 28), { fill: '#E3D2CF', line: '#A8817C', sw: 1.4 }); S.sh(null, E(1350, 540, 28, 28), { fill: '#E3D2CF', line: '#A8817C', sw: 1.4 });
  br('M1190 568V820M1350 568V820');
  wbc(S, 'neu', 1190, 880, 40, { cell: 'leu2', nuc: 'leu2' }); wbc(S, 'lym', 1350, 880, 34, { cell: 'leu2', nuc: 'leu2' });
  S.pin('cv-blood-hematopoietic-stem-cell', 'hsc2', [1085, 130]);
  S.pin('cv-blood-hematopoiesis', 'tree', [1270, 330]);
  S.pin('cv-blood-erythrocyte', 'rbc2', [820, 690]);
  S.pin('cv-blood-megakaryocyte', 'mk2', [940, 665]);
  S.pin('cv-blood-platelet', 'plt2', [1090, 640]);
  S.pin('cv-blood-leukocyte', 'leu2', [1190, 880]);
}
plates.push({
  key: 'marrow-hematopoiesis', moduleId: MOD, kind: 'tissue-schematic', lessons: ['cv-blood-marrow', 'cv-blood-red-cells-platelets'], purpose: 'Where blood cells are made: red marrow between bone trabeculae, and the family tree from one stem cell.',
  title: ['Red bone marrow and hematopoiesis', 'Médula ósea roja y hematopoyesis'],
  desc: ['Schematic, not a section of real marrow. Left: red bone marrow fills the spaces of spongy bone between bone trabeculae. A hematopoietic stem cell sits among clusters of developing red cells (erythroblasts) and white cell precursors; a giant multilobed megakaryocyte lies against a blood sinusoid and sheds platelets into it. Mature red cells, platelets and a white cell pass through the sinusoid wall into the blood. Right: hematopoiesis as a branching family tree. One stem cell gives myeloid and lymphoid lines; the myeloid line produces red cells, platelets (from megakaryocytes) and granulocytes and monocytes, the lymphoid line produces lymphocytes. Simplified: intermediate progenitors are collapsed.',
    'Esquema, no un corte de médula real. Izquierda: la médula ósea roja llena los espacios del hueso esponjoso entre las trabéculas. Una célula madre hematopoyética se sitúa entre grupos de glóbulos rojos en desarrollo (eritroblastos) y precursores de leucocitos; un megacariocito gigante multilobulado se apoya en un sinusoide sanguíneo y libera plaquetas en él. Eritrocitos maduros, plaquetas y un leucocito atraviesan la pared del sinusoide hacia la sangre. Derecha: la hematopoyesis como árbol genealógico ramificado. Una célula madre da líneas mieloide y linfoide; la mieloide produce eritrocitos, plaquetas (a partir de megacariocitos), granulocitos y monocitos, y la linfoide produce linfocitos. Simplificado: se omiten los progenitores intermedios.'],
  orientation: ['left: marrow cavity between bone plates; right: lineage tree, stem cell at top', 'izquierda: cavidad medular entre láminas óseas; derecha: árbol de linajes, célula madre arriba'], draw: marrow,
});
void poly; void tube;
