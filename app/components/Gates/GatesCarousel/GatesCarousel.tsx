import GateTimed from "../GateTimed/GateTimed";
import "./GatesCarousel.scss"
import type { GateData } from "~/types/gates";

export type GatesCarouselProps = {
  gateHistory: GateData[]; 
  gateCount: number
  expectedGateId: number; // Active (next/expected) gate will be centered
}

export default function GatesCarousel({ gateHistory, gateCount, expectedGateId }: GatesCarouselProps) {

  const visibleGatesCount = 9; // Odd number to center (NOT related to gate count)
  const visibleGatesSideCount = Math.floor(visibleGatesCount / 2);
  const visibleGates: GateData[] = gateHistory.slice(-1 * visibleGatesSideCount);
  const dummyGates = new Array(visibleGatesSideCount - visibleGates.length).fill(1);
  const futureGateIds = [];

  while (futureGateIds.length < visibleGatesSideCount + 1) {
    futureGateIds.push((expectedGateId + (futureGateIds.length)) % gateCount);
  }

  return (
    <div className="gates-carousel">
      {dummyGates.map((_, index) => (
        <GateTimed
          key={index}
          number={index}
          size="xs"
          className="hidden"
        />
      ))}
      {visibleGates.map((gate, index) => (
        <GateTimed
          key={index}
          subtitle={gate.intervalMs ?? "—"}
          number={gate.gateId}
          x={gate.beamX}
          y={gate.beamY}
          color={gate.color}
          size="xs"
        />
      ))}
      {futureGateIds.map((id, index) => (
        <GateTimed
          key={index}
          subtitle={"—"}
          number={id}
          size="xs"
          active={index === 0}
        />
      ))}
    </div>
  )
}