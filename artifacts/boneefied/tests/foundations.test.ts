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
    'foundations-imaging-sections', 'foundations-organization', 'organ-map',
  ]);
  const structureIds = new Set(content.structures.filter((item) => item.moduleId === module.id).map((item) => item.id));
  assert.equal(structureIds.size, 78);
  assert.ok(module.lessons?.every((lesson) => lesson.structureIds.every((id) => structureIds.has(id))));
  assert.ok([...structureIds].every((id) => module.lessons?.some((lesson) => lesson.structureIds.includes(id))));
  assert.ok(content.structures.some((item) => item.id === 'transverse-plane' && item.acceptedAliases.includes('axial plane')));
  assert.ok(content.structures.some((item) => item.id === 'right-upper-quadrant' && item.acceptedAliases.includes('RUQ')));
  assert.ok(content.structures.some((item) => item.id === 'popliteal-region' && item.acceptedAliases.includes('back of knee')));
  const assets = new Set(module.lessons?.flatMap((lesson) => lesson.assetIds ?? []));
  assert.ok(assets.has('asset-original-anatomical-planes'));
  assert.ok(assets.has('asset-original-body-cavities'));
  assert.equal(assets.size, 2);
  assert.deepEqual(validateContent(content), []);
});

test('Foundations application and recall questions are available to Practice without replacing old IDs', () => {
  const questions = content.questions.filter((item) => item.moduleId === 'anatomy-foundations');
  assert.equal(questions.length, 49);
  assert.ok(questions.some((item) => item.id === 'q-organ-pancreas'));
  assert.ok(questions.some((item) => item.id === 'q-visual-cavity-thoracic'));
  assert.ok(questions.some((item) => item.id === 'q-bac01-axial-view'));
  assert.ok(questions.some((item) => item.id === 'q-bac01-pleural-space'));
  assert.ok(questions.some((item) => item.id === 'q-bac01-nine-regions-lower'));
  assert.ok(questions.some((item) => item.taskType === 'typed-recall'));
  assert.ok(questions.every((item) => isQuestionScorable(item, content)));
  assert.ok(questions.every((item) => ['multiple-choice', 'typed-recall', 'ordered-sequence', 'function-relationship', 'hotspot'].includes(item.taskType)));
});