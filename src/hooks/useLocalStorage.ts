import { useState, useEffect, useCallback } from 'react';

/**
 * Custom Hook for localStorage persistence with Lazy Initialization
 * Prevents initial state from overwriting localStorage data
 * Uses synchronous localStorage reads on mount to avoid race conditions
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // LAZY STATE INITIALIZATION: Read from localStorage BEFORE first render
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      
      if (item !== null) {
        // localStorage has data - ALWAYS use it (never overwrite)
        const parsed = JSON.parse(item);
        console.log(`[useLocalStorage] ✅ Loaded from localStorage [${key}]:`, parsed);
        return parsed;
      } else {
        // localStorage is empty - initialize with default value
        console.log(`[useLocalStorage] 📝 First time init [${key}]:`, initialValue);
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
    } catch (error) {
      console.error(`[useLocalStorage] ❌ Error reading [${key}]:`, error);
      return initialValue;
    }
  });

  // Wrapped setter to sync with localStorage
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function (like useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save to state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        console.log(`[useLocalStorage] 💾 Saved to localStorage [${key}]`, valueToStore);
      }
    } catch (error) {
      console.error(`[useLocalStorage] ❌ Error saving [${key}]:`, error);
    }
  }, [key, storedValue]);

  // Sync localStorage on storedValue change (backup mechanism)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(`[useLocalStorage] ❌ Error in sync effect [${key}]:`, error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}
