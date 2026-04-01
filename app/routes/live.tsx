import FullscreenShell from "~/components/Fullscreen/FullscreenShell/FullscreenShell";
import type { Route } from "./+types/home";
import ActionBar from "~/components/ActionBar/ActionBar";
import StatsBar from "~/components/StatsBar/StatsBar";
import Header from "~/components/Header/Header";
import Divider from "~/components/Divider/Divider";
import GateBase from "~/components/Gates/GateBase/GateBase";
import GateTimed, { type GateTimedProps } from "~/components/Gates/GateTimed/GateTimed";
import { useEffect, useRef, useState } from "react";
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
  const { gatesData, lapStats } = useRace();

  useEffect(() => {
    // Request to join or something
  }, [])

  const endSession = () => {
    if (confirm("Would you like to end the session?")) {
      console.log("Session ended");
      navigate("/results");
    }
  }

  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gatesData.gateHistory.length === 0) return;

    const lastGateId = gatesData.gateHistory[gatesData.gateHistory.length - 1].gateId;

    if (lastGateId === 0) {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      startTimeRef.current = performance.now();
      setElapsedMs(0);
      intervalRef.current = setInterval(() => {
        setElapsedMs(performance.now() - startTimeRef.current!);
      }, 10);
    }
    // No cleanup here — interval lives in the ref and persists across effect runs
  }, [gatesData]);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  const display = elapsedMs === null ? "—" : (elapsedMs / 1000).toFixed(3);

  useEffect(() => {
    console.log("lap history: ")
    console.log(lapStats.lapHistory)
  }, [lapStats])

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
