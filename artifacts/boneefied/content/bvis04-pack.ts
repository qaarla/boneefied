import type { Asset, Module, SourceRecord } from './model';
import { bvis04Plates } from './bvis04-plates.generated.ts';
import { nervousStructures } from './systems.ts';
import { cellsStructures, skinStructures, sensesStructures } from './sensory-systems.ts';

export const BVIS04_MODULES = ['nervous-system', 'special-senses', 'integumentary-system', 'cells-tissues'];
export const BVIS04_SOURCE = 'source-boneefied-bvis04-atlas';
export const BVIS04_RIGHTS = 'Original Boneefied project vector artwork (BVIS04); all rights reserved. Tissue schematics are not photomicrographs.';
export const bvis04Structures = [...nervousStructures, ...cellsStructures, ...skinStructures, ...sensesStructures];
export const bvis04Name = (id: string) => {
  const s = bvis04Structures.find((s) => s.id === id);
  if (!s) throw new Error(`Unknown BVIS04 canonical ID: ${id}`);
  return s.canonicalName;
};
export const bvis04Sources: SourceRecord[] = [{
  id: BVIS04_SOURCE, filename: 'Boneefied BVIS04 original vector pack',
  hash: 'boneefied-bvis04-original-vector-pack', pageCount: null,
  title: 'Boneefied nervous, senses, skin and tissue atlas', courseLabAssociation: null,
  sourceType: 'image', attributionLicenseStatus: BVIS04_RIGHTS,
  notes: 'Original vectors; no imported/traced illustrations. SVG masters, PNG exports, annotations, factual references and hashes: assets/images/anatomy/bvis04-atlas/provenance.json. Existing real specimens have separate exact-file licensing evidence in docs/atlas/BVIS04_SPECIMEN_LICENSES.json.',
  verificationStatus: 'verified',
}];
export const bvis04Assets: Asset[] = bvis04Plates.map((p) => ({
  id: p.id, sourceId: BVIS04_SOURCE, sourcePage: null, localAssetPath: p.pngPath,
  assetType: 'diagram', labelStatus: 'unlabeled', attributionLicense: BVIS04_RIGHTS,
  verificationStatus: 'verified',
  title: p.title[0], description: `${p.description[0]} Orientation: ${p.orientation}.`,
  labels: p.labels.map((l) => ({ ...l, displayLabel: bvis04Name(l.structureId) })),
  hotspots: p.labels.map(({ structureId, x, y, radius }) => ({ structureId, x, y, radius })),
  imageAspectRatio: 1.45, imageOrientation: 'landscape',
  specimenNote: p.teachingKind === 'tissue-schematic' ? 'Schematic teaching diagram, not a specimen or photomicrograph.' : undefined,
  adaptationNote: 'Drawn from anatomical facts as original vectors. No baked lettering. Retired files/IDs remain archived where replaced.',
}));
const assetIds = new Set(bvis04Assets.map((a) => a.id));
export const isBvis04AssetId = (id: string | undefined): boolean => !!id && assetIds.has(id);
export const bvis04PlateFor = (id: string) => bvis04Plates.find((p) => p.labels.some((l) => l.structureId === id));
export function applyBvis04Assets(assets: Asset[]): Asset[] {
  const byId = new Map(bvis04Assets.map((a) => [a.id, a]));
  const existing = new Set(assets.map((a) => a.id));
  return [...assets.map((a) => byId.get(a.id) ?? a), ...bvis04Assets.filter((a) => !existing.has(a.id))];
}
/** Retain real licensed specimens and the unrelated existing cell-organelle diagram. */
export const bvis04RetainedAssets = new Set([
  'asset-openstax-spinal-cord-specimen',
  'asset-commons-simple-squamous-epithelium', 'asset-commons-simple-cuboidal-epithelium',
  'asset-commons-simple-columnar-epithelium', 'asset-original-cell-overview',
]);
export function attachBvis04(modules: Module[]): Module[] {
  return modules.map((m) => !BVIS04_MODULES.includes(m.id) ? m : ({
    ...m, sourceIds: [...new Set([...m.sourceIds, BVIS04_SOURCE])],
    lessons: m.lessons?.map((l) => {
      const plates = bvis04Plates.filter((p) => p.moduleId === m.id && p.lessons.includes(l.id));
      return { ...l, assetIds: [...new Set([
        ...(l.assetIds ?? []).filter((id) => bvis04RetainedAssets.has(id) || isBvis04AssetId(id)),
        ...plates.map((p) => p.id),
      ])], sourceIds: plates.length ? [...new Set([...l.sourceIds, BVIS04_SOURCE])] : l.sourceIds };
    }),
  }));
}
/** Small gallery; regional/detail diagrams remain in their existing lessons. */
const galleryTargets: Record<string, string[]> = {
  'nervous-system': ['frontal-lobe', 'dorsal-horn', 'brachial-plexus', 'median-nerve'],
  'special-senses': ['cornea-eye', 'tympanic-membrane-ear', 'cochlear-duct-ear', 'rods-eye'],
  'integumentary-system': ['dermis-skin', 'stratum-lucidum', 'nail-plate-skin'],
  'cells-tissues': ['simple-cuboidal-epithelium', 'dense-regular-connective-tissue', 'cardiac-muscle-tissue', 'neuron-tissue'],
};
export const bvis04Gallery = (moduleId: string): string[] =>
  [...new Set((galleryTargets[moduleId] ?? []).map((id) => bvis04PlateFor(id)?.id).filter((id): id is string => !!id))];
