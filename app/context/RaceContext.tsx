import { createContext, useContext, useReducer, useEffect } from 'react'
import { socketService } from '../services/socket'
import type { GateEvent, RichGateEvent } from '~/types/GateEvent'

type RaceState = {
  status: 'idle' | 'active' | 'finished'
  raceId: string | null
  lapTimes: { pilotName: string; lapNumber: number; lapTimeMs: number }[]
  lastGateTrigger: { gateId: string; droneId: string } | null
  gatesData: GatesData
}

// Front end object
export type GateData = {
  id: string 
  gateId: number 
  raceSessionId: string 
  lapId: string 
  pilotName: string 
  beamX: number
  beamY: number
  color: "purple" | "yellow" | "green" | "red" | "neutral"
  triggeredAt: number 
  intervalMs: string // "1.353"  
  prevLapSplitDiffMs?: string // "-1.430" Might not be found if not previous lap exists
}

export type GateDataDummy = {
  gateId: number
}

type GatesData = {
  expectedGateId: number, // Expected gate id / index (synonymous)
  gates: (GateData | GateDataDummy)[] // Null means no gate data exists yet (keep default unknown styling)
}

type RaceAction =
  | { type: 'race_started';      payload: { raceId: string } }
  | { type: 'race_ended';        payload: { raceId: string } }
  | { type: 'gate_trigger';      payload: { gateId: string; droneId: string } }
  | { type: 'lap_complete';      payload: { pilotName: string; lapNumber: number; lapTimeMs: number } }
  | { type: 'rich_gate_event';   payload: RichGateEvent }

const initialState: RaceState = {
  status: 'idle',
  raceId: null,
  lapTimes: [],
  lastGateTrigger: null,
  gatesData: {
    expectedGateId: 0,
    gates: [
      { gateId: 0 },
      { gateId: 1 },
      { gateId: 2 },
      { gateId: 3 }
    ]
  }
}

function raceReducer(state: RaceState, action: RaceAction): RaceState {
  switch (action.type) {
    case 'race_started':
      return { ...state, status: 'active', raceId: action.payload.raceId, lapTimes: [] }
    case 'race_ended':
      return { ...state, status: 'finished' }
    case 'gate_trigger':
      return { ...state, lastGateTrigger: action.payload }
    case 'lap_complete':
      return { ...state, lapTimes: [...state.lapTimes, action.payload] }
    case 'rich_gate_event':
      // Convert RichGateEvent to GateEvent and handle any needed data
      console.log(action.payload);

      const richGateEvent = action.payload;
      if (richGateEvent.gate_id > 4) return state; // Dismiss if incorrect gate. VVV
      const nextExpectedGateId = (richGateEvent.gate_id + 1) % 4; // TODO: Extract gate count

      // TODO: If Lap 0 reset all gates (to dummy gate)
      // Currently just override the gate data
      let gates = state.gatesData.gates

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

      // Set gate with new data
      gates[richGateEvent.gate_id] = newGateData;
      gates[nextExpectedGateId] = {
        gateId: nextExpectedGateId
      }; // Clear entry (to appear as incomplete)

      const newGatesData: GatesData = {
        expectedGateId: nextExpectedGateId,
        gates
      }

      return { ...state, gatesData: newGatesData }
    default:
      return state
  }
}

const RaceContext = createContext<RaceState>(initialState)

export function RaceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(raceReducer, initialState)

  useEffect(() => {
    return socketService.subscribe((msg: any) => {
      if (['race_started', 'race_ended', 'gate_trigger', 'lap_complete', 'rich_gate_event'].includes(msg.type)) {
        dispatch(msg as RaceAction)
      }
    })
  }, [])

  return <RaceContext.Provider value={state}>{children}</RaceContext.Provider>
}

export const useRace = () => useContext(RaceContext)