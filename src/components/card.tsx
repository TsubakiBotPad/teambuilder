import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { useContext } from "react";
import { useDrag, useDrop } from "react-dnd";

import { AwakeningImage, BASE_ICON_URL } from "../model/images";
import { PadAssetImage } from "../model/padAssets";
import { AppStateContext, copyCard, swapCards, TeamStateContext } from "../model/teamStateManager";
import { AwokenSkills } from "../model/types/monster";
import { DraggableTypes } from "../pages/padteambuilder";
import { FlexCol, FlexRow } from "../stylePrimitives";
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

const LEVEL_TO_COLOR: { [key: number]: string } = {
  99: "white",
  110: "#85BCFF",
  120: "#18F794"
};

const LevelText = ({ level }: { level: number }) => {
  return (
    <CardOverlayText>
      <div
        className={css`
          color: ${LEVEL_TO_COLOR[level]};
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
            >
              <div>
                <FlexRow
                  justifyContent="space-between"
                  className={css`
                    padding: 0.15rem;
                  `}
                >
                  <div
                    className={css`
                      color: yellow;
                      -webkit-text-stroke: 0.5px black;
                      font-weight: bold;
                    `}
                  >
                    +297
                  </div>
                  <PadAssetImage assetName="jsf" height={20} />
                </FlexRow>
                <FlexRow justifyContent="flex-end">
                  <AwakeningImage awakeningId={AwokenSkills.BLOBBOOST} width={23} />
                </FlexRow>
                <div
                  className={css`
                    padding-top: 1.13rem;
                  `}
                >
                  <BottomOverlay>
                    <LevelText level={120} />
                    <CardOverlayText>#{monsterId}</CardOverlayText>
                  </BottomOverlay>
                </div>
              </div>
            </CardSelected>
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
