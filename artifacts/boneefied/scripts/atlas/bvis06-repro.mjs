// BVIS06 reproductive plates: male overview + penis section, testis and duct pathway, female gross, ovary and follicle, uterine wall.
import { T, LUM, net, patch, circ, rect, sm, poly, E, RR, tube, cr, A, V, wav } from './bvis06-lib.mjs';
const M = (s) => 'male-reproductive-' + s;
const F = (s) => 'female-reproductive-' + s;
export const plates = [];
const rad = (a) => (a * Math.PI) / 180;
const UR = { fill: '#E9D3A0', line: '#8A7A3A' };
const mx = (pts, c = 470) => pts.map(([x, y]) => [2 * c - x, y]);

// ------------------------------------------------------------ 1 male overview
function male(S) {
  S.panel(30, 30, 880, 940, 'overview'); S.panel(930, 30, 490, 940, 'shaft'); S.at('overview');
  S.sh(M('scrotum'), E(470, 690, 230, 150), { fill: '#E2C6B4', line: '#8A6E5E', sw: 1.8 });
  const L = (f) => { f(false); f(true); };
  L((r) => { const m = (p) => (r ? mx(p) : p); S.sh(M('testis'), E(r ? 610 : 330, 722, 46, 70, r ? -8 : 8), { ...T.testis, sw: 1.6 }); });
  const duct = [[316, 786], [358, 772], [374, 690], [376, 560], [372, 430], [366, 330], [386, 282], [412, 312], [420, 338]];
  const epi = [[352, 664], [308, 700], [296, 745], [316, 786]];
  net(S, [
    { id: M('epididymis'), pts: epi, w: 18, fill: '#E9D3A0', line: '#8A7A3A', lum: LUM, lw: 5 }, { id: M('epididymis'), pts: mx(epi), w: 18, fill: '#E9D3A0', line: '#8A7A3A', lum: LUM, lw: 5 },
    { id: M('ductus-deferens'), pts: duct, w: 11, fill: '#E9D3A0', line: '#8A7A3A', lum: LUM, lw: 4 }, { id: M('ductus-deferens'), pts: mx(duct), w: 11, fill: '#E9D3A0', line: '#8A7A3A', lum: LUM, lw: 4 },
  ]);
  S.sh('urinary-system-urinary-bladder', E(470, 210, 110, 90), { ...T.bladder, sw: 1.8 });
  const sv = [[352, 336], [398, 334], [420, 376], [396, 424], [356, 400], [340, 362]];
  S.sh(M('seminal-vesicle'), sm(sv, true, 5), { ...T.gland, sw: 1.6 }); S.sh(M('seminal-vesicle'), sm(mx(sv), true, 5), { ...T.gland, sw: 1.6 });
  S.sh(M('prostate-gland'), E(470, 405, 82, 62), { ...T.gland, sw: 1.8 });
  S.sh(M('root-of-penis'), E(470, 545, 64, 34), { fill: '#DDBFAE', line: '#8A6E5E', sw: 1.6 });
  S.sh(M('body-of-penis'), tube([[470, 560], [470, 880]], 86, 86), { fill: '#E3C7B4', line: '#8A6E5E', sw: 1.6 });
  S.sh(M('prepuce'), E(470, 918, 56, 46), { fill: '#EAD3C4', line: '#8A6E5E', sw: 1.6 });
  S.sh(M('glans-penis'), E(470, 912, 40, 32), { fill: '#D9A29A', line: '#8A5A58', sw: 1.6 });
  S.sh(M('bulbourethral-gland'), circ(430, 525, 15), { ...T.gland, sw: 1.4 }); S.sh(M('bulbourethral-gland'), circ(510, 525, 15), { ...T.gland, sw: 1.4 });
  const g = { fill: UR.fill, line: UR.line, lum: LUM };
  net(S, [
    { id: M('prostatic-urethra'), pts: [[470, 300], [470, 400], [470, 462]], w: 26, ...g, lw: 12 },
    { id: M('urethra'), pts: [[470, 462], [470, 520]], w: 20, ...g, lw: 8 },
    { id: M('spongy-urethra'), pts: [[470, 520], [470, 600], [470, 880], [470, 912]], w: 14, ...g, lw: 5 },
    { id: M('ampulla-of-ductus-deferens'), pts: [[420, 338], [440, 378]], w: 22, ...g, lw: 9 }, { id: M('ampulla-of-ductus-deferens'), pts: [[520, 338], [500, 378]], w: 22, ...g, lw: 9 },
    { id: M('ejaculatory-duct'), pts: [[440, 378], [458, 420], [470, 446]], w: 9, ...g, lw: 3 }, { id: M('ejaculatory-duct'), pts: [[500, 378], [482, 420], [470, 446]], w: 9, ...g, lw: 3 },
    { pts: [[438, 530], [470, 546]], w: 5, ...g, lw: 2 }, { pts: [[502, 530], [470, 546]], w: 5, ...g, lw: 2 },
  ]);
  [['urinary-system-urinary-bladder', 'urinary-system-urinary-bladder', [470, 190]], ['prostate-gland', null, [420, 440]], ['seminal-vesicle', null, [372, 384]], ['ampulla-of-ductus-deferens', null, [430, 358]], ['ejaculatory-duct', null, [452, 410]],
    ['prostatic-urethra', null, [470, 350]], ['urethra', null, [470, 492]], ['spongy-urethra', null, [470, 760]], ['bulbourethral-gland', null, [430, 525]], ['root-of-penis', null, [418, 548]], ['body-of-penis', null, [440, 780]], ['glans-penis', null, [470, 912]],
    ['prepuce', null, [518, 926]], ['scrotum', null, [560, 800]], ['ductus-deferens', null, [376, 600]], ['epididymis', null, [298, 740]], ['testis', null, [332, 722]]].forEach(([id, k, h]) => S.pin(id.includes('-system-') ? id : M(id), k ?? M(id), h));
  S.pin(M('penis'), M('root-of-penis') + '+' + M('body-of-penis') + '+' + M('glans-penis'), [498, 760]);
  S.at('shaft');
  S.sh(null, E(1175, 410, 205, 178), { fill: '#EAD3C4', line: '#8A6E5E', sw: 1.8 });
  S.sh(null, E(1175, 410, 180, 154), { fill: '#EFE0C8', line: '#A59A82', sw: 1.4 });
  [[1105, 370], [1245, 370]].forEach(([x, y]) => { S.sh('cav', E(x, y, 78, 86), { fill: '#D9A0A0', line: '#8A524D', sw: 1.6 }); for (let i = 0; i < 14; i++) S.sh('cav', circ(x + Math.cos(i * 2.4) * (8 + (i % 4) * 14), y + Math.sin(i * 2.4) * (10 + (i % 5) * 12), 9), { fill: '#C98583', line: '#8A524D', sw: 1 }); });
  S.sh('spo', E(1175, 500, 56, 52), { fill: '#DCA58E', line: '#8A524D', sw: 1.6 });
  net(S, [{ id: M('spongy-urethra'), pts: [[1160, 500], [1190, 500]], w: 16, ...g, lw: 7 }]);
  S.sh(null, circ(1175, 288, 13), { fill: V.fill, line: V.line, sw: 1.3 });
  S.pin(M('corpus-cavernosum'), 'cav', [1105, 330]); S.pin(M('corpus-spongiosum'), 'spo', [1175, 470]); S.pin(M('spongy-urethra'), M('spongy-urethra'), [1175, 500]);
  S.pins.find((p) => p.panel === 'shaft' && p.structureId === M('spongy-urethra')).key = M('spongy-urethra');
}
plates.push({
  key: 'male-system', moduleId: 'male-reproductive', kind: 'gross-diagram', lessons: ['male-glands', 'male-external', 'male-relationships'], purpose: 'Male reproductive tract in anterior view with accessory glands, urethral segments and external parts, plus a transverse section of the penile shaft.',
  title: ['Male reproductive tract, glands and penis', 'Aparato reproductor masculino, glándulas y pene'],
  desc: ['Left: schematic anterior view, patient right at viewer left; the penis and scrotum are drawn in front of the pelvic structures. Each testis lies in the scrotum with its epididymis; the ductus deferens climbs in the spermatic cord, passes behind the bladder and widens into an ampulla. The duct of the seminal vesicle joins it to form the ejaculatory duct, which runs through the prostate to open into the prostatic urethra. The urethra continues as the short membranous segment, where the bulbourethral glands add their secretion, and then as the spongy urethra inside the penis (root, body and glans, covered at the tip by the prepuce). The ductus is shown on one path per side and its course behind the bladder is simplified. Right: transverse section of the penile shaft: two corpora cavernosa above and the corpus spongiosum below, which surrounds the spongy urethra. Muscles of the scrotum and perineum and the penile vessels are omitted.',
    'Izquierda: vista anterior esquemática, derecha del paciente a la izquierda; el pene y el escroto se dibujan delante de las estructuras pélvicas. Cada testículo está en el escroto con su epidídimo; el conducto deferente asciende en el cordón espermático, pasa detrás de la vejiga y se ensancha en una ampolla. El conducto de la vesícula seminal se une a él para formar el conducto eyaculador, que atraviesa la próstata y desemboca en la uretra prostática. La uretra continúa como el corto segmento membranoso, donde las glándulas bulbouretrales añaden su secreción, y luego como uretra esponjosa dentro del pene (raíz, cuerpo y glande, cubierto en la punta por el prepucio). El conducto se muestra con un trayecto por lado y su recorrido tras la vejiga está simplificado. Derecha: corte transversal del cuerpo del pene: dos cuerpos cavernosos arriba y el cuerpo esponjoso abajo, que rodea la uretra esponjosa. Se omiten los músculos del escroto y del periné y los vasos del pene.'],
  orientation: ['left: anterior view, patient right at viewer left; right: transverse section of the penile shaft, dorsal side above', 'izquierda: vista anterior, derecha del paciente a la izquierda; derecha: corte transversal del cuerpo del pene, cara dorsal arriba'], draw: male,
});

// ------------------------------------------------------------ 2 testis and ducts
function testis(S) {
  S.panel(30, 30, 880, 940, 'testis'); S.panel(930, 30, 490, 940, 'tubule'); S.at('testis');
  S.sh(M('tunica-vaginalis'), E(400, 520, 252, 322), { fill: '#EFE6D6', line: '#A59A82', sw: 1.6 });
  S.sh(M('tunica-albuginea'), E(400, 520, 232, 302), { fill: '#E4D4B4', line: '#8A7A5A', sw: 1.6 });
  S.sh('ti', E(400, 520, 216, 286), { fill: '#EBD9B6', line: '#8A7A5A', sw: 1.2 });
  const P = (a, f = 1) => [400 + 216 * f * Math.cos(rad(a)), 520 + 286 * f * Math.sin(rad(a))];
  S.clipBoth(sm(Array.from({ length: 24 }, (_, i) => P(i * 15)), true, 4));
  for (let k = 0; k < 6; k++) { const a = 112 + k * 27; S.sh(M('testicular-lobule'), poly([[560, 520], P(a - 12), P(a + 12)]), { fill: k % 2 ? '#F0DFBE' : '#E8D3AA', line: '#B49C70', sw: 1 }); }
  S.clipBothEnd();
  S.sh(M('testicular-mediastinum'), RR(544, 360, 56, 320, 22), { fill: '#D9CBB0', line: '#8A7A5A', sw: 1.4 });
  const tub = { fill: '#E6C79C', line: '#8A6E3C', lum: LUM }, items = [];
  items.push({ id: M('rete-testis'), pts: [[573, 392], [573, 640]], w: 12, fill: '#E9D3A0', line: '#8A7A3A', lum: LUM, lw: 5 });
  [[420, 392], [440, 560], [596, 440], [596, 600]].forEach(([x, y]) => 0);
  for (let k = 0; k < 6; k++) { const a = 112 + k * 27, s = P(a, 0.86), y1 = 410 + k * 46; const pts = []; for (let t = 0; t <= 12; t++) { const u = t / 12; pts.push([s[0] + (570 - s[0]) * u, s[1] + (y1 - s[1]) * u + Math.sin(u * 14 + k) * 14 * (1 - u)]); } items.push({ id: M('seminiferous-tubule'), pts, w: 9, ...tub, lw: 3 }); }
  [[573, 400, 566, 330, 556, 272, 566, 238], [573, 410, 604, 340, 626, 270, 622, 216], [573, 420, 622, 360, 676, 308, 690, 256]].forEach(([a, b, c, d, e, f, g, h]) => items.push({ id: M('efferent-ductule'), pts: [[a, b], [c, d], [e, f], [g, h]], w: 8, fill: '#E9D3A0', line: '#8A7A3A', lum: LUM, lw: 3 }));
  const ep = { fill: '#E9D3A0', line: '#8A7A3A', lum: LUM };
  items.push({ id: M('head-of-epididymis'), pts: [[566, 238], [620, 214], [690, 252], [700, 332]], w: 36, ...ep, lw: 12 });
  items.push({ id: M('body-of-epididymis'), pts: [[700, 332], [706, 520], [692, 700]], w: 28, ...ep, lw: 9 });
  items.push({ id: M('tail-of-epididymis'), pts: [[692, 700], [686, 760], [650, 800]], w: 28, ...ep, lw: 9 });
  items.push({ id: M('ductus-deferens'), pts: [[650, 800], [740, 792], [796, 640], [792, 300], [766, 110]], w: 18, ...ep, lw: 7 });
  net(S, items);
  S.pin(M('testis'), 'ti', [250, 650]); S.pin(M('interstitial-tissue'), 'ti', [300, 300]);
  [['tunica-vaginalis', [400, 520 - 316]], ['tunica-albuginea', [400, 520 - 296]], ['testicular-lobule', null], ['testicular-mediastinum', [572, 520]], ['seminiferous-tubule', [300, 410]], ['rete-testis', [573, 590]], ['efferent-ductule', [596, 336]], ['head-of-epididymis', [650, 224]],
    ['body-of-epididymis', [704, 520]], ['tail-of-epididymis', [680, 768]], ['ductus-deferens', [790, 440]]].forEach(([id, h]) => S.pin(M(id), M(id), h ?? undefined));
  S.pins.find((p) => p.structureId === M('testicular-lobule')).hint = [380, 320];
  // seminiferous tubule in cross-section
  S.at('tubule');
  const cx = 1185, cy = 470;
  S.sh(M('interstitial-tissue'), rect(950, 60, 460, 880), { fill: '#EFE3CC', line: '#EFE3CC', sw: 0.5 });
  [[1000, 170], [1020, 196], [990, 204], [1385, 180], [1368, 210], [1000, 760], [1022, 786], [1380, 770], [1360, 800]].forEach(([x, y]) => S.sh(M('leydig-cell'), circ(x, y, 15), { fill: '#D9A08C', line: '#8A5A4A', sw: 1.3 }));
  S.sh(M('peritubular-myoid-cell'), circ(cx, cy, 222), { fill: '#C8B89A', line: '#7A6A4A', sw: 1.6 });
  S.sh(M('seminiferous-tubule'), circ(cx, cy, 204), { fill: '#EDE0C8', line: '#8A7A5A', sw: 1.2 });
  for (let i = 0; i < 12; i++) { const a = i * 30, a1 = rad(a - 10), a2 = rad(a + 10), p = (r, aa) => [cx + r * Math.cos(aa), cy + r * Math.sin(aa)];
    S.sh(M('sertoli-cell'), poly([p(200, a1), p(200, a2), p(98, rad(a + 3)), p(98, rad(a - 3))]), { fill: '#E1C7A0', line: '#8A6E3C', sw: 1.2 });
    S.sh(null, E(...p(184, rad(a)), 13, 8, a), { fill: '#B79A7A', line: '#6A5A3A', sw: 1 }); }
  for (let i = 0; i < 12; i++) { const a = rad(i * 30 + 15); S.sh(M('spermatogonium'), circ(cx + 188 * Math.cos(a), cy + 188 * Math.sin(a), 12), { fill: '#C9A9C4', line: '#76566A', sw: 1.2 }); }
  for (let i = 0; i < 12; i++) { const a = rad(i * 30 + 15); S.sh(M('primary-spermatocyte'), circ(cx + 150 * Math.cos(a), cy + 150 * Math.sin(a), 18), { fill: '#B792B4', line: '#6A4A68', sw: 1.2 }); }
  for (let i = 0; i < 12; i++) { const a = rad(i * 30 + 15); S.sh(M('spermatid'), circ(cx + 112 * Math.cos(a), cy + 112 * Math.sin(a), 9), { fill: '#D2BBD0', line: '#76566A', sw: 1.1 }); }
  S.ln(M('blood-testis-barrier'), `M${cx + 170} ${cy}A170 170 0 1 1 ${cx - 170} ${cy}A170 170 0 1 1 ${cx + 170} ${cy}`, { color: '#6A5A3A', w: 4 });
  S.sh(null, circ(cx, cy, 84), { fill: LUM, line: '#B49C92', sw: 1.2 });
  [[-30, -20, 20], [24, -34, -30], [-14, 26, 70], [36, 22, 140], [-44, 10, 200]].forEach(([dx, dy, r]) => { const x = cx + dx, y = cy + dy, a = rad(r); S.ln(M('spermatozoon'), `M${x} ${y}L${x + 30 * Math.cos(a)} ${y + 30 * Math.sin(a)}`, { color: '#8A5A58', w: 2 }); S.sh(M('spermatozoon'), E(x, y, 8, 5, r), { fill: '#C27E7A', line: '#7E4A49', sw: 1 }); });
  [['peritubular-myoid-cell', [cx, cy - 213]], ['sertoli-cell', null], ['spermatogonium', null], ['primary-spermatocyte', null], ['spermatid', null], ['blood-testis-barrier', null], ['spermatozoon', null], ['leydig-cell', [1000, 170]], ['interstitial-tissue', [1180, 800]], ['seminiferous-tubule', null]].forEach(([id, h]) => S.pin(M(id), M(id), h ?? undefined));
  const hints = { 'sertoli-cell': [cx + 143, cy + 20], spermatogonium: [cx + 188 * Math.cos(rad(15)), cy + 188 * Math.sin(rad(15))], 'primary-spermatocyte': [cx + 150 * Math.cos(rad(15)), cy + 150 * Math.sin(rad(15))], spermatid: [cx + 112 * Math.cos(rad(75)), cy + 112 * Math.sin(rad(75))], 'blood-testis-barrier': [cx - 170, cy], spermatozoon: [cx - 14, cy + 26], 'seminiferous-tubule': [cx + 120, cy + 200 * 0.7] };
  S.pins.forEach((p) => { if (p.panel === 'tubule' && hints[p.structureId.slice(18)]) p.hint = hints[p.structureId.slice(18)]; });
}
plates.push({
  key: 'testis-ducts', moduleId: 'male-reproductive', kind: 'tissue-schematic', lessons: ['male-testis', 'male-ducts', 'male-histology'], purpose: 'Testis in section with the connected pathway to the ductus deferens, and a seminiferous tubule in cross-section.',
  title: ['Testis, epididymis and seminiferous tubule', 'Testículo, epidídimo y túbulo seminífero'],
  desc: ['Left: schematic sagittal section of a testis. A serous tunica vaginalis surrounds the tunica albuginea. Fibrous septa divide the testis into lobules, each packed with coiled seminiferous tubules in interstitial tissue. The tubules straighten and open into the rete testis inside the testicular mediastinum. Efferent ductules leave the rete, pierce the tunica albuginea and join the head of the epididymis; sperm then pass along its body and tail into the ductus deferens. The epididymis is drawn as a single duct and the coiling inside it is not shown. Right: seminiferous tubule in cross-section: a wall of peritubular myoid cells, Sertoli cells spanning from wall to lumen, and germ cells arranged from the periphery toward the lumen (spermatogonia, primary spermatocytes, spermatids, then spermatozoa in the lumen). A blood-testis barrier between neighbouring Sertoli cells separates the inner compartment. Leydig cells lie outside the tubules in the interstitial tissue. Spermatogenesis is simplified; secondary spermatocytes, acrosome and flagellum detail are not shown.',
    'Izquierda: corte sagital esquemático de un testículo. Una túnica vaginal serosa rodea la túnica albugínea. Tabiques fibrosos dividen el testículo en lobulillos, cada uno repleto de túbulos seminíferos contorneados en tejido intersticial. Los túbulos se enderezan y se abren en la rete testis dentro del mediastino testicular. Los conductillos eferentes salen de la rete, atraviesan la túnica albugínea y se unen a la cabeza del epidídimo; los espermatozoides recorren luego su cuerpo y su cola hasta el conducto deferente. El epidídimo se dibuja como un solo conducto y no se muestra su enrollamiento. Derecha: túbulo seminífero en corte transversal: una pared de células mioides peritubulares, células de Sertoli que van de la pared a la luz y células germinales dispuestas de la periferia a la luz (espermatogonias, espermatocitos primarios, espermátidas y espermatozoides en la luz). Una barrera hematotesticular entre células de Sertoli vecinas separa el compartimento interno. Las células de Leydig están fuera de los túbulos, en el tejido intersticial. La espermatogénesis está simplificada; no se muestran espermatocitos secundarios, acrosoma ni detalle del flagelo.'],
  orientation: ['left: sagittal section of the testis, epididymis on the right (posterior) side; right: seminiferous tubule in cross-section, lumen at centre', 'izquierda: corte sagital del testículo, epidídimo a la derecha (posterior); derecha: túbulo seminífero en corte transversal, luz al centro'], draw: testis,
});

// ------------------------------------------------------------ 3 female gross
function femGross(S) {
  S.panel(30, 30, 880, 940, 'gross'); S.panel(930, 30, 490, 940, 'detail'); S.at('gross');
  const cx = 470, Lh = [[470, 262], [385, 282], [342, 330], [350, 430], [390, 560], [430, 596]];
  S.sh(F('broad-ligament'), sm([[352, 330], [300, 318], [170, 326], [96, 380], [86, 600], [120, 700], [200, 700], [352, 640], [588, 640], [740, 700], [820, 700], [854, 600], [844, 380], [770, 326], [640, 318], [588, 330]], true, 5), { fill: '#F0DBD2', line: '#B58E82', sw: 1.4 });
  const uw = [...Lh, ...mx(Lh).reverse().slice(1, -0 || undefined)];
  const wallD = sm([...Lh, ...mx(Lh).slice(0, -1).reverse(), ], true, 6);
  S.sh(null, wallD, { ...T.uterus, sw: 1.8 });
  S.clipBoth(wallD);
  S.sh(F('fundus-of-uterus'), poly([[300, 200], [640, 200], [640, 346], [300, 346]]), { fill: '#D8A9A6', line: '#D8A9A6', sw: 0.5 });
  S.sh(F('body-of-uterus'), poly([[300, 346], [640, 346], [640, 620], [300, 620]]), { fill: '#CF9E9B', line: '#CF9E9B', sw: 0.5 });
  S.clipBothEnd();
  S.out.push(`<path d="${wallD}" fill="none" stroke="${T.uterus.line}" stroke-width="1.8"/>`);
  S.sh(F('vagina'), sm([[392, 676], [548, 676], [562, 800], [554, 930], [386, 930], [378, 800]], true, 5), { fill: '#D9A6A0', line: '#8A5A58', sw: 1.8 });
  S.sh(F('vaginal-fornix'), poly([[406, 690], [534, 690], [542, 810], [536, 924], [404, 924], [398, 810]]), { fill: LUM, line: '#B49C92', sw: 1.2 });
  const tube = { fill: '#E4B6AE', line: '#8A524D', lum: LUM };
  const isth = [[412, 326], [352, 326], [318, 310], [286, 300]], amp = [[286, 300], [238, 288], [188, 308], [150, 380], [142, 452]], inf = [[142, 452], [134, 482]];
  net(S, [
    { id: F('isthmus-of-uterine-tube'), pts: isth, w: 14, ...tube, lw: 6 }, { id: F('isthmus-of-uterine-tube'), pts: mx(isth), w: 14, ...tube, lw: 6 },
    { id: F('ampulla-of-uterine-tube'), pts: amp, w: 24, ...tube, lw: 12 }, { id: F('ampulla-of-uterine-tube'), pts: mx(amp), w: 24, ...tube, lw: 12 },
    { id: F('infundibulum'), pts: inf, w: 40, ...tube, lw: 24 }, { id: F('infundibulum'), pts: mx(inf), w: 40, ...tube, lw: 24 },
  ]);
  S.sh(F('cervix'), RR(430, 560, 80, 146, 24), { fill: '#C58E8A', line: '#8A5A58', sw: 1.8 });
  S.sh(F('uterus'), poly([[395, 318], [545, 318], [478, 560], [462, 560]]), { fill: LUM, line: '#B49C92', sw: 1.2 });
  S.sh(F('cervical-canal'), RR(459, 560, 22, 146, 8), { fill: LUM, line: '#B49C92', sw: 1.2 });
  S.sh(F('internal-os'), E(470, 566, 11, 7), { fill: '#B87972', line: '#7E4A49', sw: 1 }); S.sh(F('external-os'), E(470, 704, 11, 6), { fill: '#B87972', line: '#7E4A49', sw: 1 });
  [false, true].forEach((r) => { const m = (p) => (r ? mx([p])[0] : p);
    const fim = [[[134, 486], [100, 536]], [[134, 486], [118, 546]], [[134, 486], [140, 552]], [[134, 486], [162, 546]]];
    fim.forEach(([a, b]) => { const A1 = m(a), B1 = m(b); S.sh(F('fimbriae'), poly([[A1[0] - 14, A1[1]], [A1[0] + 14, A1[1]], B1]), { fill: '#E4B6AE', line: '#8A524D', sw: 1.3 }); });
    S.sh(F('ovary'), E(r ? 940 - 192 : 192, 600, 58, 38, r ? -20 : 20), { ...T.ovary, sw: 1.6 });
    S.ln(F('ovarian-ligament'), `M${m([246, 590])[0]} 590Q${m([320, 520])[0]} 520 ${m([388, 440])[0]} 440`, { color: '#B58E82', w: 9 });
    S.ln(F('suspensory-ligament-of-ovary'), `M${m([160, 566])[0]} 566Q${m([124, 600])[0]} 610 ${m([108, 660])[0]} 664`, { color: '#B58E82', w: 9 }); });
  [['uterus', F('fundus-of-uterus') + '+' + F('body-of-uterus') + '+' + F('cervix'), [372, 450]], ['fundus-of-uterus', null, [470, 286]], ['body-of-uterus', null, [356, 470]], ['cervix', null, [470, 640]], ['cervical-canal', null, [470, 640]], ['vagina', null, [400, 800]], ['vaginal-fornix', null, [418, 704]],
    ['isthmus-of-uterine-tube', null, [352, 326]], ['ampulla-of-uterine-tube', null, [168, 340]], ['infundibulum', null, [140, 470]], ['fimbriae', null, [118, 530]], ['ovary', null, [192, 604]], ['ovarian-ligament', null, [320, 520]], ['suspensory-ligament-of-ovary', null, [128, 616]], ['broad-ligament', null, [250, 670]]]
    .forEach(([id, k, h]) => S.pin(F(id), k ?? F(id), h));
  S.pin(F('uterine-tube'), F('isthmus-of-uterine-tube') + '+' + F('ampulla-of-uterine-tube') + '+' + F('infundibulum'), [286, 300]);
  void uw;
  S.at('detail');
  const dc = 1175, H2 = [[1175, 80], [1090, 100], [1050, 200], [1070, 360], [1110, 500], [1130, 560]];
  const dwall = sm([...H2, ...mx(H2, dc).slice(0, -1).reverse()], true, 6);
  net(S, [{ pts: [[1100, 190], [1040, 160], [980, 150]], w: 16, fill: '#E4B6AE', line: '#8A524D', lum: LUM, lw: 6 }, { pts: mx([[1100, 190], [1040, 160], [980, 150]], dc), w: 16, fill: '#E4B6AE', line: '#8A524D', lum: LUM, lw: 6 }]);
  S.sh(null, dwall, { ...T.uterus, sw: 1.8 });
  S.clipBoth(dwall);
  S.sh('D-fundus', poly([[960, 40], [1390, 40], [1390, 240], [960, 240]]), { fill: '#D8A9A6', line: '#D8A9A6', sw: 0.5 });
  S.sh('D-body', poly([[960, 240], [1390, 240], [1390, 640], [960, 640]]), { fill: '#CF9E9B', line: '#CF9E9B', sw: 0.5 });
  S.clipBothEnd();
  S.out.push(`<path d="${dwall}" fill="none" stroke="${T.uterus.line}" stroke-width="1.8"/>`);
  S.sh('D-vagina', sm([[1060, 700], [1290, 700], [1306, 820], [1296, 940], [1054, 940], [1044, 820]], true, 5), { fill: '#D9A6A0', line: '#8A5A58', sw: 1.8 });
  S.sh('D-fornix', poly([[1080, 716], [1270, 716], [1282, 820], [1274, 930], [1076, 930], [1068, 820]]), { fill: LUM, line: '#B49C92', sw: 1.2 });
  S.sh('D-cervix', RR(1112, 548, 126, 190, 30), { fill: '#C58E8A', line: '#8A5A58', sw: 1.8 });
  S.sh(null, poly([[1085, 176], [1265, 176], [1198, 548], [1152, 548]]), { fill: LUM, line: '#B49C92', sw: 1.2 });
  S.sh('D-canal', RR(1157, 536, 36, 196, 10), { fill: LUM, line: '#B49C92', sw: 1.2 });
  S.sh('D-ios', E(1175, 542, 24, 9), { fill: LUM, line: '#B87972', sw: 4 });
  S.sh('D-eos', E(1175, 730, 24, 10), { fill: LUM, line: '#B87972', sw: 4 });
  S.pin(F('uterus'), 'D-fundus+D-body+D-cervix', [1080, 400]); S.pin(F('fundus-of-uterus'), 'D-fundus', [1175, 120]); S.pin(F('body-of-uterus'), 'D-body', [1075, 330]); S.pin(F('cervix'), 'D-cervix', [1128, 640]);
  S.pin(F('cervical-canal'), 'D-canal', [1175, 640]); S.pin(F('internal-os'), 'D-ios', [1175, 542]); S.pin(F('external-os'), 'D-eos', [1175, 730]); S.pin(F('vagina'), 'D-vagina', [1070, 830]); S.pin(F('vaginal-fornix'), 'D-fornix', [1100, 740]);
}
plates.push({
  key: 'female-gross', moduleId: 'female-reproductive', kind: 'gross-diagram', lessons: ['female-tube', 'female-uterus', 'female-support', 'female-pathway'], purpose: 'Female internal organs in anterior view (ovary, uterine tube regions, uterus, cervix, vagina, ligaments) with an enlarged uterine cavity, cervical canal and vagina detail.',
  title: ['Female internal organs: ovary, tube, uterus and vagina', 'Órganos internos femeninos: ovario, trompa, útero y vagina'],
  desc: ['Anterior view of the female pelvic organs in a coronal plan, patient right at viewer left; the two sides are drawn alike and labelled on the left. From the ovary, an oocyte passes into the uterine tube: the fimbriae of the funnel-shaped infundibulum lie close to the ovary (not sealed to it), the long ampulla comes next, then the narrow isthmus enters the uterine wall and opens into the uterine cavity. The uterus has a fundus (above the tube openings), a body and a cervix whose canal runs from the internal os to the external os and opens into the vagina; the vaginal fornix is the recess around the cervix. The ovarian ligament joins the ovary to the uterus, the suspensory ligament of the ovary attaches it toward the pelvic wall, and the broad ligament is the peritoneal sheet draped over the tube, ovary and uterus. Right: the same uterus, cervix and vagina enlarged and opened: the cavity narrows at the internal os into the cervical canal, which reaches the vagina at the external os; the fornix is the recess around the cervix. Simplified; the round ligament, mesovarium and vessels are omitted.',
    'Vista anterior de los órganos pélvicos femeninos en plano coronal, derecha de la paciente a la izquierda; los dos lados se dibujan igual y se rotulan en el izquierdo. Desde el ovario, el ovocito pasa a la trompa uterina: las fimbrias del infundíbulo en embudo quedan cerca del ovario (no sellado a él), sigue la larga ampolla y luego el istmo estrecho entra en la pared uterina y se abre en la cavidad uterina. El útero tiene fondo (por encima de las aberturas de las trompas), cuerpo y cuello cuyo conducto va del orificio interno al externo y se abre en la vagina; el fondo de saco vaginal es el receso alrededor del cuello. El ligamento propio del ovario une el ovario al útero, el ligamento suspensorio lo fija hacia la pared pélvica y el ligamento ancho es la lámina peritoneal que cubre trompa, ovario y útero. Derecha: el mismo útero, cuello y vagina ampliados y abiertos: la cavidad se estrecha en el orificio interno hacia el conducto cervical, que llega a la vagina por el orificio externo; el fondo de saco es el receso alrededor del cuello. Simplificado; se omiten el ligamento redondo, el mesoovario y los vasos.'],
  orientation: ['left: anterior view, patient right at viewer left; right: enlarged opened uterus, cervix and vagina', 'izquierda: vista anterior, derecha de la paciente a la izquierda; derecha: útero, cuello y vagina ampliados y abiertos'], draw: femGross,
});

// ------------------------------------------------------------ 4 ovary and follicle
function ovary(S) {
  S.panel(30, 30, 880, 940, 'ovary'); S.panel(930, 30, 490, 940, 'follicle'); S.at('ovary');
  const P = (f, a) => [420 + 330 * f * Math.cos(rad(a)), 480 + 290 * f * Math.sin(rad(a))];
  S.sh(F('ovarian-cortex'), E(420, 480, 330, 290), { fill: '#E9CDBE', line: '#8A6256', sw: 1.8 });
  S.sh(F('ovarian-medulla'), E(430, 470, 150, 130), { fill: '#D9A9A0', line: '#8A5A58', sw: 1.4 });
  S.sh(F('ovarian-hilum'), poly([[560, 440], [760, 436], [764, 520], [560, 510]]), { fill: '#D9A9A0', line: '#D9A9A0', sw: 0.5 });
  net(S, [{ pts: [[780, 470], [660, 458], [560, 450], [480, 430]], w: 14, fill: A.fill, line: A.line }, { pts: [[780, 500], [660, 494], [560, 486], [470, 500]], w: 18, fill: V.fill, line: V.line }]);
  for (const [f, a] of [[0.9, 196], [0.92, 208], [0.88, 220], [0.91, 232]]) { const [x, y] = P(f, a); S.sh(F('primordial-follicle'), circ(x, y, 12), { fill: '#EADFC8', line: '#8A7A60', sw: 1.2 }); S.sh(F('oocyte'), circ(x, y, 6), { fill: '#C9A9C4', line: '#76566A', sw: 1 }); }
  const foll = (key, f, a, r, o) => { const [x, y] = P(f, a); S.sh(F(key), circ(x, y, r), { fill: o.fill, line: o.line, sw: 1.5 }); return [x, y]; };
  let [x, y] = foll('primary-follicle', 0.8, 252, 26, { fill: '#E7CFA6', line: '#8A6E3C' }); S.sh(F('oocyte'), circ(x, y, 13), { fill: '#C9A9C4', line: '#76566A', sw: 1.2 });
  [x, y] = foll('secondary-follicle', 0.78, 285, 38, { fill: '#E5C79A', line: '#8A6E3C' }); S.sh(F('oocyte'), circ(x, y, 14), { fill: '#C9A9C4', line: '#76566A', sw: 1.2 }); S.sh(null, circ(x, y, 22), { fill: '#EDD8B0', line: '#B49C70', sw: 1 }); S.sh(F('oocyte'), circ(x, y, 12), { fill: '#C9A9C4', line: '#76566A', sw: 1.2 });
  [x, y] = foll('antral-follicle', 0.78, 322, 50, { fill: '#E5C79A', line: '#8A6E3C' }); S.sh(null, circ(x - 6, y + 4, 30), { fill: '#F1EBD8', line: '#B49C70', sw: 1 }); S.sh(F('oocyte'), circ(x + 18, y - 12, 9), { fill: '#C9A9C4', line: '#76566A', sw: 1.2 });
  [x, y] = foll('mature-follicle', 0.8, 52, 70, { fill: '#E5C79A', line: '#8A6E3C' }); S.sh(null, circ(x, y, 52), { fill: '#F1EBD8', line: '#B49C70', sw: 1 }); S.sh(F('oocyte'), circ(x - 24, y + 18, 11), { fill: '#C9A9C4', line: '#76566A', sw: 1.2 });
  [x, y] = foll('corpus-luteum', 0.78, 112, 54, { fill: '#E6C86A', line: '#8A6E2A' }); S.sh(null, E(x, y, 20, 14), { fill: '#EFE0A8', line: '#B49C50', sw: 1 });
  foll('corpus-albicans', 0.8, 160, 26, { fill: '#F0E8DA', line: '#A59A82' });
  [['ovary', F('ovarian-cortex') + '+' + F('ovarian-medulla'), [330, 640]], ['ovarian-cortex', null, [190, 480]], ['ovarian-medulla', null, [420, 480]], ['ovarian-hilum', null, [704, 476]], ['primordial-follicle', null, null], ['primary-follicle', null, null], ['secondary-follicle', null, null], ['antral-follicle', null, null], ['mature-follicle', null, null], ['corpus-luteum', null, null], ['corpus-albicans', null, null]]
    .forEach(([id, k, h]) => S.pin(F(id), k ?? F(id), h ?? undefined));
  S.pin(F('ovarian-follicle'), F('primary-follicle') + '+' + F('secondary-follicle') + '+' + F('antral-follicle'), undefined);
  const sp = (id, pos) => { S.pins.find((p) => p.panel === 'ovary' && p.structureId === F(id)).hint = pos; };
  sp('primordial-follicle', P(0.9, 196)); sp('primary-follicle', P(0.8, 252).map((v, i) => v + (i ? 18 : 0))); sp('secondary-follicle', P(0.78, 285).map((v, i) => v + (i ? 30 : 0))); sp('antral-follicle', P(0.78, 322).map((v, i) => v + (i ? 40 : 0)));
  sp('mature-follicle', P(0.8, 52).map((v, i) => v + (i ? 60 : 0))); sp('corpus-luteum', P(0.78, 112).map((v, i) => v + (i ? 44 : 0))); sp('corpus-albicans', P(0.8, 160)); sp('ovarian-follicle', P(0.78, 285).map((v, i) => v + (i ? -34 : 0)));
  // follicle layers
  S.at('follicle');
  const cx = 1175, cy = 440;
  S.sh(F('theca-externa'), circ(cx, cy, 200), { fill: '#D9B79A', line: '#8A6E52', sw: 1.6 });
  S.sh(F('theca-interna'), circ(cx, cy, 178), { fill: '#E6C79E', line: '#8A6E52', sw: 1.3 });
  S.sh(F('granulosa-cell'), circ(cx, cy, 152), { fill: '#E9D8E0', line: '#76566A', sw: 1.4 });
  S.sh(F('follicular-fluid'), circ(cx, cy, 124), { fill: '#F3EEDD', line: '#B49C70', sw: 1.2 });
  S.sh('cumulus', circ(cx - 62, cy + 70, 70), { fill: '#E9D8E0', line: '#76566A', sw: 1.4 });
  S.sh(F('corona-radiata'), circ(cx - 62, cy + 70, 56), { fill: '#DCC4D4', line: '#76566A', sw: 1.3 });
  S.sh(F('zona-pellucida'), circ(cx - 62, cy + 70, 40), { fill: '#EDE2C4', line: '#8A7A5A', sw: 1.3 });
  S.sh(F('oocyte'), circ(cx - 62, cy + 70, 28), { fill: '#C9A9C4', line: '#76566A', sw: 1.3 });
  [['theca-externa', [cx, cy - 190]], ['theca-interna', [cx, cy - 166]], ['granulosa-cell', [cx, cy - 140]], ['follicular-fluid', [cx + 50, cy - 40]], ['corona-radiata', [cx - 62 - 49, cy + 70 - 20]], ['zona-pellucida', [cx - 62 + 35, cy + 70]], ['oocyte', [cx - 62, cy + 70]]].forEach(([id, h]) => S.pin(F(id), F(id), h));
  S.pin(F('theca-cell'), F('theca-interna') + '+' + F('theca-externa'), [cx + 140, cy + 100]);
}
plates.push({
  key: 'ovary-follicle', moduleId: 'female-reproductive', kind: 'tissue-schematic', lessons: ['female-ovary', 'female-histology'], purpose: 'Ovary in section with follicle stages arranged around the cortex through corpus luteum and corpus albicans, and the layers of a mature follicle.',
  title: ['Ovary: follicle stages and follicle wall', 'Ovario: etapas foliculares y pared del folículo'],
  desc: ['Left: schematic section of an ovary. The cortex holds follicles and the medulla holds vessels and loose connective tissue; vessels enter at the hilum. Follicles are placed around the cortex in order of development: primordial (one oocyte in flat cells), primary, secondary (several cell layers), antral (a fluid-filled antrum appears) and a large mature follicle near the surface. After ovulation the follicle wall becomes a corpus luteum, which later shrinks to a pale scar, the corpus albicans. One follicle of each stage is drawn; in life stages overlap and sizes differ. Right: wall of a mature follicle from outside in: theca externa, theca interna, granulosa cells, then the fluid-filled antrum. The oocyte sits on a cumulus of granulosa cells, wrapped by the zona pellucida and the corona radiata. Schematic, not a photomicrograph; no cycle chart is implied.',
    'Izquierda: corte esquemático de un ovario. La corteza contiene folículos y la médula vasos y tejido conjuntivo laxo; los vasos entran por el hilio. Los folículos se colocan alrededor de la corteza en orden de desarrollo: primordial (un ovocito en células planas), primario, secundario (varias capas celulares), antral (aparece un antro con líquido) y un gran folículo maduro cerca de la superficie. Tras la ovulación la pared folicular se convierte en cuerpo lúteo, que luego se reduce a una cicatriz pálida, el cuerpo albicans. Se dibuja un folículo de cada etapa; en la vida real las etapas se solapan y los tamaños varían. Derecha: pared de un folículo maduro de fuera adentro: teca externa, teca interna, células de la granulosa y luego el antro con líquido. El ovocito reposa sobre un cúmulo de células de la granulosa, envuelto por la zona pelúcida y la corona radiada. Esquema, no fotomicrografía; no se sugiere un gráfico del ciclo.'],
  orientation: ['left: sectioned ovary, hilum at viewer right; right: mature follicle in section', 'izquierda: ovario en corte, hilio a la derecha del observador; derecha: folículo maduro en corte'], draw: ovary,
});

// ------------------------------------------------------------ 5 uterine wall
function wall(S) {
  S.panel(30, 30, 880, 940, 'wall'); S.panel(930, 30, 490, 940, 'phases'); S.at('wall');
  S.sh(null, rect(60, 60, 820, 80), { fill: LUM, line: LUM, sw: 0.5 });
  S.sh(F('stratum-functionale'), rect(60, 140, 820, 190), { fill: '#EBCFCB', line: '#9A6A66', sw: 1.2 });
  S.sh(F('stratum-basale'), rect(60, 330, 820, 110), { fill: '#DDB0AC', line: '#9A6A66', sw: 1.2 });
  S.sh(F('myometrium'), rect(60, 440, 820, 360), { fill: '#C9958B', line: '#8A524D', sw: 1.4 });
  S.sh(F('perimetrium'), rect(60, 800, 820, 36), { fill: '#EAD9B6', line: '#A59A82', sw: 1.2 });
  S.sh(null, rect(60, 134, 820, 14), { fill: '#E8BBB2', line: '#B58078', sw: 1 });
  for (let r = 0; r < 7; r++) for (let c = 0; c < 12; c++) { const x = 100 + c * 66 + (r % 2) * 30, y = 470 + r * 46; S.sh(F('smooth-muscle-of-uterus'), E(x, y, 26, 9, (c + r) % 2 ? 24 : -24), { fill: '#BF8479', line: '#8A524D', sw: 1 }); }
  const gx = [130, 250, 370, 490, 610, 730], gl = gx.map((x, i) => ({ id: F('uterine-gland'), pts: [[x, 150], [x + 6, 220], [x - 6, 290], [x + 8, 360], [x + (i % 2 ? 24 : -24), 420]], w: 18, fill: '#E3B4AC', line: '#9A6A66', lum: LUM, lw: 9 }));
  net(S, gl); gx.forEach((x) => patch(S, rect(x - 7, 128, 14, 40), LUM));
  S.pin(F('stratum-functionale'), F('stratum-functionale'), [190, 250]); S.pin(F('stratum-basale'), F('stratum-basale'), [190, 390]); S.pin(F('myometrium'), F('myometrium'), [100, 640]); S.pin(F('perimetrium'), F('perimetrium'), [300, 818]);
  S.pin(F('uterine-gland'), F('uterine-gland'), [250, 290]); S.pin(F('smooth-muscle-of-uterus'), F('smooth-muscle-of-uterus'), [166, 516]);
  S.pin(F('endometrium'), F('stratum-functionale') + '+' + F('stratum-basale'), [310, 330]);
  // phases
  S.at('phases');
  S.sh(F('proliferative-endometrium'), rect(960, 80, 430, 400), { fill: '#EBCFCB', line: '#9A6A66', sw: 1.4 });
  S.sh(F('secretory-endometrium'), rect(960, 520, 430, 400), { fill: '#E6C4C0', line: '#9A6A66', sw: 1.4 });
  S.sh(null, rect(960, 80, 430, 36), { fill: LUM, line: LUM, sw: 0.5 }); S.sh(null, rect(960, 520, 430, 36), { fill: LUM, line: LUM, sw: 0.5 });
  const px = [1010, 1100, 1190, 1280, 1360];
  net(S, px.map((x) => ({ id: 'pg', pts: [[x, 126], [x, 300], [x + 4, 450]], w: 12, fill: '#E3B4AC', line: '#9A6A66', lum: LUM, lw: 5 })));
  net(S, px.map((x) => ({ id: 'sg', pts: wav([x, 568], [x + 4, 900], 14, 18), w: 22, fill: '#E3B4AC', line: '#9A6A66', lum: LUM, lw: 10 })));
  px.forEach((x) => { patch(S, rect(x - 3, 112, 6, 30), LUM); patch(S, rect(x - 5, 552, 10, 30), LUM); });
  S.pin(F('proliferative-endometrium'), F('proliferative-endometrium'), [1055, 260]); S.pin(F('secretory-endometrium'), F('secretory-endometrium'), [1055, 720]);
}
plates.push({
  key: 'uterine-wall', moduleId: 'female-reproductive', kind: 'tissue-schematic', lessons: ['female-wall'], purpose: 'Layers of the uterine wall with endometrial glands, and a simple proliferative versus secretory endometrium comparison.',
  title: ['Uterine wall and endometrium', 'Pared uterina y endometrio'],
  desc: ['Left: schematic section of the uterine wall from the cavity outward. The endometrium has a stratum functionale (the surface layer that is shed) and a deeper stratum basale that regenerates it; tubular uterine glands open onto the surface and extend down through both. The thick myometrium is smooth muscle in interlacing bundles, and the perimetrium is the outer peritoneal covering. Right: two endometrial states shown simply, with the glands as the clue: proliferative endometrium (upper) has narrow, straight glands; secretory endometrium (lower) has wider, coiled glands. This is a basic comparison, not a cycle chart. Schematic, not a photomicrograph.',
    'Izquierda: corte esquemático de la pared uterina desde la cavidad hacia fuera. El endometrio tiene un estrato funcional (la capa superficial que se desprende) y un estrato basal más profundo que lo regenera; las glándulas uterinas tubulares se abren en la superficie y descienden por ambos. El grueso miometrio es músculo liso en haces entrecruzados y el perimetrio es la cubierta peritoneal externa. Derecha: dos estados del endometrio mostrados de forma sencilla, con las glándulas como pista: el endometrio proliferativo (arriba) tiene glándulas estrechas y rectas; el secretor (abajo) tiene glándulas más anchas y enrolladas. Es una comparación básica, no un gráfico del ciclo. Esquema, no fotomicrografía.'],
  orientation: ['left: wall section, cavity at top; right: two endometrial states, cavity at top', 'izquierda: corte de la pared, cavidad arriba; derecha: dos estados del endometrio, cavidad arriba'], draw: wall,
});
