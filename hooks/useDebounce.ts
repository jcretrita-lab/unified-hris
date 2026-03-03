import { useState, useEffect } from 'react';

/**
 * Debounces a value by the given delay (default 300ms).
 * Returns the debounced value, which only updates after the delay
 * has elapsed without a new value being provided.
 */
function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
