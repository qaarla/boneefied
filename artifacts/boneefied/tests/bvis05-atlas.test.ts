import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { content } from '../content/canonical.ts';
import { bvis05Plates } from '../content/bvis05-plates.generated.ts';
import { bvis05Questions } from '../content/bvis05-questions.ts';
import { BVIS05_MODULES, BVIS05_SOURCE, isBvis05AssetId } from '../content/bvis05-pack.ts';
import { answerIsCorrect } from '../content/study.ts';
import { requireSpanishQuestion, spanishResponseForScoring } from '../locales/es/index.ts';
import { annotationKey, spreadAtlasCallouts, hasMarkerOverlap } from '../components/viewerMarkerLayout.ts';
const root = path.resolve(import.meta.dirname, '..');

test('BVIS05 local originals have honest provenance, canonical targets and useful lesson/question endpoints', () => {
  const proof = JSON.parse(fs.readFileSync(path.join(root, 'assets/images/anatomy/bvis05-atlas/provenance.json'), 'utf8'));
  assert.equal(proof.plates.length, bvis05Plates.length);
  assert.equal(new Set(bvis05Plates.map((p) => p.id)).size, bvis05Plates.length);
  for (const p of bvis05Plates) {
    const a = content.assets.find((a) => a.id === p.id)!;
    assert.equal(a.sourceId, BVIS05_SOURCE);
    assert.equal(a.assetType, 'diagram');
    assert.equal(a.labelStatus, 'unlabeled');
    assert.ok(!a.sourceUrl && !a.rightsUrl);
    const svg = fs.readFileSync(path.join(root, p.svgPath));
    assert.ok(!/<text\b|<image\b|<filter\b|gradient/i.test(svg.toString()), p.id);
    const png = fs.readFileSync(path.join(root, p.pngPath));
    assert.equal(png.readUInt32BE(16), 1450);
    assert.equal(png.readUInt32BE(20), 1000);
    const r = proof.plates.find((r: { id: string }) => r.id === p.id)!;
    assert.equal(createHash('sha256').update(png).digest('hex'), r.sha256.png, p.id);
    assert.equal(createHash('sha256').update(svg).digest('hex'), r.sha256.svg, p.id);
    assert.equal(new Set(p.labels.map(annotationKey)).size, p.labels.length, 'different panels need distinct coordinate identities');
    for (const l of p.labels) {
      assert.ok(content.structures.some((s) => s.id === l.structureId), l.structureId);
      assert.ok(l.x > 0 && l.x < 1 && l.y > 0 && l.y < 1, l.structureId);
      assert.ok(a.hotspots?.some((h) => annotationKey(h) === annotationKey(l)), l.structureId);
    }
    assert.ok(content.modules.find((m) => m.id === p.moduleId)?.lessons?.some((l) => l.assetIds?.includes(p.id)), p.id);
    assert.ok(content.questions.some((q) => q.assetId === p.id), p.id);
  }
  for (const m of content.modules.filter((m) => BVIS05_MODULES.includes(m.id)))
    for (const id of new Set(m.lessons?.flatMap((l) => l.assetIds ?? [])))
      assert.ok(isBvis05AssetId(id) || content.assets.find((a) => a.id === id)?.assetType === 'histology', `${m.id}:${id}`);
  for (const q of content.questions.filter((q) => isBvis05AssetId(q.assetId) && q.taskType === 'hotspot'))
    assert.ok(q.hotspots?.some((h) => h.structureId !== q.answer), `${q.id}: location questions need a genuine choice`);
});

test('BVIS05 core requested anatomy is visibly targeted without inventing canonical structures', () => {
  const targets = new Set(bvis05Plates.flatMap((p) => p.labels.map((l) => l.structureId)));
  const required = [
    'cv-heart','cv-apex','cv-right-atrium','cv-left-atrium','cv-right-ventricle','cv-left-ventricle',
    'cv-tricuspid','cv-mitral','cv-aortic-valve','cv-pulmonary-valve','cv-chordae','cv-papillary',
    'cv-right-coronary','cv-lad','cv-circumflex','cv-coronary-sinus',
    'ves-aorta','ves-brachial','ves-radial','ves-ulnar','ves-femoral','ves-popliteal','ves-median-cubital','ves-great-saphenous',
    'respiratory-system-nasal-cavity','respiratory-system-larynx','respiratory-system-trachea',
    'respiratory-system-carina','respiratory-system-right-main-bronchus','respiratory-system-left-main-bronchus',
    'respiratory-system-right-lung','respiratory-system-left-lung','respiratory-system-middle-lobe',
    'respiratory-system-visceral-pleura','respiratory-system-parietal-pleura',
    'respiratory-system-alveolus','respiratory-system-diaphragm',
    'lymph-thoracic-duct','lymph-right-duct','lymph-cervical-nodes','lymph-axillary-nodes','lymph-inguinal-nodes',
    'lymph-spleen','lymph-thymus','lymph-tonsil','lymph-node','lymph-afferent','lymph-efferent','lymph-hilum',
    'endo-pituitary','endo-hypothalamus','endo-thyroid','endo-parathyroids','endo-adrenal-cortex','endo-adrenal-medulla',
    'endo-pancreatic-islet','endo-alpha-cell','endo-beta-cell','endo-delta-cell',
  ];
  for (const id of required) assert.ok(targets.has(id), `Required visible target ${id}`);
});

test('BVIS05 new questions have genuine choices, one neutral typed marker and correct bilingual grading', () => {
  for (const q of bvis05Questions) {
    const p = bvis05Plates.find((p) => p.id === q.assetId)!;
    const es = requireSpanishQuestion(q);
    assert.ok(answerIsCorrect(q.answer, q), q.id);
    assert.ok(answerIsCorrect(spanishResponseForScoring(q, es.answer as string), q), q.id);
    assert.ok(q.structureIds.every((id) => content.structures.find((s) => s.id === id)?.moduleId === q.moduleId), q.id);
    for (const h of q.hotspots!) assert.ok(p.labels.some((l) => annotationKey(l) === annotationKey(h)), q.id);
    if (q.taskType === 'hotspot') {
      const wrong = q.hotspots!.find((h) => h.structureId !== q.answer);
      assert.ok(wrong, q.id);
      assert.equal(answerIsCorrect(wrong.structureId, q), false, q.id);
    } else {
      assert.equal(q.hotspots!.length, 1, q.id);
      if (p.teachingKind === 'tissue-schematic') assert.match(q.prompt, /not a photomicrograph/);
    }
  }
});

test('BVIS05 callout controls remain disjoint at phone widths and larger text sizes', () => {
  for (const p of bvis05Plates) for (const width of [273, 343]) for (const size of [44, 60]) {
    const height = Math.max(width / 1.45, Math.ceil(p.labels.length / 2) * (size + 8));
    const controls = spreadAtlasCallouts(p.labels.map((l) => ({ x: l.x * width, y: l.y * height })), width, height, size, size);
    const bounds = controls.map((c) => ({ left: c.x - size / 2, top: c.y - size / 2, width: size, height: size }));
    assert.equal(hasMarkerOverlap(bounds), false, p.id);
    for (const b of bounds) assert.ok(b.left >= 0 && b.top >= 0 && b.left + size <= width && b.top + size <= height, p.id);
  }
});

test('BVIS05 keeps genuine licensed alveolar microscopy separate and unchanged', () => {
  const evidence = JSON.parse(fs.readFileSync(path.join(root, 'docs/atlas/BVIS05_SPECIMEN_LICENSES.json'), 'utf8'));
  const r = evidence.licenses.find((r: { assetId: string }) => r.assetId === 'asset-commons-alveolar-sac');
  const a = content.assets.find((a) => a.id === r.assetId)!;
  assert.equal(a.assetType, 'histology');
  assert.equal(r.license, 'CC BY-SA 4.0');
  assert.equal(a.sourceUrl, r.sourceUrl);
  assert.equal(a.rightsUrl, r.rightsUrl);
  const bytes = fs.readFileSync(path.join(root, r.localPath));
  assert.equal(bytes.length, r.byteSize);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), r.sha256);
  assert.ok(content.modules.find((m) => m.id === 'respiratory-system')?.lessons?.some((l) => l.assetIds?.includes(a.id)));
  assert.ok(content.questions.some((q) => q.assetId === a.id));
  assert.ok(bvis05Questions.every((q) => q.assetId !== a.id));
});
