// BVIS04 special senses plates: eye (gross, anterior detail, retina, disc), ear (gross, middle, inner, cochlea), smell/taste.
import { C, sm, poly, E, RR, tube, cr } from './bvis04-lib.mjs';

const MOD = 'special-senses';
export const plates = [];
const NV = { fill: '#E6DFC8', line: '#9A8F6A' };

// ---------------------------------------------------------------- eye (local coordinates, anterior at left)
const EX = 800, EY = 500, ER = 280;
const PP = (r, a) => [EX - r * Math.cos((a * Math.PI) / 180), EY - r * Math.sin((a * Math.PI) / 180)];
const arcPoly = (r0, r1, a0, a1) => { const o = [], n = Math.max(8, Math.round(Math.abs(a1 - a0) / 3)); for (let i = 0; i <= n; i++) o.push(PP(r1, a0 + ((a1 - a0) * i) / n)); for (let i = n; i >= 0; i--) o.push(PP(r0, a0 + ((a1 - a0) * i) / n)); return poly(o); };
const my = (pts) => pts.map(([x, y]) => [x, 1000 - y]);
function eye(S) {
  S.sh('sclera', arcPoly(262, 282, 40, 320), { fill: '#EDE8DA', line: '#9A927C', sw: 1.8 });
  S.sh('choroid', arcPoly(250, 262, 60, 300), { fill: '#A47474', line: '#6F4A4A', sw: 1.2 });
  S.sh('retina', arcPoly(238, 250, 62, 298), { fill: '#E3BBA8', line: '#9A6A5A', sw: 1.2 });
  const arc = []; for (let a = 62; a <= 298; a += 4) arc.push(PP(238, a));
  S.sh('vitreous', poly([...arc, [700, 680], [668, 628], [690, 570], [704, 500], [690, 430], [668, 372], [700, 320]]), { fill: '#DCE7EA', line: '#8FA9B2', sw: 1 });
  S.sh('optic-disc', poly([PP(252, 187), PP(238, 187), PP(238, 197), PP(252, 197)]), { fill: '#F2E3AE', line: '#9A8A4A', sw: 1.4 });
  S.sh('fovea', E(PP(242, 180)[0] - 1, PP(242, 180)[1], 6, 12), { fill: '#B9705E', line: '#7E4A40', sw: 1.4 });
  S.tb('optic-nerve', [[1070, 553], [1150, 562], [1260, 575]], 62, 60, { fill: '#EAE3CF', line: '#9A8F6A' });
  const top = [[686, 280], [610, 322], [622, 360], [668, 372], [700, 322]];
  S.sh('ciliary', sm(top, true, 4), { fill: '#C79A8A', line: '#7E5A50', sw: 1.4 });
  S.sh('ciliary', sm(my(top), true, 4), { fill: '#C79A8A', line: '#7E5A50', sw: 1.4 });
  // anterior chamber, posterior chamber, pupil
  S.sh('ac', poly([[606, 330], [566, 388], [540, 450], [532, 500], [540, 550], [566, 612], [606, 670], [614, 660], [614, 548], [630, 548], [630, 452], [614, 452], [614, 340]]), { fill: '#D3E3EA', line: '#8FA9B2', sw: 0.8 });
  S.sh('pc', sm([[628, 362], [666, 372], [652, 414], [640, 446], [628, 452]], true, 3), { fill: '#CFE0E8', line: '#8FA9B2', sw: 0.8 });
  S.sh('pc', sm(my([[628, 362], [666, 372], [652, 414], [640, 446], [628, 452]]), true, 3), { fill: '#CFE0E8', line: '#8FA9B2', sw: 0.8 });
  S.sh('pupil', poly([[614, 452], [630, 452], [630, 548], [614, 548]]), { fill: '#AFC3CC', line: '#6F8D9A', sw: 1 });
  S.sh('iris', tube([[620, 358], [621, 410], [622, 452]], 15, 11), { fill: '#8FA3B3', line: '#566B7A', sw: 1.4 });
  S.sh('iris', tube(my([[620, 358], [621, 410], [622, 452]]), 15, 11), { fill: '#8FA3B3', line: '#566B7A', sw: 1.4 });
  S.sh('lens', E(672, 500, 32, 70), { fill: '#EADFB6', line: '#9A8A5A', sw: 1.8 });
  S.sh('cornea', tube([[603, 322], [560, 380], [532, 450], [522, 500], [532, 550], [560, 620], [603, 678]], 20, 20), { fill: '#CFE2E8', line: '#6F8D9A', sw: 1.8 });
  S.ln('zonules', 'M668 372L672 434', { color: '#6F6A5A', w: 2 });
  S.ln('zonules', 'M668 628L672 566', { color: '#6F6A5A', w: 2 });
}
function eyeGross(S) {
  S.panel(30, 30, 1390, 940, 'section');
  eye(S);
  S.pin('sclera-eye', 'sclera', [880, 262]);
  S.pin('cornea-eye', 'cornea', [532, 450]);
  S.pin('choroid-eye', 'choroid', [1000, 600]);
  S.pin('retina-eye', 'retina', [1000, 400]);
  S.pin('ciliary-body-eye', 'ciliary', [655, 318]);
  S.pin('iris-eye', 'iris', [621, 395]);
  S.pin('lens-eye', 'lens', [672, 500]);
  S.pin('vitreous-chamber-eye', 'vitreous', [900, 500]);
  S.pin('vitreous-humor-eye', 'vitreous', [800, 440]);
  S.pin('optic-nerve-eye', 'optic-nerve', [1160, 563]);
  S.pin('fovea-centralis-eye', 'fovea', [1040, 500]);
  S.pin('fibrous-tunic-eye', 'sclera+cornea', [700, 232]);
  S.pin('vascular-tunic-eye', 'choroid+ciliary+iris', [960, 700]);
}
plates.push({
  key: 'eye-section', replaces: 'asset-servier-eye-section', moduleId: MOD, kind: 'gross-diagram', lessons: ['eye-coats', 'lens-retina'], purpose: 'Eyeball in horizontal section: the three tunics, lens, vitreous chamber and optic nerve.',
  title: ['Eye in section: tunics, lens and vitreous chamber', 'Ojo en corte: túnicas, cristalino y cámara vítrea'],
  desc: ['Horizontal section of the right eye seen from above, front (cornea) to the left. Outer fibrous tunic: sclera, continuing in front as the transparent cornea. Middle vascular tunic: choroid, ciliary body and iris. Inner layer: retina, with the fovea at the back on the visual axis. Behind the lens the large vitreous chamber holds the vitreous humor; the optic nerve leaves the back of the globe slightly off-centre. Fibrous tunic and vascular tunic are group markers placed on member layers. Gross diagram, simplified.',
    'Corte horizontal del ojo derecho visto desde arriba, con la parte anterior (córnea) a la izquierda. Túnica fibrosa externa: esclera, que por delante continúa como córnea transparente. Túnica vascular media: coroides, cuerpo ciliar e iris. Capa interna: retina, con la fóvea en el fondo sobre el eje visual. Detrás del cristalino, la gran cámara vítrea contiene el humor vítreo; el nervio óptico sale por la parte posterior del globo, algo descentrado. Túnica fibrosa y túnica vascular son marcadores de grupo colocados sobre capas que las componen. Diagrama macroscópico simplificado.'],
  orientation: ['horizontal section of the right eye from above; anterior at viewer left', 'corte horizontal del ojo derecho desde arriba; anterior a la izquierda del observador'], draw: eyeGross,
});

function eyeFront(S) {
  S.panel(30, 30, 1390, 940, 'anterior-segment');
  S.clipBoth(RR(32, 32, 1386, 936, 14));
  S.beginT(-595, -600, 2.2);
  eye(S);
  S.endT();
  S.clipBothEnd();
  const T = (x, y) => [x * 2.2 - 595, y * 2.2 - 600];
  S.pin('cornea-eye', 'cornea', T(536, 420), { radius: 0.018 });
  S.pin('anterior-chamber-eye', 'ac', T(570, 480));
  S.pin('aqueous-humor-eye', 'ac+pc', T(552, 372));
  S.pin('pupil-eye', 'pupil', T(622, 500));
  S.pin('iris-eye', 'iris', T(621, 395));
  S.pin('posterior-chamber-eye', 'pc', T(648, 402));
  S.pin('suspensory-ligaments-eye', 'zonules', T(670, 405));
  S.pin('lens-eye', 'lens', T(676, 500));
  S.pin('ciliary-body-eye', 'ciliary', T(650, 330));
}
plates.push({
  key: 'eye-anterior-segment', moduleId: MOD, kind: 'gross-diagram', lessons: ['eye-coats', 'lens-retina'], purpose: 'Enlarged front of the eye: anterior and posterior chambers, aqueous humor, iris, pupil, zonules and lens.',
  title: ['Anterior eye: chambers, aqueous humor and zonules', 'Segmento anterior del ojo: cámaras, humor acuoso y zónula'],
  desc: ['Enlarged horizontal section of the front of the eye, cornea to the left. The anterior chamber lies between cornea and iris; the pupil is the opening in the iris; the narrow posterior chamber lies behind the iris, in front of the lens and ciliary body. Aqueous humor, made by the ciliary processes, fills both chambers and passes through the pupil. Suspensory ligaments (zonules) run from the ciliary body to the lens equator. Aqueous humor is a group marker for the two chambers. Gross diagram, simplified.',
    'Corte horizontal ampliado de la parte anterior del ojo, con la córnea a la izquierda. La cámara anterior queda entre la córnea y el iris; la pupila es la abertura del iris; la estrecha cámara posterior queda detrás del iris, delante del cristalino y del cuerpo ciliar. El humor acuoso, producido por los procesos ciliares, llena ambas cámaras y pasa por la pupila. Los ligamentos suspensorios (zónula) van del cuerpo ciliar al ecuador del cristalino. Humor acuoso es un marcador de grupo para las dos cámaras. Diagrama macroscópico simplificado.'],
  orientation: ['enlarged horizontal section of the anterior right eye; cornea at viewer left', 'sección horizontal ampliada del segmento anterior del ojo derecho; córnea a la izquierda'], draw: eyeFront,
});

// ---------------------------------------------------------------- retina schematic
function retina(S) {
  S.panel(30, 30, 1390, 940, 'schematic');
  const x0 = 70, x1 = 1380;
  S.sh(null, RR(x0, 60, x1 - x0, 60, 6), { fill: '#DCE7EA', line: '#8FA9B2', sw: 1 });
  S.sh('retina', RR(x0, 130, x1 - x0, 560, 8), { fill: '#F0DCCF', line: '#9A6A5A', sw: 1.4 });
  S.sh('rpe', RR(x0, 700, x1 - x0, 58, 6), { fill: '#8F7466', line: '#5A463C', sw: 1.4 });
  S.sh(null, RR(x0, 768, x1 - x0, 130, 6), { fill: '#C49A94', line: '#6F4A4A', sw: 1.4 });
  S.sh(null, RR(x0, 906, x1 - x0, 50, 6), { fill: '#EDE8DA', line: '#9A927C', sw: 1.4 });
  [[170, 830, 60, 26], [420, 842, 70, 24], [700, 836, 66, 28], [980, 846, 74, 24], [1250, 832, 62, 26]].forEach(([x, y, a, b]) => S.sh(null, E(x, y, a, b), { fill: '#B65E5E', line: '#6F2E2E', sw: 1.2 }));
  for (let k = 0; k < 6; k++) S.ln(null, `M${x0 + 10} ${150 + k * 6}H${x1 - 10}`, { color: '#C9A94A', w: 2, op: 0.8 });
  const cols = Array.from({ length: 9 }, (_, i) => 150 + i * 150);
  cols.forEach((x, i) => {
    S.ln(null, `M${x} 245V440M${x} 440V470`, { color: '#9A8F82', w: 1.4 });
    S.sh('ganglion-cells', E(x, 230, 30, 24), { fill: '#C2B07A', line: '#7A6A3A', sw: 1.6 });
    S.sh('bipolar-cells', sm([[x - 18, 330], [x, 292], [x + 18, 330], [x, 392]], true, 5), { fill: '#A7BCA2', line: '#58724F', sw: 1.6 });
    S.sh(null, E(x, 436, 16, 22), { fill: '#C9B7BE', line: '#7E6670', sw: 1 });
    const rod = (rx) => S.sh('rods', RR(rx - 7, 470, 14, 215, 6), { fill: '#BBD0D8', line: '#4F6C86', sw: 1.4 });
    S.sh(null, E(x - 38, 436, 9, 18), { fill: '#C9B7BE', line: '#7E6670', sw: 1 });
    S.sh(null, E(x + 38, 436, 9, 18), { fill: '#C9B7BE', line: '#7E6670', sw: 1 });
    if (i % 3 === 1) S.sh('cones', poly([[x - 17, 470], [x + 17, 470], [x + 5, 640], [x - 5, 640]]), { fill: '#E3C98A', line: '#8A6E2C', sw: 1.6 });
    else rod(x);
    rod(x - 38); rod(x + 38);
    if (i % 3 === 1) { /* neighbouring rods sit beside the cone */ }
    for (const dx of [-38, 0, 38]) S.sh('rpe', RR(x + dx - 18, 700, 36, 58, 4), { fill: '#7C6256', line: '#5A463C', sw: 1.2 });
  });
  for (const lx of [100, 1330]) S.arrow(lx, 100, 90, 22, '#C9A94A');
  S.pin('ganglion-cells-eye', 'ganglion-cells', [450, 230]);
  S.pin('bipolar-cells-eye', 'bipolar-cells', [600, 335]);
  S.pin('rods-eye', 'rods', [600 - 38, 600]);
  S.pin('cones-eye', 'cones', [300, 560]);
  S.pin('retinal-pigment-epithelium-eye', 'rpe', [750, 730]);
  S.pin('retina-eye', 'retina', [1000, 400]);
}
plates.push({
  key: 'retina-layers', moduleId: MOD, kind: 'tissue-schematic', lessons: ['lens-retina'], purpose: 'Retinal cell chain from light to ganglion cells, and pigment epithelium behind the photoreceptors.',
  title: ['Retina: cell chain (schematic)', 'Retina: cadena celular (esquema)'],
  desc: ['Schematic of the retina in cross-section, not a photomicrograph. Light arrives from the vitreous at the top and passes through the nerve-fibre layer, ganglion cells and bipolar cells before reaching the rods (long, thin) and cones (tapered) at the back. Signals travel the other way: photoreceptor to bipolar cell to ganglion cell, whose axons run along the surface to the optic disc. The pigmented epithelium sits behind the photoreceptors, on the vascular choroid. Cells are simplified and spaced far apart.',
    'Esquema de la retina en corte, no una fotomicrografía. La luz llega desde el vítreo, arriba, y atraviesa la capa de fibras nerviosas, las células ganglionares y las células bipolares antes de llegar a los bastones (largos y finos) y conos (cónicos) del fondo. Las señales viajan en sentido inverso: fotorreceptor, célula bipolar y célula ganglionar, cuyos axones recorren la superficie hasta el disco óptico. El epitelio pigmentario queda detrás de los fotorreceptores, sobre la coroides vascular. Células simplificadas y muy espaciadas.'],
  orientation: ['schematic cross-section; vitreous and incoming light at top, choroid and sclera at bottom', 'corte esquemático; vítreo y luz incidente arriba, coroides y esclera abajo'], draw: retina,
});

// ---------------------------------------------------------------- optic disc
function opticDisc(S) {
  S.panel(30, 30, 690, 940, 'fundus');
  S.panel(740, 30, 680, 940, 'nerve-head');
  S.sh(null, E(375, 500, 320, 320), { fill: '#C98C78', line: '#7E5044', sw: 2 });
  S.sh('retina-f', E(375, 500, 300, 300), { fill: '#D79A84', line: '#C98C78', sw: 1 });
  S.sh('macula', E(250, 505, 80, 66), { fill: '#BC7664', line: '#8A5044', sw: 1.4 });
  S.sh('fovea', E(250, 505, 12, 12), { fill: '#8A4E40', line: '#5A2E26', sw: 1.2 });
  const vs = [[[480, 470], [430, 400], [330, 355], [215, 395], [150, 455]], [[480, 515], [430, 590], [330, 640], [215, 600], [150, 545]], [[525, 470], [585, 410], [640, 345]], [[525, 520], [590, 575], [640, 650]]];
  vs.forEach((p) => { S.ln(null, sm(p, false, 6), { color: '#8F3E3E', w: 6 }); S.ln(null, sm(p.map(([x, y]) => [x + 5, y + 6]), false, 6), { color: '#4F6C86', w: 6 }); });
  S.sh('disc', E(505, 492, 46, 54), { fill: '#EBD7A8', line: '#9A8A5A', sw: 1.8 });
  S.sh(null, E(500, 494, 20, 24), { fill: '#F5ECCB', line: '#F5ECCB', sw: 0.5 });
  S.at('fundus');
  S.pin('optic-disc-eye', 'disc', [515, 505]);
  S.pin('macula-lutea-eye', 'macula', [205, 530]);
  S.pin('fovea-centralis-eye', 'fovea', [250, 505]);
  // nerve head section
  S.at('nerve-head');
  S.sh(null, RR(1010, 405, 380, 190, 10), { fill: '#A9B8C9', line: '#4F6C86', sw: 1.6 });
  S.sh(null, RR(955, 90, 50, 820, 6), { fill: '#EDE8DA', line: '#9A927C', sw: 1.6 });
  S.sh(null, RR(1005, 405, 10, 190, 2), { fill: '#EDE8DA', line: '#9A927C', sw: 1 });
  S.sh(null, RR(930, 90, 28, 820, 4), { fill: '#A47474', line: '#6F4A4A', sw: 1.2 });
  S.sh('retina', RR(880, 90, 52, 820, 4), { fill: '#E3BBA8', line: '#9A6A5A', sw: 1.2 });
  S.sh(null, RR(790, 90, 90, 820, 4), { fill: '#DCE7EA', line: '#8FA9B2', sw: 1 });
  S.sh(null, RR(878, 450, 130, 100, 6), { fill: '#F2E3AE', line: '#9A8A4A', sw: 1.4 });
  S.sh('nerve', RR(1008, 440, 380, 120, 8), { fill: '#EAE3CF', line: '#9A8F6A', sw: 1.6 });
  S.sh(null, RR(1008, 420, 380, 14, 2), { fill: '#C8BDD6', line: '#6F6381', sw: 1 });
  for (let k = 0; k < 7; k++) S.ln(null, `M1010 ${462 + k * 14}H1380`, { color: '#C9A94A', w: 2.2 });
  [[160, 460], [260, 470], [360, 480], [700, 530], [790, 535], [860, 530]].forEach(([y, y2]) => S.ln(null, `M900 ${y > 300 ? y : y}Q930 ${y2 - 20} 960 ${y2 < 520 ? 490 : 510}`, { color: '#C9A94A', w: 2.4, op: 0.0 }));
  [[150, 300], [250, 360], [350, 420], [650, 560], [750, 620], [850, 660]].forEach(([y, c]) => S.ln(null, sm([[905, y], [903, c + 30], [930, 495], [1010, 500]], false, 6), { color: '#C9A94A', w: 2.4 }));
  S.ln(null, 'M1385 500H935', { color: '#8F3E3E', w: 5 });
  S.ln(null, 'M1385 515H930', { color: '#4F6C86', w: 5 });
  S.pin('optic-nerve-eye', 'nerve', [1230, 505]);
  S.pin('retina-eye', 'retina', [905, 250]);
  S.pin('optic-disc-eye', 'optic-disc', [940, 512]);
  S.sh('optic-disc', RR(932, 462, 70, 76, 6), { fill: '#F2E3AE', line: '#9A8A4A', sw: 1.4, op: 0.0 });
  S.sh('optic-disc', RR(934, 466, 40, 70, 6), { fill: '#F2E3AE', line: '#9A8A4A', sw: 1.4 });
  S.pins[S.pins.length - 1].key = 'optic-disc';
  S.ln(null, 'M1385 500H950', { color: '#8F3E3E', w: 5 });
  S.ln(null, 'M1385 515H945', { color: '#4F6C86', w: 5 });
}
plates.push({
  key: 'optic-disc', replaces: 'asset-gray880-optic-nerve-head', moduleId: MOD, kind: 'gross-diagram', lessons: ['lens-retina', 'eye-coats'], purpose: 'Optic disc, macula and fovea from the front, and the nerve head in section.',
  title: ['Optic disc, macula and optic nerve head', 'Disco óptico, mácula y cabeza del nervio óptico'],
  desc: ['Left: schematic fundus (the retina as seen through the pupil) of a right eye. The pale optic disc, where ganglion-cell axons gather and the retinal vessels enter and leave, lies toward the nose (viewer right); the darker macula lutea lies on the visual axis with a tiny central fovea, and the retinal vessels arc around it. The disc has no photoreceptors. Right: section through the nerve head: axons turn through a fenestrated gap in choroid and sclera into the optic nerve, wrapped in meninges continuous with the sclera; the central artery and vein run in its core. Simplified drawing, not an ophthalmoscope photograph.',
    'Izquierda: fondo de ojo esquemático (la retina vista a través de la pupila) de un ojo derecho. El disco óptico pálido, donde convergen los axones de las células ganglionares y entran y salen los vasos retinianos, está hacia la nariz (derecha del observador); la mácula lútea, más oscura, queda en el eje visual con una diminuta fóvea central, y los vasos retinianos la rodean en arco. El disco no tiene fotorreceptores. Derecha: corte de la cabeza del nervio: los axones giran a través de un hueco fenestrado de la coroides y la esclera hacia el nervio óptico, envuelto en meninges continuas con la esclera; la arteria y la vena centrales corren en su centro. Dibujo simplificado, no una fotografía oftalmoscópica.'],
  orientation: ['left panel: fundus of right eye, nasal side at viewer right; right panel: longitudinal section of the nerve head, vitreous at left', 'panel izquierdo: fondo de ojo derecho, lado nasal a la derecha; panel derecho: corte longitudinal de la cabeza del nervio, vítreo a la izquierda'], draw: opticDisc,
});

// ---------------------------------------------------------------- ear (local coordinates)
function ear(S) {
  S.sh(null, sm([[420, 190], [700, 160], [960, 240], [1010, 480], [980, 760], [800, 840], [560, 800], [440, 640], [420, 400]]), { fill: '#EFE9D6', line: C.boneLn, sw: 1.6 });
  // external ear and canal
  S.sh('auricle', sm([[250, 330], [200, 260], [140, 280], [95, 380], [100, 520], [150, 610], [215, 640], [260, 580], [225, 520], [200, 440], [215, 390]]), { fill: '#E8D6C6', line: C.skinLn, sw: 2 });
  S.sh('meatus', tube([[225, 485], [330, 478], [420, 470], [482, 475]], 58, 50), { fill: '#E3D2C0', line: C.skinLn, sw: 1.6 });
  S.sh(null, tube([[225, 485], [330, 478], [420, 470], [482, 475]], 30, 24), { fill: '#CBB8A6', line: '#CBB8A6', sw: 0.5 });
  // middle ear cavity, auditory tube
  S.sh(null, sm([[492, 400], [540, 380], [600, 392], [628, 440], [628, 585], [590, 600], [520, 590], [492, 560]], true, 4), { fill: '#DDE7EA', line: '#7F98A2', sw: 1.4 });
  S.tb('auditory-tube', [[600, 575], [680, 650], [770, 740], [830, 810]], 26, 36, { fill: '#C9DCE0', line: '#6F8D9A' });
  // inner ear
  S.pipe('semicircular-canals', [[702, 440], [706, 290], [722, 235], [760, 235], [776, 290], [766, 440]], 20, '#DCE3E9', '#6F8D9A', false);
  S.pipe('semicircular-canals', [[650, 440], [640, 330], [690, 290], [740, 330], [745, 440]], 20, '#E4EAEF', '#6F8D9A', false);
  S.pipe('semicircular-canals', [[770, 440], [800, 350], [880, 310], [920, 370], [860, 430], [790, 455]], 20, '#E4EAEF', '#6F8D9A', false);
  S.sh('vestibule', E(715, 470, 82, 62), { fill: '#C8DDE4', line: '#4F6C86', sw: 2 });
  S.sh('cochlea', sm([[760, 560], [850, 540], [925, 580], [945, 650], [900, 720], [820, 740], [750, 700], [740, 630]], true, 5), { fill: '#C8DDE4', line: '#4F6C86', sw: 2 });
  S.ln(null, sm([[790, 640], [830, 595], [890, 610], [895, 670], [840, 700], [800, 670], [830, 635], [855, 650]], false, 6), { color: '#4F6C86', w: 2.2 });
  S.sh('tm', tube([[486, 425], [492, 470], [486, 520]], 9, 9), { fill: '#EAD7C2', line: C.skinLn, sw: 1.4 });
  S.sh('malleus', tube([[540, 410], [508, 440], [492, 505]], 10, 7), { fill: C.bone, line: C.boneLn, sw: 1.4 });
  S.sh('malleus', E(546, 410, 14, 11), { fill: C.bone, line: C.boneLn, sw: 1.4 });
  S.sh('incus', E(574, 418, 14, 13), { fill: C.bone, line: C.boneLn, sw: 1.4 });
  S.sh('incus', tube([[574, 426], [583, 455], [584, 484]], 8, 6), { fill: C.bone, line: C.boneLn, sw: 1.4 });
  S.sh('oval', E(627, 470, 6, 17), { fill: '#F2E3AE', line: '#9A8A4A', sw: 1.4 });
  for (const d of ['M586 484Q598 454 621 462', 'M586 484Q598 504 621 481']) { S.ln('stapes', d, { color: C.boneLn, w: 5.2 }); S.ln(null, d, { color: C.bone, w: 2.4 }); }
  S.sh('stapes', E(586, 484, 5, 5), { fill: C.bone, line: C.boneLn, sw: 1.4 });
  S.sh('stapes', RR(619, 458, 5, 28, 2), { fill: C.bone, line: C.boneLn, sw: 1.4 });
  S.sh('round', E(634, 566, 8, 11), { fill: '#F2E3AE', line: '#9A8A4A', sw: 1.4 });
  S.tb('vcn', [[850, 540], [900, 520], [960, 500], [1040, 480]], 20, 24, { fill: '#E6DFC8', line: '#9A8F6A' });
  S.tb('vcn', [[775, 515], [840, 520], [905, 520]], 12, 12, { fill: '#E6DFC8', line: '#9A8F6A' });
}
function earSection(S) {
  S.panel(30, 30, 1390, 940, 'coronal-section');
  ear(S);
  S.pin('auricle-ear', 'auricle', [150, 450]);
  S.pin('external-acoustic-meatus-ear', 'meatus', [340, 478]);
  S.pin('tympanic-membrane-ear', 'tm', [490, 470]);
  S.pin('auditory-tube-ear', 'auditory-tube', [740, 712]);
  S.pin('vestibule-ear', 'vestibule', [715, 470]);
  S.pin('semicircular-canals-ear', 'semicircular-canals', [815, 305]);
  S.pin('cochlea-ear', 'cochlea', [900, 660]);
  S.pin('vestibulocochlear-nerve-ear', 'vcn', [1000, 495]);
}
plates.push({
  key: 'ear-section', replaces: 'asset-servier-ear-section', moduleId: MOD, kind: 'gross-diagram', lessons: ['external-middle-ear', 'inner-ear'], purpose: 'Outer, middle and inner ear in one coronal section of the temporal bone.',
  title: ['Ear in section: outer, middle and inner', 'Oído en corte: externo, medio e interno'],
  desc: ['Coronal section of the right ear through the temporal bone, outside at the left. Outer ear: auricle and external acoustic meatus ending at the tympanic membrane. Middle ear: air-filled cavity with the three ossicles (enlarged on the next plate) and the auditory tube running toward the throat. Inner ear in the bone behind: vestibule with the semicircular canals above and the coiled cochlea in front; the vestibulocochlear nerve leaves toward the brainstem. Gross diagram with simplified canal loops.',
    'Corte coronal del oído derecho a través del hueso temporal, con el exterior a la izquierda. Oído externo: pabellón auricular y conducto auditivo externo que termina en la membrana timpánica. Oído medio: cavidad con aire con los tres huesecillos (ampliados en la siguiente lámina) y la tuba auditiva hacia la garganta. Oído interno en el hueso, detrás: vestíbulo con los conductos semicirculares arriba y la cóclea enrollada delante; el nervio vestibulococlear sale hacia el tronco encefálico. Diagrama macroscópico con bucles canaliculares simplificados.'],
  orientation: ['coronal section of the right ear; lateral (outside) at viewer left', 'corte coronal del oído derecho; lateral (exterior) a la izquierda del observador'], draw: earSection,
});

function middleEar(S) {
  S.panel(30, 30, 1390, 940, 'middle-ear');
  S.clipBoth(RR(32, 32, 1386, 936, 14));
  S.beginT(-700, -560, 2.6);
  ear(S);
  S.endT();
  S.clipBothEnd();
  const T = (x, y) => [x * 2.6 - 700, y * 2.6 - 560];
  S.pin('tympanic-membrane-ear', 'tm', T(488, 440));
  S.pin('malleus-ear', 'malleus', T(520, 430));
  S.pin('incus-ear', 'incus', T(574, 418));
  S.pin('stapes-ear', 'stapes', T(610, 475));
  S.pin('oval-window-ear', 'oval', T(627, 470));
  S.pin('round-window-ear', 'round', T(634, 566));
  S.pin('auditory-tube-ear', 'auditory-tube', T(660, 640));
}
plates.push({
  key: 'middle-ear', moduleId: MOD, kind: 'gross-diagram', lessons: ['external-middle-ear'], purpose: 'Ossicle chain from tympanic membrane to the oval window, and the two cochlear windows.',
  title: ['Middle ear: ossicles and windows', 'Oído medio: huesecillos y ventanas'],
  desc: ['Enlarged coronal view of the right middle ear. Sound moves the tympanic membrane; the handle of the malleus is attached to it, the malleus head articulates with the incus, and the incus passes the vibration to the stapes, whose footplate sits in the oval window of the vestibule. The round window lies below it and bulges to relieve the fluid movement. The auditory tube opens from the cavity toward the throat. Gross diagram, simplified.',
    'Vista coronal ampliada del oído medio derecho. El sonido mueve la membrana timpánica; el mango del martillo está unido a ella, la cabeza del martillo se articula con el yunque y el yunque transmite la vibración al estribo, cuya platina se asienta en la ventana oval del vestíbulo. La ventana redonda queda debajo y se abomba para aliviar el movimiento del líquido. La tuba auditiva se abre desde la cavidad hacia la garganta. Diagrama macroscópico simplificado.'],
  orientation: ['enlarged coronal view of the right middle ear; lateral at viewer left', 'vista coronal ampliada del oído medio derecho; lateral a la izquierda'], draw: middleEar,
});

function innerEar(S) {
  S.panel(30, 30, 1390, 940, 'labyrinth');
  const BL = '#E4EAEF', BLn = '#6F8D9A';
  // three bony canals leave and return to the vestibule; membranous ducts end in the utricle, each with one ampulla
  S.pipe('semicircular-canals', [[660, 470], [620, 350], [650, 235], [725, 205], [790, 250], [775, 350], [750, 468]], 30, BL, BLn);
  S.pipe('semicircular-canals', [[793, 468], [880, 410], [965, 435], [985, 510], [930, 560], [850, 540], [800, 492]], 30, BL, BLn);
  S.pipe('semicircular-canals', [[656, 482], [600, 420], [520, 380], [470, 430], [490, 500], [560, 525], [652, 500]], 30, BL, BLn);
  S.sh('vestibule', E(725, 530, 140, 108), { fill: '#D4E3E8', line: '#4F6C86', sw: 2 });
  S.pipe('semicircular-ducts', [[660, 470], [620, 350], [650, 235], [725, 205], [790, 250], [775, 350], [750, 468]], 11, '#C8BDD6', '#6F6381');
  S.pipe('semicircular-ducts', [[793, 468], [880, 410], [965, 435], [985, 510], [930, 560], [850, 540], [800, 492]], 11, '#C8BDD6', '#6F6381');
  S.pipe('semicircular-ducts', [[656, 482], [600, 420], [520, 380], [470, 430], [490, 500], [560, 525], [652, 500]], 11, '#C8BDD6', '#6F6381');
  [[660, 466], [796, 470], [654, 497]].forEach(([x, y]) => S.sh('semicircular-ducts', E(x, y, 20, 17), { fill: '#C8BDD6', line: '#6F6381', sw: 1.6 }));
  S.sh('utricle', E(725, 478, 84, 40), { fill: '#C8BDD6', line: '#6F6381', sw: 1.8 });
  S.sh('saccule', E(715, 585, 52, 36), { fill: '#D8B8C0', line: '#7E5A64', sw: 1.8 });
  S.sh('cochlea', sm([[690, 700], [790, 650], [920, 660], [1010, 740], [1000, 850], [900, 920], [790, 905], [710, 830]], true, 5), { fill: '#D4E3E8', line: '#4F6C86', sw: 2 });
  S.ln(null, sm([[790, 770], [850, 705], [940, 730], [960, 810], [890, 870], [820, 840], [840, 780], [900, 790]], false, 6), { color: '#4F6C86', w: 2.4 });
  S.tb(null, [[715, 618], [740, 665], [770, 700]], 8, 8, { fill: '#D8B8C0', line: '#7E5A64' });
  S.sh('oval', E(600, 575, 9, 28), { fill: '#F2E3AE', line: '#9A8A4A', sw: 1.6 });
  S.sh('round', E(690, 758, 12, 15), { fill: '#F2E3AE', line: '#9A8A4A', sw: 1.6 });
  S.tb('vcn', [[1100, 560], [1030, 560], [980, 540]], 30, 24, { fill: '#E6DFC8', line: '#9A8F6A' });
  S.tb('vcn', [[980, 545], [900, 530], [800, 490]], 12, 8, { fill: '#E6DFC8', line: '#9A8F6A' });
  S.tb('vcn', [[980, 545], [900, 570], [790, 590], [745, 592]], 12, 8, { fill: '#E6DFC8', line: '#9A8F6A' });
  S.tb('vcn', [[1000, 560], [1010, 690], [990, 770]], 12, 8, { fill: '#E6DFC8', line: '#9A8F6A' });
  S.pin('vestibule-ear', 'vestibule', [840, 600]);
  S.pin('utricle-ear', 'utricle', [740, 480]);
  S.pin('saccule-ear', 'saccule', [715, 590]);
  S.pin('semicircular-canals-ear', 'semicircular-canals', [725, 205]);
  S.pin('semicircular-ducts-ear', 'semicircular-ducts', [880, 410]);
  S.pin('cochlea-ear', 'cochlea', [900, 840]);
  S.pin('vestibulocochlear-nerve-ear', 'vcn', [1065, 560]);
  S.pin('oval-window-ear', 'oval', [600, 575]);
  S.pin('round-window-ear', 'round', [690, 758]);
}
plates.push({
  key: 'inner-ear-vestibular', moduleId: MOD, kind: 'gross-diagram', lessons: ['inner-ear'], purpose: 'Bony labyrinth with membranous utricle, saccule and canal ducts, and where the cochlea attaches.',
  title: ['Inner ear: vestibule, canals and cochlea', 'Oído interno: vestíbulo, conductos y cóclea'],
  desc: ['Right bony labyrinth drawn flat, magnified. The vestibule holds two membranous sacs: the larger utricle above and the smaller saccule below. Three semicircular canals loop above and beside it (each bony canal contains a narrower membranous duct that ends in an ampulla near the utricle); they sense rotation, while utricle and saccule sense linear acceleration and head position. The saccule connects by a small duct to the cochlea in front; the oval window faces the vestibule and the round window lies at the base of the cochlea. The vestibulocochlear nerve sends vestibular and cochlear branches. Canal planes are flattened for clarity. Schematic gross diagram.',
    'Laberinto óseo derecho dibujado plano y ampliado. El vestíbulo contiene dos sacos membranosos: el utrículo, mayor, arriba, y el sáculo, menor, abajo. Tres conductos semicirculares forman bucles por encima y al lado (cada canal óseo contiene un conducto membranoso más estrecho que termina en una ampolla cerca del utrículo); detectan la rotación, mientras que el utrículo y el sáculo detectan la aceleración lineal y la posición de la cabeza. El sáculo se conecta por un pequeño conducto con la cóclea, delante; la ventana oval da al vestíbulo y la redonda queda en la base de la cóclea. El nervio vestibulococlear envía ramos vestibulares y cocleares. Los planos de los conductos se aplanan para mayor claridad. Diagrama macroscópico esquemático.'],
  orientation: ['flattened schematic of the right labyrinth; lateral at viewer left, cochlea at the bottom', 'esquema aplanado del laberinto derecho; lateral a la izquierda, cóclea abajo'], draw: innerEar,
});

function cochleaCorti(S) {
  S.panel(30, 30, 690, 940, 'cochlear-section');
  S.panel(740, 30, 680, 940, 'organ-of-corti');
  S.sh('cochlea', sm([[110, 480], [150, 300], [365, 180], [590, 270], [660, 480], [620, 700], [380, 810], [160, 700]], true, 5), { fill: '#E7DFCC', line: C.boneLn, sw: 2 });
  S.sh('vestibular-duct', sm([[215, 468], [235, 360], [400, 290], [560, 315], [598, 412]], true, 4), { fill: '#C4D4DC', line: '#6F8D9A', sw: 1.8 });
  S.sh('tympanic-duct', sm([[300, 515], [596, 528], [585, 640], [410, 700], [260, 640], [225, 560]], true, 4), { fill: '#C4D4DC', line: '#6F8D9A', sw: 1.8 });
  S.sh('cochlear-duct', poly([[215, 470], [598, 414], [598, 526], [300, 513]]), { fill: '#D4C4DE', line: '#6F6381', sw: 1.8 });
  S.sh(null, E(150, 505, 46, 66), { fill: '#CBB8C0', line: '#7E6670', sw: 1.6 });
  S.sh(null, tube([[180, 495], [240, 495], [305, 508]], 16, 12), { fill: '#EFEADA', line: C.boneLn, sw: 1.2 });
  S.sh(null, E(335, 494, 40, 18), { fill: '#C9B7C9', line: '#6F6381', sw: 1.6 });
  S.tb(null, [[150, 505], [110, 570], [80, 700]], 16, 14, { fill: '#E6DFC8', line: '#9A8F6A' });
  S.at('cochlear-section');
  S.pin('vestibular-duct-ear', 'vestibular-duct', [400, 330]);
  S.pin('cochlear-duct-ear', 'cochlear-duct', [480, 470]);
  S.pin('tympanic-duct-ear', 'tympanic-duct', [410, 640]);
  S.pin('cochlea-ear', 'cochlea', [270, 760]);
  // organ of Corti enlarged
  S.at('organ-of-corti');
  S.sh(null, RR(760, 800, 640, 40, 6), { fill: '#EFEADA', line: C.boneLn, sw: 1.2 });
  S.sh('basilar-membrane', RR(770, 740, 620, 28, 4), { fill: '#C9B7A0', line: '#7A6A52', sw: 1.4 });
  S.sh('corti', sm([[810, 740], [850, 640], [940, 590], [1040, 560], [1150, 580], [1230, 640], [1280, 740]], true, 4), { fill: '#D8C2D0', line: '#7E5A70', sw: 1.8 });
  S.sh(null, poly([[1010, 740], [1050, 600], [1090, 740]]), { fill: '#E6DAE2', line: '#7E5A70', sw: 1.4 });
  S.sh('hair', sm([[915, 640], [945, 620], [965, 640], [962, 700], [930, 706], [912, 690]], true, 4), { fill: '#B79BC4', line: '#5E4676', sw: 1.8 });
  [1120, 1170, 1220].forEach((x, i) => S.sh('hair', sm([[x - 20, 600 + i * 10], [x, 578 + i * 10], [x + 20, 600 + i * 10], [x + 18, 690], [x, 700], [x - 18, 690]], true, 4), { fill: '#B79BC4', line: '#5E4676', sw: 1.8 }));
  [[945, 620], [1120, 578], [1170, 588], [1220, 598]].forEach(([x, y]) => S.ln(null, `M${x - 12} ${y}l-3 -26M${x} ${y}l0 -30M${x + 12} ${y}l3 -26`, { color: '#5E4676', w: 1.6 }));
  S.sh('tectorial', sm([[790, 470], [1000, 450], [1280, 500], [1330, 560], [1260, 545], [1000, 545], [800, 540]], true, 4), { fill: '#E8E1C8', line: '#9A8F6A', sw: 1.6 });
  S.tb(null, [[960, 700], [940, 790], [900, 880]], 8, 8, { fill: '#E6DFC8', line: '#9A8F6A' });
  S.tb(null, [[1170, 700], [1100, 790], [1000, 880]], 8, 8, { fill: '#E6DFC8', line: '#9A8F6A' });
  S.pin('hair-cells-ear', 'hair', [940, 660]);
  S.pin('organ-of-corti-ear', 'corti', [1040, 670]);
}
plates.push({
  key: 'cochlea-corti', moduleId: MOD, kind: 'tissue-schematic', lessons: ['inner-ear'], purpose: 'Three cochlear ducts in cross-section and a schematic of the organ of Corti.',
  title: ['Cochlear ducts and the organ of Corti (schematic)', 'Conductos cocleares y órgano de Corti (esquema)'],
  desc: ['Left: one turn of the cochlea cut across. The vestibular duct (scala vestibuli) lies above and the tympanic duct (scala tympani) below, both filled with perilymph; the cochlear duct (scala media) between them holds endolymph and sits on the basilar membrane, with the spiral ganglion at the central bony axis. Right: schematic enlargement of the organ of Corti on the basilar membrane, with one inner hair cell, three outer hair cells with stereocilia, supporting cells and the overlying tectorial membrane. Original schematic, not a photomicrograph; cell number and spacing are simplified.',
    'Izquierda: una vuelta de la cóclea cortada transversalmente. El conducto vestibular (rampa vestibular) queda arriba y el conducto timpánico (rampa timpánica) abajo, ambos con perilinfa; el conducto coclear (rampa media), entre ellos, contiene endolinfa y descansa sobre la membrana basilar, con el ganglio espiral en el eje óseo central. Derecha: ampliación esquemática del órgano de Corti sobre la membrana basilar, con una célula ciliada interna, tres externas con estereocilios, células de sostén y la membrana tectoria encima. Esquema original, no una fotomicrografía; el número y la separación de las células están simplificados.'],
  orientation: ['left: cross-section of one cochlear turn, modiolus at left; right: enlargement of the organ of Corti', 'izquierda: sección de una vuelta coclear, modiolo a la izquierda; derecha: ampliación del órgano de Corti'], draw: cochleaCorti,
});

// ---------------------------------------------------------------- smell and taste
function smellTaste(S) {
  S.panel(30, 30, 500, 940, 'olfaction');
  S.panel(545, 30, 440, 940, 'olfactory-epithelium');
  S.panel(1000, 30, 420, 940, 'taste');
  // A sagittal nose
  S.sh(null, sm([[70, 620], [80, 540], [120, 480], [180, 430], [250, 400], [440, 380], [480, 470], [490, 700], [320, 780], [170, 740], [90, 690]], true, 4), { fill: C.skin, line: C.skinLn, sw: 1.8 });
  S.sh(null, sm([[180, 600], [210, 500], [260, 440], [440, 420], [455, 520], [440, 700], [320, 730], [230, 690]], true, 4), { fill: '#F3E6E1', line: C.skinLn, sw: 1.4 });
  S.sh(null, sm([[210, 380], [260, 330], [380, 322], [470, 340], [470, 400], [350, 410], [250, 420]], true, 4), { fill: C.bone, line: C.boneLn, sw: 1.4 });
  S.sh('olfactory-epithelium', tube([[270, 440], [340, 428], [420, 424]], 18, 16), { fill: '#D6A98A', line: '#7E5A44', sw: 1.4 });
  S.sh('olfactory-bulb', sm([[262, 256], [310, 235], [370, 245], [385, 285], [340, 312], [280, 305]], true, 4), { fill: '#E3C46E', line: C.nerveLn, sw: 1.8 });
  S.tb('olfactory-tract', [[385, 275], [430, 265], [480, 250]], 14, 12, { fill: '#E3C46E', line: C.nerveLn });
  [290, 315, 340, 365].forEach((x) => S.tb('olfactory-nerve', [[x, 428], [x + 4, 380], [x + 8, 312]], 7, 5, { fill: '#D9B060', line: C.nerveLn }));
  S.sh(null, E(330, 570, 70, 20), { fill: '#E8CFC8', line: C.skinLn, sw: 1.2 });
  S.at('olfaction');
  S.pin('olfactory-epithelium-sense', 'olfactory-epithelium', [340, 428]);
  S.pin('olfactory-bulb-sense', 'olfactory-bulb', [320, 270]);
  S.pin('olfactory-nerve-sense', 'olfactory-nerve', [319, 378]);
  // B epithelium
  S.at('olfactory-epithelium');
  S.sh(null, RR(570, 180, 390, 70, 4), { fill: '#EFEADA', line: C.boneLn, sw: 1.2 });
  S.sh(null, RR(570, 250, 390, 260, 6), { fill: '#EAD2C0', line: '#7E5A44', sw: 1.4 });
  S.sh(null, RR(570, 510, 390, 110, 4), { fill: '#D9B060', line: '#9A7A30', sw: 1.2, op: 1 });
  S.sh(null, RR(570, 620, 390, 50, 4), { fill: '#EAD2C0', line: '#7E5A44', sw: 1 });
  [630, 740, 850].forEach((x, i) => {
    S.sh('olfactory-receptor', sm([[x - 14, 400], [x, 360], [x + 14, 400], [x, 450]], true, 4), { fill: '#E3C46E', line: C.nerveLn, sw: 1.8 });
    S.tb('olfactory-receptor', [[x, 360], [x, 300], [x, 255]], 6, 6, { fill: '#E3C46E', line: C.nerveLn });
    S.sh('olfactory-receptor', E(x, 252, 9, 7), { fill: '#E3C46E', line: C.nerveLn, sw: 1.4 });
    S.ln('olfactory-receptor', `M${x - 5} 255l-14 -38M${x} 253l0 -42M${x + 5} 255l14 -38`, { color: C.nerveLn, w: 1.4 });
    S.tb(null, [[x, 450], [x + 8, 520], [x + 6, 580]], 5, 5, { fill: '#E3C46E', line: C.nerveLn });
    S.sh(null, E(x + 52, 405, 20, 80), { fill: '#C9B7BE', line: '#7E6670', sw: 1.2 });
    S.sh(null, E(x + 52, 495, 14, 12), { fill: '#BBD0D8', line: '#4F6C86', sw: 1.2 });
  });
  S.pin('olfactory-receptor-sense', 'olfactory-receptor', [740, 405]);
  // C taste: tongue + bud
  S.at('taste');
  const tongue = [[1210, 420], [1130, 380], [1090, 280], [1110, 170], [1210, 120], [1310, 170], [1330, 280], [1290, 380]];
  S.sh('facial-nerve-taste', sm([[1150, 260], [1120, 170], [1210, 125], [1300, 170], [1280, 260], [1210, 285]], true, 5), { fill: '#E2B7B2', line: '#8A4A47', sw: 1.6 });
  S.sh('glossopharyngeal-nerve-taste', sm([[1150, 260], [1210, 285], [1280, 260], [1320, 285], [1295, 375], [1210, 415], [1125, 375], [1100, 285]], true, 5), { fill: '#BFCFE0', line: '#4F6C86', sw: 1.6 });
  S.sh('vagus-nerve-taste', sm([[1160, 405], [1210, 430], [1262, 405], [1240, 445], [1180, 445]], true, 4), { fill: '#E6D090', line: '#8A6E2C', sw: 1.6 });
  S.out.push(`<path d="${sm(tongue, true, 5)}" fill="none" stroke="${C.skinLn}" stroke-width="2"/>`);
  S.ln(null, 'M1150 262Q1210 295 1290 262', { color: '#8A6E5E', w: 3 });
  [[1180, 300], [1215, 312], [1250, 300]].forEach(([x, y]) => S.sh(null, E(x, y, 9, 8), { fill: '#C9B7BE', line: '#7E6670', sw: 1.2 }));
  S.sh(null, E(1210, 700, 150, 190), { fill: '#EAD2C0', line: '#7E5A44', sw: 1.6 });
  S.sh('taste-bud', sm([[1130, 770], [1130, 650], [1170, 590], [1210, 570], [1250, 590], [1290, 650], [1290, 770]], true, 5), { fill: '#E6D0B0', line: '#8A6E3C', sw: 1.8 });
  [1165, 1195, 1225, 1255].forEach((x, i) => S.sh('gustatory-receptor', sm([[x - 11, 760], [x - 8, 640 + (i % 2) * 8], [x, 596], [x + 8, 640 + (i % 2) * 8], [x + 11, 760]], true, 4), { fill: '#C9A8D0', line: '#6F4F7E', sw: 1.6 }));
  S.sh(null, E(1210, 585, 10, 6), { fill: C.paper, line: '#8A6E3C', sw: 1 });
  S.tb(null, [[1210, 770], [1215, 840], [1210, 920]], 10, 10, { fill: '#E6DFC8', line: '#9A8F6A' });
  S.pin('facial-nerve-taste', 'facial-nerve-taste', [1210, 215]);
  S.pin('glossopharyngeal-nerve-taste', 'glossopharyngeal-nerve-taste', [1210, 345]);
  S.pin('vagus-nerve-taste', 'vagus-nerve-taste', [1210, 430]);
  S.pin('taste-bud-sense', 'taste-bud', [1175, 740]);
  S.pin('gustatory-receptor-sense', 'gustatory-receptor', [1225, 700]);
}
plates.push({
  key: 'smell-taste', moduleId: MOD, kind: 'tissue-schematic', lessons: ['olfaction', 'taste', 'special-senses-integration'], purpose: 'Compact overview of olfactory pathway and taste innervation.',
  title: ['Smell and taste: pathways and receptor cells (schematic)', 'Olfato y gusto: vías y células receptoras (esquema)'],
  desc: ['Left: simplified sagittal nose. Olfactory epithelium in the roof of the nasal cavity sends olfactory nerve fibres up through the cribriform plate to the olfactory bulb above it. Middle: schematic of the epithelium, in which the olfactory receptor cells are bipolar neurons with cilia reaching the mucus and axons leaving below. Right: dorsal view of the tongue with taste territories: the facial nerve for the anterior two-thirds, the glossopharyngeal nerve for the posterior third, the vagus nerve near the epiglottis; below, a schematic taste bud with gustatory receptor cells. Original schematics, not photomicrographs; territories are simplified.',
    'Izquierda: nariz en corte sagital simplificado. El epitelio olfatorio del techo de la cavidad nasal envía fibras del nervio olfatorio hacia arriba a través de la lámina cribosa hasta el bulbo olfatorio. Centro: esquema del epitelio, donde las células receptoras olfatorias son neuronas bipolares con cilios que alcanzan el moco y axones que salen por debajo. Derecha: vista dorsal de la lengua con los territorios gustativos: nervio facial para los dos tercios anteriores, nervio glosofaríngeo para el tercio posterior y nervio vago cerca de la epiglotis; debajo, un botón gustativo esquemático con células receptoras gustativas. Esquemas originales, no fotomicrografías; los territorios están simplificados.'],
  orientation: ['left: sagittal nose, anterior at viewer left; middle: epithelium, lumen at top; right: tongue dorsal view, tip at top', 'izquierda: nariz sagital, anterior a la izquierda; centro: epitelio, luz arriba; derecha: vista dorsal de la lengua, punta arriba'], draw: smellTaste,
});
void cr;
