import { Role } from "@exium1/nex-gate-local-shared";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { RaceProvider } from "~/context/RaceContext";
import { client } from "~/services/client";

export default function RaceLayout() {
  const [ready, setReady] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [clientRole, setClientRole] = useState<Role>(Role.SPECTATOR);

  useEffect(() => {
    client.join() // Attempt to get director role
      .then((res) => {
        setClientRole(res.client.role);
        setSessionStartTime(res.session.startedAt);
        setReady(true)}
      )
      .catch((e) => {
        console.log(e);
        // window.location.href = "/";
      })

    return () => client.leave()
  }, [])

  if (!ready) return <p>Connecting to active session... {ready}</p>

  return (
    <RaceProvider sessionStartTime={sessionStartTime} clientRole={clientRole}>
      <Outlet />
    </RaceProvider>
  )
}