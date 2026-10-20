import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { content } from '../content/canonical.ts';
import { bvis05Plates } from '../content/bvis05-plates.generated.ts';
import { repairDiagramTargets } from '../content/repair5-targets.ts';
import { anatomyImageCacheKey } from '../components/anatomyImageCacheKey.ts';

const module = content.modules.find(m => m.id === 'endocrine-system')!;
const ids = [...new Set(module.lessons!.flatMap(l => l.assetIds ?? []))];
test('six published endocrine plates retain all 45 targets and their natural source ratio', () => {
  assert.equal(ids.length, 6);
  assert.equal(ids.reduce((n, id) => n + content.assets.find(a => a.id === id)!.labels!.length, 0), 45);
  for (const id of ids) {
    const a = content.assets.find(a => a.id === id)!;
    assert.equal(a.imageAspectRatio, 1.45);
    assert.match(a.attributionLicense, /Original Boneefied/);
  }
});
test('whole-follicle target lies in the epithelial ring, separately from the cell target', () => {
  const p = bvis05Plates.find(p => p.key === 'thyroid-parathyroid')!;
  const l = p.labels.find(l => l.structureId === 'endo-thyroid-follicle')!;
  const r = Math.hypot(l.x * 1450 - 1185, l.y * 1000 - 290);
  assert.ok(r > 70 && r < 104, `follicle radius ${r}`);
  assert.deepEqual([l.x, l.y], [1125 / 1450, .215]);
  assert.notDeepEqual(l, p.labels.find(l => l.structureId === 'endo-follicular-cell'));
  assert.deepEqual(repairDiagramTargets(p.id, p.labels), p.labels);
});
test('body-map pancreas is below the adrenals and anterior to the upper kidneys', () => {
  const p = bvis05Plates.find(p => p.key === 'endocrine-body-map')!;
  const pancreas = p.labels.find(l => l.structureId === 'endo-pancreas')!;
  const adrenal = p.labels.find(l => l.structureId === 'endo-adrenal')!;
  assert.deepEqual([pancreas.x, pancreas.y], [.2524, .414]);
  assert.ok(pancreas.y > adrenal.y);
  assert.ok(pancreas.y < .432, 'pancreas remains above the right renal center');
});
test('all published endocrine asset and Practice points share the repaired geometry', () => {
  for (const id of ids) {
    const a = content.assets.find(a => a.id === id)!;
    const p = bvis05Plates.find(p => p.id === id)!;
    assert.deepEqual(a.labels!.map(l => [l.structureId, l.x, l.y]), p.labels.map(l => [l.structureId, l.x, l.y]));
    for (const h of a.hotspots!) {
      const l = a.labels!.find(l => l.structureId === h.structureId)!;
      assert.deepEqual([h.x, h.y], [l.x, l.y]);
    }
    for (const q of content.questions.filter(q => q.assetId === id)) {
      for (const h of q.hotspots ?? []) {
        const l = a.labels!.find(l => l.structureId === h.structureId)!;
        assert.deepEqual([h.x, h.y], [l.x, l.y], q.id);
      }
      if (q.taskType === 'image-identification') assert.equal(q.hotspots!.length, 1, q.id);
    }
  }
});
test('only the three repainted endocrine files acquire a new cache identity', () => {
  for (const name of ['36-endocrine-body-map', '37-hypothalamus-pituitary-axis', '40-pancreas-islet'])
    assert.match(anatomyImageCacheKey(`https://example.test/bvis05-${name}.png`), /endocrine-connections-1/);
  for (const name of ['38-thyroid-parathyroid', '39-adrenal-zones', '41-ovary-testis']) {
    const uri = `https://example.test/bvis05-${name}.png`;
    assert.equal(anatomyImageCacheKey(uri), uri);
  }
});
test('all endocrine source hashes remain synchronized with original local provenance', () => {
  const root = new URL('../', import.meta.url);
  const prov = JSON.parse(readFileSync(new URL('assets/images/anatomy/bvis05-atlas/provenance.json', root), 'utf8'));
  for (const id of ids) {
    const a = content.assets.find(a => a.id === id)!;
    const r = prov.plates.find((p: { id: string }) => p.id === id);
    const sha = createHash('sha256').update(readFileSync(new URL(a.localAssetPath, root))).digest('hex');
    assert.equal(sha, r.sha256.png);
    assert.deepEqual(r.featureAnchorMapping.map((l: { x: number; y: number }) => [l.x, l.y]), a.labels!.map(l => [l.x, l.y]));
  }
});
