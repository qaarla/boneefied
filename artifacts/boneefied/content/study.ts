import type { Attempt, MasteryRecord, MasteryState, MissedItem, Question, ContentCatalog, PracticeSession, SessionAnswer } from './model';

export type StudyState = { attempts: Attempt[]; missed: MissedItem[]; mastery: MasteryRecord[]; sessions?: PracticeSession[] };
export type ProgressRollup = {
  id: string;
  moduleId: string;
  title: string;
  kind: 'module' | 'lesson';
  structureCount: number;
  coveredCount: number;
  attempts: number;
  correct: number;
  accuracy: number | null;
};
export type ProgressRollups = { modules: ProgressRollup[]; lessons: ProgressRollup[] };
export const emptyStudyState: StudyState = { attempts: [], missed: [], mastery: [] };

export function resolvePublishedModule(catalog: ContentCatalog, moduleId: string | undefined) {
  return catalog.modules.find((module) => module.id === moduleId && module.published);
}

/**
 * Assigns each attempt to one canonical structure before aggregating it. This
 * matters for questions (such as select-all) which reference several
 * structures, but represent one submitted attempt.
 */
export function progressRollups(
  catalog: ContentCatalog,
  attempts: Attempt[],
  mastery: MasteryRecord[],
): ProgressRollups {
  const canonical = new Map(catalog.structures.map((structure) => [structure.id, structure]));
  const questions = new Map(catalog.questions.map((question) => [question.id, question]));
  const attemptByStructure = new Map<string, { attempts: number; correct: number }>();
  for (const attempt of attempts) {
    const question = questions.get(attempt.questionId);
    const structureId = (attempt.structureId && canonical.has(attempt.structureId))
      ? attempt.structureId
      : question?.structureIds.find((id) => canonical.has(id));
    if (!structureId) continue;
    const previous = attemptByStructure.get(structureId) ?? { attempts: 0, correct: 0 };
    previous.attempts += 1;
    if (attempt.correct) previous.correct += 1;
    attemptByStructure.set(structureId, previous);
  }
  const mastered = new Set(
    mastery.filter((record) => canonical.has(record.structureId)).map((record) => record.structureId),
  );
  const moduleRollups = catalog.modules.filter((module) => module.published).map((module) => {
    const structureIds = new Set(catalog.structures.filter((structure) => structure.moduleId === module.id).map((structure) => structure.id));
    return makeProgressRollup(module.id, module.id, module.title, 'module', structureIds, attemptByStructure, mastered);
  });
  const lessonRollups = catalog.modules.filter((module) => module.published).flatMap((module) =>
    (module.lessons ?? []).map((lesson) => makeProgressRollup(
      lesson.id, module.id, lesson.title, 'lesson',
      new Set(lesson.structureIds.filter((id) => canonical.has(id))),
      attemptByStructure, mastered,
    )),
  );
  return { modules: moduleRollups, lessons: lessonRollups };
}

function makeProgressRollup(
  id: string,
  moduleId: string,
  title: string,
  kind: ProgressRollup['kind'],
  structureIds: Set<string>,
  attempts: Map<string, { attempts: number; correct: number }>,
  mastered: Set<string>,
): ProgressRollup {
  let attemptCount = 0;
  let correct = 0;
  for (const structureId of structureIds) {
    const result = attempts.get(structureId);
    if (result) {
      attemptCount += result.attempts;
      correct += result.correct;
    }
  }
  const coveredCount = [...structureIds].filter((id) => mastered.has(id) || attempts.has(id)).length;
  return {
    id, moduleId, title, kind, structureCount: structureIds.size, coveredCount,
    attempts: attemptCount, correct, accuracy: attemptCount ? correct / attemptCount : null,
  };
}
export function upsertSession(state: StudyState, session: PracticeSession): StudyState {
  const sessions = [...(state.sessions ?? [])];
  const index = sessions.findIndex((item) => item.id === session.id);
  if (index >= 0) sessions[index] = session; else sessions.push(session);
  return { ...state, sessions };
}

export function createPracticeSession(
  moduleId: string,
  questionIds: string[],
  entryPoint: PracticeSession['entryPoint'] = 'practice',
  now = new Date().toISOString(),
  id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
): PracticeSession {
  return {
    id,
    moduleId,
    mode: 'practice',
    entryPoint,
    questionIds: [...new Set(questionIds)],
    position: 0,
    answers: [],
    startedAt: now,
    updatedAt: now,
    status: 'active',
  };
}
export function submitSessionAnswer(state: StudyState, sessionId: string, answer: SessionAnswer, attempt?: Attempt): StudyState {
  const session = (state.sessions ?? []).find((item) => item.id === sessionId);
  if (!session || session.status === 'completed' || session.answers.some((item) => item.questionId === answer.questionId && item.outcome !== 'unanswered')) return state;
  const { draft: _draft, ...withoutDraft } = session;
  const next = { ...withoutDraft, answers: [...session.answers, answer], position: Math.min(session.position + 1, session.questionIds.length), updatedAt: answer.submittedAt ?? new Date().toISOString() };
  const withSession = upsertSession(state, next);
  return attempt ? applyAttempt(withSession, attempt) : withSession;
}
export function completeSession(state: StudyState, sessionId: string, completedAt = new Date().toISOString()): StudyState {
  const session = (state.sessions ?? []).find((item) => item.id === sessionId);
  if (!session) return state;
  const { draft: _draft, ...withoutDraft } = session;
  return upsertSession(state, { ...withoutDraft, status: 'completed', position: session.questionIds.length, completedAt, updatedAt: completedAt });
}

function normalizeAnswer(value: string): string {
  return value.normalize('NFKC').trim().toLocaleLowerCase().replace(/[.,!?;:'"()[\]{}]/g, '').replace(/\s+/g, ' ');
}

function answersMatch(input: string, answer: string, aliases: string[] = []): boolean {
  const normalized = normalizeAnswer(input);
  return [answer, ...aliases].some((candidate) => normalizeAnswer(candidate) === normalized);
}
export { answersMatch, normalizeAnswer };
export function answerIsCorrect(input: string | string[] | undefined, question: Pick<Question, 'answer' | 'acceptedAliases' | 'taskType'>): boolean {
  if (input === undefined) return false;
  if (Array.isArray(question.answer)) {
    if (!Array.isArray(input) || input.length !== question.answer.length) return false;
    const expected = question.answer;
    if (question.taskType === 'ordered-sequence') {
      return expected.every((answer: string, index: number) => answersMatch(input[index], answer, question.acceptedAliases));
    }
    return expected.every((answer: string) => input.some((candidate) => answersMatch(candidate, answer, question.acceptedAliases)))
      && input.every((candidate) => expected.some((answer: string) => answersMatch(candidate, answer, question.acceptedAliases)));
  }
  return typeof input === 'string' && answersMatch(input, question.answer, question.acceptedAliases);
}
export function checkAnswer(input: string, question: Pick<Question, 'answer' | 'acceptedAliases' | 'taskType'>): boolean {
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