import type { Asset, Module, SourceRecord } from './model';
import { bvis06Plates } from './bvis06-plates.generated.ts';
import { bvis05Structures } from './bvis05-pack.ts';

export const BVIS06_MODULES = ['digestive-system', 'urinary-system', 'male-reproductive', 'female-reproductive'];
export const BVIS06_SOURCE = 'source-boneefied-bvis06-atlas';
export const BVIS06_RIGHTS = 'Original Boneefied project vector artwork (BVIS06); all rights reserved. Tissue schematics are not photomicrographs.';
// Raw authored structures avoid a circular dependency on the assembled catalog.
export const bvis06Structures = bvis05Structures;
export function bvis06Name(id: string): string {
  const s = bvis06Structures.find((s) => s.id === id);
  if (!s) throw new Error(`Unknown BVIS06 canonical target: ${id}`);
  return s.canonicalName;
}
export const bvis06Sources: SourceRecord[] = [{
  id: BVIS06_SOURCE, filename: 'Boneefied BVIS06 original vector pack', hash: 'boneefied-bvis06-original-vector-pack',
  pageCount: null, title: 'Boneefied digestive, urinary and reproductive atlas',
  courseLabAssociation: null, sourceType: 'image', attributionLicenseStatus: BVIS06_RIGHTS,
  notes: 'Original vectors; no third-party imagery imported or traced. SVG masters, PNG exports, anatomical annotations, factual references and hashes: assets/images/anatomy/bvis06-atlas/provenance.json. Live text-only factual checks: docs/atlas/BVIS06_FACT_CHECKS.json. Real specimen evidence is separate in docs/atlas/BVIS06_SPECIMEN_LICENSES.json.',
  verificationStatus: 'verified',
}];
export const bvis06Assets: Asset[] = bvis06Plates.map((p) => ({
  id: p.id, sourceId: BVIS06_SOURCE, sourcePage: null, localAssetPath: p.pngPath,
  assetType: 'diagram', labelStatus: 'unlabeled', attributionLicense: BVIS06_RIGHTS, verificationStatus: 'verified',
  title: p.title[0], description: `${p.description[0]} Orientation: ${p.orientation}.`,
  labels: p.labels.map((l) => ({ ...l, displayLabel: bvis06Name(l.structureId) })),
  hotspots: p.labels.map(({ structureId, x, y, radius }) => ({ structureId, x, y, radius })),
  imageAspectRatio: 1.45, imageOrientation: 'landscape',
  specimenNote: p.teachingKind === 'tissue-schematic' ? 'Teaching schematic, not a real specimen or photomicrograph.' : undefined,
  adaptationNote: 'Original vectors from anatomical facts; no imported/traced illustrations or baked lettering. Prior drawings remain archived.',
}));
const ids = new Set(bvis06Assets.map((a) => a.id));
export const isBvis06AssetId = (id: string | undefined): boolean => !!id && ids.has(id);
export const bvis06PlateFor = (id: string) => bvis06Plates.find((p) => p.labels.some((l) => l.structureId === id));

export function attachBvis06(modules: Module[], assets: Asset[]): Module[] {
  const specimens = new Set(assets.filter((a) => a.assetType === 'histology').map((a) => a.id));
  return modules.map((m) => !BVIS06_MODULES.includes(m.id) ? m : ({
    ...m, sourceIds: [...new Set([...m.sourceIds, BVIS06_SOURCE])],
    lessons: m.lessons?.map((l) => {
      const plates = bvis06Plates.filter((p) => p.moduleId === m.id && p.lessons.includes(l.id));
      // Preserve valid existing art in lessons outside this focused pack's scope.
      const retained = (l.assetIds ?? []).filter((id) => !plates.length || specimens.has(id) || isBvis06AssetId(id));
      if (m.id === 'urinary-system' && ['urinary-corpuscle', 'urinary-histology'].includes(l.id))
        retained.push('asset-commons-kidney-cortex-human');
      return { ...l, assetIds: [...new Set([...retained, ...plates.map((p) => p.id)])],
        sourceIds: plates.length ? [...new Set([...l.sourceIds, BVIS06_SOURCE])] : l.sourceIds };
    }),
  }));
}
export const bvis06Gallery = (moduleId: string): string[] =>
  bvis06Plates.filter((p) => p.moduleId === moduleId).slice(0, 3).map((p) => p.id);
