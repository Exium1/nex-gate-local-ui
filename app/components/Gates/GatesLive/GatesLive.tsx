// import type { GateData } from "~/types/gates";
import type { EnrichedGateEvent } from "@exium1/nex-gate-local-shared";
import GateBase from "../GateBase/GateBase";
import GatesCarousel from "../GatesCarousel/GatesCarousel";
import "./GatesLive.scss"
import { useEffect, useRef, useState } from "react";
import { useTimer } from "~/hooks/useTimer";

export type GatesLiveProps = {
  gateHistory: EnrichedGateEvent[]; 
  gateCount: number
  expectedGateId: number; // Active (next/expected) gate will be centered
}

export default function GatesLive({ gateHistory, gateCount, expectedGateId }: GatesLiveProps) {
  const { elapsedMs, start } = useTimer();
  const display = elapsedMs === null ? "—" : (elapsedMs / 1000).toFixed(3);

  useEffect(() => {
    if (gateHistory.length === 0) return;
    start();
  }, [gateHistory, expectedGateId]);

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