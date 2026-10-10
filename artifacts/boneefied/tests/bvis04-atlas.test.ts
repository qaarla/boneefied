import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { content } from '../content/canonical.ts';
import { bvis04Plates } from '../content/bvis04-plates.generated.ts';
import { bvis04Assets, BVIS04_MODULES, BVIS04_SOURCE, isBvis04AssetId } from '../content/bvis04-pack.ts';
import { bvis04QuestionCopy } from '../content/bvis04-questions.ts';
import { bvis04FunctionCopy } from '../content/bvis04-functions.ts';
import { answerIsCorrect } from '../content/study.ts';
import { requireSpanishQuestion, spanishResponseForScoring } from '../locales/es/index.ts';
import { spreadAtlasCallouts, hasMarkerOverlap } from '../components/viewerMarkerLayout.ts';
const root = path.resolve(import.meta.dirname, '..');

test('BVIS04 diagrams use canonical IDs, local originals, unbaked labels and valid matching targets', () => {
  assert.ok(bvis04Plates.length >= 28);
  const proof = JSON.parse(fs.readFileSync(path.join(root, 'assets/images/anatomy/bvis04-atlas/provenance.json'), 'utf8'));
  assert.equal(proof.plates.length, bvis04Plates.length);
  const ids = new Set(content.structures.map((s) => s.id));
  for (const p of bvis04Plates) {
    const a = content.assets.find((a) => a.id === p.id)!;
    assert.equal(a.sourceId, BVIS04_SOURCE);
    assert.equal(a.assetType, 'diagram');
    assert.equal(a.labelStatus, 'unlabeled');
    assert.equal(a.imageAspectRatio, 1.45);
    assert.ok(!a.sourceUrl && !a.rightsUrl, 'original art must not inherit third-party license URLs');
    assert.ok(!/<text\b|<image\b|<filter\b|gradient/i.test(fs.readFileSync(path.join(root, p.svgPath), 'utf8')));
    const png = fs.readFileSync(path.join(root, p.pngPath));
    assert.equal(png.readUInt32BE(16), 1450);
    assert.equal(png.readUInt32BE(20), 1000);
    const provenance = proof.plates.find((r: { id: string }) => r.id === p.id);
    assert.ok(provenance, p.id);
    assert.equal(createHash('sha256').update(png).digest('hex'), provenance.sha256.png, `${p.id}: PNG provenance`);
    assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root, p.svgPath))).digest('hex'), provenance.sha256.svg, `${p.id}: SVG provenance`);
    assert.equal(new Set(p.labels.map((l) => `${l.structureId}:${l.panel}`)).size, p.labels.length, 'a structure may be labelled in different comparison panels');
    for (const l of p.labels) {
      assert.ok(ids.has(l.structureId), l.structureId);
      assert.ok(l.x > 0 && l.x < 1 && l.y > 0 && l.y < 1);
      assert.ok(a.hotspots?.some((h) => h.structureId === l.structureId && h.x === l.x && h.y === l.y));
    }
  }
});
test('all BVIS04 plates are accessible in lessons and useful questions; no legacy gross collage remains', () => {
  for (const p of bvis04Plates) {
    const m = content.modules.find((m) => m.id === p.moduleId)!;
    assert.ok(m.lessons?.some((l) => l.assetIds?.includes(p.id)), p.id);
    assert.ok(content.questions.some((q) => q.assetId === p.id), p.id);
  }
  for (const m of content.modules.filter((m) => BVIS04_MODULES.includes(m.id))) {
    for (const id of new Set(m.lessons?.flatMap((l) => l.assetIds ?? []))) {
      const a = content.assets.find((a) => a.id === id)!;
      assert.ok(isBvis04AssetId(id) || a.assetType === 'histology' || id === 'asset-original-cell-overview', id);
    }
  }
});
test('BVIS04 hotspots offer a genuine choice and all English/Spanish new answers score correctly', () => {
  for (const { q } of [...bvis04QuestionCopy, ...bvis04FunctionCopy]) {
    const a = bvis04Assets.find((a) => a.id === q.assetId)!;
    const translated = requireSpanishQuestion(q);
    assert.ok(translated.prompt && translated.explanation);
    assert.ok(answerIsCorrect(q.answer, q));
    assert.ok(answerIsCorrect(spanishResponseForScoring(q, translated.answer as string), q));
    if (q.taskType === 'hotspot') {
      assert.ok(q.hotspots!.length >= 2, q.id);
      const wrong = q.hotspots!.find((h) => h.structureId !== q.structureIds[0])!;
      assert.equal(answerIsCorrect(wrong.structureId, q), false);
    } else assert.equal(q.hotspots!.length, 1, q.id);
    for (const h of q.hotspots!) {
      assert.ok(a.labels!.some((l) => l.structureId === h.structureId && l.x === h.x && l.y === h.y), q.id);
    }
    if (q.taskType === 'function-relationship') {
      assert.equal(q.options!.length, 4);
      for (let i = 0; i < q.options!.length; i++) {
        assert.equal(answerIsCorrect(spanishResponseForScoring(q, translated.options![i]), q), q.options![i] === q.answer);
      }
    }
  }
});
test('dense BVIS04 numbered controls stay disjoint at phone width and enlarged text', () => {
  for (const p of bvis04Plates) for (const width of [273, 343]) for (const size of [44, 60]) {
    const height = Math.max(width / 1.45, Math.ceil(p.labels.length / 2) * (size + 8));
    const centers = spreadAtlasCallouts(p.labels.map((l) => ({ x: l.x * width, y: l.y * height })), width, height, size, size);
    const boxes = centers.map((c) => ({ left: c.x - size / 2, top: c.y - size / 2, width: size, height: size }));
    assert.equal(hasMarkerOverlap(boxes), false, p.id);
    for (const b of boxes) assert.ok(b.left >= 0 && b.top >= 0 && b.left + size <= width && b.top + size <= height);
  }
});
test('real histology remains specimen-only; schematic questions are not disguised microscopy', () => {
  const evidence = JSON.parse(fs.readFileSync(path.join(root, 'docs/atlas/BVIS04_SPECIMEN_LICENSES.json'), 'utf8'));
  assert.equal(evidence.licenses.length, 4);
  for (const p of bvis04Plates.filter((p) => p.teachingKind === 'tissue-schematic')) {
    assert.equal(content.assets.find((a) => a.id === p.id)!.assetType, 'diagram');
  }
  for (const id of ['asset-commons-simple-squamous-epithelium', 'asset-commons-simple-cuboidal-epithelium', 'asset-commons-simple-columnar-epithelium', 'asset-openstax-spinal-cord-specimen']) {
    const a = content.assets.find((a) => a.id === id)!;
    assert.equal(a.assetType, 'histology');
    assert.ok(evidence.licenses.some((e: { sourceUrl: string }) => e.sourceUrl === a.sourceUrl));
    assert.ok(a.sourceUrl && a.rightsUrl && fs.existsSync(path.join(root, a.localAssetPath!)));
    const record = evidence.licenses.find((e: { assetId: string }) => e.assetId === id);
    const bytes = fs.readFileSync(path.join(root, a.localAssetPath!));
    assert.equal(bytes.length, record.byteSize, `${id}: unchanged specimen bytes`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256, `${id}: unchanged specimen hash`);
    assert.ok(content.questions.filter((q) => q.id.startsWith('q-bvis04-')).every((q) => q.assetId !== id), 'new schematic questions do not masquerade as specimen questions');
  }
  assert.equal(content.questions.find((q) => q.id === 'q-practical-spinal-cord-specimen')?.assetId, 'asset-openstax-spinal-cord-specimen');
});
