import Button from "~/components/Button/Button";
import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import { Suspense, use, useState } from "react";
import ButtonLoaderTest from "~/components/ButtonLoaderTest/ButtonLoaderTest";
import { rejects } from "assert";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  console.log("Home rendered");
  const navigate = useNavigate();
  const [sessionPromise] = useState(() => ongoingSessionFetcher());

  const startSession = () => {
    if (confirm("Would you like to start a session?")) {
      navigate("/live");
    }
  }

  return (
    <div>
      <h1>Home!</h1>
      <Suspense fallback={<div>loading...</div>}>
        <ButtonLoaderTest fetcher={sessionPromise} />
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
  return new Promise<RaceSession | null>((res, rej) => {
    setTimeout(async () => {
      let response;
      try {
        response = await fetch(new URL("http://localhost:3001/active-session"), {
          mode: 'cors',
          headers: {'Content-Type':'application/json'},
        })
      } catch (e) {
        res(null)
        return;
      }

      if (response.status == 200) {
        res(await response.json());
      } else {
        res(null);
      }
    }, 1000)
  });
}