import type { Asset } from './model';

type Point = { structureId: string; x: number; y: number };
export type TargetRepair = { structureId: string; from: [number, number]; to: [number, number]; reason: string };
const repair = (structureId: string, from: [number, number], to: [number, number], reason: string): TargetRepair => ({ structureId, from, to, reason });

/** Individually inspected source-normalized targets. Never reorder labels or change IDs/radii. */
export const repair5Targets: Record<string, TargetRepair[]> = {
  'asset-skeletal-atlas-atlas-axis': [
    repair('spinous-process', [.8873, .64], [1250 / 1450, .66], 'Center of the visible spinous-process shaft, not the background above it.'),
  ],
  'asset-skeletal-atlas-thoracic-cage': [
    repair('false-ribs', [.3557, .6685], [508 / 1450, .628], 'Centerline of rib 9 rather than the gap between ribs.'),
    repair('floating-ribs', [.4348, .8365], [627 / 1450, .796], 'Centerline of rib 12 rather than the gap below it.'),
  ],
  'asset-skeletal-atlas-rib-detail': [
    repair('costal-groove', [.7503, .5875], [1170 / 1450, .485], 'Visible darker groove along the inner rib border.'),
  ],
  'asset-skeletal-atlas-synovial-joint': [
    repair('synovial-joint', [.3179, .5], [710 / 1450, .48], 'Inside the joint between its cartilage-capped ends, not outside the capsule.'),
    repair('articular-cartilage', [.5, .39], [.5, .445], 'Center of the blue-gray cartilage cap, not the bone above it.'),
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
    repair('acetabulum', [.3, .5], [.225, .58], 'Align the old Practice location with Study; socket/head distinction remains an explicitly flagged artwork limitation.'),
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
  'asset-bvis04-muscle-tissue': [
    repair('smooth-muscle-tissue', [.8428, .328], [1195 / 1450, .334], 'Cytoplasm of the middle-row spindle cell rather than its ambiguous tapered tip.'),
  ],
};

/** Exact coordinate matching also handles pre-catalog glossary objects without relocating other views of a repeated ID. */
export function repairDiagramTargets<T extends Point>(assetId: string | undefined, points: T[]): T[] {
  const repairs = assetId ? repair5Targets[assetId] : undefined;
  if (!repairs) return points;
  let changed = false;
  const result = points.map(point => {
    const fix = repairs.find(r => r.structureId === point.structureId &&
      Math.abs(r.from[0] - point.x) < .00001 && Math.abs(r.from[1] - point.y) < .00001);
    if (!fix) return point;
    changed = true;
    return { ...point, x: fix.to[0], y: fix.to[1] };
  });
  return changed ? result : points;
}

export function applyRepair5Targets(asset: Asset): Asset {
  const labels = asset.labels ? repairDiagramTargets(asset.id, asset.labels) : undefined;
  const hotspots = asset.hotspots ? repairDiagramTargets(asset.id, asset.hotspots) : undefined;
  return labels === asset.labels && hotspots === asset.hotspots ? asset : { ...asset, labels, hotspots };
}

/** Geometry cannot supply missing anatomical drawing detail. These are not certified as repaired artwork. */
export const repair5ArtworkLimitations = [
  { assetId: 'asset-original-mitosis-stages', issue: 'The interphase cell depicts a condensed X chromosome, and the upper fifth cell has only one nucleus. Correct endpoints do not fix these phase-drawing limitations. Telophase now targets the lower two-nuclei cell. The fourth cell does show opposed purple chromatids, so the initial anaphase suspicion was dismissed on enlargement.' },
  { assetId: 'asset-servier-pelvis', issue: 'The low-resolution blue hip-joint region does not clearly distinguish the acetabular socket from the femoral head/cartilage. Its acetabulum target cannot be anatomically certified through a coordinate-only repair.' },
];
