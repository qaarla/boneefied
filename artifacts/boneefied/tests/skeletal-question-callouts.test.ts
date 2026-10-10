import test from 'node:test';
import assert from 'node:assert/strict';
import { content } from '../content/canonical.ts';
import { skeletalAtlasQuestions } from '../content/skeletal-atlas-pack.ts';
import { combinedAtlasAssetsForStructure } from '../content/atlas-index.ts';
import { spreadAtlasCallouts, hasMarkerOverlap } from '../components/viewerMarkerLayout.ts';

test('BVIS02 practice has separated 44+ pixel controls, without relocating anatomical targets', () => {
  for (const width of [276, 346]) for (const size of [44, 60]) for (const question of skeletalAtlasQuestions) {
    const ratio = content.assets.find((a) => a.id === question.assetId)!.imageAspectRatio ?? 1.45;
    const columns = Math.max(1, Math.floor(width / (size + 8)));
    const height = Math.max(width / 1.45, Math.ceil(question.hotspots!.length / Math.min(columns, 2)) * (size + 8));
    const containedWidth = Math.min(1, ratio / (width / height));
    const containedHeight = Math.min(1, (width / height) / ratio);
    const anchors = question.hotspots!.map((h) => ({
      x: ((1 - containedWidth) / 2 + h.x * containedWidth) * width,
      y: ((1 - containedHeight) / 2 + h.y * containedHeight) * height,
    }));
    const original = JSON.stringify(anchors);
    const callouts = spreadAtlasCallouts(anchors, width, height, size, size);
    assert.equal(JSON.stringify(anchors), original);
    const boxes = callouts.map((p) => ({ left: p.x - size / 2, top: p.y - size / 2, width: size, height: size }));
    assert.equal(hasMarkerOverlap(boxes), false, question.id);
    for (const box of boxes) {
      assert.ok(box.left >= 0 && box.top >= 0 && box.left + size <= width && box.top + size <= height, question.id);
      for (const anchor of anchors) assert.ok(!(anchor.x > box.left && anchor.x < box.left + size && anchor.y > box.top && anchor.y < box.top + size), question.id);
    }
  }
});

test('whole skeletal groups lead to their regional plates, without false member-bone pins', () => {
  const expected = { carpals: 'asset-skeletal-atlas-hand-palmar', tarsals: 'asset-skeletal-atlas-foot-dorsal', pelvis: 'asset-servier-pelvis', skull: 'asset-skull-front' };
  for (const [id, assetId] of Object.entries(expected)) assert.ok(combinedAtlasAssetsForStructure(id).some((a) => a.id === assetId), id);
});
