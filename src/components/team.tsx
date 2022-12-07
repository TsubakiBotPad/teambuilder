import styled from "@emotion/styled";
import React, { useState } from "react";
import { AiOutlineCaretDown } from "react-icons/ai";

import { PlayerState, TeamSlotState } from "../model/teamStateManager";
import { FlexCol, FlexColC, FlexRow, FlexRowC, H2 } from "../stylePrimitives";
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
  P3: "lightgreen",
};

const TeamSlot = ({
  teamId,
  slotId,
  setModalIsOpen,
  setCardSlotSelected,
  setLatentModalIsOpen,
  state,
}: {
  teamId: string;
  slotId: string;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCardSlotSelected: React.Dispatch<React.SetStateAction<string>>;
  setLatentModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  state: TeamSlotState;
}) => {
  return (
    <FlexColC>
      <ColorBG color="#f0f0f0">
        <Card
          cardId={`${teamId}-Slot${slotId}-Assist`}
          setModalIsOpen={setModalIsOpen}
          setCardSlotSelected={setCardSlotSelected}
          monsterId={state.assistId}
        />
      </ColorBG>
      <FlexRowC>
        <AiOutlineCaretDown /> Assist
      </FlexRowC>
      <ColorBG color={teamIdToColor[teamId]}>
        <FlexColC gap="0.25rem">
          <Card
            cardId={`${teamId}-Slot${slotId}-Base`}
            setModalIsOpen={setModalIsOpen}
            setCardSlotSelected={setCardSlotSelected}
            monsterId={state.baseId}
          />
          <Latents
            cardId={`${teamId}-Slot${slotId}-Base`}
            setLatentModalIsOpen={setLatentModalIsOpen}
            setCardSlotSelected={setCardSlotSelected}
            latents={state.latents}
          />
        </FlexColC>
      </ColorBG>
    </FlexColC>
  );
};

export const Team = ({
  teamId,
  teamColor,
  setModalIsOpen,
  setCardSlotSelected,
  setLatentModalIsOpen,
  state,
}: {
  teamId: string;
  teamColor: string;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLatentModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCardSlotSelected: React.Dispatch<React.SetStateAction<string>>;
  state: PlayerState;
}) => {
  return (
    <FlexCol gap="0.25rem">
      <FlexRowC>
        <H2>{teamId}</H2>
        <span>Badge Icon</span>
      </FlexRowC>
      <FlexRow>
        <TeamSlot
          teamId={teamId}
          slotId={"1"}
          setModalIsOpen={setModalIsOpen}
          setLatentModalIsOpen={setLatentModalIsOpen}
          setCardSlotSelected={setCardSlotSelected}
          state={state.teamSlot1}
        />
        <TeamSlot
          teamId={teamId}
          slotId={"2"}
          setModalIsOpen={setModalIsOpen}
          setLatentModalIsOpen={setLatentModalIsOpen}
          setCardSlotSelected={setCardSlotSelected}
          state={state.teamSlot2}
        />
        <TeamSlot
          teamId={teamId}
          slotId={"3"}
          setModalIsOpen={setModalIsOpen}
          setLatentModalIsOpen={setLatentModalIsOpen}
          setCardSlotSelected={setCardSlotSelected}
          state={state.teamSlot3}
        />
        <TeamSlot
          teamId={teamId}
          slotId={"4"}
          setModalIsOpen={setModalIsOpen}
          setLatentModalIsOpen={setLatentModalIsOpen}
          setCardSlotSelected={setCardSlotSelected}
          state={state.teamSlot4}
        />
        <TeamSlot
          teamId={teamId}
          slotId={"5"}
          setModalIsOpen={setModalIsOpen}
          setLatentModalIsOpen={setLatentModalIsOpen}
          setCardSlotSelected={setCardSlotSelected}
          state={state.teamSlot5}
        />
        <TeamSlot
          teamId={teamId}
          slotId={"6"}
          setModalIsOpen={setModalIsOpen}
          setLatentModalIsOpen={setLatentModalIsOpen}
          setCardSlotSelected={setCardSlotSelected}
          state={state.teamSlot6}
        />
      </FlexRow>
    </FlexCol>
  );
};
