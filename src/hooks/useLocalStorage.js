import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);

      if (stored !== null) {
        return JSON.parse(stored);
      }

      return typeof initialValue === "function"
        ? initialValue()
        : initialValue;
    } catch (error) {
      console.warn(`Could not read localStorage key "${key}"`, error);

      return typeof initialValue === "function"
        ? initialValue()
        : initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Could not save localStorage key "${key}"`, error);
    }
  }, [key, value]);

  return [value, setValue];
}