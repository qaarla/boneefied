import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { content } from '../content/canonical.ts';
import { bvis05Plates } from '../content/bvis05-plates.generated.ts';
import { anatomyImageCacheKey } from '../components/anatomyImageCacheKey.ts';
import { answerIsCorrect } from '../content/study.ts';

const module = content.modules.find(m => m.id === 'cardiovascular-system')!;
const ids = [...new Set(module.lessons!.flatMap(l => l.assetIds ?? []))];
const asset = (key: string) => content.assets.find(a => a.id === `asset-bvis05-${key}`)!;
const point = (key: string, id: string) => asset(key).labels!.find(l => l.structureId === id)!;

test('all eleven published cardiovascular plates retain 108 targets and natural proportions', () => {
  assert.equal(ids.length, 11);
  assert.equal(ids.reduce((n, id) => n + content.assets.find(a => a.id === id)!.labels!.length, 0), 108);
  for (const id of ids) {
    const a = content.assets.find(a => a.id === id)!;
    assert.equal(a.imageAspectRatio, 1.45);
    assert.equal(a.assetType, 'diagram');
    assert.match(a.attributionLicense, /Original Boneefied/);
  }
});
test('frontal and superior chamber and valve sidedness remains patient-right at viewer-left', () => {
  for (const key of ['heart-anterior', 'heart-chambers-valves']) {
    assert.ok(point(key, 'cv-right-ventricle').x < point(key, 'cv-left-ventricle').x);
  }
  assert.ok(point('heart-chambers-valves', 'cv-right-atrium').x < point('heart-chambers-valves', 'cv-left-atrium').x);
  for (const key of ['heart-chambers-valves', 'heart-valves-superior'])
    assert.ok(point(key, 'cv-tricuspid').x < point(key, 'cv-mitral').x);
  assert.ok(point('heart-valves-superior', 'cv-pulmonary-valve').y < point('heart-valves-superior', 'cv-aortic-valve').y);
});
test('composition erythrocyte target lies on the resized cell rim, not its pallor or former oversized footprint', () => {
  const p = point('blood-composition', 'cv-blood-erythrocyte');
  assert.deepEqual([p.x, p.y], [920 / 1450, .315]);
  const dx = p.x * 1450 - 960, dy = p.y * 1000 - 280;
  assert.ok((dx / 70) ** 2 + (dy / (70 * .94)) ** 2 < 1);
  assert.ok((dx / (70 * .42)) ** 2 + (dy / (70 * .38)) ** 2 > 1);
});
test('posterior RCA target follows its repaired posterior AV-margin course', () => {
  const p = point('coronary-posterior', 'cv-right-coronary');
  assert.deepEqual([p.x, p.y], [.5407, .616]);
  assert.ok(point('coronary-posterior', 'cv-svc').x > .6, 'posterior view retains patient right at viewer right');
});
test('all four blood views retain explicit schematic rather than specimen descriptions', () => {
  for (const key of ['blood-composition', 'blood-smear-schematic', 'leukocyte-types', 'marrow-hematopoiesis']) {
    const p = bvis05Plates.find(p => p.key === key)!;
    assert.equal(p.teachingKind, 'tissue-schematic');
    assert.match(p.description[0], /schematic/i);
    assert.match(p.description[0], /not (a photograph|specimen images|a photomicrograph|a section of real marrow)/i);
  }
});
test('all asset and Practice targets match the same canonical plate, including repeated structures in separate marrow panels', () => {
  for (const id of ids) {
    const a = content.assets.find(a => a.id === id)!;
    const p = bvis05Plates.find(p => p.id === id)!;
    assert.deepEqual(a.labels!.map(l => [l.structureId, l.x, l.y]), p.labels.map(l => [l.structureId, l.x, l.y]));
    for (const h of [...(a.hotspots ?? []), ...content.questions.filter(q => q.assetId === id).flatMap(q => q.hotspots ?? [])])
      assert.ok(a.labels!.some(l => l.structureId === h.structureId && l.x === h.x && l.y === h.y), `${id}:${h.structureId}`);
    for (const q of content.questions.filter(q => q.assetId === id && q.taskType === 'image-identification'))
      assert.equal(q.hotspots!.length, 1, q.id);
  }
});
test('only the five repainted cardiovascular rasters acquire the scoped cache identity', () => {
  const revised = ['03-heart-valves-superior', '05-coronary-anterior', '06-coronary-posterior', '08-blood-composition', '11-marrow-hematopoiesis'];
  for (const name of revised)
    assert.match(anatomyImageCacheKey(`https://example.test/bvis05-${name}.png`), /cardiovascular-geometry-1/);
  for (const name of ['01-heart-anterior', '02-heart-chambers-valves', '04-heart-wall-pericardium', '07-conduction-system', '09-blood-smear-schematic', '10-leukocyte-types']) {
    const uri = `https://example.test/bvis05-${name}.png`;
    assert.equal(anatomyImageCacheKey(uri), uri);
  }
});
test('all eleven local files and source-region anchors match their preserved provenance', () => {
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
test('every published cardiovascular visual question accepts its canonical answer and each correct tap, including legacy aorta', () => {
  const questions = content.questions.filter(q => ids.includes(q.assetId ?? ''));
  assert.equal(questions.length, 86);
  for (const q of questions) {
    assert.ok(answerIsCorrect(q.answer, q), q.id);
    if (q.taskType === 'hotspot') {
      const correct = q.hotspots!.filter(h => q.structureIds.includes(h.structureId));
      assert.ok(correct.length > 0, q.id);
      for (const h of correct) assert.ok(answerIsCorrect(h.structureId, q), `${q.id}:${h.structureId}`);
    }
  }
  assert.equal(content.questions.find(q => q.id === 'q-visual-heart-aorta')!.answer, 'Ascending aorta');
});
