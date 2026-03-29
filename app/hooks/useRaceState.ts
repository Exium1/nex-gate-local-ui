import { useReducer } from 'react'

function reducer(state: any, msg: any) {
  switch (msg.type) {
    case 'state_sync':   return { ...state, ...msg }
    case 'race_status':  return { ...state, race: { ...state.race, ...msg } }
    case 'gate_event':   return { ...state, lastGate: msg }
    case 'lap_complete': return {
      ...state,
      laps: [...state.laps, msg]
    }
    default: return state
  }
}

const initial = { race: { status: 'idle' }, pilots: [], gates: [], laps: [], lastGate: null }

export function useRaceState() {
  return useReducer(reducer, initial)
}