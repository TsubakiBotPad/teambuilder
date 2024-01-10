import { css } from "@emotion/css";
import React from "react";
import { useContext } from "react";

import { iStr } from "../i18n/i18n";
import { AppStateContext } from "../model/teamStateManager";
import { FlexCol, FlexColC, FlexRow, FlexRowC } from "../stylePrimitives";
import { TeamBlock } from "./teamBlock";
import { TeamSharedStatsDisplay } from "./teamStats/teamStats2p";

export const TeamsDisplay1n3P = () => {
  const { gameConfig } = useContext(AppStateContext);

  return (
    <FlexCol gap="1.5rem">
      <TeamBlock playerId="p1" shouldShow={true} />
      <TeamBlock playerId="p2" shouldShow={gameConfig.mode === "2p" || gameConfig.mode === "3p"} />
      <TeamBlock playerId="p3" shouldShow={gameConfig.mode === "3p"} />
    </FlexCol>
  );
};

export const TeamsDisplay2P = () => {
  const { gameConfig, language, teamStats } = useContext(AppStateContext);

  const teamStat1 = teamStats.p1;
  const teamStat2 = teamStats.p2;
  const sharedAwakenings = teamStats.p1?.sharedAwakenings;

  return (
    <FlexCol>
      <FlexRow>
        <FlexCol gap="1.5rem">
          <TeamBlock playerId="p1" shouldShow={true} />
          <TeamBlock playerId="p2" shouldShow={gameConfig.mode === "2p" || gameConfig.mode === "3p"} />
          <TeamBlock playerId="p3" shouldShow={gameConfig.mode === "3p"} />
        </FlexCol>
        {teamStat1 && teamStat2 ? (
          <FlexRowC gap="1rem">
            <FlexColC>
              <span>{iStr("shared", language)}</span>
              <div
                className={css`
                  border: solid 1px #aaa;
                `}
              >
                <TeamSharedStatsDisplay
                  sbs={teamStat1.sharedBasicStats}
                  tbs1={teamStat1.teamBasicStats}
                  tbs2={teamStat2.teamBasicStats}
                  tt1={teamStat1.teamTypes}
                  tt2={teamStat2.teamTypes}
                  unbindablePct1={teamStat1.teamUnbindablePct}
                  unbindablePct2={teamStat2.teamUnbindablePct}
                  ah1={teamStat1.attributes}
                  ah2={teamStat2.attributes}
                  keyP={"p1"}
                  sAwo={sharedAwakenings}
                />
              </div>
            </FlexColC>
          </FlexRowC>
        ) : null}
      </FlexRow>
    </FlexCol>
  );
};
