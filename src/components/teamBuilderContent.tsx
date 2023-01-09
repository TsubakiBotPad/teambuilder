import { css } from "@emotion/css";
import styled from "@emotion/styled";
import React from "react";
import { useContext } from "react";

import { iStr } from "../i18n/i18n";
import { AppStateContext } from "../model/teamStateManager";
import { FlexCol, FlexColC, FlexColCResponsive, FlexRow, FlexRowC } from "../stylePrimitives";
import { AuthorText } from "./authorText";
import { TeamStatsToggles } from "./dungeonEffectSelector";
import { TeamBlock } from "./team";
import { TeamSharedStatsDisplay } from "./teamStats/teamStats2p";

const TeamInput = styled.input`
  border: 0;
  font-size: 1.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem 0.25rem 0;
`;

export const TeamBuilderContent = React.forwardRef((props, ref) => {
  const { gameConfig, setTeamName, teamName, instructions, setInstructions, language } = useContext(AppStateContext);
  return (
    <FlexColCResponsive>
      <FlexRow gap="1rem">
        <FlexCol ref={ref as any}>
          <FlexRow
            className={css`
              align-items: end;
            `}
            justifyContent="space-between"
          >
            <TeamInput
              placeholder={iStr("teamName", language)}
              size={35}
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value);
              }}
            />
            <TeamStatsToggles></TeamStatsToggles>
          </FlexRow>
          {gameConfig.mode !== "2p" ? <TeamBuilderContent1n3P /> : null}
          {gameConfig.mode === "2p" ? <TeamBuilderContent2P /> : null}
          <div
            className={css`
              padding-left: 0.5rem;
              padding-top: 0.5rem;
            `}
          >
            <FlexCol gap="0.25rem">
              <AuthorText />
              <textarea
                rows={15}
                cols={10}
                className={css`
                  width: 37.7rem;
                `}
                value={instructions}
                onChange={(e) => {
                  setInstructions(e.target.value);
                }}
                placeholder={iStr("notesPlaceholder", language)}
              />
            </FlexCol>
          </div>
        </FlexCol>
      </FlexRow>
    </FlexColCResponsive>
  );
});

export const TeamBuilderContent1n3P = () => {
  const { gameConfig } = useContext(AppStateContext);

  return (
    <FlexCol gap="1.5rem">
      <TeamBlock playerId="p1" shouldShow={true} />
      <TeamBlock playerId="p2" shouldShow={gameConfig.mode === "2p" || gameConfig.mode === "3p"} />
      <TeamBlock playerId="p3" shouldShow={gameConfig.mode === "3p"} />
    </FlexCol>
  );
};

export const TeamBuilderContent2P = () => {
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
