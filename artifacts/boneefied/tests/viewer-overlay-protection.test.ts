import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { content } from '../content/canonical.ts';
import { bvr02OverlayOverrides, applyBvr02Overlay } from '../content/bvr02-overlay-overrides.ts';
import { circleIntersectsRect } from '../components/viewerMarkerLayout.ts';
import { protectedOverlayRects } from '../components/viewerOverlayProtection.ts';
import { markerSizing } from '../components/viewerMarkerSizing.ts';
import { markerVisuals, overlayFrame } from '../scripts/atlas/bvr02-audit.ts';

test('per-diagram protection refers to published visuals and valid image fractions', () => {
  const published = new Set(markerVisuals().map(a => a.id));
  for (const [id, tuning] of Object.entries(bvr02OverlayOverrides)) {
    assert.ok(published.has(id), id);
    assert.ok(tuning.avoid.length, id);
    for (const r of tuning.avoid) {
      assert.ok(r.x >= 0 && r.y >= 0 && r.width > 0 && r.height > 0, id);
      assert.ok(r.x + r.width <= 1.0002 && r.y + r.height <= 1.0002, id);
    }
  }
});

test('tuning changes presentation fields only and never mutates labels or hit regions', () => {
  for (const asset of content.assets) {
    const copy = structuredClone(asset);
    const updated = applyBvr02Overlay(copy);
    assert.deepEqual(updated.labels, asset.labels);
    assert.deepEqual(updated.hotspots, asset.hotspots);
    const { hotspotSizeOverride: _size, hotspotOverlayAvoidRects: _avoid, ...after } = updated;
    const { hotspotSizeOverride: _oldSize, hotspotOverlayAvoidRects: _oldAvoid, ...before } = asset;
    assert.deepEqual(after, before);
    assert.deepEqual(copy, asset);
  }
});

test('all published marker plates fit normal and enlarged phone layouts without painted collisions', () => {
  for (const asset of markerVisuals()) {
    const points = asset.labels?.length ? asset.labels : asset.hotspots ?? content.questions.find(q => q.assetId === asset.id && q.hotspots?.length)?.hotspots ?? [];
    for (const width of [239, 271, 301, 348]) for (const scale of [1, 2.8]) for (const practice of [false, true]) {
      const frame = overlayFrame(asset, points, width, scale, practice);
      const avoid = protectedOverlayRects(width, frame.height, asset.imageAspectRatio ?? 1.45, asset.hotspotOverlayAvoidRects ?? [], 12);
      assert.equal(frame.callouts.length, points.length, asset.id);
      frame.callouts.forEach((point, i) => {
        assert.ok(point.x >= frame.cell / 2 && point.x <= width - frame.cell / 2, asset.id);
        assert.ok(point.y >= frame.cell / 2 && point.y <= frame.height - frame.cell / 2, asset.id);
        for (const r of avoid) assert.equal(circleIntersectsRect(point, frame.paint.diameter / 2, r), false, asset.id);
        for (const other of frame.callouts.slice(i + 1)) assert.ok(Math.hypot(point.x - other.x, point.y - other.y) >= frame.cell, asset.id);
        assert.ok(Math.abs((frame.anchors[i].x - frame.box.x) / frame.box.width - points[i].x) < 1e-8, asset.id);
        assert.ok(Math.abs((frame.anchors[i].y - frame.box.y) / frame.box.height - points[i].y) < 1e-8, asset.id);
      });
      assert.ok(frame.cell >= (practice && scale > 1.3 ? 60 : 44));
    }
  }
});

test('local paint caps keep both default and enlarged numerals readable', () => {
  for (const tuning of Object.values(bvr02OverlayOverrides).filter(t => t.size)) {
    for (const width of [200, 271, 348]) for (const scale of [1, 1.35, 2.8]) {
      const paint = markerSizing(width, 25, scale, tuning.size);
      assert.ok(paint.diameter >= (tuning.size!.diameter! < 18 ? 16 : 18) && paint.diameter <= tuning.size!.maxDiameter!);
      assert.ok(paint.numeralSize >= 10 && paint.numeralSize <= paint.diameter * (paint.diameter < 18 ? .625 : .56));
    }
  }
});

test('module, glossary and practice all resolve overlay tuning by published identity', () => {
  for (const file of ['app/module/[id].tsx', 'app/glossary/[id].tsx', 'app/(tabs)/practice.tsx']) {
    const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    for (const viewer of source.match(/<AnatomyImageViewer[\s\S]*?\/>/g) ?? []) assert.ok(viewer.includes('diagramAssetId='), file);
  }
  const viewer = readFileSync(new URL('../components/AnatomyImageViewer.tsx', import.meta.url), 'utf8');
  assert.ok(viewer.includes('hitSlop={labelCalloutLayout ? undefined'));
});
