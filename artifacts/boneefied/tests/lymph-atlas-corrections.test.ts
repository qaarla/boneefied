import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { content } from '../content/canonical.ts';
import { combinedAtlasAssetsForStructure } from '../content/atlas-index.ts';
import { bvis05Plates } from '../content/bvis05-plates.generated.ts';
import { repairDiagramTargets, repair5Targets } from '../content/repair5-targets.ts';
import { answerIsCorrect } from '../content/study.ts';
import { anatomyImageCacheKey } from '../components/anatomyImageCacheKey.ts';

const module = content.modules.find(m => m.id === 'lymphatic-system')!;
const ids = new Set([
  ...module.lessons!.flatMap(l => l.assetIds ?? []),
  ...content.questions.filter(q => q.moduleId === module.id).map(q => q.assetId).filter((id): id is string => !!id),
  ...content.structures.filter(s => s.moduleId === module.id).flatMap(s => combinedAtlasAssetsForStructure(s.id).map(a => a.id)),
]);
const assets = content.assets.filter(a => ids.has(a.id));
const root = new URL('../', import.meta.url);

test('published lymphatic lesson, glossary and question union is six plates and fifty targets', () => {
  assert.equal(ids.size, 6);
  assert.equal(assets.reduce((n, a) => n + a.labels!.length, 0), 50);
  for (const a of assets) {
    assert.equal(a.assetType, 'diagram');
    assert.equal(a.imageAspectRatio, 1.45);
    assert.match(a.attributionLicense, /Original Boneefied/);
    const png = readFileSync(new URL(a.localAssetPath!, root));
    assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [1450, 1000]);
  }
});
test('only three justified anchor repairs preserve canonical identities, radii and idempotency', () => {
  const repairs = Object.entries(repair5Targets).filter(([id]) => ids.has(id));
  assert.equal(repairs.reduce((n, [, list]) => n + list.length, 0), 3);
  for (const [id, list] of repairs) for (const r of list) {
    const point = { structureId: r.structureId, x: r.from[0], y: r.from[1], radius: .018 };
    const once = repairDiagramTargets(id, [point]);
    assert.deepEqual([once[0].x, once[0].y], r.to);
    assert.equal(once[0].structureId, point.structureId);
    assert.equal(once[0].radius, point.radius);
    assert.deepEqual(repairDiagramTargets(id, once), once);
  }
});
test('all fifty hotspot and six identification questions use the actual current source positions and grade their emitted IDs', () => {
  const qs = content.questions.filter(q => ids.has(q.assetId ?? ''));
  assert.equal(qs.length, 56);
  assert.equal(qs.filter(q => q.taskType === 'hotspot').length, 50);
  assert.equal(qs.filter(q => q.taskType === 'image-identification').length, 6);
  for (const q of qs) {
    const a = assets.find(a => a.id === q.assetId)!;
    assert.ok(answerIsCorrect(q.answer, q), q.id);
    for (const h of q.hotspots ?? [])
      assert.ok(a.labels!.some(l => l.structureId === h.structureId && l.x === h.x && l.y === h.y), `${q.id}:${h.structureId}`);
    if (q.taskType === 'hotspot') {
      const correct = q.hotspots!.filter(h => q.structureIds.includes(h.structureId));
      assert.ok(correct.length, q.id);
      for (const h of correct) assert.ok(answerIsCorrect(h.structureId, q), q.id);
    } else assert.equal(q.hotspots?.length, 1);
  }
});
test('source hashes, original rights, source dimensions and annotation order remain synchronized', () => {
  const prov = JSON.parse(readFileSync(new URL('assets/images/anatomy/bvis05-atlas/provenance.json', root), 'utf8'));
  for (const a of assets) {
    const p = bvis05Plates.find(p => p.id === a.id)!;
    const record = prov.plates.find((p: { id: string }) => p.id === a.id);
    assert.equal(createHash('sha256').update(readFileSync(new URL(a.localAssetPath!, root))).digest('hex'), record.sha256.png);
    assert.deepEqual(p.labels.map(l => [l.structureId, l.x, l.y]), a.labels!.map(l => [l.structureId, l.x, l.y]));
    assert.deepEqual(record.featureAnchorMapping.map((p: { structureId: string; x: number; y: number }) => [p.structureId, p.x, p.y]), a.labels!.map(l => [l.structureId, l.x, l.y]));
    const svg = readFileSync(new URL(p.svgPath, root), 'utf8');
    assert.doesNotMatch(svg, /NaN|Infinity/);
    if (a.id.endsWith('gut-lymphoid-lacteal')) {
      assert.match(svg, /M1155 654L/, 'lacteal arrowhead points down from its 640px origin toward the base');
      assert.doesNotMatch(svg, /M1155 626L/, 'the former arrow pointing into the blind tip must not return');
    }
  }
});
test('five corrected local rasters refresh without invalidating the unchanged spleen or other systems', () => {
  for (const a of assets) {
    const uri = `https://example.test/${a.localAssetPath}`;
    if (a.id.endsWith('spleen-pulp')) assert.equal(anatomyImageCacheKey(uri), uri);
    else assert.match(anatomyImageCacheKey(uri), /lymph-drainage-[12]/);
  }
  assert.doesNotMatch(anatomyImageCacheKey('https://example.test/bvis05-15-body-artery-vein-maps.png'), /lymph-drainage/);
});
test('lymphatic question controls use numbered targets and neutral read-only identification', () => {
  const practice = readFileSync(new URL('app/(tabs)/practice.tsx', root), 'utf8');
  assert.match(practice, /reviewedBvis05Plate[\s\S]{0,220}'lymphatic-system'/);
  assert.match(practice, /const imageIdMarker = .*reviewedBvis05Plate.*question.taskType === 'image-identification'/);
  assert.match(practice, /const readOnlyMarker = .*imageIdMarker/);
  assert.match(practice, /const canSelectTarget = question.taskType !== 'image-identification' && !readOnlyMarker/);
  const viewer = readFileSync(new URL('components/AnatomyImageViewer.tsx', root), 'utf8');
  assert.match(viewer, /\.\.\.lymphaticAssets/);
  assert.match(viewer, /viewerPanBounds\([^\n]+lymphaticAssets\.has/);
});
