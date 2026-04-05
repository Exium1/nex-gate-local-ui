import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { RaceProvider } from "~/context/RaceContext";
import { client, Role } from "~/services/client";

export default function ClientLayout() {
  
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    client.join(Role.Director) // Attempt to get director role
      .then(() => setReady(true))
      .catch((e) => {
        console.log(e);
        window.location.href = "/";
      })

    return () => client.leave()
  }, [])

  if (!ready) return <p>Connecting... {ready}</p>

  return (
    <RaceProvider>
      <Outlet />
    </RaceProvider>
  )
}