// BVIS04 nail plate: longitudinal section of a fingertip (distal at right, dorsal at top). Original schematic.
import { C, sm, poly, E, RR, tube } from './bvis04-lib.mjs';

export const plates = [];
const SK = { fill: '#F1DFD2', line: '#C3A593' }, EPI = { fill: '#E9C6B4', line: '#A07A68' };
const KER = { fill: '#F4EBDD', line: '#A8977E' };

function nail(S) {
  S.panel(30, 30, 1390, 940, 'fingertip');
  S.beginT(-100, -80, 1.2);
  // finger body (dermis / soft tissue)
  S.sh(null, sm([[150, 330], [330, 316], [520, 306], [900, 306], [1090, 322], [1185, 420], [1190, 530], [1130, 640], [1000, 700], [800, 712], [400, 706], [150, 690]]), { ...SK, sw: 1.8 });
  // volar fat pad
  S.sh(null, sm([[820, 640], [1000, 600], [1130, 600], [1120, 650], [1000, 700], [820, 708]]), { fill: '#F2E6B4', line: '#B8A560', sw: 1.2 });
  // distal phalanx
  S.sh(null, sm([[330, 470], [520, 450], [760, 462], [940, 494], [1040, 520], [1040, 560], [940, 592], [760, 612], [520, 616], [330, 600]]), { fill: C.bone, line: C.boneLn, sw: 1.8 });
  // nail bed: epithelium under the plate, from the root to the hyponychium
  S.sh('nail-bed-skin', sm([[560, 344], [800, 348], [1030, 350], [1062, 360], [1030, 376], [800, 372], [560, 372]]), { fill: '#E8B9AE', line: '#A06A62', sw: 1.4 });
  // nail matrix: thick germinative epithelium beneath the root
  S.sh('nail-matrix-skin', sm([[420, 372], [412, 352], [440, 336], [520, 334], [584, 344], [600, 372], [580, 410], [510, 424], [440, 408]]), { fill: '#D9948E', line: '#8A4A47', sw: 1.6 });
  // nail plate: root (under the proximal fold) continuous with the visible plate
  S.sh('nail-root-skin', sm([[430, 344], [470, 328], [560, 320], [592, 322], [592, 346], [520, 354], [452, 360]]), { fill: '#EADFCB', line: '#A8977E', sw: 1.5 });
  S.sh('nail-plate-skin', sm([[588, 320], [760, 312], [960, 314], [1100, 322], [1176, 338], [1170, 358], [1096, 346], [960, 342], [760, 340], [588, 346]]), { ...KER, sw: 1.6 });
  // proximal nail fold covering the root
  S.sh(null, sm([[196, 330], [330, 312], [470, 304], [582, 304], [578, 322], [520, 322], [452, 330], [420, 372], [380, 394], [330, 372], [250, 360]]), { ...EPI, sw: 1.5 });
  // eponychium (cuticle) as a thin pale edge where the fold meets the plate
  S.sh(null, sm([[560, 312], [606, 312], [606, 330], [570, 330]]), { fill: '#F4EBDD', line: '#A8977E', sw: 1.1 });
  // hyponychium under the free edge
  S.sh(null, sm([[1030, 360], [1076, 350], [1100, 368], [1060, 388], [1020, 380]]), { fill: '#DDB8AE', line: '#A06A62', sw: 1.2 });
  // a few dermal fibres below the bed
  for (let k = 0; k < 4; k++) S.ln(null, `M${470 + k * 150} ${392 + (k % 2) * 8}Q${540 + k * 150} ${420} ${610 + k * 150} ${398}`, { color: '#D9C0B2', w: 2.4 });
  S.endT();
  S.at('fingertip');
  const T = ([x, y]) => [x * 1.2 - 100, y * 1.2 - 80];
  S.pin('nail-plate-skin', 'nail-plate-skin', T([820, 327]));
  S.pin('nail-bed-skin', 'nail-bed-skin', T([820, 360]));
  S.pin('nail-root-skin', 'nail-root-skin', T([520, 340]));
  S.pin('nail-matrix-skin', 'nail-matrix-skin', T([510, 385]));
}
plates.push({
  key: 'nail-section', moduleId: 'integumentary-system', kind: 'gross-diagram', lessons: ['hair-nails'], purpose: 'Nail in longitudinal section: plate, bed, root and matrix.',
  title: ['Nail in longitudinal section', 'Uña en corte longitudinal'],
  desc: ['Fingertip cut lengthwise, fingertip to the right and the back of the finger at the top, over the distal phalanx. The hard nail plate lies on the nail bed, a thin layer of epithelium over the dermis. At the back end, the nail root is the part of the plate tucked under the proximal nail fold, and it grows from the nail matrix beneath it: the thick, living germinative epithelium whose cells keratinise to form the plate, so the plate is pushed forward as the matrix adds to it. Under the free edge the skin thickens into the hyponychium (unlabelled). Simplified original drawing.',
    'Punta del dedo cortada a lo largo, con la punta a la derecha y el dorso del dedo arriba, sobre la falange distal. La dura lámina ungueal descansa sobre el lecho ungueal, una delgada capa de epitelio sobre la dermis. En el extremo posterior, la raíz de la uña es la parte de la lámina que queda bajo el pliegue ungueal proximal y nace de la matriz ungueal situada debajo: el epitelio germinativo grueso y vivo cuyas células se queratinizan para formar la lámina, que avanza a medida que la matriz le añade material. Bajo el borde libre la piel se engrosa en el hiponiquio (sin marcador). Dibujo original simplificado.'],
  orientation: ['longitudinal section of a fingertip; distal end at right, dorsal at top', 'corte longitudinal de la punta del dedo; extremo distal a la derecha, dorso arriba'], draw: nail,
});
