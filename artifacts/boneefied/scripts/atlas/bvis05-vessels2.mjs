// BVIS05 blood-vessel plates, part 2: regional routes (upper limb arteries and veins, lower limb, great saphenous), portal system, renal and celiac context.
import { C, sm, poly, E, A, V, vs, SK } from './bvis05-lib.mjs';
import { skin, ART, VEIN, drawVessels } from './bvis05-body.mjs';

const MOD = 'blood-vessels';
export const plates = [];
const rect = (x, y, w, h) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
const CAP = { fill: '#B592A0', line: '#76566A' };
const LIV = { fill: '#C9A08F', line: '#8A6455' };
const GLD = { fill: '#E2D5A4', line: '#9A8A4A' };
/** group transform with optional x mirror, applied to art and id-map; returns point mapper */
const grp = (S, tx, ty, sx, sy) => { const t = `<g transform="translate(${tx} ${ty}) scale(${sx} ${sy})">`; S.out.push(t); S.idm.push(t); return ([x, y]) => [tx + sx * x, ty + sy * y]; };
const gEnd = (S) => { S.out.push('</g>'); S.idm.push('</g>'); };
const crop = (S, x, y, w, h) => S.clipBoth(rect(x, y, w, h));

// ------------------------------------------------------------ upper arterial
function upperArt(S) {
  S.panel(30, 30, 1390, 940, 'upper');
  const T = grp(S, 725, 40, 1.9, 1.9); skin(S, { legs: false });
  drawVessels(S, ART, A, (d) => d.g !== 'leg'); gEnd(S);
  [['ves-aorta', [26, 300]], ['ves-common-carotid', [-17, 112]], ['ves-subclavian', [-55, 134]], ['ves-axillary', [-112, 168]], ['ves-brachial', [-142, 260]], ['ves-radial', [-176, 408]], ['ves-ulnar', [-154, 410]], ['ves-internal-carotid', [-19, 72]], ['ves-external-carotid', [-8, 70]]]
    .forEach(([id, h]) => S.pin(id, id, T(h)));
}
plates.push({
  key: 'upper-limb-arteries', moduleId: MOD, kind: 'gross-diagram', lessons: ['ves-regional', 'ves-central-branches'], purpose: 'Arterial route from the aortic arch to the hand, with the carotid branches.',
  title: ['Arterial route to the arm and hand', 'Ruta arterial hacia el brazo y la mano'],
  desc: ['Anterior view, patient right at viewer left, upper body. The subclavian artery (right from the brachiocephalic trunk, left straight from the aortic arch) crosses over the first rib and becomes the axillary artery in the armpit, then the brachial artery down the arm. At the elbow the brachial artery divides into the radial artery on the thumb side and the ulnar artery on the little-finger side; both continue to the hand (the palmar arches are omitted). The common carotid artery rises in the neck and splits into internal and external carotid arteries. Simplified; smaller branches not drawn.',
    'Vista anterior, derecha del paciente a la izquierda, parte superior del cuerpo. La arteria subclavia (la derecha del tronco braquiocefálico, la izquierda directa del arco aórtico) pasa sobre la primera costilla y se convierte en axilar en la axila y luego en braquial por el brazo. En el codo la braquial se divide en radial, del lado del pulgar, y cubital, del lado del meñique; ambas siguen hasta la mano (se omiten los arcos palmares). La carótida común sube por el cuello y se divide en carótidas interna y externa. Simplificado; sin ramas menores.'],
  orientation: ['anterior view of the upper body; patient right at viewer left', 'vista anterior de la parte superior del cuerpo; derecha del paciente a la izquierda'], draw: upperArt,
});

// ------------------------------------------------------------ upper superficial veins
function upperVein(S) {
  S.panel(30, 30, 900, 940, 'route'); S.panel(950, 30, 470, 940, 'elbow');
  S.at('route');
  crop(S, 30, 30, 900, 940);
  const T = grp(S, 480, 40, 1.9, 1.9); skin(S, { legs: false }); drawVessels(S, VEIN, V, (d) => d.g !== 'leg'); gEnd(S); S.clipBothEnd();
  [['ves-brachiocephalic-vein', [-18, 134]], ['ves-subclavian-vein', [-60, 132]], ['ves-axillary-vein', [-112, 168]], ['ves-internal-jugular', [-24, 90]], ['ves-jugular', [-36, 100]], ['ves-cephalic', [-160, 268]], ['ves-median-cubital', [-158, 312]]]
    .forEach(([id, h]) => S.pin(id, id, T(h)));
  S.at('elbow');
  crop(S, 950, 30, 470, 940);
  const T2 = grp(S, 1185 + 158 * 4.5, 500 - 310 * 4.5, 4.5, 4.5); skin(S, { legs: false }); drawVessels(S, VEIN, V, (d) => d.g === 'arm' && d.id !== 'ves-subclavian-vein', '@e'); gEnd(S); S.clipBothEnd();
  S.pin('ves-median-cubital', 'ves-median-cubital@e', T2([-158, 312]));
  S.pin('ves-cephalic', 'ves-cephalic@e', T2([-179, 365]));
}
plates.push({
  key: 'upper-limb-veins', moduleId: MOD, kind: 'gross-diagram', lessons: ['ves-venous-return', 'ves-regional'], purpose: 'Superficial and deep venous return from the arm, with the median cubital vein at the elbow.',
  title: ['Venous return from the arm and the median cubital vein', 'Retorno venoso del brazo y vena mediana del codo'],
  desc: ['Anterior view, patient right at viewer left. Superficial veins of the arm: the cephalic vein runs up the thumb side (lateral) and dips in under the collarbone to join the axillary vein; the basilic vein runs up the medial side (unlabelled) and joins the deep veins to form the axillary vein. At the elbow the median cubital vein links the cephalic and basilic veins obliquely, the usual site of venepuncture. The axillary vein continues as the subclavian vein, which meets the internal jugular vein to form the brachiocephalic vein; the external jugular vein (superficial) drains into the subclavian vein. Right panel: enlarged elbow region. Simplified; paired deep veins omitted.',
    'Vista anterior, derecha del paciente a la izquierda. Venas superficiales del brazo: la vena cefálica asciende por el lado del pulgar (lateral) y se hunde bajo la clavícula para unirse a la vena axilar; la vena basílica asciende por el lado medial (sin marcador) y se une a las venas profundas para formar la axilar. En el codo la vena mediana del codo une oblicuamente la cefálica y la basílica, lugar habitual de venopunción. La axilar continúa como vena subclavia, que se une a la yugular interna para formar la vena braquiocefálica; la yugular externa (superficial) drena en la subclavia. Panel derecho: región del codo ampliada. Simplificado; sin las venas profundas pareadas.'],
  orientation: ['anterior view, patient right at viewer left; right panel enlarges the right elbow', 'vista anterior, derecha del paciente a la izquierda; el panel derecho amplía el codo'], draw: upperVein,
});

// ------------------------------------------------------------ lower arterial (anterior + posterior)
function lowerArt(S) {
  S.panel(30, 30, 690, 940, 'anterior'); S.panel(740, 30, 680, 940, 'posterior');
  const ty = 60 - 410 * 1.8;
  S.at('anterior'); crop(S, 30, 30, 690, 940);
  const T = grp(S, 375, ty, 1.8, 1.8); skin(S); drawVessels(S, ART, A, (d) => d.g === 'leg' || d.id === 'ves-aorta'); gEnd(S); S.clipBothEnd();
  [['ves-aorta', [10, 430]], ['ves-femoral', [-36, 580]], ['ves-anterior-tibial', [-47, 790]]].forEach(([id, h]) => S.pin(id, id, T(h)));
  S.at('posterior'); crop(S, 740, 30, 680, 940);
  const T2 = grp(S, 1080, ty, -1.8, 1.8); skin(S);
  drawVessels(S, ART, A, (d) => ['ves-femoral', 'ves-popliteal', 'ves-posterior-tibial'].includes(d.id) || (d.id === null && d.g === 'leg')); gEnd(S); S.clipBothEnd();
  [['ves-femoral', [-37, 600]], ['ves-popliteal', [-42, 700]], ['ves-posterior-tibial', [-36, 790]]].forEach(([id, h]) => S.pin(id, id, T2(h)));
}
plates.push({
  key: 'lower-limb-arteries', moduleId: MOD, kind: 'gross-diagram', lessons: ['ves-regional', 'ves-large-arteries'], purpose: 'Arterial route down the lower limb: aorta, iliac, femoral, popliteal and tibial arteries, front and back.',
  title: ['Arterial route to the leg and foot', 'Ruta arterial hacia la pierna y el pie'],
  desc: ['Left panel, front view, patient right at viewer left: the aorta divides into the iliac arteries; the external iliac continues under the inguinal ligament as the femoral artery down the front-inner thigh. The femoral artery passes behind the knee as the popliteal artery, then divides into the anterior tibial artery (which passes forward through the interosseous membrane to run down the front of the leg to the foot) and the posterior tibial artery. Right panel, back view, patient right at viewer right: the popliteal artery lies deep in the popliteal fossa behind the knee and the posterior tibial artery runs down the back of the calf behind the medial ankle. Only the main trunk is drawn; the fibular branch and foot arches are omitted. The front view shows the popliteal course schematically.',
    'Panel izquierdo, vista anterior, derecha del paciente a la izquierda: la aorta se divide en las arterias ilíacas; la ilíaca externa continúa bajo el ligamento inguinal como arteria femoral por la cara anteromedial del muslo. La femoral pasa por detrás de la rodilla como poplítea y luego se divide en tibial anterior (que atraviesa hacia delante la membrana interósea y baja por la cara anterior de la pierna hasta el pie) y tibial posterior. Panel derecho, vista posterior, derecha del paciente a la derecha: la poplítea está profunda en la fosa poplítea tras la rodilla y la tibial posterior baja por la parte posterior de la pantorrilla, detrás del maléolo medial. Solo se dibuja el tronco principal; se omiten la rama fibular y los arcos del pie. La vista anterior muestra el trayecto poplíteo de forma esquemática.'],
  orientation: ['left: anterior view (patient right at viewer left); right: posterior view (patient right at viewer right)', 'izquierda: vista anterior (derecha del paciente a la izquierda); derecha: vista posterior (derecha del paciente a la derecha)'], draw: lowerArt,
});

// ------------------------------------------------------------ great saphenous
function saph(S) {
  S.panel(30, 30, 800, 940, 'leg'); S.panel(850, 30, 570, 940, 'groin');
  S.at('leg'); crop(S, 30, 30, 800, 940);
  const ty = 60 - 410 * 1.8;
  const T = grp(S, 430, ty, 1.8, 1.8); skin(S); drawVessels(S, VEIN, V, (d) => d.g === 'leg'); gEnd(S); S.clipBothEnd();
  S.pin('ves-great-saphenous', 'ves-great-saphenous', T([-26, 650]));
  S.pin('ves-vein', 'ves-vein', T([-39, 620]));
  // groin enlargement
  S.at('groin');
  S.sh(null, rect(870, 50, 530, 900), { fill: '#EFE3D6', line: '#EFE3D6', sw: 0.5 });
  S.ln(null, 'M870 250L1400 300', { color: '#9A8A6A', w: 20 }); S.ln(null, 'M870 250L1400 300', { color: '#D9CDB4', w: 14 });
  vs(S, 'ves-femoral@g', [[1010, 120], [1000, 500], [990, 900]], 90, 76, A);
  vs(S, 'ves-vein@g', [[1185, 120], [1168, 500], [1155, 900]], 110, 96, V);
  vs(S, 'ves-great-saphenous@g', [[1340, 900], [1330, 720], [1296, 570], [1240, 478], [1175, 432]], 54, 74, V);
  vs(S, 'ves-great-saphenous@g', [[1330, 560], [1296, 520], [1250, 490]], 22, 26, V);
  vs(S, 'ves-great-saphenous@g', [[1240, 660], [1260, 580], [1262, 515]], 20, 24, V);
  [[1010, 700, 90], [1170, 700, 90], [1320, 700, 90]].forEach(([x, y, a], i) => S.arrow(x, y, i === 0 ? a * -1 : -90, 18, '#F2EFE8'));
  S.pin('ves-femoral', 'ves-femoral@g', [1005, 640]);
  S.pin('ves-vein', 'ves-vein@g', [1168, 300]);
  S.pin('ves-great-saphenous', 'ves-great-saphenous@g', [1333, 780]);
}
plates.push({
  key: 'great-saphenous-route', moduleId: MOD, kind: 'gross-diagram', lessons: ['ves-venous-return', 'ves-regional'], purpose: 'The great saphenous vein from the foot to its junction with the femoral vein at the groin.',
  title: ['Great saphenous vein: foot to groin', 'Vena safena magna: del pie a la ingle'],
  desc: ['Left, front view of the leg, patient right at viewer left. The great saphenous vein, the longest superficial vein, starts on the inner (medial) side of the foot, passes in front of the medial ankle, runs up the medial leg, behind the medial knee and up the medial thigh, and does not stop at the knee: it ends in the groin by joining the femoral vein (the saphenofemoral junction). The deep vein it joins (femoral, then popliteal vein behind the knee) is shown as a generic vein; the femoral artery is the red vessel. Right, groin enlarged: below the inguinal ligament (pale band) the femoral artery lies lateral to the femoral vein (viewer left) and the great saphenous vein joins the femoral vein from the medial side. Flow is upward toward the heart. Simplified.',
    'Izquierda, vista anterior de la pierna, derecha del paciente a la izquierda. La vena safena magna, la vena superficial más larga, nace en el borde medial del pie, pasa por delante del maléolo medial, sube por la cara medial de la pierna, por detrás de la rodilla medial y por la cara medial del muslo, y no termina en la rodilla: acaba en la ingle al unirse a la vena femoral (unión safenofemoral). La vena profunda a la que se une (femoral, y poplítea tras la rodilla) se muestra como vena genérica; la arteria femoral es el vaso rojo. Derecha, ingle ampliada: bajo el ligamento inguinal (banda pálida) la arteria femoral queda lateral a la vena femoral (a la izquierda del observador) y la safena magna se une a la femoral por el lado medial. El flujo es ascendente hacia el corazón. Simplificado.'],
  orientation: ['anterior view of the right leg; patient right at viewer left; right panel enlarges the right groin', 'vista anterior de la pierna derecha; derecha del paciente a la izquierda; el panel derecho amplía la ingle'], draw: saph,
});

// ------------------------------------------------------------ hepatic portal
function portal(S) {
  S.panel(30, 30, 900, 940, 'portal'); S.panel(950, 30, 470, 940, 'lobule');
  S.at('portal');
  // context organs (unlabelled): liver at viewer left (patient right), spleen viewer right
  vs(S, null, [[600, 90], [596, 300], [594, 520], [590, 900]], 40, 40, V);
  S.sh(null, sm([[110, 330], [230, 250], [420, 230], [560, 270], [630, 350], [600, 450], [520, 540], [380, 580], [240, 540], [140, 450]]), { fill: LIV.fill, line: LIV.line, sw: 2 });
  S.sh(null, sm([[650, 300], [740, 255], [810, 295], [800, 380], [748, 428], [690, 400]]), { fill: '#E4CFC0', line: '#A8817C', sw: 1.6 });
  S.sh(null, sm([[835, 335], [893, 360], [897, 450], [855, 490], [826, 420]]), { fill: '#B79DB0', line: '#76566A', sw: 1.6 });
  S.sh(null, sm([[620, 470], [720, 492], [826, 452], [830, 478], [724, 520], [620, 500]]), { fill: GLD.fill, line: GLD.line, sw: 1.4 });
  S.ln(null, sm([[510, 620], [880, 620], [900, 780], [860, 880], [520, 880], [490, 740]], true, 8), { color: '#A8917C', w: 42 });
  S.ln(null, sm([[510, 620], [880, 620], [900, 780], [860, 880], [520, 880], [490, 740]], true, 8), { color: '#DCC8B2', w: 34 });
  S.sh(null, sm([[580, 670], [800, 670], [830, 760], [770, 830], [620, 830], [570, 760]]), { fill: '#E8D6C8', line: '#A8917C', sw: 1.2 });
  S.ln(null, sm([[600, 700], [770, 700], [780, 740], [620, 760], [760, 800]], false, 6), { color: '#C9B3A0', w: 5 });
  S.ln(null, 'M140 190Q380 120 640 170', { color: '#8A949B', w: 1.6, dash: '7 6' });
  // veins of the portal system
  vs(S, 'ves-splenic', [[855, 420], [800, 450], [740, 466], [700, 470]], 16, 20, V);
  vs(S, 'ves-mesenteric', [[880, 745], [880, 640], [830, 540], [790, 453]], 10, 12, V);
  vs(S, 'ves-mesenteric', [[690, 800], [690, 680], [696, 560], [700, 470]], 16, 20, V);
  [[610, 720], [650, 770], [740, 720]].forEach(([x, y]) => vs(S, 'ves-mesenteric', [[x, y], [(x + 692) / 2, y - 30], [692, y - 55]], 8, 10, V));
  vs(S, 'ves-hepatic-portal', [[700, 470], [640, 440], [580, 420], [520, 410]], 24, 22, V);
  [[[520, 410], [450, 380], [380, 350]], [[520, 410], [470, 455], [400, 490]], [[520, 410], [440, 425], [300, 430]]].forEach((p) => vs(S, 'ves-hepatic-portal', p, 12, 7, V));
  vs(S, 'ves-hepatic-vein', [[330, 390], [450, 320], [596, 255]], 16, 18, V);
  vs(S, 'ves-hepatic-vein', [[450, 460], [520, 360], [596, 262]], 14, 18, V);
  S.arrow(596, 140, -90, 16, '#F2EFE8');
  S.pin('ves-hepatic-portal', 'ves-hepatic-portal', [585, 424]);
  S.pin('ves-splenic', 'ves-splenic', [770, 460]);
  S.pin('ves-mesenteric', 'ves-mesenteric', [692, 600]);
  S.pin('ves-hepatic-vein', 'ves-hepatic-vein', [500, 336]);
  // lobule
  S.at('lobule');
  const hx = 1185, hy = 500, R = 270, hex = [0, 1, 2, 3, 4, 5].map((i) => [hx + R * Math.cos((i * Math.PI) / 3 + Math.PI / 6), hy + R * Math.sin((i * Math.PI) / 3 + Math.PI / 6)]);
  S.sh(null, poly(hex), { fill: LIV.fill, line: LIV.line, sw: 2 });
  hex.forEach(([x, y]) => {
    S.ln('ves-sinusoids', `M${x} ${y}Q${(x + hx) / 2 + (y - hy) * 0.12} ${(y + hy) / 2 - (x - hx) * 0.12} ${hx} ${hy}`, { color: CAP.line, w: 11 });
    S.ln(null, `M${x} ${y}Q${(x + hx) / 2 + (y - hy) * 0.12} ${(y + hy) / 2 - (x - hx) * 0.12} ${hx} ${hy}`, { color: CAP.fill, w: 7 });
  });
  hex.forEach(([x, y], i) => { const [x2, y2] = hex[(i + 1) % 6]; S.ln(null, `M${(x * 2 + hx) / 3} ${(y * 2 + hy) / 3}Q${(x + x2) / 2 * 0.62 + hx * 0.38} ${(y + y2) / 2 * 0.62 + hy * 0.38} ${(x2 * 2 + hx) / 3} ${(y2 * 2 + hy) / 3}`, { color: CAP.fill, w: 5 }); });
  hex.forEach(([x, y]) => { S.sh('triad', E(x, y, 30, 30), { fill: '#EFE3D6', line: LIV.line, sw: 1.4 }); S.sh('ves-hepatic-portal', E(x - 6, y + 4, 12, 12), { fill: V.fill, line: V.line, sw: 1.2 }); S.sh(null, E(x + 10, y - 8, 7, 7), { fill: A.fill, line: A.line, sw: 1 }); });
  S.sh('ves-hepatic-vein', E(hx, hy, 40, 40), { fill: V.fill, line: V.line, sw: 1.6 });
  S.pin('ves-sinusoids', 'ves-sinusoids', [(hex[1][0] + hx) / 2, (hex[1][1] + hy) / 2]);
  S.pin('ves-hepatic-vein', 'ves-hepatic-vein', [hx, hy]);
  S.pin('ves-hepatic-portal', 'ves-hepatic-portal', [hex[4][0] - 6, hex[4][1] + 4]);
}
plates.push({
  key: 'hepatic-portal-system', moduleId: MOD, kind: 'gross-diagram', lessons: ['ves-portal'], purpose: 'Portal tributaries (splenic and mesenteric veins), the hepatic portal vein, liver sinusoids and hepatic veins to the inferior vena cava.',
  title: ['Hepatic portal system', 'Sistema porta hepático'],
  desc: ['Anterior view, patient right at viewer left. Left panel: veins draining the gut and spleen do not go straight to the heart. The splenic vein (from the spleen, at viewer right) runs behind the pancreas and the superior mesenteric vein (from the small intestine) joins it behind the neck of the pancreas to form the hepatic portal vein; the inferior mesenteric vein is drawn joining the splenic vein. The portal vein enters the liver, which lies under the right dome of the diaphragm, at viewer left, and branches inside it. Blood leaves the liver by the hepatic veins into the inferior vena cava just below the diaphragm (dashed line). Right panel: one liver lobule, schematic. Blood from the portal vein and hepatic artery at each corner (portal triad) flows through sinusoids toward the central vein, which feeds a hepatic vein. Stomach, pancreas, spleen and bowel are unlabelled context.',
    'Vista anterior, derecha del paciente a la izquierda. Panel izquierdo: las venas que drenan el intestino y el bazo no van directas al corazón. La vena esplénica (desde el bazo, a la derecha del observador) pasa por detrás del páncreas y la vena mesentérica superior (del intestino delgado) se une a ella tras el cuello del páncreas para formar la vena porta hepática; se dibuja la mesentérica inferior uniéndose a la esplénica. La porta entra en el hígado, que queda bajo la cúpula diafragmática derecha, a la izquierda del observador, y se ramifica dentro. La sangre sale del hígado por las venas hepáticas hacia la vena cava inferior justo bajo el diafragma (línea discontinua). Panel derecho: un lobulillo hepático, esquemático. La sangre de la vena porta y la arteria hepática en cada vértice (tríada portal) fluye por sinusoides hacia la vena central, que alimenta una vena hepática. Estómago, páncreas, bazo e intestino son contexto sin marcador.'],
  orientation: ['anterior view; liver at viewer left (patient right), spleen at viewer right; right panel is a liver lobule', 'vista anterior; hígado a la izquierda del observador (derecha del paciente), bazo a la derecha; el panel derecho es un lobulillo hepático'], draw: portal,
});

// ------------------------------------------------------------ renal / celiac
function renal(S) {
  S.panel(30, 30, 1390, 940, 'abdomen');
  S.ln(null, 'M280 190Q500 90 720 80Q940 90 1160 190', { color: '#8A949B', w: 3, dash: '8 6' });
  S.sh(null, sm([[320, 225], [430, 180], [600, 205], [690, 290], [640, 400], [500, 430], [360, 375]]), { fill: LIV.fill, line: LIV.line, sw: 2 });
  S.sh(null, sm([[775, 235], [900, 218], [970, 290], [930, 400], [830, 400], [790, 330]]), { fill: '#E4CFC0', line: '#A8817C', sw: 1.6 });
  S.sh(null, sm([[1000, 260], [1070, 300], [1075, 400], [1030, 430], [990, 340]]), { fill: '#B79DB0', line: '#76566A', sw: 1.6 });
  // kidneys: left kidney (viewer right) sits a little higher than right (viewer left)
  const kd = (cx, cy, rot, hl) => { S.sh(null, E(cx, cy, 62, 108, rot), { fill: '#C9998F', line: '#8A5C54', sw: 2 }); S.sh(null, E(cx + hl, cy, 15, 28, rot), { fill: '#EFE6E2', line: '#8A5C54', sw: 1.2 }); };
  kd(535, 570, -8, 50); kd(915, 505, 8, -50);
  S.sh(null, poly([[535, 440], [590, 446], [575, 480], [525, 472]]), { fill: GLD.fill, line: GLD.line, sw: 1.4 });
  S.sh(null, poly([[870, 380], [830, 396], [842, 428], [884, 412]]), { fill: GLD.fill, line: GLD.line, sw: 1.4 });
  vs(S, 'ves-aorta', [[742, 120], [742, 300], [742, 500], [742, 640], [742, 860]], 42, 38, A);
  vs(S, null, [[742, 300], [700, 282], [620, 272], [560, 305]], 12, 9, A);
  vs(S, null, [[742, 300], [760, 262], [790, 238]], 10, 8, A);
  vs(S, null, [[742, 300], [820, 285], [920, 300], [1010, 322]], 12, 9, A);
  vs(S, 'ves-celiac-trunk', [[742, 352], [742, 296]], 20, 18, A);
  vs(S, null, [[742, 440], [762, 520], [790, 660]], 14, 10, A);
  vs(S, 'ves-renal-artery', [[742, 490], [690, 505], [620, 530], [582, 548]], 12, 10, A);
  vs(S, 'ves-renal-artery', [[742, 490], [800, 486], [850, 490], [872, 494]], 12, 10, A);
  vs(S, null, [[660, 150], [664, 300], [668, 500], [670, 860]], 54, 52, V);
  vs(S, null, [[592, 582], [630, 570], [668, 556]], 18, 20, V);
  vs(S, 'ves-vein', [[868, 535], [820, 542], [742, 546], [692, 550], [668, 552]], 18, 20, V);
  S.pin('ves-aorta', 'ves-aorta', [742, 740]);
  S.pin('ves-celiac-trunk', 'ves-celiac-trunk', [742, 326]);
  S.pin('ves-renal-artery', 'ves-renal-artery', [815, 487]);
  S.pin('ves-vein', 'ves-vein', [800, 543]);
}
plates.push({
  key: 'celiac-renal-context', moduleId: MOD, kind: 'gross-diagram', lessons: ['ves-central-branches', 'ves-regional'], purpose: 'Aortic branches in the abdomen: celiac trunk and renal arteries, with the renal veins and the inferior vena cava.',
  title: ['Celiac trunk and renal vessels', 'Tronco celíaco y vasos renales'],
  desc: ['Anterior view of the upper abdomen, patient right at viewer left; context organs unlabelled. The celiac trunk arises from the front of the abdominal aorta just below the diaphragm and divides into the hepatic artery (to the liver), left gastric artery (to the stomach) and splenic artery (to the spleen, at viewer right). The superior mesenteric artery arises just below it. The renal arteries leave the aorta lower, at the level of the kidneys; the right renal artery passes behind the inferior vena cava. The kidneys are retroperitoneal, the left slightly higher than the right (the right is pushed down by the liver); the adrenal glands sit on top of the kidneys. The renal veins drain into the inferior vena cava; the longer left renal vein crosses in front of the aorta. Simplified.',
    'Vista anterior del abdomen superior, derecha del paciente a la izquierda; los órganos de contexto no llevan marcador. El tronco celíaco nace de la cara anterior de la aorta abdominal justo bajo el diafragma y se divide en arteria hepática (al hígado), gástrica izquierda (al estómago) y esplénica (al bazo, a la derecha del observador). La arteria mesentérica superior nace justo debajo. Las arterias renales salen de la aorta más abajo, a la altura de los riñones; la renal derecha pasa por detrás de la vena cava inferior. Los riñones son retroperitoneales, el izquierdo algo más alto que el derecho (el derecho queda más bajo por el hígado); las glándulas suprarrenales descansan sobre los riñones. Las venas renales drenan en la vena cava inferior; la vena renal izquierda, más larga, cruza por delante de la aorta. Simplificado.'],
  orientation: ['anterior view; liver at viewer left, spleen at viewer right; left kidney higher', 'vista anterior; hígado a la izquierda del observador, bazo a la derecha; riñón izquierdo más alto'], draw: renal,
});
void C; void SK;
