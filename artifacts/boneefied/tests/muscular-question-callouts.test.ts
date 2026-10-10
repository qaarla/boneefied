import test from 'node:test';
import assert from 'node:assert/strict';
import { content } from '../content/canonical.ts';
import { isMuscularAtlasAssetId } from '../content/muscular-atlas-pack.ts';
import { combinedAtlasAssetsForStructure } from '../content/atlas-index.ts';
import { hasMarkerOverlap, spreadAtlasCallouts } from '../components/viewerMarkerLayout.ts';
import { optionsForQuestion } from '../components/questionInputPolicy.ts';

test('muscular targets remain anatomically anchored while 44/60px controls stay separated', () => {
  const questions = content.questions.filter((q) => q.assetId && isMuscularAtlasAssetId(q.assetId)
    && (q.taskType === 'hotspot' || q.id.startsWith('q-muscular-atlas-')));
  assert.ok(questions.length > 20);
  for (const q of questions) {
    const asset = content.assets.find((a) => a.id === q.assetId)!;
    const targets = q.hotspots ?? asset.hotspots ?? [];
    assert.ok(targets.length > 0, q.id);
    for (const target of targets) {
      const label = asset.labels?.find((l) => l.structureId === target.structureId);
      assert.ok(label, `${q.id}: ${target.structureId}`);
      assert.equal(target.x, label.x, q.id);
      assert.equal(target.y, label.y, q.id);
    }
    if (q.id.startsWith('q-muscular-atlas-') && q.taskType !== 'hotspot') {
      assert.equal(targets.length, 1, `${q.id}: read-only marker must be unambiguous`);
      assert.equal(targets[0].structureId, q.structureIds[0]);
    }
    for (const width of [232, 276, 346]) for (const size of [44, 60]) {
      const columns = Math.max(1, Math.floor(width / (size + 8)));
      const height = Math.max(width / 1.45, Math.ceil(targets.length / Math.min(columns, 2)) * (size + 8));
      const ratio = asset.imageAspectRatio ?? 1.45;
      const cw = Math.min(1, ratio / (width / height));
      const ch = Math.min(1, (width / height) / ratio);
      const anchors = targets.map((p) => ({ x: ((1 - cw) / 2 + p.x * cw) * width, y: ((1 - ch) / 2 + p.y * ch) * height }));
      const before = JSON.stringify(anchors);
      const callouts = spreadAtlasCallouts(anchors, width, height, size, size);
      assert.equal(JSON.stringify(anchors), before);
      const boxes = callouts.map((p) => ({ left: p.x - size / 2, top: p.y - size / 2, width: size, height: size }));
      assert.equal(hasMarkerOverlap(boxes), false, q.id);
      for (const b of boxes) {
        assert.ok(b.left >= 0 && b.top >= 0 && b.left + size <= width && b.top + size <= height, q.id);
        for (const p of anchors) assert.ok(!(p.x > b.left && p.x < b.left + size && p.y > b.top && p.y < b.top + size), q.id);
      }
    }
  }
});

test('requested muscular glossary entries have original regional atlas plates', () => {
  for (const id of ['sternocleidomastoid', 'sartorius', 'rectus-femoris', 'semitendinosus',
    'semimembranosus', 'soleus', 'diaphragm', 'subscapularis', 'flexor-carpi-radialis']) {
    assert.ok(combinedAtlasAssetsForStructure(id).some((a) => isMuscularAtlasAssetId(a.id)), id);
  }
});

test('typed image IDs and legacy hotspots do not treat string answers as choice arrays', () => {
  for (const q of content.questions) assert.ok(Array.isArray(optionsForQuestion(q)), q.id);
  for (const id of ['q-muscular-atlas-ident-scm', 'q-muscular-atlas-ident-subscapularis',
    'q-muscular-atlas-ident-vastus-intermedius', 'q-muscle-visual-sartorius']) {
    assert.deepEqual(optionsForQuestion(content.questions.find((q) => q.id === id)!), [], id);
  }
  const action = content.questions.find((q) => q.id === 'q-muscular-atlas-action-sartorius')!;
  assert.equal(optionsForQuestion(action), action.options, 'choice order and canonical option values must stay unchanged');
});
