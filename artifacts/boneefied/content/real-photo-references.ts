/** Individually inspected photographs: complete comparisons and named selected-structure companions.
 * Selected-structure examples are labeled explicitly; they are not full-comparison approvals.
 * Uninspected candidates and artwork provenance URLs are NOT photo fallbacks.
 * Metadata only: no external images are fetched, cached or bundled.
 */
export type PhotoMedia = 'gross-photo' | 'micrograph' | 'diagnostic-imaging';
export type PhotoReferenceMode = 'learn' | 'recall' | 'practice';
export type PhotoReference = {
  url: string;
  sourceName: string;
  mediaType: PhotoMedia;
  /** A short subject/view name only when a verified comparison needs several links. */
  subject?: { en: string; es: string };
  /** The photograph is inspected, but its set does not cover the whole instructional plate. */
  coverage?: 'selected-structures';
};

import { references } from './real-photo-reference-data.ts';
import { companions } from './real-photo-companion-data.ts';

/** Display-only names, checked against the existing inspected source records.
 * No destination, coverage claim or reference assignment is changed here.
 * In particular, the inferior cranium has no mandible.
 */
const companionLinkSubjects: Readonly<Record<string, { en: string; es: string; mediaType?: PhotoMedia }>> = {
  'https://commons.wikimedia.org/wiki/File:Human_skull_1.JPG': { en: 'Skull — front view', es: 'Cráneo — vista frontal' },
  'https://commons.wikimedia.org/wiki/File:SkullSideView.JPG': { en: 'Skull — angled side view', es: 'Cráneo — vista lateral oblicua' },
  'https://commons.wikimedia.org/wiki/File:X-ray_of_the_human_skull_(side_view).jpg': { en: 'Skull — side-view X-ray', es: 'Cráneo — radiografía lateral', mediaType: 'diagnostic-imaging' },
  'https://commons.wikimedia.org/wiki/File:Cranium_-_inferior_view.jpg': { en: 'Skull base — underside', es: 'Base del cráneo — vista inferior' },
  'https://commons.wikimedia.org/wiki/File:Cranium_-_basis_cranii_interna.jpg': { en: 'Cranial floor — inside view', es: 'Suelo del cráneo — vista interior' },
  'https://commons.wikimedia.org/wiki/File:Thoracic_vertebrae.jpg': { en: 'Thoracic vertebrae — specimen', es: 'Vértebras torácicas — espécimen' },
  'https://commons.wikimedia.org/wiki/File:Vertebra_-_atlas,_axis_(superior).jpg': { en: 'Atlas and axis — top views', es: 'Atlas y axis — vistas superiores' },
  'https://commons.wikimedia.org/wiki/File:Cranium_-_neurocranium_superior_view_2.jpg': { en: 'Skull vault — top view', es: 'Bóveda del cráneo — vista superior' },
  'https://commons.wikimedia.org/wiki/File:Cranium_-_sutura_lambdoidea_(lambda).jpg': { en: 'Back of skull — suture close-up', es: 'Parte posterior del cráneo — detalle de suturas' },
  'https://commons.wikimedia.org/wiki/File:Anterior_surface_of_scapula.jpg': { en: 'Shoulder blade — front surface', es: 'Escápula — superficie anterior' },
  'https://commons.wikimedia.org/wiki/File:Scapula_-_posterior_view.jpg': { en: 'Shoulder blade — back surface', es: 'Escápula — superficie posterior' },
  'https://commons.wikimedia.org/wiki/File:AnteriorHumerusRadiusUlnaArticulated.jpg': { en: 'Elbow bones — front view', es: 'Huesos del codo — vista frontal' },
  'https://commons.wikimedia.org/wiki/File:Hand-bones.jpg': { en: 'Hand bones — specimen', es: 'Huesos de la mano — espécimen' },
  'https://commons.wikimedia.org/wiki/File:Foot_bones_-_tarsus,_metatarsus_and_phalanges.jpg': { en: 'Foot bones — specimen', es: 'Huesos del pie — espécimen' },
  'https://commons.wikimedia.org/wiki/File:Pelvis_-_os_coxae_(lateral_view)_2.jpg': { en: 'Hip bone — outer view', es: 'Hueso de la cadera — vista externa' },
  'https://commons.wikimedia.org/wiki/File:Tibia,_fibula_(anterior).jpg': { en: 'Tibia and fibula — front view', es: 'Tibia y fíbula — vista frontal' },
  'https://calisphere.org/item/74761ef06360839b7e8bc0fcd7d84ef6/': { en: 'Right shoulder joint — front dissection', es: 'Hombro derecho — disección anterior' },
  'https://calisphere.org/item/e3ac55f2986d93e7a83b199d9254ad95/': { en: 'Left elbow joint — dissection', es: 'Codo izquierdo — disección' },
  'https://calisphere.org/item/9a7013bf8ccee4934b4789248d2f16d7': { en: 'Left knee — inner-side dissection', es: 'Rodilla izquierda — disección del lado interno' },
  'https://calisphere.org/item/33d419fe3c2fb6e5c76009d048df117c': { en: 'Back of knee — ligament dissection', es: 'Parte posterior de la rodilla — disección de ligamentos' },
};

export function photoReferencesForAsset(assetId?: string): readonly PhotoReference[] {
  if (!assetId) return [];
  if (Object.hasOwn(references, assetId)) return references[assetId]!;
  return Object.hasOwn(companions, assetId) ? companions[assetId]! : [];
}

export function canShowPhotoReferences(mode: PhotoReferenceMode, answerRevealed: boolean, allRecallLabelsRevealed: boolean): boolean {
  if (mode === 'learn') return true;
  if (mode === 'practice') return answerRevealed;
  return answerRevealed || allRecallLabelsRevealed;
}

export function photoReferenceLabel(reference: PhotoReference, language: 'en' | 'es'): string {
  const subject = companionLinkSubjects[reference.url];
  if (subject && reference.mediaType === (subject.mediaType ?? 'gross-photo')) return subject[language];
  const labels = {
    'gross-photo': { en: 'Real photo', es: 'Foto real' },
    micrograph: { en: 'Microscope photo', es: 'Foto al microscopio' },
    'diagnostic-imaging': { en: 'Medical image', es: 'Imagen médica' },
  };
  return labels[reference.mediaType][language];
}

export function photoReferenceIntroduction(references: readonly PhotoReference[], language: 'en' | 'es'): string | undefined {
  if (references.length < 2 || !references.some(reference => companionLinkSubjects[reference.url])) return undefined;
  return language === 'es'
    ? 'Estos enlaces muestran distintas partes o vistas de esta ilustración.'
    : 'These links show different parts or views of this illustration.';
}

/** Context stays separate from the short hyperlink, including incomplete-set limits. */
export function photoReferenceDescription(reference: PhotoReference, language: 'en' | 'es'): string {
  const subject = reference.subject?.[language];
  const limit = reference.coverage === 'selected-structures'
    ? (language === 'en' ? 'Selected structures only' : 'Solo estructuras seleccionadas')
    : '';
  return [limit, subject, reference.sourceName].filter(Boolean).join(' · ');
}

/** No canOpenURL/network preflight: opening a public HTTPS page is attempted directly.
 * A browser may open successfully even offline; its own network errors are not app errors.
 */
export async function tryOpenPhotoReference(url: string, open: (url: string) => Promise<unknown>): Promise<boolean> {
  try {
    if (!url.startsWith('https://')) return false;
    await open(url);
    return true;
  } catch {
    return false;
  }
}
