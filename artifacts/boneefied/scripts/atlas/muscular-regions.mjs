// BVIS03: shared body-model regions. Coordinates: x = lateral distance from the midline (right limb), y = master figure height.
// Anterior views call S.view(..., sg=-1) (patient right = viewer left); posterior views use sg=+1 (patient right = viewer right).
import { bel, tn, pol, ell } from './muscular-lib.mjs';

const ok = (S, k) => !S.hide.has(k);

export function antBones(S) {
  if (S.armOnly) {
    S.b(bel([8, 208], [124, 214], 9, { fibers: 0, e: 0.3, min: 0.8 }));
    S.b(bel([128, 228], [147, 402], 17, { fibers: 0, e: 0.3, min: 0.8 }));
    S.b(bel([152, 408], [180, 560], 10, { fibers: 0, e: 0.3, min: 0.6 }));
    S.b(bel([148, 408], [166, 560], 10, { fibers: 0, e: 0.3, min: 0.6 }));
    return;
  }
  S.b(ell(0, 105, 36, 46));
  S.b(bel([4, 150], [8, 200], 22, { fibers: 0, e: 0.3, min: 0.9 }));
  S.b(bel([8, 208], [124, 214], 9, { fibers: 0, e: 0.3, min: 0.8 }));
  S.b(bel([0, 206], [0, 328], 22, { fibers: 0, e: 0.2, min: 0.8 }));
  for (let k = 0; k < 7; k++) S.b(bel([6, 232 + k * 30], [98, 282 + k * 30], 10, { fibers: 0, e: 0.3, min: 0.8, bend: 0.1 }));
  S.b(bel([128, 228], [147, 402], 17, { fibers: 0, e: 0.3, min: 0.8 }));
  S.b(bel([152, 408], [180, 560], 10, { fibers: 0, e: 0.3, min: 0.6 }));
  S.b(bel([148, 408], [166, 560], 10, { fibers: 0, e: 0.3, min: 0.6 }));
  S.b(pol([[16, 482], [92, 476], [110, 506], [96, 556], [66, 588], [40, 580], [14, 560], [10, 520]]));
  S.b(bel([76, 548], [56, 735], 22, { fibers: 0, e: 0.25, min: 0.8 }));
  S.b(ell(56, 742, 13, 11));
  S.b(bel([48, 752], [40, 900], 17, { fibers: 0, e: 0.25, min: 0.75 }));
  S.b(bel([86, 756], [76, 898], 9, { fibers: 0, e: 0.25, min: 0.6 }));
  S.b(pol([[24, 905], [82, 902], [92, 945], [20, 950]]));
}

export function antTrunk(S) {
  if (ok(S, 'ta')) S.m('transversus-abdominis', pol([[38, 350], [92, 372], [96, 494], [40, 492]], { fib: [[44, 410], [90, 420], [44, 450], [92, 460]], anchor: [66, 450] }), 'mdd');
  if (ok(S, 'io')) S.m('internal-oblique', pol([[40, 380], [92, 400], [102, 470], [66, 500], [40, 468]], { fib: [[48, 460], [80, 420], [96, 400]], anchor: [74, 440] }), 'md');
  if (ok(S, 'ic')) for (let k = 0; k < 6; k++) S.m('intercostals', bel([10, 246 + k * 30], [98, 296 + k * 30], 12, { fibers: 1, e: 0.3, min: 0.8, bend: 0.1 }), 'md', { anchor: undefined });
  if (ok(S, 'pmin')) S.m('pectoralis-minor', bel([54, 300], [104, 236], 26, { bu: 0.5, e: 0.6, fibers: 2 }), 'md');
  if (ok(S, 'ser')) S.m('serratus-anterior', pol([[78, 284], [100, 300], [104, 330], [98, 366], [92, 396], [84, 388], [80, 372], [72, 372], [68, 352], [62, 344], [64, 318], [64, 298]], { sm: false, fib: [[96, 308], [76, 318]], anchor: [88, 340] }), 'm2');
  if (ok(S, 'rect')) {
    S.m('rectus-abdominis', bel([20, 308], [20, 504], 34, { bu: 0.5, e: 0.2, min: 0.6, fibers: 0 }), 'm1');
    for (const y of [352, 396, 440]) S.line([[4, y], [20, y + 2], [37, y]], '#8F6860', 1);
  }
  if (ok(S, 'eo')) S.m('external-oblique', pol([[44, 352], [70, 330], [100, 372], [104, 440], [92, 494], [68, 500], [52, 470], [44, 420]], { fib: [[96, 362], [70, 400], [52, 432]], anchor: [88, 420] }), 'm3');
  if (ok(S, 'neck')) S.m('sternocleidomastoid', bel([40, 138], [10, 205], 18, { bu: 0.4, bend: 0.06 }), 'm1');
  if (ok(S, 'pmaj')) S.m('pectoralis-major', pol([[6, 212], [60, 212], [100, 222], [124, 262], [102, 268], [72, 288], [42, 312], [8, 300]], { fib: [[8, 228], [60, 240], [118, 258]], anchor: [48, 255] }), 'm3');
}

export function antArm(S) {
  if (ok(S, 'cb')) S.m('coracobrachialis', bel([108, 252], [136, 330], 15, { bu: 0.4 }), 'md');
  if (ok(S, 'br')) S.m('brachialis', bel([126, 316], [150, 402], 34, { bu: 0.45, e: 0.6 }), 'm2', { anchor: [141, 355] });
  if (ok(S, 'bi')) { S.m('biceps-brachii', bel([122, 284], [140, 388], 28, { bu: 0.45 }), 'm1'); S.t(tn([140, 384], [154, 416], 7)); }
  if (ok(S, 'del')) S.m('deltoid', bel([108, 208], [146, 298], 54, { bu: 0.35, e: 0.55, bend: -0.04 }), 'm3');
  if (ok(S, 'fx')) {
    S.m(null, bel([160, 406], [186, 520], 18, { bu: 0.35 }), 'm3');
    S.m('pronator-teres', bel([142, 410], [170, 468], 20, { bu: 0.4, e: 0.6 }), 'm1');
    S.m('flexor-carpi-radialis', bel([148, 412], [172, 520], 17, { bu: 0.3 }), 'm2'); S.t(tn([172, 516], [178, 568], 7));
    S.m(null, bel([144, 416], [168, 535], 15, { bu: 0.3 }), 'm3');
  }
}

export function antThigh(S) {
  if (ok(S, 'vi')) S.m('vastus-intermedius', bel([74, 585], [58, 728], 32, { bu: 0.45 }), 'mdd');
  if (ok(S, 'ag')) S.m('articularis-genus', bel([52, 696], [54, 733], 20, { fibers: 1 }), 'mdd');
  if (ok(S, 'ip')) S.m('iliopsoas', bel([52, 488], [68, 604], 32, { bu: 0.35 }), 'md', { anchor: [50, 540] });
  if (ok(S, 'al')) S.m('adductor-longus', bel([14, 564], [52, 664], 28, { bu: 0.4 }), 'md');
  if (ok(S, 'gr')) S.m('gracilis', bel([10, 568], [38, 744], 14, { bu: 0.4, e: 0.4, min: 0.55 }), 'm2');
  if (ok(S, 'vl')) S.m('vastus-lateralis', bel([92, 572], [72, 728], 36, { bu: 0.45, e: 0.55 }), 'm1');
  if (ok(S, 'vm')) S.m('vastus-medialis', bel([52, 612], [46, 734], 32, { bu: 0.7, e: 0.5 }), 'm1');
  if (ok(S, 'tfl')) { S.m('tensor-fasciae-latae', bel([96, 504], [100, 596], 26, { bu: 0.35 }), 'm3'); S.t(tn([100, 592], [84, 738], 9)); }
  if (ok(S, 'rf')) { S.m('rectus-femoris', bel([76, 516], [62, 724], 30, { bu: 0.45, e: 0.6 }), 'm3'); S.t(tn([62, 720], [57, 738], 12)); }
  if (ok(S, 'sar')) S.m('sartorius', bel([90, 510], [43, 756], 17, { bu: 0.5, e: 0.45, min: 0.55, bend: 0.07, fibers: 2 }), 'm2');
}

export function antLeg(S) {
  if (ok(S, 'fl')) { S.m('fibularis-longus', bel([86, 760], [80, 872], 19, { bu: 0.35 }), 'm2'); S.t(tn([80, 868], [88, 906], 6)); }
  if (ok(S, 'edl')) { S.m(null, bel([70, 766], [64, 890], 20, { bu: 0.4 }), 'm3'); for (const x of [58, 64, 70]) S.t(tn([64, 888], [x, 940], 4)); }
  if (ok(S, 'tib')) { S.m('tibialis-anterior', bel([57, 764], [45, 884], 26, { bu: 0.35, e: 0.6 }), 'm1'); S.t(tn([45, 880], [26, 934], 9)); }
}

export function postBones(S) {
  if (S.armOnly) {
    S.b(pol([[16, 232], [112, 224], [120, 262], [104, 292], [62, 322], [28, 340], [18, 300]]));
    S.b(bel([20, 250], [116, 230], 9, { fibers: 0, e: 0.3, min: 0.85 }));
    S.b(bel([130, 238], [148, 404], 17, { fibers: 0, e: 0.3, min: 0.8 }));
    S.b(bel([152, 408], [182, 560], 10, { fibers: 0, e: 0.3, min: 0.6 }));
    return;
  }
  S.b(ell(0, 100, 36, 46));
  S.b(pol([[16, 232], [112, 224], [120, 262], [104, 292], [62, 322], [28, 340], [18, 300]]));
  S.b(bel([20, 250], [116, 230], 9, { fibers: 0, e: 0.3, min: 0.85 }));
  for (let y = 230; y < 480; y += 20) S.b(bel([0, y], [0, y + 14], 12, { fibers: 0, e: 0.3, min: 0.8 }));
  S.b(bel([130, 238], [148, 404], 17, { fibers: 0, e: 0.3, min: 0.8 }));
  S.b(bel([152, 408], [182, 560], 10, { fibers: 0, e: 0.3, min: 0.6 }));
  S.b(pol([[4, 476], [100, 470], [120, 506], [100, 560], [60, 560], [34, 600], [4, 640]]));
  S.b(bel([78, 566], [56, 735], 22, { fibers: 0, e: 0.25, min: 0.8 }));
  S.b(bel([48, 752], [42, 900], 17, { fibers: 0, e: 0.25, min: 0.75 }));
  S.b(bel([86, 756], [76, 898], 9, { fibers: 0, e: 0.25, min: 0.6 }));
  S.b(pol([[34, 900], [74, 900], [72, 948], [30, 948]]));
}

/** Upper back, scapular region and arm (posterior). */
export function postBack(S) {
  if (ok(S, 'mf')) S.m('multifidus', bel([7, 262], [7, 468], 10, { bu: 0.5, e: 0.3, min: 0.6, fibers: 1 }), 'mdd');
  if (ok(S, 'ql')) { S.b(bel([6, 392], [76, 410], 8, { fibers: 0, e: 0.3, min: 0.8 })); S.m('quadratus-lumborum', pol([[10, 396], [48, 406], [58, 442], [54, 484], [16, 484], [10, 440]], { fib: [[16, 410], [30, 440], [36, 476]], anchor: [32, 446] }), 'mdd'); }
  if (ok(S, 'es')) S.m('erector-spinae', bel([17, 228], [17, 476], 26, { bu: 0.55, e: 0.3, min: 0.55, fibers: 3 }), 'md');
  if (ok(S, 'supra')) S.m('supraspinatus', pol([[24, 238], [70, 228], [112, 224], [112, 234], [70, 244], [24, 250]], { fib: [[28, 244], [70, 236], [108, 230]], anchor: [66, 238] }), 'm2');
  if (ok(S, 'infra')) S.m('infraspinatus', pol([[24, 262], [100, 248], [110, 266], [100, 286], [60, 312], [28, 330]], { fib: [[30, 280], [70, 270], [104, 262]], anchor: [84, 276] }), 'm1');
  if (ok(S, 'rmin')) S.m('rhomboid-minor', pol([[5, 228], [22, 244], [22, 258], [5, 246]], { fib: [[6, 232], [20, 250]], anchor: [14, 246] }), 'md');
  if (ok(S, 'rmaj')) S.m('rhomboid-major', pol([[5, 252], [22, 264], [26, 334], [5, 302]], { fib: [[6, 262], [24, 290], [24, 320]], anchor: [16, 296] }), 'm2');
  if (ok(S, 'ls')) S.m('levator-scapulae', bel([40, 160], [22, 238], 14, { bu: 0.4 }), 'md');
  if (ok(S, 'tmin')) S.m('teres-minor', bel([102, 290], [134, 258], 16, { bu: 0.5 }), 'm3');
  if (ok(S, 'tmaj')) S.m('teres-major', bel([54, 332], [136, 292], 22, { bu: 0.55, e: 0.6 }), 'grey');
  if (ok(S, 'tri')) {
    S.m('triceps-brachii', bel([128, 288], [150, 398], 24, { bu: 0.45 }), 'm2');
    S.t(tn([150, 392], [154, 412], 14));
  }
  if (ok(S, 'lat')) S.m('latissimus-dorsi', pol([[4, 470], [4, 400], [28, 346], [62, 338], [100, 318], [130, 290], [140, 286], [122, 320], [100, 378], [92, 432], [64, 486], [30, 490]], { fib: [[8, 440], [60, 380], [120, 300]], anchor: [60, 400] }), 'm3');
  if (ok(S, 'trap')) S.m('trapezius', pol([[3, 146], [34, 170], [78, 198], [120, 220], [114, 248], [80, 262], [42, 330], [3, 428]], { fib: [[4, 170], [40, 200], [100, 224]], anchor: [30, 250] }), 'm1');
  if (ok(S, 'del')) S.m('deltoid', pol([[88, 228], [122, 218], [148, 240], [154, 282], [148, 320], [136, 314], [130, 272], [106, 250]], { fib: [[100, 238], [136, 270], [144, 310]], anchor: [140, 272] }), 'm3');
}

/** Gluteal region and posterior thigh; midline at x = 0. */
export function postHip(S) {
  if (ok(S, 'sm')) S.m('semimembranosus', bel([40, 614], [50, 752], 30, { bu: 0.4 }), 'mdd', { anchor: undefined });
  if (ok(S, 'st')) { S.m('semitendinosus', bel([42, 614], [52, 756], 22, { bu: 0.4 }), 'm2'); S.t(tn([52, 742], [47, 778], 6)); }
  if (ok(S, 'bf')) S.m('biceps-femoris', bel([52, 612], [86, 752], 30, { bu: 0.4 }), 'm3');
  if (ok(S, 'gr')) S.m(null, bel([22, 600], [38, 756], 12, { bu: 0.4, min: 0.5 }), 'md');
  if (ok(S, 'am')) S.m(null, bel([30, 600], [48, 700], 30, { bu: 0.45 }), 'mdd');
  if (ok(S, 'gmed')) S.m('gluteus-medius', pol([[40, 484], [96, 470], [124, 508], [118, 546], [84, 506], [40, 504]], { fib: [[60, 492], [100, 490], [120, 512]], anchor: [98, 488] }), 'md');
  if (ok(S, 'gmax')) S.m('gluteus-maximus', pol([[4, 512], [34, 490], [84, 500], [116, 548], [114, 600], [98, 640], [58, 614], [26, 592], [4, 564]], { fib: [[8, 520], [60, 540], [108, 590]], anchor: [60, 556] }), 'm1');
  if (ok(S, 'itb')) S.t(tn([118, 540], [92, 748], 8));
}

export function postCalf(S) {
  if (ok(S, 'sol')) S.m('soleus', pol([[46, 768], [64, 760], [96, 768], [106, 802], [100, 838], [80, 872], [60, 888], [50, 872], [44, 834], [42, 800]], { fib: [[52, 780], [60, 820], [62, 870]], anchor: [78, 812] }), 'md');
  if (ok(S, 'pop')) S.m('popliteus', pol([[48, 744], [88, 752], [66, 792], [48, 774]], { fib: [[54, 752], [74, 774]], anchor: [66, 764] }), 'mdd');
  if (ok(S, 'tp')) { S.m('tibialis-posterior', bel([42, 790], [37, 878], 14, { bu: 0.4 }), 'mdd', { anchor: [39, 822] }); S.t(tn([37, 874], [34, 914], 6)); }
  if (ok(S, 'gast')) {
    S.m(null, bel([84, 744], [66, 836], 32, { bu: 0.35, e: 0.6 }), 'm2');
    S.m('gastrocnemius', bel([46, 742], [54, 836], 38, { bu: 0.35, e: 0.6 }), 'm1');
  }
  if (ok(S, 'ct')) S.t(tn([58, 828], [57, 908], 14));
}

/** Posterior elbow and forearm (extensor compartment; supinator deep). */
export function postFore(S) {
  const cut = S.hide.has('cut');
  if (ok(S, 'sup') && !cut) S.m('supinator', bel([156, 414], [178, 456], 26, { bu: 0.5, e: 0.5, bend: 0.06 }), 'mdd', { anchor: [166, 434] });
  if (ok(S, 'ext')) {
    const o = cut ? { t0: 0.45, bu: 0.6 } : { bu: 0.35 };
    S.m(null, bel([146, 416], [163, 536], 16, o), 'm3');
    S.m(null, bel([150, 412], [172, 530], 24, o), 'm2');
    S.m('extensor-carpi-radialis', bel([158, 402], [183, 522], 17, o), 'm1'); S.t(tn([183, 518], [190, 568], 6));
  }
  if (ok(S, 'anc')) S.m('anconeus', pol([[150, 402], [170, 410], [160, 454], [148, 446]], { fib: [[152, 410], [160, 440]], anchor: [155, 424] }), 'm2');
  if (ok(S, 'sup') && cut) S.m('supinator', bel([166, 420], [186, 476], 24, { bu: 0.5, e: 0.5, bend: 0.06 }), 'mdd', { anchor: [176, 448] });
}
