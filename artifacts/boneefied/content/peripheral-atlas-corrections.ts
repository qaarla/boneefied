/** Actual assigned visuals, not a new module or new curriculum. */
export const peripheralAtlasAssetIds = [
  'asset-bvis04-cranial-nerves-i-vi', 'asset-bvis04-cranial-nerves-vii-xii',
  'asset-skeletal-atlas-cranial-floor-internal', 'asset-bvis04-spinal-cross-section',
  'asset-bvis04-spinal-roots-rami', 'asset-bvis04-plexus-overview',
  'asset-bvis04-upper-limb-nerves', 'asset-bvis04-lower-limb-nerves',
  'asset-gray880-optic-nerve-head', 'asset-servier-eye-section',
  'asset-servier-ear-section', 'asset-bvis04-inner-ear-vestibular',
  'asset-bvis04-smell-taste', 'asset-openstax-historical-skin-structure',
] as const;

const territories: Record<string, [string, string]> = {
  'facial-nerve-taste': ['Facial nerve (VII): anterior tongue taste region', 'Nervio facial (VII): región gustativa anterior de la lengua'],
  'glossopharyngeal-nerve-taste': ['Glossopharyngeal nerve (IX): posterior tongue taste region', 'Nervio glosofaríngeo (IX): región gustativa posterior de la lengua'],
  'vagus-nerve-taste': ['Vagus nerve (X): epiglottic taste region', 'Nervio vago (X): región gustativa epiglótica'],
};
export function peripheralRegionLabel(assetId: string, structureId: string, language: 'en' | 'es'): string | undefined {
  return assetId === 'asset-bvis04-smell-taste' ? territories[structureId]?.[language === 'es' ? 1 : 0] : undefined;
}
export function peripheralRegionNote(assetId: string, language: 'en' | 'es'): string {
  if (assetId !== 'asset-bvis04-smell-taste') return '';
  return language === 'es'
    ? 'Los marcadores VII, IX y X señalan territorios gustativos coloreados, no fibras nerviosas dibujadas; el pequeño territorio inferior representa la región epiglótica.'
    : 'The VII, IX and X markers identify colored taste territories, not drawn nerve fibres; the small inferior territory represents the epiglottic region.';
}
