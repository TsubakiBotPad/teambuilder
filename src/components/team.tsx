import styled from "@emotion/styled";
import React, { useContext } from "react";
import { AiOutlineCaretDown } from "react-icons/ai";

import { AppStateContext, PlayerState, TeamSlotState } from "../model/teamStateManager";
import { FlexCol, FlexColC, FlexRow, FlexRowC, H2 } from "../stylePrimitives";
import { BadgeDisplay } from "./badge";
import { Card, Latents } from "./card";

type ColorProps = {
  color: string;
};

const ColorBG = styled.div<ColorProps>`
  background-color: ${(props) => props.color};
  padding: 0.5rem;
  line-height: 0;
`;

const teamIdToColor: { [key in string]: string } = {
  P1: "pink",
  P2: "lightblue",
  P3: "lightgreen"
};

const TeamSlot = ({ teamId, slotId, state }: { teamId: string; slotId: string; state: TeamSlotState }) => {
  return (
    <FlexColC>
      <ColorBG color="#f0f0f0">
        <Card cardId={`${teamId}-Slot${slotId}-Assist`} monsterId={state.assistId} />
      </ColorBG>
      <FlexRowC>
        <AiOutlineCaretDown /> Assist
      </FlexRowC>
      <ColorBG color={teamIdToColor[teamId]}>
        <FlexColC gap="0.25rem">
          <Card cardId={`${teamId}-Slot${slotId}-Base`} monsterId={state.baseId} />
          <Latents cardId={`${teamId}-Slot${slotId}-Base`} latents={state.latents} />
        </FlexColC>
      </ColorBG>
    </FlexColC>
  );
};

export const Team = ({ teamId, state }: { teamId: string; state: PlayerState }) => {
  const { gameConfig, setPlayerSelected, setBadgeModalIsOpen } = useContext(AppStateContext);

  return (
    <FlexCol gap="0.25rem">
      <FlexRowC gap="0.5rem">
        <H2>{teamId}</H2>
        {gameConfig.mode !== "2p" ? (
          <BadgeDisplay
            onClick={() => {
              setPlayerSelected(teamId.toLocaleLowerCase());
              setBadgeModalIsOpen(true);
            }}
            badgeName={state.badgeId}
          />
        ) : null}
      </FlexRowC>
      <FlexRow>
        <TeamSlot teamId={teamId} slotId={"1"} state={state.teamSlot1} />
        <TeamSlot teamId={teamId} slotId={"2"} state={state.teamSlot2} />
        <TeamSlot teamId={teamId} slotId={"3"} state={state.teamSlot3} />
        <TeamSlot teamId={teamId} slotId={"4"} state={state.teamSlot4} />
        <TeamSlot teamId={teamId} slotId={"5"} state={state.teamSlot5} />
        <TeamSlot teamId={teamId} slotId={"6"} state={state.teamSlot6} />
      </FlexRow>
    </FlexCol>
  );
};
