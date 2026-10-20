import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { content } from '../content/canonical.ts';
import { combinedAtlasAssetsForStructure } from '../content/atlas-index.ts';
import { muscularAtlasCorrections, repairMuscularAtlasTargets } from '../content/muscular-atlas-corrections.ts';
import { repairDiagramTargets } from '../content/repair5-targets.ts';
import { anatomyImageCacheKey } from '../components/anatomyImageCacheKey.ts';
import { muscularPlates } from '../content/muscular-atlas-plates.generated.ts';

const module = content.modules.find(m => m.id === 'muscular-system')!;
const ids = new Set([
  ...module.lessons!.flatMap(l => l.assetIds ?? []),
  ...content.questions.filter(q => q.moduleId === module.id).flatMap(q => q.assetId ? [q.assetId] : []),
  ...content.structures.filter(s => s.moduleId === module.id).flatMap(s => combinedAtlasAssetsForStructure(s.id).map(a => a.id)),
]);
const assets = content.assets.filter(a => ids.has(a.id));
test('entire published muscular inventory includes all 20 original plates and the linked diaphragm/cavities context: 129 targets', () => {
  assert.equal(assets.length, 21);
  assert.equal(assets.reduce((n, a) => n + (a.labels ?? a.hotspots ?? []).length, 0), 129);
  assert.ok(ids.has('asset-atlas-body-cavities'));
  for (const p of muscularPlates) assert.ok(ids.has(p.id), p.id);
});
test('eleven view-specific endpoint changes reach Learn, raw glossary and question hotspots without identity/order/radius drift', () => {
  assert.equal(Object.values(muscularAtlasCorrections).flat().length, 11);
  for (const [id, changes] of Object.entries(muscularAtlasCorrections)) {
    const a = assets.find(a => a.id === id)!;
    for (const c of changes) {
      const points = [...a.labels ?? [], ...a.hotspots ?? [],
        ...content.questions.filter(q => q.assetId === id).flatMap(q => q.hotspots ?? [])]
        .filter(p => p.structureId === c.structureId);
      assert.ok(points.length);
      for (const p of points) assert.deepEqual([p.x, p.y], c.to);
      const old = [{ structureId: c.structureId, x: c.from[0], y: c.from[1], radius: .027 }];
      const next = repairDiagramTargets(id, old);
      assert.deepEqual(next[0], { ...old[0], x: c.to[0], y: c.to[1] });
      assert.deepEqual([old[0].x, old[0].y], c.from);
      assert.equal(repairMuscularAtlasTargets(id, next), next);
    }
  }
});
test('all muscular source SVG paths are finite, raster proportions are intrinsic, and all 21 images stay locally bundled', () => {
  const resolver = fs.readFileSync('content/imageSources.ts', 'utf8');
  for (const a of assets) {
    const png = fs.readFileSync(a.localAssetPath!);
    assert.ok(Math.abs(png.readUInt32BE(16) / png.readUInt32BE(20) - a.imageAspectRatio!) < .00001, a.id);
    assert.ok(resolver.includes(`'${a.id}': require(`), a.id);
  }
  for (const p of muscularPlates) assert.doesNotMatch(fs.readFileSync(p.svgPath, 'utf8'), /\b(?:NaN|Infinity)\b/, p.id);
});
test('only fourteen pixel-changed muscular PNGs get a fresh preview key; six unchanged muscular and all prior revisions remain accessible', () => {
  const changed = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 16]);
  muscularPlates.forEach((p, i) => {
    const uri = `https://example.test/assets/?unstable_path=${encodeURIComponent(p.pngPath)}`;
    assert.equal(new URL(anatomyImageCacheKey(uri)).searchParams.get('boneefiedArt'), changed.has(i + 1) ? 'muscle-contours-1' : null);
  });
  assert.match(anatomyImageCacheKey('https://example.test/skeletal-atlas-20-synovial-joint.png'), /joint-continuity-1/);
  assert.match(anatomyImageCacheKey('https://example.test/skeletal-atlas-08-atlas-axis.png'), /skeletal-continuity-1/);
});
