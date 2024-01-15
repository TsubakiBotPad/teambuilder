import { css } from "@emotion/css";
import styled from "@emotion/styled";
import React from "react";
import { useContext } from "react";

import { iStr } from "../i18n/i18n";
import { AppStateContext } from "../model/teamStateManager";
import { FlexCol, FlexColCResponsive, FlexRow } from "../stylePrimitives";
import { TeamNotes } from "../teamNotes";
import { TeamStatsToggles } from "./dungeonEffectSelector";
import { TeamsDisplay1n3P, TeamsDisplay2P } from "./teamsDisplay";

const TeamInput = styled.input`
  border: 0;
  font-size: 1.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem 0.25rem 0;
`;

export const TeamBuilderContent = React.forwardRef((props, ref) => {
  const { gameConfig, setTeamName, teamName, language } = useContext(AppStateContext);
  return (
    <FlexColCResponsive>
      <FlexRow gap="1rem">
        <FlexCol ref={ref as any}>
          <FlexRow>
            <TeamInput
              placeholder={iStr("teamName", language)}
              size={41}
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value);
              }}
            />
            <TeamStatsToggles />
          </FlexRow>
          {gameConfig.mode !== "2p" ? <TeamsDisplay1n3P /> : null}
          {gameConfig.mode === "2p" ? <TeamsDisplay2P /> : null}
          <div
            className={css`
              padding-left: 0.5rem;
              padding-top: 0.5rem;
            `}
          >
            <TeamNotes />
          </div>
        </FlexCol>
      </FlexRow>
    </FlexColCResponsive>
  );
});
