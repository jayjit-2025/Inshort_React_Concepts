import { createContext, useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { CONCEPTS, CONCEPT_IDS } from '../concepts/registry';
import { useLocalStorage } from '../hooks/useLocalStorage';

type ProgressContextValue = {
  completedIds: string[];
  completedCount: number;
  total: number;
  isCompleted: (id: string) => boolean;
  markComplete: (id: string) => void;
  toggleComplete: (id: string) => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { value: storedIds, setValue: setStoredIds } = useLocalStorage<string[]>(
    'react-mastery-progress',
    []
  );

  const completedIds = useMemo(
    () => storedIds.filter((id) => CONCEPT_IDS.has(id)),
    [storedIds]
  );

  const markComplete = useCallback(
    (id: string) => {
      setStoredIds((previous) => (previous.includes(id) ? previous : [...previous, id]));
    },
    [setStoredIds]
  );

  const toggleComplete = useCallback(
    (id: string) => {
      setStoredIds((previous) =>
        previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
      );
    },
    [setStoredIds]
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      completedIds,
      completedCount: completedIds.length,
      total: CONCEPTS.length,
      isCompleted: (id: string) => completedIds.includes(id),
      markComplete,
      toggleComplete,
    }),
    [completedIds, markComplete, toggleComplete]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (context === null) {
    throw new Error('useProgress must be used inside a ProgressProvider');
  }
  return context;
}
