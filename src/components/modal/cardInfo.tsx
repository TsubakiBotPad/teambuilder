import { css } from "@emotion/css";

import { MonsterResponse } from "../../client";
import { AwakeningImage, BASE_ICON_URL } from "../../model/images";
import { PadAssetImage } from "../../model/padAssets";
import { computeLeaderSkill } from "../../model/types/leaderSkill";
import { getKillers, MonsterType } from "../../model/types/monster";
import { maxLevel } from "../../model/types/stat";
import { FlexCol, FlexRow, FlexRowC, H3 } from "../../stylePrimitives";
import { fixedDecimals } from "../generic/fixedDecimals";
import { leftPad } from "../generic/leftPad";

const LeaderSkillText = ({ monster: m }: { monster: MonsterResponse }) => {
  if (!m.leader_skill) return <></>;

  const { hp, atk, rcv, resist, ehp, combos, fua } = computeLeaderSkill(m, m);
  return (
    <>
      [{hp}/{atk}/{rcv}
      {resist ? ` ${fixedDecimals(resist * 100)}%` : ""}] [{fixedDecimals(ehp)}x eHP] {combos ? `[+${combos}c]` : ""}{" "}
      {fua ? `[${fua} fua]` : ""}
    </>
  );
};

export const CardInfo = ({ monster: m }: { monster: MonsterResponse }) => {
  const superAwakenings = m.awakenings.filter((a) => a.is_super);
  return (
    <>
      <div
        className={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        <FlexCol>
          <H3>
            [{m.monster_id}] {m.name_en}
          </H3>
          <b>{m.types.map((a) => MonsterType[a]).join("/")}</b>
          <FlexRow>
            {m.awakenings
              .filter((a) => !a.is_super)
              .map((a) => (
                <AwakeningImage key={a.awakening_id} awakeningId={a.awoken_skill_id} />
              ))}
          </FlexRow>
          {superAwakenings.length > 0 ? (
            <FlexRow>
              <img src="img/saQuestion.webp" width={"25px"} alt="?" />
              {superAwakenings.map((a) => (
                <AwakeningImage key={a.awakening_id} awakeningId={a.awoken_skill_id} />
              ))}
            </FlexRow>
          ) : null}
          <FlexRowC gap="0.25rem">
            <span>
              <b>Available killers:</b> [{m.latent_slots} slots]{" "}
            </span>
            <FlexRowC>
              {getKillers(m).map((a) => (
                <PadAssetImage assetName={`${a.substring(0, 3).toLocaleLowerCase()}t`} height={25} />
              ))}
            </FlexRowC>
          </FlexRowC>
        </FlexCol>
        <img src={`${BASE_ICON_URL}${leftPad(m.monster_id, 5)}.png`} alt="monster" height={"100%"} />
      </div>

      <FlexRow gap="5rem">
        <FlexCol>
          <b>{m.is_inheritable ? "" : "Not "}Inheritable</b>
          <span>
            <b>Rarity</b> {m.rarity}
          </span>
          <span>
            <b>Cost</b> {m.cost}
          </span>
          <b>{m.series["name_en"]}</b>
        </FlexCol>
        <FlexCol>
          <FlexRowC>
            <b>Stats</b> (Lvl {maxLevel(m)}, +297)
          </FlexRowC>
          <span>
            <b>HP</b> {m.hp_max}
          </span>
          <span>
            <b>ATK</b> {m.atk_max}
          </span>
          <span>
            <b>RCV</b> {m.rcv_max}
          </span>
        </FlexCol>
      </FlexRow>
      <FlexCol>
        <b>
          Active Skill ({m.active_skill.cooldown_turns_max} -&gt; {m.active_skill.cooldown_turns_min})
        </b>
        <span>{m.active_skill.desc_en}</span>
      </FlexCol>
      <FlexCol>
        <b>
          Leader Skill <LeaderSkillText monster={m} />
        </b>
        <span>{m.leader_skill ? m.leader_skill.desc_en : "None"}</span>
      </FlexCol>
    </>
  );
};
