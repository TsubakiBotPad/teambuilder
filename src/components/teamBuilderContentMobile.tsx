import { css } from "@emotion/css";
import React from "react";
import { useContext } from "react";

import { AppStateContext } from "../model/teamStateManager";
import { FlexCol } from "../stylePrimitives";
import { TeamNotes } from "../teamNotes";
import { TeamName } from "./teamName";
import { TeamsDisplay1n3P, TeamsDisplay2P } from "./teamsDisplay";

export const TeamBuilderContentMobile = React.forwardRef((props, ref) => {
  const { gameConfig } = useContext(AppStateContext);
  return (
    <FlexCol>
      <TeamName />
      {gameConfig.mode !== "2p" ? <TeamsDisplay1n3P /> : null}
      {gameConfig.mode === "2p" ? <TeamsDisplay2P /> : null}
      <div
        className={css`
          padding: 0.5rem;
        `}
      >
        <TeamNotes />
      </div>
    </FlexCol>
  );
});
