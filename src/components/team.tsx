import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { toNumber } from "lodash";
import { useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import { AiOutlineCaretDown } from "react-icons/ai";
import { RxDotsHorizontal } from "react-icons/rx";
import useModifierKey from "../hooks/useModifierKey";

import {
  AppStateContext,
  copySlot,
  PlayerState,
  swapSlot,
  TeamSlotState,
  TeamState,
  TeamStateContext
} from "../model/teamStateManager";
import { DraggableTypes } from "../pages/padteambuilder";
import { FlexCol, FlexColC, FlexRow, FlexRowC, H2 } from "../stylePrimitives";
import { BadgeDisplay } from "./badge";
import { Card } from "./card";
import { TeamComponentId } from "./id";
import { Latents } from "./latent";
import { TeamStatDisplay } from "./teamStats/teamStats";
import { TeamSlot } from "./teamSlot";

interface DropResult {
  dropEffect: string;
  target: TeamComponentId;
}

type ColorProps = {
  color: string;
  darken?: boolean;
  grayscale?: boolean;
};

const ColorBG = styled.div<ColorProps>`
  background-color: ${(props) => props.color};
  padding: 0.25rem;
  ${(props) => (props.darken ? "filter: saturate(200%) brightness(1.2)" : "")};
  ${(props) => (props.grayscale ? "filter:grayscale(1)" : "")};
  width: 100%;
`;

const teamIdToColor: { [key in string]: string } = {
  p1: "pink",
  p2: "lightblue",
  p3: "lightgreen"
};

const GrabDots = styled.div<ColorProps>`
  height: 1rem;
  color: #555;
  cursor: grab;
  background-color: ${(props) => props.color};
  width: 100%;
  display: flex;
  justify-content: center;
  ${(props) => (props.darken ? "filter: saturate(200%) brightness(1.2)" : "")};
  padding: 0.25rem;
`;

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

const TeamRow = styled(FlexRow)`
  padding: 0.5rem;
  gap: 2rem;
  width: 100%;
`;

export const TeamBlock = ({ playerId, shouldShow }: { playerId: keyof TeamState; shouldShow: boolean }) => {
  const { gameConfig, teamStats, setPlayerSelected, setBadgeModalIsOpen } = useContext(AppStateContext);
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
      <TeamRow>
        <Team teamId={playerId} state={teamState[playerId]} />
        {/* <TeamStatDisplay teamStat={teamStats[playerId]} keyP={playerId} is2P={is2P} /> */}
      </TeamRow>
    </FlexCol>
  ) : (
    <></>
  );
};
