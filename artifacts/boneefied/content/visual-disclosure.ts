import type { Asset } from './model';

/** Keep attribution intact, but move long addresses to named source/rights links. */
export function readableAttribution(value: string): string {
  return value.replace(/\(?https?:\/\/[^\s)]+\)?/g, '').replace(/\s+/g, ' ').replace(/\(\s*\)/g, '').replace(/\s+([,.;])/g, '$1').trim();
}

export function visualKind(asset: Pick<Asset, 'assetType'>): 'diagram' | 'histology' | 'specimen' | 'model' {
  if (asset.assetType === 'histology') return 'histology';
  if (asset.assetType === 'model' || asset.assetType === 'syndaver') return 'model';
  if (asset.assetType === 'cadaver' || asset.assetType === 'gross specimen') return 'specimen';
  return 'diagram';
}
