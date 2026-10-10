// BVIS05 lymphatic plates: overview and drainage, lymph node, spleen, thymus, tonsils, intestinal lymphoid tissue.
import { sm, poly, E, RR, tube, vs, mirX, rng, LY, V, A, MY } from './bvis05-lib.mjs';
import { skin, heartGhost, VEIN, drawVessels } from './bvis05-body.mjs';

const MOD = 'lymphatic-system';
const L = (s) => 'lymph-' + s;
export const plates = [];
const CAP = { fill: '#B592A0', line: '#76566A' };
const LIL = { fill: '#CBBBD2', line: '#7A6A86' }, LILD = { fill: '#B8A6C4', line: '#6F5F7C' }, LILL = { fill: '#E4D9E6', line: '#8C7C98' };
const PLUM = { fill: '#BFA0B4', line: '#76566A' }, CRM = { fill: '#EDE3DA', line: '#B7A593' }, MUC = { fill: '#DDADA8', line: '#9A6A66' };
const ring = (cx, cy, r0, r1, a0, a1, n = 10) => { const pt = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)], o = [], i = []; for (let k = 0; k <= n; k++) { const a = a0 + ((a1 - a0) * k) / n; o.push(pt(r1, a)); i.push(pt(r0, a)); } return poly([...o, ...i.reverse()]); };
const circ = (cx, cy, r) => E(cx, cy, r, r);

// ------------------------------------------------------------ 1 overview
function overview(S) {
  S.panel(30, 30, 690, 940, 'body'); S.panel(740, 30, 680, 940, 'flow');
  S.at('body');
  const cx = 375, top = 60, P = ([x, y]) => [cx + x, top + y];
  S.beginT(cx, top, 1);
  skin(S); heartGhost(S);
  drawVessels(S, VEIN, V, (d) => ['ves-internal-jugular', 'ves-subclavian-vein', 'ves-brachiocephalic-vein', 'cv-svc'].includes(d.id));
  const t = (id, pts, w0, w1) => vs(S, id, pts, w0, w1 ?? w0, LY);
  t(L('tduct'), [[2, 412], [4, 340], [8, 260], [16, 200], [24, 160], [30, 130]], 9, 10);
  t(L('rduct'), [[-42, 124], [-36, 127], [-30, 129]], 9, 9);
  t(L('jtrunk'), [[-14, 64], [-22, 100], [-40, 122]], 7); t(L('jtrunk'), [[14, 64], [22, 100], [30, 124]], 7);
  t(L('strunk'), [[-80, 146], [-60, 134], [-42, 124]], 7); t(L('strunk'), [[80, 146], [56, 136], [32, 128]], 7);
  t(L('itrunk'), [[8, 366], [4, 396], [2, 412]], 8);
  t(L('lumbar'), [[-34, 505], [-20, 470], [-5, 438]], 8); t(L('lumbar'), [[34, 505], [20, 470], [5, 438]], 8);
  S.sh(L('cist'), E(2, 424, 13, 20), { fill: LY.fill, line: LY.line, sw: 1.3 });
  const nodes = (id, arr) => arr.forEach(([x, y]) => { S.sh(L(id), E(x, y, 9, 7), { fill: LIL.fill, line: LIL.line, sw: 1.2 }); });
  nodes('cerv', [[-27, 74], [-29, 90], [-25, 104], [27, 74], [29, 90], [25, 104]]);
  nodes('axil', [[-106, 176], [-112, 192], [-100, 206], [106, 176], [112, 192], [100, 206]]);
  nodes('ing', [[-42, 492], [-54, 502], [-34, 506], [42, 492], [54, 502], [34, 506]]);
  S.endT();
  [['thoracic-duct', 'tduct', [8, 260]], ['right-duct', 'rduct', [-36, 127]], ['cisterna', 'cist', [2, 424]], ['jugular-trunk', 'jtrunk', [-18, 82]], ['subclavian-trunk', 'strunk', [-70, 140]], ['intestinal-trunk', 'itrunk', [6, 384]],
    ['lumbar-trunks', 'lumbar', [-18, 472]], ['cervical-nodes', 'cerv', [27, 74]], ['axillary-nodes', 'axil', [-112, 192]], ['inguinal-nodes', 'ing', [-54, 502]]].forEach(([id, k, h]) => S.pin(L(id), L(k), P(h)));
  // flow: tissue fluid into blind-ended capillary, collecting vessel with valves, trunk
  S.at('flow');
  S.sh(null, RR(760, 60, 640, 880, 16), { fill: '#EFE9E0', line: '#DCD3C6', sw: 1.2 });
  vs(S, null, [[790, 200], [900, 240], [1020, 215], [1130, 235]], 16, 12, CAP);
  S.sh(L('fluid'), sm([[790, 440], [860, 380], [960, 400], [1010, 480], [960, 590], [850, 630], [780, 560]]), { fill: '#DCE8E6', line: '#8AA3AB', sw: 1.4, dash: '6 4' });
  [[830, 440], [880, 420], [930, 450], [850, 570], [910, 590]].forEach(([x, y]) => S.sh(null, E(x, y, 6, 6), { fill: '#BFD3D1', line: '#8AA3AB', sw: 1 }));
  vs(S, L('cap'), [[800, 510], [900, 510], [1010, 510]], 46, 46, LY);
  vs(S, L('coll'), [[1010, 510], [1120, 510], [1230, 510]], 58, 58, LY);
  [1075, 1140, 1205].forEach((x) => S.sh(null, poly([[x - 10, 482], [x + 12, 510], [x - 10, 538]]), { fill: '#7E9A6F', line: '#5F7A4F', sw: 1.2 }));
  vs(S, L('trunk'), [[1230, 510], [1310, 510], [1385, 510]], 78, 78, LY);
  [[860, 700, 0], [1110, 700, 0], [1310, 700, 0]].forEach(([x, y]) => S.arrow(x, y, 0, 16, '#8A949B'));
  S.pin(L('fluid'), L('fluid'), [880, 500]);
  S.pin(L('capillary'), L('cap'), [960, 510]);
  S.pin(L('collecting-vessel'), L('coll'), [1160, 510]);
  S.pin(L('trunk'), L('trunk'), [1330, 510]);
  void MY; void A; void mirX; void tube;
}
plates.push({
  key: 'lymph-overview', moduleId: MOD, kind: 'gross-diagram', lessons: ['lymph-vessels', 'lymph-trunks', 'lymph-node'], purpose: 'Lymph drainage: capillaries to trunks, the thoracic duct into the LEFT venous angle and the right lymphatic duct into the RIGHT venous angle, with cisterna chyli and node groups.',
  title: ['Lymphatic drainage routes and node groups', 'Rutas de drenaje linfático y grupos ganglionares'],
  desc: ['Left, anterior view, patient right at viewer left: lymph (sage green) drains toward the neck veins (blue). Lymph from the legs and gut collects in the lumbar and intestinal trunks, which empty into the cisterna chyli, the sac at the start of the thoracic duct. The thoracic duct climbs the chest and enters the venous angle on the LEFT, where the left internal jugular and left subclavian veins meet; it drains most of the body (everything below the diaphragm plus the left head, neck, arm and chest). The short right lymphatic duct enters the venous angle on the RIGHT and drains only the right head, neck, arm and chest. The jugular and subclavian trunks feed the ducts. Node groups (purple-grey ovals) sit in neck, armpit and groin. Right: how lymph forms: excess tissue fluid is taken up by a blind-ended lymph capillary, then flows through collecting vessels, with one-way valves, into a larger trunk. Simplified; bronchomediastinal trunks and many nodes omitted.',
    'Izquierda, vista anterior, derecha del paciente a la izquierda: la linfa (verde salvia) drena hacia las venas del cuello (azul). La linfa de las piernas y el intestino se reúne en los troncos lumbares e intestinal, que desembocan en la cisterna del quilo, el saco que inicia el conducto torácico. El conducto torácico asciende por el tórax y entra en el ángulo venoso IZQUIERDO, donde se unen la yugular interna y la subclavia izquierdas; drena la mayor parte del cuerpo (todo lo que está bajo el diafragma más cabeza, cuello, brazo y tórax izquierdos). El corto conducto linfático derecho entra en el ángulo venoso DERECHO y drena solo cabeza, cuello, brazo y tórax derechos. Los troncos yugular y subclavio alimentan los conductos. Los grupos de ganglios (óvalos gris púrpura) están en cuello, axila e ingle. Derecha: cómo se forma la linfa: el exceso de líquido tisular lo recoge un capilar linfático de extremo ciego y fluye por vasos colectores, con válvulas unidireccionales, hasta un tronco mayor. Simplificado; se omiten los troncos broncomediastínicos y muchos ganglios.'],
  orientation: ['left: anterior body view, patient right at viewer left; right: flow from tissue fluid to trunk, left to right', 'izquierda: vista anterior, derecha del paciente a la izquierda; derecha: flujo del líquido tisular al tronco, de izquierda a derecha'], draw: overview,
});

// ------------------------------------------------------------ 2 node
function node(S) {
  S.panel(30, 30, 1390, 940, 'node');
  const outline = [[300, 520], [340, 350], [480, 240], [700, 200], [920, 230], [1080, 340], [1140, 500], [1090, 670], [960, 760], [850, 770], [790, 725], [740, 700], [690, 725], [640, 770], [520, 760], [390, 690]];
  const o = sm(outline, true, 6);
  S.sh('node-all', o, { fill: LIL.fill, line: LIL.line, sw: 1 });
  // cortex = whole outline; medulla inner
  S.sh('cortex', o, { fill: LIL.fill, line: LIL.line, sw: 1 });
  const med = sm([[470, 590], [520, 490], [650, 450], [820, 450], [940, 500], [1000, 580], [930, 690], [840, 720], [745, 676], [650, 730], [540, 705]], true, 6);
  S.clipBoth(o);
  // follicles in the cortex
  [[420, 380], [520, 300], [640, 270], [780, 262], [900, 290], [1000, 370], [1060, 470], [380, 480]].forEach(([x, y]) => { S.sh(null, circ(x, y, 42), { fill: LILD.fill, line: LILD.line, sw: 1.3 }); S.sh(null, circ(x, y, 18), { fill: LILL.fill, line: LILD.line, sw: 1 }); });
  S.sh('medulla', med, { fill: LILL.fill, line: LILL.line, sw: 1.4 });
  [[540, 590, 620, 640, 700, 690], [650, 520, 700, 590, 730, 680], [790, 510, 780, 590, 760, 680], [900, 540, 850, 610, 790, 690]].forEach(([x0, y0, x1, y1, x2, y2]) => {
    S.ln('mcord', `M${x0} ${y0}Q${x1} ${y1} ${x2} ${y2}`, { color: LILD.fill, w: 22 });
  });
  [[600, 520, 680, 600, 730, 690], [730, 480, 750, 580, 744, 690], [860, 500, 820, 600, 770, 690]].forEach(([x0, y0, x1, y1, x2, y2]) => S.ln('msin', `M${x0} ${y0}Q${x1} ${y1} ${x2} ${y2}`, { color: '#C9DABB', w: 14 }));
  S.clipBothEnd();
  // sinuses: subcapsular band, then cortical sinuses crossing the cortex into the medulla
  S.ln('ssin', sm([[330, 500], [362, 370], [490, 262], [700, 222], [910, 250], [1050, 350], [1110, 500]], false, 8), { color: '#C9DABB', w: 16 });
  [[420, 330, 470, 430, 560, 490], [560, 260, 590, 380, 640, 470], [700, 232, 720, 340, 740, 470], [860, 245, 830, 360, 830, 470], [1000, 300, 960, 400, 920, 480]].forEach(([x0, y0, x1, y1, x2, y2]) => S.ln('csin', `M${x0} ${y0}Q${x1} ${y1} ${x2} ${y2}`, { color: '#C9DABB', w: 11 }));
  S.ln('capsule', o, { color: '#7A6A86', w: 12 });
  S.ln(null, o, { color: '#CBBBD2', w: 6 });
  S.sh('hilum', E(740, 715, 62, 30), { fill: '#EFE6EA', line: LIL.line, sw: 1.4 });
  // afferents (continuous with the subcapsular sinus) and efferent from the hilum
  [[590, 240], [700, 222], [860, 238]].forEach(([x, y]) => {
    vs(S, L('aff'), [[x, 80], [x, (80 + y) / 2], [x, y]], 30, 22, LY);
    S.sh(null, poly([[x - 16, 130], [x + 4, 150], [x + 16, 130]]), { fill: '#7E9A6F', line: LY.line, sw: 1.2 });
    S.arrow(x, 108, 90, 13, '#F2EFE8');
  });
  vs(S, L('eff'), [[740, 712], [742, 820], [742, 930]], 36, 46, LY);
  vs(S, null, [[716, 712], [700, 800], [690, 900]], 14, 18, A); vs(S, null, [[766, 712], [790, 800], [800, 900]], 16, 20, V);
  S.arrow(742, 860, 90, 14, '#F2EFE8');
  [['node', 'cortex', [400, 640]], ['afferent', 'aff', [700, 110]], ['efferent', 'eff', [742, 860]], ['capsule', 'capsule', [330, 590]], ['subcapsular-sinus', 'ssin', [700, 222]], ['cortical-sinus', 'csin', [734, 400]],
    ['cortex', 'cortex', [1090, 540]], ['medulla', 'medulla', [940, 560]], ['medullary-sinus', 'msin', [746, 600]], ['medullary-cord', 'mcord', [640, 580]], ['hilum', 'hilum', [742, 716]]].forEach(([id, k, h]) => S.pin(L(id), ['aff', 'eff'].includes(k) ? L(k) : k, h));
}
plates.push({
  key: 'lymph-node-structure', moduleId: MOD, kind: 'tissue-schematic', lessons: ['lymph-node', 'lymph-vessels'], purpose: 'Lymph node in section: afferent vessels entering the convex side, subcapsular, cortical and medullary sinuses, and the efferent vessel leaving at the hilum.',
  title: ['Lymph node: afferent, sinuses, efferent and hilum', 'Ganglio linfático: aferentes, senos, eferente y hilio'],
  desc: ['Schematic section, not a photomicrograph. Several afferent lymphatic vessels (valves point inward) pierce the capsule on the convex side and open into the subcapsular sinus. Lymph then filters through the cortical sinuses (lymphocyte-rich cortex with round follicles), reaches the medullary sinuses between the medullary cords, and leaves by one efferent vessel at the hilum, the dent where an artery and a vein also enter and leave. The flow is continuous: afferent to subcapsular sinus to cortical sinus to medullary sinus to efferent. Because there are several afferents and one efferent, the node slows lymph while macrophages and lymphocytes screen it. The cortex outer rim here also stands for the whole node. Simplified.',
    'Corte esquemático, no una fotomicrografía. Varios vasos linfáticos aferentes (con válvulas hacia dentro) atraviesan la cápsula por el lado convexo y se abren en el seno subcapsular. La linfa se filtra luego por los senos corticales (corteza rica en linfocitos con folículos redondos), llega a los senos medulares entre los cordones medulares y sale por un vaso eferente en el hilio, la hendidura por donde también entran y salen una arteria y una vena. El flujo es continuo: aferente, seno subcapsular, seno cortical, seno medular, eferente. Con varios aferentes y un solo eferente, el ganglio enlentece la linfa mientras macrófagos y linfocitos la revisan. El borde cortical externo representa aquí también todo el ganglio. Simplificado.'],
  orientation: ['afferents enter at top (convex side), efferent leaves at bottom hilum', 'los aferentes entran arriba (lado convexo), el eferente sale por el hilio inferior'], draw: node,
});

// ------------------------------------------------------------ 3 spleen
function spleen(S) {
  S.panel(30, 30, 530, 940, 'organ'); S.panel(580, 30, 840, 940, 'micro');
  S.at('organ');
  S.sh('spleen', sm([[170, 230], [330, 150], [470, 270], [485, 520], [420, 770], [300, 860], [200, 780], [160, 540]]), { fill: PLUM.fill, line: PLUM.line, sw: 2 });
  const g = rng(11);
  [[250, 330], [350, 300], [400, 430], [300, 480], [240, 600], [360, 620], [310, 740], [400, 560]].forEach(([x, y]) => { void g; S.sh('wp', circ(x, y, 16 + (x % 5)), { fill: LILL.fill, line: LILD.line, sw: 1.3 }); });
  S.pin(L('spleen'), 'spleen', [200, 470]);
  S.pin(L('white-pulp'), 'wp', [300, 480]);
  S.at('micro');
  S.sh('cords', RR(600, 50, 800, 900, 14), { fill: '#D2B3BE', line: '#B592A0', sw: 1.2 });
  const sins = [[[620, 130], [740, 200], [860, 170], [1000, 220], [1130, 190], [1250, 240], [1390, 200]], [[620, 760], [760, 700], [900, 780], [1040, 720], [1190, 790], [1390, 740]], [[620, 880], [800, 860], [1000, 900], [1200, 870], [1390, 890]], [[1100, 300], [1160, 400], [1130, 520], [1200, 640], [1160, 720]], [[620, 330], [640, 420], [670, 520], [650, 640], [700, 720]]];
  sins.forEach((p) => { vs(S, L('sins'), p, 26, 26, CAP); });
  [[760, 195], [1010, 218], [820, 725], [1100, 770], [1160, 410], [650, 520]].forEach(([x, y]) => { S.sh(null, E(x, y, 7, 6), { fill: '#CC8F88', line: '#8A524D', sw: 1 }); });
  S.sh(null, circ(880, 460, 175), { fill: LIL.fill, line: LILD.line, sw: 2 });
  S.sh('mz', ring(880, 460, 140, 175, 0, Math.PI * 2, 28), { fill: '#D9CFE0', line: LILD.line, sw: 1.4 });
  S.sh('wp2', circ(880, 460, 140), { fill: LIL.fill, line: LILD.line, sw: 1 });
  S.sh(null, circ(930, 410, 42), { fill: LILL.fill, line: LILD.line, sw: 1.2 });
  [[820, 520], [860, 560], [800, 440], [830, 380], [900, 540], [960, 500]].forEach(([x, y]) => S.sh(null, circ(x, y, 8), { fill: LILD.fill, line: LILD.line, sw: 1 }));
  S.sh('ca', circ(850, 470, 24), { fill: A.fill, line: A.line, sw: 1.8 }); S.sh(null, circ(850, 470, 10), { fill: '#EBD0CC', line: A.line, sw: 1 });
  S.pin(L('white-pulp'), 'wp2', [780, 520]);
  S.pin(L('marginal-zone'), 'mz', [880, 308]);
  S.pin(L('central-arteriole'), 'ca', [850, 470]);
  S.pin(L('splenic-sinusoids'), L('sins'), [1130, 520]);
  S.pin(L('splenic-cords'), 'cords', [720, 380]);
  S.pin(L('red-pulp'), 'cords+'+L('sins'), [1250, 560]);
}
plates.push({
  key: 'spleen-pulp', moduleId: MOD, kind: 'tissue-schematic', lessons: ['lymph-spleen'], purpose: 'Spleen with scattered white pulp; microscopic red pulp (cords and sinusoids) around a white-pulp nodule with central arteriole and marginal zone.',
  title: ['Spleen: red pulp and white pulp', 'Bazo: pulpa roja y pulpa blanca'],
  desc: ['Left: the spleen as an organ, with small pale spots of white pulp scattered through the dark red pulp. Right: a microscopic schematic. White pulp is lymphoid tissue (lymphocytes) wrapped around a branch of the splenic artery, the central arteriole, which sits off-centre; around the white pulp lies the paler marginal zone, where blood-borne antigens are first screened. Red pulp is everything else: splenic sinusoids (mauve channels full of red cells) separated by splenic cords (the dark tissue between them, with macrophages that remove old red cells). Schematic; the arrangement of sinusoids is simplified.',
    'Izquierda: el bazo como órgano, con pequeñas manchas claras de pulpa blanca repartidas por la pulpa roja oscura. Derecha: esquema microscópico. La pulpa blanca es tejido linfoide (linfocitos) que rodea una rama de la arteria esplénica, la arteriola central, situada excéntrica; alrededor de la pulpa blanca está la zona marginal, más pálida, donde se revisan por primera vez los antígenos de la sangre. La pulpa roja es todo lo demás: sinusoides esplénicos (canales malva llenos de eritrocitos) separados por cordones esplénicos (el tejido oscuro entre ellos, con macrófagos que retiran eritrocitos viejos). Esquemático; la disposición de los sinusoides está simplificada.'],
  orientation: ['left: whole organ; right: microscopic field', 'izquierda: órgano entero; derecha: campo microscópico'], draw: spleen,
});

// ------------------------------------------------------------ 4 thymus
function thymus(S) {
  S.panel(30, 30, 590, 940, 'chest'); S.panel(640, 30, 780, 940, 'lobule');
  S.at('chest');
  S.sh(null, sm([[120, 250], [250, 130], [430, 130], [530, 250], [560, 560], [500, 880], [150, 880], [90, 560]], true, 6), { fill: '#E8DCCD', line: '#B7A593', sw: 1.6 });
  S.sh(null, RR(312, 190, 36, 420, 14), { fill: '#E4D6BC', line: '#8B8168', sw: 1.4 });
  vs(S, null, [[300, 190], [300, 420], [300, 520]], 46, 46, V);
  S.sh(null, sm([[260, 520], [360, 480], [440, 560], [420, 700], [330, 780], [260, 700]]), { fill: MY.fill, line: MY.line, sw: 1.6 });
  vs(S, null, [[270, 470], [330, 400], [440, 420]], 40, 36, A);
  S.sh('thymus', sm([[210, 220], [290, 210], [305, 340], [280, 450], [230, 420], [196, 320]], true, 5), { fill: LIL.fill, line: LILD.line, sw: 1.8 });
  S.sh('thymus', sm([[410, 220], [330, 210], [315, 340], [340, 450], [390, 420], [424, 320]], true, 5), { fill: LIL.fill, line: LILD.line, sw: 1.8 });
  S.ln(null, 'M308 215L308 440', { color: LILD.line, w: 1.4, dash: '5 4' });
  S.pin(L('thymus'), 'thymus', [240, 340]);
  S.at('lobule');
  const o = sm([[700, 330], [800, 160], [1050, 90], [1270, 170], [1350, 380], [1300, 700], [1120, 860], [880, 850], [720, 700]], true, 6);
  S.sh('lobule-all', sm([[690, 330], [795, 148], [1050, 78], [1282, 160], [1362, 380], [1312, 712], [1130, 874], [872, 864], [706, 710]], true, 6), { fill: CRM.fill, line: CRM.line, sw: 2 });
  S.sh('cx', o, { fill: LILD.fill, line: LILD.line, sw: 1.6 });
  S.clipBoth(o);
  const g = rng(3); for (let i = 0; i < 130; i++) { const x = 700 + g() * 660, y = 90 + g() * 780; S.sh(null, circ(x, y, 5), { fill: '#A794B5', line: '#8A78A0', sw: 0.8 }); }
  S.clipBothEnd();
  const med = sm([[860, 420], [960, 330], [1130, 350], [1210, 470], [1170, 640], [1020, 700], [900, 620]], true, 6);
  S.sh('md', med, { fill: LILL.fill, line: LILL.line, sw: 1.6 });
  [[1000, 480, 62], [1120, 560, 46]].forEach(([x, y, r]) => { S.sh('hass', circ(x, y, r), { fill: '#F0E4E8', line: '#8C7C98', sw: 1.6 }); for (let k = 1; k < 4; k++) S.sh(null, circ(x, y, r - k * (r / 4.5)), { fill: k % 2 ? '#E8CDD3' : '#F0E4E8', line: '#8C7C98', sw: 1 }); });
  S.pin(L('thymic-cortex'), 'cx', [780, 260]);
  S.pin(L('thymic-medulla'), 'md', [900, 470]);
  S.pin(L('hassall'), 'hass', [1055, 480]);
  S.pin(L('thymic-lobule'), 'cx+md', [1290, 300], { panel: 'lobule' });
}
plates.push({
  key: 'thymus-lobule', moduleId: MOD, kind: 'tissue-schematic', lessons: ['lymph-thymus', 'endo-pineal-thymus'], purpose: 'Thymus in the upper chest in front of the great vessels, and a lobule with cortex, medulla and Hassall\u2019s corpuscles.',
  title: ['Thymus and thymic lobule', 'Timo y lobulillo tímico'],
  desc: ['Left: the thymus, a two-lobed organ behind the breastbone (pale vertical bar) in the upper chest, in front of the great vessels and the heart (it is large in children and shrinks with age). Right: one lobule, schematic. The dense, dark outer cortex is packed with developing T lymphocytes; the paler inner medulla has fewer lymphocytes and contains Hassall\u2019s corpuscles, whorls of flattened epithelial cells whose exact role is still debated. Thin pale connective septa (the rim) divide the gland into lobules. Simplified.',
    'Izquierda: el timo, un órgano bilobulado detrás del esternón (barra vertical pálida) en la parte alta del tórax, delante de los grandes vasos y del corazón (es grande en niños y se reduce con la edad). Derecha: un lobulillo, esquemático. La corteza externa, densa y oscura, está llena de linfocitos T en desarrollo; la médula interna, más pálida, tiene menos linfocitos y contiene corpúsculos de Hassall, remolinos de células epiteliales aplanadas cuya función exacta aún se discute. Finos tabiques conectivos pálidos (el borde) dividen la glándula en lobulillos. Simplificado.'],
  orientation: ['left: anterior chest view, patient right at viewer left; right: one lobule', 'izquierda: tórax en vista anterior, derecha del paciente a la izquierda; derecha: un lobulillo'], draw: thymus,
});

// ------------------------------------------------------------ 5 tonsils
function tonsils(S) {
  S.panel(30, 30, 520, 940, 'sagittal'); S.panel(570, 30, 420, 940, 'mouth'); S.panel(1010, 30, 410, 940, 'structure');
  S.at('sagittal');
  const f = ([x, y]) => [-110 + 0.8 * x, 120 + 0.8 * y];
  S.beginT(-110, 120, 0.8);
  S.sh(null, sm([[255, 190], [200, 380], [188, 440], [214, 468], [212, 500], [222, 560], [238, 650], [330, 700], [352, 930], [690, 930], [690, 700], [770, 560], [790, 400], [740, 220], [580, 100], [400, 100]], true, 8), { fill: '#EADFD0', line: '#B7A593', sw: 2.4 });
  S.sh(null, sm([[236, 440], [300, 372], [405, 358], [432, 390], [436, 470], [330, 488], [246, 476]]), { fill: '#DCE8EA', line: '#7E9AA3', sw: 1.8 });
  S.sh(null, sm([[236, 484], [330, 494], [420, 496], [424, 512], [330, 514], [240, 504]], true, 4), { fill: '#E4D6BC', line: '#8B8168', sw: 1.6 });
  S.sh(null, sm([[420, 496], [470, 504], [492, 546], [478, 566], [452, 530], [424, 512]], true, 4), { fill: MUC.fill, line: MUC.line, sw: 1.6 });
  S.sh(null, sm([[240, 506], [330, 516], [424, 516], [432, 580], [330, 612], [244, 580]]), { fill: '#EAD9D2', line: MUC.line, sw: 1.4 });
  S.sh('tongue', sm([[246, 560], [300, 530], [400, 534], [440, 590], [430, 650], [380, 640], [290, 618]]), { fill: '#D69A94', line: '#8A5C54', sw: 1.6 });
  S.sh(null, sm([[446, 396], [520, 380], [562, 398], [564, 500], [494, 506], [456, 470]], true, 4), { fill: '#DCE8EA', line: '#7E9AA3', sw: 1.8 });
  S.sh(null, sm([[494, 506], [564, 500], [566, 590], [488, 592], [482, 540]], true, 4), { fill: '#E3EDEE', line: '#7E9AA3', sw: 1.8 });
  S.sh(null, sm([[488, 592], [566, 590], [564, 706], [506, 706], [490, 650]], true, 4), { fill: '#D5E4E6', line: '#7E9AA3', sw: 1.8 });
  S.sh('adenoid', sm([[540, 388], [514, 396], [506, 430], [524, 462], [556, 440], [560, 405]], true, 4), { fill: LIL.fill, line: LILD.line, sw: 1.8 });
  S.sh('lingual', sm([[432, 596], [452, 588], [472, 606], [468, 640], [440, 650], [428, 622]], true, 4), { fill: LIL.fill, line: LILD.line, sw: 1.8 });
  S.endT();
  S.pin(L('pharyngeal-tonsil'), 'adenoid', f([534, 428]));
  S.pin(L('lingual-tonsil'), 'lingual', f([448, 620]));
  S.at('mouth');
  S.sh(null, E(780, 500, 190, 340), { fill: '#E7C9C3', line: '#9A6A66', sw: 2.4 });
  S.sh(null, sm([[620, 380], [700, 250], [780, 220], [860, 250], [940, 380], [880, 440], [780, 400], [680, 440]], true, 6), { fill: '#DDADA8', line: '#9A6A66', sw: 1.6 });
  S.sh(null, sm([[680, 440], [780, 400], [880, 440], [880, 700], [780, 760], [680, 700]]), { fill: '#C98A84', line: '#8A5C54', sw: 1.4 });
  S.sh(null, sm([[690, 560], [780, 520], [870, 560], [880, 840], [780, 900], [680, 840]]), { fill: '#D69A94', line: '#8A5C54', sw: 1.8 });
  [[680, 500], [880, 500]].forEach(([x, y]) => { S.sh(null, sm([[x - 40, y - 100], [x, y - 120], [x + 30, y - 60], [x + 20, y + 60], [x - 10, y + 100], [x - 46, y + 20]], true, 5), { fill: '#DDADA8', line: '#9A6A66', sw: 1.4 }); S.sh('pt', E(x, y, 26, 54), { fill: LIL.fill, line: LILD.line, sw: 1.8 }); });
  S.sh(null, sm([[764, 320], [796, 320], [802, 400], [780, 430], [758, 400]]), { fill: '#E0B7B0', line: '#9A6A66', sw: 1.4 });
  S.pin(L('palatine-tonsil'), 'pt', [680, 500]);
  S.at('structure');
  S.sh('epi', rect(1030, 120, 370, 60), { fill: '#EBD6D0', line: '#9A6A66', sw: 1.4 });
  [1100, 1215, 1320].forEach((x) => S.sh('epi', sm([[x - 24, 150], [x - 14, 300], [x - 4, 360], [x + 4, 360], [x + 14, 300], [x + 24, 150]], true, 4), { fill: '#EBD6D0', line: '#9A6A66', sw: 1.4 }));
  S.sh('tis', rect(1030, 170, 370, 700), { fill: LIL.fill, line: LILD.line, sw: 1.2 });
  [1100, 1215, 1320].forEach((x) => S.sh('epi', sm([[x - 14, 150], [x - 6, 290], [x, 340], [x + 6, 290], [x + 14, 150]], true, 4), { fill: '#EAF0F1', line: '#9A6A66', sw: 1 }));
  [[1100, 520], [1230, 460], [1330, 600], [1160, 690], [1290, 770]].forEach(([x, y]) => { S.sh('fol', circ(x, y, 56), { fill: LILD.fill, line: LILD.line, sw: 1.6 }); S.sh('gc', circ(x, y, 30), { fill: LILL.fill, line: LILD.line, sw: 1.2 }); });
  S.sh(null, RR(1030, 850, 370, 30, 6), { fill: CRM.fill, line: CRM.line, sw: 1.4 });
  S.pin(L('tonsil'), 'epi', [1070, 165]);
  S.pin(L('malt'), 'tis', [1160, 330]);
  S.pin(L('follicle'), 'fol', [1100, 468]);
  S.pin(L('germinal-center'), 'gc', [1230, 460]);
}
const rect = (x, y, w, h) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
plates.push({
  key: 'tonsil-map-structure', moduleId: MOD, kind: 'gross-diagram', lessons: ['lymph-tonsils'], purpose: 'Position of the pharyngeal, palatine and lingual tonsils, and the structure of a tonsil with crypts and lymphoid follicles.',
  title: ['Tonsils: where they sit and how they are built', 'Amígdalas: dónde están y cómo se organizan'],
  desc: ['Left: midline sagittal head, face at viewer left. The pharyngeal tonsil (adenoid) lies on the roof and back wall of the nasopharynx; the lingual tonsil lies on the back of the tongue. Middle: open-mouth view from the front: the palatine tonsils are the pair between the arches at the sides of the throat, with the uvula in the middle. Together these and neighbouring patches form a ring of lymphoid tissue at the entrance of the throat. Right: structure of a tonsil, schematic: surface epithelium dips into deep crypts that trap material; beneath it lies lymphoid tissue (MALT, mucosa-associated lymphoid tissue) with round lymphoid follicles, each with a paler germinal centre where B cells multiply; a thin capsule lies at the base. Simplified.',
    'Izquierda: cabeza en corte sagital medio, cara a la izquierda. La amígdala faríngea (adenoides) está en el techo y la pared posterior de la nasofaringe; la amígdala lingual, en la base de la lengua. Centro: vista de la boca abierta desde delante: las amígdalas palatinas son el par entre los pilares a los lados de la garganta, con la úvula en el centro. Junto con otros acúmulos vecinos forman un anillo de tejido linfoide a la entrada de la faringe. Derecha: estructura de una amígdala, esquemática: el epitelio de superficie se hunde en criptas profundas que atrapan material; debajo hay tejido linfoide (MALT, tejido linfoide asociado a mucosas) con folículos linfoides redondos, cada uno con un centro germinal más pálido donde se multiplican los linfocitos B; una cápsula fina queda en la base. Simplificado.'],
  orientation: ['left: sagittal head, face at viewer left; middle: open-mouth view; right: tonsil section, surface at top', 'izquierda: cabeza sagital, cara a la izquierda; centro: boca abierta; derecha: corte de amígdala, superficie arriba'], draw: tonsils,
});

// ------------------------------------------------------------ 6 gut lymphoid
function gut(S) {
  S.panel(30, 30, 820, 940, 'gut'); S.panel(870, 30, 550, 940, 'villus');
  S.at('gut');
  S.sh(null, sm([[120, 330], [420, 380], [620, 470], [560, 560], [300, 480]]), { fill: CRM.fill, line: CRM.line, sw: 1.2 });
  vs(S, L('itrunk'), [[330, 480], [250, 400], [190, 300], [170, 120]], 24, 22, LY);
  [[300, 440, 220, 380], [380, 470, 280, 420], [250, 420, 200, 330]].forEach(([x0, y0, x1, y1]) => S.ln(null, `M${x0} ${y0}L${x1} ${y1}`, { color: LY.line, w: 4 }));
  S.arrow(172, 220, -90, 14, '#F2EFE8');
  const ile = [[100, 300], [300, 260], [500, 300], [600, 430]];
  S.sh(null, tube(ile, 74, 74), { fill: '#E8D6C8', line: '#A8917C', sw: 1.8 });
  S.sh('cecum', sm([[540, 470], [680, 480], [720, 620], [660, 770], [560, 770], [520, 620]], true, 6), { fill: '#E8D6C8', line: '#A8917C', sw: 1.8 });
  S.sh(null, tube([[700, 560], [740, 400], [740, 130]], 66, 66), { fill: '#E8D6C8', line: '#A8917C', sw: 1.8 });
  S.sh('app', tube([[600, 770], [570, 850], [640, 905], [710, 850]], 36, 24), { fill: LIL.fill, line: LILD.line, sw: 1.8 });
  [[240, 272, -8], [350, 262, 0], [450, 284, 20]].forEach(([x, y, r]) => S.sh('pey', E(x, y, 46, 22, r), { fill: LIL.fill, line: LILD.line, sw: 1.6 }));
  S.pin(L('peyers'), 'pey', [350, 262]);
  S.pin(L('appendix'), 'app', [650, 880]);
  S.pin(L('intestinal-trunk'), L('itrunk'), [178, 220]);
  S.at('villus');
  S.sh(null, RR(890, 60, 510, 880, 16), { fill: '#EFE9E0', line: '#DCD3C6', sw: 1.2 });
  S.sh(null, sm([[1010, 880], [1010, 380], [1040, 190], [1155, 130], [1270, 190], [1300, 380], [1300, 880]]), { fill: '#EFD9C7', line: '#B8957C', sw: 2.2 });
  S.sh(null, sm([[1040, 880], [1040, 390], [1066, 224], [1155, 168], [1244, 224], [1270, 390], [1270, 880]]), { fill: '#EBD3CC', line: '#A8817C', sw: 1.4 });
  S.sh(null, sm([[1112, 880], [1108, 430], [1130, 260], [1155, 230], [1180, 260], [1202, 430], [1198, 880]]), { fill: LY.fill, line: LY.line, sw: 1.8 });
  S.sh('lacteal', sm([[1124, 880], [1122, 430], [1140, 272], [1155, 250], [1170, 272], [1188, 430], [1186, 880]]), { fill: '#CFE0C0', line: LY.line, sw: 1.8 });
  [-1, 1].forEach((s) => vs(S, null, [[1155 + s * 82, 880], [1155 + s * 90, 560], [1155 + s * 80, 340], [1155 + s * 40, 230]], 14, 12, CAP));
  S.arrow(1155, 640, -90, 14, '#8A949B');
  S.sh('pey2', sm([[930, 930], [960, 800], [1090, 770], [1220, 790], [1380, 780], [1400, 930]]), { fill: LIL.fill, line: LILD.line, sw: 1.6 });
  S.pin(L('lacteal'), 'lacteal', [1155, 520]);
  S.pin(L('peyers'), 'pey2', [1200, 880]);
}
plates.push({
  key: 'gut-lymphoid-lacteal', moduleId: MOD, kind: 'gross-diagram', lessons: ['lymph-intestinal', 'lymph-trunks'], purpose: 'Peyer\u2019s patches in the ileum, appendix at the cecum, intestinal trunk, and a villus with its central lacteal.',
  title: ['Gut-associated lymphoid tissue and the lacteal', 'Tejido linfoide intestinal y quilífero'],
  desc: ['Left: terminal small bowel (ileum) joining the cecum of the large intestine, anterior view, patient right at viewer left; context drawn in cream. Peyer\u2019s patches are oval plaques of lymphoid tissue in the wall of the ileum that sample what is in the gut. The appendix hangs from the cecum and also has a lymphoid-rich wall. Lymph from the gut wall runs through the mesentery to the intestinal trunk (sage green), which carries it up to the cisterna chyli. Right: a villus (fingerlike fold of the small-bowel lining) in section: the central blind-ended lymph capillary, the lacteal, picks up absorbed fats; the blood capillary network (mauve) beside it takes up most other nutrients. Peyer\u2019s lymphoid tissue lies below, in the base of the wall. Schematic; the villus is much enlarged.',
    'Izquierda: intestino delgado terminal (íleon) uniéndose al ciego del intestino grueso, vista anterior, derecha del paciente a la izquierda; el contexto está en crema. Las placas de Peyer son placas ovales de tejido linfoide en la pared del íleon que muestrean el contenido intestinal. El apéndice cuelga del ciego y también tiene una pared rica en tejido linfoide. La linfa de la pared intestinal recorre el mesenterio hasta el tronco intestinal (verde salvia), que la lleva hasta la cisterna del quilo. Derecha: una vellosidad (pliegue digitiforme de la mucosa del intestino delgado) en corte: el capilar linfático central de extremo ciego, el quilífero, recoge las grasas absorbidas; la red de capilares sanguíneos (malva) a su lado capta casi todos los demás nutrientes. El tejido linfoide de Peyer queda debajo, en la base de la pared. Esquemático; la vellosidad está muy ampliada.'],
  orientation: ['left: anterior view, patient right at viewer left; right: villus section, tip at top', 'izquierda: vista anterior, derecha del paciente a la izquierda; derecha: corte de vellosidad, punta arriba'], draw: gut,
});
