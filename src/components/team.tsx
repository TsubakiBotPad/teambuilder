import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { useContext } from "react";
import { AiOutlineCaretDown } from "react-icons/ai";

import { AppStateContext, PlayerState, TeamSlotState, TeamState } from "../model/teamStateManager";
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
  p1: "pink",
  p2: "lightblue",
  p3: "lightgreen"
};

const TeamSlot = ({
  teamId,
  slotId,
  state,
  invert
}: {
  teamId: keyof TeamState;
  slotId: string;
  state: TeamSlotState;
  invert?: boolean;
}) => {
  const otherTeamColor = teamId === "p1" ? teamIdToColor["p2"] : teamIdToColor["p1"];
  const componentId = { teamId: teamId, slotId: `teamSlot${slotId}` as keyof PlayerState };

  return (
    <FlexColC>
      <ColorBG color={"#f0f0f0"}>
        <Card componentId={{ ...componentId, use: "assist" }} monsterId={state.assistId} />
      </ColorBG>
      <FlexRowC>
        <AiOutlineCaretDown />
      </FlexRowC>
      <ColorBG color={invert ? otherTeamColor : teamIdToColor[teamId]}>
        <FlexColC gap="0.25rem">
          <Card componentId={{ ...componentId, use: "base" }} monsterId={state.baseId} />
          <Latents componentId={{ ...componentId, use: "latent" }} latents={state.latents} teamSlot={state} />
        </FlexColC>
      </ColorBG>
    </FlexColC>
  );
};

export const Team = ({ teamId, state }: { teamId: keyof TeamState; state: PlayerState }) => {
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
        {gameConfig.mode === "2p" ? (
          <div
            className={css`
              margin-left: 0.5rem;
            `}
          >
            <TeamSlot teamId={teamId} slotId={"6"} state={state.teamSlot6} invert={true} />
          </div>
        ) : (
          <TeamSlot teamId={teamId} slotId={"6"} state={state.teamSlot6} />
        )}
      </FlexRow>
    </FlexCol>
  );
};
