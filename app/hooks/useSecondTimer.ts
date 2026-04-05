import { useState, useRef, useEffect } from "react";

export function useSecondTimer() {
  const [elapsedS, setElapsedS] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const offsetRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  const start = (fromSeconds: number = 0) => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    offsetRef.current = fromSeconds;
    startTimeRef.current = performance.now();
    setElapsedS(Math.floor(fromSeconds));
    intervalRef.current = setInterval(() => {
      const sinceStart = (performance.now() - startTimeRef.current!) / 1000;
      setElapsedS(Math.floor(offsetRef.current + sinceStart));
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    stop();
    offsetRef.current = 0;
    setElapsedS(null);
  };

  return { elapsedS, start, stop, reset };
}

export function formatElapsedS(elapsedS: number | null): string {
  if (elapsedS === null) return "--:--:--";
  const totalSeconds = Math.floor(elapsedS);
  const minutes = Math.floor((totalSeconds) / 60);
  const seconds = totalSeconds % 60;
  return [minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
}