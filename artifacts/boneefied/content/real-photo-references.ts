/** Only individually verified records from research/boneefied-photo-references/verified-references.json.
 * Limited specimen examples disclose their view/laterality in the link label.
 * Artwork provenance URLs and partial research candidates are NOT photo fallbacks.
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
};

import { references } from './real-photo-reference-data.ts';

export function photoReferencesForAsset(assetId?: string): readonly PhotoReference[] {
  return assetId && Object.hasOwn(references, assetId) ? references[assetId]! : [];
}

export function canShowPhotoReferences(mode: PhotoReferenceMode, answerRevealed: boolean, allRecallLabelsRevealed: boolean): boolean {
  if (mode === 'learn') return true;
  if (mode === 'practice') return answerRevealed;
  return answerRevealed || allRecallLabelsRevealed;
}

export function photoReferenceLabel(reference: PhotoReference, language: 'en' | 'es'): string {
  const labels = {
    'gross-photo': { en: 'See real photo', es: 'Ver foto real' },
    micrograph: { en: 'See real photo (microscope)', es: 'Ver foto real (microscopio)' },
    'diagnostic-imaging': { en: 'See medical imaging', es: 'Ver imagen médica' },
  };
  const subject = reference.subject?.[language];
  return `${labels[reference.mediaType][language]}${subject ? ` — ${subject}` : ''} · ${reference.sourceName}`;
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
