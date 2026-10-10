import assert from 'node:assert/strict';
import test from 'node:test';
import { content } from '../content/canonical.ts';
import { resolvePublishedModule, isQuestionScorable } from '../content/study.ts';
import { validateContent } from '../content/validation.ts';

test('Anatomy Foundations remains one reachable published module with source-linked lessons and original diagrams', () => {
  const module = resolvePublishedModule(content, 'anatomy-foundations');
  assert.ok(module?.visible && module.published);
  assert.equal(content.modules.indexOf(module), 4);
  assert.deepEqual(module.lessons?.map((lesson) => lesson.id), [
    'foundations-position-directions', 'foundations-planes-sections', 'foundations-surface-regions',
    'foundations-body-cavities', 'foundations-serous-membranes', 'foundations-abdomen-map',
    'foundations-imaging-sections', 'foundations-organization',
    'foundations-dev-first-stages', 'foundations-dev-implantation', 'foundations-dev-germ-layers',
    'foundations-dev-neural-axis', 'foundations-dev-folding', 'foundations-dev-placental-interface',
    'organ-map',
  ]);
  const structureIds = new Set(content.structures.filter((item) => item.moduleId === module.id).map((item) => item.id));
  assert.equal(structureIds.size, 105);
  assert.ok(module.lessons?.every((lesson) => lesson.structureIds.every((id) => structureIds.has(id))));
  assert.ok([...structureIds].every((id) => module.lessons?.some((lesson) => lesson.structureIds.includes(id))));
  assert.ok(content.structures.some((item) => item.id === 'transverse-plane' && item.acceptedAliases.includes('axial plane')));
  assert.ok(content.structures.some((item) => item.id === 'right-upper-quadrant' && item.acceptedAliases.includes('RUQ')));
  assert.ok(content.structures.some((item) => item.id === 'popliteal-region' && item.acceptedAliases.includes('back of knee')));
  const assets = new Set(module.lessons?.flatMap((lesson) => lesson.assetIds ?? []));
  assert.ok(assets.has('asset-original-anatomical-planes'));
  assert.ok(assets.has('asset-original-body-cavities'));
  assert.equal(assets.size, 9);
  assert.deepEqual(validateContent(content), []);
});

test('Foundations application and recall questions are available to Practice without replacing old IDs', () => {
  const questions = content.questions.filter((item) => item.moduleId === 'anatomy-foundations');
  assert.equal(questions.length, 76);
  assert.ok(questions.some((item) => item.id === 'q-organ-pancreas'));
  assert.ok(questions.some((item) => item.id === 'q-visual-cavity-thoracic'));
  assert.ok(questions.some((item) => item.id === 'q-bac01-axial-view'));
  assert.ok(questions.some((item) => item.id === 'q-bac01-pleural-space'));
  assert.ok(questions.some((item) => item.id === 'q-bac01-nine-regions-lower'));
  assert.ok(questions.some((item) => item.taskType === 'typed-recall'));
  assert.ok(questions.every((item) => isQuestionScorable(item, content)));
  assert.ok(questions.every((item) => ['multiple-choice', 'typed-recall', 'ordered-sequence', 'function-relationship', 'hotspot'].includes(item.taskType)));
});

test('BAC02 is a text-first, source-linked developmental sequence with playable spatial and derivative questions', () => {
  const module = resolvePublishedModule(content, 'anatomy-foundations');
  assert.ok(module);
  const lessons = module.lessons?.filter((item) => item.id.startsWith('foundations-dev-')) ?? [];
  const terms = content.structures.filter((item) => item.id.startsWith('dev-'));
  const questions = content.questions.filter((item) => item.id.startsWith('q-bac02-'));
  assert.equal(lessons.length, 6);
  assert.equal(terms.length, 27);
  assert.equal(questions.length, 23);
  assert.ok(lessons.every((item) => item.sourceIds.includes('source-openstax-ap-2013') && !item.assetIds?.length));
  assert.ok(terms.every((item) => item.moduleId === module.id && item.sourceId === 'source-openstax-ap-2013'));
  assert.ok(questions.every((item) => item.moduleId === module.id && item.sourceId === 'source-openstax-ap-2013' && isQuestionScorable(item, content)));
  assert.ok(terms.some((item) => item.id === 'dev-inner-cell-mass' && item.acceptedAliases.includes('embryoblast')));
  assert.ok(terms.some((item) => item.id === 'dev-umbilical-cord' && item.acceptedAliases.includes('umbilical connection')));
  assert.deepEqual(questions.find((item) => item.id === 'q-bac02-early-sequence')?.answer,
    ['Fertilization','Zygote','Cleavage','Morula','Blastocyst','Implantation']);
  assert.deepEqual(questions.find((item) => item.id === 'q-bac02-layers-outside-in')?.answer,
    ['Ectoderm','Mesoderm','Endoderm']);
  assert.ok(questions.some((item) => item.id === 'q-bac02-axis-spatial'));
  assert.ok(questions.some((item) => item.id === 'q-bac02-mixed-origin'));
  assert.ok(questions.some((item) => item.id === 'q-bac02-placental-sides'));
  assert.ok(content.questions.some((item) => item.id === 'female-q5')); // The existing ampulla question stays in the female module.
});