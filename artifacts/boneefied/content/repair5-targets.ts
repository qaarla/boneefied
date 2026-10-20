import type { Asset } from './model';
import { repairFoundationsTargets } from './foundations-atlas-corrections.ts';
import { repairJointsAtlasTargets } from './joints-atlas-corrections.ts';
import { repairMuscularAtlasTargets } from './muscular-atlas-corrections.ts';
import { repairSensesAtlasTargets } from './senses-atlas-corrections.ts';

type Point = { structureId: string; x: number; y: number };
export type TargetRepair = { structureId: string; from: [number, number]; to: [number, number]; reason: string };
const repair = (structureId: string, from: [number, number], to: [number, number], reason: string): TargetRepair => ({ structureId, from, to, reason });
const fitUpperRoute = (cx: number, points: [string, number, number][]): TargetRepair[] =>
  points.map(([id, x, y]) => repair(id, [x, y],
    [(cx + (x * 1450 - cx) * 17 / 19) / 1450, (50 + (y * 1000 - 40) * 17 / 19) / 1000],
    'Follow the uniformly refitted upper-body source (1.9 to 1.7 scale) so complete hands fit; preserve the same actual vessel point.'));

/** Individually inspected source-normalized targets. Never reorder labels or change IDs/radii. */
export const repair5Targets: Record<string, TargetRepair[]> = {
  'asset-bvis05-respiratory-membrane-histology': [
    repair('respiratory-system-surfactant', [.1241, .362], [.1241, .384], 'Film follows the actual apical epithelial surface, not a detached stripe in alveolar air.'),
    repair('respiratory-system-respiratory-membrane', [.4414, .416], [.4414, .409], 'Fused basal layer now directly joins the type I epithelial cell to capillary endothelium.'),
  ],
  'asset-bvis05-lymph-overview': [
    repair('lymph-fluid', [.6069, .48], [880 / 1450, .45], 'Unambiguous interstitial lymph/tissue fluid, away from the green capillary wall and flow arrow.'),
  ],
  'asset-bvis05-lymph-node-structure': [
    repair('lymph-hilum', [.5117, .704], [790 / 1450, .714], 'Visible hilar region beside the now-continuous sinus/efferent route, not its green lumen.'),
  ],
  'asset-bvis05-spleen-pulp': [
    repair('lymph-splenic-cords', [.4938, .38], [680 / 1450, .37], 'Clear red-pulp cord tissue between sinusoids, away from white pulp and marginal-zone border.'),
  ],
  'asset-bvis05-upper-limb-arteries': fitUpperRoute(725, [
    ['ves-aorta', .5338, .61], ['ves-common-carotid', .4772, .252], ['ves-subclavian', .4276, .294],
    ['ves-axillary', .3531, .36], ['ves-brachial', .3145, .534], ['ves-radial', .269, .816],
    ['ves-ulnar', .2993, .818], ['ves-internal-carotid', .4745, .176], ['ves-external-carotid', .4897, .172],
  ]),
  'asset-bvis05-upper-limb-veins': fitUpperRoute(480, [
    ['ves-brachiocephalic-vein', .3076, .294], ['ves-subclavian-vein', .2524, .29],
    ['ves-axillary-vein', .1862, .354], ['ves-internal-jugular', .2993, .21], ['ves-jugular', .2841, .23],
    ['ves-cephalic', .1214, .55], ['ves-median-cubital', .1241, .632],
  ]),
  'asset-bvis05-celiac-renal-context': [
    repair('ves-celiac-trunk', [.5117, .326], [785 / 1450, .335], 'Distinct projecting celiac trunk between aortic origin and three-way branch point, not overprinted abdominal aorta.'),
  ],
  'asset-bvis05-hepatic-portal-system': [
    repair('ves-hepatic-vein', [.3586, .356], [492 / 1450, .302], 'Follow corrected hepatic drainage separated from portal inflow; no false portal-caval junction.'),
    repair('ves-hepatic-vein', [.8166, .5], [1060 / 1450, .24], 'Actual projected hepatic venous outlet beyond the lobule, not its central vein.'),
    repair('ves-sinusoids', [.8276, .634], [(1185 + (.8276 * 1450 - 1185) * 25 / 27) / 1450, .5 + (.634 - .5) * 25 / 27], 'Follow the same sinusoidal point when the lobule is uniformly inset to keep peripheral triads clear of the raster edge.'),
    repair('ves-hepatic-portal', [.8124, .234], [1179 / 1450, .254], 'Portal venule in the superior triad of the refitted lobule.'),
  ],
  'asset-bvis05-blood-composition': [
    repair('cv-blood-erythrocyte', [.6207, .33], [920 / 1450, .315], 'Cytoplasmic rim of the corrected 70px-radius erythrocyte, smaller than the neutrophil; not the old enlarged cell extent.'),
  ],
  'asset-bvis05-coronary-posterior': [
    repair('cv-right-coronary', [.5407, .646], [.5407, .616], 'Follow the corrected posterior AV-groove course on the heart toward the posterior interventricular artery, not the old inferior off-margin course.'),
  ],
  'asset-bvis05-endocrine-body-map': [
    repair('endo-pancreas', [.2524, .358], [.2524, .414], 'Pancreas crosses the upper kidneys anteriorly and below the suprarenal glands, not above the adrenals.'),
  ],
  'asset-bvis05-thyroid-parathyroid': [
    repair('endo-thyroid-follicle', [.8166, .168], [1125 / 1450, .215], 'Actual follicular epithelial ring, not the surrounding stromal halo.'),
  ],
  'asset-bvis04-lower-limb-nerves': [
    repair('sacral-plexus', [.7931, .092], [.6966, .092], 'Posterior right limb now has lateral at viewer right; mirror the plexus endpoint with its own panel.'),
    repair('sciatic-nerve', [.7917, .32], [.698, .32], 'Mirror the endpoint with the posterior right-limb sciatic course, not the anterior femoral nerve.'),
  ],
  'asset-commons-axial-skeleton-blank': [
    repair('thoracic-vertebrae', [.5, .43], [450 / 960, 590 / 1377], 'Thoracic vertebral body, not the transparent gap at its lateral edge.'),
    repair('sacrum', [.5, .7], [450 / 960, 900 / 1377], 'Midline sacral bone above the coccyx, not the adjacent transparent pelvic space.'),
    repair('coccyx', [.5, .75], [450 / 960, 966 / 1377], 'Small highlighted caudal tip, not the inferior pubic ramus.'),
  ],
  'asset-skeletal-atlas-leg-tibia-fibula': [
    repair('ankle-mortise', [.3478, .8913], [504 / 1450, .855], 'Socket space just under the continuous distal tibial plafond, not the center of the talar surface below.'),
  ],
  'asset-skeletal-atlas-atlas-axis': [
    repair('spinous-process', [.8873, .64], [1250 / 1450, .66], 'Center of the visible spinous-process shaft, not the background above it.'),
  ],
  'asset-skeletal-atlas-thoracic-cage': [
    repair('false-ribs', [.3557, .6685], [508 / 1450, .628], 'Centerline of rib 9 rather than the gap between ribs.'),
    repair('floating-ribs', [.4348, .8365], [627 / 1450, .796], 'Centerline of rib 12 rather than the gap below it.'),
  ],
  'asset-skeletal-atlas-rib-detail': [
    repair('transverse-process', [.2253, .54], [330 / 1450, .5], 'Continuous transverse-process shaft that now reaches its costotransverse facet against the rib tubercle.'),
    repair('costal-groove', [.7503, .5875], [1170 / 1450, .485], 'Visible darker groove along the inner rib border.'),
  ],
  'asset-skeletal-atlas-synovial-joint': [
    repair('synovial-joint', [.3179, .5], [.5, .49], 'Inside the continuous capsule-enclosed joint space between the cartilage-capped ends.'),
    repair('articular-cartilage', [.5, .39], [.5, .437], 'Center of the attached blue-gray cartilage cap.'),
  ],
  'asset-skeletal-atlas-shoulder-joint': [
    repair('acromion', [.4362, .305], [680 / 1450, .285], 'Visible acromial arch, not the empty space beneath it.'),
  ],
  'asset-skeletal-atlas-knee-joint': [
    repair('intercondylar-eminence', [.7241, .493], [1054 / 1450, .503], 'Exposed beige eminence between the cruciate attachments, away from their edge.'),
  ],
  'asset-atlas-anterior-position': [
    repair('axillary-region', [.4338, .226], [630 / 1450, .30], 'Axillary fold at the inner upper arm, not the superior shoulder.'),
  ],
  'asset-atlas-skeleton-anterior': [
    repair('true-ribs', [.5566, .256], [807 / 1450, .2694], 'Rib 4 bony centerline rather than a gap at the lateral rib edge.'),
    repair('false-ribs', [.5538, .342], [799 / 1450, .342], 'Rib 9 bony centerline, inward from the ambiguous outer edge.'),
    repair('floating-ribs', [.5262, .37], [767 / 1450, .368], 'Rib 12 bony centerline rather than the adjacent background.'),
  ],
  'asset-atlas-skeleton-axial-appendicular': [
    repair('true-ribs', [.5566, .256], [807 / 1450, .2694], 'Same rib 4 centerline as the anterior skeleton; preserve axial/appendicular mapping.'),
  ],
  'asset-gray946-sweat-gland': [
    repair('eccrine-sweat-gland', [.2372, .25], [.25, .71], 'Purple coiled secretory gland rather than its ascending duct.'),
  ],
  'asset-original-cell-overview': [
    repair('nucleolus-cell', [.55, .54], [560 / 1200, 425 / 900], 'Dark purple nucleolus inside the nucleus.'),
    repair('mitochondrion-cell', [.28, .68], [.25, 320 / 900], 'Upper-left salmon oval organelle rather than blank cytoplasm.'),
    repair('smooth-er-cell', [.7, .35], [.65, .38], 'Pink non-ribosome-bearing ribbon rather than the salmon mitochondrion.'),
    repair('golgi-apparatus-cell', [.72, .65], [.4, 240 / 900], 'Yellow stacked cisternae rather than the mitochondrial border.'),
    repair('centrosome-cell', [.82, .5], [710 / 1200, 700 / 900], 'Blue paired-centriole X rather than the turquoise vesicle.'),
  ],
  'asset-original-mitosis-stages': [
    repair('interphase', [.1, .5], [.12, .30], 'Inside the first cell, not below it; artwork limitation is documented separately.'),
    repair('prophase', [.3, .5], [460 / 1500, .30], 'Inside the second cell with its fragmented nuclear envelope.'),
    repair('metaphase', [.5, .5], [.5, .30], 'Aligned chromosomes inside the third cell.'),
    repair('anaphase', [.7, .5], [950 / 1500, .32], 'One of the opposed purple chromatids in the fourth cell.'),
    repair('telophase', [.9, .5], [.5, 680 / 900], 'Lower two-nuclei cell, not the upper single-nucleus drawing.'),
  ],
  'asset-original-anatomical-planes': [
    repair('sagittal-plane', [.2, .5], [.5, .27], 'Red central vertical plane, away from its intersection with the other planes.'),
    repair('coronal-plane', [.5, .5], [.31, .67], 'Unobstructed blue frontal plane, not the red/yellow intersection.'),
    repair('transverse-plane', [.8, .5], [.68, .485], 'Yellow horizontal plane, not the surrounding white background.'),
  ],
  'asset-original-body-cavities': [
    repair('vertebral-cavity', [.5, .3], [.5, .215], 'Purple vertebral region above the thoracic region.'),
    repair('thoracic-cavity', [.5, .52], [.5, .37], 'Blue chest cavity, not the gold abdominal region.'),
    repair('abdominal-cavity', [.5, .72], [.5, .60], 'Gold abdominal cavity, not the pink pelvic region.'),
    repair('pelvic-cavity', [.5, .88], [.5, .75], 'Pink pelvic cavity rather than the white gap between the legs.'),
  ],
  'asset-servier-elbow-joint': [
    repair('articular-cartilage', [.23, .695], [.23, .677], 'Blue cartilage cap bordering the bone, not the burgundy joint space.'),
    repair('joint-cavity', [.55, .58], [.365, .555], 'Question-specific target moved from the ligament to the existing joint-space endpoint.'),
    repair('fibrous-capsule', [.5, .65], [.391, .52], 'Question-specific target moved from bone to the existing purple capsule endpoint.'),
  ],
  'asset-servier-pelvis': [
    repair('pelvis', [.5, .45], [.29, .40], 'Pelvic girdle represented by the hip bone, not a second dot on the sacrum.'),
    repair('ischium', [.3, .69], [.35, .70], 'Solid inferior ischial body rather than the outside edge.'),
    repair('ischium', [.3, .7], [.35, .70], 'Same inferior ischial body for the separate Practice coordinate.'),
    repair('pubis', [.4, .61], [.45, .61], 'Superior pubic ramus rather than its lower outline against the obturator opening.'),
    repair('acetabulum', [.3, .5], [73 / 256, 171 / 294], 'Visible acetabular rim rather than the central femoral-head surface; deeper socket remains occluded.'),
    repair('acetabulum', [.225, .58], [73 / 256, 171 / 294], 'Same visible bony rim for Study and pre-catalog objects; the low-resolution assembled image cannot expose the deeper socket.'),
  ],
  'asset-commons-appendicular-skeleton-blank': [
    repair('clavicle', [.43, .205], [413 / 960, 333 / 1774], 'Teal clavicular shaft above the coracoid/scapular region.'),
    repair('scapula', [.35, .235], [.40, .25], 'Scapular body rather than the adjacent humeral head.'),
    repair('radius', [.245, .465], [253 / 960, 835 / 1774], 'Broader distal radial shaft; this retained figure depicts crossed/pronated forearm bones.'),
    repair('ulna', [.205, .455], [230 / 960, 835 / 1774], 'Narrower distal ulnar shaft rather than the white space lateral to the forearm.'),
    repair('carpals', [.165, .535], [243 / 960, 914 / 1774], 'Carpal cluster in the wrist rather than background beside the hand.'),
    repair('metacarpals', [.145, .57], [249 / 960, 966 / 1774], 'Central metacarpal shaft in the palm rather than background beside the hand.'),
    repair('pelvis', [.5, .48], [.412, .423], 'Teal iliac wing of the pelvic girdle rather than the white sacral/inlet region.'),
    repair('femur', [.42, .63], [421 / 960, 1117 / 1774], 'Femoral shaft rather than the white space alongside it.'),
    repair('patella', [.42, .72], [431 / 960, 1274 / 1774], 'Center of the round patella rather than the adjacent condylar edge.'),
    repair('tibia', [.43, .82], [442 / 960, 1450 / 1774], 'Broad tibial shaft rather than the neighboring narrow fibula.'),
    repair('fibula', [.375, .82], [410 / 960, 1450 / 1774], 'Narrow fibular shaft rather than the white space lateral to the leg.'),
    repair('tarsals', [.42, .925], [445 / 960, 1660 / 1774], 'Proximal foot tarsal cluster rather than the white ankle margin.'),
  ],
  'asset-bvis04-epidermis-strata': [
    repair('dermal-papilla-skin', [.389, .87], [584 / 1450, .865], 'Dermal papilla interior, separate from the adjacent tactile corpuscle and papilla edge.'),
  ],
  'asset-bvis04-dermis-hypodermis': [
    repair('elastic-fibers-skin', [.6897, .592], [1000 / 1450, .594], 'Centerline of the thin dark elastic fiber; the former endpoint landed on the pale collagen bundle immediately above it.'),
  ],
  'asset-bvis04-muscle-tissue': [
    repair('smooth-muscle-tissue', [.8428, .328], [1195 / 1450, .334], 'Cytoplasm of the middle-row spindle cell rather than its ambiguous tapered tip.'),
  ],
};

/** Exact coordinate matching also handles pre-catalog glossary objects without relocating other views of a repeated ID. */
export function repairDiagramTargets<T extends Point>(assetId: string | undefined, points: T[]): T[] {
  const repairs = assetId ? repair5Targets[assetId] : undefined;
  if (!repairs) return repairSensesAtlasTargets(assetId, repairMuscularAtlasTargets(assetId, repairJointsAtlasTargets(assetId, repairFoundationsTargets(assetId, points))));
  let changed = false;
  const result = points.map(point => {
    const fix = repairs.find(r => r.structureId === point.structureId &&
      Math.abs(r.from[0] - point.x) < .00001 && Math.abs(r.from[1] - point.y) < .00001);
    if (!fix) return point;
    changed = true;
    return { ...point, x: fix.to[0], y: fix.to[1] };
  });
  return repairSensesAtlasTargets(assetId, repairMuscularAtlasTargets(assetId, repairJointsAtlasTargets(assetId, repairFoundationsTargets(assetId, changed ? result : points))));
}

export function applyRepair5Targets(asset: Asset): Asset {
  const labels = asset.labels ? repairDiagramTargets(asset.id, asset.labels) : undefined;
  const hotspots = asset.hotspots ? repairDiagramTargets(asset.id, asset.hotspots) : undefined;
  return labels === asset.labels && hotspots === asset.hotspots ? asset : { ...asset, labels, hotspots };
}

/** Geometry cannot supply missing anatomical drawing detail. These are not certified as repaired artwork. */
export const repair5ArtworkLimitations = [
  { assetId: 'asset-servier-pelvis', issue: 'The low-resolution blue hip-joint region does not clearly distinguish the acetabular socket from the femoral head/cartilage. Its acetabulum target cannot be anatomically certified through a coordinate-only repair.' },
];
