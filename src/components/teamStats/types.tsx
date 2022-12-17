import { monsterCacheClient } from "../../model/monsterCacheClient";
import { getTeamSlots, TeamState } from "../../model/teamStateManager";
import { GameConfig } from "../gameConfigSelector";

export type TeamTypes = number[];

export async function computeTypes(gameConfig: GameConfig, teamState: TeamState, playerId: keyof TeamState) {
  const slots = getTeamSlots(gameConfig, teamState, playerId);

  var types: number[] = [];
  for (var s of slots) {
    const m1b = await monsterCacheClient.get(s.baseId);
    if (!m1b) {
      continue;
    }
    if (m1b.type1) {
      types.push(m1b.type1);
    }
    if (m1b.type2) {
      types.push(m1b.type2);
    }
    if (m1b.type3) {
      types.push(m1b.type3);
    }
  }
  return types.filter((v, i, a) => a.indexOf(v) === i);
}
