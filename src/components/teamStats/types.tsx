import { monsterCacheClient } from "../../model/monsterCacheClient";
import { PlayerState } from "../../model/teamStateManager";

export type TeamTypes = number[];

export async function computeTypes(playerState: PlayerState) {
  const slots = [
    playerState.teamSlot1,
    playerState.teamSlot2,
    playerState.teamSlot3,
    playerState.teamSlot4,
    playerState.teamSlot5,
    playerState.teamSlot6
  ];

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
