import { css } from "@emotion/css";
import { Attribute } from "../../client";
import { monsterCacheClient } from "../../model/monsterCacheClient";

import { PlayerState, TeamState } from "../../model/teamStateManager";
import { FlexCol, FlexRow } from "../../stylePrimitives";
import { GameConfig } from "../gameConfigSelector";
import { AttributeHistogram, computeAttributes, TeamAttributesDisplay } from "./attributes";
import { AwakeningHistogram, AwakeningStatsDisplay, computeTotalAwakenings } from "./awakenings";
import { computeTeamBasicStats, TeamBasicStats, TeamBasicStatsDisplay } from "./basicStats";
import { computeTypes, TeamTypes, TeamTypesDisplay } from "./types";
import { computeTeamUnbindablePct, TeamUnbindableDisplay } from "./unbindable";

export interface TeamStats {
  awakenings?: AwakeningHistogram;
  attributes?: AttributeHistogram;
  teamTypes?: TeamTypes;
  teamUnbindablePct?: number;
  teamBasicStats?: TeamBasicStats;
}

export async function computeTeamStats(teamState: TeamState, gameConfig: GameConfig): Promise<TeamStats> {
  return {
    awakenings: await computeTotalAwakenings(teamState.p1),
    attributes: await computeAttributes(teamState.p1),
    teamTypes: await computeTypes(teamState.p1),
    teamUnbindablePct: await computeTeamUnbindablePct(teamState.p1),
    teamBasicStats: await computeTeamBasicStats(teamState.p1, gameConfig)
  };
}

export const TeamStatsDisplay = ({ teamStats }: { teamStats: TeamStats }) => {
  return (
    <FlexCol
      className={css`
        width: 100%;
      `}
    >
      <TeamBasicStatsDisplay tbs={teamStats.teamBasicStats} />
      <TeamTypesDisplay tt={teamStats.teamTypes} />
      <TeamUnbindableDisplay pct={teamStats.teamUnbindablePct} />
      <TeamAttributesDisplay ah={teamStats.attributes} />
      <AwakeningStatsDisplay awakenings={teamStats.awakenings} />
    </FlexCol>
  );
};
