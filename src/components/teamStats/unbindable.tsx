import { monsterCacheClient } from "../../model/monsterCacheClient";
import { getTeamSlots, TeamState } from "../../model/teamStateManager";
import { AwokenSkills } from "../../model/types/monster";
import { GameConfig } from "../gameConfigSelector";

export async function computeTeamUnbindablePct(
  gameConfig: GameConfig,
  teamState: TeamState,
  playerId: keyof TeamState
) {
  const slots = getTeamSlots(gameConfig, teamState, playerId);

  var count = 0;
  var filledSlots = 0;
  var isLead = true;
  for (const slot of slots) {
    if (slot.base.id !== 0) {
      filledSlots += 1;
    }

    var cardBindRes = 0;

    if (isLead && slot.base.id !== 0 && teamState[playerId].badgeId === "unbindable") {
      cardBindRes += 1;
    }

    const m1b = await monsterCacheClient.get(slot.base.id);
    if (m1b?.awakenings) {
      const unbindableRes = m1b.awakenings.filter((a) => !a.is_super && a.awoken_skill_id === AwokenSkills.UNBINDABLE);
      const bindRes = m1b.awakenings.filter((a) => !a.is_super && a.awoken_skill_id === AwokenSkills.BINDRES);
      cardBindRes += unbindableRes.length + bindRes.length * 0.5;
    }

    const m1a = await monsterCacheClient.get(slot.assist.id);
    if (m1a?.awakenings) {
      const unbindableRes = m1a.awakenings.filter((a) => !a.is_super && a.awoken_skill_id === AwokenSkills.UNBINDABLE);
      const bindRes = m1a.awakenings.filter((a) => !a.is_super && a.awoken_skill_id === AwokenSkills.BINDRES);
      cardBindRes += unbindableRes.length + bindRes.length * 0.5;
    }

    isLead = false;
    count += cardBindRes >= 1 ? 1 : 0;
  }

  if (filledSlots === 0) {
    return 0;
  }
  return (count / filledSlots) * 100;
}
