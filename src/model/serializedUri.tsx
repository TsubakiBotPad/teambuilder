import { Buffer } from "buffer";

import { GameConfig } from "../components/gameConfigSelector";
import { TeamState } from "./teamStateManager";
import JSONCrush from "jsoncrush";
export type ConfigData = { n: string; ts: TeamState; gc: GameConfig };

export const serializeConfig = ({ n: teamName, ts: teamState, gc: gameConfig }: ConfigData): string => {
  const y = JSON.stringify({ n: teamName, ts: teamState, gc: gameConfig });
  const z = JSONCrush.crush(y);

  return z;
};

// export function serializeTeamState(ts: TeamState) {
//   const k = "";
//   return [
//     serializePlayerState(k, "p1", ts.p1),
//     serializePlayerState(k, "p2", ts.p2),
//     serializePlayerState(k, "p3", ts.p3)
//   ].flatMap((a) => a);
// }

// function serializePlayerState(prefix: string, playerId: string, p: PlayerState) {
//   const k = `${prefix}${playerId}`;
//   return [
//     { [`${k}b`]: p.badgeId },
//     serializeTeamSlot(k, 1, p.teamSlot1),
//     serializeTeamSlot(k, 2, p.teamSlot2),
//     serializeTeamSlot(k, 3, p.teamSlot3),
//     serializeTeamSlot(k, 4, p.teamSlot4),
//     serializeTeamSlot(k, 5, p.teamSlot5),
//     serializeTeamSlot(k, 6, p.teamSlot6)
//   ].flatMap((a: any) => a);
// }

// function serializeTeamSlot(prefix: string, slotId: number, ts: TeamSlotState) {
//   return [{ [`${prefix}s${slotId}`]: [`${ts.baseId}`, `${ts.assistId}`] }, { [`${prefix}l${slotId}`]: ts.latents }];
// }

export const deserializeConfig = (serialized: string): ConfigData => {
  const x = JSONCrush.uncrush(serialized);
  const y = JSON.parse(x);
  return y;
};
