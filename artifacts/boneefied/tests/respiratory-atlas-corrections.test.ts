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

const mod = content.modules.find(m => m.id === 'respiratory-system')!;
const ids = new Set([
  ...mod.lessons!.flatMap(l => l.assetIds ?? []),
  ...content.questions.filter(q => q.moduleId === mod.id).map(q => q.assetId).filter((id): id is string => !!id),
  ...content.structures.filter(s => s.moduleId === mod.id).flatMap(s => combinedAtlasAssetsForStructure(s.id).map(a => a.id)),
]);
const assets = content.assets.filter(a => ids.has(a.id));
const root = new URL('../', import.meta.url);

test('respiratory union retains seven original diagrams, real histology and all 82 targets', () => {
  assert.equal(assets.length, 8);
  assert.equal(assets.reduce((n, a) => n + (a.labels?.length ?? 0), 0), 82);
  for (const a of assets.filter(a => a.id.startsWith('asset-bvis05-'))) {
    assert.equal(a.imageAspectRatio, 1.45);
    assert.match(a.attributionLicense, /Original Boneefied/);
    const bytes = readFileSync(new URL(a.localAssetPath!, root));
    assert.deepEqual([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], [1450, 1000]);
  }
  const specimen = assets.find(a => a.id === 'asset-commons-alveolar-sac')!;
  assert.equal(specimen.assetType, 'histology');
  assert.equal(specimen.labels?.length ?? 0, 0);
  assert.match(specimen.attributionLicense, /CC BY-SA/);
});

test('two membrane endpoint repairs are idempotent and preserve target identity', () => {
  const repairs = Object.entries(repair5Targets).filter(([id]) => ids.has(id));
  assert.equal(repairs.reduce((n, [, list]) => n + list.length, 0), 2);
  for (const [id, list] of repairs) for (const r of list) {
    const input = [{ structureId: r.structureId, x: r.from[0], y: r.from[1], radius: .018 }];
    const once = repairDiagramTargets(id, input)!;
    assert.deepEqual([once[0].x, once[0].y], r.to);
    assert.equal(once[0].structureId, input[0].structureId);
    assert.equal(once[0].radius, .018);
    assert.deepEqual(repairDiagramTargets(id, once), once);
  }
});

test('75 questions retain real source geometry and accept the IDs emitted by hotspot taps', () => {
  const qs = content.questions.filter(q => ids.has(q.assetId ?? ''));
  assert.equal(qs.length, 75);
  assert.equal(qs.filter(q => q.taskType === 'hotspot').length, 67);
  assert.equal(qs.filter(q => q.taskType === 'image-identification').length, 7);
  assert.equal(qs.filter(q => q.taskType === 'histology-identification').length, 1);
  for (const q of qs) {
    assert.ok(answerIsCorrect(q.answer, q), q.id);
    const a = assets.find(a => a.id === q.assetId)!;
    for (const h of q.hotspots ?? []) assert.ok(a.labels?.some(l => l.structureId === h.structureId && l.x === h.x && l.y === h.y), q.id);
    if (q.taskType === 'hotspot') {
      const targets = q.hotspots!.filter(h => q.structureIds.includes(h.structureId));
      assert.ok(targets.length, q.id);
      for (const h of targets) assert.ok(answerIsCorrect(h.structureId, q), q.id);
    }
  }
  assert.equal(qs.find(q => q.id === 'q-visual-respiratory-trachea')!.answer, 'Trachea');
});

test('all respiratory source hashes, annotation order and provenance stay synchronized', () => {
  const prov = JSON.parse(readFileSync(new URL('assets/images/anatomy/bvis05-atlas/provenance.json', root), 'utf8'));
  for (const a of assets.filter(a => a.id.startsWith('asset-bvis05-'))) {
    const plate = bvis05Plates.find(p => p.id === a.id)!;
    const record = prov.plates.find((p: { id: string }) => p.id === a.id);
    assert.equal(createHash('sha256').update(readFileSync(new URL(a.localAssetPath!, root))).digest('hex'), record.sha256.png);
    assert.deepEqual(plate.labels.map(l => [l.structureId, l.x, l.y]), a.labels!.map(l => [l.structureId, l.x, l.y]));
    assert.deepEqual(record.featureAnchorMapping.map((p: { structureId: string; x: number; y: number }) => [p.structureId, p.x, p.y]), a.labels!.map(l => [l.structureId, l.x, l.y]));
    assert.doesNotMatch(readFileSync(new URL(plate.svgPath, root), 'utf8'), /NaN|Infinity/);
  }
});

test('only five repainted rasters refresh; unchanged diagrams and specimen retain cache identity', () => {
  for (const a of assets) {
    const uri = `https://example.test/${a.localAssetPath}`;
    if (/lung-lobes|alveolar-unit|commons-alveolar/.test(uri)) assert.equal(anatomyImageCacheKey(uri), uri);
    else assert.match(anatomyImageCacheKey(uri), /resp-airways-1/);
  }
});

test('respiratory questions use numbered targets and neutral identification without answer shortcuts', () => {
  const practice = readFileSync(new URL('app/(tabs)/practice.tsx', root), 'utf8');
  assert.match(practice, /const reviewedBvis05Plate[^\n]+'respiratory-system'/);
  assert.match(practice, /const imageIdMarker = .*reviewedBvis05Plate.*question.taskType === 'image-identification'/);
  assert.match(practice, /const canSelectTarget = question.taskType !== 'image-identification' && !readOnlyMarker/);
  const viewer = readFileSync(new URL('components/AnatomyImageViewer.tsx', root), 'utf8');
  assert.match(viewer, /\.\.\.respiratoryAssets/);
  assert.match(viewer, /viewerPanBounds\([^\n]+respiratoryAssets\.has/);
});
