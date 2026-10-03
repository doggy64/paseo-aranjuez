import { useState, useEffect } from "react";

export function useSaved<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setValue(JSON.parse(saved));
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, [key]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value, isLoaded]);

  return [value, setValue] as const;
}
