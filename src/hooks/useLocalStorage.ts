import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        return JSON.parse(raw) as T;
      }
    } catch {
      return initialValue;
    }
    return initialValue;
  });

  const [lastAction, setLastAction] = useState('initialized from storage or fallback');

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setLastAction(`saved to "${key}"`);
    } catch {
      setLastAction('storage unavailable — kept in memory only');
    }
  }, [key, value]);

  return { value, setValue, lastAction };
}
