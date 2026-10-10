// BVIS02 anatomical-identity corrections: each bone is ONE continuous silhouette; landmarks are surface zones inside/on it.
import { ell, pg, lm, mx, mp } from './skeletal-lib.mjs';

const arch = (P, pts, extra) => { P.u(pg(pts), 'ap'); if (extra) extra(); };

export function drawVertebraTypical(P) {
  P.panel(880, 110, 480, 780);
  const cx = 450;
  // neural arch: pedicles leave the body's posterolateral corners, laminae meet at the spinous root
  arch(P, [[cx - 100, 330], [cx + 100, 330], [cx + 118, 440], [cx + 112, 540], [cx + 64, 610], [cx, 632], [cx - 64, 610], [cx - 112, 540], [cx - 118, 440]]);
  P.s('spinous-process', lm([[cx, 590, 22], [cx, 760, 14], [cx, 870, 10]]), 'ap', { at: [0.5, 0.65] });
  [-1, 1].forEach((s, i) => P.s('transverse-process', lm([[cx + s * 90, 475, 28], [cx + s * 190, 470, 20], [cx + s * 270, 480, 14]]), 'ap', i ? { pin: false } : { at: [0.6, 0.5] }));
  P.s('vertebral-body', ell(cx, 280, 150, 110), 'ax', { at: [0.5, 0.35] });
  P.s('vertebral-foramen', pg([[cx - 62, 400], [cx, 385], [cx + 62, 400], [cx + 70, 480], [cx + 30, 540], [cx - 30, 540], [cx - 70, 480]]), 'hole', { r: 0.02 });
  [-1, 1].forEach((s, i) => P.s('superior-articular-facet', ell(cx + s * 95, 560, 22, 34, s * 12), 'art', i ? { pin: false } : {}));
  [-1, 1].forEach((s) => P.ln([[cx + s * 100, 345], [cx + s * 108, 400], [cx + s * 104, 450]], undefined, 1.2));
  // Thoracic lateral detail: posterior arch and facets remain on continuous bone.
  // The inferior costal demifacet is visible here, not on the superior-view panel.
  P.u(pg([[920, 440], [1090, 440], [1090, 620], [920, 620]], false), 'ax');
  P.u(pg([[1090, 460], [1160, 470], [1210, 500], [1270, 570], [1300, 610], [1260, 590], [1200, 550], [1180, 550], [1150, 600], [1140, 675], [1110, 665], [1120, 610], [1130, 555], [1110, 540], [1090, 535]]), 'ap');
  P.u(lm([[1150, 500, 18], [1155, 400, 16], [1125, 370, 18]]), 'ap');
  P.s('inferior-articular-facet', ell(1126, 648, 14, 21, -15), 'art', { r: 0.014 });
  P.s('superior-costal-facet', ell(1084, 452, 12, 14), 'art', { r: 0.012 });
  P.s('inferior-costal-facet', ell(1084, 605, 12, 14), 'art', { r: 0.012 });
  P.s('intervertebral-disc', pg([[920, 624], [1090, 624], [1090, 654], [920, 654]], false), 'cap', { r: 0.014 });
  P.u(pg([[920, 660], [1090, 660], [1090, 800], [920, 800]], false), 'ax');
}

export function drawVertebraeRegional(P) {
  P.panel(40, 90, 440, 820); P.panel(505, 90, 440, 820); P.panel(970, 90, 440, 820);
  let c = 260; // cervical
  P.u(pg([[c - 80, 330], [c + 80, 330], [c + 98, 440], [c + 64, 530], [c + 22, 592], [c - 22, 592], [c - 64, 530], [c - 98, 440]]), 'ap');
  P.u(lm([[c, 580, 18], [c - 30, 700, 12], [c - 40, 790, 6]]), 'ap'); P.u(lm([[c, 580, 18], [c + 30, 700, 12], [c + 40, 790, 6]]), 'ap');
  P.u(lm([[c - 60, 460, 24], [c - 150, 440, 20], [c - 190, 450, 14]]), 'ap'); P.u(lm([[c + 60, 460, 24], [c + 150, 440, 20], [c + 190, 450, 14]]), 'ap');
  P.s('cervical-vertebrae', ell(c, 290, 90, 62), 'ax', { at: [0.5, 0.4] });
  P.s('uncinate-process-vertebra', lm([[c - 78, 330, 10], [c - 80, 300, 6]]), 'axs');
  P.u(lm([[c + 78, 330, 10], [c + 80, 300, 6]]), 'axs');
  P.s('vertebral-foramen', pg([[c - 50, 380], [c + 50, 380], [c, 520]]), 'hole', { r: 0.02 });
  P.s('transverse-foramen', ell(c - 138, 445, 16, 16), 'hole', { r: 0.014 }); P.u(ell(c + 138, 445, 16, 16), 'hole');
  c = 725; // thoracic
  P.u(pg([[c - 76, 350], [c + 76, 350], [c + 96, 450], [c + 66, 545], [c + 18, 600], [c - 18, 600], [c - 66, 545], [c - 96, 450]]), 'ap');
  P.s('spinous-process', lm([[c, 580, 16], [c, 720, 10], [c, 870, 7]]), 'ap', { at: [0.5, 0.8] });
  [-1, 1].forEach((s) => P.u(lm([[c + s * 50, 470, 22], [c + s * 140, 460, 18], [c + s * 200, 470, 14]]), 'ap'));
  P.s('thoracic-vertebrae', pg([[c - 100, 240], [c, 205], [c + 100, 240], [c + 80, 340], [c, 385], [c - 80, 340]]), 'ax', { at: [0.5, 0.3] });
  P.s('superior-costal-facet', ell(c - 82, 340, 11, 17, 20), 'art', { r: 0.012 }); P.u(ell(c + 82, 340, 11, 17, -20), 'art');
  P.u(ell(c, 450, 46, 46), 'hole');
  c = 1190; // lumbar
  P.u(pg([[c - 92, 380], [c + 92, 380], [c + 112, 470], [c + 76, 565], [c + 20, 600], [c - 20, 600], [c - 76, 565], [c - 112, 470]]), 'ap');
  P.u(lm([[c, 590, 20], [c, 700, 14], [c, 760, 9]]), 'ap');
  P.s('accessory-process', lm([[c - 100, 460, 8], [c - 118, 500, 5]]), 'axs');
  P.u(lm([[c + 100, 460, 8], [c + 118, 500, 5]]), 'axs');
  [-1, 1].forEach((s) => P.u(lm([[c + s * 70, 440, 24], [c + s * 150, 430, 18], [c + s * 210, 440, 12]]), 'ap'));
  P.s('lumbar-vertebrae', pg([[c - 140, 270], [c - 60, 210], [c, 225], [c + 60, 210], [c + 140, 270], [c + 120, 380], [c, 400], [c - 120, 380]]), 'ax', { at: [0.5, 0.45] });
  P.s('mammillary-process', ell(c - 100, 495, 12, 12), 'axs', { r: 0.012 }); P.u(ell(c + 100, 495, 12, 12), 'axs');
  P.u(pg([[c - 50, 450], [c + 50, 450], [c + 56, 520], [c, 560], [c - 56, 520]]), 'hole');
}

const humOutline = [[400, 118], [450, 108], [505, 138], [512, 190], [472, 236], [440, 262], [432, 400], [434, 600], [442, 700], [476, 760], [496, 802], [472, 826], [458, 872], [400, 888], [342, 872], [328, 832], [318, 790], [350, 732], [368, 600], [368, 400], [362, 262], [335, 218], [312, 170], [334, 124], [368, 114]];
export function drawHumerus(P) {
  P.panel(60, 70, 640, 860); P.panel(740, 70, 650, 860);
  P.s('humerus', pg(humOutline), 'ap', { at: [0.5, 0.55] });
  P.ln([[388, 200], [392, 300], [398, 360]], undefined, 1.3); // intertubercular groove
  P.s('humeral-head', ell(452, 166, 56, 50, -20), 'aps');
  P.s('greater-tubercle', ell(343, 166, 30, 42), 'aps');
  P.s('deltoid-tuberosity', ell(372, 470, 14, 30), 'aps', { r: 0.014 });
  P.s('lateral-epicondyle', ell(334, 788, 22, 20), 'aps', { r: 0.014 });
  P.s('medial-epicondyle', ell(470, 788, 26, 22), 'aps', { r: 0.014 });
  P.s('capitulum', ell(366, 848, 30, 28), 'art');
  P.s('trochlea', ell(432, 852, 32, 28), 'art');
  P.u(pg(mp(humOutline)), 'ap');
  P.u(ell(mx(452), 166, 56, 50, 20), 'aps'); P.u(ell(mx(343), 166, 30, 42), 'aps');
  P.u(ell(mx(334), 788, 22, 20), 'aps'); P.u(ell(mx(470), 788, 26, 22), 'aps');
  P.u(ell(mx(400), 850, 62, 28), 'art'); P.u(ell(mx(400), 800, 22, 30), 'art'); // olecranon fossa zone
}

const femOutline = [[385, 124], [450, 104], [500, 110], [538, 150], [536, 205], [496, 240], [440, 266], [428, 330], [425, 520], [430, 700], [470, 760], [494, 830], [482, 890], [440, 908], [395, 908], [350, 908], [310, 890], [300, 830], [322, 760], [360, 700], [365, 520], [360, 330], [345, 292], [300, 266], [292, 214], [310, 160], [345, 148]];
export function drawFemur(P) {
  P.panel(60, 70, 640, 860); P.panel(740, 70, 650, 860);
  P.s('femur', pg(femOutline), 'ap', { at: [0.5, 0.25] });
  P.s('femoral-neck', lm([[470, 200, 26], [420, 258, 24]]), 'aps');
  P.s('femoral-head', ell(487, 165, 52, 52), 'art');
  P.s('greater-trochanter', ell(338, 212, 38, 54), 'aps');
  P.s('femoral-condyles', ell(352, 842, 44, 48), 'art', { r: 0.02 });
  P.u(ell(448, 842, 44, 48), 'art');
  P.ln([[400, 880], [400, 790]], undefined, 1.3);
  P.u(pg(mp(femOutline)), 'ap');
  P.u(lm([[mx(470), 200, 26], [mx(420), 258, 24]]), 'aps'); P.u(ell(mx(487), 165, 52, 52), 'art'); P.u(ell(mx(338), 212, 38, 54), 'aps');
  P.u(ell(mx(352), 842, 44, 48), 'art'); P.u(ell(mx(448), 842, 44, 48), 'art');
  P.u(lm([[mx(400), 790, 6], [mx(400), 880, 6]]), 'hole');
  P.s('femoral-linea-aspera', lm([[mx(397), 300, 7], [mx(388), 520, 8], [mx(386), 700, 7]]), 'aps', { at: [0.5, 0.65], r: 0.014 });
}

const hipOut = [[300, 320], [270, 240], [310, 170], [400, 140], [500, 150], [552, 205], [530, 300], [500, 400], [510, 470], [540, 540], [560, 600], [575, 660], [570, 730], [520, 790], [430, 802], [360, 792], [300, 778], [240, 745], [255, 680], [300, 620], [330, 560], [320, 470], [300, 400]];
const hipIlium = [[300, 320], [270, 240], [310, 170], [400, 140], [500, 150], [550, 205], [530, 300], [490, 430], [380, 460]];
const hipIsch = [[350, 590], [375, 660], [345, 745], [290, 775], [240, 745], [280, 640], [320, 540]];
export function drawHip(P) {
  P.panel(60, 70, 640, 860); P.panel(740, 70, 650, 860);
  P.u(pg(hipOut), 'ap');
  P.s('ilium', pg(hipIlium), 'ap', { at: [0.5, 0.3] });
  P.s('iliac-crest', lm([[285, 235, 8], [320, 170, 8], [400, 142, 8], [500, 150, 8], [548, 203, 8]]), 'aps', { at: [0.35, 0.3] });
  P.s('asis', ell(548, 210, 16, 16), 'aps', { r: 0.014 });
  P.s('ischium', pg(hipIsch), 'ap', { at: [0.6, 0.35] });
  P.s('pubis', lm([[485, 600, 22], [555, 650, 20], [566, 730, 18], [510, 772, 18]]), 'ap', { at: [0.6, 0.5] });
  P.s('ischial-tuberosity', ell(285, 752, 34, 28), 'aps', { r: 0.014 });
  P.s('acetabulum', ell(430, 540, 70, 75), 'art', { r: 0.02 });
  P.s('obturator-foramen', pg([[395, 640], [430, 622], [468, 640], [470, 700], [440, 726], [398, 712]]), 'hole', { r: 0.014 });
  P.u(pg(mp(hipOut)), 'ap');
  P.u(pg(mp(hipIlium)), 'ap'); P.u(pg(mp(hipIsch)), 'ap');
  P.u(pg(mp([[395, 640], [430, 622], [468, 640], [470, 700], [440, 726], [398, 712]])), 'hole');
  P.s('sacroiliac-joint', ell(mx(330), 330, 38, 72, 10), 'art', { r: 0.02 });
}

export function drawHand(P) {
  P.u(lm([[640, 960, 34], [652, 765, 38]]), 'ap'); P.u(lm([[800, 960, 24], [796, 775, 22]]), 'ap');
  P.s('radial-styloid', lm([[625, 800, 12], [610, 770, 8]]), 'aps', { r: 0.012 });
  P.s('ulnar-styloid', lm([[815, 805, 9], [820, 775, 6]]), 'aps', { r: 0.012 });
  const mcs = [[[612, 630, 14], [585, 560, 14], [545, 500, 13], [525, 460, 11]], [[658, 610, 12], [655, 575, 12], [645, 480, 11], [640, 385, 10]], [[722, 595, 12], [722, 575, 12], [722, 470, 11], [722, 362, 10]], [[790, 610, 11], [788, 575, 11], [795, 470, 10], [802, 375, 9]], [[840, 630, 10], [848, 585, 10], [865, 500, 9], [878, 425, 8]]];
  mcs.forEach((a, i) => P.s('metacarpals', lm(a), 'ap', i === 2 ? {} : { pin: false }));
  const ph = (x0, y0, dx, lens, w, mid) => { let y = y0; lens.forEach((l, k) => { P.s('phalanges-hand', lm([[x0 + dx * (y0 - y), y - 4, w - k * 0.5], [x0 + dx * (y0 - y + l), y - l + 4, w - k * 0.5 - 0.5]]), 'aps', mid && k === 0 ? {} : { pin: false }); y -= l + 6; }); };
  ph(640, 372, 0.04, [72, 52, 42], 9); ph(722, 350, 0, [82, 58, 44], 9.5, true); ph(803, 362, -0.05, [76, 54, 42], 9); ph(880, 410, -0.1, [58, 40, 36], 8);
  ph(520, 452, 0.6, [60, 52], 11);
  // distal row
  P.s('trapezium', pg([[598, 645], [636, 606], [668, 626], [662, 664], [622, 676]], false), 'bones');
  P.s('trapezoid', pg([[676, 592], [714, 590], [718, 632], [684, 642]], false), 'bones');
  P.s('capitate', pg([[722, 580], [772, 580], [778, 615], [768, 640], [776, 664], [752, 678], [730, 666], [736, 640], [722, 618]]), 'bones');
  P.s('hamate', pg([[790, 585], [840, 592], [846, 642], [818, 668], [786, 642]], false), 'bones');
  P.s('hook-of-hamate', lm([[816, 650, 11], [832, 674, 8], [848, 684, 5]]), 'bone', { r: 0.012 });
  // proximal row
  P.s('scaphoid', pg([[625, 732], [618, 702], [650, 676], [690, 670], [700, 692], [674, 724], [645, 744]]), 'bones');
  P.s('lunate', pg([[698, 702], [708, 674], [745, 666], [768, 690], [760, 730], [738, 726], [742, 702], [722, 694], [712, 714]]), 'bones');
  P.s('triquetrum', pg([[775, 680], [816, 702], [822, 742], [782, 748], [768, 714]], false), 'bones', { at: [0.3, 0.25] });
  P.s('pisiform', ell(804, 730, 15, 15), 'bone', { r: 0.012 }); // palmar, superimposed on the triquetrum
}

export function drawFoot(P) {
  P.s('calcaneus', ell(775, 820, 62, 120, -8), 'aps', { at: [0.5, 0.8] });
  P.s('talus', pg([[610, 700], [655, 660], [705, 685], [730, 735], [700, 800], [640, 810], [600, 760]]), 'bones');
  P.s('navicular', pg([[590, 600], [625, 584], [672, 590], [694, 612], [684, 640], [632, 644], [598, 632]]), 'bone');
  P.s('cuboid', pg([[755, 560], [838, 556], [850, 626], [832, 648], [765, 642]], false), 'bone');
  P.s('medial-cuneiform', pg([[550, 505], [602, 498], [614, 560], [606, 574], [568, 580], [546, 546]], false), 'bones');
  P.s('intermediate-cuneiform', pg([[620, 500], [664, 500], [670, 552], [622, 562]], false), 'bones');
  P.s('lateral-cuneiform', pg([[678, 502], [728, 504], [734, 556], [686, 562]], false), 'bones');
  const mts = [[[562, 490, 17], [556, 380, 15], [550, 270, 14]], [[626, 490, 12], [622, 380, 11], [620, 270, 10]], [[690, 490, 12], [690, 380, 11], [692, 280, 10]], [[755, 495, 12], [762, 385, 11], [766, 290, 10]], [[830, 520, 12], [850, 400, 11], [862, 310, 10]]];
  mts.forEach((a, i) => P.s('metatarsals', lm(a), 'ap', i === 2 ? {} : { pin: false }));
  const ph = (x, y, lens, w, dx, mid) => { let yy = y; lens.forEach((l, k) => { P.s('phalanges-foot', lm([[x + dx * (y - yy), yy, w - k], [x + dx * (y - yy + l), yy - l, w - k - 0.5]]), 'aps', mid && k === 0 ? {} : { pin: false }); yy -= l + 6; }); };
  ph(548, 258, [64, 48], 15, 0.02, false); ph(619, 258, [34, 26, 20], 9, 0, false); ph(693, 268, [36, 28, 20], 9, 0, true); ph(768, 278, [34, 26, 18], 8, 0.05, false); ph(866, 298, [30, 22, 16], 7, 0.1, false);
}
