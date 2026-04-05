import { createContext, useContext, useReducer, useEffect } from 'react'
import type { GateData, GateEvent, GatesData, RichGateEvent } from '~/types/gates'
import { LimitedQueue, SortedLimitedQueue } from '~/helpers/LimitedQueue'
import type { Lap, LapData, LapStats } from '~/types/laps'
import { client, Role } from '~/services/client'

type RaceState = {
  gatesData: GatesData,
  lapStats: LapStats,
}

type RaceSession = {
  sessionStartTime: number,
  clientRole: Role
}

type RaceAction =
 | { type: 'rich_gate_event';   payload: RichGateEvent }
 | { type: 'lap_complete';     payload: Lap }
  // | { type: 'race_started';      payload: { raceId: string } }
  // | { type: 'race_ended';        payload: { raceId: string } }

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

const raceGateHistory = new LimitedQueue<GateData>(5); // NOT GATE COUNT
const lapHistory = new LimitedQueue<LapData>(2);
const topLapHistory = new SortedLimitedQueue<LapData>(3, (a, b) => a.lapTime - b.lapTime); // Ascending

function raceReducer(state: RaceState, action: RaceAction): RaceState {
  switch (action.type) {
    case 'rich_gate_event':
      console.log('> rich_gate_event')
      console.log(action.payload);

      const richGateEvent = action.payload;
      if (richGateEvent.gate_id > (gateCount - 1)) return state; // Dismiss if incorrect gate. VVV

      const nextExpectedGateId = (richGateEvent.gate_id + 1) % gateCount; // TODO: Extract gate count
      const newGateData: GateData = {
        id: richGateEvent.id,
        gateId: richGateEvent.gate_id,
        raceSessionId: richGateEvent.race_session_id,
        lapId: richGateEvent.lap_id,
        pilotName: richGateEvent.pilot_name,
        beamX: richGateEvent.beam_x,
        beamY: richGateEvent.beam_y,
        color: richGateEvent.color || "neutral",
        triggeredAt: richGateEvent.triggered_at,
        intervalMs: (richGateEvent.interval_ms / 1000).toFixed(3),
        prevLapSplitDiffMs:
          // TODO: Update naming with whatever stat is chosen
          richGateEvent.best_session_split_diff_ms ? (richGateEvent.best_session_split_diff_ms / 1000).toFixed(3) : undefined
      }

      if (!raceGateHistory.queue.find((gate) => gate.id === newGateData.id)) // Dismiss duplicate write
        raceGateHistory.enqueue(newGateData);

      const newGatesData: GatesData = {
        expectedGateId: nextExpectedGateId,
        gateHistory: raceGateHistory.queue,
        gateCount: gateCount
      }

      return { ...state, gatesData: newGatesData }
    case 'lap_complete':
      console.log('> lap_complete')
      console.log(action.payload);

      const newLap = action.payload;
      const newLapData: LapData = {
        id: newLap.id,
        raceSessionId: newLap.race_session_id,
        pilotName: newLap.pilot_name,
        lapTime: newLap.lap_time_ms,
        gateCount: newLap.gate_count,
        startedAt: newLap.started_at
      }

      if (!lapHistory.queue.find((lap) => lap.id === newLapData.id)) {
        lapHistory.enqueue(newLapData);
      }

      if (!topLapHistory.queue.find((lap) => lap.id === newLapData.id))
        topLapHistory.enqueue(newLapData);

      const newLapStats: LapStats = {
        lapCount: state.lapStats.lapCount + 1,
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
  clientRole: Role.Spectator
})

export function RaceProvider({ clientRole, sessionStartTime, children }: { clientRole: Role, sessionStartTime: number, children: React.ReactNode }) {
  const [state, dispatch] = useReducer(raceReducer, initialState)

  useEffect(() => {
    return client.socket?.subscribe((msg: any) => {
      if (['rich_gate_event', 'lap_complete'].includes(msg.type)) {
        dispatch(msg as RaceAction)
      }
    })
  }, [])

  return <RaceContext.Provider value={{ ...state, clientRole, sessionStartTime }}>{children}</RaceContext.Provider>
}

export const useRace = () => useContext(RaceContext)