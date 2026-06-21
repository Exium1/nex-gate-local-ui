import type { CompletedLap, Lap } from "@exium1/nex-gate-local-shared"

export type LapStats = {
  lapCount: number
  lapHistory: CompletedLap[] // Caps at 3
  topLapHistory: CompletedLap[] // Caps at 3
}