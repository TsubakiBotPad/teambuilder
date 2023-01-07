import { css } from "@emotion/css";
import { useContext } from "react";
import { iStr } from "../../i18n/i18n";
import { AppStateContext, TeamState } from "../../model/teamStateManager";
import { FlexCol, FlexRowC, ToggleOption } from "../../stylePrimitives";
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
          border: 1px solid #ccc;
        `}
      >
        <TeamStatsToggles keyP={keyP}></TeamStatsToggles>
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

const TeamStatsToggles = ({ keyP }: { keyP: string }) => {
  const { language, statsTab } = useContext(AppStateContext);
  if (keyP !== "p1") {
    return <></>;
  }
  return (
    <FlexRowC
      className={css`
        margin-top: -30px;
        height: 30px;
        box-sizing: border-box;
      `}
      gap={"2px"}
    >
      {iStr("dungeonEffects", language)}
      <AssistToggle isEnabled={statsTab[0] !== "main"}></AssistToggle>
    </FlexRowC>
  );
};

const AssistToggle = ({ isEnabled }: { isEnabled: boolean }) => {
  const { setStatsTab } = useContext(AppStateContext);
  if (isEnabled) {
    return (
      <ToggleOption
        isEnabled={false}
        image="assistBind.png"
        onClick={() => {
          setStatsTab(["no-assists", "no-assists", "no-assists"]);
        }}
      ></ToggleOption>
    );
  }
  return (
    <ToggleOption
      isEnabled={true}
      image="assistBind.png"
      onClick={() => {
        setStatsTab(["main", "main", "main"]);
      }}
    ></ToggleOption>
  );
};
