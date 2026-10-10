import type { Asset, Module, Question, SourceRecord } from './model';
import { atlasPlates } from './atlas-plates.generated.ts';

export const ATLAS_SOURCE_ID = 'source-boneefied-foundational-atlas';
export const ATLAS_RIGHTS = 'Original Boneefied project artwork; all rights reserved by Boneefied. No CC0 or public-domain dedication is granted.';

export const atlasSources: SourceRecord[] = [{
  id: ATLAS_SOURCE_ID, filename: 'Boneefied foundational atlas pack (10 SVG plates with PNG siblings)', hash: 'boneefied-foundational-atlas-2026-10-10', pageCount: null,
  title: 'Boneefied foundational atlas pack', courseLabAssociation: null, sourceType: 'image', attributionLicenseStatus: ATLAS_RIGHTS,
  notes: 'Ten original vector plates drawn from scratch; no third-party art was traced or imported. Text-only factual references (no images): NCI SEER Training Modules, MedlinePlus and the NCI SEER glossary, checked 2026-10-10. Provenance: assets/images/anatomy/atlas/provenance.json.',
  verificationStatus: 'verified',
}];

export const atlasAssets: Asset[] = atlasPlates.map((p) => {
  const labels = p.labels.map((l) => ({ structureId: l.structureId, displayLabel: l.en, x: l.x, y: l.y, radius: l.radius }));
  return {
    id: p.id, sourceId: ATLAS_SOURCE_ID, sourcePage: null, localAssetPath: p.pngPath, assetType: 'diagram', labelStatus: 'unlabeled',
    attributionLicense: ATLAS_RIGHTS, verificationStatus: 'verified', title: p.title[0], description: `${p.description[0]} Orientation: ${p.orientation}.`,
    hotspots: labels.map(({ structureId, x, y, radius }) => ({ structureId, x, y, radius })), labels,
    imageAspectRatio: 1.45, imageOrientation: 'landscape',
    adaptationNote: 'Original Boneefied vector art (SVG master with PNG sibling). Modified copies must keep the original-authorship notice. Contains no baked text; names come from labels metadata.',
  };
});

const byKey = (key: string) => `asset-atlas-${key}`;
const placements: Record<string, Record<string, string[]>> = {
  'anatomy-foundations': {
    'foundations-position-directions': ['anterior-position', 'posterior-position'],
    'foundations-surface-regions': ['anterior-position', 'posterior-position'],
    'foundations-planes-sections': ['body-planes'],
    'foundations-body-cavities': ['body-cavities'],
    'foundations-serous-membranes': ['body-cavities'],
    'foundations-abdomen-map': ['abdominal-quadrants', 'abdominal-regions'],
    'foundations-organization': ['organ-locations'],
    'organ-map': ['organ-locations'],
  },
  'skeletal-system': {
    'skull-orientation': ['skeleton-anterior'],
    'vertebral-column': ['skeleton-posterior'],
    'thoracic-cage': ['skeleton-anterior', 'skeleton-posterior'],
    'limb-girdles': ['skeleton-axial-appendicular', 'skeleton-anterior'],
    'limb-bones': ['skeleton-anterior', 'skeleton-axial-appendicular'],
  },
};

const contextPlates: Record<string, string[]> = {
  'anatomical-position': ['anterior-position', 'posterior-position'],
  anterior: ['anterior-position'],
  posterior: ['posterior-position'],
  'midsagittal-plane': ['body-planes'],
  'dorsal-cavity': ['body-cavities'],
  'ventral-cavity': ['body-cavities'],
  'abdominopelvic-cavity': ['body-cavities'],
};
export const atlasAssetsForStructure = (structureId: string): Asset[] => atlasAssets.filter((a) =>
  a.labels?.some((l) => l.structureId === structureId) || contextPlates[structureId]?.some((key) => a.id === `asset-atlas-${key}`));

export function attachAtlasPack(modules: Module[]): Module[] {
  return modules.map((module) => {
    const map = placements[module.id];
    if (!map) return module;
    return {
      ...module,
      sourceIds: [...new Set([...module.sourceIds, ATLAS_SOURCE_ID])],
      lessons: module.lessons?.map((lesson) => {
        const keys = map[lesson.id];
        if (!keys) return lesson;
        return {
          ...lesson,
          assetIds: [...new Set([...keys.map(byKey), ...(lesson.assetIds ?? [])])],
          sourceIds: [...new Set([...lesson.sourceIds, ATLAS_SOURCE_ID])],
        };
      }),
    };
  });
}

const plate = (key: string) => atlasPlates.find((p) => p.key === key)!;
const pick = (key: string, ids: string[]) => ids.map((id) => {
  const l = plate(key).labels.find((x) => x.structureId === id)!;
  return { structureId: l.structureId, x: l.x, y: l.y, radius: l.radius };
});
const hq = (id: string, moduleId: string, answer: string, key: string, candidates: string[], prompt: string, explanation: string): Question => ({
  id, moduleId, structureIds: [answer], taskType: 'hotspot', prompt, answer, options: candidates, acceptedAliases: [], assetId: byKey(key), explanation,
  sourceId: ATLAS_SOURCE_ID, sourcePage: null, examPriority: true, verificationStatus: 'verified', hotspots: pick(key, candidates),
});

export const atlasQuestionSpecs = [
  { q: hq('q-atlas-plane-coronal', 'anatomy-foundations', 'coronal-plane', 'body-planes', ['sagittal-plane', 'coronal-plane', 'transverse-plane'], 'Tap the plane that divides the body into anterior (front) and posterior (back) parts.', 'A coronal (frontal) plane runs side to side and separates front from back; the sagittal plane separates left from right and the transverse plane separates upper from lower.'),
    es: { prompt: 'Toca el plano que divide el cuerpo en una parte anterior (frontal) y una posterior (dorsal).', explanation: 'El plano coronal (frontal) va de lado a lado y separa el frente de la espalda; el plano sagital separa izquierda de derecha y el transversal separa arriba de abajo.' } },
  { q: hq('q-atlas-quadrant-ruq', 'anatomy-foundations', 'right-upper-quadrant', 'abdominal-quadrants', ['right-upper-quadrant', 'left-upper-quadrant', 'right-lower-quadrant', 'left-lower-quadrant'], 'Tap the patient\'s right upper quadrant.', 'Quadrants use the patient\'s sides, so the patient\'s right is on the viewer\'s left in this anterior view; upper lies above the transverse line through the navel.'),
    es: { prompt: 'Toca el cuadrante superior derecho del paciente.', explanation: 'Los cuadrantes se nombran según los lados del paciente; en esta vista anterior la derecha del paciente queda a la izquierda del observador, y superior es lo que está sobre la línea horizontal que pasa por el ombligo.' } },
  { q: hq('q-atlas-pleural-cavity', 'anatomy-foundations', 'pleural-cavity', 'body-cavities', ['visceral-pleura', 'pleural-cavity', 'parietal-pleura'], 'In the inset, tap the thin pleural cavity itself, not either membrane.', 'The pleural cavity is the thin serous space between the visceral pleura on the lung surface and the parietal pleura lining the chest wall.'),
    es: { prompt: 'En el recuadro, toca la delgada cavidad pleural misma, no ninguna de las membranas.', explanation: 'La cavidad pleural es el delgado espacio seroso entre la pleura visceral de la superficie pulmonar y la pleura parietal que reviste la pared torácica.' } },
  { q: hq('q-atlas-organ-spleen', 'anatomy-foundations', 'spleen', 'organ-locations', ['liver', 'stomach', 'spleen', 'heart'], 'Tap the spleen.', 'The spleen lies in the upper left abdomen (patient left, viewer right in an anterior view), lateral to the stomach.'),
    es: { prompt: 'Toca el bazo.', explanation: 'El bazo está en la parte superior izquierda del abdomen (izquierda del paciente, derecha del observador en vista anterior), lateral al estómago.' } },
  { q: hq('q-atlas-skeleton-clavicle', 'skeletal-system', 'clavicle', 'skeleton-anterior', ['clavicle', 'sternum', 'humerus', 'femur'], 'Tap the clavicle.', 'The clavicle is the slender S-shaped bone that links the sternum to the shoulder; the sternum is the midline chest bone.'),
    es: { prompt: 'Toca la clavícula.', explanation: 'La clavícula es el hueso delgado en forma de S que une el esternón con el hombro; el esternón es el hueso medio del tórax.' } },
  { q: hq('q-atlas-skeleton-scapula', 'skeletal-system', 'scapula', 'skeleton-posterior', ['scapula', 'sacrum', 'humerus', 'femur'], 'Tap the scapula.', 'The scapula is the flat triangular shoulder-blade bone seen on the upper back; the sacrum lies between the hip bones.'),
    es: { prompt: 'Toca la escápula.', explanation: 'La escápula es el hueso plano y triangular del omóplato en la parte superior de la espalda; el sacro está entre los huesos coxales.' } },
] as const;

export const atlasQuestions: Question[] = atlasQuestionSpecs.map((s) => s.q);
