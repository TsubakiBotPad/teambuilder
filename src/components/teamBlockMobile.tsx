import { css } from "@emotion/css";
import { useContext } from "react";

import { AppStateContext, PlayerState, TeamState, TeamStateContext } from "../model/teamStateManager";
import { FlexCol, FlexRow, FlexRowC, H2 } from "../stylePrimitives";
import { BadgeDisplay } from "./badge";
import { TeamSlot } from "./teamSlot";
import { TeamStatDisplay } from "./teamStats/teamStats";

const Team = ({ teamId, state }: { teamId: keyof TeamState; state: PlayerState }) => {
  const { gameConfig } = useContext(AppStateContext);

  return (
    <FlexRow width="100%" gap="0.5rem">
      <TeamSlot teamId={teamId} slotId={"1"} state={state.teamSlot1} />
      <TeamSlot teamId={teamId} slotId={"2"} state={state.teamSlot2} />
      <TeamSlot teamId={teamId} slotId={"3"} state={state.teamSlot3} />
      <TeamSlot teamId={teamId} slotId={"4"} state={state.teamSlot4} />
      <TeamSlot teamId={teamId} slotId={"5"} state={state.teamSlot5} />
      <div
        className={css`
          margin-left: 0.5rem;
        `}
      >
        <TeamSlot teamId={teamId} slotId={"6"} state={state.teamSlot6} invert={gameConfig.mode === "2p"} />
      </div>
    </FlexRow>
  );
};

const TeamInfoMobile = ({ playerId }: { playerId: keyof TeamState }) => {
  const { teamState } = useContext(TeamStateContext);
  const { gameConfig, teamStats } = useContext(AppStateContext);
  const is2P = gameConfig.mode === "2p";
  return (
    <FlexCol
      className={css`
        padding: 0.5rem;
        gap: 2rem;
      `}
    >
      <Team teamId={playerId} state={teamState[playerId]} />
      <TeamStatDisplay teamStat={teamStats[playerId]} keyP={playerId} is2P={is2P} />
    </FlexCol>
  );
};

export const TeamBlockMobile = ({ playerId, shouldShow }: { playerId: keyof TeamState; shouldShow: boolean }) => {
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
      <TeamInfoMobile playerId={playerId} />
    </FlexCol>
  ) : (
    <></>
  );
};
