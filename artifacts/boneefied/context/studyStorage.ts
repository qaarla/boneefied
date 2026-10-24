import type { Attempt, MasteryRecord, MissedItem, PracticeSession } from '../content/model.ts';

export const STUDY_STORAGE_KEY = '@boneefied/study-state-v1';
export type Preferences = { theme: 'system' | 'light' | 'dark'; textScale: 'small' | 'default' | 'large'; haptics: boolean; defaultCount: number };
export type StoredState = { attempts: Attempt[]; missed: MissedItem[]; mastery: MasteryRecord[]; bookmarks: string[]; sessions: PracticeSession[]; preferences: Preferences };

const defaultPreferences: Preferences = { theme: 'system', textScale: 'default', haptics: true, defaultCount: 5 };
export const initialStoredState = (): StoredState => ({
  attempts: [], missed: [], mastery: [], bookmarks: [], sessions: [], preferences: { ...defaultPreferences },
});

export class StudyLoadError extends Error {
  readonly kind: 'read' | 'invalid';
  constructor(kind: 'read' | 'invalid') {
    super(kind === 'read' ? 'Saved progress could not be read.' : 'Saved progress has an unsupported or damaged format.');
    this.name = 'StudyLoadError';
    this.kind = kind;
  }
}

type RecordValue = Record<string, unknown>;
const record = (value: unknown): value is RecordValue => typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown) => typeof value === 'string';
const count = (value: unknown) => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(text);
const answer = (value: unknown) => text(value) || strings(value);
const optional = (value: RecordValue, key: string, valid: (field: unknown) => boolean) => value[key] === undefined || valid(value[key]);
const list = (value: unknown, valid: (item: unknown) => boolean) => Array.isArray(value) && value.every(valid);
const oneOf = (value: unknown, choices: readonly unknown[]) => choices.includes(value);

const validAttempt = (v: unknown) => record(v) && text(v.id) && text(v.questionId)
  && optional(v, 'structureId', text) && typeof v.correct === 'boolean' && answer(v.answer) && text(v.createdAt);
const validMissed = (v: unknown) => record(v) && text(v.questionId) && optional(v, 'structureId', text)
  && count(v.incorrectCount) && text(v.lastAttemptAt);
const validMastery = (v: unknown) => record(v) && text(v.structureId)
  && oneOf(v.state, ['New', 'Learning', 'Needs Review', 'Strong', 'Mastered'])
  && count(v.attempts) && count(v.correct) && count(v.incorrect) && text(v.updatedAt);
const validSessionAnswer = (v: unknown) => record(v) && text(v.questionId)
  && optional(v, 'answer', answer) && optional(v, 'submittedAt', text)
  && oneOf(v.outcome, ['correct', 'wrong', 'skipped', 'unanswered']);
const validSession = (v: unknown) => record(v) && text(v.id) && text(v.moduleId)
  && oneOf(v.mode, ['practice', 'recall']) && oneOf(v.entryPoint, ['practice', 'missed', 'study'])
  && strings(v.questionIds) && count(v.position) && list(v.answers, validSessionAnswer)
  && text(v.startedAt) && text(v.updatedAt) && optional(v, 'completedAt', text)
  && oneOf(v.status, ['active', 'paused', 'completed'])
  && optional(v, 'draft', d => record(d) && text(d.questionId) && answer(d.answer));
const validPreferences = (v: unknown) => record(v)
  && optional(v, 'theme', theme => oneOf(theme, ['system', 'light', 'dark']))
  && optional(v, 'textScale', scale => oneOf(scale, ['small', 'default', 'large']))
  && optional(v, 'haptics', haptics => typeof haptics === 'boolean')
  && optional(v, 'defaultCount', count);

/** Validate before normalizing: a tolerant empty fallback must never authorize a write.
 * Legacy StudyState records have the three core arrays, without the optional additions.
 * Keep unknown extension fields and historical question IDs; do not translate drafts. */
export function decodeStoredState(raw: string | null): StoredState {
  if (raw === null) return initialStoredState();
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw new StudyLoadError('invalid'); }
  if (!record(parsed) || !list(parsed.attempts, validAttempt) || !list(parsed.missed, validMissed)
    || !list(parsed.mastery, validMastery) || !optional(parsed, 'bookmarks', strings)
    || !optional(parsed, 'sessions', v => list(v, validSession))
    || !optional(parsed, 'preferences', validPreferences)) throw new StudyLoadError('invalid');
  return {
    ...initialStoredState(),
    ...parsed,
    preferences: { ...defaultPreferences, ...(parsed.preferences as Partial<Preferences> | undefined) },
  } as StoredState;
}

type Storage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<unknown>;
};

/** One mount's read/write gate. All writes, including manual retries, pass here. */
export function createStudyStorage(storage: Storage) {
  let loaded: StoredState | undefined;
  let pending: Promise<StoredState> | undefined;
  let queue: Promise<unknown> = Promise.resolve();
  return {
    load(): Promise<StoredState> {
      if (loaded) return Promise.resolve(loaded);
      if (pending) return pending;
      pending = (async () => {
        let raw: string | null;
        try { raw = await storage.getItem(STUDY_STORAGE_KEY); } catch { throw new StudyLoadError('read'); }
        loaded = decodeStoredState(raw);
        return loaded;
      })().finally(() => { pending = undefined; });
      return pending;
    },
    async save(state: StoredState): Promise<boolean> {
      if (!loaded) return false;
      const snapshot = JSON.stringify(state);
      const next = queue.catch(() => undefined).then(async () => {
        await storage.setItem(STUDY_STORAGE_KEY, snapshot);
        return true;
      });
      queue = next;
      return next;
    },
  };
}
