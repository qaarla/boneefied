import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { content } from '../content/canonical.ts';
import { bvis06Plates } from '../content/bvis06-plates.generated.ts';
import { bvis06Questions } from '../content/bvis06-questions.ts';
import { BVIS06_MODULES, BVIS06_SOURCE, isBvis06AssetId } from '../content/bvis06-pack.ts';
import { answerIsCorrect } from '../content/study.ts';
import { requireSpanishQuestion, spanishResponseForScoring } from '../locales/es/index.ts';
import { combinedAtlasAssetsForStructure } from '../content/atlas-index.ts';
import { annotationKey, spreadAtlasCallouts, hasMarkerOverlap } from '../components/viewerMarkerLayout.ts';
const root = path.resolve(import.meta.dirname, '..');

test('BVIS06 original files have exact provenance, canonical annotations and lesson/glossary/question endpoints', () => {
  const proof = JSON.parse(fs.readFileSync(path.join(root, 'assets/images/anatomy/bvis06-atlas/provenance.json'), 'utf8'));
  assert.equal(proof.plates.length, bvis06Plates.length);
  assert.equal(new Set(bvis06Plates.map((p) => p.id)).size, bvis06Plates.length);
  for (const p of bvis06Plates) {
    const a = content.assets.find((a) => a.id === p.id)!;
    assert.equal(a.sourceId, BVIS06_SOURCE);
    assert.equal(a.assetType, 'diagram');
    assert.equal(a.labelStatus, 'unlabeled');
    const svg = fs.readFileSync(path.join(root, p.svgPath)), png = fs.readFileSync(path.join(root, p.pngPath));
    assert.ok(!/<text\b|<image\b|<filter\b|gradient/i.test(svg.toString()), p.id);
    assert.equal(png.readUInt32BE(16), 1450);
    assert.equal(png.readUInt32BE(20), 1000);
    const record = proof.plates.find((r: { id: string }) => r.id === p.id)!;
    assert.equal(createHash('sha256').update(svg).digest('hex'), record.sha256.svg, p.id);
    assert.equal(createHash('sha256').update(png).digest('hex'), record.sha256.png, p.id);
    assert.equal(new Set(p.labels.map(annotationKey)).size, p.labels.length);
    for (const l of p.labels) {
      assert.ok(content.structures.some((s) => s.id === l.structureId), l.structureId);
      assert.ok(l.x > 0 && l.x < 1 && l.y > 0 && l.y < 1, l.structureId);
      assert.ok(a.hotspots?.some((h) => annotationKey(h) === annotationKey(l)));
      assert.ok(combinedAtlasAssetsForStructure(l.structureId).some((a) => a.id === p.id), l.structureId);
    }
    assert.ok(content.modules.find((m) => m.id === p.moduleId)?.lessons?.some((l) => l.assetIds?.includes(p.id)), p.id);
    assert.ok(content.questions.some((q) => q.assetId === p.id), p.id);
  }
});

test('BVIS06 covers the explicit digestive, urinary and reproductive targets', () => {
  const targets = new Set(bvis06Plates.flatMap((p) => p.labels.map((l) => l.structureId)));
  const required = {
    'digestive-system': ['Mouth', 'Pharynx', 'Esophagus', 'Stomach', 'Cardia', 'Fundus', 'Body of stomach', 'Pylorus',
      'Duodenum', 'Jejunum', 'Ileum', 'Cecum', 'Ascending colon', 'Transverse colon', 'Descending colon', 'Sigmoid colon', 'Rectum',
      'Liver', 'Gallbladder', 'Pancreas', 'Cystic duct', 'Common hepatic duct', 'Common bile duct', 'Pancreatic duct',
      'Mesentery', 'Greater omentum', 'Lesser omentum', 'Liver lobule', 'Central vein', 'Portal triad', 'Hepatic sinusoid',
      'Villi', 'Microvilli', 'Mucosa', 'Submucosa', 'Muscularis externa', 'Serosa'],
    'urinary-system': ['Kidney', 'Ureter', 'Urinary bladder', 'Urethra', 'Renal cortex', 'Renal medulla', 'Renal pyramid',
      'Minor calyx', 'Major calyx', 'Renal pelvis', 'Renal hilum', 'Nephron', 'Renal corpuscle', 'Glomerulus', 'Glomerular capsule',
      'Proximal convoluted tubule', 'Nephron loop', 'Distal convoluted tubule', 'Collecting duct'],
    'male-reproductive': ['Testis', 'Epididymis', 'Head of epididymis', 'Body of epididymis', 'Tail of epididymis',
      'Rete testis', 'Efferent ductule', 'Ductus deferens', 'Ejaculatory duct', 'Seminal vesicle', 'Prostate gland',
      'Bulbourethral gland', 'Prostatic urethra', 'Spongy urethra'],
    'female-reproductive': ['Ovary', 'Uterine tube', 'Fimbriae', 'Infundibulum', 'Ampulla of uterine tube', 'Isthmus of uterine tube',
      'Uterus', 'Fundus of uterus', 'Body of uterus', 'Cervix', 'Vagina', 'Endometrium', 'Myometrium', 'Perimetrium',
      'Primordial follicle', 'Primary follicle', 'Secondary follicle', 'Antral follicle', 'Mature follicle', 'Corpus luteum', 'Corpus albicans'],
  };
  for (const [moduleId, names] of Object.entries(required)) for (const name of names) {
    const s = content.structures.find((s) => s.moduleId === moduleId && s.canonicalName === name);
    assert.ok(s && targets.has(s.id), `${moduleId}:${name}`);
  }
  const kidney = 'urinary-system-kidney', liver = 'digestive-system-liver';
  assert.ok(bvis06Plates.some((p) => p.moduleId === 'urinary-system' && p.labels.some((l) => l.structureId === kidney) && p.labels.some((l) => l.structureId === liver)), 'Kidney placement includes liver context');
});

test('BVIS06 questions grade canonical IDs in English/Spanish without answer shortcuts', () => {
  for (const q of bvis06Questions) {
    const p = bvis06Plates.find((p) => p.id === q.assetId)!;
    const es = requireSpanishQuestion(q);
    assert.ok(answerIsCorrect(q.answer, q), q.id);
    assert.ok(answerIsCorrect(spanishResponseForScoring(q, es.answer), q), q.id);
    assert.ok(q.structureIds.every((id) => content.structures.find((s) => s.id === id)?.moduleId === q.moduleId), q.id);
    for (const h of q.hotspots!) assert.ok(p.labels.some((l) => annotationKey(l) === annotationKey(h)), q.id);
    if (q.taskType === 'hotspot') {
      const wrong = q.hotspots!.find((h) => h.structureId !== q.answer);
      assert.ok(wrong, q.id);
      assert.equal(answerIsCorrect(wrong.structureId, q), false, q.id);
    } else if (q.taskType === 'image-identification') {
      assert.equal(q.hotspots!.length, 1, q.id);
      if (p.teachingKind === 'tissue-schematic') assert.match(q.prompt, /not a photomicrograph/);
    } else {
      assert.ok(q.options?.length && es.options?.length === q.options.length);
      assert.notDeepEqual(q.options, q.answer);
      assert.equal(answerIsCorrect([...(q.answer as string[])].reverse(), q), false, q.id);
      assert.deepEqual(spanishResponseForScoring(q, es.options!), q.options);
    }
  }
  assert.ok(bvis06Questions.filter((q) => q.taskType === 'ordered-sequence').length >= 5);
});

test('BVIS06 phone-width and enlarged-text callout geometry remains disjoint', () => {
  for (const p of bvis06Plates) for (const width of [273, 343]) for (const size of [44, 60]) {
    const height = Math.max(width / 1.45, Math.ceil(p.labels.length / 2) * (size + 8));
    const controls = spreadAtlasCallouts(p.labels.map((l) => ({ x: l.x * width, y: l.y * height })), width, height, size, size);
    const bounds = controls.map((c) => ({ left: c.x - size / 2, top: c.y - size / 2, width: size, height: size }));
    assert.equal(hasMarkerOverlap(bounds), false, p.id);
    for (const b of bounds) assert.ok(b.left >= 0 && b.top >= 0 && b.left + size <= width && b.top + size <= height, p.id);
  }
});

test('BVIS06 preserves licensed kidney microscopy as a separate specimen', () => {
  const evidence = JSON.parse(fs.readFileSync(path.join(root, 'docs/atlas/BVIS06_SPECIMEN_LICENSES.json'), 'utf8'));
  const r = evidence.licenses.find((r: { assetId: string }) => r.assetId === 'asset-commons-kidney-cortex-human');
  const a = content.assets.find((a) => a.id === r.assetId)!;
  assert.equal(a.assetType, 'histology');
  assert.equal(r.license, 'CC BY-SA 3.0');
  assert.equal(a.sourceUrl, r.sourceUrl);
  assert.equal(a.rightsUrl, r.rightsUrl);
  const bytes = fs.readFileSync(path.join(root, r.localPath));
  assert.equal(bytes.length, r.byteSize);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), r.sha256);
  assert.ok(content.modules.find((m) => m.id === 'urinary-system')?.lessons?.some((l) => l.assetIds?.includes(a.id)));
  assert.ok(content.questions.some((q) => q.assetId === a.id));
  assert.ok(bvis06Questions.every((q) => isBvis06AssetId(q.assetId)));
  assert.ok(BVIS06_MODULES.every((id) => content.modules.some((m) => m.id === id)));
});
