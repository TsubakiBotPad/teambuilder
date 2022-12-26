import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import { AiOutlineCaretDown } from "react-icons/ai";
import { RxDotsHorizontal } from "react-icons/rx";

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

interface DropResult {
  dropEffect: string;
  target: TeamComponentId;
}

type ColorProps = {
  color: string;
  darken?: boolean;
};

const ColorBG = styled.div<ColorProps>`
  background-color: ${(props) => props.color};
  padding: 0.5rem;
  ${(props) => (props.darken ? "filter: saturate(200%) brightness(1.2)" : "")};
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
`;

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

  const { gameConfig } = useContext(AppStateContext);
  const { teamState, setTeamState } = useContext(TeamStateContext);

  const [, drag] = useDrag(
    () => ({
      type: DraggableTypes.slot,
      item: { cardId: componentId },
      end(item, monitor) {
        const dropResult = monitor.getDropResult() as DropResult;
        if (dropResult.dropEffect === "copy") {
          copySlot(teamState, setTeamState, componentId, dropResult.target);
        } else {
          swapSlot(teamState, setTeamState, componentId, dropResult.target);
        }
      }
    }),
    [gameConfig]
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DraggableTypes.slot,
      drop: (item, monitor) => {
        return {
          target: componentId
        };
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        x: monitor.getItem()
      })
    }),
    [componentId]
  );

  return (
    <div
      ref={drag}
      className={css`
        box-siding: border-box;
        cursor: grab;
      `}
    >
      <div ref={drop}>
        <FlexColC>
          <ColorBG color={"#f0f0f0"} darken={isOver}>
            <Card componentId={{ ...componentId, use: "assist" }} monster={state.assist} />
          </ColorBG>
          <FlexRowC>
            <AiOutlineCaretDown />
          </FlexRowC>
          <ColorBG color={invert ? otherTeamColor : teamIdToColor[teamId]} darken={isOver}>
            <FlexColC gap="0.25rem">
              <Card componentId={{ ...componentId, use: "base" }} monster={state.base} />
              <Latents componentId={{ ...componentId, use: "latents" }} latents={state.latents} teamSlot={state} />
            </FlexColC>
          </ColorBG>
          <GrabDots color={invert ? otherTeamColor : teamIdToColor[teamId]} darken={isOver}>
            <RxDotsHorizontal />
            <RxDotsHorizontal />
          </GrabDots>
        </FlexColC>
      </div>
    </div>
  );
};

const Team = ({ teamId, state }: { teamId: keyof TeamState; state: PlayerState }) => {
  const { gameConfig } = useContext(AppStateContext);

  return (
    <FlexCol gap="0.25rem">
      <FlexRow>
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
    </FlexCol>
  );
};

const TeamRow = styled(FlexRow)`
  padding: 0.5rem;
  gap: 2rem;
`;

export const TeamBlock = ({ playerId, shouldShow }: { playerId: keyof TeamState; shouldShow: boolean }) => {
  const { gameConfig, teamStats, setPlayerSelected, setBadgeModalIsOpen } = useContext(AppStateContext);
  const { teamState } = useContext(TeamStateContext);

  return shouldShow ? (
    <FlexCol gap="0.25rem">
      <FlexRowC gap="0.5rem">
        <H2>{playerId}</H2>
        {gameConfig.mode !== "2p" ? (
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
        <TeamStatDisplay teamStat={teamStats[playerId]} keyP={playerId} />
      </TeamRow>
    </FlexCol>
  ) : (
    <></>
  );
};
