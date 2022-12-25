import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

import { MonsterResponse } from "../../client";
import { AwakeningImage, BASE_ICON_URL } from "../../model/images";
import { PadAssetImage } from "../../model/padAssets";
import { computeLeaderSkill } from "../../model/types/leaderSkill";
import { getKillers, MonsterType } from "../../model/types/monster";
import { maxLevel } from "../../model/types/stat";
import { FlexCol, FlexRow, FlexRowC, H3, TDh } from "../../stylePrimitives";
import { fixedDecimals } from "../generic/fixedDecimals";
import { leftPad } from "../generic/leftPad";
import { LevelSelector } from "../levelSelector";
import { SuperAwakeningSelector } from "../superAwakeningSelector";

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

const TH = styled.th`
  padding: 0rem 0.5rem;
  text-align: right;
  font-weight: 600;
`;

const TD = styled.td`
  padding: 0rem 0.5rem;
  text-align: right;
  font-weight: 600;
`;

export const CardInfo = ({
  monster: m,
  currentSA,
  setCurrentSA,
  currentLevel,
  setCurrentLevel
}: {
  monster: MonsterResponse;
  currentSA: number | undefined;
  setCurrentSA: React.Dispatch<React.SetStateAction<number | undefined>>;
  currentLevel: number | undefined;
  setCurrentLevel: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
  const superAwakenings = m.awakenings.filter((a) => a.is_super);
  return (
    <>
      <div
        className={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        <FlexCol gap="0.25rem">
          <H3>
            [{m.monster_id}] {m.name_en}
          </H3>
          <b>{m.types.map((a) => MonsterType[a]).join("/")}</b>
          <table
            className={css`
              font-size: 0.75rem;
            `}
          >
            <tbody>
              <tr>
                <TDh width={"1rem"}>AW</TDh>
                <td>
                  <FlexRow gap="0.25rem">
                    {m.awakenings
                      .filter((a) => !a.is_super)
                      .map((a) => (
                        <AwakeningImage key={a.awakening_id} awakeningId={a.awoken_skill_id} />
                      ))}
                  </FlexRow>
                </td>
              </tr>
              <tr>
                <TDh>LV</TDh>
                <td>
                  <LevelSelector
                    currentLevel={currentLevel}
                    selectedMonster={m}
                    setLevel={(n: number) => {
                      setCurrentLevel(n);
                    }}
                  />
                </td>
              </tr>
              {superAwakenings.length > 0 && currentLevel && currentLevel > 99 ? (
                <tr>
                  <TDh>SA</TDh>
                  <td>
                    <SuperAwakeningSelector
                      currentSA={currentSA}
                      selectedMonster={m}
                      setSA={(n: number) => {
                        setCurrentSA(n);
                      }}
                    />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </FlexCol>
        <img src={`${BASE_ICON_URL}${leftPad(m.monster_id, 5)}.png`} alt="monster" height={"100%"} />
      </div>

      <FlexRow gap="5rem" justifyContent="space-between">
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
          <table>
            <thead>
              <tr>
                <TH>Stats</TH>
                <th>Lv {maxLevel(m)}, +297</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TD>HP</TD>
                <td>{m.hp_max}</td>
              </tr>
              <tr>
                <TD>ATK</TD>
                <td>{m.atk_max}</td>
              </tr>
              <tr>
                <TD>RCV</TD>
                <td>{m.rcv_max}</td>
              </tr>
            </tbody>
          </table>
        </FlexCol>
        <FlexCol gap="0.25rem">
          <b>Killers [{m.latent_slots} slots]</b>
          <FlexRowC>
            {getKillers(m).map((a) => (
              <PadAssetImage assetName={`${a.substring(0, 3).toLocaleLowerCase()}t`} height={25} />
            ))}
          </FlexRowC>
        </FlexCol>
      </FlexRow>
      <FlexCol>
        <b>
          <FlexRowC gap="0.25rem">
            Active Skill ({m.active_skill.cooldown_turns_max} <HiOutlineArrowNarrowRight />{" "}
            {m.active_skill.cooldown_turns_min})
          </FlexRowC>
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
