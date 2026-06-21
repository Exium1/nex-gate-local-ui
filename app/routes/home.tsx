import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import { Suspense, useState } from "react";
import ButtonLoaderTest from "~/components/ButtonLoaderTest/ButtonLoaderTest";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [sessionPromise] = useState(() => ongoingSessionFetcher());

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
        response = await fetch(new URL("http://localhost:3001/race-session/active"), {
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