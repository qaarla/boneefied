import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { content } from '../content/canonical.ts';
import { bvis05Plates } from '../content/bvis05-plates.generated.ts';
import { anatomyImageCacheKey } from '../components/anatomyImageCacheKey.ts';
import { repairDiagramTargets, repair5Targets } from '../content/repair5-targets.ts';
import { answerIsCorrect } from '../content/study.ts';
import { combinedAtlasAssetsForStructure } from '../content/atlas-index.ts';

const module = content.modules.find(m => m.id === 'blood-vessels')!;
const ids = [...new Set([
  ...module.lessons!.flatMap(l => l.assetIds ?? []),
  ...content.questions.filter(q => q.moduleId === module.id).map(q => q.assetId).filter((id): id is string => !!id),
])];
const assets = content.assets.filter(a => ids.includes(a.id));
const asset = (key: string) => assets.find(a => a.id === `asset-bvis05-${key}`)!;
const point = (key: string, id: string) => asset(key).labels!.find(l => l.structureId === id)!;
const root = new URL('../', import.meta.url);

test('exact published vessel group retains eleven plates and 93 targets', () => {
  assert.equal(ids.length, 11);
  const structures = content.structures.filter(s => s.moduleId === module.id);
  assert.equal(structures.length, 45);
  assert.deepEqual(new Set(structures.flatMap(s => combinedAtlasAssetsForStructure(s.id).map(a => a.id))), new Set(ids), 'all glossary-linked plates belong to the same inspected eleven');
  assert.equal(assets.reduce((n, a) => n + a.labels!.length, 0), 93);
  for (const a of assets) {
    assert.equal(a.imageAspectRatio, 1.45);
    assert.match(a.attributionLicense, /Original Boneefied/);
    assert.equal(a.assetType, 'diagram');
  }
});
test('dense arterial and venous routes retain distinct canonical endpoints', () => {
  for (const key of ['body-artery-vein-maps', 'upper-limb-arteries']) {
    assert.ok(point(key, 'ves-radial').x < point(key, 'ves-ulnar').x);
    assert.ok(point(key, 'ves-internal-carotid').x < point(key, 'ves-external-carotid').x);
  }
  assert.ok(point('head-neck-vessels', 'ves-jugular').x < point('head-neck-vessels', 'ves-internal-jugular').x);
  assert.ok(point('celiac-renal-context', 'ves-renal-artery').y < point('celiac-renal-context', 'ves-vein').y);
});
test('celiac and hepatic outflow markers name their actual distinct vessels', () => {
  assert.deepEqual([point('celiac-renal-context', 'ves-celiac-trunk').x, point('celiac-renal-context', 'ves-celiac-trunk').y], [785 / 1450, .335]);
  const hepatic = asset('hepatic-portal-system').labels!.filter(l => l.structureId === 'ves-hepatic-vein');
  assert.deepEqual(hepatic.map(l => [l.x, l.y]), [[492 / 1450, .302], [1060 / 1450, .24]]);
  assert.ok(hepatic.every(l => !(Math.abs(l.x * 1450 - 1185) < 40 && Math.abs(l.y * 1000 - 500) < 40)));
});
test('all 21 necessary coordinate changes are idempotent and preserve structure identities', () => {
  const repairs = Object.entries(repair5Targets).filter(([id]) => ids.includes(id));
  assert.equal(repairs.reduce((n, [, list]) => n + list.length, 0), 21);
  for (const [id, list] of repairs) for (const r of list) {
    const p = { structureId: r.structureId, x: r.from[0], y: r.from[1], radius: .018 };
    const once = repairDiagramTargets(id, [p]);
    assert.deepEqual([once[0].x, once[0].y], r.to);
    assert.equal(once[0].radius, p.radius);
    assert.deepEqual(repairDiagramTargets(id, once), once);
  }
});
test('all 56 vessel visual questions retain geometry and accept correct actual hotspot IDs', () => {
  const qs = content.questions.filter(q => ids.includes(q.assetId ?? ''));
  assert.equal(qs.length, 56);
  assert.equal(qs.filter(q => q.taskType === 'hotspot').length, 45);
  assert.equal(qs.filter(q => q.taskType === 'image-identification').length, 11);
  for (const q of qs) {
    const a = assets.find(a => a.id === q.assetId)!;
    assert.ok(answerIsCorrect(q.answer, q), q.id);
    for (const h of q.hotspots ?? [])
      assert.ok(a.labels!.some(l => l.structureId === h.structureId && l.x === h.x && l.y === h.y), `${q.id}:${h.structureId}`);
    if (q.taskType === 'hotspot') {
      const correct = q.hotspots!.filter(h => q.structureIds.includes(h.structureId));
      assert.ok(correct.length > 0, q.id);
      for (const h of correct) assert.ok(answerIsCorrect(h.structureId, q), `${q.id}:${h.structureId}`);
    }
    if (q.taskType === 'image-identification') assert.equal(q.hotspots!.length, 1);
  }
});
test('all local sources, generated annotations and rights/provenance remain synchronized', () => {
  const prov = JSON.parse(readFileSync(new URL('assets/images/anatomy/bvis05-atlas/provenance.json', root), 'utf8'));
  for (const a of assets) {
    const p = bvis05Plates.find(p => p.id === a.id)!;
    const r = prov.plates.find((r: { id: string }) => r.id === a.id);
    assert.equal(createHash('sha256').update(readFileSync(new URL(a.localAssetPath, root))).digest('hex'), r.sha256.png);
    assert.deepEqual(a.labels!.map(l => [l.structureId, l.x, l.y]), p.labels.map(l => [l.structureId, l.x, l.y]));
    assert.deepEqual(r.featureAnchorMapping.map((l: { x: number; y: number }) => [l.x, l.y]), a.labels!.map(l => [l.x, l.y]));
  }
});
test('only the nine corrected vessel rasters get a new offline cache identity', () => {
  for (const a of assets) {
    const uri = `https://example.test/${a.localAssetPath}`;
    if (['capillary-types', 'lower-limb-arteries'].some(k => a.id.endsWith(k))) assert.equal(anatomyImageCacheKey(uri), uri);
    else assert.match(anatomyImageCacheKey(uri), /vessels-routes-1/);
  }
});
