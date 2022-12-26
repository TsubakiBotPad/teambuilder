import { TeamState } from "../../model/teamStateManager";
import { GameConfig } from "../gameConfigSelector";
import { AttributeHistogram, computeAttributes } from "./attributes";
import { AwakeningHistogram, AwakeningStatsDisplay, computeTotalAwakenings } from "./awakenings";
import { computeTeamBasicStats, TeamBasicStats, TeamBasicStatsDisplay } from "./basicStats";
import { computeTypes, TeamTypes } from "./types";
import { computeTeamUnbindablePct } from "./unbindable";

export interface TeamStats {
  p1?: TeamStat;
  p2?: TeamStat;
  p3?: TeamStat;
}

export interface TeamStat {
  awakenings?: AwakeningHistogram;
  attributes?: AttributeHistogram;
  teamTypes?: TeamTypes;
  teamUnbindablePct?: number;
  teamBasicStats?: TeamBasicStats;
}

export async function computeTeamStat(
  teamState: TeamState,
  gameConfig: GameConfig,
  player: keyof TeamState
): Promise<TeamStat> {
  return {
    awakenings: await computeTotalAwakenings(gameConfig, teamState, player),
    attributes: await computeAttributes(gameConfig, teamState, player),
    teamTypes: await computeTypes(gameConfig, teamState, player),
    teamUnbindablePct: await computeTeamUnbindablePct(gameConfig, teamState, player),
    teamBasicStats: await computeTeamBasicStats(gameConfig, teamState, player)
  };
}

export const TeamStatDisplay = ({ teamStat, keyP: keyPrefix }: { teamStat?: TeamStat; keyP: string }) => {
  if (!teamStat) {
    return <></>;
  }

  return (
    <>
      <TeamBasicStatsDisplay
        tbs={teamStat.teamBasicStats}
        tt={teamStat.teamTypes}
        unbindablePct={teamStat.teamUnbindablePct}
        ah={teamStat.attributes}
        keyP={keyPrefix}
      />
      <AwakeningStatsDisplay awakenings={teamStat.awakenings} keyPrefix={keyPrefix} />
    </>
  );
};
