import type { Attempt, MasteryRecord, MasteryState, MissedItem, Question, ContentCatalog, PracticeSession, SessionAnswer } from './model';

export type StudyState = { attempts: Attempt[]; missed: MissedItem[]; mastery: MasteryRecord[]; sessions?: PracticeSession[] };
export const emptyStudyState: StudyState = { attempts: [], missed: [], mastery: [] };
export function upsertSession(state: StudyState, session: PracticeSession): StudyState {
  const sessions = [...(state.sessions ?? [])];
  const index = sessions.findIndex((item) => item.id === session.id);
  if (index >= 0) sessions[index] = session; else sessions.push(session);
  return { ...state, sessions };
}
export function submitSessionAnswer(state: StudyState, sessionId: string, answer: SessionAnswer, attempt?: Attempt): StudyState {
  const session = (state.sessions ?? []).find((item) => item.id === sessionId);
  if (!session || session.status === 'completed' || session.answers.some((item) => item.questionId === answer.questionId && item.outcome !== 'unanswered')) return state;
  const next = { ...session, answers: [...session.answers, answer], position: Math.min(session.position + 1, session.questionIds.length), updatedAt: answer.submittedAt ?? new Date().toISOString() };
  const withSession = upsertSession(state, next);
  return attempt ? applyAttempt(withSession, attempt) : withSession;
}
export function completeSession(state: StudyState, sessionId: string, completedAt = new Date().toISOString()): StudyState {
  const session = (state.sessions ?? []).find((item) => item.id === sessionId);
  return session ? upsertSession(state, { ...session, status: 'completed', position: session.questionIds.length, completedAt, updatedAt: completedAt }) : state;
}

function normalizeAnswer(value: string): string {
  return value.normalize('NFKC').trim().toLocaleLowerCase().replace(/[.,!?;:'"()[\]{}]/g, '').replace(/\s+/g, ' ');
}

function answersMatch(input: string, answer: string, aliases: string[] = []): boolean {
  const normalized = normalizeAnswer(input);
  return [answer, ...aliases].some((candidate) => normalizeAnswer(candidate) === normalized);
}
export { answersMatch, normalizeAnswer };
export function answerIsCorrect(input: string | string[] | undefined, question: Pick<Question, 'answer' | 'acceptedAliases'>): boolean {
  if (input === undefined) return false;
  if (Array.isArray(question.answer)) {
    if (!Array.isArray(input) || input.length !== question.answer.length) return false;
    const expected = question.answer;
    return expected.every((answer: string) => input.some((candidate) => answersMatch(candidate, answer, question.acceptedAliases)))
      && input.every((candidate) => expected.some((answer: string) => answersMatch(candidate, answer, question.acceptedAliases)));
  }
  return typeof input === 'string' && answersMatch(input, question.answer, question.acceptedAliases);
}
export function checkAnswer(input: string, question: Pick<Question, 'answer' | 'acceptedAliases'>): boolean {
  return answerIsCorrect(input, question);
}

export function isQuestionScorable(question: Question, catalog: ContentCatalog): boolean {
  const source = catalog.sources.find((item) => item.id === question.sourceId);
  const module = catalog.modules.find((item) => item.id === question.moduleId);
  return question.verificationStatus === 'verified'
    && !!source && source.verificationStatus === 'verified'
    && !!module && module.published && module.contentStatus === 'available'
    && question.structureIds.length > 0;
}

export function selectQuestion(catalog: ContentCatalog, moduleId: string, questionIds?: string[]): Question[] {
  return catalog.questions.filter((question) => question.moduleId === moduleId
    && (!questionIds || questionIds.includes(question.id))
    && isQuestionScorable(question, catalog));
}

export function normalizeStudyState(value: unknown): StudyState {
  if (!value || typeof value !== 'object') return emptyStudyState;
  const candidate = value as Partial<StudyState>;
  return {
    attempts: Array.isArray(candidate.attempts) ? candidate.attempts : [],
    missed: Array.isArray(candidate.missed) ? candidate.missed : [],
    mastery: Array.isArray(candidate.mastery) ? candidate.mastery : [],
    ...(Array.isArray(candidate.sessions) ? { sessions: candidate.sessions } : {}),
  };
}

export function serializeStudyState(state: StudyState): string {
  return JSON.stringify(state);
}

export function hydrateStudyState(raw: string | null): StudyState {
  if (!raw) return emptyStudyState;
  try { return normalizeStudyState(JSON.parse(raw)); } catch { return emptyStudyState; }
}

export function masteryState(attempts: number, correct: number, incorrect: number): MasteryState {
  if (attempts === 0) return 'New';
  const accuracy = correct / attempts;
  if (attempts >= 8 && accuracy >= 0.9) return 'Mastered';
  if (attempts >= 4 && accuracy >= 0.75) return 'Strong';
  if (incorrect > correct || accuracy < 0.6) return 'Needs Review';
  return 'Learning';
}

export function applyAttempt(state: StudyState, attempt: Attempt): StudyState {
  const attempts = [...state.attempts, attempt];
  const previous = attempt.structureId ? state.mastery.find((item) => item.structureId === attempt.structureId) : undefined;
  const mastery = attempt.structureId ? {
    structureId: attempt.structureId,
    attempts: (previous?.attempts ?? 0) + 1,
    correct: (previous?.correct ?? 0) + (attempt.correct ? 1 : 0),
    incorrect: (previous?.incorrect ?? 0) + (attempt.correct ? 0 : 1),
    state: masteryState(
      (previous?.attempts ?? 0) + 1,
      (previous?.correct ?? 0) + (attempt.correct ? 1 : 0),
      (previous?.incorrect ?? 0) + (attempt.correct ? 0 : 1),
    ),
    updatedAt: attempt.createdAt,
  } satisfies MasteryRecord : undefined;
  let missed = state.missed;
  if (attempt.correct) {
    missed = missed.filter((item) => item.questionId !== attempt.questionId);
  } else {
    const existing = missed.find((item) => item.questionId === attempt.questionId);
    missed = existing
      ? missed.map((item) => item.questionId === attempt.questionId ? { ...item, incorrectCount: item.incorrectCount + 1, lastAttemptAt: attempt.createdAt } : item)
      : [...missed, { questionId: attempt.questionId, structureId: attempt.structureId, incorrectCount: 1, lastAttemptAt: attempt.createdAt }];
  }
  return { attempts, missed, mastery: mastery ? [...state.mastery.filter((item) => item.structureId !== mastery.structureId), mastery] : state.mastery, ...(state.sessions ? { sessions: state.sessions } : {}) };
}

export function clearMissed(state: StudyState, questionId: string): StudyState {
  return { ...state, missed: state.missed.filter((item) => item.questionId !== questionId) };
}