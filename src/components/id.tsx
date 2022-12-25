import { PlayerState, TeamState } from "../model/teamStateManager";

export interface TeamComponentId {
  teamId: keyof TeamState;
  slotId: keyof PlayerState;
  use: "base" | "assist" | "latents";
}
