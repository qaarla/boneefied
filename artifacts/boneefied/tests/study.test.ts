import assert from 'node:assert/strict';
import test from 'node:test';
import type { Attempt, ContentCatalog, Question } from '../content/model.ts';
import type { StudyState } from '../content/study.ts';
import { answersMatch, validateContent } from '../content/validation.ts';
import { answerIsCorrect, applyAttempt, clearMissed, hydrateStudyState, isQuestionScorable, masteryState, selectQuestion, serializeStudyState } from '../content/study.ts';

const fixture: ContentCatalog = {
  sources: [{ id: 'fixture-source', filename: 'generated-fixture', hash: 'fixture', pageCount: 1, title: 'Neutral fixture', courseLabAssociation: null, sourceType: 'text', attributionLicenseStatus: 'test-only', notes: 'NON-PRODUCTION', verificationStatus: 'verified' }],
  modules: [{ id: 'fixture-module', title: 'Neutral fixture', ordering: 1, sourceIds: ['fixture-source'], visible: true, published: true, contentStatus: 'available' }],
  structures: [{ id: 'fixture-structure', canonicalName: 'alpha term', acceptedAliases: ['alpha'], moduleId: 'fixture-module', category: 'fixture', sourceId: 'fixture-source', sourcePage: 1, examPriority: false, verificationStatus: 'verified' }],
  assets: [],
  questions: [{ id: 'fixture-question', moduleId: 'fixture-module', structureIds: ['fixture-structure'], taskType: 'typed-recall', prompt: 'Name the fictional term.', answer: 'alpha term', acceptedAliases: ['alpha'], sourceId: 'fixture-source', sourcePage: 1, examPriority: false, verificationStatus: 'verified' }],
  pathways: [],
};
const attempt = (correct: boolean, id = `${correct}`): Attempt => ({ id, questionId: 'fixture-question', structureId: 'fixture-structure', correct, answer: correct ? 'alpha' : 'wrong', createdAt: '2026-01-01T00:00:00.000Z' });

test('fixture validates, gates, and selects only verified questions', () => {
  assert.deepEqual(validateContent(fixture), []);
  assert.equal(isQuestionScorable(fixture.questions[0], fixture), true);
  assert.equal(selectQuestion(fixture, 'fixture-module').length, 1);
});
test('validation catches duplicate IDs, missing references, and hotspot bounds', () => {
  const broken = { ...fixture, questions: [{ ...fixture.questions[0], id: 'fixture-structure', structureIds: ['missing'], hotspots: [{ x: 2, y: .5, radius: .1, structureId: 'missing' }] }] };
  const issues = validateContent(broken);
  assert.ok(issues.some((issue) => issue.code === 'duplicate-id'));
  assert.ok(issues.some((issue) => issue.code === 'missing-structure'));
  assert.ok(issues.some((issue) => issue.code === 'invalid-hotspot'));
});
test('answers require explicit answer or alias and normalize punctuation', () => {
  assert.equal(answersMatch(' Alpha! ', 'alpha term', ['alpha']), true);
  assert.equal(answersMatch('beta', 'alpha term', ['alpha']), false);
});
test('ordered sequences are positional while select-all remains set-based', () => {
  const ordered: Question = { ...fixture.questions[0], taskType: 'ordered-sequence', answer: ['first', 'second'], options: ['second', 'first'] };
  assert.equal(answerIsCorrect(['first', 'second'], ordered), true);
  assert.equal(answerIsCorrect(['second', 'first'], ordered), false);
  const selectAll: Question = { ...fixture.questions[0], taskType: 'select-all', answer: ['first', 'second'], options: ['first', 'second'] };
  assert.equal(answerIsCorrect(['second', 'first'], selectAll), true);
});
test('scoring preserves history, retries missed items, and transitions mastery deterministically', () => {
  let state: StudyState = { attempts: [], missed: [], mastery: [] };
  state = applyAttempt(state, attempt(false, 'wrong-1'));
  state = applyAttempt(state, attempt(false, 'wrong-2'));
  assert.equal(state.missed[0].incorrectCount, 2);
  assert.equal(state.mastery[0].state, 'Needs Review');
  state = applyAttempt(state, attempt(true, 'right-1'));
  assert.equal(state.missed.length, 0);
  assert.equal(state.attempts.length, 3);
  assert.equal(masteryState(8, 8, 0), 'Mastered');
  assert.equal(masteryState(4, 3, 1), 'Strong');
  assert.equal(masteryState(1, 0, 1), 'Needs Review');
  assert.equal(clearMissed(state, 'not-present').attempts.length, 3);
});
test('offline state serializes and safely hydrates corrupted data', () => {
  let state = applyAttempt({ attempts: [], missed: [], mastery: [] }, attempt(false));
  assert.deepEqual(hydrateStudyState(serializeStudyState(state)), state);
  assert.deepEqual(hydrateStudyState('{bad'), { attempts: [], missed: [], mastery: [] });
});