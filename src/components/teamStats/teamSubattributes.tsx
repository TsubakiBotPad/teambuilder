import { monsterCacheClient } from "../../model/monsterCacheClient";
import { getTeamSlots, TeamState } from "../../model/teamStateManager";
import { GameConfig } from "../gameConfigSelector";
import { getAwakeningAttributeFromSlot } from "./attributes";

export async function computeTeamSubattributes(
  gameConfig: GameConfig,
  teamState: TeamState,
  playerId: keyof TeamState,
  hasAssists: boolean
) {
  var subattrs = [];
  const slots = getTeamSlots(gameConfig, teamState, playerId as keyof TeamState);

  for (const i in slots) {
    const s = slots[i];
    const m1b = await monsterCacheClient.get(s.base.id);
    const m1a = await monsterCacheClient.get(s.assist.id);

    subattrs.push(getAwakeningAttributeFromSlot(m1b, m1a, hasAssists));
  }

  return subattrs;
}
