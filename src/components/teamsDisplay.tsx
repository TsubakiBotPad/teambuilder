import React, { useState } from "react";
import { useContext } from "react";
import { AiOutlineCaretDown, AiOutlineCaretRight } from "react-icons/ai";

import { isMobile } from "../breakpoints";
import { AppStateContext } from "../model/teamStateManager";
import { FlexCol, FlexRow } from "../stylePrimitives";
import { TeamBlock } from "./teamBlock";
import { TeamSharedStats } from "./teamStats/teamStats2p";

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
  const { gameConfig, teamStats } = useContext(AppStateContext);
  const [statHidden, setStatHidden] = useState(true);

  const mobile = isMobile();
  return (
    <FlexCol gap="1.5rem">
      <FlexRow>
        <FlexCol gap="1.5rem">
          <TeamBlock playerId="p1" shouldShow={true} />
          <TeamBlock playerId="p2" shouldShow={gameConfig.mode === "2p" || gameConfig.mode === "3p"} />
          <TeamBlock playerId="p3" shouldShow={gameConfig.mode === "3p"} />
        </FlexCol>
        {!mobile ? (
          <TeamSharedStats
            teamStat1={teamStats.p1}
            teamStat2={teamStats.p2}
            sharedAwakenings={teamStats.p1?.sharedAwakenings}
          />
        ) : null}
      </FlexRow>

      {mobile ? (
        <>
          <div
            onClick={() => {
              setStatHidden(!statHidden);
            }}
          >
            <FlexRow>
              {statHidden ? <AiOutlineCaretRight /> : <AiOutlineCaretDown />}
              <p>{statHidden ? "Show" : "Hide"} Shared Stats</p>
            </FlexRow>
          </div>
          <div hidden={statHidden}>
            <TeamSharedStats
              teamStat1={teamStats.p1}
              teamStat2={teamStats.p2}
              sharedAwakenings={teamStats.p1?.sharedAwakenings}
            />
          </div>
        </>
      ) : null}
    </FlexCol>
  );
};
