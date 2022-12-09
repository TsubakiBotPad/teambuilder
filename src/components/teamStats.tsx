import { css } from "@emotion/css";

import { TeamState } from "../model/teamStateManager";
import { FlexCol } from "../stylePrimitives";
import { AwakeningHistogram, AwakeningStatsDisplay, computeTotalAwakenings } from "./awakenings";

export async function computeTeamStats(teamState: TeamState) {
  return { awakenings: await computeTotalAwakenings(teamState.p1) };
}

export interface TeamStats {
  awakenings?: AwakeningHistogram;
}

export const TeamStatsDisplay = ({ teamStats }: { teamStats: TeamStats }) => {
  return (
    <FlexCol
      className={css`
        width: 100%;
      `}
    >
      <AwakeningStatsDisplay awakenings={teamStats.awakenings} />
    </FlexCol>
  );
};
