import { useState, useRef, useEffect } from "react";

export function useTimer() {
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  const start = () => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    startTimeRef.current = performance.now();
    setElapsedMs(0);
    intervalRef.current = setInterval(() => {
      setElapsedMs(performance.now() - startTimeRef.current!);
    }, 10);
  };

  const stop = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    stop();
    setElapsedMs(null);
  };

  return { elapsedMs, start, stop, reset };
}