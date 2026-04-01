// Directly from backend
export type Lap = {
  id: string
  race_session_id: string // Reference session id
  pilot_name: string // (Nullable)
  lap_time_ms: number // Duration of lap (nullable)
  gate_count: number
  started_at: number // Timestamp of beginning
}

// Front end object
export type LapData = {
  id: string,
  raceSessionId?: string,
  pilotName: string,
  lapTime: number, // (ms)
  gateCount: number,
  startedAt: number
}

export type LapStats = {
  lapCount: number
  lapHistory: LapData[] // Caps at 3
  topLapHistory: LapData[] // Caps at 3
}