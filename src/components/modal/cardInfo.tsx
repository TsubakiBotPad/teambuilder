import { css } from "@emotion/css";
import { MonsterResponse } from "../../client";

import { AwakeningImage, BASE_ICON_URL } from "../../model/images";
import m from "../../model/monster.json";
import { getKillers, MonsterType } from "../../model/types/monster";
import { FlexCol, FlexRow, FlexRowC, H3 } from "../../stylePrimitives";
import { leftPad } from "../generic/leftPad";

const LeaderSkillText = ({ monster }: { monster: any }) => {
  const hp = m.leader_skill.max_hp * m.leader_skill.max_hp;
  const atk = m.leader_skill.max_atk * m.leader_skill.max_atk;
  const rcv = m.leader_skill.max_rcv * m.leader_skill.max_rcv;
  const resist =
    (1 - (1 - m.leader_skill.max_shield) * (1 - m.leader_skill.max_shield)) *
    100;
  const ehp = hp / (1 - resist);
  const combos = m.leader_skill.max_combos * 2;
  const fua = m.leader_skill.bonus_damage * 2;
  return (
    <>
      [{hp}/{atk}/{rcv}
      {resist ? ` ${resist}%` : ""}] [{ehp}x eHP]{" "}
      {combos ? `[+${combos}c]` : ""} {fua ? `[${fua} fua]` : ""}
    </>
  );
};

export const CardInfo = ({ monster: m }: { monster: MonsterResponse }) => {
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
                <AwakeningImage
                  key={a.awakening_id}
                  awakeningId={a.awoken_skill_id}
                />
              ))}
          </FlexRow>
          <FlexRow>
            <img src="img/saQuestion.webp" width={"25px"} />
            {m.awakenings
              .filter((a) => a.is_super)
              .map((a) => (
                <AwakeningImage
                  key={a.awakening_id}
                  awakeningId={a.awoken_skill_id}
                />
              ))}
          </FlexRow>
        </FlexCol>
        <img src={`${BASE_ICON_URL}${leftPad(m.monster_id, 5)}.png`} />
      </div>
      <span>
        <b>Available killers:</b> [{m.latent_slots} slots] {getKillers(m)}
      </span>
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
            297_img <b>Stats</b> (level_img)
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
          Active Skill ({m.active_skill.cooldown_turns_max} -&gt;{" "}
          {m.active_skill.cooldown_turns_min})
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
