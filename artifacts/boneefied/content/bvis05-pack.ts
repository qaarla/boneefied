import type { Asset, Module, SourceRecord } from './model';
import { bvis05Plates } from './bvis05-plates.generated.ts';
import { cardiovascularStructures, vesselsStructures, lymphaticStructures, endocrineStructures } from './circulation-systems.ts';
import { organSystemsStructures } from './organ-systems.ts';
import { bloodStructures } from './blood-microanatomy.ts';

// Regional vessel lessons are the vascular part of the existing cardiovascular curriculum.
export const BVIS05_MODULES = ['cardiovascular-system', 'blood-vessels', 'respiratory-system', 'lymphatic-system', 'endocrine-system'];
export const BVIS05_SOURCE = 'source-boneefied-bvis05-atlas';
export const BVIS05_RIGHTS = 'Original Boneefied project vector artwork (BVIS05); all rights reserved. Tissue schematics are not photomicrographs.';
export const bvis05Structures = [...cardiovascularStructures, ...vesselsStructures, ...lymphaticStructures, ...endocrineStructures, ...organSystemsStructures, ...bloodStructures];
export function bvis05Name(id: string): string {
  const s = bvis05Structures.find((s) => s.id === id);
  if (!s) throw new Error(`Unknown BVIS05 canonical target: ${id}`);
  return s.canonicalName;
}
export const bvis05Sources: SourceRecord[] = [{
  id: BVIS05_SOURCE, filename: 'Boneefied BVIS05 original vector pack', hash: 'boneefied-bvis05-original-vector-pack',
  pageCount: null, title: 'Boneefied cardiovascular, respiratory, lymphatic and endocrine atlas',
  courseLabAssociation: null, sourceType: 'image', attributionLicenseStatus: BVIS05_RIGHTS,
  notes: 'Original vectors; no imported/traced illustrations. SVG masters, PNG exports, annotations, factual references and hashes: assets/images/anatomy/bvis05-atlas/provenance.json. Real specimens retain their separate exact-file provenance in docs/atlas/BVIS05_SPECIMEN_LICENSES.json.',
  verificationStatus: 'verified',
}];
export const bvis05Assets: Asset[] = bvis05Plates.map((p) => ({
  id: p.id, sourceId: BVIS05_SOURCE, sourcePage: null, localAssetPath: p.pngPath,
  assetType: 'diagram', labelStatus: 'unlabeled', attributionLicense: BVIS05_RIGHTS, verificationStatus: 'verified',
  title: p.title[0], description: `${p.description[0]} Orientation: ${p.orientation}.`,
  labels: p.labels.map((l) => ({ ...l, displayLabel: bvis05Name(l.structureId) })),
  hotspots: p.labels.map(({ structureId, x, y, radius }) => ({ structureId, x, y, radius })),
  imageAspectRatio: 1.45, imageOrientation: 'landscape',
  specimenNote: p.teachingKind === 'tissue-schematic' ? 'Schematic teaching diagram, not a specimen or photomicrograph.' : undefined,
  adaptationNote: 'Original vectors from anatomical facts; no imported/traced illustrations or baked lettering. Prior drawings remain archived, not presented as the new artwork.',
}));
const assetIds = new Set(bvis05Assets.map((a) => a.id));
export const isBvis05AssetId = (id: string | undefined): boolean => !!id && assetIds.has(id);
export const bvis05PlateFor = (id: string) => bvis05Plates.find((p) => p.labels.some((l) => l.structureId === id));

export function attachBvis05(modules: Module[], assets: Asset[]): Module[] {
  const specimens = new Set(assets.filter((a) => a.assetType === 'histology').map((a) => a.id));
  return modules.map((m) => !BVIS05_MODULES.includes(m.id) ? m : ({
    ...m, sourceIds: [...new Set([...m.sourceIds, BVIS05_SOURCE])],
    lessons: m.lessons?.map((l) => {
      const plates = bvis05Plates.filter((p) => p.moduleId === m.id && p.lessons.includes(l.id));
      const retained = (l.assetIds ?? []).filter((id) => specimens.has(id) || isBvis05AssetId(id));
      // This existing real specimen previously appeared only in practice.
      if (m.id === 'respiratory-system' && ['respiratory-exchange', 'respiratory-histology'].includes(l.id))
        retained.push('asset-commons-alveolar-sac');
      return { ...l, assetIds: [...new Set([...retained, ...plates.map((p) => p.id)])],
        sourceIds: plates.length ? [...new Set([...l.sourceIds, BVIS05_SOURCE])] : l.sourceIds };
    }),
  }));
}

/** A small gallery; focused regional plates remain available in their lessons. */
export const bvis05Gallery = (moduleId: string): string[] =>
  bvis05Plates.filter((p) => p.moduleId === moduleId).slice(0, 3).map((p) => p.id);
