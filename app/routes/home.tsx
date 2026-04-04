import Button from "~/components/Button/Button";
import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import { Suspense, use } from "react";
import ButtonLoaderTest from "~/components/ButtonLoaderTest/ButtonLoaderTest";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {

  const navigate = useNavigate();

  const startSession = () => {
    if (confirm("Would you like to start a session?")) {
      console.log("Session started");
      navigate("/live");
    }
  }

  return (
    <div>
      <h1>Home!</h1>
      <Suspense fallback={<div>loading...</div>}>
        <ButtonLoaderTest fetcher={ongoingSessionFetcher()}/>
      </Suspense>
    </div>  
  );
}

export type RaceSession = {
  id: string
  started_at: number
  ended_at: number | null,
  mode: "time_trial" | "set" | "race"
}

async function ongoingSessionFetcher(): Promise<RaceSession | null> {
  return new Promise<RaceSession | null>((res) => {
    setTimeout(async () => {
      console.log("pre fetch")
      const response = await fetch(new URL("http://localhost:3001/active-session"), {
        mode: 'cors',
        headers: {'Content-Type':'application/json'},
      })

      if (response.status != 200) {
        res(null);
      } else {
        res(await response.json());
      }
    }, 1000)
  });
}