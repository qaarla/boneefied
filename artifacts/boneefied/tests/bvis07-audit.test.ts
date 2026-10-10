import test from 'node:test';
import assert from 'node:assert/strict';
import { buildVisualAudit } from '../scripts/atlas/bvis07-audit.ts';
import { content } from '../content/canonical.ts';
import { answerIsCorrect } from '../content/study.ts';
import { formatAnswerForDisplay } from '../content/answer-display.ts';
import { readableAttribution, visualKind } from '../content/visual-disclosure.ts';
import { requireSpanishQuestion, spanishResponseForScoring } from '../locales/es/index.ts';

const audit = buildVisualAudit();
test('BVIS07 published inventory has local files/resolvers, verified rights, unique IDs and explicit retired records', () => {
  assert.deepEqual(audit.errors, []);
  const c = audit.counts;
  assert.equal(c.totalPublishedVisuals, c.originalBoneefiedVectors + c.nihBioArtPublicDomain + c.servierDerived + c.otherVerifiedPublicDomain + c.otherVerifiedLicensed);
  assert.equal(c.registeredAssets, c.totalPublishedVisuals + c.retiredRegisteredAssets);
  assert.equal(c.modulesWithVisualCoverage, 18);
  assert.equal(c.originalVectorsAddedByBvis07, 0);
  assert.ok(audit.inventory.filter((a) => !a.active).every((a) => /Retired registered archive/.test(a.disposition)));
});

test('BVIS07 focused skeletal, muscular, nervous, heart, lung, digestive, urinary and reproductive examples have visual practice', () => {
  for (const moduleId of ['skeletal-system', 'muscular-system', 'nervous-system', 'cardiovascular-system', 'respiratory-system', 'digestive-system', 'urinary-system', 'male-reproductive', 'female-reproductive']) {
    const row = audit.moduleCoverage.find((m) => m.id === moduleId)!;
    assert.ok(row.visuals > 0 && row.imageBackedQuestions > 0 && row.hotspotQuestions > 0, moduleId);
    const q = content.questions.find((q) => q.moduleId === moduleId && q.taskType === 'hotspot' && content.structures.some((s) => s.id === q.answer))!;
    const a = content.assets.find((a) => a.id === q.assetId)!;
    assert.ok(a && q.hotspots?.some((h) => h.structureId === q.answer), moduleId);
    assert.ok(answerIsCorrect(q.answer, q), q.id);
    const es = requireSpanishQuestion(q);
    assert.ok(answerIsCorrect(spanishResponseForScoring(q, es.answer), q), q.id);
  }
  for (const moduleId of ['cells-tissues', 'respiratory-system', 'urinary-system']) {
    const m = content.modules.find((m) => m.id === moduleId)!;
    const ids = new Set(m.lessons?.flatMap((l) => l.assetIds ?? []));
    assert.ok(content.assets.some((a) => ids.has(a.id) && visualKind(a) === 'histology'), moduleId);
    assert.ok(content.questions.some((q) => q.moduleId === moduleId && content.assets.find((a) => a.id === q.assetId)?.assetType === 'histology'), moduleId);
  }
});

test('BVIS07 categorical matrix distinguishes direct annotation, contextual visuals, real histology and text-only coverage', () => {
  assert.ok(audit.matrix.length > 18);
  assert.ok(audit.matrix.some((r) => r.genuineHistologyIds.length));
  assert.ok(audit.matrix.some((r) => r.cleanStudyVisual.startsWith('Text-only')));
  for (const row of audit.matrix) {
    assert.ok(row.directlyAnnotatedStructures <= row.structures);
    assert.equal(row.directlyIllustratedIds.length, row.directlyAnnotatedStructures);
    assert.ok(!/native.*passed|offline.*passed/i.test(row.phone));
  }
});

test('BVIS07 long source addresses do not dominate captions or replace genuine specimen disclosure', () => {
  assert.equal(readableAttribution('Adapted from Servier Medical Art (https://smart.servier.com), CC BY 4.0.'), 'Adapted from Servier Medical Art, CC BY 4.0.');
  assert.equal(readableAttribution('Josef Reischig, CC BY-SA 3.0'), 'Josef Reischig, CC BY-SA 3.0');
  assert.equal(visualKind({ assetType: 'histology' }), 'histology');
  assert.equal(visualKind({ assetType: 'diagram' }), 'diagram');
});

test('BVIS07 canonical-ID sequence feedback uses names, while legacy name-based sequences remain unchanged', () => {
  const q = content.questions.find((q) => q.id === 'q-bvis06-sequence-urine-route')!;
  const name = (id: string) => content.structures.find((s) => s.id === id)?.canonicalName ?? id;
  assert.equal(formatAnswerForDisplay(q, q.answer, name, true), 'Kidney → Ureter → Urinary bladder → Urethra');
  assert.equal(formatAnswerForDisplay({ taskType: 'ordered-sequence' }, ['first', 'second'], () => { throw new Error('Legacy display names are not IDs'); }), 'first → second');
  assert.notDeepEqual(q.hotspots?.map((h) => h.structureId), q.answer, 'Marker numbers cannot disclose answer order');
});
