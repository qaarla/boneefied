import type { Asset } from './model';
import { atlasAssets, atlasAssetsForStructure } from './atlas-pack.ts';
import { skeletalAtlasAssets, SKELETAL_REPLACED_IDS, SKELETAL_RETAINED_IDS } from './skeletal-atlas-pack.ts';
import { visualAssets } from './visual-content.ts';
import { muscularAtlasAssets, isMuscularAtlasAssetId } from './muscular-atlas-pack.ts';
import { bvis04Assets, isBvis04AssetId } from './bvis04-pack.ts';
import { bvis05Assets, isBvis05AssetId } from './bvis05-pack.ts';
import { bvis06Assets, bvis06Structures, BVIS06_MODULES, isBvis06AssetId } from './bvis06-pack.ts';

/** Pure combined index of foundational, skeletal and muscular atlas plates (no canonical.ts import). */
export const isAtlasAssetId = (id: string): boolean =>
  isBvis06AssetId(id) || isBvis05AssetId(id) || isBvis04AssetId(id) || isMuscularAtlasAssetId(id) || id.startsWith('asset-atlas-') || id.startsWith('asset-skeletal-atlas-') || (SKELETAL_REPLACED_IDS as readonly string[]).includes(id);

export const retainedAtlasPlates: Asset[] = visualAssets.filter((a) => (SKELETAL_RETAINED_IDS as readonly string[]).includes(a.id));
export const allAtlasAssets: Asset[] = [...bvis06Assets, ...bvis05Assets, ...bvis04Assets, ...muscularAtlasAssets, ...skeletalAtlasAssets, ...retainedAtlasPlates, ...atlasAssets];

// Whole groups are contextual associations, not invented pins on one member bone.
const contextIds: Record<string, string[]> = {
  skull: ['asset-skull-front', 'asset-skull-lateral', 'asset-skeletal-atlas-skull-base-external', 'asset-skeletal-atlas-cranial-floor-internal', 'asset-skeletal-atlas-skull-sutures'],
  carpals: ['asset-skeletal-atlas-hand-palmar'],
  tarsals: ['asset-skeletal-atlas-foot-dorsal'],
  pelvis: ['asset-servier-pelvis', 'asset-skeletal-atlas-hip-bone'],
};

/** New and retained plates first; whole-body context plates last. */
export function combinedAtlasAssetsForStructure(structureId: string): Asset[] {
  // Foreign context labels must not displace another system's dedicated atlas.
  const scoped = bvis06Structures.find((s) => s.id === structureId);
  if (scoped && BVIS06_MODULES.includes(scoped.moduleId)) {
    const detail = bvis06Assets.filter((a) => a.labels?.some((l) => l.structureId === structureId));
    if (detail.length) return detail;
  }
  const newDetail = bvis05Assets.filter((a) => a.labels?.some((l) => l.structureId === structureId));
  if (newDetail.length) return newDetail;
  const detail = [...bvis04Assets, ...muscularAtlasAssets, ...skeletalAtlasAssets, ...retainedAtlasPlates].filter((a) =>
    contextIds[structureId]?.includes(a.id) || a.labels?.some((l) => l.structureId === structureId) || a.hotspots?.some((h) => h.structureId === structureId));
  return [...detail, ...atlasAssetsForStructure(structureId)];
}

/** Retained plates carry hotspots but no labels; synthesize labels with a caller-supplied name resolver. */
export function withSynthesizedLabels(asset: Asset, nameOf: (structureId: string) => string): Asset {
  if (asset.labels?.length || !asset.hotspots) return asset;
  return { ...asset, labels: asset.hotspots.map((h) => ({ structureId: h.structureId, displayLabel: nameOf(h.structureId), x: h.x, y: h.y, radius: h.radius })) };
}
