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

const references: Readonly<Record<string, readonly PhotoReference[]>> = {
  'asset-skeletal-atlas-skull-base-external': [{
    url: 'https://commons.wikimedia.org/wiki/File:Cranium_-_inferior_view.jpg',
    sourceName: 'Wikimedia Commons', mediaType: 'gross-photo',
  }],
  'asset-skeletal-atlas-cranial-floor-internal': [{
    url: 'https://commons.wikimedia.org/wiki/File:Cranium_-_basis_cranii_interna.jpg',
    sourceName: 'Wikimedia Commons', mediaType: 'gross-photo',
  }],
  'asset-skeletal-atlas-scapula': [{
    url: 'https://commons.wikimedia.org/wiki/File:Anterior_surface_of_scapula.jpg',
    sourceName: 'Wikimedia Commons', mediaType: 'gross-photo',
    subject: { en: 'Anterior (side unstated)', es: 'Anterior (lado no indicado)' },
  }, {
    url: 'https://commons.wikimedia.org/wiki/File:Scapula_-_posterior_view.jpg',
    sourceName: 'Wikimedia Commons', mediaType: 'gross-photo',
    subject: { en: 'Posterior (side unstated)', es: 'Posterior (lado no indicado)' },
  }],
  'asset-skeletal-atlas-humerus': [{
    url: 'https://commons.wikimedia.org/wiki/File:Humerus_-_anterior_2.jpg',
    sourceName: 'Wikimedia Commons', mediaType: 'gross-photo',
    subject: { en: 'Anterior (side unstated)', es: 'Anterior (lado no indicado)' },
  }, {
    url: 'https://commons.wikimedia.org/wiki/File:Humerus_-_posterior_2.jpg',
    sourceName: 'Wikimedia Commons', mediaType: 'gross-photo',
    subject: { en: 'Posterior (side unstated)', es: 'Posterior (lado no indicado)' },
  }],
  'asset-skeletal-atlas-femur': [{
    url: 'https://commons.wikimedia.org/wiki/File:Femur_-_anterior,_posterior.jpg',
    sourceName: 'Wikimedia Commons', mediaType: 'gross-photo',
    subject: { en: 'Both views (side unstated)', es: 'Ambas vistas (lado no indicado)' },
  }],
  'asset-commons-kidney-cortex-human': [{
    url: 'https://commons.wikimedia.org/wiki/File:Kidney_cortex_(947_21)_Human.jpg',
    sourceName: 'Wikimedia Commons', mediaType: 'micrograph',
  }],
  'asset-commons-alveolar-sac': [{
    url: 'https://commons.wikimedia.org/wiki/File:Alveolar_sac.JPG',
    sourceName: 'Wikimedia Commons', mediaType: 'micrograph',
  }],
  'asset-commons-simple-squamous-epithelium': [{
    url: 'https://commons.wikimedia.org/wiki/File:Human_Simple_Squamous_Epithelium_Tissue.jpg',
    sourceName: 'Wikimedia Commons', mediaType: 'micrograph',
  }],
};

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
