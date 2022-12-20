import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { useContext } from "react";
import { useDrag, useDrop } from "react-dnd";

import { BASE_ICON_URL } from "../model/images";
import { AppStateContext, copyCard, swapCards, TeamStateContext } from "../model/teamStateManager";
import { DraggableTypes } from "../pages/padteambuilder";
import { leftPad } from "./generic/leftPad";
import { TeamComponentId } from "./id";

interface DropResult {
  dropEffect: string;
  target: TeamComponentId;
}

const CardEmpty = styled.div`
  background-color: "#fefefe";
  width: 5rem;
  height: 5rem;
  border: 2px dotted #aaa;
  box-sizing: border-box;
`;

type CardSelectedType = {
  monsterId: number;
};

const CardSelected = styled.div<CardSelectedType>`
  background: ${(props) => `url("${BASE_ICON_URL}${leftPad(props.monsterId, 5)}.png")`};
  background-size: cover;
  width: 5rem;
  height: 5rem;
`;

export const Card = ({ componentId, monsterId }: { componentId: Partial<TeamComponentId>; monsterId: number }) => {
  const { setModalIsOpen, setCardSlotSelected } = useContext(AppStateContext);
  const { teamState, setTeamState } = useContext(TeamStateContext);

  const [, drag] = useDrag(() => ({
    type: DraggableTypes.card,
    item: { cardId: componentId },
    end(item, monitor) {
      const dropResult = monitor.getDropResult() as DropResult;
      if (dropResult.dropEffect === "copy") {
        copyCard(teamState, setTeamState, componentId, dropResult.target);
      } else {
        swapCards(teamState, setTeamState, componentId, dropResult.target);
      }
    }
  }));

  const [, drop] = useDrop(
    () => ({
      accept: DraggableTypes.card,
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
        cursor: grab;
      `}
    >
      <div ref={drop}>
        {monsterId !== 0 ? (
          <CardSelected
            monsterId={monsterId}
            onClick={() => {
              setCardSlotSelected(componentId);
              setModalIsOpen(true);
            }}
          />
        ) : (
          <CardEmpty
            onClick={() => {
              setCardSlotSelected(componentId);
              setModalIsOpen(true);
            }}
          />
        )}
      </div>
    </div>
  );
};
