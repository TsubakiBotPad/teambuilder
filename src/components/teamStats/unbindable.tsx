import { css } from "@emotion/css";
import { AwakeningImage } from "../../model/images";
import { monsterCacheClient } from "../../model/monsterCacheClient";
import { PlayerState } from "../../model/teamStateManager";
import { AwokenSkills } from "../../model/types/monster";
import { FlexCol, FlexRow, FlexRowC, H2, H3 } from "../../stylePrimitives";

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

function fixedDecimals(value: number, decimals: number = 2) {
  const f = Math.pow(10, decimals);
  return (Math.round(value * f) / f).toFixed(decimals);
}

export const TeamUnbindableDisplay = ({ pct }: { pct?: number }) => {
  if (!pct) {
    return <></>;
  }

  return (
    <FlexCol
      className={css`
        width: 100%;
      `}
    >
      <FlexRowC gap="0.1rem">
        <FlexRowC>
          <AwakeningImage awakeningId={AwokenSkills.UNBINDABLE} />:
        </FlexRowC>
        <b>{fixedDecimals(pct, 0)}%</b>
      </FlexRowC>
    </FlexCol>
  );
};
