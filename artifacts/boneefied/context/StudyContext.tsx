import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Attempt, PracticeSession, SessionAnswer } from '@/content/model';
import { applyAttempt, clearMissed as clearMissedState, emptyStudyState, upsertSession, submitSessionAnswer, completeSession } from '@/content/study';
import { createStudyStorage, initialStoredState, StudyLoadError, type Preferences, type StoredState } from './studyStorage';

export type { Preferences } from './studyStorage';
type StudyContextValue = StoredState & {
  hydrated: boolean;
  loadError: StudyLoadError['kind'] | null;
  retryLoad: () => void;
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
  const [state, setState] = useState<StoredState>(initialStoredState);
  const [loading, setLoading] = useState<{ status: 'loading' | 'ready' | 'error'; error: StudyLoadError['kind'] | null }>({ status: 'loading', error: null });
  const hydrated = loading.status === 'ready';
  const [saveError, setSaveError] = useState<string | null>(null);
  const [storage] = useState(() => createStudyStorage(AsyncStorage));

  const retryLoad = useCallback(() => {
    setLoading({ status: 'loading', error: null });
    void storage.load().then(loaded => {
      setState(loaded);
      setLoading({ status: 'ready', error: null });
    }).catch(error => {
      setLoading({ status: 'error', error: error instanceof StudyLoadError ? error.kind : 'read' });
    });
  }, [storage]);
  useEffect(() => { retryLoad(); }, [retryLoad]);
  useEffect(() => {
    if (hydrated) {
      void storage.save(state)
        .then(saved => { if (saved) setSaveError(null); })
        .catch(() => setSaveError('Local save failed. Retry to protect your offline progress.'));
    }
  }, [hydrated, state, storage]);
  const retrySave = () => {
    if (!hydrated) return;
    void storage.save(state)
      .then(saved => { if (saved) setSaveError(null); })
      .catch(() => setSaveError('Local save failed again.'));
  };

  const value = useMemo<StudyContextValue>(() => ({
    ...state,
    hydrated,
    loadError: loading.error,
    retryLoad,
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
  }), [hydrated, state, saveError, loading.error, retryLoad]);
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