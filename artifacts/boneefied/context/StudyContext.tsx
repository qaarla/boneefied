import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Attempt, MasteryRecord, MissedItem, PracticeSession, SessionAnswer } from '@/content/model';
import { applyAttempt, clearMissed as clearMissedState, emptyStudyState, hydrateStudyState, upsertSession, submitSessionAnswer, completeSession } from '@/content/study';

const STORAGE_KEY = '@boneefied/study-state-v1';
export type Preferences = { theme: 'system' | 'light' | 'dark'; textScale: 'small' | 'default' | 'large'; haptics: boolean; defaultCount: number };
type StoredState = { attempts: Attempt[]; missed: MissedItem[]; mastery: MasteryRecord[]; bookmarks: string[]; sessions: PracticeSession[]; preferences: Preferences };
type StudyContextValue = StoredState & {
  hydrated: boolean;
  recordAnswer: (attempt: Omit<Attempt, 'id' | 'createdAt'>) => void;
  clearMissed: (questionId: string) => void;
  bookmarks: string[];
  toggleBookmark: (structureId: string) => void;
  resetLocalState: () => void;
  sessions: PracticeSession[];
  saveSession: (session: PracticeSession) => void;
  submitSessionAnswer: (sessionId: string, answer: SessionAnswer, attempt?: Omit<Attempt, 'id' | 'createdAt'>) => void;
  completeSession: (sessionId: string) => void;
  preferences: Preferences;
  updatePreferences: (patch: Partial<Preferences>) => void;
  saveError: string | null;
  retrySave: () => void;
};
const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoredState>({ ...emptyStudyState, bookmarks: [], sessions: [], preferences: { theme: 'system', textScale: 'default', haptics: true, defaultCount: 5 } });
  const [hydrated, setHydrated] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try { const parsed = JSON.parse(raw) as Partial<StoredState>; setState({ ...hydrateStudyState(raw), bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [], sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [], preferences: { theme: 'system', textScale: 'default', haptics: true, defaultCount: 5, ...(parsed.preferences ?? {}) } }); } catch { /* hydration helper handles malformed study state */ }
      }
      setHydrated(true);
    }).catch(() => setHydrated(true));
  }, []);
  useEffect(() => {
    if (hydrated) {
      const snapshot = JSON.stringify(state);
      writeQueue.current = writeQueue.current.catch(() => undefined)
        .then(() => AsyncStorage.setItem(STORAGE_KEY, snapshot))
        .then(() => setSaveError(null))
        .catch(() => setSaveError('Local save failed. Retry to protect your offline progress.'));
    }
  }, [hydrated, state]);
  const retrySave = () => {
    const snapshot = JSON.stringify(state);
    writeQueue.current = writeQueue.current.catch(() => undefined)
      .then(() => AsyncStorage.setItem(STORAGE_KEY, snapshot))
      .then(() => setSaveError(null))
      .catch(() => setSaveError('Local save failed again.'));
  };

  const value = useMemo<StudyContextValue>(() => ({
    ...state,
    hydrated,
    recordAnswer: (input) => setState((current) => {
      const now = new Date().toISOString();
      const attempt: Attempt = { ...input, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: now };
      return { ...applyAttempt(current, attempt), bookmarks: current.bookmarks, sessions: current.sessions, preferences: current.preferences };
    }),
    clearMissed: (questionId) => setState((current) => ({ ...clearMissedState(current, questionId), bookmarks: current.bookmarks, sessions: current.sessions, preferences: current.preferences })),
    bookmarks: state.bookmarks,
    toggleBookmark: (structureId) => setState((current) => ({ ...current, bookmarks: current.bookmarks.includes(structureId) ? current.bookmarks.filter((id) => id !== structureId) : [...current.bookmarks, structureId] })),
    resetLocalState: () => setState({ ...emptyStudyState, bookmarks: [], sessions: [], preferences: { theme: 'system', textScale: 'default', haptics: true, defaultCount: 5 } }),
    sessions: state.sessions,
    saveSession: (session) => setState((current) => ({ ...current, ...upsertSession(current, session) })),
    submitSessionAnswer: (sessionId, answer, input) => setState((current) => {
      const attempt = input ? { ...input, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString() } : undefined;
      return { ...current, ...submitSessionAnswer(current, sessionId, answer, attempt) };
    }),
    completeSession: (sessionId) => setState((current) => ({ ...current, ...completeSession(current, sessionId) })),
    preferences: state.preferences,
    updatePreferences: (patch) => setState((current) => ({ ...current, preferences: { ...current.preferences, ...patch } })),
    saveError,
    retrySave,
  }), [hydrated, state, saveError]);
  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const value = useContext(StudyContext);
  if (!value) throw new Error('useStudy must be used within StudyProvider');
  return value;
}

export function useOptionalStudy() {
  return useContext(StudyContext);
}