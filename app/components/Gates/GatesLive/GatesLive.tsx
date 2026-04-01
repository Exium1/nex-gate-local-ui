import type { GateData } from "~/types/gates";
import GateBase from "../GateBase/GateBase";
import GatesCarousel from "../GatesCarousel/GatesCarousel";
import "./GatesLive.scss"
import { useEffect, useRef, useState } from "react";

export type GatesLiveProps = {
  gateHistory: GateData[]; 
  gateCount: number
  expectedGateId: number; // Active (next/expected) gate will be centered
}

export default function GatesLive({ gateHistory, gateCount, expectedGateId }: GatesLiveProps) {
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {

    if (gateHistory.length === 0) return; // No entries (lap hasn't started)

    // Clear any previous interval
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    startTimeRef.current = performance.now();
    setElapsedMs(0);

    intervalRef.current = setInterval(() => {
      setElapsedMs(performance.now() - startTimeRef.current!);
    }, 10);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gateHistory, expectedGateId]);

  const display = elapsedMs === null
    ? "—"
    : (elapsedMs / 1000).toFixed(3);

  return (
    <div className="gates-live">
      <span>Gate {expectedGateId}</span>
      <GateBase
        size="xl"
        text={display}
        className="gates-live__main"
      />
      <GatesCarousel
        gateHistory={gateHistory}
        gateCount={gateCount}
        expectedGateId={expectedGateId}
      />
    </div>
  );
}