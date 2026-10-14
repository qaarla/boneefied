import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { containedOverlayBox, protectedOverlayHeight, protectedOverlayRects } from '../components/viewerOverlayProtection.ts';
import { spreadAtlasCallouts, circleIntersectsRect } from '../components/viewerMarkerLayout.ts';
import { markerVisuals } from '../scripts/atlas/bvr02-audit.ts';

test('portrait, landscape and square diagrams contain fully with symmetric margins at phone widths', () => {
  for (const width of [239, 271, 301, 348]) for (const height of [180, 260, 480]) for (const aspect of [0.4, 1, 1.45, 2.8]) {
    const box = containedOverlayBox(width, height, aspect, 12);
    assert.ok(box.x >= 12 - 1e-8 && box.y >= 12 - 1e-8);
    assert.ok(box.x + box.width <= width - 12 + 1e-8);
    assert.ok(box.y + box.height <= height - 12 + 1e-8);
    assert.ok(Math.abs(box.width / box.height - aspect) < 1e-8);
    assert.ok(Math.abs(box.x + box.width / 2 - width / 2) < 1e-8);
    assert.ok(Math.abs(box.y + box.height / 2 - height / 2) < 1e-8);
    const projected = protectedOverlayRects(width, height, aspect, [{ x: 0, y: 0, width: 1, height: 1 }], 12)[0];
    assert.deepEqual(projected, { left: box.x, top: box.y, width: box.width, height: box.height });
  }
});

test('initial unmeasured frame has finite zero geometry', () => {
  assert.deepEqual(containedOverlayBox(0, 0, 1.45, 12), { x: 0, y: 0, width: 0, height: 0 });
});

test('shared image, overlays and gesture clamp consume the same centered contain geometry', () => {
  const viewer = readFileSync(new URL('../components/AnatomyImageViewer.tsx', import.meta.url), 'utf8');
  assert.match(viewer, /Asset\.fromModule\(source\)/);
  assert.match(viewer, /image: imageBox/);
  assert.match(viewer, /left: imageBox\.x, top: imageBox\.y, width: imageBox\.width, height: imageBox\.height/);
  assert.match(viewer, /resizeMode="contain"/);
  assert.doesNotMatch(viewer, /Math\.min\(columns, 2\)/);
});

test('sparse and dense published atlas plates fit padded frames without losing callouts or covering protected anatomy', () => {
  for (const asset of markerVisuals()) {
    const points = asset.labels?.length ? asset.labels : asset.hotspots ?? [];
    if (!points.length) continue;
    for (const width of [239, 301]) for (const cell of [44, 60]) {
      const columns = Math.max(1, Math.floor(width / (cell + 8)));
      const baseHeight = Math.max(width / 1.45, Math.ceil(points.length / columns) * (cell + 8) + 8);
      const aspect = asset.imageAspectRatio ?? 1.45;
      const avoid = asset.hotspotOverlayAvoidRects ?? [];
      const radius = (asset.hotspotSizeOverride?.maxDiameter ?? 40) / 2;
      const height = protectedOverlayHeight(points, width, baseHeight, cell, cell, aspect, avoid, radius, 12);
      const box = containedOverlayBox(width, height, aspect, 12);
      const anchors = points.map(p => ({ x: box.x + p.x * box.width, y: box.y + p.y * box.height }));
      const rects = protectedOverlayRects(width, height, aspect, avoid, 12);
      const bubbles = spreadAtlasCallouts(anchors, width, height, cell, cell, 8, { avoid: rects, markerRadius: radius });
      assert.equal(bubbles.length, points.length, asset.id);
      for (const bubble of bubbles) {
        assert.ok(bubble.x - radius >= 0 && bubble.x + radius <= width, asset.id);
        assert.ok(bubble.y - radius >= 0 && bubble.y + radius <= height, asset.id);
        for (const rect of rects) assert.equal(circleIntersectsRect(bubble, radius, rect), false, asset.id);
      }
    }
  }
});
