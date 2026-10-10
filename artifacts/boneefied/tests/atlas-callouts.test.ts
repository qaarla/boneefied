import test from 'node:test';
import assert from 'node:assert/strict';
import { spreadAtlasCallouts, hasMarkerOverlap } from '../components/viewerMarkerLayout.ts';
import { atlasPlates } from '../content/atlas-plates.generated.ts';

test('all atlas label callouts remain disjoint at phone and enlarged marker sizes', () => {
  for (const width of [276, 346]) for (const size of [44, 60, 80]) for (const plate of atlasPlates) {
    const columns = Math.max(1, Math.floor(width / (size + 8)));
    const height = Math.max(width / 1.45, Math.ceil(plate.labels.length / Math.min(columns, 2)) * (size + 8));
    const anchors = plate.labels.map((l) => ({ x: l.x * width, y: (height - width / 1.45) / 2 + l.y * width / 1.45 }));
    const original = JSON.stringify(anchors);
    const placed = spreadAtlasCallouts(anchors, width, height, size, size);
    assert.equal(JSON.stringify(anchors), original, 'anatomical coordinates must not move');
    assert.equal(placed.length, plate.labels.length);
    const boxes = placed.map((p) => ({ left: p.x - size / 2, top: p.y - size / 2, width: size, height: size }));
    assert.equal(hasMarkerOverlap(boxes), false, plate.key);
    for (const b of boxes) assert.ok(b.left >= 0 && b.top >= 0 && b.left + size <= width && b.top + size <= height, plate.key);
    for (const b of boxes) for (const anchor of anchors) {
      assert.ok(!(anchor.x > b.left && anchor.x < b.left + size && anchor.y > b.top && anchor.y < b.top + size), `callout must not cover an anatomical target: ${plate.key}`);
    }
  }
});
