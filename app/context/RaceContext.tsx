import { createContext, useContext, useReducer, useEffect } from 'react'
import type { GatesData } from '~/types/gates'
import { LimitedQueue, SortedLimitedQueue } from '~/helpers/LimitedQueue'
import type { LapStats } from '~/types/laps'
import { client } from '~/services/client'
import { ClientOutboundMessageSchema, Role, type ClientOutboundMessage, type CompletedLap, type EnrichedGateEvent, type Lap } from '@exium1/nex-gate-local-shared'
import { Value } from '@sinclair/typebox/value'

type RaceState = {
  gatesData: GatesData,
  lapStats: LapStats,
}
type RaceSession = {
  sessionStartTime: number,
  clientRole: Role
}
type RaceContextValue = RaceState & RaceSession
  
const gateCount = 3;
const initialState: RaceState = {
  gatesData: {
    expectedGateId: 0,
    gateHistory: [],
    gateCount: gateCount
  },
  lapStats: {
    lapCount: 0,
    lapHistory: [],
    topLapHistory: []
  }
}

const raceGateHistory = new LimitedQueue<EnrichedGateEvent>(5); // NOT GATE COUNT
const lapHistory = new LimitedQueue<CompletedLap>(2);
const topLapHistory = new SortedLimitedQueue<CompletedLap>(3, (a, b) => a.lapDuration - b.lapDuration); // Ascending
const lapIds = new Set<string>();

function raceReducer(state: RaceState, action: ClientOutboundMessage): RaceState {
  switch (action.type) {
    case 'RICH_GATE_EVENT':
      console.log('> rich_gate_event')
      console.log(action.payload);
      
      const richGateEvent = action.payload as EnrichedGateEvent;

      if (richGateEvent.gateId > (gateCount - 1)) return state; // Dismiss if incorrect gate. VVV
      const nextExpectedGateId = (richGateEvent.gateId + 1) % gateCount; // TODO: Extract gate count

      if (!raceGateHistory.queue.find((gate) => gate.id === richGateEvent.id)) // Dismiss duplicate write
        raceGateHistory.enqueue(richGateEvent);

      const newGatesData: GatesData = {
        expectedGateId: nextExpectedGateId,
        gateHistory: raceGateHistory.queue,
        gateCount: gateCount
      }

      return { ...state, gatesData: newGatesData }
    case 'LAP_COMPLETED':
      console.log('> lap_completed')
      console.log(action.payload);

      const newLap = action.payload as CompletedLap;

      lapIds.add(newLap.id)

      // Only trigger new lap in history and count if unique (stateless)
      if (!lapHistory.queue.find((lap) => lap.id === newLap.id)) {
        lapHistory.enqueue(newLap);
      }

      // Only trigger top lap if unique (stateless)
      if (!topLapHistory.queue.find((lap) => lap.id === newLap.id)) {
        topLapHistory.enqueue(newLap);
      }

      const newLapStats: LapStats = {
        lapCount: lapIds.size,
        lapHistory: lapHistory.queue,
        topLapHistory: topLapHistory.queue
      }

      return { ...state, lapStats: newLapStats }
    default:
      return state
  }
}

const RaceContext = createContext<RaceContextValue>({
  ...initialState,
  sessionStartTime: Date.now(),
  clientRole: Role.SPECTATOR
})

export function RaceProvider({ clientRole, sessionStartTime, children }: { clientRole: Role, sessionStartTime: number, children: React.ReactNode }) {
  const [state, dispatch] = useReducer(raceReducer, initialState)

  useEffect(() => {
    return client.socket?.subscribe((msg: any) => {
      if (!Value.Check(ClientOutboundMessageSchema, msg)) {
        console.log("Incoming ws message not recognized ", msg);
        return
      }

      dispatch(msg as ClientOutboundMessage)
    })
  }, [])

  return <RaceContext.Provider value={{ ...state, clientRole, sessionStartTime }}>{children}</RaceContext.Provider>
}

export const useRace = () => useContext(RaceContext)