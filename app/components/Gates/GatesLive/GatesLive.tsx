import GateBase from "../GateBase/GateBase";
import GatesCarousel from "../GatesCarousel/GatesCarousel";
import type { GateTimedProps } from "../GateTimed/GateTimed";
import "./GatesLive.scss"

export type GatesLiveProps = {
  gates: GateTimedProps[]; // Active gate will be centered
  activeGateIndex: number;
}

export default function GatesLive({ gates, activeGateIndex }: GatesLiveProps) {
  return (
    <div className="gates-live">
      <span>Gate 3</span>
      <GateBase
        size="xl"
        text="Waiting for lap start..."
        className="gates-live__main"
      />
      <GatesCarousel
        gates={gates}
        activeGateIndex={activeGateIndex}
      />
    </div>
  );
}