import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { markerSizing } from '../components/viewerMarkerSizing.ts';

test('phone markers are substantially smaller than 44px painted controls; dense plates are smaller', () => {
  for (const width of [250, 273, 343, 383]) {
    const sparse = markerSizing(width, 4);
    const dense = markerSizing(width, 24);
    assert.ok(sparse.diameter <= 30 && dense.diameter < sparse.diameter);
    assert.ok(dense.diameter >= 18 && dense.numeralSize >= 10);
    assert.equal(sparse.padding, 0);
    assert.ok(dense.numeralSize < sparse.numeralSize);
  }
});

test('rendered image width and enlarged typography influence paint without exceeding the tap box', () => {
  assert.ok(markerSizing(343, 4).diameter > markerSizing(250, 4).diameter);
  for (const width of [250, 273, 343]) {
    for (const scale of [1.35, 2, 3]) {
      const sparse = markerSizing(width, 4, scale), dense = markerSizing(width, 24, scale);
      assert.ok(dense.diameter < sparse.diameter);
      assert.ok(sparse.diameter <= 40 && dense.diameter <= 40);
      assert.ok(dense.numeralSize <= dense.diameter * 0.56);
      assert.ok(dense.diameter > markerSizing(width, 24).diameter);
    }
  }
});

test('optional per-diagram overrides work and do not mutate inputs', () => {
  const override = { diameter: 23, numeralSize: 10 };
  assert.equal(markerSizing(343, 24, 1, override).diameter, 23);
  assert.equal(markerSizing(343, 24, 1, override).numeralSize, 10);
  assert.deepEqual(override, { diameter: 23, numeralSize: 10 });
  assert.ok(Number.isFinite(markerSizing(0, 0).diameter));
});

test('enlarged phone bubbles remain compact with density-sensitive caps and readable numerals', () => {
  for (const width of [239, 271, 301, 348]) {
    for (const count of [1, 4, 10, 14, 24, 27]) {
      const marker = markerSizing(width, count, 2.8);
      assert.ok(marker.diameter <= 28 && marker.diameter >= 18);
      assert.ok(marker.numeralSize >= 10 && marker.numeralSize <= marker.diameter * 0.56);
    }
  }
  assert.equal(markerSizing(348, 4, 2.8).diameter, 28);
  assert.equal(markerSizing(348, 24, 2.8).diameter, 24);
  assert.equal(markerSizing(348, 25, 2.8, { diameter: 18, maxDiameter: 21, numeralSize: 10 }).diameter, 21);
});

test('all diagram consumers forward optional size and full plate density', () => {
  for (const path of ['app/(tabs)/(study)/module/[id].tsx', 'app/(tabs)/(study)/glossary/[id].tsx', 'app/(tabs)/practice.tsx']) {
    const source = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
    const viewers = source.match(/<AnatomyImageViewer[\s\S]*?\/>/g)!;
    assert.ok(viewers.length);
    assert.ok(viewers.every(viewer => viewer.includes('markerSizeOverride=') && viewer.includes('diagramMarkerCount=')));
  }
});

test('anatomy lesson bookmark target and label both cap width rather than clipping enlarged names', () => {
  const source = readFileSync(new URL('../app/(tabs)/(study)/module/[id].tsx', import.meta.url), 'utf8');
  const chips = source.match(/<View style=\{styles.chips\}>[\s\S]*?<\/View>/)?.[0] ?? '';
  assert.equal((chips.match(/maxWidth: '100%'/g) ?? []).length, 2);
  assert.ok(chips.includes('flexShrink: 1'));
});
