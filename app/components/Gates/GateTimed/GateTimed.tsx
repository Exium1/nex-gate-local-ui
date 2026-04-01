import "./GateTimed.scss";
import GateBase, { type GateBaseProps } from "../GateBase/GateBase";

export type GateTimedProps = {
  subtitle?: string;
  number: number;
} & Omit<GateBaseProps, 'text'>;

export default function GateTimed({ subtitle, number, ...gateBaseProps }: GateTimedProps) {
  return (
    <div className={`gate-timed`}>
      <GateBase
        text={number.toString()}
        {...gateBaseProps}
      />
      <span>{subtitle}</span>
    </div>
  )
}