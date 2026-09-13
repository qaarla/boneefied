import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Attempt, MasteryRecord, MasteryState, MissedItem } from '@/content/model';

const STORAGE_KEY = '@boneefied/study-state-v1';
type StoredState = { attempts: Attempt[]; missed: MissedItem[]; mastery: MasteryRecord[] };
const emptyState: StoredState = { attempts: [], missed: [], mastery: [] };

function nextMastery(attempts: number, correct: number, incorrect: number): MasteryState {
  if (attempts === 0) return 'New';
  const accuracy = correct / attempts;
  if (attempts >= 8 && accuracy >= 0.9) return 'Mastered';
  if (attempts >= 4 && accuracy >= 0.75) return 'Strong';
  if (incorrect > correct || accuracy < 0.6) return 'Needs Review';
  return 'Learning';
}

type StudyContextValue = StoredState & {
  hydrated: boolean;
  recordAnswer: (attempt: Omit<Attempt, 'id' | 'createdAt'>) => void;
  clearMissed: (questionId: string) => void;
};
const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoredState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try { setState({ ...emptyState, ...JSON.parse(raw) }); } catch { /* discard corrupt local state */ }
      }
      setHydrated(true);
    }).catch(() => setHydrated(true));
  }, []);
  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [hydrated, state]);

  const value = useMemo<StudyContextValue>(() => ({
    ...state,
    hydrated,
    recordAnswer: (input) => setState((current) => {
      const now = new Date().toISOString();
      const attempt: Attempt = { ...input, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: now };
      const attempts = [...current.attempts, attempt];
      const old = current.mastery.find((record) => record.structureId === input.structureId);
      const record: MasteryRecord | null = input.structureId ? {
        structureId: input.structureId,
        attempts: (old?.attempts ?? 0) + 1,
        correct: (old?.correct ?? 0) + (input.correct ? 1 : 0),
        incorrect: (old?.incorrect ?? 0) + (input.correct ? 0 : 1),
        state: nextMastery((old?.attempts ?? 0) + 1, (old?.correct ?? 0) + (input.correct ? 1 : 0), (old?.incorrect ?? 0) + (input.correct ? 0 : 1)),
        updatedAt: now,
      } : null;
      let missed = current.missed;
      if (!input.correct) {
        const existing = missed.find((item) => item.questionId === input.questionId);
        missed = existing
          ? missed.map((item) => item.questionId === input.questionId ? { ...item, incorrectCount: item.incorrectCount + 1, lastAttemptAt: now } : item)
          : [...missed, { questionId: input.questionId, structureId: input.structureId, incorrectCount: 1, lastAttemptAt: now }];
      } else {
        missed = missed.filter((item) => item.questionId !== input.questionId);
      }
      return { attempts, missed, mastery: record ? [...current.mastery.filter((item) => item.structureId !== record.structureId), record] : current.mastery };
    }),
    clearMissed: (questionId) => setState((current) => ({ ...current, missed: current.missed.filter((item) => item.questionId !== questionId) })),
  }), [hydrated, state]);
  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const value = useContext(StudyContext);
  if (!value) throw new Error('useStudy must be used within StudyProvider');
  return value;
}