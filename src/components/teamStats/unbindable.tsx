import { monsterCacheClient } from "../../model/monsterCacheClient";
import { PlayerState } from "../../model/teamStateManager";
import { AwokenSkills } from "../../model/types/monster";

export async function computeTeamUnbindablePct(playerState: PlayerState) {
  const slots = [
    playerState.teamSlot1,
    playerState.teamSlot2,
    playerState.teamSlot3,
    playerState.teamSlot4,
    playerState.teamSlot5,
    playerState.teamSlot6
  ];

  var count = 0;
  var filledSlots = 0;
  for (const slot of slots) {
    if (slot.baseId !== 0) {
      filledSlots += 1;
    }

    var cardBindRes = 0;
    const m1b = await monsterCacheClient.get(slot.baseId);
    if (m1b?.awakenings) {
      const unbindableRes = m1b.awakenings.filter((a) => !a.is_super && a.awoken_skill_id === AwokenSkills.UNBINDABLE);
      const bindRes = m1b.awakenings.filter((a) => !a.is_super && a.awoken_skill_id === AwokenSkills.BINDRES);
      cardBindRes += unbindableRes.length + bindRes.length * 0.5;
    }

    const m1a = await monsterCacheClient.get(slot.assistId);
    if (m1a?.awakenings) {
      const unbindableRes = m1a.awakenings.filter((a) => !a.is_super && a.awoken_skill_id === AwokenSkills.UNBINDABLE);
      const bindRes = m1a.awakenings.filter((a) => !a.is_super && a.awoken_skill_id === AwokenSkills.BINDRES);
      cardBindRes += unbindableRes.length + bindRes.length * 0.5;
    }

    count += cardBindRes >= 1 ? 1 : 0;
  }

  return (count / filledSlots) * 100;
}