import type { GateData, GateDataDummy } from "~/context/RaceContext";
import GateTimed from "../GateTimed/GateTimed";
import "./GatesCarousel.scss"

export type GatesCarouselProps = {
  gates: (GateData | GateDataDummy)[]; // Active gate will be centered
  activeGateIndex: number;
}

export default function GatesCarousel({ gates, activeGateIndex }: GatesCarouselProps) {

  const visibleGatesCount = 9; // Odd number to center (NOT related to gate count)
  const visibleGates: (GateData | GateDataDummy)[] = [];

  // Circular logic
  var i = 0;
  while (i < visibleGatesCount) {
    const index = (activeGateIndex - Math.floor(visibleGatesCount / 2) + i + gates.length) % gates.length;
    if (index >= 0 && index < gates.length) {
      visibleGates.push(gates[index]);
    }
    i++;
  }

  return (
    <div className="gates-carousel">
      {visibleGates.map((gate, index) => (
        index >= Math.floor(visibleGatesCount / 2) ? (
          <GateTimed
            key={index}
            subtitle={"-"}
            number={gate?.gateId}
            size="xs"
            active={index === Math.floor(visibleGatesCount / 2)} // This works ??
          />
        ) : (
          <GateTimed
            key={index}
            subtitle={'intervalMs' in gate ? gate.intervalMs : "-"}
            number={gate?.gateId} // Always there
            x={'beamX' in gate ? gate.beamX : undefined}
            y={'beamY' in gate ? gate.beamY : undefined}
            color={'color' in gate ? gate.color : undefined}
            size="xs"
            active={index === Math.floor(visibleGatesCount / 2)} // This works ??
          />
        )
      ))}
    </div>
  )
}