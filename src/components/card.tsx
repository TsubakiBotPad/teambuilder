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

const CardOverlayText = styled.div`
  font-size: 0.75rem;
  font-weight: bold;
  color: #fff;
`;

const CardOverlaySpacer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 0.1rem;
`;

export const Card = ({ componentId, monsterId }: { componentId: Partial<TeamComponentId>; monsterId: number }) => {
  const { setModalIsOpen, setCardSlotSelected, gameConfig } = useContext(AppStateContext);
  const { teamState, setTeamState } = useContext(TeamStateContext);

  const [, drag] = useDrag(
    () => ({
      type: DraggableTypes.card,
      item: { cardId: componentId },
      end(item, monitor) {
        const dropResult = monitor.getDropResult() as DropResult;
        if (!dropResult) {
          return;
        }

        if (dropResult.dropEffect === "copy") {
          copyCard(gameConfig, teamState, setTeamState, componentId, dropResult.target);
        } else {
          swapCards(gameConfig, teamState, setTeamState, componentId, dropResult.target);
        }
      }
    }),
    [gameConfig]
  );

  const [{ isOver }, drop] = useDrop(
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
        box-siding: border-box;
        border: 2px solid ${isOver ? "yellow" : "transparent"};
        cursor: grab;
      `}
    >
      <div ref={drop}>
        {monsterId !== 0 ? (
          <>
            <CardSelected
              monsterId={monsterId}
              onClick={() => {
                setCardSlotSelected(componentId);
                setModalIsOpen(true);
              }}
            />
            <div
              className={css`
                position: relative;
                top: -0.75rem;
                left: 0;
                background-color: rgba(0, 0, 0, 0.75);
              `}
            >
              <CardOverlaySpacer>
                <CardOverlayText>Lvl</CardOverlayText>
                <CardOverlayText>#{monsterId}</CardOverlayText>
              </CardOverlaySpacer>
            </div>
          </>
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
