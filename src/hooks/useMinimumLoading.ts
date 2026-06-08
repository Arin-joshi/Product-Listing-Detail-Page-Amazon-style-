import { useState, useEffect, useRef } from 'react';

export function useMinimumLoading(isLoading: boolean, minimumTime = 800) {
  const [showLoading, setShowLoading] = useState(isLoading);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
      startTimeRef.current = Date.now();
    } else {
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed >= minimumTime || startTimeRef.current === 0) {
        setShowLoading(false);
      } else {
        const remaining = minimumTime - elapsed;
        const timer = setTimeout(() => {
          setShowLoading(false);
        }, remaining);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, minimumTime]);

  return showLoading;
}
