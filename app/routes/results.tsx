import FullscreenShell from "~/components/Fullscreen/FullscreenShell/FullscreenShell";
import type { Route } from "./+types/home";
import Header from "~/components/Header/Header";
import StatsBar from "~/components/StatsBar/StatsBar";
import Divider from "~/components/Divider/Divider";
import ActionBar from "~/components/ActionBar/ActionBar";
import GatesLive from "~/components/Gates/GatesLive/GatesLive";
import { useState } from "react";
import Button from "~/components/Button/Button";
import { FaPause, FaPlay } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import LapViewer from "~/components/LapViewer/LapViewer";
import { useNavigate, useSearchParams } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Results - NexGate" }
  ];
}

export default function Results() {
  
  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams();
  
  const startSession = () => {
    if (confirm("Would you like to start a session?")) {
      console.log("Session started");
      navigate("/live");
    }
  }

  return (
    <FullscreenShell
      header={<Header title="Home Circuit"/>}
      footer={
        <>
          <StatsBar
            leftStats={[
              { label: "Avg Lap", value: "32.334" },
              { label: "Lap Count", value: "5" },
            ]}
            centerStat={{ label: "Top Laps", values: ["34.456", "35.456", "36.456"] }}
            rightStats={[
              { label: "Personal Best", value: "32.334" },
              { label: "Session", value: "1:23" },
            ]}
          />
          <Divider />
          <ActionBar
            primaryActions={
              <>
                <Button variant="solid" color="success" size="md" onClick={startSession}>Start</Button>
                <Button variant="plain" color="neutral" size="md"><FaHome/>Home</Button>
              </>
            }
          />
        </>
      }
    >
      <LapViewer
        lap={searchParams.get("lap") ? parseInt(searchParams.get("lap")!) : 1}
        pilot={searchParams.get("pilot") || "Default Pilot"}
      />
    </FullscreenShell>
  );
}
