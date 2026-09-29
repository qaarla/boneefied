import assert from 'node:assert/strict';
import test from 'node:test';
import {
  completeSession, createPracticeSession, emptyStudyState, submitSessionAnswer, upsertSession,
} from '../content/study.ts';

test('raw drafts survive storage and submission clears only the draft, not the original answer', () => {
  const session = createPracticeSession('cytology-mitosis', ['q-cycle-order']);
  const draft = ['G1'];
  const state = upsertSession(emptyStudyState, {
    ...session, draft: { questionId: 'q-cycle-order', answer: draft },
  });
  const stored = JSON.parse(JSON.stringify(state));
  assert.deepEqual(stored.sessions[0].draft.answer, draft);
  const answered = submitSessionAnswer(stored, session.id, {
    questionId: 'q-cycle-order', answer: ['G1', 'S', 'G2'], outcome: 'correct',
  });
  assert.equal(answered.sessions[0].draft, undefined);
  assert.deepEqual(answered.sessions[0].answers[0].answer, ['G1', 'S', 'G2']);
  assert.equal(answered.sessions[0].position, 1);
  assert.equal(answered.sessions[0].status, 'active', 'last submitted question can still show feedback');
  const completed = completeSession(answered, session.id);
  assert.equal(completed.sessions[0].status, 'completed');
});