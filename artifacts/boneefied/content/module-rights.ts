import type { Asset, ContentCatalog, Module } from './model.ts';
import { readableAttribution } from './visual-disclosure.ts';

/** Includes lesson, gallery and Practice-only art without crediting retired art. */
export function collectModuleRights(catalog: ContentCatalog, module: Module, galleryIds: readonly string[] = []) {
  const ids = new Set([
    ...galleryIds,
    ...(module.lessons ?? []).flatMap((lesson) => lesson.assetIds ?? []),
    ...catalog.questions.filter((question) => question.moduleId === module.id).flatMap((question) => question.assetId ? [question.assetId] : []),
  ]);
  const assets = catalog.assets.filter((asset) => ids.has(asset.id));
  const sourceIds = new Set([...module.sourceIds, ...assets.map((asset) => asset.sourceId)]);
  return { assets, sources: catalog.sources.filter((source) => sourceIds.has(source.id)) };
}

/** Standalone plate groups retain the supplied records, including non-catalog
 * glossary plates, plus definition sources. Deduplication never rewrites data. */
export function collectAssetRights(catalog: ContentCatalog, suppliedAssets: readonly Asset[], additionalSourceIds: readonly string[] = []) {
  const assets = [...new Map(suppliedAssets.map(asset => [asset.id, asset])).values()];
  const sourceIds = new Set([...additionalSourceIds, ...assets.map(asset => asset.sourceId)]);
  return { assets, sources: catalog.sources.filter(source => sourceIds.has(source.id)) };
}

/** Keep creator, license and modification credit; detailed provenance stays below. */
export function conciseVisualCredit(value: string) {
  return readableAttribution(value)
    .replace(/Open source and rights page\.?/gi, '')
    .replace(/Original Boneefied project (?:vector )?artwork \([^)]+\)/g, 'Boneefied original artwork')
    .replace(/ Tissue schematics are not photomicrographs\./g, '')
    .replace(/Changes: labels\/targets added by Boneefied\./g, 'Annotated by Boneefied.')
    .replace(/\s+/g, ' ').trim();
}
