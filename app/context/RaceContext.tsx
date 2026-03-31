import { createContext, useContext, useReducer, useEffect } from 'react'
import { socketService } from '../services/socket'

type RaceState = {
  status: 'idle' | 'active' | 'finished'
  raceId: string | null
  lapTimes: { pilotName: string; lapNumber: number; lapTimeMs: number }[]
  lastGateTrigger: { gateId: string; droneId: string } | null
  gatesData: GatesData
}

type GateData = {
  gateId: number,
  beamX: number,
  beamY: number,
  intervalMs: number
}

type GatesData = {
  expectedGateId: number,
  gates: (GateData | null)[]
}

type GateEvent = {
  id: string // UUID
  gate_id: number // Number
  race_session_id: string // Reference to active race session (nullable)
  lap_id: string // Reference to active lap (nullable)
  pilot_name: string // Reference to selected pilot (nullable)
  beam_x: number
  beam_y: number
  triggered_at: number // Timestamp (ns) relative to lap (first gate is 0)
  interval_ms: number  // Amount of ms since previous gate (first gate is 0)
}

type RaceAction =
  | { type: 'race_started'; payload: { raceId: string } }
  | { type: 'race_ended';   payload: { raceId: string } }
  | { type: 'gate_trigger'; payload: { gateId: string; droneId: string } }
  | { type: 'lap_complete'; payload: { pilotName: string; lapNumber: number; lapTimeMs: number } }
  | { type: 'gate_event';   payload: GateEvent }

const initialState: RaceState = {
  status: 'idle',
  raceId: null,
  lapTimes: [],
  lastGateTrigger: null,
  gatesData: {
    expectedGateId: 0,
    gates: [
      { gateId: 0, beamX: 5, beamY: 5, intervalMs: 0 },
      { gateId: 1, beamX: 5, beamY: 5, intervalMs: 0 },
      { gateId: 2, beamX: 5, beamY: 5, intervalMs: 0 },
      { gateId: 3, beamX: 5, beamY: 5, intervalMs: 0 },
      { gateId: 4, beamX: 5, beamY: 5, intervalMs: 0 }
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
    case 'gate_event':

      const gateEvent = action.payload;      
      const nextExpectedGateId = (gateEvent.gate_id + 1) % 5;
      let gates = state.gatesData.gates

      gates[gateEvent.gate_id % 5]!.intervalMs = gateEvent.interval_ms;
      gates[nextExpectedGateId]!.intervalMs = 0;

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
      console.log(msg);
      // Only forward messages that are race events
      if (['race_started', 'race_ended', 'gate_trigger', 'lap_complete', 'gate_event'].includes(msg.type)) {
        dispatch(msg as RaceAction)
      }
    })
  }, [])

  return <RaceContext.Provider value={state}>{children}</RaceContext.Provider>
}

export const useRace = () => useContext(RaceContext)