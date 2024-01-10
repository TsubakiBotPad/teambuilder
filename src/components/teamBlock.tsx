import { css } from "@emotion/css";
import { useContext } from "react";

import { isMobile } from "../breakpoints";
import { AppStateContext, TeamState, TeamStateContext } from "../model/teamStateManager";
import { FlexCol, FlexColC, FlexRow, FlexRowC, H2 } from "../stylePrimitives";
import { BadgeDisplay } from "./badge";
import { TeamDisplay } from "./teamDisplay";
import { TeamStatDisplay } from "./teamStats/teamStats";

const TeamInfo = ({ playerId }: { playerId: keyof TeamState }) => {
  const { teamState } = useContext(TeamStateContext);
  const { gameConfig, teamStats } = useContext(AppStateContext);
  const is2P = gameConfig.mode === "2p";
  return (
    <FlexRow
      className={css`
        padding: 0.5rem;
        gap: 2rem;
        width: 100%;
      `}
    >
      <TeamDisplay teamId={playerId} state={teamState[playerId]} />
      <TeamStatDisplay teamStat={teamStats[playerId]} keyP={playerId} is2P={is2P} />
    </FlexRow>
  );
};

const TeamInfoMobile = ({ playerId }: { playerId: keyof TeamState }) => {
  const { teamState } = useContext(TeamStateContext);
  const { gameConfig, teamStats } = useContext(AppStateContext);
  const is2P = gameConfig.mode === "2p";
  return (
    <FlexColC gap="2rem">
      <TeamDisplay teamId={playerId} state={teamState[playerId]} gap={"0"} />
      <TeamStatDisplay teamStat={teamStats[playerId]} keyP={playerId} is2P={is2P} />
    </FlexColC>
  );
};

export const TeamBlock = ({ playerId, shouldShow }: { playerId: keyof TeamState; shouldShow: boolean }) => {
  const { gameConfig, setPlayerSelected, setBadgeModalIsOpen } = useContext(AppStateContext);
  const { teamState } = useContext(TeamStateContext);
  const is2P = gameConfig.mode === "2p";

  return shouldShow ? (
    <FlexCol gap="0.25rem">
      <FlexRowC gap="0.5rem">
        <H2>{playerId}</H2>
        {!is2P ? (
          <BadgeDisplay
            onClick={() => {
              setPlayerSelected(playerId);
              setBadgeModalIsOpen(true);
            }}
            badgeName={teamState[playerId].badgeId}
          />
        ) : null}
      </FlexRowC>
      {isMobile() ? <TeamInfoMobile playerId={playerId} /> : <TeamInfo playerId={playerId} />}
    </FlexCol>
  ) : (
    <></>
  );
};
