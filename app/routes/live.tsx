import FullscreenShell from "~/components/Fullscreen/FullscreenShell/FullscreenShell";
import type { Route } from "./+types/home";
import ActionBar from "~/components/ActionBar/ActionBar";
import StatsBar from "~/components/StatsBar/StatsBar";
import Header from "~/components/Header/Header";
import Divider from "~/components/Divider/Divider";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Live - NexGate" }
  ];
}

export default function Live() {
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
            centerStat={{ label: "Lap time", values: ["34.456", "35.456", "36.456"] }}
            rightStats={[
              { label: "Personal Best", value: "32.334" },
              { label: "Session", value: "1:23" },
            ]}
          />
          <Divider />
          <ActionBar />
        </>
      }
    >
      Content!
    </FullscreenShell>
  );
}
