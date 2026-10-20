import type { Asset, OverlayAvoidRect } from './model';

type Point = { structureId: string; x: number; y: number };
/** These assets have one view per structure. Apply equally to raw glossary,
 * assembled Study labels, and question-specific targets; never renumber them. */
export const foundationsAtlasTargets: Record<string, Record<string, readonly [number, number]>> = {
  'asset-original-mitosis-stages': {
    interphase: [400 / 1450, .27],
    prophase: [1010 / 1450, .226],
    metaphase: [270 / 1450, .705],
    anaphase: [660 / 1450, .655],
    telophase: [1108 / 1450, .73],
  },
  'asset-original-body-cavities': {
    'cranial-cavity': [(470 * 1.1 - 150) / 800, .104],
    'vertebral-cavity': [(575 * 1.1 - 150) / 800, .48],
    'thoracic-cavity': [(418.035 * 1.1 - 150) / 800, .336],
    'abdominal-cavity': [(413.975 * 1.1 - 150) / 800, .59],
    'pelvic-cavity': [(494.015 * 1.1 - 150) / 800, .776],
  },
};

export const foundationsAtlasAvoidRects: Record<string, OverlayAvoidRect[]> = {
  'asset-original-mitosis-stages': [
    { x: 235 / 1450, y: .105, width: 330 / 1450, height: .33 },
    { x: 885 / 1450, y: .105, width: 330 / 1450, height: .33 },
    { x: 105 / 1450, y: .565, width: 330 / 1450, height: .33 },
    { x: 535 / 1450, y: .565, width: 380 / 1450, height: .33 },
    { x: 1005 / 1450, y: .565, width: 350 / 1450, height: .33 },
  ],
  'asset-original-body-cavities': [{ x: .30, y: .045, width: .39, height: .90 }],
};

export function repairFoundationsTargets<T extends Point>(assetId: string | undefined, points: T[]): T[] {
  const targets = assetId ? foundationsAtlasTargets[assetId] : undefined;
  if (!targets) return points;
  let changed = false;
  const result = points.map(point => {
    const target = targets[point.structureId];
    if (!target || point.x === target[0] && point.y === target[1]) return point;
    changed = true;
    return { ...point, x: target[0], y: target[1] };
  });
  return changed ? result : points;
}

/** Run after the historical overlay tuning: its protected regions describe the
 * old art, and must not move callouts onto the corrected figures. */
export function applyFoundationsAtlasArt(asset: Asset): Asset {
  if (asset.id === 'asset-original-mitosis-stages') return {
    ...asset, imageAspectRatio: 1.45, imageOrientation: 'landscape',
    description: 'Original schematic of five successive cell-cycle stages, in reading order: interphase, prophase, metaphase, anaphase, and telophase with an early cleavage furrow. Interphase is not a stage of mitosis. Diffuse chromatin, condensed duplicated chromosomes, equatorial alignment, separated daughter chromosomes, and two reforming nuclei are distinguished. Four chromosomes are used for clarity; this is not a human chromosome count.',
    specimenNote: 'Schematic teaching diagram, not a specimen or photomicrograph.',
    adaptationNote: 'Original Boneefied matte vector correction; SVG master and exact-file provenance in assets/images/anatomy/foundations-corrections/. No baked labels.',
    hotspotOverlayAvoidRects: foundationsAtlasAvoidRects[asset.id],
  };
  if (asset.id === 'asset-original-body-cavities') return {
    ...asset, imageAspectRatio: 800 / 1100, imageOrientation: 'portrait',
    description: 'Original sagittal schematic of the cranial, vertebral, thoracic, abdominal and pelvic cavities. The vertebral canal continues posterior to the trunk cavities, rather than ending in the neck. Anterior is left; posterior is right. The diaphragm separates the thoracic and abdominopelvic cavities.',
    specimenNote: 'Schematic teaching diagram, not a specimen or photomicrograph.',
    adaptationNote: 'Isolated and uniformly reframed from the existing original Boneefied foundational-atlas sagittal artwork; no third-party artwork. SVG master and provenance in assets/images/anatomy/foundations-corrections/. No baked labels.',
    hotspotOverlayAvoidRects: foundationsAtlasAvoidRects[asset.id],
  };
  return asset;
}
