import assert from 'node:assert/strict';
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

test('production catalog validates with honest published counts and source provenance', () => {
  assert.deepEqual(validateContent(content), []);
  assert.equal(content.modules.filter((module) => module.published).length, 3);
  assert.equal(content.modules.find((module) => module.id === 'skeletal-system')?.contentStatus, 'available');
  assert.equal(content.structures.filter((structure) => structure.moduleId === 'skeletal-system').length, 108);
  assert.ok((content.modules.find((module) => module.id === 'skeletal-system')?.lessons?.length ?? 0) >= 8);
  assert.ok(content.structures.some((structure) => structure.id === 'external-acoustic-meatus'));
  assert.ok(content.structures.some((structure) => structure.id === 'lateral-malleolus'));
  assert.equal(content.questions.filter((question) => question.moduleId === 'skeletal-system').length, 12);
  assert.equal(content.questions.filter((question) => question.moduleId === 'anatomy-foundations').length, 3);
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
  const supported = new Set(['multiple-choice', 'typed-recall', 'ordered-sequence', 'select-all', 'bone-laterality', 'function-relationship']);
  assert.ok(content.questions.every((question) => supported.has(question.taskType)));
  assert.equal(content.questions.filter((question) => question.taskType === 'multiple-choice').length, 8);
  assert.equal(content.questions.filter((question) => question.taskType === 'typed-recall').length, 4);
  assert.equal(content.questions.filter((question) => question.taskType === 'ordered-sequence').length, 3);
  assert.equal(content.questions.filter((question) => question.taskType === 'select-all').length, 4);
  assert.equal(content.questions.filter((question) => question.taskType === 'bone-laterality').length, 3);
  assert.equal(content.questions.filter((question) => question.taskType === 'function-relationship').length, 3);
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