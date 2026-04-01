// Event from web socket with rich data to prevent additional processing/logic on front end
// Includes interval and color which requires gate time from previous lap (extra db call)
export type RichGateEvent = {
  color?: "purple" | "yellow" | "green" | "red" | "neutral"
  prev_split_diff_ms?: number // Difference in interval from previous gate hit
  best_split_diff_ms?: number // Difference in interval from best gate
  best_session_split_diff_ms?: number // Difference in interval from previous gate
} & GateEvent

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