import { createContext } from "react-router";

type ClientState = {
  id: string,
}

const ClientContext = createContext<ClientState | null>(null);