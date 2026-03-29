import type { GateTimedProps } from "../GateTimed/GateTimed"
import GateTimed from "../GateTimed/GateTimed";
import "./GatesCarousel.scss"

export type GatesCarouselProps = {
  gates: GateTimedProps[]; // Active gate will be centered
  activeGateIndex: number;
}

export default function GatesCarousel({ gates, activeGateIndex }: GatesCarouselProps) {

  const visibleGatesCount = 7; // Odd number
  const visibleGates: GateTimedProps[] = [];

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
        <GateTimed
          key={index}
          {...gate}
          active={index === Math.floor(visibleGatesCount / 2)}
        />
      ))}
    </div>
  )
}