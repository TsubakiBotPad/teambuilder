import { css } from "@emotion/css";
import { useContext } from "react";

import { AppStateContext, PlayerState, TeamState } from "../model/teamStateManager";
import { FlexRow } from "../stylePrimitives";
import { TeamSlot } from "./teamSlot";

export const TeamDisplay = ({ teamId, state, gap }: { teamId: keyof TeamState; state: PlayerState; gap?: string }) => {
  const { gameConfig } = useContext(AppStateContext);

  return (
    <FlexRow gap={gap ?? "0.25rem"}>
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
