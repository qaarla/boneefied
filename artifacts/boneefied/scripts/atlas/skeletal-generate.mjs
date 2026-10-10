// BVIS02: generates 22 original skeletal atlas plates (SVG + PNG), provenance.json and content/skeletal-atlas-plates.generated.ts.
// Usage: node scripts/atlas/skeletal-generate.mjs   (ImageMagick `convert` with rsvg/internal SVG renderer)
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CANVAS, PALETTE as C } from './tokens.mjs';
import * as FX from './skeletal-fixes.mjs';
import { Plate, ell, pg, lm, rc, mx, mp, W, H } from './skeletal-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outDir = join(root, 'assets/images/anatomy/skeletal-atlas');
mkdirSync(outDir, { recursive: true });
const plates = [];
const add = (p) => plates.push(p);
const mr = (rot) => -rot;

/* 01 anterior skull */
add({ key: 'skull-anterior', replaces: 'asset-skull-front', file: 'skeletal-atlas-01-skull-anterior', purpose: 'anterior skull: facial bones and anterior openings (mandible included)',
  title: ['Anterior skull: facial bones and openings', 'Cráneo anterior: huesos faciales y orificios'],
  desc: ['Skull seen from the front, mandible included. Orbital openings (optic canal, superior and inferior orbital fissures), supraorbital and mental foramina are drawn as holes. Patient right is on the viewer\'s left; one pin per structure on that side.', 'Cráneo visto de frente, con la mandíbula. Los orificios orbitarios (canal óptico, fisuras orbitarias superior e inferior) y los forámenes supraorbitario y mentoniano se dibujan como huecos. La derecha del paciente queda a la izquierda del observador; un solo marcador por estructura en ese lado.'],
  orientation: 'anterior view; patient right = viewer left',
  draw(P) {
    P.u(ell(725, 320, 255, 262), 'ax');
    P.s('parietal-bone', pg([[480, 330], [486, 240], [540, 150], [625, 108], [610, 170], [565, 260], [552, 335]]), 'axs');
    P.u(pg(mp([[480, 330], [486, 240], [540, 150], [625, 108], [610, 170], [565, 260], [552, 335]])), 'axs');
    P.s('frontal-bone', pg([[552, 335], [565, 260], [610, 170], [625, 108], [725, 95], [825, 108], [840, 170], [885, 260], [898, 335], [870, 395], [800, 395], [725, 380], [650, 395], [580, 395]]), 'ax', { at: [0.5, 0.3] });
    P.s('temporal-bone', pg([[470, 380], [480, 335], [550, 340], [560, 440], [545, 520], [500, 505], [472, 440]]), 'axs');
    P.u(pg(mp([[470, 380], [480, 335], [550, 340], [560, 440], [545, 520], [500, 505], [472, 440]])), 'axs');
    P.s('sphenoid-bone', pg([[552, 340], [580, 372], [585, 445], [556, 458], [548, 400]]), 'ap');
    P.u(pg(mp([[552, 340], [580, 372], [585, 445], [556, 458], [548, 400]])), 'ap');
    P.s('zygomatic-bone', ell(572, 492, 46, 38, -15), 'bone');
    P.u(ell(878, 492, 46, 38, 15), 'bone');
    P.s('maxilla', pg([[590, 540], [640, 512], [690, 530], [725, 545], [760, 530], [810, 512], [860, 540], [850, 650], [815, 715], [725, 740], [635, 715], [600, 650]]), 'bone', { at: [0.2, 0.7] });
    P.s('nasal-bone', pg([[701, 425], [725, 420], [725, 512], [708, 520], [698, 498]]), 'bones');
    P.u(pg(mp([[701, 425], [725, 420], [725, 512], [708, 520], [698, 498]])), 'bones');
    P.s('mandible', lm([[540, 700, 24], [580, 800, 26], [650, 862, 26], [725, 880, 26], [800, 862, 26], [870, 800, 26], [910, 700, 24]]), 'ax', { at: [0.3, 0.8] });
    P.u(ell(630, 437, 70, 62), 'orb'); P.u(ell(820, 437, 70, 62), 'orb');
    P.u(pg([[725, 545], [700, 575], [690, 620], [725, 640], [760, 620], [750, 575]]), 'hole');
    P.s('vomer', lm([[725, 556, 3], [725, 630, 4]]), 'bone');
    P.s('inferior-nasal-concha', ell(706, 610, 10, 18), 'bones'); P.u(ell(744, 610, 10, 18), 'bones');
    P.s('lacrimal-bone', ell(692, 458, 7, 15), 'bones'); P.u(ell(758, 458, 7, 15), 'bones');
    P.s('supraorbital-foramen', ell(655, 376, 7, 6), 'hole'); P.u(ell(795, 376, 7, 6), 'hole');
    P.s('optic-canal', ell(672, 424, 9, 9), 'hole', { r: 0.012 }); P.u(ell(778, 424, 9, 9), 'hole');
    P.s('superior-orbital-fissure', ell(645, 464, 24, 5, -10), 'hole', { r: 0.012 }); P.u(ell(805, 464, 24, 5, 10), 'hole');
    P.s('inferior-orbital-fissure', ell(600, 484, 24, 5, 20), 'hole', { r: 0.012 }); P.u(ell(850, 484, 24, 5, -20), 'hole');
    P.s('mental-foramen', ell(620, 836, 8, 7), 'hole', { r: 0.012 }); P.u(ell(830, 836, 8, 7), 'hole');
  } });

/* 02 left lateral skull */
add({ key: 'skull-lateral', replaces: 'asset-skull-lateral', file: 'skeletal-atlas-02-skull-lateral', purpose: 'left lateral skull: cranial bones, zygomatic arch, process landmarks',
  title: ['Left lateral skull', 'Cráneo lateral izquierdo'],
  desc: ['Skull seen from the patient\'s left side, mandible included. Anterior (face) points toward the viewer\'s left. Zygomatic arch, external acoustic meatus, mastoid and styloid processes, mandibular condyle and coronoid process are separate shapes.', 'Cráneo visto desde el lado izquierdo del paciente, con la mandíbula. La cara (anterior) mira hacia la izquierda del observador. El arco cigomático, el meato acústico externo, las apófisis mastoides y estiloides, el cóndilo mandibular y la apófisis coronoides son formas separadas.'],
  orientation: 'left lateral view; anterior toward viewer-left',
  draw(P) {
    P.u(ell(760, 320, 300, 235), 'ax');
    P.s('frontal-bone', pg([[470, 360], [465, 260], [510, 170], [600, 110], [690, 95], [660, 160], [655, 270], [640, 380], [580, 420], [500, 410]]), 'ax');
    P.s('parietal-bone', pg([[690, 95], [790, 85], [900, 110], [980, 180], [985, 290], [900, 290], [820, 280], [740, 300], [650, 270], [655, 160]]), 'axs');
    P.s('occipital-bone', pg([[985, 290], [1005, 370], [975, 450], [910, 480], [880, 430], [900, 340], [900, 290]]), 'ap');
    P.s('temporal-bone', pg([[650, 270], [740, 300], [820, 280], [900, 290], [900, 340], [880, 430], [840, 470], [760, 470], [700, 430], [660, 380]]), 'ax', { at: [0.4, 0.3] });
    P.s('sphenoid-bone', pg([[600, 400], [640, 380], [660, 380], [700, 430], [690, 470], [640, 470], [600, 450]]), 'ap');
    P.s('nasal-bone', pg([[470, 360], [430, 440], [445, 470], [490, 440], [500, 410]]), 'bones');
    P.s('maxilla', pg([[440, 470], [490, 440], [560, 455], [600, 520], [590, 590], [520, 610], [450, 590], [440, 520]]), 'bone');
    P.s('zygomatic-bone', ell(610, 470, 42, 34), 'bone');
    P.s('zygomatic-arch', lm([[650, 478, 12], [720, 462, 10], [775, 470, 11]]), 'bones');
    P.s('mastoid-process', ell(850, 500, 24, 36), 'bones');
    P.s('styloid-process', lm([[775, 468, 5], [752, 548, 3]]), 'bones');
    P.s('external-acoustic-meatus', ell(795, 425, 15, 12), 'hole', { r: 0.013 });
    P.s('mandible', lm([[500, 650, 20], [600, 700, 22], [700, 705, 24]]), 'ax', { at: [0.2, 0.5] });
    P.u(lm([[715, 700, 26], [760, 600, 24], [790, 510, 20]]), 'ax');
    P.s('mandibular-condyle', ell(795, 495, 19, 13), 'art');
    P.s('mandibular-coronoid', pg([[735, 520], [745, 470], [775, 480], [765, 540]]), 'axs');
    P.s('mental-foramen', ell(562, 684, 8, 7), 'hole', { r: 0.012 });
  } });

/* 03 external skull base */
add({ key: 'skull-base-external', file: 'skeletal-atlas-03-skull-base-external', purpose: 'external (inferior) skull base: palate, foramina, canals and occipital condyles',
  title: ['Skull base, external (inferior) view', 'Base del cráneo, vista externa (inferior)'],
  desc: ['Skull base seen from below, mandible omitted. Anterior is at the top. Patient right is on the viewer\'s LEFT in this inferior view. Foramen spinosum lies posterolateral to foramen ovale; paired openings are pinned once on the patient\'s right.', 'Base del cráneo vista desde abajo, sin mandíbula. La parte anterior queda arriba. En esta vista inferior la derecha del paciente queda a la IZQUIERDA del observador. El foramen espinoso queda posterolateral al foramen oval; los orificios pares llevan un solo marcador del lado derecho del paciente.'],
  orientation: 'inferior view; anterior at top; patient right = viewer left; mandible omitted',
  draw(P) {
    const X = (d, s) => 725 + s * d;
    P.u(ell(725, 500, 330, 420), 'ax');
    P.s('maxilla', pg([[585, 150], [660, 110], [725, 100], [790, 110], [865, 150], [850, 280], [790, 330], [660, 330], [600, 280]]), 'bone', { at: [0.5, 0.2] });
    P.s('palatine-bone', pg([[650, 320], [725, 308], [800, 320], [790, 380], [725, 395], [660, 380]]), 'bones');
    P.s('incisive-foramen', ell(725, 205, 11, 14), 'hole', { r: 0.012 });
    [-1, 1].forEach((s, i) => {
      const o = i ? { pin: false } : { r: 0.012 };
      P.s('greater-palatin-foramen', ell(X(78, s), 335, 9, 8), 'hole', o);
      P.s('zygomatic-arch', lm([[X(250, s), 330, 16], [X(300, s), 380, 18], [X(280, s), 440, 16]]), 'bones', i ? { pin: false } : {});
      P.s('sphenoid-bone', pg([[X(60, s), 395], [X(150, s), 395], [X(190, s), 440], [X(130, s), 470], [X(70, s), 450]]), 'ap', i ? { pin: false } : { at: [0.7, 0.5] });
      P.s('pterygoid-process', lm([[X(52, s), 390, 13], [X(46, s), 450, 11]]), 'aps', i ? { pin: false } : {});
      P.s('temporal-bone', pg([[X(200, s), 470], [X(300, s), 450], [X(290, s), 570], [X(200, s), 620], [X(150, s), 540]]), 'axs', i ? { pin: false } : { at: [0.55, 0.3] });
      P.s('foramen-ovale', ell(X(115, s), 440, 12, 9), 'hole', i ? { pin: false } : { r: 0.012 });
      P.s('foramen-spinosum', ell(X(150, s), 482, 7, 7), 'hole', i ? { pin: false } : { r: 0.012 });
      P.s('carotid-canal', ell(X(120, s), 520, 15, 12), 'hole', i ? { pin: false } : { r: 0.012 });
      P.s('jugular-foramen', ell(X(150, s), 560, 18, 14), 'hole', i ? { pin: false } : { r: 0.012 });
      P.s('styloid-process', lm([[X(195, s), 476, 5], [X(207, s), 440, 3]]), 'bones', i ? { pin: false } : {});
      P.s('stylomastoid-foramen', ell(X(190, s), 528, 7, 7), 'hole', i ? { pin: false } : { r: 0.012 });
      P.s('mastoid-process', ell(X(245, s), 548, 26, 36), 'bones', i ? { pin: false } : {});
      P.s('occipital-condyles', ell(X(62, s), 650, 14, 32, s * 10), 'art', i ? { pin: false } : {});
      P.s('hypoglossal-canal', ell(X(95, s), 625, 7, 7), 'hole', i ? { pin: false } : { r: 0.012 });
    });
    P.s('vomer', lm([[725, 400, 5], [725, 440, 5]]), 'bone');
    P.s('occipital-bone', pg([[600, 700], [650, 760], [725, 800], [800, 760], [850, 700], [790, 780]]), 'ap', { at: [0.5, 0.75] });
    P.s('foramen-magnum', ell(725, 665, 42, 56), 'hole', { r: 0.02 });
  } });

/* 04 internal cranial floor */
add({ key: 'cranial-floor-internal', file: 'skeletal-atlas-04-cranial-floor-internal', purpose: 'internal cranial floor: three fossae and their openings',
  title: ['Cranial floor, internal (superior) view', 'Suelo craneal, vista interna (superior)'],
  desc: ['Floor of the cranial cavity seen from above with the vault removed. Anterior is at the top and patient right is on the viewer\'s RIGHT. Anterior, middle and posterior cranial fossae are tinted regions; optic canal, fissure, rotundum, ovale, spinosum, internal acoustic meatus, jugular foramen, hypoglossal canal and foramen magnum are holes.', 'Suelo de la cavidad craneal visto desde arriba sin la bóveda. La parte anterior queda arriba y la derecha del paciente a la DERECHA del observador. Las fosas craneales anterior, media y posterior son regiones teñidas; el canal óptico, la fisura, los forámenes redondo, oval y espinoso, el meato acústico interno, el foramen yugular, el canal del hipogloso y el foramen magno son huecos.'],
  orientation: 'superior view; anterior at top; patient right = viewer right',
  draw(P) {
    const X = (d, s) => 725 + s * d;
    P.u(ell(725, 490, 340, 410), 'ax');
    P.s('anterior-cranial-fossa', pg([[480, 330], [500, 220], [610, 130], [725, 110], [840, 130], [950, 220], [970, 330], [850, 350], [725, 360], [600, 350]]), 'reg1', { at: [0.2, 0.55] });
    [1, -1].forEach((s, i) => {
      P.s('middle-cranial-fossa', pg([[X(120, s), 360], [X(250, s), 345], [X(250, s), 450], [X(215, s), 540], [X(150, s), 560], [X(110, s), 480]]), 'reg2', i ? { pin: false } : { at: [0.55, 0.65] });
    });
    P.s('posterior-cranial-fossa', pg([[510, 560], [610, 530], [725, 520], [840, 530], [940, 560], [900, 760], [820, 850], [725, 880], [630, 850], [550, 760]]), 'reg3', { at: [0.2, 0.8] });
    P.s('ethmoid-bone', ell(725, 255, 80, 62), 'aps', { at: [0.5, 0.97], r: 0.012 }); // cribriform plate and crista galli belong to the ethmoid
    P.s('cribriform-plate', rc(X(34, -1) - 14, 215, 28, 80), 'bones'); P.u(rc(X(34, 1) - 14, 215, 28, 80), 'bones');
    P.s('crista-galli', lm([[725, 200, 8], [725, 250, 7]]), 'ap');
    P.s('sella-turcica', ell(725, 405, 36, 22), 'art', { r: 0.014 });
    P.s('clivus', lm([[725, 440, 22], [725, 520, 24]]), 'aps');
    [1, -1].forEach((s, i) => {
      const o = i ? { pin: false } : { r: 0.012 };
      P.s('optic-canal', ell(X(62, s), 345, 9, 9), 'hole', o);
      P.s('superior-orbital-fissure', ell(X(115, s), 382, 18, 5, s * 30), 'hole', o);
      P.s('foramen-rotundum', ell(X(135, s), 418, 7, 7), 'hole', o);
      P.s('foramen-ovale', ell(X(165, s), 455, 11, 8), 'hole', o);
      P.s('foramen-spinosum', ell(X(190, s), 492, 6, 6), 'hole', o);
      P.s('internal-acoustic-meatus', ell(X(180, s), 590, 14, 8), 'hole', o);
      P.s('jugular-foramen', ell(X(150, s), 655, 17, 12), 'hole', o);
      P.s('hypoglossal-canal', ell(X(88, s), 668, 7, 7), 'hole', o);
    });
    P.s('foramen-magnum', ell(725, 705, 44, 54), 'hole', { r: 0.02 });
    P.s('internal-occipital-crest', lm([[725, 770, 5], [725, 840, 5]]), 'aps');
  } });

/* 05 sutures */
add({ key: 'skull-sutures', file: 'skeletal-atlas-05-skull-sutures', purpose: 'coronal, sagittal and lambdoid sutures: superior and posterior views',
  title: ['Cranial sutures: superior and posterior views', 'Suturas craneales: vistas superior y posterior'],
  desc: ['Left panel: skull vault from above (anterior at top, patient right = viewer right) showing the frontal, parietal and occipital bones and the coronal and sagittal sutures. Right panel: skull from behind (patient right = viewer right) showing the lambdoid suture, occipital bone and temporal bone.', 'Panel izquierdo: bóveda craneal vista desde arriba (anterior arriba, derecha del paciente a la derecha del observador) con los huesos frontal, parietal y occipital y las suturas coronal y sagital. Panel derecho: cráneo visto desde atrás (derecha del paciente a la derecha del observador) con la sutura lambdoidea y los huesos occipital y temporal.'],
  orientation: 'left panel superior view, anterior at top; right panel posterior view; patient right = viewer right in both',
  draw(P) {
    P.panel(70, 70, 640, 860); P.panel(740, 70, 640, 860);
    const cx = 390;
    P.u(ell(cx, 500, 240, 340), 'ax');
    P.s('frontal-bone', pg([[cx - 220, 380], [cx - 190, 240], [cx - 90, 175], [cx, 165], [cx + 90, 175], [cx + 190, 240], [cx + 220, 380], [cx, 350]]), 'ax', { at: [0.5, 0.3] });
    P.s('parietal-bone', pg([[cx - 225, 390], [cx, 360], [cx, 640], [cx - 150, 700], [cx - 215, 600]]), 'axs', { at: [0.4, 0.5] });
    P.u(pg([[cx + 225, 390], [cx, 360], [cx, 640], [cx + 150, 700], [cx + 215, 600]]), 'axs');
    P.s('occipital-bone', pg([[cx - 150, 700], [cx, 640], [cx + 150, 700], [cx + 100, 800], [cx, 835], [cx - 100, 800]]), 'ap', { at: [0.5, 0.65] });
    P.s('coronal-suture', lm([[cx - 225, 392, 5], [cx - 110, 362, 5], [cx, 355, 5], [cx + 110, 362, 5], [cx + 225, 392, 5]]), 'hole', { at: [0.2, 0.5] });
    P.s('sagittal-suture', lm([[cx, 362, 5], [cx, 500, 5], [cx, 640, 5]]), 'hole', { at: [0.5, 0.7] });
    P.u(lm([[cx - 150, 700, 4], [cx, 642, 4], [cx + 150, 700, 4]]), 'hole');
    const px = 1060;
    P.u(ell(px, 470, 270, 330), 'ax');
    P.u(pg([[px - 260, 440], [px - 200, 220], [px, 150], [px + 200, 220], [px + 260, 440], [px, 400]]), 'axs');
    P.s('temporal-bone', pg([[px + 255, 480], [px + 270, 560], [px + 240, 660], [px + 190, 650], [px + 205, 520]]), 'axs', { at: [0.5, 0.5] });
    P.u(pg([[px - 255, 480], [px - 270, 560], [px - 240, 660], [px - 190, 650], [px - 205, 520]]), 'axs');
    P.u(pg([[px - 190, 440], [px, 400], [px + 190, 440], [px + 190, 580], [px + 120, 700], [px, 740], [px - 120, 700], [px - 190, 580]]), 'ap');
    P.s('lambdoid-suture', lm([[px - 200, 440, 5], [px - 110, 425, 5], [px, 405, 5], [px + 110, 425, 5], [px + 200, 440, 5]]), 'hole', { at: [0.8, 0.5] });
    P.s('occipital-bone', pg([[px - 100, 520], [px, 500], [px + 100, 520], [px + 90, 620], [px, 680], [px - 90, 620]]), 'ap', { pin: false });
    P.u(lm([[px, 405, 4], [px, 300, 4], [px, 160, 4]]), 'hole');
  } });

/* 06 typical vertebra */
const vertSup = (P, cx, cy, o = {}) => { /* generic superior view; returns nothing */ };
add({ key: 'vertebra-typical', file: 'skeletal-atlas-06-vertebra-typical', purpose: 'typical vertebra: superior view plus lateral inset',
  title: ['Typical vertebra: superior view with lateral inset', 'Vértebra típica: vista superior con recuadro lateral'],
   desc: ['Main panel: the shared vertebral plan from above, with body/anterior at the top and spinous process at the bottom. Inset: a thoracic lateral detail with upper and lower costal demifacets on the posterior body margin, an attached inferior articular facet, and a disc between adjacent bodies. Anterior is toward the viewer\'s left. The inferior costal facet is shown only in this lateral detail, not as a visible superior surface.', 'Panel principal: el plan vertebral común desde arriba, con cuerpo/anterior arriba y apófisis espinosa abajo. Recuadro: detalle torácico lateral con hemicarillas costales superior e inferior en el margen posterior del cuerpo, una carilla articular inferior unida al hueso y un disco entre cuerpos vecinos. Anterior está hacia la izquierda del observador. La carilla costal inferior se muestra solo en este detalle lateral, no como superficie visible desde arriba.'],
   orientation: 'main: superior view, body/anterior at top; inset: thoracic lateral detail, anterior toward viewer-left',
  draw(P) {
    P.panel(880, 110, 480, 780);
    const cx = 450;
    P.u(lm([[cx, 560, 26], [cx, 640, 22], [cx, 760, 14]]), 'ap');
    P.s('spinous-process', lm([[cx, 640, 22], [cx, 760, 14], [cx, 870, 10]]), 'ap', { at: [0.5, 0.65] });
    [-1, 1].forEach((s, i) => P.s('transverse-process', lm([[cx + s * 100, 480, 26], [cx + s * 190, 470, 20], [cx + s * 270, 480, 14]]), 'ap', i ? { pin: false } : { at: [0.6, 0.5] }));
    P.u(pg([[cx - 120, 360], [cx - 60, 560], [cx + 60, 560], [cx + 120, 360]], true), 'ap');
    P.u(pg([[cx - 90, 480], [cx - 90, 580], [cx - 40, 620], [cx + 40, 620], [cx + 90, 580], [cx + 90, 480]]), 'ap');
    P.s('vertebral-body', ell(cx, 280, 150, 110), 'ax', { at: [0.5, 0.35] });
    P.s('vertebral-foramen', pg([[cx - 62, 400], [cx, 385], [cx + 62, 400], [cx + 70, 480], [cx + 30, 540], [cx - 30, 540], [cx - 70, 480]]), 'hole', { r: 0.02 });
    [-1, 1].forEach((s, i) => P.s('superior-articular-facet', ell(cx + s * 95, 560, 22, 34, s * 12), 'art', i ? { pin: false } : {}));
    const ix = 1070;
    P.s('intervertebral-disc', pg([[ix - 150, 700], [ix + 20, 700], [ix + 20, 750], [ix - 150, 750]], false), 'cap', { r: 0.014 });
    P.u(pg([[ix - 150, 300], [ix + 20, 300], [ix + 20, 690], [ix - 150, 690]], false), 'ax');
    P.u(lm([[ix + 20, 380, 30], [ix + 100, 400, 26], [ix + 200, 480, 16], [ix + 230, 560, 8]]), 'ap');
    P.u(lm([[ix + 20, 330, 20], [ix + 60, 280, 14], [ix + 20, 230, 16]]), 'ap');
    P.s('inferior-articular-facet', ell(ix + 70, 640, 20, 34, -15), 'art', { r: 0.014 });
  } });

/* 07 regional vertebrae */
add({ key: 'vertebrae-regional', replaces: 'asset-cervical-vertebra', file: 'skeletal-atlas-07-vertebrae-regional', purpose: 'cervical, thoracic and lumbar vertebrae compared in superior view',
  title: ['Regional vertebrae compared: cervical, thoracic, lumbar (superior view)', 'Vértebras regionales comparadas: cervical, torácica y lumbar (vista superior)'],
  desc: ['Three vertebrae from above, left to right: cervical (small body, transverse foramina), thoracic (heart-shaped body, costal facets, long spinous process) and lumbar (large kidney-shaped body). Body and anterior at the top; spinous process at the bottom.', 'Tres vértebras vistas desde arriba, de izquierda a derecha: cervical (cuerpo pequeño, forámenes transversos), torácica (cuerpo en forma de corazón, carillas costales, apófisis espinosa larga) y lumbar (cuerpo grande en forma de riñón). Cuerpo y parte anterior arriba; apófisis espinosa abajo.'],
  orientation: 'superior views; body/anterior at top; panels cervical, thoracic, lumbar',
  draw(P) {
    P.panel(40, 90, 440, 820); P.panel(505, 90, 440, 820); P.panel(970, 90, 440, 820);
    // cervical
    let c = 260;
    P.u(lm([[c, 600, 18], [c - 30, 700, 12], [c - 40, 790, 6]]), 'ap'); P.u(lm([[c, 600, 18], [c + 30, 700, 12], [c + 40, 790, 6]]), 'ap');
    P.u(lm([[c - 60, 460, 24], [c - 150, 440, 20], [c - 190, 450, 14]]), 'ap'); P.u(lm([[c + 60, 460, 24], [c + 150, 440, 20], [c + 190, 450, 14]]), 'ap');
    P.s('cervical-vertebrae', ell(c, 290, 90, 62), 'ax', { at: [0.5, 0.4] });
    P.s('uncinate-process-vertebra', lm([[c - 78, 330, 10], [c - 80, 300, 6]]), 'axs');
    P.u(lm([[c + 78, 330, 10], [c + 80, 300, 6]]), 'axs');
    P.s('vertebral-foramen', pg([[c - 50, 380], [c + 50, 380], [c, 520]]), 'hole', { r: 0.02 });
    P.s('transverse-foramen', ell(c - 138, 445, 16, 16), 'hole', { r: 0.014 }); P.u(ell(c + 138, 445, 16, 16), 'hole');
    // thoracic
    c = 725;
    P.s('spinous-process', lm([[c, 590, 16], [c, 720, 10], [c, 870, 7]]), 'ap', { at: [0.5, 0.8] });
    [-1, 1].forEach((s) => P.u(lm([[c + s * 50, 470, 22], [c + s * 140, 460, 18], [c + s * 200, 470, 14]]), 'ap'));
    P.s('thoracic-vertebrae', pg([[c - 100, 240], [c, 205], [c + 100, 240], [c + 80, 340], [c, 385], [c - 80, 340]]), 'ax', { at: [0.5, 0.3] });
    P.s('superior-costal-facet', ell(c - 82, 340, 11, 17, 20), 'art', { r: 0.012 }); P.u(ell(c + 82, 340, 11, 17, -20), 'art');
    P.u(ell(c, 450, 46, 46), 'hole');
    // lumbar
    c = 1190;
    P.u(lm([[c, 600, 20], [c, 700, 14], [c, 760, 9]]), 'ap');
    P.s('accessory-process', lm([[c - 100, 460, 8], [c - 118, 500, 5]]), 'axs');
    P.u(lm([[c + 100, 460, 8], [c + 118, 500, 5]]), 'axs');
    [-1, 1].forEach((s) => P.u(lm([[c + s * 70, 440, 24], [c + s * 150, 430, 18], [c + s * 210, 440, 12]]), 'ap'));
    P.s('lumbar-vertebrae', pg([[c - 140, 270], [c - 60, 210], [c, 225], [c + 60, 210], [c + 140, 270], [c + 120, 380], [c, 400], [c - 120, 380]]), 'ax', { at: [0.5, 0.45] });
    P.s('mammillary-process', ell(c - 100, 495, 12, 12), 'axs', { r: 0.012 }); P.u(ell(c + 100, 495, 12, 12), 'axs');
    P.u(pg([[c - 50, 450], [c + 50, 450], [c + 56, 520], [c, 560], [c - 56, 520]]), 'hole');
  } });

/* 08 atlas and axis */
add({ key: 'atlas-axis', file: 'skeletal-atlas-08-atlas-axis', purpose: 'C1 atlas (no body) and C2 axis (dens)',
  title: ['Atlas (C1) from above and axis (C2) from the side', 'Atlas (C1) desde arriba y axis (C2) de lado'],
  desc: ['Left: the atlas (C1) from above, a ring with no body, anterior at top. Right: the axis (C2) from the side, anterior toward the viewer\'s left, with the dens projecting upward from the body.', 'Izquierda: el atlas (C1) visto desde arriba, un anillo sin cuerpo, con la parte anterior arriba. Derecha: el axis (C2) de lado, con la parte anterior a la izquierda del observador y el diente proyectado hacia arriba desde el cuerpo.'],
  orientation: 'left: C1 superior view, anterior at top; right: C2 lateral view, anterior toward viewer-left',
  draw(P) {
    P.panel(60, 90, 640, 820); P.panel(730, 90, 660, 820);
    const c = 380;
    P.u(lm([[c - 150, 520, 40], [c, 620, 28], [c + 150, 520, 40]]), 'ax');
    P.s('atlas-c1', lm([[c - 110, 330, 34], [c, 270, 26], [c + 110, 330, 34]]), 'ax', { at: [0.5, 0.3] });
    [-1, 1].forEach((s) => P.u(ell(c + s * 150, 430, 62, 90, s * 10), 'axs'));
    P.s('vertebral-foramen', ell(c, 440, 74, 80), 'hole', { r: 0.02 });
    [-1, 1].forEach((s, i) => {
      P.s('superior-articular-facet', ell(c + s * 150, 440, 30, 62, s * 10), 'art', i ? { pin: false } : {});
      P.s('transverse-foramen', ell(c + s * 224, 430, 14, 14), 'hole', i ? { pin: false } : { r: 0.012 });
      P.u(lm([[c + s * 200, 400, 18], [c + s * 260, 410, 12]]), 'ax');
    });
    const a = 1060;
    P.s('axis-c2', pg([[a - 60, 330], [a - 38, 312], [a - 18, 330], [a - 14, 480], [a + 90, 520], [a + 100, 700], [a + 70, 760], [a - 100, 760], [a - 120, 640], [a - 90, 520], [a - 62, 480]]), 'ax', { at: [0.1, 0.9], r: 0.014 });
    P.s('vertebral-body', pg([[a - 110, 520], [a + 90, 520], [a + 100, 700], [a + 70, 760], [a - 100, 760], [a - 120, 640]]), 'ax', { at: [0.4, 0.5] });
    P.s('dens', lm([[a - 40, 530, 40], [a - 40, 420, 28], [a - 38, 330, 20]]), 'axs', { at: [0.5, 0.2] });
    P.s('spinous-process', lm([[a + 80, 580, 34], [a + 190, 660, 22], [a + 270, 700, 14]]), 'ap', { at: [0.7, 0.5] });
    P.u(pg([[a + 30, 480], [a + 130, 480], [a + 140, 540], [a + 40, 560]]), 'art');
    P.s('superior-articular-facet', ell(a + 60, 505, 36, 16, 0), 'art', { pin: false });
    P.s('inferior-articular-facet', ell(a + 50, 800, 34, 20), 'art', { r: 0.014 });
  } });

/* 09 thoracic cage */
add({ key: 'thoracic-cage', file: 'skeletal-atlas-09-thoracic-cage', purpose: 'thoracic cage: sternum parts and rib groups',
  title: ['Thoracic cage, anterior view', 'Caja torácica, vista anterior'],
  desc: ['Sternum (manubrium, body, xiphoid process) with 12 rib pairs and costal cartilages, anterior view. Patient right is on the viewer\'s left. True ribs 1-7 reach the sternum, false ribs 8-10 join the cartilage above, and ribs 11-12 float. Clavicles omitted.', 'Esternón (manubrio, cuerpo, apófisis xifoides) con 12 pares de costillas y cartílagos costales, vista anterior. La derecha del paciente queda a la izquierda del observador. Las costillas verdaderas 1-7 llegan al esternón, las falsas 8-10 se unen al cartílago superior y las 11-12 son flotantes. Clavículas omitidas.'],
  orientation: 'anterior view; patient right = viewer left; clavicles omitted',
  draw(P) {
    const c = 725;
    for (const s of [-1, 1]) for (let i = 1; i <= 12; i++) {
      const y0 = 130 + (i - 1) * 56 + (i > 7 ? 10 : 0), w = [180, 260, 320, 360, 380, 390, 380, 350, 310, 260, 190, 140][i - 1];
      const ey = i <= 7 ? 150 + (i - 1) * 56 : i <= 10 ? 560 + (i - 8) * 18 : 720 + (i - 11) * 14;
      const ex = i <= 7 ? 40 : i <= 10 ? 90 + (i - 8) * 55 : w - 20;
      const axis = [[c + s * 40, y0 - 20, 7], [c + s * (w * 0.7), y0 + 40, 8], [c + s * w, y0 + 120, 8], [c + s * (w - 40), ey + 160 + (i - 1) * 4, 7]];
      const first = s === -1;
      const sid = i === 4 ? 'true-ribs' : i === 9 ? 'false-ribs' : i === 12 ? 'floating-ribs' : null;
      void ex; void ey;
      const g = lm(axis);
      if (sid) P.s(sid, g, 'ax', first ? {} : { pin: false }); else P.u(g, 'ax');
    }
    P.s('sternum', pg([[c - 44, 120], [c + 44, 120], [c + 40, 770], [c - 40, 770]], false), 'bones', { at: [0.5, 0.45], pin: true });
    P.s('manubrium', pg([[c - 62, 120], [c + 62, 120], [c + 50, 250], [c - 50, 250]]), 'ap', { r: 0.014 });
    P.s('body-of-sternum', pg([[c - 44, 262], [c + 44, 262], [c + 38, 620], [c - 38, 620]], false), 'ap', { r: 0.014 });
    P.s('xiphoid-process', pg([[c - 22, 632], [c + 22, 632], [c, 740]]), 'aps', { r: 0.012 });
  } });

/* 10 rib detail */
add({ key: 'rib-detail', file: 'skeletal-atlas-10-rib-detail', purpose: 'rib head, tubercle and costal groove with the thoracic vertebra it meets',
  title: ['Rib detail: head, tubercle and costal groove', 'Detalle de costilla: cabeza, tubérculo y surco costal'],
  desc: ['Left panel: posterior end of a right rib from behind (patient right = viewer right, so the spine is at the viewer\'s left) meeting a thoracic vertebra. Right panel: the same rib seen from its inner surface, with the costal groove along the lower border.', 'Panel izquierdo: extremo posterior de una costilla derecha vista desde atrás (derecha del paciente a la derecha del observador, por lo que la columna queda a la izquierda) articulada con una vértebra torácica. Panel derecho: la misma costilla vista por su cara interna, con el surco costal en el borde inferior.'],
  orientation: 'left: posterior view of right rib, spine at viewer-left; right: inner (visceral) surface',
  draw(P) {
    P.panel(60, 90, 700, 820); P.panel(790, 90, 600, 820);
    P.s('vertebral-body', pg([[110, 250], [260, 250], [250, 760], [110, 760]], false), 'ax', { at: [0.4, 0.5] });
    P.s('superior-costal-facet', ell(262, 360, 14, 34), 'art', { r: 0.012 });
    P.s('transverse-process', lm([[250, 520, 26], [330, 540, 22], [400, 560, 16]]), 'ap');
    P.u(lm([[300, 360, 18], [420, 380, 20], [560, 470, 22], [650, 640, 20], [700, 830, 16]]), 'bone');
    P.s('rib-head', ell(300, 360, 34, 34), 'bones', { r: 0.016 });
    P.u(lm([[330, 368, 16], [390, 385, 18]]), 'bone');
    P.s('rib-tubercle', ell(420, 430, 28, 28), 'bones', { r: 0.016 });
    P.u(ell(412, 540, 22, 20), 'art');
    P.u(lm([[860, 300, 40], [1000, 330, 44], [1160, 450, 46], [1260, 650, 44], [1310, 840, 40]]), 'bone');
    P.s('costal-groove', lm([[870, 335, 11], [1010, 365, 12], [1170, 485, 12], [1262, 680, 12], [1306, 840, 10]]), 'aps', { r: 0.016, at: [0.5, 0.5] });
  } });

/* 11 scapula */
const scapAnt = [[310, 310], [350, 230], [470, 190], [565, 175], [552, 350], [510, 560], [440, 810], [405, 700], [375, 560], [330, 400]];
add({ key: 'scapula', file: 'skeletal-atlas-11-scapula', purpose: 'right scapula: anterior and posterior views',
  title: ['Right scapula: anterior (left) and posterior (right)', 'Escápula derecha: anterior (izquierda) y posterior (derecha)'],
  desc: ['Right scapula twice. Anterior view: glenoid cavity toward the viewer\'s left, coracoid process projecting forward. Posterior view: glenoid toward the viewer\'s right, with the scapular spine ending in the acromion. The spine is posterior only; the coracoid is anterior.', 'Escápula derecha dos veces. Vista anterior: cavidad glenoidea hacia la izquierda del observador y apófisis coracoides proyectada hacia delante. Vista posterior: glenoides hacia la derecha, con la espina de la escápula terminando en el acromion. La espina es solo posterior; la coracoides es anterior.'],
  orientation: 'right scapula; anterior panel: glenoid at viewer-left; posterior panel: glenoid at viewer-right',
  draw(P) {
    P.panel(60, 70, 640, 860); P.panel(740, 70, 650, 860);
    P.s('scapula', pg(scapAnt), 'ap', { at: [0.7, 0.55] });
    P.u(lm([[460, 216, 14], [440, 168, 14], [350, 130, 13], [285, 120, 13]]), 'ap');
    P.s('coracoid-process', lm([[325, 240, 16], [280, 218, 14], [235, 212, 13]]), 'aps');
    P.s('glenoid-cavity', ell(305, 310, 28, 44, 10), 'art');
    P.u(pg(mp(scapAnt)), 'ap');
    P.s('scapular-spine', lm([[mx(555), 330, 10], [mx(460), 300, 12], [mx(360), 235, 13], [mx(295), 180, 13]]), 'aps');
    P.s('acromion', lm([[mx(295), 182, 16], [mx(255), 160, 14], [mx(235), 195, 13]]), 'aps');
    P.u(ell(mx(305), 310, 28, 44, -10), 'art');
  } });

/* 12 pectoral girdle */
add({ key: 'pectoral-girdle', file: 'skeletal-atlas-12-pectoral-girdle', purpose: 'clavicle, scapula, humeral head and manubrium relationships',
  title: ['Pectoral girdle relationships, anterior view (right side detailed)', 'Relaciones de la cintura escapular, vista anterior (lado derecho detallado)'],
  desc: ['Anterior view. Patient right is on the viewer\'s left and is drawn in detail: clavicle from manubrium to acromion, acromioclavicular ligament, coracoid process below the clavicle, scapula behind, glenoid cavity and the humeral head. The left clavicle is shown plain.', 'Vista anterior. La derecha del paciente queda a la izquierda del observador y está dibujada con detalle: clavícula del manubrio al acromion, ligamento acromioclavicular, apófisis coracoides bajo la clavícula, escápula detrás, cavidad glenoidea y cabeza del húmero. La clavícula izquierda se muestra sin detalle.'],
  orientation: 'anterior view; patient right = viewer left',
  draw(P) {
    P.s('scapula', pg([[340, 330], [420, 300], [520, 350], [560, 480], [480, 640], [400, 580], [350, 450]]), 'aps', { at: [0.55, 0.7] });
    P.s('glenoid-cavity', ell(348, 400, 22, 36), 'art');
    P.s('humeral-head', ell(300, 410, 46, 46), 'ap');
    P.s('manubrium', pg([[665, 245], [785, 245], [765, 400], [685, 400]]), 'ax');
    P.u(lm(mp([[690, 262, 14], [600, 250, 11], [520, 262, 10], [440, 284, 9], [395, 290, 10]]).map((p) => p)), 'ap');
    P.s('clavicle', lm([[690, 262, 14], [600, 250, 11], [520, 262, 10], [440, 284, 9], [395, 290, 10]]), 'ap', { at: [0.5, 0.3] });
    P.u(lm([[1010, 262, 10], [1065, 250, 10], [1180, 262, 9], [1260, 284, 9]]), 'ap');
    P.s('acromion', ell(345, 300, 38, 20), 'aps');
    P.s('acromioclavicular-ligament', lm([[410, 280, 7], [370, 292, 7]]), 'lig', { r: 0.014 });
    P.s('coracoid-process', lm([[445, 352, 15], [410, 345, 13], [385, 372, 12]]), 'aps');
  } });

/* 13 humerus */
add({ key: 'humerus', file: 'skeletal-atlas-13-humerus', purpose: 'right humerus: anterior and posterior views',
  title: ['Right humerus: anterior (left) and posterior (right)', 'Húmero derecho: anterior (izquierda) y posterior (derecha)'],
  desc: ['Right humerus twice. Anterior view: the head points medially (viewer\'s right); capitulum is lateral and trochlea medial. Posterior view: the head points toward the viewer\'s left (medial).', 'Húmero derecho dos veces. Vista anterior: la cabeza apunta medialmente (derecha del observador); el capitulum es lateral y la tróclea medial. Vista posterior: la cabeza apunta hacia la izquierda del observador (medial).'],
  orientation: 'right humerus; anterior panel head medial = viewer-right; posterior panel head medial = viewer-left',
  draw(P) {
    P.panel(60, 70, 640, 860); P.panel(740, 70, 650, 860);
    P.s('humerus', lm([[405, 230, 40], [395, 400, 30], [390, 600, 28], [400, 730, 36]]), 'ap', { at: [0.5, 0.55] });
    P.s('humeral-head', ell(450, 170, 58, 52, -20), 'aps');
    P.s('greater-tubercle', ell(345, 160, 30, 40), 'aps');
    P.s('deltoid-tuberosity', ell(362, 470, 14, 30), 'aps', { r: 0.014 });
    P.s('lateral-epicondyle', ell(335, 785, 22, 20), 'aps', { r: 0.014 });
    P.s('medial-epicondyle', ell(468, 785, 26, 22), 'aps', { r: 0.014 });
    P.s('capitulum', ell(365, 845, 30, 28), 'art');
    P.s('trochlea', ell(430, 850, 32, 28), 'art');
    P.u(lm(mp([[405, 230, 40], [395, 400, 30], [390, 600, 28], [400, 730, 36]]).map(([x, y, w]) => [x - 300 + 300, y, w])), 'ap');
    P.u(ell(mx(450), 170, 58, 52, 20), 'aps'); P.u(ell(mx(345), 160, 30, 40), 'aps');
    P.u(ell(mx(335), 785, 22, 20), 'aps'); P.u(ell(mx(468), 785, 26, 22), 'aps');
    P.u(ell(mx(398), 845, 60, 28), 'art');
  } });

/* 14 forearm */
add({ key: 'forearm', file: 'skeletal-atlas-14-forearm', purpose: 'right radius and ulna anterior plus proximal-ulna inset',
  title: ['Right forearm, anterior view, with proximal-ulna inset', 'Antebrazo derecho, vista anterior, con recuadro del cúbito proximal'],
  desc: ['Right radius (viewer\'s left, lateral) and ulna (viewer\'s right, medial) from the front, joined by the interosseous membrane. Inset: the proximal ulna from the side showing the olecranon and the trochlear notch.', 'Radio derecho (a la izquierda del observador, lateral) y cúbito (a la derecha, medial) vistos de frente, unidos por la membrana interósea. Recuadro: cúbito proximal de lado con el olécranon y la incisura troclear.'],
  orientation: 'right forearm anterior view: radius viewer-left, ulna viewer-right; inset lateral view of proximal ulna',
  draw(P) {
    P.panel(880, 110, 480, 780);
    P.s('interosseous-membrane', pg([[440, 260], [560, 260], [570, 780], [450, 760]], false), 'lig', { r: 0.014 });
    P.s('radius', lm([[430, 240, 14], [440, 400, 16], [425, 600, 20], [410, 790, 30]]), 'ap', { at: [0.5, 0.6] });
    P.u(lm([[430, 195, 12], [430, 240, 14]]), 'ap');
    P.s('radial-head', ell(430, 190, 32, 18), 'art', { r: 0.014 });
    P.s('radial-tuberosity', ell(462, 290, 14, 18), 'aps', { r: 0.014 });
    P.s('radial-styloid', lm([[385, 800, 10], [370, 850, 6]]), 'aps', { r: 0.012 });
    P.s('ulna', lm([[565, 210, 30], [570, 400, 18], [575, 600, 16], [590, 780, 22]]), 'ap', { at: [0.5, 0.55] });
    P.s('ulnar-styloid', lm([[612, 790, 8], [622, 840, 5]]), 'aps', { r: 0.012 });
    const x = 1000;
    // Continuous hooked proximal ulna; the anterior concavity is not a floating crescent.
    P.u(pg([[x + 35, 180], [x + 135, 160], [x + 170, 205], [x + 155, 350], [x + 150, 500], [x + 148, 770], [x + 92, 790], [x + 78, 600], [x + 60, 430], [x + 15, 370], [x + 45, 350], [x + 78, 310], [x + 82, 267], [x + 62, 230], [x + 22, 220]]), 'ap');
    P.s('olecranon', pg([[x + 35, 180], [x + 135, 160], [x + 155, 205], [x + 115, 220], [x + 62, 230], [x + 22, 220]]), 'aps', { anchor: [x + 108, 188] });
    P.s('trochlear-notch', lm([[x + 63, 236, 7], [x + 83, 270, 7], [x + 78, 310, 7], [x + 47, 347, 7], [x + 25, 363, 7]]), 'art', { anchor: [x + 83, 270] });
  } });

/* 15 palmar hand */
add({ key: 'hand-palmar', file: 'skeletal-atlas-15-hand-palmar', purpose: 'right palmar hand: eight carpals, metacarpals and phalanges',
  title: ['Right hand, palmar view: carpals, metacarpals, phalanges', 'Mano derecha, vista palmar: carpos, metacarpianos y falanges'],
  desc: ['Right hand from the palm side, thumb at the viewer\'s left. Proximal carpal row (radial to ulnar): scaphoid, lunate, triquetrum with the pisiform on its palmar surface. Distal row: trapezium, trapezoid, capitate, hamate with its hook. The thumb has 2 phalanges; the other digits have 3.', 'Mano derecha vista por la palma, con el pulgar a la izquierda del observador. Fila proximal del carpo (de radial a cubital): escafoides, semilunar, piramidal con el pisiforme en su cara palmar. Fila distal: trapecio, trapezoide, hueso grande, ganchoso con su gancho. El pulgar tiene 2 falanges; los demás dedos, 3.'],
  orientation: 'right palmar view; thumb at viewer-left; wrist at bottom',
  draw(P) {
    P.u(lm([[640, 960, 34], [650, 800, 30]]), 'ap'); P.u(lm([[800, 960, 24], [790, 800, 22]]), 'ap');
    P.s('radial-styloid', lm([[625, 800, 12], [610, 770, 8]]), 'aps', { r: 0.012 });
    P.s('ulnar-styloid', lm([[815, 805, 9], [820, 775, 6]]), 'aps', { r: 0.012 });
    const mcs = [[[585, 560, 14], [545, 500, 13], [525, 460, 11]], [[655, 575, 12], [645, 480, 11], [640, 385, 10]], [[722, 575, 12], [722, 470, 11], [722, 362, 10]], [[788, 575, 11], [795, 470, 10], [802, 375, 9]], [[848, 585, 10], [865, 500, 9], [878, 425, 8]]];
    mcs.forEach((a, i) => P.s('metacarpals', lm(a), 'ap', i === 2 ? {} : { pin: false }));
    const ph = (x0, y0, dx, lens, w, mid) => { let y = y0; lens.forEach((l, k) => { P.s('phalanges-hand', lm([[x0 + dx * (y0 - y), y - 4, w - k * 0.5], [x0 + dx * (y0 - y + l), y - l + 4, w - k * 0.5 - 0.5]]), 'aps', mid && k === 0 ? {} : { pin: false }); y -= l + 6; }); };
    ph(640, 372, 0.04, [72, 52, 42], 9); ph(722, 350, 0, [82, 58, 44], 9.5, true); ph(803, 362, -0.05, [76, 54, 42], 9); ph(880, 410, -0.1, [58, 40, 36], 8);
    ph(520, 452, 0.6, [60, 52], 11);
    P.s('scaphoid', ell(655, 705, 42, 30, 25), 'bones');
    P.s('lunate', ell(725, 695, 36, 30), 'bones');
    P.s('triquetrum', ell(790, 715, 30, 26), 'bones');
    P.s('pisiform', ell(808, 758, 15, 15), 'bone', { r: 0.012 });
    P.s('trapezium', ell(632, 628, 30, 28, 15), 'bones');
    P.s('trapezoid', ell(692, 612, 24, 22), 'bones');
    P.s('capitate', ell(752, 612, 30, 36), 'bones');
    P.s('hamate', ell(816, 625, 32, 32), 'bones');
    P.s('hook-of-hamate', ell(826, 662, 10, 13), 'bone', { r: 0.012 });
  } });

/* 16 hip bone */
const hipLat = {
  ilium: [[300, 320], [270, 240], [310, 170], [400, 140], [500, 150], [550, 205], [530, 300], [490, 430], [380, 460]],
  ischium: [[350, 590], [375, 660], [345, 745], [290, 775], [240, 745], [280, 640], [320, 540]],
};
add({ key: 'hip-bone', file: 'skeletal-atlas-16-hip-bone', purpose: 'right hip bone lateral and medial views',
  title: ['Right hip bone: lateral (left) and medial (right) views', 'Hueso coxal derecho: vistas lateral (izquierda) y medial (derecha)'],
  desc: ['Right hip bone twice. Lateral view: anterior toward the viewer\'s right; ilium, ischium and pubis meet at the acetabulum, with the obturator foramen below. Medial view: anterior toward the viewer\'s left; the auricular surface of the ilium forms the sacroiliac joint.', 'Hueso coxal derecho dos veces. Vista lateral: anterior hacia la derecha del observador; íleon, isquion y pubis confluyen en el acetábulo, con el foramen obturador debajo. Vista medial: anterior hacia la izquierda; la superficie auricular del íleon forma la articulación sacroilíaca.'],
  orientation: 'right hip bone; lateral panel anterior = viewer-right; medial panel anterior = viewer-left',
  draw(P) {
    P.panel(60, 70, 640, 860); P.panel(740, 70, 650, 860);
    P.s('ilium', pg(hipLat.ilium), 'ap', { at: [0.5, 0.3] });
    P.s('iliac-crest', lm([[285, 235, 8], [320, 170, 8], [400, 142, 8], [500, 150, 8], [548, 203, 8]]), 'aps', { at: [0.35, 0.3] });
    P.s('asis', ell(552, 208, 16, 16), 'art', { r: 0.014 });
    P.s('ischium', pg(hipLat.ischium), 'ap', { at: [0.6, 0.35] });
    P.s('pubis', lm([[485, 600, 22], [555, 650, 20], [570, 730, 18], [510, 775, 18]]), 'ap', { at: [0.6, 0.5] });
    P.u(lm([[380, 780, 18], [450, 785, 18], [510, 775, 18]]), 'ap');
    P.s('ischial-tuberosity', ell(285, 752, 34, 28), 'aps', { r: 0.014 });
    P.u(ell(430, 670, 56, 66), 'hole');
    P.s('obturator-foramen', ell(430, 672, 40, 50), 'hole', { r: 0.014 });
    P.s('acetabulum', ell(430, 540, 70, 75), 'art', { r: 0.02 });
    P.u(pg(mp(hipLat.ilium)), 'ap'); P.u(pg(mp(hipLat.ischium)), 'ap');
    P.u(lm(mp([[485, 600, 22], [555, 650, 20], [570, 730, 18], [510, 775, 18]])), 'ap');
    P.u(ell(mx(430), 672, 50, 60), 'hole');
    P.s('sacroiliac-joint', ell(mx(330), 330, 38, 72, 10), 'art', { r: 0.02 });
  } });

/* 17 femur */
add({ key: 'femur', file: 'skeletal-atlas-17-femur', purpose: 'right femur anterior and posterior views including the linea aspera',
  title: ['Right femur: anterior (left) and posterior (right)', 'Fémur derecho: anterior (izquierda) y posterior (derecha)'],
  desc: ['Right femur twice. Anterior view: the head points medially (viewer\'s right). Posterior view: the head points to the viewer\'s left and the linea aspera runs as a ridge down the back of the shaft. Patella omitted.', 'Fémur derecho dos veces. Vista anterior: la cabeza apunta medialmente (derecha del observador). Vista posterior: la cabeza apunta a la izquierda y la línea áspera recorre como una cresta la parte posterior de la diáfisis. Rótula omitida.'],
  orientation: 'right femur; anterior panel head = viewer-right; posterior panel head = viewer-left; patella omitted',
  draw(P) {
    P.panel(60, 70, 640, 860); P.panel(740, 70, 650, 860);
    P.u(lm([[400, 290, 34], [390, 520, 30], [385, 710, 34]]), 'ap');
    P.s('femoral-neck', lm([[450, 210, 24], [405, 275, 28]]), 'aps');
    P.s('femoral-head', ell(485, 165, 52, 52), 'art');
    P.s('greater-trochanter', ell(340, 215, 36, 54), 'aps');
    P.s('femoral-condyles', ell(350, 840, 42, 46), 'art', { r: 0.02 }); P.u(ell(445, 840, 42, 46), 'art');
    P.u(lm(mp([[400, 290, 34], [390, 520, 30], [385, 710, 34]])), 'ap');
    P.s('femur', lm([[mx(400), 290, 34], [mx(390), 520, 30], [mx(385), 710, 34]]), 'ap', { pin: true, at: [0.5, 0.25] });
    P.u(ell(mx(485), 165, 52, 52), 'art'); P.u(ell(mx(340), 215, 36, 54), 'aps'); P.u(lm([[mx(450), 210, 24], [mx(405), 275, 28]]), 'aps');
    P.u(ell(mx(350), 840, 42, 46), 'art'); P.u(ell(mx(445), 840, 42, 46), 'art');
    P.s('femoral-linea-aspera', lm([[mx(397), 300, 7], [mx(388), 520, 8], [mx(386), 700, 7]]), 'aps', { at: [0.5, 0.65], r: 0.014 });
  } });

/* 18 tibia fibula */
add({ key: 'leg-tibia-fibula', file: 'skeletal-atlas-18-leg-tibia-fibula', purpose: 'right tibia and fibula anterior plus tibial plateau inset',
  title: ['Right leg, anterior view, with tibial-plateau inset', 'Pierna derecha, vista anterior, con recuadro de la meseta tibial'],
  desc: ['Right tibia (medial, viewer\'s right) and fibula (lateral, viewer\'s left) from the front with the ankle mortise at the bottom. Inset: the tibial plateau from above (anterior at top) showing the intercondylar eminence between the two articular surfaces; patella omitted.', 'Tibia derecha (medial, a la derecha del observador) y peroné (lateral, a la izquierda) vistos de frente, con la mortaja del tobillo abajo. Recuadro: la meseta tibial desde arriba (anterior arriba) con la eminencia intercondílea entre las dos superficies articulares; rótula omitida.'],
  orientation: 'right leg anterior view: fibula viewer-left, tibia viewer-right; inset superior view of plateau, anterior at top',
  draw(P) {
    P.panel(880, 110, 480, 780);
    P.u(ell(430, 200, 24, 30), 'bones');
    P.s('fibula', lm([[428, 230, 12], [425, 500, 11], [420, 760, 13], [418, 880, 18]]), 'ap', { at: [0.5, 0.45] });
    P.s('tibia', lm([[535, 190, 62], [542, 330, 34], [545, 600, 26], [550, 800, 34]]), 'ap', { at: [0.5, 0.55] });
    P.s('tibial-tuberosity', ell(545, 320, 20, 28), 'aps', { r: 0.014 });
    P.s('medial-malleolus', lm([[585, 840, 22], [610, 900, 16]]), 'aps', { r: 0.014 });
    P.s('lateral-malleolus', ell(420, 900, 20, 32), 'aps', { r: 0.014 });
    P.s('ankle-mortise', pg([[462, 860], [540, 860], [545, 920], [470, 925]]), 'art', { r: 0.014 });
    const x = 1120;
    P.s('tibial-plateau', pg([[x - 200, 420], [x - 40, 380], [x - 20, 520], [x - 70, 640], [x - 200, 620]]), 'art', { at: [0.4, 0.5], r: 0.02 });
    P.u(pg([[x + 40, 380], [x + 200, 420], [x + 190, 620], [x + 70, 640], [x + 20, 520]]), 'art');
    P.s('intercondylar-eminence', lm([[x - 20, 440, 14], [x, 530, 14], [x + 10, 600, 12]]), 'aps', { r: 0.014 });
    P.u(lm([[x, 330, 26], [x, 300, 14]]), 'aps');
  } });

/* 19 dorsal foot */
add({ key: 'foot-dorsal', file: 'skeletal-atlas-19-foot-dorsal', purpose: 'right dorsal foot: tarsals, metatarsals and toe phalanges',
  title: ['Right foot, dorsal view: tarsals, metatarsals, phalanges', 'Pie derecho, vista dorsal: tarsos, metatarsianos y falanges'],
  desc: ['Right foot from above, toes up, big toe (hallux) at the viewer\'s left. The talus sits above the calcaneus; navicular is medial, cuboid lateral, and the three cuneiforms lie under metatarsals 1-3. The big toe has 2 phalanges; the other toes have 3. "Hallux" is shown as the first-toe phalanges; it is not a separate structure.', 'Pie derecho visto desde arriba, con los dedos hacia arriba y el dedo gordo (hallux) a la izquierda del observador. El astrágalo se apoya sobre el calcáneo; el navicular es medial, el cuboides lateral y las tres cuñas quedan bajo los metatarsianos 1-3. El dedo gordo tiene 2 falanges; los demás, 3. «Hallux» se muestra como las falanges del primer dedo; no es una estructura aparte.'],
  orientation: 'right dorsal view; hallux at viewer-left; heel at bottom',
  draw(P) {
    P.s('calcaneus', ell(775, 820, 62, 120, -8), 'aps', { at: [0.5, 0.8] });
    P.s('talus', ell(655, 735, 72, 85), 'bones');
    P.s('navicular', ell(640, 612, 54, 34), 'bone');
    P.s('cuboid', ell(795, 592, 48, 46), 'bone');
    P.s('medial-cuneiform', ell(578, 535, 30, 32), 'bones'); P.s('intermediate-cuneiform', ell(640, 530, 26, 26), 'bones'); P.s('lateral-cuneiform', ell(702, 532, 28, 28), 'bones');
    const mts = [[[562, 490, 17], [556, 380, 15], [550, 270, 14]], [[626, 490, 12], [622, 380, 11], [620, 270, 10]], [[690, 490, 12], [690, 380, 11], [692, 280, 10]], [[755, 495, 12], [762, 385, 11], [766, 290, 10]], [[830, 520, 12], [850, 400, 11], [862, 310, 10]]];
    mts.forEach((a, i) => P.s('metatarsals', lm(a), 'ap', i === 2 ? {} : { pin: false }));
    const ph = (x, y, lens, w, dx, mid) => { let yy = y; lens.forEach((l, k) => { P.s('phalanges-foot', lm([[x + dx * (y - yy), yy, w - k], [x + dx * (y - yy + l), yy - l, w - k - 0.5]]), 'aps', mid && k === 0 ? {} : { pin: false }); yy -= l + 6; }); };
    ph(548, 258, [64, 48], 15, 0.02, false); ph(619, 258, [34, 26, 20], 9, 0, false); ph(693, 268, [36, 28, 20], 9, 0, true); ph(768, 278, [34, 26, 18], 8, 0.05, false); ph(866, 298, [30, 22, 16], 7, 0.1, false);
  } });

/* 20 generic synovial joint */
add({ key: 'synovial-joint', file: 'skeletal-atlas-20-synovial-joint', purpose: 'generic synovial joint layers (not region-specific)',
  title: ['Generic synovial joint in section', 'Articulación sinovial genérica en corte'],
  desc: ['A diagrammatic synovial joint cut lengthwise, not tied to any one region. Cartilage-capped bone ends bound a joint cavity holding synovial fluid; the synovial membrane lines the fibrous capsule; an external ligament crosses the joint.', 'Una articulación sinovial esquemática cortada a lo largo, sin relación con una región concreta. Los extremos óseos cubiertos de cartílago delimitan una cavidad articular con líquido sinovial; la membrana sinovial reviste la cápsula fibrosa; un ligamento externo cruza la articulación.'],
  orientation: 'schematic lengthwise section; proximal bone at top; no left-right meaning',
  draw(P) {
    P.u(lm([[725, 60, 120], [725, 330, 110]]), 'ap');
    P.u(pg([[560, 330], [640, 400], [725, 420], [810, 400], [890, 330], [850, 300], [600, 300]]), 'ap');
    P.u(lm([[725, 940, 110], [725, 650, 110]]), 'ap');
    P.u(pg([[600, 650], [690, 585], [760, 585], [850, 650]]), 'ap');
    P.s('synovial-joint', ell(725, 500, 330, 220), 'fluid', { fill: 'none', line: 'none', pin: true, at: [0.1, 0.5], r: 0.02 });
    P.s('fibrous-capsule', lm([[560, 330, 14], [520, 420, 14], [530, 500, 14], [520, 580, 14], [570, 660, 14]]), 'cap', { at: [0.5, 0.4], r: 0.014 });
    P.u(lm([[890, 330, 14], [930, 420, 14], [920, 500, 14], [930, 580, 14], [880, 660, 14]]), 'cap');
    P.s('synovial-membrane', lm([[600, 345, 5], [575, 420, 5], [582, 500, 5], [575, 580, 5], [615, 640, 5]]), 'lig', { at: [0.5, 0.5], r: 0.012 });
    P.u(lm([[850, 345, 5], [875, 420, 5], [868, 500, 5], [875, 580, 5], [835, 640, 5]]), 'lig');
    P.s('articular-cartilage', pg([[610, 355], [725, 435], [840, 355], [850, 370], [725, 455], [600, 370]]), 'art', { r: 0.014 });
    P.u(pg([[620, 650], [700, 598], [750, 598], [830, 650], [830, 635], [750, 580], [700, 580], [620, 635]]), 'art');
    P.s('joint-cavity', pg([[640, 470], [725, 490], [810, 470], [820, 540], [725, 560], [630, 540]]), 'hole', { fill: '#C6D6DC', r: 0.016 });
    P.s('synovial-fluid', ell(725, 520, 40, 14), 'fluid', { r: 0.012 });
    P.s('ligament', lm([[570, 250, 12], [560, 400, 10], [570, 700, 12]]), 'lig', { at: [0.5, 0.2], r: 0.014 });
  } });

/* 21 shoulder */
add({ key: 'shoulder-joint', file: 'skeletal-atlas-21-shoulder-joint', purpose: 'shoulder (glenohumeral and acromioclavicular) relationships',
  title: ['Right shoulder joint relationships, anterior view', 'Relaciones de la articulación del hombro derecho, vista anterior'],
  desc: ['Right shoulder from the front. The humerus is at the viewer\'s left; its head points medially (viewer\'s right) into the glenoid cavity of the scapula. Glenohumeral ligaments strengthen the front of the capsule; the acromioclavicular ligament joins clavicle and acromion above. Patient right is on the viewer\'s left.', 'Hombro derecho visto de frente. El húmero queda a la izquierda del observador; su cabeza apunta medialmente (derecha del observador) hacia la cavidad glenoidea de la escápula. Los ligamentos glenohumerales refuerzan la parte anterior de la cápsula; el ligamento acromioclavicular une clavícula y acromion arriba. La derecha del paciente queda a la izquierda del observador.'],
  orientation: 'right shoulder anterior view; humerus viewer-left, scapula viewer-right',
  draw(P) {
    P.s('scapula', pg([[640, 380], [700, 330], [900, 300], [950, 520], [880, 800], [760, 700], [670, 590]]), 'aps', { at: [0.65, 0.6] });
    P.u(lm([[470, 520, 40], [430, 700, 30], [410, 900, 28]]), 'ap');
    P.s('greater-tubercle', ell(480, 440, 34, 40), 'aps');
    P.s('humeral-head', ell(560, 480, 72, 76), 'ap', { at: [0.4, 0.5] });
    P.s('glenoid-cavity', ell(650, 480, 22, 60), 'art');
    P.s('shoulder-joint', ell(618, 480, 7, 58), 'hole', { r: 0.014 });
    P.s('glenohumeral-ligaments', lm([[650, 425, 10], [600, 405, 10], [560, 425, 10]]), 'lig', { r: 0.014 });
    P.u(lm([[650, 540, 10], [600, 552, 10], [560, 532, 10]]), 'lig');
    P.s('acromion', lm([[790, 310, 16], [680, 285, 14], [560, 290, 13], [500, 335, 12]]), 'aps');
    P.s('coracoid-process', lm([[700, 380, 16], [650, 350, 14], [605, 372, 12]]), 'aps');
    P.s('clavicle', lm([[520, 292, 10], [700, 250, 9], [880, 230, 9], [1050, 250, 9], [1150, 295, 9]]), 'ap', { at: [0.7, 0.4] });
    P.s('acromioclavicular-ligament', lm([[520, 296, 10], [565, 288, 10]]), 'lig', { r: 0.014 });
  } });

/* 22 knee */
const kneeLeg = (P, dx, withPatella) => {
  const X = (x) => x + dx;
  P.u(lm([[X(1050), 60, 70], [X(1050), 250, 75]]), 'ap');
  P.u(lm([[X(930), 600, 16], [X(930), 900, 14]]), 'ap');
  P.u(lm([[X(1050), 560, 60], [X(1050), 900, 45]]), 'ap');
  P.u(ell(X(930), 560, 28, 38), 'bones');
  P.u(pg([[X(930), 500], [X(1170), 500], [X(1190), 545], [X(920), 545]]), 'ap');
};
add({ key: 'knee-joint', file: 'skeletal-atlas-22-knee-joint', purpose: 'right knee: anterior surface ligaments and deep cruciate layout',
  title: ['Right knee: anterior layer (left) and deep cruciates, patella omitted (right)', 'Rodilla derecha: capa anterior (izquierda) y cruzados profundos, sin rótula (derecha)'],
  desc: ['Right knee from the front, patient right at the viewer\'s left, so the fibular head and lateral collateral ligament are at the left and the medial collateral ligament at the right. Left panel: patella with the patellar ligament. Right panel: patella omitted to show the deep layer: the ACL runs from the lateral femoral condyle to the anterior tibial intercondylar area; the PCL runs from the posterior tibial intercondylar area to the medial femoral condyle, passing behind the ACL.', 'Rodilla derecha vista de frente, con la derecha del paciente a la izquierda del observador, de modo que la cabeza del peroné y el ligamento colateral lateral quedan a la izquierda y el ligamento colateral medial a la derecha. Panel izquierdo: rótula con el ligamento rotuliano. Panel derecho: rótula omitida para mostrar la capa profunda: el LCA va del cóndilo femoral lateral al área intercondílea anterior de la tibia; el LCP va del área intercondílea posterior de la tibia al cóndilo femoral medial, pasando por detrás del LCA.'],
  orientation: 'right knee anterior view; lateral (fibula, LCL) at viewer-left; medial (MCL) at viewer-right; patella omitted in right panel',
  draw(P) {
    P.panel(40, 40, 700, 920); P.panel(740, 40, 680, 920);
    const A = -650;
    // panel A
    kneeLeg(P, A, true);
    P.u(ell(A + 990, 330, 70, 80), 'art'); P.u(ell(A + 1110, 330, 70, 80), 'art');
    P.s('patella', ell(400, 345, 52, 62), 'bones', { r: 0.02 });
    P.s('patellar-ligament', lm([[400, 405, 20], [400, 500, 17], [402, 600, 22]]), 'lig', { r: 0.014 });
    P.s('tibial-tuberosity', ell(402, 640, 28, 26), 'aps', { r: 0.014 });
    P.s('lcl', lm([[A + 925, 350, 8], [A + 925, 450, 8], [A + 930, 545, 8]]), 'lig', { r: 0.012 });
    P.s('mcl', lm([[A + 1175, 360, 11], [A + 1180, 500, 11], [A + 1160, 640, 11]]), 'lig', { r: 0.014 });
    P.s('knee-joint', ell(400, 480, 120, 10), 'hole', { r: 0.02 });
    // panel B
    kneeLeg(P, 0, false);
    P.s('femoral-condyles', ell(990, 330, 70, 80), 'art', { at: [0.3, 0.6], r: 0.02 }); P.u(ell(1110, 330, 70, 80), 'art');
    P.s('intercondylar-eminence', ell(1050, 493, 20, 16), 'aps', { r: 0.014 });
    P.u(lm([[1075, 360, 9], [1055, 440, 10], [1035, 505, 9]]), 'lig'); // PCL behind
    P.s('pcl', lm([[1077, 352, 8], [1062, 430, 9], [1036, 500, 8]]), 'lig', { r: 0.012, anchor: [1077, 352] });
    P.s('acl', lm([[1024, 350, 8], [1042, 430, 9], [1068, 498, 8]]), 'lig', { r: 0.012, anchor: [1024, 350] });
    P.u(lm([[925, 350, 8], [925, 450, 8], [930, 545, 8]]), 'lig'); P.u(lm([[1175, 360, 11], [1180, 500, 11], [1160, 640, 11]]), 'lig');
  } });

/* ---- write ---- */
const sha = (buf) => createHash('sha256').update(buf).digest('hex');
const refs = [
  { url: 'https://www.ncbi.nlm.nih.gov/books/NBK499834', publisher: 'NCBI Bookshelf / StatPearls (skull anatomy, text only)' },
  { url: 'https://www.ncbi.nlm.nih.gov/books/NBK535397', publisher: 'NCBI Bookshelf / StatPearls (appendicular skeleton, text only)' },
  { url: 'https://www.ncbi.nlm.nih.gov/books/NBK535382', publisher: 'NCBI Bookshelf / StatPearls (carpal rows, text only)' },
  { url: 'https://www.ncbi.nlm.nih.gov/books/NBK545260', publisher: 'NCBI Bookshelf / StatPearls (forearm, text only)' },
  { url: 'https://www.ncbi.nlm.nih.gov/books/NBK535416', publisher: 'NCBI Bookshelf / StatPearls (PCL attachments, text only)' },
  { url: 'https://www.ncbi.nlm.nih.gov/books/NBK559233', publisher: 'NCBI Bookshelf / StatPearls (ACL, text only)' },
  { url: 'https://www.ncbi.nlm.nih.gov/books/NBK507780', publisher: 'NCBI Bookshelf / StatPearls (MCL, text only)' },
  { url: 'https://www.ncbi.nlm.nih.gov/sites/books/NBK535432', publisher: 'NCBI Bookshelf / StatPearls (foramen spinosum posterolateral to foramen ovale, text only)' },
  { url: 'https://training.seer.cancer.gov/anatomy/skeletal/divisions/axial.html', publisher: 'NCI SEER Training Modules (text only)' },
];
const rights = 'Original Boneefied project artwork (skeletal atlas, BVIS02); all rights reserved by Boneefied. No CC0 or public-domain dedication is granted.';
const prov = [], generated = [];
const fixes = { 'vertebra-typical': FX.drawVertebraTypical, 'vertebrae-regional': FX.drawVertebraeRegional, humerus: FX.drawHumerus, femur: FX.drawFemur, 'hip-bone': FX.drawHip, 'hand-palmar': FX.drawHand, 'foot-dorsal': FX.drawFoot };
for (const p of plates) if (fixes[p.key]) { const orig = p.draw; p.draw = (P) => { void orig; fixes[p.key](P); }; }
plates.forEach((p, i) => {
  const P = new Plate();
  P.raw(`<rect id="background" width="${W}" height="${H}" fill="${C.paper}"/>`);
  p.draw(P);
  const svgText = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">\n<title>${p.title[0]}</title>\n<desc>${p.desc[0]}</desc>\n${P.svg()}\n</svg>\n`;
  const svgRel = `assets/images/anatomy/skeletal-atlas/${p.file}.svg`, pngRel = `assets/images/anatomy/skeletal-atlas/${p.file}.png`;
  writeFileSync(join(root, svgRel), svgText);
  execFileSync('convert', ['-density', '96', '-background', C.paper, join(root, svgRel), '-resize', `${W}x${H}!`, join(root, pngRel)], { stdio: 'ignore' });
  const id = p.replaces ?? `asset-skeletal-atlas-${p.key}`;
  const labels = P.labels;
  prov.push({
    id, plate: i + 1, disposition: p.replaces ? 'replacement' : 'addition', preservesReplacedId: p.replaces ?? null, creator: 'Boneefied', rights,
    svgPath: svgRel, pngPath: pngRel, notice: 'Original authorship: drawn from scratch by scripts/atlas/skeletal-generate.mjs. No third-party illustration traced, copied or downloaded; NIH StatPearls figures are not public domain and were not used.',
    references: refs.map((r) => ({ ...r, checked: '2026-10-10', use: 'text-only factual reference; no images imported' })),
    purpose: p.purpose, orientation: p.orientation, dimensions: { width: W, height: H, aspectRatio: CANVAS.aspect },
    featureAnchorMapping: labels.map((l) => ({ structureId: l.structureId, x: l.x, y: l.y, radius: l.radius, derivedFrom: l.anchor, shapeBox: l.shapeBox })),
    sha256: { svg: sha(readFileSync(join(root, svgRel))), png: sha(readFileSync(join(root, pngRel))) },
  });
  generated.push({ id, key: p.key, replaces: p.replaces ?? null, svgPath: svgRel, pngPath: pngRel, title: p.title, description: p.desc, orientation: p.orientation, labels: labels.map(({ structureId, x, y, radius }) => ({ structureId, x, y, radius })) });
});
writeFileSync(join(outDir, 'provenance.json'), JSON.stringify({ pack: 'boneefied-skeletal-atlas', generatedBy: 'scripts/atlas/skeletal-generate.mjs', plates: prov }, null, 2) + '\n');
writeFileSync(join(root, 'content/skeletal-atlas-plates.generated.ts'), `// GENERATED by scripts/atlas/skeletal-generate.mjs - do not edit by hand.\nexport interface SkeletalPlateLabel { structureId: string; x: number; y: number; radius: number }\nexport interface SkeletalPlate { id: string; key: string; replaces: string | null; svgPath: string; pngPath: string; title: [string, string]; description: [string, string]; orientation: string; labels: SkeletalPlateLabel[] }\nexport const skeletalPlates: SkeletalPlate[] = ${JSON.stringify(generated, null, 2)} as SkeletalPlate[];\n`);
console.log(`wrote ${plates.length} plates`);
