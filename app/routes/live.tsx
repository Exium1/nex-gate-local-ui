import FullscreenShell from "~/components/Fullscreen/FullscreenShell/FullscreenShell";
import type { Route } from "./+types/home";
import ActionBar from "~/components/ActionBar/ActionBar";
import StatsBar from "~/components/StatsBar/StatsBar";
import Header from "~/components/Header/Header";
import Divider from "~/components/Divider/Divider";
import GateBase from "~/components/Gates/GateBase/GateBase";
import GateTimed, { type GateTimedProps } from "~/components/Gates/GateTimed/GateTimed";
import { useState } from "react";
import GatesCarousel from "~/components/Gates/GatesCarousel/GatesCarousel";
import GatesLive from "~/components/Gates/GatesLive/GatesLive";
import Button from "~/components/Button/Button";
import { FaPause, FaPlay } from "react-icons/fa6";
import { route } from "@react-router/dev/routes";
import { useNavigate } from "react-router";
import { useRace } from "~/context/RaceContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Live - NexGate" }
  ];
}

type SessionSettings = {
  audio: "audio_on" | "audio_only_lap" | "audio_off";
  mode: "time_trial" | "race";
  pilot: "pilot" | "exium" | "ocales";
}

export default function Live() {

  // const [activeGateIndex, setActiveGateIndex] = useState(0);
  const [sessionPaused, setSessionPaused] = useState(false);
  const navigate = useNavigate();

  const endSession = () => {
    if (confirm("Would you like to end the session?")) {
      console.log("Session ended");
      navigate("/results");
    }
  }

  const { gatesData } = useRace();

  return (
    <FullscreenShell
      header={<Header title="Home Circuit"/>}
      footer={
        <>
          <StatsBar 
            leftStats={[
              { label: "Best Lap", value: "32.334" },
              { label: "Lap Count", value: "5" },
            ]}
            centerStat={{ label: "Lap Time", values: ["34.456", "35.456", "36.456"] }}
            rightStats={[
              { label: "Personal Best", value: "32.334" },
              { label: "Session", value: "1:23" },
            ]}
          />
          <Divider />
          <ActionBar
            primaryActions={
              <>
                <Button variant="solid" color="danger" size="md" onClick={endSession}>End</Button>
                <Button variant="plain" color="neutral" size="md" onClick={() => setSessionPaused(!sessionPaused)}>
                  {sessionPaused ? <FaPlay /> : <FaPause />} {sessionPaused ? "Resume" : "Pause"}
                </Button>
              </>
            }
          />
        </>
      }
    >
      <GatesLive
        gates={gatesData.gates}
        activeGateIndex={gatesData.expectedGateId}
      />
    </FullscreenShell>
  );
}
