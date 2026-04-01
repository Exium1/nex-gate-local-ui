import type { GateData, GateDataDummy } from "~/context/RaceContext";
import GateBase from "../GateBase/GateBase";
import GatesCarousel from "../GatesCarousel/GatesCarousel";
import "./GatesLive.scss"
import { useEffect, useRef, useState } from "react";

export type GatesLiveProps = {
  gates: (GateData | GateDataDummy)[]; // Active gate will be centered
  activeGateIndex: number;
}

export default function GatesLive({ gates, activeGateIndex }: GatesLiveProps) {
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {

    if(activeGateIndex == 0 && !('intervalMs' in gates[gates.length - 1])) return;
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
  }, [activeGateIndex]);

  const display = elapsedMs === null
    ? "Waiting for lap start..."
    : (elapsedMs / 1000).toFixed(3);

  return (
    <div className="gates-live">
      <span>Gate {activeGateIndex}</span>
      <GateBase
        size="xl"
        text={display}
        className="gates-live__main"
      />
      <GatesCarousel gates={gates} activeGateIndex={activeGateIndex} />
    </div>
  );
}