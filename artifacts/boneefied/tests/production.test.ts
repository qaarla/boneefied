import assert from 'node:assert/strict';
import test from 'node:test';
import { content, CYTOLOGY_SOURCE_ID } from '../content/canonical.ts';
import { validateContent } from '../content/validation.ts';
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
  assert.equal(content.modules.length, 1);
  assert.equal(content.modules[0].id, 'cytology-mitosis');
  assert.equal(content.modules[0].published, true);
  assert.equal(content.modules[0].contentStatus, 'available');
  assert.equal(content.structures.length, 15);
  assert.equal(content.questions.length, 10);
  assert.equal(content.assets.length, 0);
  assert.equal(content.questions.filter((question) => question.hotspots?.length).length, 0);
  assert.equal(content.modules[0].sourceIds[0], CYTOLOGY_SOURCE_ID);
  const source = content.sources.find((item) => item.id === CYTOLOGY_SOURCE_ID);
  assert.ok(source);
  assert.equal(source?.sourceType, 'text');
  assert.match(source?.filename ?? '', /transcribed/i);
  assert.deepEqual([...new Set(content.questions.map((question) => question.sourcePage))].sort((a, b) => (a ?? 0) - (b ?? 0)), [5, 6, 7, 8, 11, 12]);
  assert.ok(content.questions.every((question) => question.sourceId === CYTOLOGY_SOURCE_ID));
  assert.ok(content.questions.every((question) => isQuestionScorable(question, content)));
});

test('production questions only expose supported text task types', () => {
  const supported = new Set(['multiple-choice', 'typed-recall', 'ordered-sequence', 'select-all']);
  assert.ok(content.questions.every((question) => supported.has(question.taskType)));
  assert.equal(content.questions.filter((question) => question.taskType === 'multiple-choice').length, 2);
  assert.equal(content.questions.filter((question) => question.taskType === 'typed-recall').length, 2);
  assert.equal(content.questions.filter((question) => question.taskType === 'ordered-sequence').length, 2);
  assert.equal(content.questions.filter((question) => question.taskType === 'select-all').length, 4);
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