import { use } from "react";
import Button from "../Button/Button";
import type { RaceSession } from "~/routes/home";

export default function ButtonLoaderTest({fetcher} : {fetcher: Promise<RaceSession | null>}) {
  const session = use(fetcher);

  console.log(`Session: ${session}`)

  if (session) { 
    return (
      <>
        <Button
          color="success"
        >
          Join Session
        </Button>
        <Button
          color="success"
        >
          Spectate
        </Button>
      </>
    )
  } else return (
    <Button
      color="success"
    >
      Start Session
    </Button>
  )
}
