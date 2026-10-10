// BVIS03 original uniform matte muscular atlas generator. Run: node scripts/atlas/muscular-generate.mjs
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Scene, W, H, bel, tn, pol, ell, T } from './muscular-lib.mjs';
import * as R from './muscular-regions.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outDir = join(root, 'assets/images/anatomy/muscular-atlas');
mkdirSync(outDir, { recursive: true });
const L = (...a) => new Set(a);
const A = -1, P = 1; // anterior views: patient right = viewer left; posterior: patient right = viewer right
const PAN = (S, x, y, w, h, name) => { S.panel = name; S.begin(x, y, w, h); };
const bothSides = (S, tx, ty, y0, s, fn, hideR, hideL, labelR, labelL, sgR) => {
  S.view(s, tx, ty, y0, -sgR); S.hide = new Set(hideL); S.label = new Set(labelL); fn(S);
  S.view(s, tx, ty, y0, sgR); S.hide = new Set(hideR); S.label = new Set(labelR); fn(S);
};
const SUP_ANT = ['ta', 'io', 'ic', 'pmin', 'vi', 'ag', 'ip', 'cb', 'br'];
const SUP_POST = ['mf', 'ql', 'es', 'supra', 'rmin', 'rmaj', 'ls', 'sm', 'am', 'pop', 'tp', 'sol'];
const antAll = (S) => { R.antBones(S); R.antThigh(S); R.antLeg(S); R.antTrunk(S); R.antArm(S); };
const postAll = (S) => { R.postBones(S); R.postBack(S); R.postHip(S); R.postCalf(S); R.postFore(S); };

export const plates = [];
const plate = (p) => plates.push(p);

plate({ key: 'overview', replaces: 'asset-openstax-muscle-labeled-overview', file: 'muscular-atlas-01-overview', purpose: 'Whole-body superficial orientation: anterior and posterior muscles.',
  title: ['Superficial muscles, anterior and posterior views', 'Músculos superficiales, vistas anterior y posterior'],
  desc: ['Whole-body superficial view. Left figure is anterior (patient right is viewer left); right figure is posterior (patient right is viewer right). Only superficial muscles are drawn; deep muscles are on regional plates. Pins are on the patient right limb.',
    'Vista superficial del cuerpo entero. La figura izquierda es anterior (derecha del paciente a la izquierda del observador); la derecha es posterior (derecha del paciente a la derecha del observador). Solo se dibujan músculos superficiales; los profundos están en láminas regionales. Los marcadores están en el lado derecho del paciente.'],
  orientation: 'left figure anterior, right figure posterior; superficial layer only', es_orientation: 'figura izquierda anterior, figura derecha posterior; solo capa superficial', lessons: ['muscle-orientation', 'muscle-actions'],
  draw(S) {
    S.panel = 'anterior'; bothSides(S, 380, 70, 55, 0.95, antAll, SUP_ANT, SUP_ANT, ['sternocleidomastoid', 'deltoid', 'pectoralis-major', 'biceps-brachii', 'rectus-abdominis', 'external-oblique', 'serratus-anterior', 'sartorius', 'rectus-femoris', 'vastus-lateralis', 'vastus-medialis', 'tibialis-anterior', 'tensor-fasciae-latae', 'adductor-longus', 'gracilis', 'fibularis-longus'], [], A);
    S.panel = 'posterior'; bothSides(S, 1070, 70, 55, 0.95, postAll, SUP_POST, SUP_POST, ['trapezius', 'latissimus-dorsi', 'triceps-brachii', 'infraspinatus', 'teres-major', 'teres-minor', 'gluteus-maximus', 'gluteus-medius', 'biceps-femoris', 'semitendinosus', 'gastrocnemius', 'deltoid'], [], P);
  } });

plate({ key: 'face-neck', replaces: 'asset-openstax-muscle-face-neck', file: 'muscular-atlas-02-face-neck', purpose: 'Muscles of facial expression, mastication and the lateral neck.',
  title: ['Face and neck muscles, right lateral view', 'Músculos de la cara y el cuello, vista lateral derecha'],
  desc: ['Right lateral view of head and neck, face toward the viewer\'s right. Rings of orbicularis oculi and oris, frontalis, temporalis and masseter, buccinator, platysma over the anterior neck, sternocleidomastoid, and scalenes deep in the posterior triangle.',
    'Vista lateral derecha de cabeza y cuello, con la cara hacia la derecha del observador. Anillos del orbicular de los ojos y de la boca, frontal, temporal y masetero, buccinador, platisma sobre el cuello anterior, esternocleidomastoideo y escalenos profundos en el triángulo posterior.'],
  orientation: 'right lateral view; face toward viewer right; platysma drawn over only the anterior half of the neck', es_orientation: 'vista lateral derecha; cara hacia la derecha del observador; el platisma cubre solo la mitad anterior del cuello', lessons: ['muscle-orientation', 'muscle-actions'],
  draw(S) {
    S.view(1.35, -255, -121, 0, 1); S.label = L('frontalis', 'temporalis', 'orbicularis-oculi', 'masseter', 'orbicularis-oris', 'buccinator', 'platysma', 'sternocleidomastoid', 'scalenes');
    S.b(bel([620, 430], [650, 800], 74, { fibers: 0, e: 0.3, min: 0.9 }));
    S.b(pol([[540, 190], [660, 120], [790, 140], [860, 200], [885, 280], [878, 350], [840, 400], [770, 415], [690, 400], [600, 380], [540, 320], [522, 250]]));
    S.b(pol([[848, 330], [905, 372], [916, 438], [860, 442], [828, 400]]));
    S.b(pol([[742, 380], [802, 382], [818, 470], [892, 504], [930, 490], [926, 524], [862, 534], [800, 522], [744, 470]]));
    S.draw(null, ell(686, 322, 17, 30), T.skin, '#9C8D84');
    S.m('temporalis', pol([[690, 208], [790, 232], [802, 300], [772, 346], [704, 350], [662, 296]], { fib: [[700, 230], [750, 300], [790, 338]], anchor: [736, 280] }), 'm2');
    S.b(bel([690, 806], [932, 770], 24, { fibers: 0, e: 0.3, min: 0.8 }));
    S.m('scalenes', bel([640, 520], [748, 742], 30, { bu: 0.5, fibers: 2 }), 'mdd');
    S.m('sternocleidomastoid', bel([680, 402], [816, 704], 44, { bu: 0.45, e: 0.6, bend: -0.04 }), 'm1', { anchor: [750, 556] });
    S.m('buccinator', pol([[822, 412], [884, 428], [902, 466], [872, 492], [828, 482]], { fib: [[830, 440], [880, 450]], anchor: [860, 452] }), 'md');
    S.m('masseter', pol([[736, 362], [802, 352], [826, 436], [802, 492], [748, 482], [734, 420]], { fib: [[760, 372], [776, 430], [772, 478]], anchor: [782, 420] }), 'm1');
    S.m('platysma', pol([[790, 522], [870, 530], [902, 604], [884, 704], [836, 772], [742, 782], [720, 706], [786, 640], [782, 560]], { fib: [[806, 540], [820, 640], [800, 740]], anchor: [840, 650] }), 'm3');
    S.m('frontalis', pol([[800, 160], [868, 192], [880, 244], [820, 240], [782, 202]], { fib: [[806, 180], [826, 236]], anchor: [836, 214] }), 'm3');
    S.draw('orbicularis-oculi', ell(846, 306, 50, 38), T.m3, '#7D5A53', { anchor: [846, 342], w: 1.4 });
    S.draw(null, ell(846, 306, 24, 17), T.skin, '#9C8D84');
    S.draw('orbicularis-oris', ell(914, 470, 38, 24), T.m3, '#7D5A53', { anchor: [914, 492] });
    S.draw(null, ell(914, 470, 17, 7), T.hole, '#9C8D84');
  } });

plate({ key: 'anterior-chest', replaces: 'asset-openstax-muscle-anterior-trunk', file: 'muscular-atlas-03-anterior-chest', purpose: 'Anterior chest wall: superficial layer on patient right, pectoralis major removed on patient left.',
  title: ['Anterior chest and shoulder muscles', 'Músculos del tórax anterior y del hombro'],
  desc: ['Anterior view. Patient right (viewer left): superficial pectoralis major, deltoid, serratus anterior, biceps, rectus abdominis and external oblique. Patient left (viewer right): pectoralis major and deltoid removed to expose pectoralis minor and the intercostal muscles between the ribs.',
    'Vista anterior. Derecha del paciente (izquierda del observador): pectoral mayor, deltoides, serrato anterior, bíceps, recto del abdomen y oblicuo externo superficiales. Izquierda del paciente (derecha del observador): pectoral mayor y deltoides retirados para exponer el pectoral menor y los músculos intercostales entre las costillas.'],
  orientation: 'anterior view; patient right = viewer left (superficial); patient left = viewer right (pectoralis major and deltoid removed)', es_orientation: 'vista anterior; derecha del paciente = izquierda del observador (superficial); izquierda del paciente = derecha del observador (pectoral mayor y deltoides retirados)', lessons: ['axial-muscles', 'shoulder-rotator-cuff', 'abdominal-wall'],
  draw(S) {
    const base = ['ta', 'io', 'ic', 'pmin', 'cb', 'br'];
    S.view(1.8, 725, 60, 135, -1); S.hide = new Set(); S.label = new Set();
    // patient left first (cutaway), then patient right on top
    S.view(1.8, 725, 60, 135, 1); S.hide = new Set(['pmaj', 'del', 'ta', 'io', 'cb', 'br', 'eo']); S.label = L('pectoralis-minor', 'intercostals'); S.panel = 'patient-left-deep'; antAll(S);
    S.view(1.8, 725, 60, 135, -1); S.hide = new Set(base); S.label = L('deltoid', 'pectoralis-major', 'serratus-anterior', 'biceps-brachii', 'rectus-abdominis', 'external-oblique', 'sternocleidomastoid'); S.panel = 'patient-right-superficial'; antAll(S);
  } });

plate({ key: 'superficial-back', replaces: 'asset-openstax-muscle-posterior-back', file: 'muscular-atlas-04-superficial-back', purpose: 'Superficial posterior shoulder girdle and back layer.',
  title: ['Superficial back and scapular muscles', 'Músculos superficiales de la espalda y de la región escapular'],
  desc: ['Posterior view, superficial layer only. Trapezius forms the upper diamond, latissimus dorsi the broad lower sheet; infraspinatus, teres minor and teres major lie on the scapula under the deltoid. Rhomboids, levator scapulae and erector spinae are deep and appear on the deep-back plate.',
    'Vista posterior, solo capa superficial. El trapecio forma el rombo superior y el dorsal ancho la lámina inferior amplia; infraespinoso, redondo menor y redondo mayor están sobre la escápula bajo el deltoides. Romboides, elevador de la escápula y erector de la columna son profundos y aparecen en la lámina de espalda profunda.'],
  orientation: 'posterior view; patient right = viewer right; superficial layer only', es_orientation: 'vista posterior; derecha del paciente = derecha del observador; solo capa superficial', lessons: ['axial-muscles', 'shoulder-rotator-cuff', 'arm-forearm'],
  draw(S) {
    bothSides(S, 725, 40, 60, 1.5, (X) => { R.postBones(X); R.postBack(X); }, SUP_POST, SUP_POST, ['trapezius', 'latissimus-dorsi', 'deltoid', 'infraspinatus', 'teres-minor', 'teres-major', 'triceps-brachii'], [], P);
  } });

plate({ key: 'deep-back', replaces: null, file: 'muscular-atlas-05-deep-back', purpose: 'Deep back layer: trapezius, latissimus dorsi and deltoid removed; erector spinae removed on patient left.',
  title: ['Deep back muscles (trapezius and latissimus dorsi removed)', 'Músculos profundos de la espalda (trapecio y dorsal ancho retirados)'],
  desc: ['Explicit deep dissection, posterior view. Trapezius, latissimus dorsi and deltoid are removed on both sides. Patient right (viewer right): rhomboid minor and major, levator scapulae, supraspinatus and the intact erector spinae column. Patient left (viewer left): erector spinae also removed to expose multifidus beside the spinous processes and quadratus lumborum in the lumbar region.',
    'Disección profunda explícita, vista posterior. Trapecio, dorsal ancho y deltoides están retirados en ambos lados. Derecha del paciente (derecha del observador): romboides menor y mayor, elevador de la escápula, supraespinoso y la columna intacta del erector de la columna. Izquierda del paciente (izquierda del observador): también se retira el erector para exponer el multífido junto a las apófisis espinosas y el cuadrado lumbar en la región lumbar.'],
  orientation: 'posterior view, deep dissection; patient right = viewer right', es_orientation: 'vista posterior, disección profunda; derecha del paciente = derecha del observador', lessons: ['axial-muscles', 'abdominal-wall'],
  draw(S) {
    bothSides(S, 725, 40, 60, 1.5, (X) => { R.postBones(X); R.postBack(X); }, ['trap', 'lat', 'del', 'mf', 'ql'], ['trap', 'lat', 'del', 'es'], ['rhomboid-minor', 'rhomboid-major', 'levator-scapulae', 'erector-spinae', 'supraspinatus'], ['multifidus', 'quadratus-lumborum'], P);
  } });

plate({ key: 'anterior-arm', replaces: 'asset-openstax-muscle-anterior-arm', file: 'muscular-atlas-06-anterior-arm', purpose: 'Anterior arm: superficial biceps compartment and the deeper layer beneath it.',
  title: ['Anterior arm: superficial and deep layers', 'Brazo anterior: capas superficial y profunda'],
  desc: ['Right arm, anterior view. Left panel: deltoid, biceps brachii and the superficial anterior forearm (pronator teres, flexor carpi radialis). Right panel: biceps and deltoid removed to expose coracobrachialis and brachialis, which lies deep to biceps.',
    'Brazo derecho, vista anterior. Panel izquierdo: deltoides, bíceps braquial y antebrazo anterior superficial (pronador redondo, flexor radial del carpo). Panel derecho: bíceps y deltoides retirados para exponer el coracobraquial y el braquial, que queda profundo al bíceps.'],
  orientation: 'right arm, anterior view; patient right = viewer left; left panel superficial, right panel deep', es_orientation: 'brazo derecho, vista anterior; derecha del paciente = izquierda del observador; panel izquierdo superficial, derecho profundo', lessons: ['arm-forearm', 'muscle-actions'],
  draw(S) {
    PAN(S, 40, 40, 660, 920, 'superficial'); S.armOnly = true; S.view(2.5, 745, 60, 205, -1); S.hide = new Set(['cb', 'br']); S.label = L('deltoid', 'biceps-brachii', 'pronator-teres', 'flexor-carpi-radialis'); R.antBones(S); R.antArm(S); S.end();
    PAN(S, 750, 40, 660, 920, 'deep'); S.armOnly = true; S.view(2.5, 1455, 60, 205, -1); S.hide = new Set(['bi', 'del']); S.label = L('coracobrachialis', 'brachialis'); R.antBones(S); R.antArm(S); S.end();
  } });

plate({ key: 'posterior-arm', replaces: null, file: 'muscular-atlas-07-posterior-arm', purpose: 'Posterior arm and elbow: triceps brachii and anconeus.',
  title: ['Posterior arm and elbow', 'Brazo posterior y codo'],
  desc: ['Right arm, posterior view. Left panel: deltoid and the long and lateral heads of triceps brachii converging on one tendon at the olecranon. Right panel: enlarged elbow showing the triceps tendon and the small triangular anconeus.',
    'Brazo derecho, vista posterior. Panel izquierdo: deltoides y las cabezas larga y lateral del tríceps braquial convergiendo en un tendón en el olécranon. Panel derecho: codo ampliado con el tendón del tríceps y el pequeño ancóneo triangular.'],
  orientation: 'right arm, posterior view; patient right = viewer right; right panel is an enlarged elbow inset', es_orientation: 'brazo derecho, vista posterior; derecha del paciente = derecha del observador; el panel derecho es un recuadro ampliado del codo', lessons: ['arm-forearm'],
  draw(S) {
    PAN(S, 40, 40, 660, 920, 'arm'); S.armOnly = true; S.view(2.5, 70, 60, 210, P); S.hide = new Set(SUP_POST.concat(['trap', 'lat', 'es', 'ext', 'sup', 'anc', 'infra'])); S.label = L('deltoid', 'triceps-brachii', 'teres-major'); R.postBones(S); R.postBack(S); R.postFore(S); S.end();
    PAN(S, 750, 40, 660, 920, 'elbow'); S.view(5.5, 197, 100, 395, P); S.hide = new Set(['ext']); S.label = L('anconeus'); R.postBones(S); R.postBack(S); R.postFore(S); S.end();
  } });

plate({ key: 'forearm', replaces: null, file: 'muscular-atlas-08-forearm', purpose: 'Forearm flexor/anterior and extensor/posterior orientation plus the deep supinator.',
  title: ['Forearm: anterior and posterior views', 'Antebrazo: vistas anterior y posterior'],
  desc: ['Right forearm in two panels. Left: anterior (flexor) compartment with pronator teres and flexor carpi radialis. Right: posterior (extensor) compartment with extensor carpi radialis and anconeus; the superficial extensors are cut away proximally so the deeper supinator is visible beside the upper radius.',
    'Antebrazo derecho en dos paneles. Izquierda: compartimento anterior (flexor) con pronador redondo y flexor radial del carpo. Derecha: compartimento posterior (extensor) con extensor radial del carpo y ancóneo; los extensores superficiales están cortados proximalmente para mostrar el supinador, más profundo, junto al radio superior.'],
  orientation: 'right forearm; left panel anterior (patient right = viewer left); right panel posterior (patient right = viewer right) with extensors cut proximally to show supinator', es_orientation: 'antebrazo derecho; panel izquierdo anterior; panel derecho posterior con extensores cortados proximalmente para mostrar el supinador', lessons: ['arm-forearm'],
  draw(S) {
    S.armOnly = true;
    PAN(S, 30, 40, 670, 920, 'anterior'); S.view(4.4, 1091, 100, 395, A); S.hide = new Set(SUP_ANT); S.label = L('pronator-teres', 'flexor-carpi-radialis'); R.antBones(S); R.antArm(S); S.end();
    PAN(S, 750, 40, 670, 920, 'posterior'); S.view(4.4, 346, 100, 395, P); S.hide = new Set(['cut']); S.label = L('extensor-carpi-radialis', 'anconeus', 'supinator'); R.postBones(S); R.postFore(S); S.end();
  } });

plate({ key: 'abdominal-wall', replaces: null, file: 'muscular-atlas-09-abdominal-wall', purpose: 'Anterolateral abdominal wall in three progressive layers.',
  title: ['Abdominal wall layers', 'Capas de la pared abdominal'],
  desc: ['Anterior view in three panels, superficial to deep. Left: external oblique (fibres run inferomedially) beside rectus abdominis. Middle: external oblique removed to show internal oblique (fibres superomedial). Right: both obliques and the rectus removed to show transversus abdominis with horizontal fibres.',
    'Vista anterior en tres paneles, de superficial a profundo. Izquierda: oblicuo externo (fibras inferomediales) junto al recto del abdomen. Centro: oblicuo externo retirado para mostrar el oblicuo interno (fibras superomediales). Derecha: ambos oblicuos y el recto retirados para mostrar el transverso del abdomen con fibras horizontales.'],
  orientation: 'anterior view; patient right = viewer left; panels run superficial (left) to deep (right)', es_orientation: 'vista anterior; derecha del paciente = izquierda del observador; los paneles van de superficial (izquierda) a profundo (derecha)', lessons: ['abdominal-wall'],
  draw(S) {
    const base = ['pmaj', 'pmin', 'neck', 'ic', 'ser', 'cb', 'br', 'del'];
    const panels = [[20, 250, ['ta', 'io'], [], ['external-oblique', 'rectus-abdominis'], 'external'], [495, 725, ['eo', 'ta'], [], ['internal-oblique'], 'internal'], [970, 1200, ['eo', 'io', 'rect'], [], ['transversus-abdominis'], 'transversus']];
    for (const [x, cx, hide, , lab, name] of panels) {
      PAN(S, x, 40, 460, 920, name);
      S.view(1.95, cx, 120, 290, -1); S.hide = new Set([...base, ...hide]); S.label = new Set(lab); R.antBones(S); R.antTrunk(S);
      S.view(1.95, cx, 120, 290, 1); S.hide = new Set([...base, ...hide]); S.label = new Set(); R.antBones(S); R.antTrunk(S);
      S.end();
    }
  } });

plate({ key: 'gluteal', replaces: null, file: 'muscular-atlas-10-gluteal', purpose: 'Gluteal region: surface layer and gluteus maximus removed.',
  title: ['Gluteal region: surface and cutaway', 'Región glútea: superficie y corte'],
  desc: ['Right gluteal region, posterior view. Left panel: gluteus maximus covers most of the buttock. Right panel: gluteus maximus removed, fully exposing gluteus medius on the lateral ilium.',
    'Región glútea derecha, vista posterior. Panel izquierdo: el glúteo mayor cubre la mayor parte de la nalga. Panel derecho: glúteo mayor retirado, con el glúteo medio completamente expuesto sobre el ilion lateral.'],
  orientation: 'posterior view of right buttock; midline at panel left edge; patient right = viewer right; right panel is a cutaway', es_orientation: 'vista posterior de la nalga derecha; línea media en el borde izquierdo del panel; derecha del paciente = derecha del observador; el panel derecho es un corte', lessons: ['hip-thigh'],
  draw(S) {
    PAN(S, 30, 40, 660, 920, 'surface'); S.view(3.2, 110, 70, 455, P); S.hide = new Set(['sm', 'am', 'sol', 'pop', 'tp', 'gast', 'ct']); S.label = L('gluteus-maximus'); R.postBones(S); R.postHip(S); S.end();
    PAN(S, 720, 40, 690, 920, 'cutaway'); S.view(3.2, 800, 70, 455, P); S.hide = new Set(['gmax', 'sm', 'am', 'sol', 'pop', 'tp', 'gast', 'ct']); S.label = L('gluteus-medius'); R.postBones(S); R.postHip(S); S.end();
  } });

plate({ key: 'anterior-thigh', replaces: 'asset-openstax-muscle-anterior-leg', file: 'muscular-atlas-11-anterior-thigh', purpose: 'Superficial anterior and medial thigh, including all quadriceps members visible on the surface.',
  title: ['Anterior thigh: superficial layer', 'Muslo anterior: capa superficial'],
  desc: ['Anterior view of both thighs. Sartorius runs from the ASIS (lateral) obliquely to the medial proximal tibia. Quadriceps: rectus femoris centrally, vastus lateralis laterally, vastus medialis medially; the fourth member, vastus intermedius, is deep to rectus femoris and appears on the deep-thigh plate. Tensor fasciae latae, iliopsoas, adductor longus and gracilis are labelled.',
    'Vista anterior de ambos muslos. El sartorio va desde la EIAS (lateral) en diagonal hasta la tibia proximal medial. Cuádriceps: recto femoral en el centro, vasto lateral por fuera y vasto medial por dentro; el cuarto miembro, el vasto intermedio, es profundo al recto femoral y aparece en la lámina del muslo profundo. Se rotulan tensor de la fascia lata, iliopsoas, aductor largo y grácil.'],
  orientation: 'anterior view; patient right = viewer left; superficial layer', es_orientation: 'vista anterior; derecha del paciente = izquierda del observador; capa superficial', lessons: ['hip-thigh', 'leg-and-ankle'],
  draw(S) {
    bothSides(S, 725, 50, 490, 2.9, (X) => { R.antBones(X); R.antThigh(X); }, ['vi', 'ag'], ['vi', 'ag'], ['sartorius', 'rectus-femoris', 'vastus-lateralis', 'vastus-medialis', 'tensor-fasciae-latae', 'adductor-longus', 'gracilis', 'iliopsoas'], [], A);
  } });

plate({ key: 'deep-thigh', replaces: null, file: 'muscular-atlas-12-deep-thigh', purpose: 'Deep thigh: vastus intermedius, articularis genus, and semimembranosus.',
  title: ['Deep thigh: anterior and posterior cutaways', 'Muslo profundo: cortes anterior y posterior'],
  desc: ['Right thigh in two explicit cutaways. Left, anterior: sartorius and rectus femoris removed to expose vastus intermedius, with articularis genus at the knee. Right, posterior: gluteus maximus, biceps femoris and semitendinosus removed to expose semimembranosus, the deepest hamstring.',
    'Muslo derecho en dos cortes explícitos. Izquierda, anterior: sartorio y recto femoral retirados para exponer el vasto intermedio, con el articular de la rodilla. Derecha, posterior: glúteo mayor, bíceps femoral y semitendinoso retirados para exponer el semimembranoso, el isquiotibial más profundo.'],
  orientation: 'left panel anterior (patient right = viewer left), right panel posterior (patient right = viewer right); both are deep cutaways', es_orientation: 'panel izquierdo anterior; panel derecho posterior; ambos son cortes profundos', lessons: ['hip-thigh'],
  draw(S) {
    PAN(S, 30, 30, 660, 940, 'anterior-deep'); S.view(2.7, 528, 50, 490, A); S.hide = new Set(['sar', 'rf', 'vl', 'vm', 'tfl']); S.label = L('vastus-intermedius', 'articularis-genus'); R.antBones(S); R.antThigh(S); S.end();
    PAN(S, 740, 30, 680, 940, 'posterior-deep'); S.view(2.7, 922, 50, 480, P); S.hide = new Set(['gmax', 'gmed', 'bf', 'st', 'sol', 'pop', 'tp', 'gast', 'ct']); S.label = L('semimembranosus'); R.postBones(S); R.postHip(S); S.end();
  } });

plate({ key: 'posterior-leg', replaces: 'asset-openstax-muscle-posterior-leg', file: 'muscular-atlas-13-posterior-leg-overview', purpose: 'Contextual posterior lower-limb overview from gluteal region to heel.',
  title: ['Posterior lower limb: contextual overview', 'Miembro inferior posterior: panorama contextual'],
  desc: ['Posterior view of both lower limbs. Gluteus maximus overlies gluteus medius, which is only partly exposed above it; biceps femoris is lateral and semitendinosus medial in the posterior thigh; gastrocnemius forms the calf surface. Deep muscles (semimembranosus, soleus) are not shown here and have their own cutaway plates.',
    'Vista posterior de ambos miembros inferiores. El glúteo mayor cubre al glúteo medio, que solo se expone en parte por encima; el bíceps femoral es lateral y el semitendinoso medial en el muslo posterior; el gastrocnemio forma la superficie de la pantorrilla. Los músculos profundos (semimembranoso, sóleo) no se muestran aquí y tienen sus propias láminas de corte.'],
  orientation: 'posterior view; patient right = viewer right; superficial layer only', es_orientation: 'vista posterior; derecha del paciente = derecha del observador; solo capa superficial', lessons: ['hip-thigh', 'leg-and-ankle'],
  draw(S) {
    bothSides(S, 725, 40, 470, 1.85, (X) => { R.postBones(X); R.postHip(X); R.postCalf(X); }, SUP_POST, SUP_POST, ['gluteus-medius', 'gluteus-maximus', 'biceps-femoris', 'semitendinosus', 'gastrocnemius'], [], P);
  } });

plate({ key: 'anterior-leg', replaces: null, file: 'muscular-atlas-14-anterior-lateral-leg', purpose: 'Anterior and lateral leg compartments.',
  title: ['Anterior and lateral leg', 'Pierna anterior y lateral'],
  desc: ['Right leg and dorsal foot, anterior view. Tibialis anterior lies against the lateral tibial surface and sends its tendon to the medial foot; fibularis longus occupies the lateral compartment at the viewer\'s left, its tendon passing behind the lateral malleolus.',
    'Pierna derecha y dorso del pie, vista anterior. El tibial anterior se apoya en la cara lateral de la tibia y envía su tendón al pie medial; el fibular largo ocupa el compartimento lateral, a la izquierda del observador, con su tendón detrás del maléolo lateral.'],
  orientation: 'right leg, anterior view; patient right = viewer left; lateral = viewer left', es_orientation: 'pierna derecha, vista anterior; derecha del paciente = izquierda del observador; lateral = izquierda del observador', lessons: ['leg-and-ankle'],
  draw(S) {
    S.view(4, 985, 40, 740, A); S.hide = new Set(); S.label = L('tibialis-anterior', 'fibularis-longus'); R.antBones(S); R.antLeg(S);
  } });

plate({ key: 'calf', replaces: null, file: 'muscular-atlas-15-calf', purpose: 'Calf surface and cutaway: gastrocnemius over soleus, with deep popliteus and tibialis posterior.',
  title: ['Calf: surface and cutaway', 'Pantorrilla: superficie y corte'],
  desc: ['Right calf, posterior view. Left panel: gastrocnemius (two heads) and the calcaneal tendon. Right panel: gastrocnemius removed to show soleus lying deep to it, with popliteus behind the knee and tibialis posterior deeper still along the medial border.',
    'Pantorrilla derecha, vista posterior. Panel izquierdo: gastrocnemio (dos cabezas) y tendón calcáneo. Panel derecho: gastrocnemio retirado para mostrar el sóleo, profundo a él, con el poplíteo detrás de la rodilla y el tibial posterior aún más profundo en el borde medial.'],
  orientation: 'right calf, posterior view; patient right = viewer right; right panel is a cutaway', es_orientation: 'pantorrilla derecha, vista posterior; derecha del paciente = derecha del observador; el panel derecho es un corte', lessons: ['leg-and-ankle'],
  draw(S) {
    PAN(S, 30, 30, 680, 940, 'surface'); S.view(4.1, 146 + 20, 50, 738, P); S.hide = new Set(['sol', 'pop', 'tp']); S.label = L('gastrocnemius'); R.postBones(S); R.postCalf(S); S.end();
    PAN(S, 740, 30, 680, 940, 'cutaway'); S.view(4.1, 796 + 20, 50, 738, P); S.hide = new Set(['gast']); S.label = L('soleus', 'popliteus', 'tibialis-posterior'); R.postBones(S); R.postCalf(S); S.end();
  } });

// rotator cuff (custom geometry): x in posterior-view coordinates; anterior panel is a mirror of the same scapula.
const scap = [[845, 270], [1010, 255], [1130, 290], [1180, 350], [1170, 420], [1130, 480], [1060, 600], [1000, 720], [900, 745], [850, 680], [835, 430]];
// rotator cuff (custom geometry): x in posterior-view coordinates; anterior panel is a mirror of the same scapula.
const shoulderBase = (S, ant) => {
  S.b(pol(scap));
  S.b(bel([1195, 405], [1262, 840], 70, { fibers: 0, e: 0.25, min: 0.85 }));
  S.b(pol([[1212, 336], [1258, 338], [1282, 380], [1284, 444], [1250, 458], [1214, 420]]));
  S.b(ell(1190, 402, 56, 60));
  S.b(pol([[1100, 296], [1195, 306], [1214, 342], [1150, 348]]));
  if (ant) { S.b(pol([[1196, 372], [1236, 376], [1244, 436], [1212, 446], [1192, 420]])); S.b(bel([1070, 305], [1160, 346], 30, { fibers: 0, e: 0.3, min: 0.8 })); }
};
plate({ key: 'rotator-cuff', replaces: 'asset-injurymap-rotator-cuff-labeled', file: 'muscular-atlas-16-rotator-cuff', purpose: 'Rotator cuff (SITS) with teres major shown as a non-cuff neighbour.',
  title: ['Rotator cuff: anterior and posterior views', 'Manguito rotador: vistas anterior y posterior'],
  desc: ['Right shoulder, deltoid removed. Left panel anterior: subscapularis fills the front of the scapula and inserts on the lesser tubercle. Right panel posterior: supraspinatus above the scapular spine, infraspinatus below it, teres minor along the lateral inferior border. Each cuff muscle runs into a tendon that attaches to the humerus: supraspinatus, infraspinatus and teres minor to the greater tubercle, subscapularis to the lesser tubercle. Teres major (greyer tone) runs from the inferior scapular angle to the proximal medial humeral shaft and is NOT a rotator cuff muscle.',
    'Hombro derecho, deltoides retirado. Panel izquierdo anterior: el subescapular llena la cara anterior de la escápula y se inserta en el tubérculo menor. Panel derecho posterior: supraespinoso sobre la espina de la escápula, infraespinoso bajo ella y redondo menor en el borde lateral inferior. Cada músculo del manguito pasa a un tendón que se inserta en el húmero: supraespinoso, infraespinoso y redondo menor en el tubérculo mayor, subescapular en el tubérculo menor. El redondo mayor (tono más gris) va del ángulo inferior de la escápula a la parte medial proximal de la diáfisis del húmero y NO es un músculo del manguito rotador.'],
  orientation: 'right shoulder; left panel anterior (patient right = viewer left); right panel posterior (patient right = viewer right); deltoid removed', es_orientation: 'hombro derecho; panel izquierdo anterior; panel derecho posterior; deltoides retirado', lessons: ['shoulder-rotator-cuff'],
  draw(S) {
    PAN(S, 30, 40, 660, 920, 'anterior'); S.view(1, 1350 - 20, 0, 0, -1); S.label = L('subscapularis'); S.hide = new Set(); shoulderBase(S, true);
    S.m('subscapularis', pol([[858, 300], [1000, 282], [1080, 320], [1128, 386], [1132, 428], [1086, 470], [1000, 600], [905, 702], [852, 652], [840, 450]], { fib: [[868, 330], [1000, 330], [1126, 398]], anchor: [980, 450] }), 'm2');
    S.t(tn([1104, 392], [1214, 408], 40)); S.end();
    PAN(S, 740, 40, 680, 920, 'posterior'); S.view(1, 30, 0, 0, 1); S.label = L('supraspinatus', 'infraspinatus', 'teres-minor', 'teres-major'); shoulderBase(S, false);
    S.m('teres-major', bel([910, 712], [1182, 570], 48, { bu: 0.55, e: 0.6 }), 'grey');
    S.m('infraspinatus', pol([[860, 402], [1010, 362], [1130, 356], [1146, 392], [1132, 424], [1088, 484], [1008, 540], [880, 650], [852, 612]], { fib: [[880, 440], [1000, 420], [1130, 396]], anchor: [990, 470] }), 'm1');
    S.m('teres-minor', bel([1062, 572], [1210, 440], 38, { bu: 0.5, bend: 0.02 }), 'm3');
    S.m('supraspinatus', pol([[850, 285], [1010, 265], [1100, 296], [1140, 318], [1138, 340], [1020, 347], [855, 377]], { fib: [[870, 320], [1000, 305], [1120, 322]], anchor: [945, 318] }), 'm2');
    S.b(bel([845, 386], [1180, 332], 24, { fibers: 0, e: 0.3, min: 0.85 }));
    S.t(tn([1110, 322], [1252, 350], 28)); S.b(pol([[1100, 292], [1195, 300], [1222, 344], [1210, 352], [1150, 352], [1096, 318]])); S.t(tn([1124, 392], [1268, 388], 30)); S.t(tn([1196, 446], [1268, 426], 24)); S.t(tn([1170, 574], [1196, 584], 18)); S.end();
  } });

plate({ key: 'diaphragm', replaces: 'asset-openstax-diaphragm-labeled', file: 'muscular-atlas-17-diaphragm', purpose: 'Diaphragm as a domed thoracoabdominal boundary.',
  title: ['Diaphragm: domes and inferior view', 'Diafragma: cúpulas y vista inferior'],
  desc: ['Left panel: anterior coronal cutaway of the thorax. The diaphragm is a dome-shaped muscle sheet arching up into the chest beneath the lungs, with the right dome higher than the left; its muscular periphery attaches to the lower ribs and the pale central tendon forms the apex. Right panel: inferior view showing the central tendon, caval and esophageal openings, aortic opening between the crura, and the muscular periphery.',
    'Panel izquierdo: corte coronal anterior del tórax. El diafragma es una lámina muscular en forma de cúpula que se arquea hacia el tórax bajo los pulmones, con la cúpula derecha más alta que la izquierda; su periferia muscular se une a las costillas inferiores y el tendón central pálido forma el vértice. Panel derecho: vista inferior con el tendón central, los orificios de la vena cava y del esófago, el hiato aórtico entre los pilares y la periferia muscular.'],
  orientation: 'left panel anterior coronal cutaway, patient right = viewer left; right panel inferior view (tendon pale, muscle periphery darker)', es_orientation: 'panel izquierdo corte coronal anterior, derecha del paciente = izquierda del observador; panel derecho vista inferior', lessons: ['axial-muscles', 'muscle-actions'],
  draw(S) {
    S.view(1, 0, 0, 0, 1); S.label = L('diaphragm'); S.hide = new Set();
    PAN(S, 30, 40, 680, 920, 'coronal');
    S.draw(null, pol([[108, 300], [200, 236], [330, 280], [366, 470], [240, 500], [110, 640]]), T.lung, '#6C8A94');
    S.draw(null, pol([[632, 300], [540, 236], [410, 280], [374, 500], [500, 530], [630, 640]]), T.lung, '#6C8A94');
    for (let k = 0; k < 6; k++) { S.b(bel([360, 230 + k * 62], [86, 300 + k * 62], 11, { fibers: 0, e: 0.3, min: 0.8, bend: -0.1 })); S.b(bel([380, 230 + k * 62], [654, 300 + k * 62], 11, { fibers: 0, e: 0.3, min: 0.8, bend: 0.1 })); }
    S.m(null, bel([654, 660], [378, 548], 46, { e: 0.2, min: 0.9, bend: 0.3, fibers: 0 }), 'm2');
    S.t(bel([654, 660], [378, 548], 48, { e: 0.2, min: 0.95, bend: 0.3, fibers: 0, t0: 0.62, t1: 1 }));
    S.m('diaphragm', bel([84, 668], [366, 516], 46, { e: 0.2, min: 0.9, bend: -0.34, fibers: 0, at: 0.2 }), 'm1');
    S.t(bel([84, 668], [366, 516], 48, { e: 0.2, min: 0.95, bend: -0.34, fibers: 0, t0: 0.6, t1: 1 }));
    S.end();
    PAN(S, 740, 40, 680, 920, 'inferior'); S.label = new Set();
    S.m('diaphragm', ell(1080, 470, 320, 230), 'm1'); S.t(ell(1080, 440, 100, 80)); S.t(ell(960, 500, 90, 60)); S.t(ell(1200, 500, 90, 60));
    S.draw(null, ell(1120, 430, 22, 18), T.paper, '#8A949B'); S.draw(null, ell(1040, 570, 16, 13), T.paper, '#8A949B');
    S.m(null, bel([1040, 740], [1004, 560], 40, { bu: 0.5 }), 'md'); S.m(null, bel([1110, 740], [1126, 590], 32, { bu: 0.5 }), 'md');
    S.draw(null, ell(1075, 660, 16, 14), T.paper, '#8A949B'); S.b(ell(1078, 780, 60, 44)); S.end();
  } });

// hand (palmar) and foot (plantar + dorsal inset): custom geometry in canvas coordinates
plate({ key: 'hand', replaces: null, file: 'muscular-atlas-18-hand-intrinsics', purpose: 'Intrinsic muscles of the palm: thenar, hypothenar and lumbricals.',
  title: ['Hand: intrinsic muscles, palmar view', 'Mano: músculos intrínsecos, vista palmar'],
  desc: ['Right hand, palmar view, palmar aponeurosis removed. Thumb side (thenar: abductor pollicis brevis lateral, flexor pollicis brevis medial) at the viewer\'s left; little-finger side (hypothenar: abductor digiti minimi) at the viewer\'s right. Lumbricals are slender bellies arising from the flexor digitorum profundus tendons.',
    'Mano derecha, vista palmar, con la aponeurosis palmar retirada. El lado del pulgar (tenar: abductor corto del pulgar lateral, flexor corto del pulgar medial) queda a la izquierda del observador; el lado del meñique (hipotenar: abductor del meñique) a la derecha. Los lumbricales son vientres delgados que nacen de los tendones del flexor profundo de los dedos.'],
  orientation: 'right hand, palmar view; thumb at viewer left (patient right = viewer left)', es_orientation: 'mano derecha, vista palmar; pulgar a la izquierda del observador', lessons: ['arm-forearm'],
  draw(S) {
    S.view(1, 0, 0, 0, 1); S.label = L('abductor-pollicis-brevis', 'flexor-pollicis-brevis', 'abductor-digiti-minimi-hand', 'lumbricals-hand'); S.hide = new Set();
    const fx = [[640, 160], [725, 110], [800, 140], [865, 240]];
    S.skin(pol([[610, 880], [598, 780], [590, 700], [615, 540], [680, 480], [760, 466], [850, 480], [905, 540], [915, 680], [872, 800], [832, 880]]));
    S.skin(bel([640, 480], [625, 150], 62, { fibers: 0, e: 0.3, min: 0.8 })); S.skin(bel([722, 470], [725, 100], 64, { fibers: 0, e: 0.3, min: 0.8 }));
    S.skin(bel([798, 480], [800, 135], 60, { fibers: 0, e: 0.3, min: 0.8 })); S.skin(bel([862, 520], [866, 235], 52, { fibers: 0, e: 0.3, min: 0.8 }));
    S.skin(bel([620, 780], [440, 470], 84, { fibers: 0, e: 0.3, min: 0.75 }));
    const mc = [[[668, 740], [642, 480]], [[722, 735], [722, 470]], [[778, 740], [798, 480]], [[822, 750], [862, 520]]];
    mc.forEach(([a, b], i) => { S.b(bel(a, b, 17, { fibers: 0, e: 0.3, min: 0.8 })); S.b(bel(b, fx[i], 13, { fibers: 0, e: 0.3, min: 0.75 })); });
    S.b(bel([660, 760], [540, 570], 20, { fibers: 0, e: 0.3, min: 0.8 })); S.b(bel([540, 570], [450, 430], 16, { fibers: 0, e: 0.3, min: 0.75 }));
    S.b(pol([[640, 770], [820, 770], [830, 860], [630, 860]]));
    [[700, 880, 642], [725, 880, 722], [752, 880, 798], [775, 880, 862]].forEach(([x, y, x2], i) => S.t(bel([x, y], [mc[i][1][0], 470], 8, { e: 0.3, min: 0.7, fibers: 0 })));
    mc.forEach(([, b], i) => {
      const x0 = [700, 725, 752, 775][i], s = [x0 + (b[0] - x0) * 0.45, 880 + (470 - 880) * 0.45];
      const e = [b[0] - 8, b[1] + 38];
      S.m('lumbricals-hand', bel(s, e, 15, { bu: 0.4, e: 0.6, min: 0.15, fibers: 1 }), 'm3');
      S.t(bel(e, [b[0] - 9, b[1] - 70], 6, { e: 0.3, min: 0.8, fibers: 0 }));
    });
    S.m('flexor-pollicis-brevis', bel([690, 830], [598, 650], 44, { bu: 0.5, e: 0.6 }), 'm2');
    S.m('abductor-pollicis-brevis', bel([660, 830], [545, 640], 48, { bu: 0.5, e: 0.6, bend: 0.08 }), 'm1');
    S.m('abductor-digiti-minimi-hand', bel([800, 850], [866, 640], 46, { bu: 0.5, e: 0.6 }), 'm1');
  } });

plate({ key: 'foot', replaces: null, file: 'muscular-atlas-19-foot-intrinsics', purpose: 'Intrinsic muscles of the sole (first layer) and the dorsal extensor digitorum brevis.',
  title: ['Foot: plantar first layer and dorsal inset', 'Pie: primera capa plantar y recuadro dorsal'],
  desc: ['Right foot. Left panel: plantar view with the plantar aponeurosis removed, showing abductor hallucis along the medial border, flexor digitorum brevis centrally and abductor digiti minimi along the lateral border (big toe at the viewer\'s right). Right panel: dorsal view with extensor digitorum brevis on the lateral dorsum (big toe at the viewer\'s left).',
    'Pie derecho. Panel izquierdo: vista plantar con la aponeurosis plantar retirada, que muestra el abductor del dedo gordo en el borde medial, el flexor corto de los dedos en el centro y el abductor del dedo pequeño en el borde lateral (dedo gordo a la derecha del observador). Panel derecho: vista dorsal con el extensor corto de los dedos en el dorso lateral (dedo gordo a la izquierda del observador).'],
  orientation: 'left panel plantar view (big toe at viewer right); right panel dorsal view (big toe at viewer left); right foot', es_orientation: 'panel izquierdo vista plantar (dedo gordo a la derecha del observador); panel derecho vista dorsal (dedo gordo a la izquierda del observador); pie derecho', lessons: ['leg-and-ankle'],
  draw(S) {
    S.hide = new Set();
    PAN(S, 30, 40, 640, 920, 'plantar'); S.view(1, -250, 0, 0, 1); S.label = L('abductor-hallucis', 'flexor-digitorum-brevis-foot', 'abductor-digiti-minimi-foot');
    S.skin(pol([[630, 830], [625, 740], [640, 620], [650, 500], [660, 420], [800, 400], [830, 470], [820, 620], [800, 740], [790, 830], [760, 890], [680, 890]]));
    [[810, 160, 80], [760, 200, 46], [715, 215, 44], [676, 240, 42], [645, 280, 38]].forEach(([x, y, w], i) => S.skin(bel([i === 0 ? 806 : x, 410], [x, y], w, { fibers: 0, e: 0.3, min: 0.8 })));
    [[775, 150], [740, 230], [705, 260], [670, 275], [640, 330]].forEach(([x, y], i) => S.b(bel([[800, 640], [760, 610], [720, 610], [680, 610], [650, 620]][i], [x, y], 14, { fibers: 0, e: 0.3, min: 0.7 })));
    S.b(pol([[650, 760], [790, 760], [770, 880], [680, 880]]));
    [[760, 200], [715, 215], [676, 240], [645, 280]].forEach(([x, y]) => S.t(bel([706, 535], [x, y + 120], 7, { e: 0.3, min: 0.7, fibers: 0 })));
    S.m('flexor-digitorum-brevis-foot', bel([706, 850], [706, 520], 92, { bu: 0.55, e: 0.5 }), 'm2');
    S.m('abductor-digiti-minimi-foot', bel([660, 850], [648, 520], 42, { bu: 0.5, e: 0.6 }), 'm3');
    S.m('abductor-hallucis', bel([764, 860], [812, 490], 62, { bu: 0.5, e: 0.6, bend: -0.04 }), 'm1'); S.end();
    PAN(S, 700, 40, 720, 920, 'dorsal'); S.view(1, 270, 40, 0, 1); S.label = L('extensor-digitorum-brevis-foot');
    S.skin(pol([[690, 860], [684, 760], [700, 640], [716, 520], [730, 430], [860, 410], [880, 470], [872, 640], [850, 760], [830, 860], [760, 900]]));
    [[706, 160, 80], [770, 190, 46], [810, 220, 44], [846, 240, 42], [878, 280, 38]].forEach(([x, y, w], i) => S.skin(bel([i === 0 ? 746 : x, 420], [x, y], w, { fibers: 0, e: 0.3, min: 0.8 })));
    [[745, 260], [780, 270], [815, 290], [850, 310]].forEach(([x, y]) => S.b(bel([[770, 640], [790, 640], [810, 640], [830, 640]][0], [x, y], 12, { fibers: 0, e: 0.3, min: 0.7 })));
    S.b(pol([[700, 760], [850, 760], [830, 880], [720, 880]]));
    S.m('extensor-digitorum-brevis-foot', bel([832, 690], [776, 470], 46, { bu: 0.5, e: 0.6, bend: 0.05 }), 'm1');
    [[748, 270], [780, 290], [812, 300]].forEach(([x, y]) => S.t(bel([790, 480], [x, y], 6, { e: 0.3, min: 0.7, fibers: 0 })));
    S.end();
  } });

plate({ key: 'pelvic-floor', replaces: null, file: 'muscular-atlas-20-pelvic-floor', purpose: 'Levator ani group of the pelvic floor.',
  title: ['Pelvic floor: levator ani, superior view', 'Suelo pélvico: elevador del ano, vista superior'],
  desc: ['Pelvic floor seen from above, anterior (pubic symphysis) at the top. Pubococcygeus forms the medial band running from the pubis back toward the coccyx beside the midline hiatus; iliococcygeus is the thinner lateral sheet. The levator ani group pin sits on the posterior sling region between the two bands.',
    'Suelo pélvico visto desde arriba, con la parte anterior (sínfisis del pubis) arriba. El pubococcígeo forma la banda medial que va del pubis hacia el cóccix junto al hiato de la línea media; el iliococcígeo es la lámina lateral más delgada. El marcador del grupo elevador del ano está en la región del cabestrillo posterior entre las dos bandas.'],
  orientation: 'superior view; anterior (pubis) up; patient right = viewer right', es_orientation: 'vista superior; anterior (pubis) arriba; derecha del paciente = derecha del observador', lessons: ['axial-muscles'],
  draw(S) {
    S.view(1, 0, 0, 0, 1); S.hide = new Set(); S.label = L('levator-ani', 'pubococcygeus', 'iliococcygeus');
    const half = (X, sg) => { const m = (pts) => pts.map(([x, y]) => [725 + sg * (x - 725), y]); return m; };
    for (const sg of [-1, 1]) {
      const m = half(S, sg);
      S.b(pol(m([[728, 170], [860, 190], [990, 320], [1040, 480], [1000, 640], [900, 745], [850, 700], [868, 600], [850, 460], [800, 340], [740, 260]])));
    }
    S.b(pol([[640, 700], [810, 700], [780, 860], [725, 905], [670, 860]]));
    S.m('levator-ani', pol([[700, 300], [630, 330], [560, 420], [545, 520], [580, 620], [640, 700], [725, 740], [810, 700], [870, 620], [905, 520], [890, 420], [820, 330], [750, 300]], { anchor: [725, 612] }), 'm2', { note: 'group pin on the posterior sling' });
    for (const sg of [-1, 1]) {
      const m = (x, y) => [725 + sg * (x - 725), y];
      const lab = sg === 1;
      const ilio = pol([m(880, 350), m(906, 470), m(884, 600), m(800, 690), m(786, 604), m(820, 500), m(820, 420)].map((p) => p), { anchor: m(868, 520) });
      const pub = bel(m(752, 236), m(738, 690), 58, { bu: 0.5, e: 0.5, bend: sg === 1 ? 0.2 : -0.2, fibers: 3 });
      if (lab) { S.m('iliococcygeus', ilio, 'm3'); S.m('pubococcygeus', pub, 'm1'); } else { S.m(null, ilio, 'm3'); S.m(null, pub, 'm1'); }
    }
    S.draw(null, ell(725, 440, 40, 80), T.paper, '#8A949B');
  } });

/* ---------------- render, verify, write ---------------- */
const sha = (b) => createHash('sha256').update(b).digest('hex');
const rights = 'Original Boneefied project artwork (muscular atlas, BVIS03); all rights reserved by Boneefied. No CC0 or public-domain dedication is granted.';
const refs = ['https://www.ncbi.nlm.nih.gov/books/NBK537012', 'https://www.ncbi.nlm.nih.gov/books/NBK534836', 'https://www.ncbi.nlm.nih.gov/books/NBK470334', 'https://www.ncbi.nlm.nih.gov/books/NBK534836', 'https://www.ncbi.nlm.nih.gov/books/NBK526040'];
const prov = [], gen = [], problems = [];
plates.forEach((p, i) => {
  const S = new Scene();
  S.raw(`<rect id="background" width="${W}" height="${H}" fill="${T.paper}"/>`);
  p.draw(S);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">\n<title>${p.title[0]}</title>\n<desc>${p.desc[0]}</desc>\n${S.svg()}\n</svg>\n`;
  const svgRel = `assets/images/anatomy/muscular-atlas/${p.file}.svg`, pngRel = `assets/images/anatomy/muscular-atlas/${p.file}.png`;
  writeFileSync(join(root, svgRel), svg);
  execFileSync('convert', ['-density', '96', '-background', T.paper, join(root, svgRel), '-resize', `${W}x${H}!`, join(root, pngRel)], { stdio: 'ignore' });
  // occlusion check: every pin must land on its own visible shape
  const idp = `/tmp/mus-id-${p.key}`;
  writeFileSync(`${idp}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/>${S.idsvg()}</svg>`);
  execFileSync('convert', ['-density', '96', `${idp}.svg`, '-filter', 'point', '-resize', `${W}x${H}!`, `${idp}.png`]);
  const raw = execFileSync('convert', [`${idp}.png`, '-depth', '8', 'rgb:-'], { maxBuffer: 1 << 28 });
  const at = (x, y) => { const o = (y * W + x) * 3; return [raw[o], raw[o + 1], raw[o + 2]].map((v) => v.toString(16).padStart(2, '0')).join(''); };
  S.items.forEach((it) => {
    const want = it.hex.slice(1);
    const x0 = Math.round(it.px[0]), y0 = Math.round(it.px[1]);
    const ok = x0 >= 0 && x0 < W && y0 >= 0 && y0 < H && at(x0, y0) === want;
    const [r, g, b2] = [0, 2, 4].map((k) => parseInt(want.slice(k, k + 2), 16));
    // interior test: own colour over a 9x9 neighbourhood
    let rad = 4; const solid = (x, y) => { for (let dy = -rad; dy <= rad; dy += 2) for (let dx = -rad; dx <= rad; dx += 2) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H || at(xx, yy) !== want) return false; } return true; };
    if (!(ok && solid(x0, y0))) {
      let sx = 0, sy = 0, n = 0; void r; void g; void b2;
      for (let y = 30; y < H - 30; y += 2) for (let x = 30; x < W - 30; x += 2) if (at(x, y) === want) { sx += x; sy += y; n++; }
      if (!n) { problems.push(`${p.key}:${it.structureId} fully hidden`); return; }
      const cx = sx / n, cy = sy / n; let best = null, bd = 1e12;
      for (let y = 30; y < H - 30; y += 2) for (let x = 30; x < W - 30; x += 2) if (at(x, y) === want && solid(x, y)) { const d = (x - cx) ** 2 + (y - cy) ** 2; if (d < bd) { bd = d; best = [x, y]; } }
      if (!best) { rad = 2; for (let y = 30; y < H - 30; y += 2) for (let x = 30; x < W - 30; x += 2) if (at(x, y) === want && solid(x, y)) { const d = (x - cx) ** 2 + (y - cy) ** 2; if (d < bd) { bd = d; best = [x, y]; } } }
      if (!best) { problems.push(`${p.key}:${it.structureId} no solid interior`); return; }
      it.px = best; it.x = Math.round((best[0] / W) * 10000) / 10000; it.y = Math.round((best[1] / H) * 10000) / 10000; it.relocated = true;
    }
    if (it.px[0] < 30 || it.px[0] > W - 30 || it.px[1] < 30 || it.px[1] > H - 30) problems.push(`${p.key}:${it.structureId} pin outside margin`);
  });
  const id = p.replaces ?? `asset-muscular-atlas-${p.key}`;
  prov.push({ id, plate: i + 1, disposition: p.replaces ? 'replacement' : 'addition', preservesReplacedId: p.replaces, creator: 'Boneefied', rights, svgPath: svgRel, pngPath: pngRel,
    notice: 'Original authorship: drawn from scratch by scripts/atlas/muscular-generate.mjs. No third-party illustration traced, copied or downloaded; references were consulted for text facts only (origins, insertions, relations).',
    references: refs.map((url) => ({ url, use: 'text-only factual reference; no images imported' })), purpose: p.purpose, orientation: p.orientation, dimensions: { width: W, height: H, aspectRatio: W / H },
    featureAnchorMapping: S.items.map((it) => ({ structureId: it.structureId, x: it.x, y: it.y, radius: it.radius, panel: it.panel, verifiedOnVisibleTissue: true })),
    sha256: { svg: sha(readFileSync(join(root, svgRel))), png: sha(readFileSync(join(root, pngRel))) } });
  gen.push({ id, key: p.key, replaces: p.replaces, svgPath: svgRel, pngPath: pngRel, title: p.title, description: p.desc, orientation: p.orientation, orientationEs: p.es_orientation, purpose: p.purpose, lessons: p.lessons, labels: S.items.map(({ structureId, x, y, radius, panel }) => ({ structureId, x, y, radius, panel })) });
});
writeFileSync(join(outDir, 'provenance.json'), JSON.stringify({ pack: 'boneefied-muscular-atlas', generatedBy: 'scripts/atlas/muscular-generate.mjs', plates: prov }, null, 2) + '\n');
writeFileSync(join(root, 'content/muscular-atlas-plates.generated.ts'), `// GENERATED by scripts/atlas/muscular-generate.mjs - do not edit by hand.\nexport interface MuscularPlateLabel { structureId: string; x: number; y: number; radius: number; panel: string }\nexport interface MuscularPlate { id: string; key: string; replaces: string | null; svgPath: string; pngPath: string; title: [string, string]; description: [string, string]; orientation: string; orientationEs: string; purpose: string; lessons: string[]; labels: MuscularPlateLabel[] }\nexport const muscularPlates: MuscularPlate[] = ${JSON.stringify(gen, null, 2)};\n`);
console.log(`wrote ${plates.length} plates; ${problems.length} pin problems`);
problems.forEach((x) => console.log('  ' + x));
