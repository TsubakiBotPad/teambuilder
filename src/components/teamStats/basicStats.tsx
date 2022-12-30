import { css } from "@emotion/css";
import styled from "@emotion/styled";

import { AwakeningImage } from "../../model/images";
import { monsterCacheClient } from "../../model/monsterCacheClient";
import { PadAssetImage } from "../../model/padAssets";
import { get2PTeamSlots, getTeamSlots, TeamSlotState, TeamState } from "../../model/teamStateManager";
import { computeLeaderSkill } from "../../model/types/leaderSkill";
import { Attribute, AwokenSkills, MonsterType } from "../../model/types/monster";
import { stat } from "../../model/types/stat";
import { FlexCol, FlexRow } from "../../stylePrimitives";
import { GameConfig } from "../gameConfigSelector";
import { fixedDecimals } from "../generic/fixedDecimals";
import { AttributeHistogram } from "./attributes";
import { computeTotalAwakeningsFromSlots } from "./awakenings";
import { TeamTypes } from "./types";

const TD = styled.td`
  padding: 0 1rem 0 0;
  vertical-align: middle;
  text-align: right;
`;

const TH = styled.th`
  padding: 0rem 0rem;
  vertical-align: middle;
  text-align: center;
`;

type AttrImgProps = {
  selected: boolean;
};

const AttrImg = styled.img<AttrImgProps>`
  width: 16px;
  opacity: ${(props) => (props.selected ? "1" : "0.25")};
  border: ${(props) => (props.selected ? "1px solid gray" : "0")};
  border-radius: ${(props) => (props.selected ? "1000px" : "0")};
`;

export interface TeamBasicStats {
  hp: number;
  rcv: number;
  ehp: number;
  hpNoAwo: number;
  rcvNoAwo: number;
  ehpNoAwo: number;
}

export async function computeTeamBasicStats2P(gameConfig: GameConfig, teamState: TeamState): Promise<TeamBasicStats> {
  if (gameConfig.mode !== "2p") {
    return {
      hp: 0,
      rcv: 0,
      ehp: 0,
      hpNoAwo: 0,
      rcvNoAwo: 0,
      ehpNoAwo: 0
    };
  }

  var slots = get2PTeamSlots(teamState);

  const leader = await monsterCacheClient.get(slots[0].base.id);
  const helper = await monsterCacheClient.get(slots[5].base.id);
  const ls = computeLeaderSkill(leader, helper);

  var { hpAcc, rcvAcc, hpNoAwoAcc, rcvNoAwoAcc } = await accumulateBasicStats(slots, gameConfig);

  const awakenings = await computeTotalAwakeningsFromSlots(slots);
  const numTeamHp = awakenings[AwokenSkills.ENHTEAMHP] ?? 0;
  const numTeamRcv = awakenings[AwokenSkills.ENHTEAMRCV] ?? 0;

  var hpBadgeMult = 1;
  var rcvBadgeMult = 1;

  hpAcc *= 1 + 0.05 * numTeamHp * hpBadgeMult;
  rcvAcc *= 1 + 0.2 * numTeamRcv * rcvBadgeMult;

  return {
    hp: hpAcc,
    rcv: rcvAcc,
    ehp: ls.ehp * hpAcc,
    hpNoAwo: hpNoAwoAcc,
    rcvNoAwo: rcvNoAwoAcc,
    ehpNoAwo: ls.ehp * hpNoAwoAcc
  };
}

export async function computeTeamBasicStats(
  gameConfig: GameConfig,
  teamState: TeamState,
  playerId: keyof TeamState
): Promise<TeamBasicStats> {
  const slots = getTeamSlots(gameConfig, teamState, playerId);

  var includeBadge = gameConfig.mode !== "2p";

  const leader = await monsterCacheClient.get(slots[0].base.id);
  const helper = await monsterCacheClient.get(slots[5].base.id);
  const ls = computeLeaderSkill(leader, helper);

  var { hpAcc, rcvAcc, hpNoAwoAcc, rcvNoAwoAcc } = await accumulateBasicStats(slots, gameConfig);

  const awakenings = await computeTotalAwakeningsFromSlots(slots);
  const numTeamHp = awakenings[AwokenSkills.ENHTEAMHP] ?? 0;
  const numTeamRcv = awakenings[AwokenSkills.ENHTEAMRCV] ?? 0;

  var hpBadgeMult = 1;
  var rcvBadgeMult = 1;

  var playerBadgeId = teamState[playerId].badgeId;
  if (includeBadge) {
    if (playerBadgeId === "hpbadge") {
      hpBadgeMult = 1.05;
    } else if (playerBadgeId === "hp+badge") {
      hpBadgeMult = 1.15;
    } else if (playerBadgeId === "rcvbadge") {
      rcvBadgeMult = 1.25;
    } else if (playerBadgeId === "rcv+badge") {
      rcvBadgeMult = 1.35;
    }
  }

  hpAcc *= 1 + 0.05 * numTeamHp * hpBadgeMult;
  rcvAcc *= 1 + 0.2 * numTeamRcv * rcvBadgeMult;

  return {
    hp: hpAcc,
    rcv: rcvAcc,
    ehp: ls.ehp * hpAcc,
    hpNoAwo: hpNoAwoAcc,
    rcvNoAwo: rcvNoAwoAcc,
    ehpNoAwo: ls.ehp * hpNoAwoAcc
  };
}

async function accumulateBasicStats(slots: TeamSlotState[], gameConfig: GameConfig) {
  var hpAcc = 0;
  var hpNoAwoAcc = 0;

  var rcvAcc = 0;
  var rcvNoAwoAcc = 0;

  for (var s of slots) {
    const m1b = await monsterCacheClient.get(s.base.id);
    if (!m1b) {
      continue;
    }

    const m1a = await monsterCacheClient.get(s.assist.id);

    const plus = 297; // TODO: make config
    var is_plus_297 = false;
    var plusArr = [0, 0, 0];
    if (plus === 297) {
      plusArr = [99, 99, 99];
      is_plus_297 = true;
    }

    const multiplayer = gameConfig.mode !== "1p";

    const hp = Math.round(
      stat({
        monster_model: m1b,
        key: "hp",
        lv: s.base.level,
        plus: plusArr[0],
        inherit: false,
        is_plus_297: is_plus_297,
        multiplayer: multiplayer,
        inherited_monster: m1a,
        inherited_monster_lvl: s.assist.level
      })
    );
    const rcv = Math.round(
      stat({
        monster_model: m1b,
        key: "rcv",
        lv: s.base.level,
        plus: plusArr[2],
        inherit: false,
        is_plus_297: is_plus_297,
        multiplayer: multiplayer,
        inherited_monster: m1a
      })
    );

    hpAcc += hp;
    rcvAcc += rcv;

    const hpNoAwo = Math.round(
      stat({
        monster_model: m1b,
        key: "hp",
        lv: s.base.level,
        plus: plusArr[0],
        inherit: false,
        is_plus_297: is_plus_297,
        multiplayer: multiplayer,
        inherited_monster: m1a,
        ignore_awakenings: true
      })
    );
    const rcvNoAwo = Math.round(
      stat({
        monster_model: m1b,
        key: "rcv",
        lv: s.base.level,
        plus: plusArr[2],
        inherit: false,
        is_plus_297: is_plus_297,
        multiplayer: multiplayer,
        inherited_monster: m1a,
        ignore_awakenings: true
      })
    );

    hpNoAwoAcc += hpNoAwo;
    rcvNoAwoAcc += rcvNoAwo;
  }
  return { hpAcc, rcvAcc, hpNoAwoAcc, rcvNoAwoAcc };
}

export const TeamBasicStatsDisplay = ({
  tbs,
  tt,
  unbindablePct,
  ah,
  keyP,
  is2P,
  border
}: {
  tbs?: TeamBasicStats;
  tt?: TeamTypes;
  unbindablePct?: number;
  ah?: AttributeHistogram;
  keyP: string;
  is2P?: boolean;
  border?: boolean;
}) => {
  if (!tbs) {
    return <></>;
  }

  return (
    <div
      className={css`
        padding: 0 0.5rem;
        font-size: 16px;
      `}
    >
      <FlexCol
        gap={"0.5rem"}
        className={css`
          margin: 0.5rem 0;
        `}
      >
        <FlexRow gap="2.5rem" justifyContent="space-between">
          <table>
            <thead>
              <tr>
                <th></th>
                <TH>
                  <FlexRow justifyContent="flex-end" style={{ paddingRight: "1rem" }}>
                    <AwakeningImage awakeningId={AwokenSkills.AWOKENKILLER} width={23} />
                  </FlexRow>
                </TH>
                <TH>
                  <FlexRow justifyContent="flex-end" style={{ paddingRight: "1rem" }}>
                    <div
                      className={css`
                        background: url("img/awoBind.webp") no-repeat;
                        background-size: contain;
                        height: 20px;
                        width: 20px;
                      `}
                    />
                  </FlexRow>
                </TH>
              </tr>
            </thead>
            <tbody>
              {!is2P ? (
                <>
                  <tr>
                    <TD>
                      <b>HP</b>
                    </TD>
                    <TD>{fixedDecimals(tbs.hp, 0)}</TD>
                    <TD>{fixedDecimals(tbs.hpNoAwo, 0)}</TD>
                  </tr>
                  <tr>
                    <TD>
                      <b>eHP</b>
                    </TD>
                    <TD>{fixedDecimals(tbs.ehp, 0)}</TD>
                    <TD>{fixedDecimals(tbs.ehpNoAwo, 0)}</TD>
                  </tr>
                </>
              ) : null}
              <tr>
                <TD>
                  <b>RCV</b>
                </TD>
                <TD>{fixedDecimals(tbs.rcv, 0)}</TD>
                <TD>{fixedDecimals(tbs.rcvNoAwo, 0)}</TD>
              </tr>
            </tbody>
          </table>

          <table>
            <tbody>
              {tt ? (
                <tr>
                  <TD>
                    <b>Types</b>
                  </TD>
                  <TD>
                    <FlexRow
                      wrap="wrap"
                      className={css`
                        width: 7rem;
                      `}
                    >
                      {tt.map((a, i) => {
                        return (
                          <PadAssetImage
                            assetName={`${MonsterType[a].toLocaleLowerCase().substring(0, 3)}t`}
                            height={22}
                            key={keyP + "Types" + i}
                          />
                        );
                      })}
                    </FlexRow>
                  </TD>
                </tr>
              ) : (
                <></>
              )}

              {ah ? (
                <tr>
                  <TD>
                    <b>Attr</b>
                  </TD>
                  <TD>
                    <FlexRow gap={"0.25rem"}>
                      {Object.entries(ah).map((a, i) => {
                        const attr = Attribute[a[0] as keyof {}].toLocaleLowerCase();
                        return (
                          <span key={keyP + attr + i}>
                            <AttrImg src={`img/orb${attr}.webp`} selected={a[1]} />
                          </span>
                        );
                      })}
                    </FlexRow>
                  </TD>
                </tr>
              ) : (
                <></>
              )}
              {unbindablePct !== undefined ? (
                <tr>
                  <TD>
                    <b>!Bind</b>
                  </TD>
                  <td>{fixedDecimals(unbindablePct, 0)}%</td>
                </tr>
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </FlexRow>
      </FlexCol>
    </div>
  );
};
