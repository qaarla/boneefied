import type { Attempt, MasteryRecord, MasteryState, MissedItem, Question, ContentCatalog } from './model';

export type StudyState = { attempts: Attempt[]; missed: MissedItem[]; mastery: MasteryRecord[] };
export const emptyStudyState: StudyState = { attempts: [], missed: [], mastery: [] };

function normalizeAnswer(value: string): string {
  return value.normalize('NFKC').trim().toLocaleLowerCase().replace(/[.,!?;:'"()[\]{}]/g, '').replace(/\s+/g, ' ');
}

function answersMatch(input: string, answer: string, aliases: string[] = []): boolean {
  const normalized = normalizeAnswer(input);
  return [answer, ...aliases].some((candidate) => normalizeAnswer(candidate) === normalized);
}
export function checkAnswer(input: string, question: Pick<Question, 'answer' | 'acceptedAliases'>): boolean {
  if (Array.isArray(question.answer)) return question.answer.length === 1 && answersMatch(input, question.answer[0], question.acceptedAliases);
  return answersMatch(input, question.answer, question.acceptedAliases);
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
  return { attempts, missed, mastery: mastery ? [...state.mastery.filter((item) => item.structureId !== mastery.structureId), mastery] : state.mastery };
}

export function clearMissed(state: StudyState, questionId: string): StudyState {
  return { ...state, missed: state.missed.filter((item) => item.questionId !== questionId) };
}