import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { content } from '../content/canonical.ts';
import { combinedAtlasAssetsForStructure } from '../content/atlas-index.ts';
import { jointsAtlasCorrections, repairJointsAtlasTargets } from '../content/joints-atlas-corrections.ts';
import { repairDiagramTargets } from '../content/repair5-targets.ts';
import { anatomyImageCacheKey } from '../components/anatomyImageCacheKey.ts';

const module = content.modules.find(m => m.id === 'joints-ligaments')!;
const ids = new Set([
  ...module.lessons!.flatMap(l => l.assetIds ?? []),
  ...content.questions.filter(q => q.moduleId === module.id).flatMap(q => q.assetId ? [q.assetId] : []),
  ...content.structures.filter(s => s.moduleId === module.id).flatMap(s => combinedAtlasAssetsForStructure(s.id).map(a => a.id)),
  'asset-skeletal-atlas-hip-bone', 'asset-servier-pelvis',
]);
const assets = content.assets.filter(a => ids.has(a.id));
const points = (a: typeof assets[number]) => a.labels?.length ? a.labels : a.hotspots ?? [];

test('every published joints lesson/question/glossary visual plus both requested hip illustrations: 8 plates, 64 targets', () => {
  assert.equal(module.published, true);
  assert.equal(assets.length, 8);
  assert.equal(assets.reduce((n, a) => n + points(a).length, 0), 64);
  assert.equal(assets.filter(a => Object.hasOwn(jointsAtlasCorrections, a.id)).length, 3);
});

test('all ten individually corrected anatomical targets propagate to every published label/hotspot/question endpoint', () => {
  assert.equal(Object.values(jointsAtlasCorrections).flat().length, 10);
  for (const [id, repairs] of Object.entries(jointsAtlasCorrections)) {
    const a = assets.find(a => a.id === id)!;
    for (const r of repairs) {
      const current = [
        ...points(a), ...a.hotspots ?? [],
        ...content.questions.filter(q => q.assetId === id).flatMap(q => q.hotspots ?? []),
      ].filter(p => p.structureId === r.structureId);
      assert.ok(current.length, `${id}:${r.structureId}`);
      for (const p of current) assert.deepEqual([p.x, p.y], r.to, `${id}:${r.structureId}`);
      const old = [{ structureId: r.structureId, x: r.from[0], y: r.from[1], radius: .023 }];
      const fixed = repairDiagramTargets(id, old);
      assert.equal(fixed[0].radius, .023);
      assert.deepEqual([fixed[0].x, fixed[0].y], r.to);
      assert.deepEqual([old[0].x, old[0].y], r.from);
      assert.equal(repairJointsAtlasTargets(id, fixed), fixed, 'No repeated drift');
    }
  }
});

test('all 8 real raster dimensions, local references and source licenses remain intact', () => {
  const resolver = fs.readFileSync('content/imageSources.ts', 'utf8');
  for (const a of assets) {
    const png = fs.readFileSync(a.localAssetPath!);
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
    assert.ok(Math.abs(png.readUInt32BE(16) / png.readUInt32BE(20) - a.imageAspectRatio!) < .00001, a.id);
    assert.ok(resolver.includes(`'${a.id}': require(`), a.id);
    assert.ok(a.attributionLicense && content.sources.some(s => s.id === a.sourceId), a.id);
  }
});

test('only the three redrawn joint rasters get the new preview identity; previous skeletal offline keys are preserved', () => {
  for (const a of assets) {
    const uri = `https://example.test/assets/?unstable_path=${encodeURIComponent(`./${a.localAssetPath}`)}`;
    const key = anatomyImageCacheKey(uri);
    const revision = new URL(key).searchParams.get('boneefiedArt');
    if (Object.hasOwn(jointsAtlasCorrections, a.id)) {
      assert.equal(revision, 'joint-continuity-1');
      assert.notEqual(key, uri);
    } else if (a.id === 'asset-skeletal-atlas-pectoral-girdle') assert.equal(revision, 'skeletal-continuity-1');
    else assert.equal(key, uri);
  }
});
