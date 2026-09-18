import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Attempt, MasteryRecord, MissedItem } from '@/content/model';
import { applyAttempt, clearMissed as clearMissedState, emptyStudyState, hydrateStudyState, serializeStudyState } from '@/content/study';

const STORAGE_KEY = '@boneefied/study-state-v1';
type StoredState = { attempts: Attempt[]; missed: MissedItem[]; mastery: MasteryRecord[] };
type StudyContextValue = StoredState & {
  hydrated: boolean;
  recordAnswer: (attempt: Omit<Attempt, 'id' | 'createdAt'>) => void;
  clearMissed: (questionId: string) => void;
};
const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoredState>(emptyStudyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        setState(hydrateStudyState(raw));
      }
      setHydrated(true);
    }).catch(() => setHydrated(true));
  }, []);
  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, serializeStudyState(state)).catch(() => undefined);
  }, [hydrated, state]);

  const value = useMemo<StudyContextValue>(() => ({
    ...state,
    hydrated,
    recordAnswer: (input) => setState((current) => {
      const now = new Date().toISOString();
      const attempt: Attempt = { ...input, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: now };
      return applyAttempt(current, attempt);
    }),
    clearMissed: (questionId) => setState((current) => clearMissedState(current, questionId)),
  }), [hydrated, state]);
  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const value = useContext(StudyContext);
  if (!value) throw new Error('useStudy must be used within StudyProvider');
  return value;
}