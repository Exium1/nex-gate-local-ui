import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Results - NexGate" }
  ];
}

export default function Results() {
  return (
    <h1>
      these are the results!
    </h1>
  );
}
