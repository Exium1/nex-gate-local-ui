import "./GateBase.scss";
import { FaFlagCheckered } from "react-icons/fa6";

export type GateBaseProps = {
  x?: number; // Percentage from the left
  y?: number; // Percentage from the top
  color?: "purple" | "yellow" | "green" | "red" | "neutral";
  size?: "xs" |"sm" | "md" | "lg" | "xl";
  text?: string;
  active?: boolean;
  finishLine?: boolean;
  className?: string;
}

export default function GateBase({ x, y, color = "neutral", size = "sm", text, active = false, finishLine = false, className = "" }: GateBaseProps) {
  let pointMargin = "0.25rem";

  switch (size) {
    case "xs":
      pointMargin = "0.2rem";
      break;
    case "sm":
      pointMargin = "0.25rem";
      break;
    case "md":
      pointMargin = "0.3rem";
      break;
    case "lg":
      pointMargin = "0.4rem";
      break;
    case "xl":
      pointMargin = "0.5rem";
      break;
  }

  return (
    <div 
      className={`gate-base gate-base--${color} gate-base--${size} ${active ? 'gate-base--active' : ''} ${className}`}
    >
      {x !== undefined && y !== undefined && (
        <span
          className="point"
          style={{
            left: `clamp(${pointMargin}, ${x}%, calc(100% - ${pointMargin}))`,
            bottom: `clamp(${pointMargin}, ${y}%, calc(100% - ${pointMargin}))` }} 
        />
      )}
      <span className="gate-base__text">{finishLine ? <FaFlagCheckered /> : text}</span>
    </div>
  );
}