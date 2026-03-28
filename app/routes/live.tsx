import FullscreenShell from "~/components/Fullscreen/FullscreenShell/FullscreenShell";
import type { Route } from "./+types/home";
import ActionBar from "~/components/ActionBar/ActionBar";
import StatsBar from "~/components/StatsBar/StatsBar";
import Header from "~/components/Header/Header";

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
          <StatsBar/>
          {/* <Divider/> */}
          <ActionBar/>
        </>
      }
    >
      Content!
    </FullscreenShell>
  );
}
