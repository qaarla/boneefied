import test from 'node:test';
import assert from 'node:assert/strict';
import { content } from '../content/canonical.ts';
import { peripheralAtlasAssetIds, peripheralRegionLabel } from '../content/peripheral-atlas-corrections.ts';
import { bvis04SpanishAssets } from '../locales/es/bvis04-atlas.ts';
import { anatomyImageCacheKey } from '../components/anatomyImageCacheKey.ts';

test('14 actual assigned nerve-related visuals retain 122 existing labels and no phantom module', () => {
  const assets = peripheralAtlasAssetIds.map(id => content.assets.find(a => a.id === id)!);
  assert.ok(assets.every(Boolean));
  assert.equal(assets.length, 14);
  assert.equal(assets.reduce((n, a) => n + a.labels!.length, 0), 122);
  for (const a of assets) {
    assert.ok(content.modules.some(m => m.lessons?.some(l => l.assetIds?.includes(a.id))), a.id);
    assert.equal(a.imageAspectRatio, 1.45);
  }
  assert.equal(content.modules.some(m => /cranial.*peripheral|peripheral.*nerve/.test(m.id)), false);
});
test('taste markers explicitly identify territories in both languages without moving a point or changing an ID', () => {
  const a = content.assets.find(a => a.id === 'asset-bvis04-smell-taste')!;
  for (const id of ['facial-nerve-taste', 'glossopharyngeal-nerve-taste', 'vagus-nerve-taste']) {
    const i = a.labels!.findIndex(l => l.structureId === id);
    assert.match(a.labels![i].displayLabel!, /region/);
    assert.match(bvis04SpanishAssets[a.id].labels![i], /región/);
    assert.equal(a.labels![i].displayLabel, peripheralRegionLabel(a.id, id, 'en'));
    const h = a.hotspots!.find(h => h.structureId === id)!;
    assert.deepEqual([h.x, h.y], [a.labels![i].x, a.labels![i].y]);
  }
  assert.match(a.description!, /not drawn nerve fibres/);
  assert.equal(peripheralRegionLabel('other-asset', 'facial-nerve-taste', 'en'), undefined);
});
test('only the two newly corrected cranial rasters get the shared-exit revision', () => {
  for (const n of ['11-cranial-nerves-i-vi', '12-cranial-nerves-vii-xii'])
    assert.match(anatomyImageCacheKey(`https://example.test/bvis04-${n}.png`), /cranial-shared-exits-1/);
  assert.match(anatomyImageCacheKey('https://example.test/bvis04-09-upper-limb-nerves.png'), /nervous-continuity-1/);
  assert.equal(anatomyImageCacheKey('unchanged-optic-disc.png'), 'unchanged-optic-disc.png');
});
