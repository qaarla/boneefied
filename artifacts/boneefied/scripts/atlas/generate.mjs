// Generates the 10 Boneefied foundational atlas plates (SVG + PNG), provenance.json and content/atlas-plates.generated.ts.
// Usage: node scripts/atlas/generate.mjs   (needs ImageMagick `convert`/`magick` with the rsvg delegate)
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CANVAS, PALETTE as C, STROKE as S, LAYOUT } from './tokens.mjs';
import { smooth, mirrored, limb, ellipse, line, unit, stroked, filled, bodySilhouette, surfaceDetail, skeletonFigure, organFigure, torsoCropPath } from './base.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outDir = join(root, 'assets/images/anatomy/atlas');
mkdirSync(outDir, { recursive: true });
const { width: W, height: H } = CANVAS;

const NAMES = {
  'cephalic-region': ['Head (cephalic) region', 'Región cefálica (cabeza)'], 'cervical-region': ['Neck (cervical) region', 'Región cervical (cuello)'],
  'thoracic-region': ['Chest (thoracic) region', 'Región torácica (tórax)'], 'axillary-region': ['Armpit (axillary) region', 'Región axilar'],
  'brachial-region': ['Upper arm (brachial) region', 'Región braquial (brazo)'], 'antebrachial-region': ['Forearm (antebrachial) region', 'Región antebraquial (antebrazo)'],
  'abdominal-region': ['Abdominal region', 'Región abdominal'], 'femoral-region': ['Thigh (femoral) region', 'Región femoral (muslo)'],
  'patellar-region': ['Front of knee (patellar) region', 'Región patelar (rodilla anterior)'], 'crural-region': ['Leg (crural) region', 'Región crural (pierna)'],
  'popliteal-region': ['Back of knee (popliteal) region', 'Región poplítea (hueco de la rodilla)'], posterior: ['Posterior (back)', 'Posterior (dorso)'],
  'sagittal-plane': ['Sagittal plane', 'Plano sagital'], 'coronal-plane': ['Coronal plane', 'Plano coronal'], 'transverse-plane': ['Transverse plane', 'Plano transversal'],
  'cranial-cavity': ['Cranial cavity', 'Cavidad craneal'], 'vertebral-cavity': ['Vertebral cavity', 'Cavidad vertebral'], 'thoracic-cavity': ['Thoracic cavity', 'Cavidad torácica'],
  diaphragm: ['Diaphragm', 'Diafragma'], 'abdominal-cavity': ['Abdominal cavity', 'Cavidad abdominal'], 'pelvic-cavity': ['Pelvic cavity', 'Cavidad pélvica'],
  kidneys: ['Kidney (retroperitoneal)', 'Riñón (retroperitoneal)'], 'visceral-pleura': ['Visceral pleura', 'Pleura visceral'], 'pleural-cavity': ['Pleural cavity (thin space)', 'Cavidad pleural (espacio delgado)'],
  'parietal-pleura': ['Parietal pleura', 'Pleura parietal'],
  'right-upper-quadrant': ['Right upper quadrant', 'Cuadrante superior derecho'], 'left-upper-quadrant': ['Left upper quadrant', 'Cuadrante superior izquierdo'],
  'right-lower-quadrant': ['Right lower quadrant', 'Cuadrante inferior derecho'], 'left-lower-quadrant': ['Left lower quadrant', 'Cuadrante inferior izquierdo'],
  'right-hypochondriac-region': ['Right hypochondriac region', 'Región hipocondríaca derecha'], 'epigastric-region': ['Epigastric region', 'Región epigástrica'],
  'left-hypochondriac-region': ['Left hypochondriac region', 'Región hipocondríaca izquierda'], 'right-lumbar-region': ['Right lumbar region', 'Región lumbar derecha'],
  'umbilical-region': ['Umbilical region', 'Región umbilical'], 'left-lumbar-region': ['Left lumbar region', 'Región lumbar izquierda'],
  'right-iliac-region': ['Right iliac region', 'Región ilíaca derecha'], 'hypogastric-region': ['Hypogastric region', 'Región hipogástrica'], 'left-iliac-region': ['Left iliac region', 'Región ilíaca izquierda'],
  brain: ['Brain', 'Encéfalo'], lungs: ['Lungs', 'Pulmones'], heart: ['Heart', 'Corazón'], liver: ['Liver', 'Hígado'], stomach: ['Stomach', 'Estómago'], spleen: ['Spleen', 'Bazo'],
  pancreas: ['Pancreas', 'Páncreas'], 'urinary-system-urinary-bladder': ['Urinary bladder', 'Vejiga urinaria'],
  skull: ['Skull', 'Cráneo'], mandible: ['Mandible', 'Mandíbula'], clavicle: ['Clavicle', 'Clavícula'], sternum: ['Sternum', 'Esternón'],
  'true-ribs': ['True ribs (1-7)', 'Costillas verdaderas (1-7)'], 'false-ribs': ['False ribs (8-10)', 'Costillas falsas (8-10)'], 'floating-ribs': ['Floating ribs (11-12)', 'Costillas flotantes (11-12)'],
  humerus: ['Humerus', 'Húmero'], radius: ['Radius', 'Radio'], pelvis: ['Pelvis (hip bone)', 'Pelvis (hueso coxal)'], femur: ['Femur', 'Fémur'], patella: ['Patella', 'Rótula'],
  tibia: ['Tibia', 'Tibia'], fibula: ['Fibula', 'Peroné'], scapula: ['Scapula', 'Escápula'], 'cervical-vertebrae': ['Cervical vertebrae', 'Vértebras cervicales'],
  'thoracic-vertebrae': ['Thoracic vertebrae', 'Vértebras torácicas'], 'lumbar-vertebrae': ['Lumbar vertebrae', 'Vértebras lumbares'], sacrum: ['Sacrum', 'Sacro'], coccyx: ['Coccyx', 'Cóccix'],
};

const plates = [];
const header = (title, desc, body) => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">\n<title>${title}</title>\n<desc>${desc}</desc>\n<rect id="background" width="${W}" height="${H}" fill="${C.paper}"/>\n${body}\n</svg>\n`;
const fig = (cx, oy, s, inner, id = 'figure') => `<g id="${id}" transform="translate(${cx} ${oy}) scale(${s})">${inner}</g>`;
const mkLabels = (cx, oy, s, list) => list.map(([id, lx, ly, r = 0.022]) => ({ structureId: id, x: +((cx + lx * s) / W).toFixed(4), y: +((oy + ly * s) / H).toFixed(4), radius: r }));
const px = (list) => list.map(([id, x, y, r = 0.022]) => ({ structureId: id, x: +(x / W).toFixed(4), y: +(y / H).toFixed(4), radius: r }));
const add = (p) => plates.push(p);
const [cx0, oy0] = [LAYOUT.figureCx, LAYOUT.figureTop];

/* 1 + 2: anatomical position */
const surf = (view) => bodySilhouette(view) + surfaceDetail(view);
add({
  key: 'anterior-position', file: 'atlas-01-anterior-position', purpose: 'anterior anatomical position: regional terms',
  title: ['Anterior anatomical position', 'Posición anatómica anterior'],
  desc: ['Standing figure seen from the front, palms forward and thumbs lateral. Patient right is on the viewer\'s left.', 'Figura de pie vista de frente, con las palmas hacia delante y los pulgares laterales. La derecha del paciente queda a la izquierda del observador.'],
  orientation: 'anterior view; patient right = viewer left; palms forward; thumbs lateral',
  svg: () => fig(cx0, oy0, 1, surf('anterior')),
  labels: mkLabels(cx0, oy0, 1, [['cephalic-region', 0, 40], ['cervical-region', 0, 126], ['thoracic-region', -30, 205], ['axillary-region', -96, 166], ['brachial-region', -122, 250], ['antebrachial-region', -158, 388], ['abdominal-region', 28, 330], ['femoral-region', -52, 520], ['patellar-region', -44, 618], ['crural-region', -46, 720]]),
});
add({
  key: 'posterior-position', file: 'atlas-02-posterior-position', purpose: 'posterior anatomical position: regional terms',
  title: ['Posterior anatomical position', 'Posición anatómica posterior'],
  desc: ['Standing figure seen from behind with the same limb position. Patient right is on the viewer\'s right.', 'Figura vista desde atrás con la misma posición de las extremidades. La derecha del paciente queda a la derecha del observador.'],
  orientation: 'posterior view; patient right = viewer right; palms forward; thumbs lateral',
  svg: () => fig(cx0, oy0, 1, surf('posterior')),
  labels: mkLabels(cx0, oy0, 1, [['cephalic-region', 0, 30], ['cervical-region', 0, 126], ['posterior', 0, 235], ['brachial-region', 122, 250], ['antebrachial-region', 158, 388], ['femoral-region', 52, 520], ['popliteal-region', 42, 598], ['crural-region', 46, 720]]),
});

/* 3: planes */
{
  const centers = [270, 725, 1180], s = 0.74, oy = 150;
  const pane = (kind) => {
    const col = { sag: C.planeSagittal, cor: C.planeCoronal, tra: C.planeTransverse }[kind];
    const pts = { sag: [[-80, 10], [80, -30], [80, 850], [-80, 890]], cor: [[-230, -14], [230, -14], [230, 880], [-230, 880]], tra: [[-210, 360], [150, 360], [210, 310], [-150, 310]] }[kind];
    return `<path id="plane-${kind}" d="${line(pts)}Z" fill="${col}" fill-opacity=".3" stroke="${col}" stroke-width="2.4" stroke-linejoin="round"/>`;
  };
  const body = [['sag', 0], ['cor', 1], ['tra', 2]].map(([k, i]) => fig(centers[i], oy, s, surf('anterior') + pane(k), `panel-${k}`)).join('');
  const lbl = [
    ...mkLabels(centers[0], oy, s, [['sagittal-plane', 54, -2, 0.03]]),
    ...mkLabels(centers[1], oy, s, [['coronal-plane', 205, 120, 0.035]]),
    ...mkLabels(centers[2], oy, s, [['transverse-plane', 172, 326, 0.03]]),
  ];
  add({
    key: 'body-planes', file: 'atlas-03-body-planes', purpose: 'compare sagittal, coronal and transverse planes',
    title: ['Three body planes compared', 'Comparación de los tres planos corporales'],
    desc: ['Three panels, left to right: sagittal plane (left and right parts), coronal plane (front and back parts) and transverse plane (upper and lower parts).', 'Tres paneles, de izquierda a derecha: plano sagital (partes izquierda y derecha), plano coronal (partes anterior y posterior) y plano transversal (partes superior e inferior).'],
    orientation: 'anterior views; panels ordered sagittal, coronal, transverse',
    svg: () => body, labels: lbl,
  });
}

/* 4: cavities + serous inset */
{
  const sh = -170;
  const P = (x, y) => [x + sh, y];
  const skin = unit([ellipse(640, 168, 86, 94), limb([[650, 250, 48], [650, 300, 52]]), limb([[556, 172, 6], [552, 182, 5]]), smooth([[594, 290], [560, 320], [548, 380], [546, 440], [556, 520], [566, 600], [574, 680], [576, 760], [580, 840], [584, 930], [748, 930], [752, 840], [756, 760], [766, 700], [752, 620], [746, 520], [752, 420], [754, 330], [726, 292]], true)], { fill: C.skin, line: C.skinLine, width: S.outline });
  const reg = (pts, fill, id) => `<path id="${id}" d="${smooth(pts, true)}" fill="${fill}" stroke="${C.ink}" stroke-width="${S.detail}" stroke-linejoin="round"/>`;
  const thor = [[574, 306], [612, 292], [690, 296], [708, 336], [708, 470], [692, 506], [596, 498], [574, 440], [568, 360]];
  const abd = [[578, 510], [660, 486], [704, 516], [712, 640], [584, 656], [572, 600]];
  const pel = [[586, 660], [712, 646], [724, 730], [704, 800], [650, 812], [606, 780]];
  const spine = Array.from({ length: 18 }, (_, i) => ellipse(722, 236 + i * 31, 13, 11)).join('');
  let main = skin;
  main += `<path id="cranial-cavity" d="${ellipse(640, 160, 72, 66)}" fill="${C.cavityCranial}" stroke="${C.ink}" stroke-width="${S.detail}"/>`;
  main += `<path id="brain" d="${ellipse(640, 164, 58, 50)}" fill="${C.brain}" stroke="${C.ink}" stroke-width="${S.fine}"/>`;
  main += reg(thor, C.cavityThoracic, 'thoracic-cavity') + reg(abd, C.cavityAbdominal, 'abdominal-cavity') + reg(pel, C.cavityPelvic, 'pelvic-cavity');
  main += `<path d="${spine}" fill="${C.boneShade}" stroke="${C.boneLine}" stroke-width="${S.fine}"/>`;
  main += `<path id="vertebral-canal" d="${limb([[700, 226, 4], [740, 252, 5], [744, 330, 5], [744, 480, 5], [746, 620, 5], [748, 780, 5]])}" fill="${C.cavityVertebral}" stroke="${C.ink}" stroke-width="${S.fine}"/>`;
  const lung = smooth([[620, 312], [668, 306], [698, 346], [702, 440], [688, 486], [626, 480], [612, 420], [614, 350]], true);
  main += `<path d="${lung}" fill="${C.lung}" stroke="${C.serous}" stroke-width="9" stroke-linejoin="round"/><path id="lung" d="${lung}" fill="${C.lung}" stroke="${C.ink}" stroke-width="${S.fine}" stroke-linejoin="round"/>`;
  main += `<path id="heart" d="${ellipse(598, 426, 24, 38)}" fill="${C.heart}" stroke="${C.ink}" stroke-width="${S.fine}"/>`;
  main += stroked(smooth([[570, 502], [610, 472], [650, 468], [690, 478], [708, 506]]), C.muscle, 10) + stroked(smooth([[570, 502], [610, 472], [650, 468], [690, 478], [708, 506]]), C.ink, S.fine);
  main += `<path d="${smooth([[596, 500], [610, 520], [660, 530], [674, 506], [640, 488]], true)}" fill="${C.liver}" stroke="${C.ink}" stroke-width="${S.fine}"/>`;
  main += `<path d="${smooth([[604, 600], [624, 570], [670, 574], [684, 610], [660, 640], [620, 640]], true)}" fill="${C.intestine}" stroke="${C.ink}" stroke-width="${S.fine}"/>`;
  main += `<path d="${ellipse(700, 566, 11, 30)}" fill="${C.kidney}" stroke="${C.ink}" stroke-width="${S.fine}"/>`;
  main += stroked(smooth([[686, 508], [688, 570], [686, 630]]), '#8B7740', 2.6);
  main += `<path d="${smooth([[600, 740], [618, 722], [640, 740], [632, 764], [608, 764]], true)}" fill="${C.bladder}" stroke="${C.ink}" stroke-width="${S.fine}"/>`;
  main += stroked(line([[582, 654], [712, 644]]), C.ink, 1.2, ` stroke-dasharray="${S.dash}"`);
  const body = `<g id="lateral-section" transform="translate(${sh} 0)">${main}</g>`;
  // inset: thin serous space between pleural layers
  const ix = 1040, iy = 500, ir = 270;
  let inset = `<defs><clipPath id="inset-clip"><circle cx="${ix}" cy="${iy}" r="${ir}"/></clipPath></defs><g id="serous-inset" clip-path="url(#inset-clip)">`;
  inset += `<rect x="770" y="230" width="240" height="540" fill="${C.lung}"/>`;
  inset += stroked(smooth([[790, 260], [850, 400], [800, 560], [880, 700]]), C.lungShade ?? '#8FA6B0', 3);
  inset += `<rect x="1010" y="230" width="8" height="540" fill="#9A8650"/><rect x="1018" y="230" width="28" height="540" fill="#EFE1B8"/><rect x="1046" y="230" width="8" height="540" fill="#9A8650"/>`;
  inset += `<rect x="1054" y="230" width="126" height="540" fill="${C.muscle}"/><rect x="1180" y="230" width="140" height="540" fill="${C.skin}"/>`;
  inset += [380, 560].map((y) => `<path d="${ellipse(1112, y, 22, 40)}" fill="${C.bone}" stroke="${C.boneLine}" stroke-width="2"/>`).join('');
  inset += `</g><circle cx="${ix}" cy="${iy}" r="${ir}" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
  inset += stroked(line([[392, 400], [772, 470]]), C.ink, 1.4, ` stroke-dasharray="${S.dash}"`) + `<circle cx="392" cy="400" r="14" fill="none" stroke="${C.ink}" stroke-width="2"/>`;
  add({
    key: 'body-cavities', file: 'atlas-04-body-cavities', purpose: 'major body cavities and the thin serous pleural space',
    title: ['Major body cavities with serous-space inset', 'Cavidades corporales principales con detalle del espacio seroso'],
    desc: ['Lateral section facing viewer-left: cranial, vertebral, thoracic, abdominal and pelvic cavities, the diaphragm and a retroperitoneal kidney. The circular inset enlarges the pleural layers: lung, visceral pleura, thin pleural cavity, parietal pleura and chest wall. Spaces are tinted regions; organs are separate shapes.', 'Corte lateral orientado hacia la izquierda: cavidades craneal, vertebral, torácica, abdominal y pélvica, diafragma y un riñón retroperitoneal. El recuadro circular amplía las capas pleurales: pulmón, pleura visceral, delgada cavidad pleural, pleura parietal y pared torácica. Los espacios son regiones teñidas; los órganos son formas distintas.'],
    orientation: 'lateral section; anterior toward viewer-left; inset shows lung at left and chest wall at right',
    svg: () => body + inset,
    labels: [
      ...px([['cranial-cavity', 640 + sh, 104], ['thoracic-cavity', 588 + sh, 336], ['diaphragm', 650 + sh, 470], ['abdominal-cavity', 584 + sh, 590], ['pelvic-cavity', 664 + sh, 776], ['kidneys', 700 + sh, 566, 0.016], ['vertebral-cavity', 745 + sh, 480, 0.012]]),
      ...px([['visceral-pleura', 1014, 410, 0.012], ['pleural-cavity', 1032, 500, 0.012], ['parietal-pleura', 1050, 590, 0.012]]),
    ],
  });
}

/* 5 + 6: abdominal quadrants / regions on a torso study */
{
  const s = 2.2, oy = 80 - 104 * s, cx = 725;
  const torso = torsoCropPath();
  const base = `<defs><clipPath id="torso-clip"><path d="${torso}"/></clipPath></defs>${unit([torso], { fill: C.skinLight, line: C.skinLine, width: 1.1 })}`;
  const landmarks = `${stroked(smooth([[10, 250], [40, 276], [74, 306]]), C.skinLine, 0.8)}${stroked(smooth([[-10, 250], [-40, 276], [-74, 306]]), C.skinLine, 0.8)}${stroked(smooth([[-70, 430], [-40, 440], [-8, 462]]), C.skinLine, 0.8)}${stroked(smooth([[70, 430], [40, 440], [8, 462]]), C.skinLine, 0.8)}${filled(ellipse(0, 332, 3, 4.2), C.skin, C.skinLine, 1)}${filled(ellipse(-74, 398, 3, 3), C.skin, C.skinLine, 0.8)}${filled(ellipse(74, 398, 3, 3), C.skin, C.skinLine, 0.8)}${filled(ellipse(-50, 226, 3.2, 3.2), C.skin, C.skinLine, 0.8)}${filled(ellipse(50, 226, 3.2, 3.2), C.skin, C.skinLine, 0.8)}${stroked(smooth([[-14, 150], [-48, 146], [-92, 154]]), C.skinLine, 0.8)}${stroked(smooth([[14, 150], [48, 146], [92, 154]]), C.skinLine, 0.8)}`;
  const rect = (x0, y0, x1, y1, fill, op = 0.5) => `<path d="M${x0} ${y0}H${x1}V${y1}H${x0}Z" fill="${fill}" fill-opacity="${op}"/>`;
  const q = C.quadrants;
  const quads = `<g clip-path="url(#torso-clip)">${rect(-130, 250, 0, 332, q[0])}${rect(0, 250, 130, 332, q[1])}${rect(-130, 332, 0, 466, q[2])}${rect(0, 332, 130, 466, q[3])}<g clip-path="url(#torso-clip)">${stroked(line([[0, 236], [0, 466]]), C.ink, 1.5)}${stroked(line([[-100, 332], [100, 332]]), C.ink, 1.5)}</g></g>`;
  const xs = [-130, -38, 38, 130], ys = [250, 286, 392, 466];
  const tints = [[C.regionA, C.regionB, C.regionA], [C.regionB, C.regionC, C.regionB], [C.regionA, C.regionB, C.regionA]];
  let cells = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) cells += rect(xs[c], ys[r], xs[c + 1], ys[r + 1], tints[r][c], r === 1 && c === 1 ? 0.75 : 0.6);
  const nine = `<g clip-path="url(#torso-clip)">${cells}${[-38, 38].map((x) => stroked(line([[x, 236], [x, 466]]), C.ink, 1.5)).join('')}${[286, 392].map((y) => stroked(line([[-100, y], [100, y]]), C.ink, 1.5)).join('')}</g>`;
  add({
    key: 'abdominal-quadrants', file: 'atlas-05-abdominal-quadrants', purpose: 'four clinical abdominal quadrants',
    title: ['Four abdominal quadrants', 'Los cuatro cuadrantes abdominales'],
    desc: ['Anterior torso divided by a vertical midline and a horizontal line through the navel. Right and left are the patient\'s: patient right is on the viewer\'s left.', 'Torso anterior dividido por una línea media vertical y una línea horizontal a través del ombligo. Derecha e izquierda son las del paciente: la derecha del paciente queda a la izquierda del observador.'],
    orientation: 'anterior torso; patient right = viewer left; split at the navel',
    svg: () => fig(cx, oy, s, base + quads + landmarks, 'torso'),
    labels: mkLabels(cx, oy, s, [['right-upper-quadrant', -50, 292, 0.06], ['left-upper-quadrant', 50, 292, 0.06], ['right-lower-quadrant', -50, 400, 0.06], ['left-lower-quadrant', 50, 400, 0.06]]),
  });
  add({
    key: 'abdominal-regions', file: 'atlas-06-abdominal-regions', purpose: 'nine abdominopelvic regions',
    title: ['Nine abdominal regions', 'Las nueve regiones abdominales'],
    desc: ['Anterior torso divided by two vertical and two horizontal lines into a three-by-three grid; the umbilical region is the central square. Patient right is on the viewer\'s left.', 'Torso anterior dividido por dos líneas verticales y dos horizontales en una cuadrícula de tres por tres; la región umbilical es el cuadro central. La derecha del paciente queda a la izquierda del observador.'],
    orientation: 'anterior torso; patient right = viewer left; 3 x 3 grid',
    svg: () => fig(cx, oy, s, base + nine + landmarks, 'torso'),
    labels: mkLabels(cx, oy, s, [['right-hypochondriac-region', -64, 268, 0.04], ['epigastric-region', 0, 268, 0.04], ['left-hypochondriac-region', 64, 268, 0.04], ['right-lumbar-region', -64, 339, 0.04], ['umbilical-region', 0, 362, 0.04], ['left-lumbar-region', 64, 339, 0.04], ['right-iliac-region', -64, 428, 0.04], ['hypogastric-region', 0, 428, 0.04], ['left-iliac-region', 64, 428, 0.04]]),
  });
}

/* 7: organs */
add({
  key: 'organ-locations', file: 'atlas-07-organ-locations', purpose: 'whole-body organ locations',
  title: ['Whole-body organ locations', 'Ubicación de los órganos en todo el cuerpo'],
  desc: ['Anterior view of the major organs in place. Liver on the patient\'s right (viewer left); stomach and spleen on the patient\'s left; heart left of midline with its apex to the viewer\'s right; kidneys lie behind the abdominal organs (dashed).', 'Vista anterior de los órganos principales en su lugar. Hígado a la derecha del paciente (izquierda del observador); estómago y bazo a la izquierda del paciente; corazón a la izquierda de la línea media con el vértice hacia la derecha del observador; los riñones están detrás de los órganos abdominales (línea discontinua).'],
  orientation: 'anterior view; patient right = viewer left',
  svg: () => fig(cx0, oy0, 1, bodySilhouette('anterior', { fill: C.skinLight }) + organFigure()),
  labels: mkLabels(cx0, oy0, 1, [['brain', 0, 40, 0.025], ['lungs', -48, 230, 0.03], ['heart', 22, 240, 0.022], ['liver', -52, 318, 0.026], ['stomach', 36, 340, 0.016], ['spleen', 72, 318, 0.012], ['pancreas', 20, 370, 0.012], ['kidneys', -34, 360, 0.012], ['urinary-system-urinary-bladder', 0, 440, 0.016]]),
});

/* 8 / 9 / 10: skeletons */
const skelFig = (view, mode) => fig(cx0, oy0, 1, skeletonFigure(view, mode));
add({
  key: 'skeleton-anterior', file: 'atlas-08-skeleton-anterior', purpose: 'anterior skeleton',
  title: ['Anterior skeleton', 'Esqueleto anterior'],
  desc: ['Skeleton in anatomical position seen from the front: skull, clavicles, sternum, 12 rib pairs with costal cartilage, vertebral column, pelvis, long bones, hands and feet. Patient right is on the viewer\'s left.', 'Esqueleto en posición anatómica visto de frente: cráneo, clavículas, esternón, 12 pares de costillas con cartílago costal, columna vertebral, pelvis, huesos largos, manos y pies. La derecha del paciente queda a la izquierda del observador.'],
  orientation: 'anterior view; patient right = viewer left',
  svg: () => skelFig('anterior', 'plain'),
  labels: mkLabels(cx0, oy0, 1, [['skull', 0, 26, 0.02], ['mandible', 0, 112, 0.012], ['clavicle', 62, 137, 0.014], ['sternum', 0, 205, 0.014], ['true-ribs', 82, 196, 0.016], ['false-ribs', 78, 282, 0.014], ['floating-ribs', 38, 310, 0.012], ['humerus', 124, 245, 0.014], ['radius', 166, 384, 0.012], ['pelvis', 58, 352, 0.02], ['femur', 70, 520, 0.014], ['patella', 49, 620, 0.012], ['tibia', 43, 690, 0.01], ['fibula', 60, 740, 0.01]]),
});
add({
  key: 'skeleton-posterior', file: 'atlas-09-skeleton-posterior', purpose: 'posterior skeleton',
  title: ['Posterior skeleton', 'Esqueleto posterior'],
  desc: ['Skeleton seen from behind: skull, scapulae, vertebral column with spinous processes, ribs, sacrum, coccyx, pelvis and limb bones. Patient right is on the viewer\'s right.', 'Esqueleto visto desde atrás: cráneo, escápulas, columna vertebral con apófisis espinosas, costillas, sacro, cóccix, pelvis y huesos de las extremidades. La derecha del paciente queda a la derecha del observador.'],
  orientation: 'posterior view; patient right = viewer right',
  svg: () => skelFig('posterior', 'plain'),
  labels: mkLabels(cx0, oy0, 1, [['skull', 0, 40, 0.02], ['cervical-vertebrae', 0, 133, 0.01], ['clavicle', 74, 139, 0.012], ['scapula', 58, 218, 0.022], ['thoracic-vertebrae', 0, 225, 0.01], ['lumbar-vertebrae', 0, 332, 0.012], ['sacrum', 0, 408, 0.012], ['coccyx', 0, 449, 0.008], ['pelvis', 62, 352, 0.016], ['humerus', 124, 245, 0.012], ['femur', 70, 520, 0.012], ['tibia', 43, 700, 0.01], ['fibula', 60, 745, 0.01]]),
});
add({
  key: 'skeleton-axial-appendicular', file: 'atlas-10-skeleton-axial-appendicular', purpose: 'axial versus appendicular skeleton',
  title: ['Axial and appendicular skeleton', 'Esqueleto axial y apendicular'],
  desc: ['Anterior skeleton in two tints. Blue-gray bones are axial: skull, sternum, ribs, vertebral column, sacrum and coccyx. Sand bones are appendicular: clavicles and scapulae, limb bones, hands, feet and the hip bones.', 'Esqueleto anterior en dos tonos. Los huesos gris azulado son axiales: cráneo, esternón, costillas, columna vertebral, sacro y cóccix. Los huesos arena son apendiculares: clavículas y escápulas, huesos de las extremidades, manos, pies y huesos coxales.'],
  orientation: 'anterior view; patient right = viewer left; blue-gray = axial, sand = appendicular',
  svg: () => skelFig('anterior', 'divisions'),
  labels: mkLabels(cx0, oy0, 1, [['skull', 0, 26, 0.02], ['sternum', 0, 205, 0.014], ['true-ribs', 82, 196, 0.016], ['lumbar-vertebrae', 0, 330, 0.012], ['sacrum', 0, 404, 0.012], ['coccyx', 0, 447, 0.008], ['clavicle', 62, 137, 0.014], ['humerus', 124, 245, 0.014], ['pelvis', 58, 352, 0.02], ['femur', 70, 520, 0.014]]),
});

/* ---- write files ---- */
const sha = (buf) => createHash('sha256').update(buf).digest('hex');
const refs = [
  { url: 'https://training.seer.cancer.gov/anatomy/body/terminology.html', publisher: 'NCI SEER Training Modules' },
  { url: 'https://training.seer.cancer.gov/anatomy/skeletal/divisions/axial.html', publisher: 'NCI SEER Training Modules' },
  { url: 'https://training.seer.cancer.gov/anatomy/skeletal/divisions/appendicular.html', publisher: 'NCI SEER Training Modules' },
  { url: 'https://training.seer.cancer.gov/anatomy/cells_tissues_membranes/membranes.html', publisher: 'NCI SEER Training Modules' },
  { url: 'https://medlineplus.gov/ency/imagepages/19578.htm', publisher: 'MedlinePlus (NLM)' },
  { url: 'https://seer.cancer.gov/seertools/glossary/view/55116b6be4b0c48f31dbe7f7', publisher: 'NCI SEER Glossary' },
];
const prov = [];
const generated = [];
plates.forEach((p, i) => {
  const svgText = header(p.title[0], p.desc[0], p.svg());
  const svgRel = `assets/images/anatomy/atlas/${p.file}.svg`, pngRel = `assets/images/anatomy/atlas/${p.file}.png`;
  writeFileSync(join(root, svgRel), svgText);
  execFileSync('convert', ['-density', '96', '-background', C.paper, join(root, svgRel), '-resize', `${W}x${H}!`, join(root, pngRel)], { stdio: 'ignore' });
  const id = `asset-atlas-${p.key}`;
  const labels = p.labels.map((l) => ({ ...l, en: NAMES[l.structureId][0], es: NAMES[l.structureId][1] }));
  prov.push({
    id, plate: i + 1, creator: 'Boneefied', rights: 'Original Boneefied project artwork; all rights reserved by Boneefied. No CC0 or public-domain dedication is granted.',
    svgPath: svgRel, pngPath: pngRel, notice: 'Original authorship: drawn from scratch by the Boneefied vector generator (scripts/atlas). No third-party illustration was traced, copied, downloaded or adapted. Modified versions must keep this notice.',
    references: refs.map((r) => ({ ...r, checked: '2026-10-10', use: 'text-only factual reference; no images imported' })),
    purpose: p.purpose, orientation: p.orientation, dimensions: { width: W, height: H, aspectRatio: CANVAS.aspect },
    labelMapping: labels.map((l) => ({ structureId: l.structureId, x: l.x, y: l.y, radius: l.radius })),
    sha256: { svg: sha(readFileSync(join(root, svgRel))), png: sha(readFileSync(join(root, pngRel))) },
  });
  generated.push({ id, key: p.key, svgPath: svgRel, pngPath: pngRel, title: p.title, description: p.desc, orientation: p.orientation, labels });
});
writeFileSync(join(outDir, 'provenance.json'), JSON.stringify({ pack: 'boneefied-foundational-atlas', generatedBy: 'scripts/atlas/generate.mjs', plates: prov }, null, 2) + '\n');
writeFileSync(join(root, 'content/atlas-plates.generated.ts'), `// GENERATED by scripts/atlas/generate.mjs - do not edit by hand.\nexport interface AtlasPlateLabel { structureId: string; x: number; y: number; radius: number; en: string; es: string }\nexport interface AtlasPlate { id: string; key: string; svgPath: string; pngPath: string; title: [string, string]; description: [string, string]; orientation: string; labels: AtlasPlateLabel[] }\nexport const atlasPlates: AtlasPlate[] = ${JSON.stringify(generated, null, 2)} as AtlasPlate[];\n`);
console.log(`wrote ${plates.length} plates`);
