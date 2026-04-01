// Event from web socket with rich data to prevent additional processing/logic on front end
// Includes interval and color which requires gate time from previous lap (extra db call)
export type RichGateEvent = {
  color?: "purple" | "yellow" | "green" | "red" | "neutral"
  prev_split_diff_ms?: number // Difference in interval from previous gate hit
  best_split_diff_ms?: number // Difference in interval from best gate
  best_session_split_diff_ms?: number // Difference in interval from previous gate
} & GateEvent

// Back end object
export type GateEvent = {
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

// Front end object
export type GateData = {
  id?: string 
  gateId: number 
  raceSessionId?: string 
  lapId?: string 
  pilotName?: string 
  beamX?: number
  beamY?: number
  color?: "purple" | "yellow" | "green" | "red" | "neutral"
  triggeredAt?: number 
  intervalMs?: string // "1.353"  
  prevLapSplitDiffMs?: string // "-1.430" Might not be found if not previous lap exists
}

export type GatesData = {
  expectedGateId: number, // Expected gate id / index (synonymous)
  gateHistory: GateData[],
  gateCount: number
}