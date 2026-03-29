import "./LapViewer.scss"
import { FaAngleDown } from "react-icons/fa6";
import ButtonSelector from "../ButtonSelector/ButtonSelector";
import GateTimed from "../Gates/GateTimed/GateTimed";
import { useSearchParams } from "react-router";

export type LapViewerProps = {
  lap: number;
  pilot: string;
};

const mockLapData = {
  "default": {
    time: "01:23.456",
    gates: [
      { number: 1, color: "red", time: "12.345" },
      { number: 2, color: "green", time: "11.234" },
      { number: 3, color: "blue", time: "10.123" },
      { number: 4, color: "yellow", time: "9.012" },
      { number: 5, color: "purple", time: "8.901", finishLine: true },
    ]
  },
  "exium": {
    time: "01:30.789",
    gates: [
      { number: 1, color: "red", time: "15.678" },
      { number: 2, color: "green", time: "14.567" },
      { number: 3, color: "blue", time: "13.456" },
      { number: 4, color: "yellow", time: "12.345" },
      { number: 5, color: "purple", time: "11.234", finishLine: true },
    ]
  }
}

export default function LapViewer({ lap, pilot }: LapViewerProps) {

  const [searchParams, setSearchParams] = useSearchParams();
  const lapData = mockLapData[pilot.toLowerCase()] || mockLapData["default"];

  function updateLap(newLap: number) {
    searchParams.set("lap", newLap.toString());
    setSearchParams(searchParams);
  }

  return (
    <div className="lap-viewer">
      <ButtonSelector options={[
          { value: "1", label: "Lap 1", presented: "Lap 1", icon: <FaAngleDown /> },
          { value: "2", label: "Lap 2", presented: "Lap 2", icon: <FaAngleDown /> },
          { value: "3", label: "Lap 3", presented: "Lap 3", icon: <FaAngleDown /> },
          { value: "4", label: "Lap 4", presented: "Lap 4", icon: <FaAngleDown /> },
        ]}
        selectedOptionIndex={Number(lap) - 1}
        onOptionChange={(option) => {
          updateLap(parseInt(option.value));
        }}
        iconPosition="right"
        className="lap-selector"
      />
      <div className="stats">
        <span>Time</span>
        <span>{lapData.time}</span>
      </div>
      <div className="lap-list">
        <GateTimed number={1} size="sm"/>
        <GateTimed number={2} color="green" size="sm" subtitle="1.234"/>
        <GateTimed number={3} color="purple" size="sm" subtitle="1.234"/>
        <GateTimed number={4} color="yellow" size="sm" subtitle="1.234"/>
        <GateTimed number={5} color="yellow" size="sm" subtitle="1.234" finishLine />
      </div>
    </div>
  );
}