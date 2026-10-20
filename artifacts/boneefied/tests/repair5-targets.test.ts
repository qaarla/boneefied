import test from 'node:test';
import assert from 'node:assert/strict';
import { content } from '../content/canonical.ts';
import { repair5Targets, repairDiagramTargets, applyRepair5Targets, repair5ArtworkLimitations } from '../content/repair5-targets.ts';
import { repair5CompactMarkerIds } from '../content/bvr02-overlay-overrides.ts';
import { markerSizing } from '../components/viewerMarkerSizing.ts';
import { foundationsAtlasTargets, repairFoundationsTargets } from '../content/foundations-atlas-corrections.ts';

test('every reviewed repair reaches a published label or Practice hotspot without changing its identity', () => {
  for (const [id, repairs] of Object.entries(repair5Targets)) {
    const asset = content.assets.find(a => a.id === id);
    assert.ok(asset, id);
    const points = [...asset.labels ?? [], ...asset.hotspots ?? [],
      ...content.questions.filter(q => q.assetId === id).flatMap(q => q.hotspots ?? [])];
    for (const r of repairs) {
      const [x, y] = foundationsAtlasTargets[id]?.[r.structureId] ?? r.to;
      assert.ok(points.some(p => p.structureId === r.structureId && p.x === x && p.y === y), `${id}: ${r.structureId}`);
      for (const coordinate of r.to) assert.ok(coordinate >= 0 && coordinate <= 1);
      assert.ok(r.reason.length > 25);
    }
  }
});

test('raw glossary/viewer points and canonical Study/Practice points share the same immutable correction', () => {
  for (const [id, repairs] of Object.entries(repair5Targets)) {
    for (const r of repairs) {
      const original = [{ structureId: r.structureId, x: r.from[0], y: r.from[1], radius: .036, displayLabel: 'Keep exact legend text' }];
      const before = structuredClone(original);
      const fixed = repairDiagramTargets(id, original);
      assert.deepEqual(original, before);
      assert.deepEqual(fixed, repairFoundationsTargets(id, [{ ...before[0], x: r.to[0], y: r.to[1] }]));
      assert.equal(repairDiagramTargets(id, fixed), fixed, 'Corrections are idempotent');
      const unrelatedView = [{ ...before[0], x: .98765, y: .12345 }];
      if (!foundationsAtlasTargets[id]) assert.equal(repairDiagramTargets(id, unrelatedView), unrelatedView, 'Repeated structure IDs in other views remain unchanged');
      else assert.deepEqual(repairDiagramTargets(id, unrelatedView), repairFoundationsTargets(id, unrelatedView), 'Replaced single-view art cannot retain stale raw coordinates');
    }
    const published = content.assets.find(a => a.id === id)!;
    assert.equal(applyRepair5Targets(published), published);
  }
});

test('number/order, answer keys, radii and unrelated assets are not rewritten', () => {
  const raw = [
    { structureId: 'costal-groove', x: .7503, y: .5875, radius: .032, ordinal: 1 },
    { structureId: 'rib-head', x: .2069, y: .36, radius: .016, ordinal: 2 },
  ];
  const fixed = repairDiagramTargets('asset-skeletal-atlas-rib-detail', raw);
  assert.deepEqual(fixed.map(p => [p.structureId, p.ordinal, p.radius]), raw.map(p => [p.structureId, p.ordinal, p.radius]));
  assert.equal(fixed[1], raw[1]);
  assert.equal(repairDiagramTargets(undefined, raw), raw);
  assert.equal(repairDiagramTargets('unknown', raw), raw);
  for (const question of content.questions.filter(q => q.hotspots?.length)) {
    assert.ok(question.hotspots!.some(p => question.structureIds.includes(p.structureId)), question.id);
  }
});

test('only named dense diagrams opt into 16–17px paint, keeping readable double-digit numerals', () => {
  for (const id of repair5CompactMarkerIds) {
    const asset = content.assets.find(a => a.id === id)!;
    assert.ok(asset, id);
    for (const width of [239, 301, 348]) for (const scale of [1, 2.8]) {
      const paint = markerSizing(width, asset.labels?.length ?? 20, scale, asset.hotspotSizeOverride);
      assert.ok(paint.diameter >= 16 && paint.diameter <= 17, id);
      assert.ok(paint.numeralSize >= 10, id);
      assert.ok(paint.numeralSize * 1.2 <= paint.diameter - 3, `${id}: two digits fit inside the border`);
    }
  }
  assert.ok(markerSizing(239, 25).diameter >= 18, 'Unreviewed defaults unchanged');
});

test('artwork limitations are explicit and retained rather than misrepresented as target repairs', () => {
  assert.equal(repair5ArtworkLimitations.length, 1);
  assert.ok(!repair5ArtworkLimitations.some(item => item.assetId === 'asset-original-mitosis-stages'), 'Actual SVG correction resolves the mitosis drawing limitation');
  for (const item of repair5ArtworkLimitations) {
    assert.ok(content.assets.some(a => a.id === item.assetId));
    assert.ok(item.issue.length > 100);
  }
});
