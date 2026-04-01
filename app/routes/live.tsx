import FullscreenShell from "~/components/Fullscreen/FullscreenShell/FullscreenShell";
import type { Route } from "./+types/home";
import ActionBar from "~/components/ActionBar/ActionBar";
import StatsBar from "~/components/StatsBar/StatsBar";
import Header from "~/components/Header/Header";
import Divider from "~/components/Divider/Divider";
import { useEffect, useRef, useState } from "react";
import GatesLive from "~/components/Gates/GatesLive/GatesLive";
import Button from "~/components/Button/Button";
import { FaPause, FaPlay } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { useRace } from "~/context/RaceContext";
import { useTimer } from "~/hooks/useTimer";

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

  const [sessionPaused, setSessionPaused] = useState(false);
  const navigate = useNavigate();
  const { gatesData, lapStats } = useRace();
  const { elapsedMs, start } = useTimer();
  const display = elapsedMs === null ? "—" : (elapsedMs / 1000).toFixed(3);

  useEffect(() => {
    // Request to join or something
  }, [])

  useEffect(() => {
    if (gatesData.gateHistory.length === 0) return;
    const lastGateId = gatesData.gateHistory[gatesData.gateHistory.length - 1].gateId;
    if (lastGateId === 0) start();
  }, [gatesData]);

  const endSession = () => {
    if (confirm("Would you like to end the session?")) {
      console.log("Session ended");
      navigate("/results");
    }
  }

  return (
    <FullscreenShell
      header={<Header title="Home Circuit"/>}
      footer={
        <>
          <StatsBar 
            leftStats={[
              { label: "Best Lap", value: lapStats.topLapHistory[0] ? (lapStats.topLapHistory[0].lapTime / 1000).toFixed(3) : "—" },
              { label: "Lap Count", value: lapStats.lapCount.toString() },
            ]}
            centerStat={{ label: "Lap Time", values: [display, ...(lapStats.lapHistory.map((lap) => (lap.lapTime / 1000).toFixed(3)).reverse())] }}
            rightStats={[
              { label: "Personal Best", value: lapStats.topLapHistory[0] ? (lapStats.topLapHistory[0].lapTime / 1000).toFixed(3) : "—" },
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
        gateHistory={gatesData.gateHistory}
        gateCount={gatesData.gateCount}
        expectedGateId={gatesData.expectedGateId}
      />
    </FullscreenShell>
  );
}
