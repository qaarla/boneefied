import test from 'node:test';
import assert from 'node:assert/strict';
import { content } from '../content/canonical.ts';
import { repairSensesAtlasTargets, sensesDetailTransforms } from '../content/senses-atlas-corrections.ts';
import { anatomyImageCacheKey } from '../components/anatomyImageCacheKey.ts';
import { bvis04Plates } from '../content/bvis04-plates.generated.ts';

const module = content.modules.find(m => m.id === 'special-senses')!;
const ids = [...new Set(module.lessons!.flatMap(l => l.assetIds ?? []))];
test('all nine published Special Senses diagrams retain 73 targets and natural aspect', () => {
  assert.equal(ids.length, 9);
  assert.equal(ids.reduce((n, id) => n + content.assets.find(a => a.id === id)!.labels!.length, 0), 73);
  for (const id of ids) {
    const a = content.assets.find(a => a.id === id)!;
    assert.equal(a.imageAspectRatio, 1.45);
    assert.match(a.attributionLicense, /Original Boneefied/);
  }
});
test('both existing detail drawings and generated metadata use their repaired target geometry', () => {
  for (const id of Object.keys(sensesDetailTransforms)) {
    const a = content.assets.find(a => a.id === id)!;
    const p = bvis04Plates.find(p => p.id === id)!;
    assert.deepEqual(p.labels.map(l => [l.structureId, l.x, l.y]), a.labels!.map(l => [l.structureId, l.x, l.y]));
    assert.deepEqual(repairSensesAtlasTargets(id, a.labels!), a.labels);
    for (const l of a.labels!) {
      assert.ok(l.x > .03 && l.x < .97 && l.y > .03 && l.y < .97, l.structureId);
      const h = a.hotspots!.find(h => h.structureId === l.structureId)!;
      assert.deepEqual([h.x, h.y], [l.x, l.y]);
    }
  }
});
test('detail question targets track the same repaired organ as their legend, without changing answers', () => {
  for (const q of content.questions.filter(q => q.assetId && Object.hasOwn(sensesDetailTransforms, q.assetId))) {
    const a = content.assets.find(a => a.id === q.assetId)!;
    for (const h of q.hotspots ?? []) {
      const l = a.labels!.find(l => l.structureId === h.structureId)!;
      assert.ok(l, `${q.id}: ${h.structureId}`);
      assert.deepEqual([h.x, h.y], [l.x, l.y], q.id);
    }
  }
});
test('repairs are immutable, idempotent and restricted to the two detail assets', () => {
  const p = [{ structureId: 'malleus-ear', x: .9, y: .9 }];
  assert.equal(repairSensesAtlasTargets('other-ear-view', p), p);
  const fixed = repairSensesAtlasTargets('asset-bvis04-middle-ear', p);
  assert.deepEqual(p[0], { structureId: 'malleus-ear', x: .9, y: .9 });
  assert.deepEqual(repairSensesAtlasTargets('asset-bvis04-middle-ear', fixed), fixed);
  const tube = content.assets.find(a => a.id === 'asset-bvis04-middle-ear')!.labels!.find(l => l.structureId === 'auditory-tube-ear')!;
  assert.ok(tube.y < .8, 'tube is no longer an edge fragment at y=.96');
  const stapes = content.assets.find(a => a.id === 'asset-bvis04-middle-ear')!.labels!.find(l => l.structureId === 'stapes-ear')!;
  const t = sensesDetailTransforms['asset-bvis04-middle-ear'];
  const x = (stapes.x * 1450 - t.x) / t.scale;
  const y = (stapes.y * 1000 - t.y) / t.scale;
  // The lower stapes limb is a quadratic from (586,484) via (598,504) to (621,481).
  // Check the visible narrow bone, not only the deliberately padded ID mask.
  const u = (-24 + Math.sqrt(24 ** 2 + 44 * (x - 586))) / 22;
  assert.ok(Math.abs(y - (484 + 40 * u - 43 * u ** 2)) < 1);
});
test('only two revised Special Senses images change cache identity; other offline keys remain', () => {
  for (const file of ['14-eye-anterior-segment', '18-middle-ear'])
    assert.match(anatomyImageCacheKey(`https://example.test/bvis04-${file}.png`), /senses-detail-fit-1/);
  for (const file of ['13-eye-section', '15-retina-layers', '16-optic-disc', '17-ear-section', '19-inner-ear-vestibular', '20-cochlea-corti', '21-smell-taste']) {
    const uri = `https://example.test/bvis04-${file}.png`;
    assert.equal(anatomyImageCacheKey(uri), uri);
  }
});
