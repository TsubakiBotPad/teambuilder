import { css } from "@emotion/css";
import { TeamState } from "../../model/teamStateManager";
import { FlexCol } from "../../stylePrimitives";
import { GameConfig } from "../gameConfigSelector";
import { AttributeHistogram, computeAttributes } from "./attributes";
import {
  AwakeningHistogram,
  AwakeningStatsDisplay,
  computeSharedAwakenings,
  computeTotalAwakenings
} from "./awakenings";
import { computeTeamBasicStats, computeTeamBasicStats2P, TeamBasicStats, TeamBasicStatsDisplay } from "./basicStats";
import { computeLatents, computeLatents2P, LatentInfo, LatentInfoShared } from "./latents";
import { computeTeamSubattributes } from "./teamSubattributes";
import { computeTypes, TeamTypes } from "./types";
import { computeTeamUnbindablePct } from "./unbindable";

export interface TeamStats {
  p1?: TeamStat;
  p2?: TeamStat;
  p3?: TeamStat;
}

export interface TeamStat {
  awakenings?: AwakeningHistogram;
  sharedAwakenings?: AwakeningHistogram;
  attributes?: AttributeHistogram;
  teamSubattributes?: (number | undefined)[];
  teamTypes?: TeamTypes;
  teamUnbindablePct?: number;
  teamBasicStats?: TeamBasicStats;
  sharedBasicStats?: TeamBasicStats;
  teamLatents?: LatentInfo;
  sharedTeamLatents?: LatentInfoShared;
}

export async function computeTeamStat(
  teamState: TeamState,
  gameConfig: GameConfig,
  player: keyof TeamState,
  hasAssists: boolean
): Promise<TeamStat> {
  return {
    awakenings: await computeTotalAwakenings(gameConfig, teamState, player, hasAssists),
    sharedAwakenings: await computeSharedAwakenings(gameConfig, teamState, player, hasAssists),
    attributes: await computeAttributes(gameConfig, teamState, player, hasAssists),
    teamSubattributes: await computeTeamSubattributes(gameConfig, teamState, player, hasAssists),
    teamTypes: await computeTypes(gameConfig, teamState, player),
    teamUnbindablePct: await computeTeamUnbindablePct(gameConfig, teamState, player, hasAssists),
    teamBasicStats: await computeTeamBasicStats(gameConfig, teamState, player, hasAssists),
    sharedBasicStats: await computeTeamBasicStats2P(gameConfig, teamState, hasAssists),
    teamLatents: await computeLatents(gameConfig, teamState, player),
    sharedTeamLatents: await computeLatents2P(gameConfig, teamState)
  };
}

export const TeamStatDisplay = ({ teamStat, keyP, is2P }: { teamStat?: TeamStat; keyP: string; is2P: boolean }) => {
  if (!teamStat) {
    return <></>;
  }

  return (
    <FlexCol className={css``}>
      <FlexCol
        className={css`
          box-shadow: 3px 3px 7px 5px lightgray;
          border-radius: 5px;
          label: team-stats-display;
        `}
      >
        <TeamBasicStatsDisplay
          tbs={teamStat.teamBasicStats}
          tt={teamStat.teamTypes}
          unbindablePct={teamStat.teamUnbindablePct}
          ah={teamStat.attributes}
          tl={teamStat.teamLatents}
          keyP={keyP}
          is2P={is2P}
        />
        <div
          className={css`
            border-top: 1px solid #ccc;
            margin: 0 0.5rem;
          `}
        >
          <AwakeningStatsDisplay awakenings={teamStat.awakenings} keyPrefix={keyP} />
        </div>
      </FlexCol>
    </FlexCol>
  );
};
