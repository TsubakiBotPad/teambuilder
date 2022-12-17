import { css } from "@emotion/css";

import { TeamState } from "../../model/teamStateManager";
import { FlexCol } from "../../stylePrimitives";
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

export const TeamStatDisplay = ({ teamStat }: { teamStat?: TeamStat }) => {
  if (!teamStat) {
    return <></>;
  }

  return (
    <FlexCol
      className={css`
        width: 100%;
      `}
    >
      <div
        className={css`
          display: flex;
          justify-content: space-between;
          gap: 3rem;
        `}
      >
        <div>
          <TeamBasicStatsDisplay
            tbs={teamStat.teamBasicStats}
            tt={teamStat.teamTypes}
            unbindablePct={teamStat.teamUnbindablePct}
            ah={teamStat.attributes}
          />
        </div>
        <AwakeningStatsDisplay awakenings={teamStat.awakenings} />
      </div>
    </FlexCol>
  );
};
