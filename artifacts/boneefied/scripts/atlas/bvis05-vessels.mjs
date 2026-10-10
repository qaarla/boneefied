// BVIS05 blood-vessel plates, part 1: wall and types, flow chain, capillary types, whole-body maps, head and neck.
import { C, sm, poly, E, RR, tube, A, V, vs } from './bvis05-lib.mjs';
import { skin, heartGhost, ART, VEIN, drawVessels } from './bvis05-body.mjs';

const MOD = 'blood-vessels';
export const plates = [];
const ring = (cx, cy, r0, r1, a0, a1, n = 10) => {
  const pt = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)], o = [], i = [];
  for (let k = 0; k <= n; k++) { const a = a0 + ((a1 - a0) * k) / n; o.push(pt(r1, a)); i.push(pt(r0, a)); }
  return poly([...o, ...i.reverse()]);
};
const CAP = { fill: '#B592A0', line: '#76566A' };
const rbcP = (S, id, x, y, r, rot = 0) => { S.sh(id, E(x, y, r, r * 0.9, rot), { fill: '#CC8F88', line: '#8A524D', sw: 1.2 }); S.sh(id, E(x, y, r * 0.4, r * 0.34, rot), { fill: '#E3B5AE', line: '#CC8F88', sw: 0.7 }); };

// ---------------------------------------------------------------- 1 wall and types
function cross(S, k, cx, cy, r, o) {
  const { ext, med, intima = 0.1, elastic = 0, vein = false, oval = 1 } = o;
  S.sh(k.ext, E(cx, cy, r, r * oval), { fill: '#E3D9C4', line: '#8B8168', sw: 1.6 });
  const rm = r * (1 - ext); S.sh(k.med, E(cx, cy, rm, rm * oval), { fill: vein ? '#D3B0AA' : '#C8928E', line: '#8A524D', sw: 1.4 });
  for (let i = 1; i <= elastic; i++) { const q = rm * (1 - (i * med) / (elastic + 1)); S.sh(null, E(cx, cy, q, q * oval), { fill: 'none', line: '#8A6060', sw: 1.1 }); }
  const ri = rm * (1 - med); S.sh(k.int, E(cx, cy, ri, ri * oval), { fill: '#EBD0CC', line: '#A8817C', sw: 1.2 });
  const re = ri * (1 - intima); S.sh(k.endo, E(cx, cy, re, re * oval), { fill: '#B88C98', line: '#76566A', sw: 1.4 });
  const rl = re - 5; S.sh(k.lum, E(cx, cy, rl, rl * oval), { fill: vein ? V.fill : A.fill, line: vein ? V.line : A.line, sw: 1 });
}
function wallTypes(S) {
  S.panel(30, 30, 690, 940, 'wall'); S.panel(740, 30, 680, 940, 'types');
  S.at('wall');
  cross(S, { ext: 'ves-externa', med: 'ves-media', int: 'ves-intima', endo: 'ves-endothelium', lum: 'ves-artery' }, 375, 300, 205, { ext: 0.18, med: 0.34, intima: 0.12, elastic: 3 });
  cross(S, { ext: 'vext', med: 'vmed', int: 'vint', endo: 'vendo', lum: 'ves-vein' }, 375, 760, 140, { ext: 0.3, med: 0.14, intima: 0.1, vein: true, oval: 0.8 });
  S.pin('ves-externa', 'ves-externa', [375, 112]);
  S.pin('ves-media', 'ves-media', [375, 160]);
  S.pin('ves-intima', 'ves-intima', [375, 195]);
  S.pin('ves-endothelium', 'ves-endothelium', [375, 206]);
  S.pin('ves-artery', 'ves-artery', [375, 330]);
  S.pin('ves-vein', 'ves-vein', [375, 770]);
  S.at('types');
  const row = (y, k, r, o, label) => { void label; cross(S, k, 960, y, r, o); };
  row(150, { ext: 'ves-elastic', med: 'e1', int: 'e2', endo: 'e3', lum: 'e4' }, 108, { ext: 0.12, med: 0.5, intima: 0.1, elastic: 6 });
  row(380, { ext: 'ves-muscular', med: 'm1', int: 'm2', endo: 'm3', lum: 'm4' }, 80, { ext: 0.16, med: 0.42, intima: 0.12, elastic: 1 });
  row(560, { ext: 'ves-arteriole', med: 'a1', int: 'a2', endo: 'a3', lum: 'a4' }, 46, { ext: 0.1, med: 0.4, intima: 0.14 });
  S.sh('ves-capillary', E(960, 700, 22, 22), { fill: '#B88C98', line: '#76566A', sw: 1.4 }); S.sh('ves-capillary', E(960, 700, 14, 14), { fill: CAP.fill, line: CAP.line, sw: 1 });
  cross(S, { ext: 'ves-venule', med: 'v1', int: 'v2', endo: 'v3', lum: 'v4' }, 960, 800, 38, { ext: 0.3, med: 0.1, intima: 0.12, vein: true });
  cross(S, { ext: 'tv', med: 'tv1', int: 'tv2', endo: 'tv3', lum: 'ves-vein' }, 960, 910, 36, { ext: 0.3, med: 0.12, intima: 0.12, vein: true });
  S.arrow(1250, 150, 90, 0.1, C.soft);
  S.pin('ves-elastic', 'ves-elastic', [960, 56]);
  S.pin('ves-muscular', 'ves-muscular', [960, 316]);
  S.pin('ves-arteriole', 'ves-arteriole', [960, 520]);
  S.pin('ves-capillary', 'ves-capillary', [960, 681]);
  S.pin('ves-venule', 'ves-venule', [960, 770]);
  S.pin('ves-vein', 'tv', [960, 880]);
}
plates.push({
  key: 'vessel-wall-types', moduleId: MOD, kind: 'tissue-schematic', lessons: ['ves-wall', 'ves-types', 'ves-large-arteries'], purpose: 'Three tunics of a vessel wall, artery against vein, and the six vessel types by relative wall and size.',
  title: ['Vessel wall layers and vessel types', 'Capas de la pared vascular y tipos de vaso'],
  desc: ['Schematic cross-sections, not histology images. Left: an artery has, from outside in, the tunica externa (connective tissue), a thick tunica media (smooth muscle and elastic layers), the tunica intima (thin connective layer) and the endothelium, a single flat cell layer lining the lumen. The vein below has the same three layers but a much thinner media, a thicker externa and a wider, flatter lumen. Right, relative size and wall, top to bottom: elastic artery (many elastic layers; aorta and its big branches), muscular artery (mostly smooth muscle), arteriole (thin muscular wall), capillary (a single endothelial cell layer), venule and vein. Sizes are not to true scale (a capillary is far smaller than drawn).',
    'Cortes transversales esquemáticos, no imágenes histológicas. Izquierda: una arteria tiene, de fuera adentro, túnica externa (tejido conectivo), túnica media gruesa (músculo liso y láminas elásticas), túnica íntima (capa conectiva fina) y endotelio, una capa de células planas que reviste la luz. La vena de abajo tiene las mismas tres capas, pero una media mucho más fina, una externa más gruesa y una luz más ancha y aplanada. Derecha, de arriba abajo, tamaño y pared relativos: arteria elástica (muchas láminas elásticas; aorta y sus ramas grandes), arteria muscular (sobre todo músculo liso), arteriola (pared muscular fina), capilar (una sola capa de endotelio), vénula y vena. Los tamaños no están a escala real (un capilar es mucho menor que lo dibujado).'],
  orientation: ['cross-sections viewed along the vessel axis; lumen at centre', 'cortes transversales vistos a lo largo del eje; luz en el centro'], draw: wallTypes,
});

// ---------------------------------------------------------------- 2 flow chain
function flow(S) {
  S.panel(30, 30, 1390, 940, 'chain');
  S.sh(null, RR(60, 60, 1330, 880, 16), { fill: '#EFE9E0', line: '#DCD3C6', sw: 1.2 });
  vs(S, 'ves-aorta', [[90, 500], [180, 500], [260, 500]], 110, 100, A);
  vs(S, 'ves-artery', [[260, 500], [330, 500], [390, 500]], 72, 60, A);
  const ys = [300, 400, 500, 600, 700];
  ys.forEach((y) => { vs(S, 'ves-arteriole', [[390, 500], [450, (500 + y) / 2], [520, y], [580, y]], 22, 14, A); });
  ys.forEach((y) => { vs(S, 'ves-capillary', [[580, y], [740, y], [900, y]], 10, 10, CAP); });
  [[660, 300, 400], [820, 400, 500], [700, 500, 600], [860, 600, 700]].forEach(([x, a, b]) => vs(S, 'ves-capillary', [[x, a], [x, b]], 8, 8, CAP));
  ys.forEach((y) => { vs(S, 'ves-venule', [[900, y], [960, y], [1030, (500 + y) / 2], [1090, 500]], 14, 24, V); });
  vs(S, 'ves-vein', [[1090, 500], [1200, 500], [1340, 500]], 64, 84, V);
  [[140, 500], [310, 500], [460, 420], [760, 400], [1000, 500], [1200, 500]].forEach(([x, y], i) => S.arrow(x, y, i < 4 ? (i === 2 ? -14 : 0) : 0, 12, '#F2EFE8'));
  rbcP(S, null, 760, 300, 7); rbcP(S, null, 760, 500, 7); rbcP(S, null, 780, 700, 7);
  S.pin('ves-aorta', 'ves-aorta', [170, 500]);
  S.pin('ves-artery', 'ves-artery', [320, 500]);
  S.pin('ves-arteriole', 'ves-arteriole', [550, 300]);
  S.pin('ves-capillary', 'ves-capillary', [740, 300]);
  S.pin('ves-venule', 'ves-venule', [940, 600]);
  S.pin('ves-vein', 'ves-vein', [1240, 500]);
}
plates.push({
  key: 'vessel-flow-chain', moduleId: MOD, kind: 'gross-diagram', lessons: ['ves-flow', 'ves-large-arteries'], purpose: 'Order of vessels from the aorta to veins: aorta, artery, arteriole, capillary bed, venule, vein.',
  title: ['Flow chain: aorta to vein', 'Cadena del flujo: de la aorta a la vena'],
  desc: ['Schematic, one continuous route, flowing left to right. The aorta (widest, elastic wall) divides into smaller arteries and then arterioles, which feed a capillary bed, the only place where exchange with tissue happens. Capillaries drain into venules, which merge into larger veins carrying blood back toward the heart. Arteries are red, capillaries a muted mauve and veins blue; here colour marks vessel type, not oxygen content (the pulmonary circuit reverses it). Vessel widths and branching are simplified and not to scale.',
    'Esquema de una ruta continua, de izquierda a derecha. La aorta (la más ancha, de pared elástica) se divide en arterias menores y luego en arteriolas, que alimentan un lecho capilar, el único lugar de intercambio con el tejido. Los capilares drenan en vénulas, que se unen en venas mayores que devuelven la sangre al corazón. Arterias en rojo, capilares en malva suave y venas en azul; aquí el color indica el tipo de vaso, no el contenido de oxígeno (la circulación pulmonar lo invierte). Los anchos y la ramificación están simplificados y no son a escala.'],
  orientation: ['flow runs left to right', 'el flujo va de izquierda a derecha'], draw: flow,
});

// ---------------------------------------------------------------- 3 capillary types
function capTypes(S) {
  const pans = [[30, 30, 520], [570, 30, 440], [1030, 30, 390]];
  pans.forEach(([x, y, w], i) => S.panel(x, y, w, 940, ['cont', 'fen', 'sin'][i]));
  const N = 14;
  // continuous
  S.at('cont');
  const c1 = [290, 480, 190];
  for (let i = 0; i < N; i++) S.sh('ves-continuous', ring(c1[0], c1[1], c1[2] - 24, c1[2], (i * 2 * Math.PI) / N, ((i + 1) * 2 * Math.PI) / N), { fill: '#C2A0AB', line: '#76566A', sw: 1.2 });
  S.out.push(`<circle cx="${c1[0]}" cy="${c1[1]}" r="${c1[2] + 7}" fill="none" stroke="#B7A593" stroke-width="3"/>`);
  S.sh(null, E(c1[0], c1[1], c1[2] - 25, c1[2] - 25), { fill: '#E8D3CF', line: '#E8D3CF', sw: 0.5 });
  rbcP(S, 'ves-rbc', 240, 470, 52, 20); rbcP(S, null, 335, 530, 50, -30);
  S.sh('ves-platelet', sm([[290, 390], [312, 382], [332, 396], [322, 412], [298, 414]], true, 4), { fill: '#BDAAD0', line: '#6F6381', sw: 1.2 });
  // neutrophil squeezing through the wall, outside
  S.sh('ves-neutrophil', E(290, 700, 52, 52), { fill: '#E7DFDC', line: '#A59490', sw: 1.4 });
  [[270, 690], [296, 680], [316, 702], [296, 722]].forEach(([a, b]) => S.sh('ves-neutrophil', E(a, b, 12, 11), { fill: '#8E83A6', line: '#5E5578', sw: 1.2 }));
  // fenestrated
  S.at('fen');
  const c2 = [790, 480, 160];
  for (let i = 0; i < N; i++) {
    const a0 = (i * 2 * Math.PI) / N, a1 = ((i + 1) * 2 * Math.PI) / N;
    S.sh('ves-fenestrated', ring(c2[0], c2[1], c2[2] - 10, c2[2], a0, a1), { fill: '#C2A0AB', line: '#76566A', sw: 1.2 });
    const am = (a0 + a1) / 2; S.sh(null, E(c2[0] + (c2[2] - 5) * Math.cos(am), c2[1] + (c2[2] - 5) * Math.sin(am), 3.5, 3.5), { fill: '#E8D3CF', line: '#76566A', sw: 0.8 });
    S.sh('ves-fenestrated', ring(c2[0], c2[1], c2[2] - 30, c2[2] - 10, a0 + 0.04, a1 - 0.04, 2), { fill: '#C2A0AB', line: '#76566A', sw: 0.8, op: 0.9 });
  }
  S.sh(null, E(c2[0], c2[1], c2[2] - 28, c2[2] - 28), { fill: '#E8D3CF', line: '#E8D3CF', sw: 0.5 });
  rbcP(S, null, 770, 470, 44, 10);
  // sinusoid
  S.at('sin');
  const c3 = [1225, 480, 135];
  for (let i = 0; i < 7; i++) {
    const a0 = (i * 2 * Math.PI) / 7 + 0.15, a1 = ((i + 1) * 2 * Math.PI) / 7 - 0.15;
    S.sh('ves-sinusoid', ring(c3[0] + 12 * Math.cos(a0), c3[1] + 12 * Math.sin(a0), c3[2] - 20, c3[2], a0, a1, 5), { fill: '#C2A0AB', line: '#76566A', sw: 1.2 });
  }
  S.sh(null, E(c3[0], c3[1], c3[2] - 22, c3[2] - 22), { fill: '#E8D3CF', line: '#E8D3CF', sw: 0.5, op: 0.99 });
  rbcP(S, null, 1200, 470, 38, -10); rbcP(S, null, 1260, 520, 36, 30);
  S.at('cont');
  S.pin('ves-continuous', 'ves-continuous', [290 + 166, 480]);
  S.pin('ves-rbc', 'ves-rbc', [240, 470]);
  S.pin('ves-platelet', 'ves-platelet', [312, 398]);
  S.pin('ves-neutrophil', 'ves-neutrophil', [290, 700]);
  S.at('fen'); S.pin('ves-fenestrated', 'ves-fenestrated', [790, 480 - 150]);
  S.at('sin'); S.pin('ves-sinusoid', 'ves-sinusoid', [1225, 480 + 122]);
}
plates.push({
  key: 'capillary-types', moduleId: MOD, kind: 'tissue-schematic', lessons: ['ves-capillary-types', 'ves-elements'], purpose: 'Continuous, fenestrated and sinusoid capillaries compared in cross-section, with the blood cells they carry.',
  title: ['Three capillary types', 'Tres tipos de capilares'],
  desc: ['Schematic cross-sections, not electron micrographs. Left, continuous capillary: endothelial cells joined edge to edge with no pores, the most common type (muscle, skin, brain with extra-tight junctions). It carries red cells and platelets, and a neutrophil is drawn outside the wall, as it would be after squeezing out into tissue. Middle, fenestrated capillary: thin windows (fenestrae) through the cells for rapid exchange, in kidney glomeruli, gut lining and endocrine glands. Right, sinusoid: wide, irregular lumen with large gaps between cells and a discontinuous basement membrane, in liver, bone marrow and spleen. Sizes are exaggerated and not to scale to each other.',
    'Cortes transversales esquemáticos, no microfotografías electrónicas. Izquierda, capilar continuo: células endoteliales unidas borde con borde sin poros, el tipo más frecuente (músculo, piel, cerebro con uniones aún más estrechas). Lleva eritrocitos y plaquetas, y un neutrófilo se dibuja fuera de la pared, como tras salir al tejido. Centro, capilar fenestrado: finas ventanas (fenestras) a través de las células para un intercambio rápido, en los glomérulos renales, el intestino y las glándulas endocrinas. Derecha, sinusoide: luz ancha e irregular con grandes huecos entre células y membrana basal discontinua, en hígado, médula ósea y bazo. Los tamaños están exagerados y no guardan escala entre sí.'],
  orientation: ['cross-sections along the vessel axis, lumen at centre', 'cortes transversales a lo largo del eje, luz en el centro'], draw: capTypes,
});

// ---------------------------------------------------------------- 4 whole-body maps
function maps(S) {
  S.panel(30, 30, 690, 940, 'arteries'); S.panel(740, 30, 680, 940, 'veins');
  const cx1 = 375, cx2 = 1080, top = 70, sc = 1;
  S.at('arteries'); S.beginT(cx1, top, sc); skin(S); heartGhost(S); drawVessels(S, ART, A); S.endT();
  S.at('veins'); S.beginT(cx2, top, sc); skin(S); heartGhost(S); drawVessels(S, VEIN, V); S.endT();
  const P = (cx) => ([x, y]) => [cx + x, top + y];
  const pa = P(cx1), pv = P(cx2);
  [['ves-aorta', [26, 300]], ['ves-subclavian', [-55, 134]], ['ves-axillary', [-112, 168]], ['ves-brachial', [-142, 260]], ['ves-radial', [-176, 408]], ['ves-ulnar', [-154, 410]],
    ['ves-common-carotid', [-17, 112]], ['ves-internal-carotid', [-19, 72]], ['ves-external-carotid', [-8, 70]], ['ves-femoral', [-36, 580]], ['ves-popliteal', [-42, 700]],
    ['ves-anterior-tibial', [-47, 790]], ['ves-posterior-tibial', [-36, 790]]].forEach(([id, h]) => S.pin(id, id, pa(h)));
  S.at('veins');
  [['ves-brachiocephalic-vein', [-18, 134]], ['ves-subclavian-vein', [-60, 132]], ['ves-axillary-vein', [-112, 168]], ['ves-internal-jugular', [-24, 90]], ['ves-jugular', [-36, 100]],
    ['ves-cephalic', [-160, 268]], ['ves-median-cubital', [-158, 312]], ['ves-vein', [-38, 590]], ['ves-great-saphenous', [-26, 650]]].forEach(([id, h]) => S.pin(id, id, pv(h)));
}
plates.push({
  key: 'body-artery-vein-maps', moduleId: MOD, kind: 'gross-diagram', lessons: ['ves-regional', 'ves-central-branches', 'ves-venous-return', 'ves-large-arteries'], purpose: 'Whole-body maps of the major arteries and the major veins, left and right panels.',
  title: ['Major arteries and major veins of the body', 'Arterias y venas principales del cuerpo'],
  desc: ['Anterior view, patient right at viewer left. Left panel, arteries: the aorta arches over the heart and descends; the subclavian artery becomes the axillary then the brachial artery, which splits into radial (thumb side) and ulnar arteries; the common carotid divides into internal and external carotid arteries; the aorta ends by dividing into iliac arteries and the femoral artery continues behind the knee as the popliteal artery, dividing into anterior and posterior tibial arteries. Right panel, veins: deep veins follow the arteries (the femoral vein, generic vein here; axillary and subclavian veins; internal jugular) and superficial veins are drawn too: cephalic vein, median cubital vein at the elbow, great saphenous vein from foot to groin where it joins the femoral vein, external jugular vein. The superior and inferior venae cavae reach the right atrium. Simplified; branches omitted, left and right drawn symmetrical.',
    'Vista anterior, derecha del paciente a la izquierda. Panel izquierdo, arterias: la aorta forma un arco sobre el corazón y desciende; la arteria subclavia pasa a axilar y luego braquial, que se divide en radial (lado del pulgar) y cubital; la carótida común se divide en carótida interna y externa; la aorta termina dividiéndose en las arterias ilíacas y la arteria femoral continúa tras la rodilla como poplítea, que se divide en tibial anterior y posterior. Panel derecho, venas: las profundas acompañan a las arterias (la vena femoral, aquí vena genérica; venas axilar y subclavia; yugular interna) y se dibujan también las superficiales: vena cefálica, vena mediana del codo, safena magna del pie a la ingle donde desemboca en la femoral, y yugular externa. Las venas cavas superior e inferior llegan a la aurícula derecha. Simplificado; sin ramas menores y con ambos lados simétricos.'],
  orientation: ['anterior view of the whole body; patient right at viewer left', 'vista anterior de todo el cuerpo; derecha del paciente a la izquierda'], draw: maps,
});

// ---------------------------------------------------------------- 5 head and neck
function headNeck(S) {
  S.panel(30, 30, 1390, 940, 'neck');
  const sc = 4.2, tx = 725, ty = 40, T = ([x, y]) => [tx + sc * x, ty + sc * y];
  S.clipBoth(poly([[30, 30], [1420, 30], [1420, 970], [30, 970]]));
  S.beginT(tx, ty, sc);
  skin(S, { legs: false });
  S.sh(null, E(0, 52, 30, 40), { fill: '#EDE2D4', line: '#B7A593', sw: 0.4 });
  S.sh(null, sm([[-4, 104], [4, 104], [4, 128], [-4, 128]]), { fill: '#EDE2D4', line: '#B7A593', sw: 0.3 });
  drawVessels(S, VEIN, V, (d) => ['ves-internal-jugular', 'ves-jugular', 'ves-subclavian-vein', 'ves-brachiocephalic-vein'].includes(d.id));
  drawVessels(S, ART, A, (d) => ['ves-common-carotid', 'ves-internal-carotid', 'ves-external-carotid', 'ves-subclavian'].includes(d.id) || d.id === null && d.g === 'trunk');
  S.endT(); S.clipBothEnd();
  [['ves-common-carotid', [-17, 112]], ['ves-internal-carotid', [-19, 72]], ['ves-external-carotid', [-8, 70]], ['ves-internal-jugular', [-24, 90]], ['ves-jugular', [-36, 100]], ['ves-subclavian', [-55, 134]], ['ves-subclavian-vein', [-60, 132]]]
    .forEach(([id, h]) => S.pin(id, id, T(h)));
}
plates.push({
  key: 'head-neck-vessels', moduleId: MOD, kind: 'gross-diagram', lessons: ['ves-regional', 'ves-central-branches'], purpose: 'Carotid arteries and jugular veins of the neck, with the subclavian vessels at the root.',
  title: ['Carotid arteries and jugular veins of the head and neck', 'Arterias carótidas y venas yugulares de cabeza y cuello'],
  desc: ['Anterior view of the head, neck and upper chest, patient right at viewer left. The common carotid artery runs up the neck and splits at the upper border of the thyroid cartilage into the internal carotid artery (to the brain, no branches in the neck, drawn lateral) and the external carotid artery (to the face and scalp, with branches). Veins: the internal jugular vein runs beside the carotid in the deep neck and joins the subclavian vein to form the brachiocephalic vein; the external jugular vein is the superficial vein of the neck and drains into the subclavian vein. The subclavian artery (right, from the brachiocephalic trunk, unlabelled) and subclavian vein lie at the root of the neck above the first rib. Simplified; the left subclavian artery arises directly from the aortic arch.',
    'Vista anterior de cabeza, cuello y parte alta del tórax, derecha del paciente a la izquierda. La arteria carótida común sube por el cuello y se divide en el borde superior del cartílago tiroides en la carótida interna (al encéfalo, sin ramas en el cuello, dibujada lateral) y la carótida externa (a cara y cuero cabelludo, con ramas). Venas: la yugular interna discurre junto a la carótida en el cuello profundo y se une a la subclavia para formar la vena braquiocefálica; la yugular externa es la vena superficial del cuello y drena en la subclavia. La arteria subclavia (derecha, del tronco braquiocefálico, sin marcador) y la vena subclavia están en la base del cuello sobre la primera costilla. Simplificado; la subclavia izquierda nace directamente del arco aórtico.'],
  orientation: ['anterior view of head and neck; patient right at viewer left', 'vista anterior de cabeza y cuello; derecha del paciente a la izquierda'], draw: headNeck,
});
void tube;
