import { css } from "@emotion/css";
import styled from "@emotion/styled";

import { AwakeningImage } from "../../model/images";
import { monsterCacheClient } from "../../model/monsterCacheClient";
import { PadAssetImage } from "../../model/padAssets";
import { getTeamSlots, TeamSlotState, TeamState } from "../../model/teamStateManager";
import { computeLeaderSkill } from "../../model/types/leaderSkill";
import { Attribute, AwokenSkills, MonsterType } from "../../model/types/monster";
import { maxLevel, stat } from "../../model/types/stat";
import { FlexCol, FlexRow } from "../../stylePrimitives";
import { GameConfig } from "../gameConfigSelector";
import { fixedDecimals } from "../generic/fixedDecimals";
import { AttributeHistogram } from "./attributes";
import { computeTotalAwakeningsFromSlots } from "./awakenings";
import { TeamTypes } from "./types";

export interface TeamBasicStats {
  hp: number;
  rcv: number;
  ehp: number;
  hpNoAwo: number;
  rcvNoAwo: number;
  ehpNoAwo: number;
}

export async function computeTeamBasicStats(
  gameConfig: GameConfig,
  teamState: TeamState,
  playerId: keyof TeamState
): Promise<TeamBasicStats> {
  const slots = getTeamSlots(gameConfig, teamState, playerId);

  var includeBadge = gameConfig.mode !== "2p";

  const leader = await monsterCacheClient.get(slots[0].baseId);
  const helper = await monsterCacheClient.get(slots[5].baseId);
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
    const m1b = await monsterCacheClient.get(s.baseId);
    if (!m1b) {
      continue;
    }

    const m1a = await monsterCacheClient.get(s.assistId);

    const plus = 297; // TODO: make config
    var is_plus_297 = false;
    var plusArr = [0, 0, 0];
    if (plus === 297) {
      plusArr = [99, 99, 99];
      is_plus_297 = true;
    }

    const lv = maxLevel(m1b); // TODO: make config
    const multiplayer = gameConfig.mode !== "1p";

    const hp = Math.round(
      stat({
        monster_model: m1b,
        key: "hp",
        lv: lv,
        plus: plusArr[0],
        inherit: false,
        is_plus_297: is_plus_297,
        multiplayer: multiplayer,
        inherited_monster: m1a
      })
    );
    const rcv = Math.round(
      stat({
        monster_model: m1b,
        key: "rcv",
        lv: lv,
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
        lv: lv,
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
        lv: lv,
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

type AttrImgProps = {
  selected: boolean;
};

const AttrImg = styled.img<AttrImgProps>`
  width: 20px;
  opacity: ${(props) => (props.selected ? "1" : "0.25")};
  border: ${(props) => (props.selected ? "1px solid gray" : "0")};
  border-radius: ${(props) => (props.selected ? "1000px" : "0")};
`;

const TD = styled.td`
  padding: 0.1rem 1rem 0.1rem 0;
  vertical-align: middle;
`;

export const TeamBasicStatsDisplay = ({
  tbs,
  tt,
  unbindablePct,
  ah
}: {
  tbs?: TeamBasicStats;
  tt?: TeamTypes;
  unbindablePct?: number;
  ah?: AttributeHistogram;
}) => {
  if (!tbs) {
    return <></>;
  }

  return (
    <FlexCol gap={"1rem"}>
      <table>
        <thead>
          <th></th>
          <th style={{ textAlign: "start", verticalAlign: "middle" }}>
            <AwakeningImage awakeningId={AwokenSkills.AWOKENKILLER} width={23} />
          </th>
          <th style={{ textAlign: "start", verticalAlign: "middle" }}>
            <div
              className={css`
                background: url("img/awoBind.webp") no-repeat;
                background-size: contain;
                height: 20px;
                display: flex;
                align-items: center;
              `}
            ></div>
            {/* <img src="img/awoBind.webp" width={"20px"} /> */}
          </th>
        </thead>
        <tbody>
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
                <FlexRow>
                  {tt.map((a) => {
                    return (
                      <PadAssetImage assetName={`${MonsterType[a].toLocaleLowerCase().substring(0, 3)}t`} height={25} />
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
                  {Object.entries(ah).map((a) => {
                    const attr = Attribute[a[0] as keyof {}].toLocaleLowerCase();
                    return (
                      <span>
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
          {unbindablePct ? (
            <tr>
              <TD>
                <b>!Bind</b>
              </TD>
              <TD>{fixedDecimals(unbindablePct, 0)}%</TD>
            </tr>
          ) : (
            <></>
          )}
        </tbody>
      </table>
    </FlexCol>
  );
};