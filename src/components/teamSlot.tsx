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
  TeamCardInfo,
  TeamSlotState,
  TeamState,
  TeamStateContext
} from "../model/teamStateManager";
import { DraggableTypes } from "../pages/padteambuilder";
import { FlexColC } from "../stylePrimitives";
import { Card } from "./card";
import { TeamComponentId } from "./id";
import { Latents } from "./latent";
import { breakpoint } from "../breakpoints";

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
  padding: 0rem;

  @media ${breakpoint.xl} {
    padding: 0.25rem;
  }

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
  padding: 0rem;

  @media ${breakpoint.xl} {
    padding: 0.25rem;
  }
`;

type ComponentId = {
  teamId: keyof TeamState;
  slotId: keyof PlayerState;
};

const AssistRow = ({
  isOver,
  hasAssists,
  componentId,
  monster
}: {
  isOver: boolean;
  hasAssists: boolean;
  componentId: ComponentId;
  monster: TeamCardInfo;
}) => {
  return (
    <ColorBG color={"#f0f0f0"} darken={isOver} grayscale={!hasAssists}>
      <FlexColC>
        <Card componentId={{ ...componentId, use: "assist" }} monster={monster} />
      </FlexColC>
    </ColorBG>
  );
};

const MonsterRow = ({
  isOver,
  componentId,
  color,
  subattr,
  state
}: {
  isOver: boolean;
  componentId: ComponentId;
  color: string;
  subattr: number | undefined;
  state: TeamSlotState;
}) => {
  return (
    <ColorBG color={color} darken={isOver}>
      <FlexColC gap="0.25rem">
        <Card componentId={{ ...componentId, use: "base" }} monster={state.base} subattr={subattr} />
        <Latents componentId={{ ...componentId, use: "latents" }} latents={state.latents} teamSlot={state} />
      </FlexColC>
    </ColorBG>
  );
};

export const TeamSlot = ({
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

  const { gameConfig, dungeonEffects, teamStats } = useContext(AppStateContext);
  const { teamState, setTeamState } = useContext(TeamStateContext);
  const hasAssists = dungeonEffects.hasAssists;
  const subattrs = teamStats[teamId]?.teamSubattributes;

  const ctrlKeyDown = useModifierKey("Control");
  const altKeyDown = useModifierKey("Alt");
  const [, drag] = useDrag(
    () => ({
      type: DraggableTypes.slot,
      item: { cardId: componentId },
      end(item, monitor) {
        const dropResult = monitor.getDropResult() as DropResult;
        if (ctrlKeyDown || altKeyDown) {
          copySlot(teamState, setTeamState, componentId, dropResult.target);
        } else {
          swapSlot(teamState, setTeamState, componentId, dropResult.target);
        }
      }
    }),
    [gameConfig, ctrlKeyDown, altKeyDown]
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

  const slot = toNumber(slotId) - 1;
  var subattr = undefined;
  if (subattrs) {
    subattr = subattrs[slot];
  }

  const teamColor = invert ? otherTeamColor : teamIdToColor[teamId];

  return (
    <div
      ref={drag}
      className={css`
        box-siding: border-box;
        cursor: grab;
      `}
    >
      <div ref={drop}>
        <FlexColC
          className={css`
            position: relative;
          `}
        >
          <AssistRow isOver={isOver} hasAssists={hasAssists} componentId={componentId} monster={state.assist} />
          <AiOutlineCaretDown />
          <MonsterRow isOver={isOver} color={teamColor} state={state} subattr={subattr} componentId={componentId} />
          <GrabDots color={teamColor} darken={isOver}>
            <RxDotsHorizontal />
            <RxDotsHorizontal />
          </GrabDots>
        </FlexColC>
      </div>
    </div>
  );
};
