import type { EnrichedGateEvent } from "@exium1/nex-gate-local-shared"

export type GatesData = {
  expectedGateId: number, // Expected gate id / index (synonymous)
  gateHistory: EnrichedGateEvent[],
  gateCount: number
}