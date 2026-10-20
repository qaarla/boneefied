import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { containedOverlayBox, protectedOverlayHeight, protectedOverlayRects } from '../components/viewerOverlayProtection.ts';
import { spreadAtlasCallouts, circleIntersectsRect } from '../components/viewerMarkerLayout.ts';
import { markerVisuals } from '../scripts/atlas/bvr02-audit.ts';
import { fitViewerScene, fittedSceneRect, imageCenteredSceneBounds } from '../components/viewerSceneFraming.ts';
import { constrainViewer } from '../components/viewerGestureController.ts';

test('nervous image-centered fit contains asymmetric enlarged callouts without shifting the actual raster', () => {
  for (const width of [239, 254, 316]) for (const sceneHeight of [220, 350, 480]) {
    const image = { x: 12, y: (sceneHeight - (width - 24) / 1.45) / 2, width: width - 24, height: (width - 24) / 1.45 };
    const rects = [image, { x: 0, y: 18, width: 60, height: 60 }, { x: width - 52, y: sceneHeight - 74, width: 48, height: 60 }];
    const fit = fitViewerScene(width, width, width, sceneHeight, imageCenteredSceneBounds(rects, image));
    const raster = fittedSceneRect(image, width, sceneHeight, fit);
    assert.ok(Math.abs(raster.x + raster.width / 2 - width / 2) < 1e-8);
    assert.ok(Math.abs(raster.y + raster.height / 2 - width / 2) < 1e-8);
    assert.ok(Math.abs(raster.width / raster.height - 1.45) < 1e-8);
    for (const rect of rects) {
      const p = fittedSceneRect(rect, width, sceneHeight, fit);
      assert.ok(p.x >= 4 - 1e-8 && p.y >= 4 - 1e-8);
      assert.ok(p.x + p.width <= width - 4 + 1e-8 && p.y + p.height <= width - 4 + 1e-8);
    }
  }
});

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
  assert.match(viewer, /image: panBounds/);
  assert.match(viewer, /viewerPanBounds\(imageBox/);
  assert.match(viewer, /fitViewerScene/);
  assert.match(viewer, /left: imageBox\.x, top: imageBox\.y, width: imageBox\.width, height: imageBox\.height/);
  assert.match(viewer, /resizeMode="contain"/);
  assert.doesNotMatch(viewer, /Math\.min\(columns, 2\)/);
});

test('reset fits real raster, outlying annotations and their full hit boxes inside a square frame', () => {
  for (const width of [239, 301, 348, 390]) for (const sceneHeight of [180, 396, 780]) {
    const rects = [
      containedOverlayBox(width, sceneHeight, 1.45, 12),
      { x: width - 12, y: 20, width: 60, height: 44 }, // extends beyond raster/frame
      { x: -15, y: sceneHeight - 12, width: 44, height: 60 },
    ];
    const fit = fitViewerScene(width, width, width, sceneHeight, rects);
    for (const r of rects) {
      const left = fit.left + width * (1 - fit.scale) / 2 + r.x * fit.scale;
      const top = fit.top + sceneHeight * (1 - fit.scale) / 2 + r.y * fit.scale;
      assert.ok(left >= 4 - 1e-7 && top >= 4 - 1e-7);
      assert.ok(left + r.width * fit.scale <= width - 4 + 1e-7);
      assert.ok(top + r.height * fit.scale <= width - 4 + 1e-7);
    }
    const raster = fittedSceneRect(rects[0], width, sceneHeight, fit);
    const scene = { width, height: width, image: raster };
    for (const zoom of [1.5, 2, 4]) {
      const a = constrainViewer({ zoom, offset: { x: -1e6, y: -1e6 } }, scene);
      const b = constrainViewer({ zoom, offset: { x: 1e6, y: 1e6 } }, scene);
      for (const [frame, start, size, lo, hi] of [
        [width, raster.x, raster.width, a.offset.x, b.offset.x],
        [width, raster.y, raster.height, a.offset.y, b.offset.y],
      ]) {
        const first = frame / 2 + (start - frame / 2) * zoom;
        const last = first + size * zoom;
        // Both complete edges of the enlarged raster are reachable, and at
        // either limit it covers the viewport (or stays fully inside it).
        assert.ok(first + hi >= -1e-7);
        assert.ok(last + lo <= frame + 1e-7);
        for (const offset of [lo, hi]) {
          const overlap = Math.min(frame, last + offset) - Math.max(0, first + offset);
          assert.ok(overlap >= Math.min(frame, size * zoom) - 1e-7);
        }
      }
    }
  }
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
