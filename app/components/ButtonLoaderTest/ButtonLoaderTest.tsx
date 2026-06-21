import { use } from "react";
import Button from "../Button/Button";
import type { RaceSession } from "~/routes/home";
import { useNavigate } from "react-router";

export default function ButtonLoaderTest({fetcher} : {fetcher: Promise<RaceSession | null>}) {
  const session = use(fetcher);
  const navigate = useNavigate();

  const navigateToLive = () => {
    console.log("yo")
    navigate("/live");
  }

  if (session) { 
    return (
      <>
        <Button
          color="success"
          onClick={navigateToLive}
        >
          Join Session
        </Button>
        <Button
          color="success"
          onClick={navigateToLive}
        >
          Spectate
        </Button>
      </>
    )
  } else return (
    <Button
      color="success"
      onClick={navigateToLive}
    >
      Start Session
    </Button>
  )
}
