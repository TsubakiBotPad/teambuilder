import styled from "@emotion/styled";
import React, { useContext, useEffect } from "react";
import { AiOutlineCaretDown } from "react-icons/ai";

import { AppStateContext, PlayerState, TeamSlotState } from "../model/teamStateManager";
import { AwokenSkills } from "../model/types/monster";
import { FlexCol, FlexColC, FlexRow, FlexRowC, H2 } from "../stylePrimitives";
import { BadgeDisplay } from "./badge";
import { Card } from "./card";
import { Latents } from "./latent";

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

const TeamSlot = ({
  teamId,
  slotId,
  state,
  hide
}: {
  teamId: string;
  slotId: string;
  state: TeamSlotState;
  hide?: boolean;
}) => {
  const awakenings: AwokenSkills[] = []; // TODO: Populate this correctly

  return (
    <FlexColC>
      <ColorBG color={hide ? "transparent" : "#f0f0f0"}>
        <Card cardId={`${teamId}-Slot${slotId}-Assist`} monsterId={state.assistId} hide={hide} />
      </ColorBG>
      <FlexRowC>
        {hide ? null : (
          <>
            <AiOutlineCaretDown /> Assist
          </>
        )}
      </FlexRowC>
      <ColorBG color={hide ? "transparent" : teamIdToColor[teamId]}>
        <FlexColC gap="0.25rem">
          <Card cardId={`${teamId}-Slot${slotId}-Base`} monsterId={state.baseId} hide={hide} />
          <Latents
            cardId={`${teamId}-Slot${slotId}-Base`}
            latents={state.latents}
            hide={hide}
            awakenings={awakenings}
          />
        </FlexColC>
      </ColorBG>
    </FlexColC>
  );
};

export const Team = ({ teamId, state }: { teamId: string; state: PlayerState }) => {
  const { gameConfig, setPlayerSelected, setBadgeModalIsOpen } = useContext(AppStateContext);

  if (gameConfig.mode === "2p") {
    if (teamId === "P1") {
    }
    return (
      <FlexCol gap="0.25rem">
        <H2>{teamId}</H2>
        <FlexRow>
          <TeamSlot teamId={teamId} slotId={"1"} state={state.teamSlot1} hide={teamId === "P2"} />
          <TeamSlot teamId={teamId} slotId={"2"} state={state.teamSlot2} />
          <TeamSlot teamId={teamId} slotId={"3"} state={state.teamSlot3} />
          <TeamSlot teamId={teamId} slotId={"4"} state={state.teamSlot4} />
          <TeamSlot teamId={teamId} slotId={"5"} state={state.teamSlot5} />
          <TeamSlot teamId={teamId} slotId={"6"} state={state.teamSlot6} hide={teamId === "P1"} />
        </FlexRow>
      </FlexCol>
    );
  }

  return (
    <FlexCol gap="0.25rem">
      <FlexRowC gap="0.5rem">
        <H2>{teamId}</H2>
        <BadgeDisplay
          onClick={() => {
            setPlayerSelected(teamId.toLocaleLowerCase());
            setBadgeModalIsOpen(true);
          }}
          badgeName={state.badgeId}
        />
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
