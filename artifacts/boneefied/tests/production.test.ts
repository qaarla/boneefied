import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { content, CYTOLOGY_SOURCE_ID } from '../content/canonical.ts';
import { GRAY_SOURCE_ID, OPENSTAX_SOURCE_ID } from '../content/anatomy.ts';
import { validateContent } from '../content/validation.ts';
import { sourceCitation } from '../content/sources.ts';
import {
  completeSession,
  hydrateStudyState,
  isQuestionScorable,
  serializeStudyState,
  submitSessionAnswer,
  upsertSession,
} from '../content/study.ts';
import type { PracticeSession } from '../content/model.ts';
import { endocrineModule, endocrineStructures, cardiovascularModule, cardiovascularStructures, vesselsModule, vesselsStructures, lymphaticModule, lymphaticStructures } from '../content/circulation-systems.ts';
import { organSystemsModules, organSystemsStructures } from '../content/organ-systems.ts';

test('production catalog validates with honest published counts and source provenance', () => {
  assert.deepEqual(validateContent(content), []);
  assert.equal(content.modules.filter((module) => module.published).length, 18);
  assert.equal(content.modules.find((module) => module.id === 'skeletal-system')?.contentStatus, 'available');
  assert.equal(content.structures.filter((structure) => structure.moduleId === 'skeletal-system').length, 155);
  assert.equal(content.modules.find((module) => module.id === 'skeletal-system')?.lessons?.length, 13);
  assert.equal(content.structures.filter((structure) => structure.moduleId === 'joints-ligaments').length, 36);
  assert.equal(content.modules.find((module) => module.id === 'joints-ligaments')?.lessons?.length, 6);
  assert.equal(content.structures.filter((structure) => structure.moduleId === 'muscular-system').length, 59);
  assert.equal(content.modules.find((module) => module.id === 'muscular-system')?.lessons?.length, 8);
  assert.equal(content.structures.filter((structure) => structure.moduleId === 'nervous-system').length, 63);
  assert.equal(content.modules.find((module) => module.id === 'nervous-system')?.lessons?.length, 8);
  assert.equal(content.modules.find((module) => module.id === 'joints-ligaments')?.system, 'joints');
  assert.equal(content.modules.find((module) => module.id === 'muscular-system')?.system, 'muscular');
  assert.equal(content.modules.find((module) => module.id === 'nervous-system')?.system, 'nervous');
  assert.ok(content.structures.some((structure) => structure.id === 'external-acoustic-meatus'));
  assert.ok(content.structures.some((structure) => structure.id === 'lateral-malleolus'));
  assert.equal(content.questions.filter((question) => question.moduleId === 'skeletal-system').length, 20);
  assert.equal(content.questions.filter((question) => question.moduleId === 'anatomy-foundations').length, 3);
  const expectedCounts: Record<string, [number, number, number]> = {
    'cytology-mitosis': [15, 0, 10], 'skeletal-system': [155, 13, 20], 'anatomy-foundations': [12, 1, 3],
    'joints-ligaments': [36, 6, 14], 'muscular-system': [59, 8, 20], 'nervous-system': [63, 8, 20],
    'cells-tissues': [46, 7, 24], 'integumentary-system': [38, 6, 20], 'special-senses': [59, 8, 28],
    'endocrine-system': [35, 6, 16], 'cardiovascular-system': [39, 6, 22], 'blood-vessels': [30, 9, 22],
    'lymphatic-system': [35, 6, 16], 'respiratory-system': [57, 7, 18], 'digestive-system': [70, 10, 24],
    'urinary-system': [45, 7, 18], 'male-reproductive': [43, 7, 18], 'female-reproductive': [60, 8, 20],
  };
  for (const [id, [structures, lessons, questions]] of Object.entries(expectedCounts)) {
    const module = content.modules.find((item) => item.id === id);
    assert.ok(module?.published, id);
    assert.equal(content.structures.filter((item) => item.moduleId === id).length, structures, id);
    assert.equal(module?.lessons?.length ?? 0, lessons, id);
    assert.equal(content.questions.filter((item) => item.moduleId === id).length, questions, id);
  }
  assert.equal(content.assets.length, 4);
  assert.equal(content.questions.filter((question) => question.hotspots?.length).length, 0);
  assert.equal(content.modules.find((module) => module.id === 'cytology-mitosis')?.sourceIds[0], CYTOLOGY_SOURCE_ID);
  const source = content.sources.find((item) => item.id === CYTOLOGY_SOURCE_ID);
  assert.ok(source);
  assert.equal(source?.sourceType, 'text');
  assert.match(source?.filename ?? '', /transcribed/i);
  assert.deepEqual([...new Set(content.questions.map((question) => question.sourcePage).filter((page): page is number => page !== null))].sort((a, b) => a - b), [5, 6, 7, 8, 11, 12]);
  assert.ok(content.questions.filter((question) => question.moduleId === 'cytology-mitosis').every((question) => question.sourceId === CYTOLOGY_SOURCE_ID));
  assert.ok(content.questions.every((question) => isQuestionScorable(question, content)));
  assert.ok(content.sources.some((source) => source.id === OPENSTAX_SOURCE_ID && source.attributionLicenseStatus.includes('CC BY 4.0')));
  assert.ok(content.sources.some((source) => source.id === GRAY_SOURCE_ID && source.attributionLicenseStatus.includes('Public domain')));
  assert.ok(content.assets.every((asset) => asset.verificationStatus === 'verified' && asset.rightsUrl));
  assert.ok(content.questions.every((question) => content.modules.find((module) => module.id === question.moduleId)?.published));
  assert.equal(sourceCitation(content, OPENSTAX_SOURCE_ID, null), 'OpenStax Anatomy and Physiology (2013) · CC BY 4.0');
  assert.equal(sourceCitation(content, OPENSTAX_SOURCE_ID, 42), 'OpenStax Anatomy and Physiology (2013) · CC BY 4.0 · p.42');
  assert.match(sourceCitation(content, CYTOLOGY_SOURCE_ID, 5), /Lab 2.*p\.5/);
  assert.doesNotMatch(sourceCitation(content, OPENSTAX_SOURCE_ID, null), /Lab 2|null/);
});

test('production questions only expose supported text task types', () => {
  const supported = new Set(['multiple-choice', 'typed-recall', 'ordered-sequence', 'select-all', 'bone-laterality', 'function-relationship', 'muscle-action', 'muscle-origin-insertion']);
  assert.ok(content.questions.every((question) => supported.has(question.taskType)));
  assert.equal(content.questions.filter((question) => question.taskType === 'multiple-choice').length, 275);
  assert.equal(content.questions.filter((question) => question.taskType === 'typed-recall').length, 14);
  assert.equal(content.questions.filter((question) => question.taskType === 'ordered-sequence').length, 15);
  assert.equal(content.questions.filter((question) => question.taskType === 'select-all').length, 12);
  assert.equal(content.questions.filter((question) => question.taskType === 'bone-laterality').length, 3);
  assert.equal(content.questions.filter((question) => question.taskType === 'function-relationship').length, 12);
  assert.equal(content.questions.filter((question) => question.taskType === 'muscle-action').length, 1);
  assert.equal(content.questions.filter((question) => question.taskType === 'muscle-origin-insertion').length, 1);
  const multipleChoiceLike = new Set(['multiple-choice', 'bone-laterality', 'function-relationship', 'muscle-action', 'muscle-origin-insertion']);
  for (const question of content.questions.filter((item) => multipleChoiceLike.has(item.taskType))) {
    const answers = Array.isArray(question.answer) ? question.answer : [question.answer];
    assert.ok(answers.some((answer) => (question.options ?? []).includes(answer) || question.acceptedAliases.some((alias) => (question.options ?? []).includes(alias))), question.id);
  }
  for (const question of content.questions.filter((item) => Array.isArray(item.answer))) {
    for (const answer of question.answer as string[]) assert.ok((question.options ?? []).includes(answer), `${question.id}: ${answer}`);
  }
  const structureModules = new Map(content.structures.map((structure) => [structure.id, structure.moduleId]));
  for (const question of content.questions) {
    for (const structureId of question.structureIds) assert.equal(structureModules.get(structureId), question.moduleId, `${question.id}:${structureId}`);
    const answers = Array.isArray(question.answer) ? question.answer : [question.answer];
    if (question.taskType !== 'typed-recall') for (const answer of answers) {
      if (answer.trim().length > 2) assert.ok(!new RegExp(`\\b${answer.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'i').test(question.prompt), `${question.id} leaks answer`);
    }
    if (question.taskType === 'typed-recall') assert.ok(!/type the name of this study structure|name a structure|identify the structure/i.test(question.prompt), `${question.id} is broad category-only recall`);
  }
  for (const module of content.modules) for (const lesson of module.lessons ?? []) {
    for (const structureId of lesson.structureIds) assert.equal(structureModules.get(structureId), module.id, `${lesson.id}:${structureId}`);
  }
});

test('published lesson coverage and domain provenance are complete', () => {
  const sourceIds = new Set(content.sources.map((source) => source.id));
  for (const module of content.modules.filter((item) => item.published)) {
    const used = new Set([
      ...content.structures.filter((item) => item.moduleId === module.id).map((item) => item.sourceId),
      ...content.questions.filter((item) => item.moduleId === module.id).map((item) => item.sourceId),
      ...(module.lessons ?? []).flatMap((item) => item.sourceIds),
    ]);
    for (const sourceId of module.sourceIds) assert.ok(sourceIds.has(sourceId), `${module.id}:${sourceId}`);
    for (const sourceId of used) assert.ok(module.sourceIds.includes(sourceId), `${module.id} does not declare ${sourceId}`);
    const covered = new Set((module.lessons ?? []).flatMap((lesson) => lesson.structureIds));
    for (const lesson of module.lessons ?? []) for (const sourceId of lesson.sourceIds) assert.ok(sourceIds.has(sourceId), `${lesson.id}:${sourceId}`);
    if (!module.id.includes('foundations') && module.id !== 'cytology-mitosis') {
      for (const structure of content.structures.filter((item) => item.moduleId === module.id)) assert.ok(covered.has(structure.id), `${module.id}:${structure.id}`);
    }
  }
  assert.equal(content.structures.find((item) => item.id === 'foramen-ovale')?.sourceId, 'source-openstax-ap-2013-skeletal-ch7');
  assert.equal(content.structures.find((item) => item.id === 'scaphoid')?.sourceId, 'source-openstax-ap-2013-skeletal-ch8');
  assert.equal(content.structures.find((item) => item.id === 'acl')?.sourceId, 'source-openstax-ap-2013-joints-ch9');
  assert.equal(content.structures.find((item) => item.id === 'deltoid')?.sourceId, 'source-openstax-ap-2013-muscle-ch11');
  assert.equal(content.structures.find((item) => item.id === 'cerebrum')?.sourceId, 'source-openstax-ap-2013-nervous-ch13');
  const skeletalLessons = content.modules.find((item) => item.id === 'skeletal-system')?.lessons ?? [];
  assert.ok(skeletalLessons.find((item) => item.id === 'skull-orientation')?.structureIds.includes('foramen-magnum'));
  assert.equal(skeletalLessons.find((item) => item.id === 'skull-orientation')?.structureIds.includes('sacroiliac-joint'), false);
  assert.ok(skeletalLessons.find((item) => item.id === 'limb-girdles')?.structureIds.includes('sacroiliac-joint'));
  const skeletalExpansion = skeletalLessons.find((item) => item.id === 'knee-articular-landmarks');
  assert.deepEqual(skeletalExpansion?.structureIds, ['tibial-plateau','intercondylar-eminence','femoral-linea-aspera']);
  assert.ok(skeletalLessons.find((item) => item.id === 'hand-wrist-bones')?.structureIds.includes('radial-tuberosity'));
  assert.ok(skeletalLessons.find((item) => item.id === 'hand-wrist-bones')?.structureIds.includes('ulnar-styloid'));
});

test('raw rewritten module exports cover their own structures before canonical assembly', () => {
  const raw = [
    [endocrineModule, endocrineStructures], [cardiovascularModule, cardiovascularStructures],
    [vesselsModule, vesselsStructures], [lymphaticModule, lymphaticStructures],
    ...organSystemsModules.map((module) => [module, organSystemsStructures.filter((structure) => structure.moduleId === module.id)] as const),
  ] as const;
  for (const [module, structures] of raw) {
    const covered = new Set((module.lessons ?? []).flatMap((lesson) => lesson.structureIds));
    for (const structure of structures) assert.ok(covered.has(structure.id), `${module.id}:${structure.id}`);
  }
});

test('domain source registry records match runtime source IDs and URLs', () => {
  const registry = JSON.parse(readFileSync(new URL('../content/sources.json', import.meta.url), 'utf8')) as Array<{ id: string; sourceUrl?: string }>;
  for (const source of content.sources.filter((item) => item.id.startsWith('source-openstax-ap-2013-'))) {
    const record = registry.find((item) => item.id === source.id);
    assert.ok(record, source.id);
    if (source.sourceUrl) assert.equal(record?.sourceUrl, source.sourceUrl, source.id);
  }
});

const session: PracticeSession = {
  id: 'session-production-1',
  moduleId: 'cytology-mitosis',
  mode: 'practice',
  entryPoint: 'practice',
  questionIds: ['q-cycle-order', 'q-mitosis-order', 'q-sister'],
  position: 0,
  answers: [],
  startedAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  status: 'active',
};

test('PracticeSession preserves exact order, position, outcomes, pause/completion, and hydration', () => {
  let state = upsertSession({ attempts: [], missed: [], mastery: [] }, session);
  state = submitSessionAnswer(state, session.id, {
    questionId: 'q-cycle-order',
    answer: ['G1', 'S', 'G2'],
    outcome: 'correct',
    submittedAt: '2026-01-01T00:01:00.000Z',
  });
  state = upsertSession(state, {
    ...session,
    position: 1,
    answers: state.sessions?.[0].answers ?? [],
    updatedAt: '2026-01-01T00:02:00.000Z',
    status: 'paused',
  });
  const paused = state.sessions?.[0];
  assert.deepEqual(paused?.questionIds, session.questionIds);
  assert.equal(paused?.position, 1);
  assert.equal(paused?.status, 'paused');
  assert.equal(paused?.answers[0].outcome, 'correct');
  const completed = completeSession(state, session.id, '2026-01-01T00:03:00.000Z');
  assert.equal(completed.sessions?.[0].status, 'completed');
  assert.equal(completed.sessions?.[0].position, 3);
  assert.equal(completed.sessions?.[0].completedAt, '2026-01-01T00:03:00.000Z');
  const restored = hydrateStudyState(serializeStudyState(completed));
  assert.deepEqual(restored.sessions, completed.sessions);
});

test('PracticeSession distinguishes wrong, skipped, and unanswered and duplicate submit is idempotent', () => {
  let state = upsertSession({ attempts: [], missed: [], mastery: [] }, session);
  state = submitSessionAnswer(state, session.id, { questionId: 'q-cycle-order', answer: ['G2'], outcome: 'wrong', submittedAt: '2026-01-01T00:01:00.000Z' }, {
    questionId: 'q-cycle-order', structureId: 'g1', answer: ['G2'], correct: false,
  });
  state = submitSessionAnswer(state, session.id, { questionId: 'q-cycle-order', answer: ['G2'], outcome: 'wrong', submittedAt: '2026-01-01T00:01:01.000Z' }, {
    questionId: 'q-cycle-order', structureId: 'g1', answer: ['G2'], correct: false,
  });
  state = submitSessionAnswer(state, session.id, { questionId: 'q-mitosis-order', outcome: 'skipped', submittedAt: '2026-01-01T00:02:00.000Z' });
  state = submitSessionAnswer(state, session.id, { questionId: 'q-sister', outcome: 'unanswered', submittedAt: '2026-01-01T00:03:00.000Z' });
  assert.equal(state.attempts.length, 1);
  assert.deepEqual(state.sessions?.[0].answers.map((answer) => answer.outcome), ['wrong', 'skipped', 'unanswered']);
  assert.equal(state.sessions?.[0].answers.length, 3);
});