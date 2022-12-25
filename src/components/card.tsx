import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { useContext } from "react";
import { useDrag, useDrop } from "react-dnd";

import { ColorKey, getColor } from "../colors";
import { AwakeningImage, BASE_ICON_URL } from "../model/images";
import { PadAssetImage } from "../model/padAssets";
import { AppStateContext, copyCard, swapCards, TeamCardInfo, TeamStateContext } from "../model/teamStateManager";
import { DraggableTypes } from "../pages/padteambuilder";
import { FlexColC } from "../stylePrimitives";
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

const CardSelectedImage = styled.div<CardSelectedType>`
  background: ${(props) => `url("${BASE_ICON_URL}${leftPad(props.monsterId, 5)}.png")`};
  background-size: cover;
  width: 5rem;
  height: 5rem;
  position: relative;
`;

const CardOverlayText = styled.div`
  font-size: 0.75rem;
  font-weight: bold;
  color: #fff;
`;

const LevelText = ({ level }: { level: number }) => {
  return (
    <CardOverlayText>
      <div
        className={css`
          color: ${getColor(`LEVEL_${level}` as ColorKey)};
        `}
      >
        Lv{level}
      </div>
    </CardOverlayText>
  );
};

const BottomOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: space-between;
  padding: 0.1rem 0.15rem;
`;

const CardSelected = ({ monster, componentId }: { componentId: Partial<TeamComponentId>; monster: TeamCardInfo }) => {
  const { setModalIsOpen, setCardSlotSelected } = useContext(AppStateContext);

  return (
    <CardSelectedImage
      monsterId={monster.id}
      onClick={() => {
        setCardSlotSelected(componentId);
        setModalIsOpen(true);
      }}
    >
      {/* +297 */}
      <div
        className={css`
          color: yellow;
          -webkit-text-stroke: 0.5px black;
          font-weight: 1000;
          position: absolute;
          padding: 0.15rem;
        `}
      >
        +297
      </div>

      {/* Right Corner */}
      <div
        className={css`
          position: absolute;
          right: 0;
          top: 0;
          padding: 0.15rem;
          & div:not(:last-child) {
            margin-bottom: 0.15rem;
          }
        `}
      >
        <FlexColC gap={"0.25rem"}>
          <img src={"img/awoInheritable.png"} width={"20px"} />
          <div>{monster.sa ? <AwakeningImage awakeningId={monster.sa} width={22} /> : null}</div>
        </FlexColC>
      </div>

      {/* Bottom Info */}
      <div
        className={css`
          position: absolute;
          bottom: 0%;
          width: 100%;
        `}
      >
        <BottomOverlay>
          <LevelText level={monster.level} />
          <CardOverlayText>#{monster.id}</CardOverlayText>
        </BottomOverlay>
      </div>
    </CardSelectedImage>
  );
};

export const Card = ({ componentId, monster }: { componentId: Partial<TeamComponentId>; monster: TeamCardInfo }) => {
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
        {monster.id !== 0 ? (
          <CardSelected monster={monster} componentId={componentId} />
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
