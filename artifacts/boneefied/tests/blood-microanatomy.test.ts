import assert from 'node:assert/strict';
import test from 'node:test';
import { content } from '../content/canonical.ts';
import { isQuestionScorable, resolvePublishedModule } from '../content/study.ts';
import { validateContent } from '../content/validation.ts';

test('BAC03 joins the existing Blood & cardiovascular selector without changing Blood vessels or heart IDs', () => {
  const bloodPath = content.modules.filter((module) => module.system === 'cardiovascular');
  const vesselPath = content.modules.filter((module) => module.system === 'vessels');
  assert.deepEqual(bloodPath.map((module) => module.id), ['cardiovascular-system']);
  assert.deepEqual(vesselPath.map((module) => module.id), ['blood-vessels']);
  const module = resolvePublishedModule(content, 'cardiovascular-system');
  assert.ok(module?.visible && module.published);
  assert.equal(module.lessons?.[0].id, 'cv-orientation');
  assert.deepEqual(module.lessons?.slice(-5).map((lesson) => lesson.id), [
    'cv-blood-tissue','cv-blood-red-cells-platelets','cv-blood-white-cells','cv-blood-marrow','cv-blood-smear',
  ]);
  assert.ok(module.sourceIds.includes('source-openstax-ap-2013-blood-ch18'));
  assert.ok(content.questions.some((question) => question.id === 'q-ves-16' && question.moduleId === 'blood-vessels'));
  assert.ok(content.questions.some((question) => question.id === 'q-cv-01' && question.moduleId === 'cardiovascular-system'));
  assert.equal(content.structures.filter((item) => item.moduleId === 'blood-vessels').length, 45);
  assert.deepEqual(validateContent(content), []);
});

test('Blood tissue, all five leukocytes, marrow, and text-only smear recognition are source-linked and playable', () => {
  const module = resolvePublishedModule(content, 'cardiovascular-system');
  assert.ok(module);
  const lessons = module.lessons?.filter((lesson) => lesson.id.startsWith('cv-blood-')) ?? [];
  const structures = content.structures.filter((item) => item.id.startsWith('cv-blood-'));
  const questions = content.questions.filter((item) => item.id.startsWith('q-bac03-'));
  assert.equal(lessons.length, 5);
  assert.equal(structures.length, 20);
  assert.equal(questions.length, 23);
  assert.ok(lessons.every((lesson) => lesson.sourceIds.includes('source-openstax-ap-2013-blood-ch18') && !lesson.assetIds?.length));
  assert.ok(structures.every((item) => item.moduleId === module.id && item.sourceId === 'source-openstax-ap-2013-blood-ch18'));
  assert.ok(questions.every((item) => item.moduleId === module.id && item.sourceId === 'source-openstax-ap-2013-blood-ch18' && !item.assetId && isQuestionScorable(item, content)));
  for (const kind of ['neutrophil','lymphocyte','monocyte','eosinophil','basophil']) {
    assert.ok(structures.some((item) => item.id === `cv-blood-${kind}`), kind);
    assert.ok(questions.some((item) => item.id === `q-bac03-smear-${kind}`), kind);
  }
  assert.ok(structures.some((item) => item.id === 'cv-blood-erythrocyte' && item.acceptedAliases.includes('RBC')));
  assert.ok(structures.some((item) => item.id === 'cv-blood-red-bone-marrow' && item.acceptedAliases.includes('red marrow')));
  assert.ok(structures.some((item) => item.id === 'cv-blood-peripheral-blood-smear' && item.acceptedAliases.includes('blood film')));
  const source = content.sources.find((item) => item.id === 'source-openstax-ap-2013-blood-ch18');
  assert.ok(source?.sourceUrl?.includes('/books/anatomy-and-physiology/pages/18-1-'));
  assert.ok(source?.attributionLicenseStatus.includes('CC BY 4.0'));
});