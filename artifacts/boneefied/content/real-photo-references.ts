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
  const labels = {
    'gross-photo': { en: 'Real photo', es: 'Foto real' },
    micrograph: { en: 'Microscope photo', es: 'Foto al microscopio' },
    'diagnostic-imaging': { en: 'Medical image', es: 'Imagen médica' },
  };
  return labels[reference.mediaType][language];
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
