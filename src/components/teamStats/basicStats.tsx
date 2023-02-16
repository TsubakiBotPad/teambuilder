import { ReactNode, useContext } from "react";
import clsx from "../../clsx";

import { iStr } from "../../i18n/i18n";
import { AwakeningImage } from "../../model/images";
import { monsterCacheClient } from "../../model/monsterCacheClient";
import { PadAssetImage } from "../../model/padAssets";
import { AppStateContext, get2PTeamSlots, getTeamSlots, TeamSlotState, TeamState } from "../../model/teamStateManager";
import { computeLeaderSkill } from "../../model/types/leaderSkill";
import { Attribute, AwokenSkills } from "../../model/types/monster";
import { stat } from "../../model/types/stat";
import { FlexCol, FlexRow } from "../../stylePrimitives";
import { GameConfig } from "../gameConfigSelector";
import { fixedDecimals } from "../generic/fixedDecimals";
import { AttributeHistogram } from "./attributes";
import { computeTotalAwakeningsFromSlots } from "./awakenings";
import { LatentInfo } from "./latents";
import { TeamTypes } from "./types";

const TD = ({ children, className, ...rest }: { children: ReactNode; className?: string; [rest: string]: any }) => {
  return (
    <td {...rest} className={clsx(className, "pr-4 align-middle text-right")}>
      {children}
    </td>
  );
};

const TD2 = ({ children, className, ...rest }: { children: ReactNode; className?: string; [rest: string]: any }) => {
  return (
    <td {...rest} className={clsx(className, "pr-4 pb-px align-middle text-right")}>
      {children}
    </td>
  );
};

export interface TeamBasicStats {
  hp: number;
  rcv: number;
  ehp: number;
  hpNoAwo: number;
  rcvNoAwo: number;
  ehpNoAwo: number;
}

export async function computeTeamBasicStats2P(
  gameConfig: GameConfig,
  teamState: TeamState,
  hasAssists: boolean
): Promise<TeamBasicStats> {
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

  var { hpAcc, rcvAcc, hpNoAwoAcc, rcvNoAwoAcc } = await accumulateBasicStats(slots, gameConfig, hasAssists);

  const awakenings = await computeTotalAwakeningsFromSlots(slots, false, hasAssists);
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
  playerId: keyof TeamState,
  hasAssists: boolean
): Promise<TeamBasicStats> {
  const slots = getTeamSlots(gameConfig, teamState, playerId);

  var not2P = gameConfig.mode !== "2p";

  const leader = await monsterCacheClient.get(slots[0].base.id);
  const helper = await monsterCacheClient.get(slots[5].base.id);
  const ls = computeLeaderSkill(leader, helper);

  var { hpAcc, rcvAcc, hpNoAwoAcc, rcvNoAwoAcc } = await accumulateBasicStats(slots, gameConfig, hasAssists);

  const awakenings = await computeTotalAwakeningsFromSlots(slots, not2P, hasAssists);
  const numTeamHp = awakenings[AwokenSkills.ENHTEAMHP] ?? 0;
  const numTeamRcv = awakenings[AwokenSkills.ENHTEAMRCV] ?? 0;

  var hpBadgeMult = 1;
  var rcvBadgeMult = 1;

  var playerBadgeId = teamState[playerId].badgeId;
  if (not2P) {
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

async function accumulateBasicStats(slots: TeamSlotState[], gameConfig: GameConfig, hasAssists: boolean) {
  var hpAcc = 0;
  var hpNoAwoAcc = 0;

  var rcvAcc = 0;
  var rcvNoAwoAcc = 0;

  for (var s of slots) {
    const m1b = await monsterCacheClient.get(s.base.id);
    if (!m1b) {
      continue;
    }

    const m1a = await monsterCacheClient.get(hasAssists ? s.assist.id : 0);

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
        inherited_monster_lvl: s.assist.level,
        monsterLatents: s.latents
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
        inherited_monster: m1a,
        monsterLatents: s.latents
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
        ignore_awakenings: true,
        monsterLatents: s.latents
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
        ignore_awakenings: true,
        monsterLatents: s.latents
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
  tl,
  keyP,
  is2P,
  border
}: {
  tbs?: TeamBasicStats;
  tt?: TeamTypes;
  unbindablePct?: number;
  ah?: AttributeHistogram;
  tl?: LatentInfo;
  keyP: string;
  is2P?: boolean;
  border?: boolean;
}) => {
  const { language } = useContext(AppStateContext);
  if (!tbs) {
    return <></>;
  }

  return (
    <div className="px-2 py-0 text-base min-w-[26.5rem]">
      <FlexCol className="my-2 gap-2">
        <FlexRow className="gap-10 justify-between">
          <table>
            <thead>
              <tr>
                <td></td>
                <td>
                  <div className="bg-[url('../public/img/awo.png')] bg-contain h-[20px] w-[20px] mr-4 float-right" />
                </td>
                <td>
                  <div className="bg-[url('../public/img/awoBind.png')] bg-contain h-[20px] w-[20px] mr-4 float-right" />
                </td>
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
                  <TD2>
                    <b>{iStr("types", language)}</b>
                  </TD2>
                  <TD2>
                    <FlexRow className="flex-wrap width-28">
                      {tt.map((a) => {
                        return <PadAssetImage assetName={`t${a}`} height={22} />;
                      })}
                    </FlexRow>
                  </TD2>
                </tr>
              ) : (
                <></>
              )}

              {ah ? (
                <tr>
                  <TD2>
                    <b>{iStr("attributes", language)}</b>
                  </TD2>
                  <TD2>
                    <FlexRow className="gap-1">
                      {Object.entries(ah).map((a, i) => {
                        const attr = Attribute[a[0] as keyof {}].toLocaleLowerCase();
                        return (
                          <span key={keyP + attr + i}>
                            <img
                              className={clsx(
                                "w-[16px]",
                                a[1]
                                  ? "opacity-100 border-solid border border-slate-700 rounded-[1000px]"
                                  : "opacity-25"
                              )}
                              alt={attr}
                              src={`img/orb${attr}.webp`}
                            />
                          </span>
                        );
                      })}
                    </FlexRow>
                  </TD2>
                </tr>
              ) : (
                <></>
              )}
              <tr>
                <TD>
                  <b>{iStr("surges", language)}</b>
                </TD>
                <td>
                  <FlexRow className="gap-0.5">
                    <PadAssetImage assetName="psf" height={20} className={!!tl?.psf ? "opacity-100" : "opacity-40"} />
                    <PadAssetImage assetName="jsf" height={20} className={!!tl?.jsf ? "opacity-100" : "opacity-40"} />
                  </FlexRow>
                </td>
              </tr>
              {unbindablePct !== undefined ? (
                <tr>
                  <TD>
                    <AwakeningImage className="inline-block" awakeningId={AwokenSkills.UNBINDABLE} width={22} />
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
