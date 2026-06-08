import { useState, useEffect } from 'react';

export function useMinimumLoading(isLoading: boolean, minimumTime = 800) {
  const [showLoading, setShowLoading] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
    } else {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, minimumTime);
      return () => clearTimeout(timer);
    }
  }, [isLoading, minimumTime]);

  return showLoading;
}
