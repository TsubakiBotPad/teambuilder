import { css } from "@emotion/css";
import styled from "@emotion/styled";
import React, { useContext, useMemo, useState } from "react";

import { PadAssetImage } from "../model/padAssets";
import { AppStateContext, copyLatents, swapLatents, TeamSlotState, TeamStateContext } from "../model/teamStateManager";
import { AWO_RES_LATENT_TO_AWO_MAP, LATENTS_ID_TO_NAME } from "../model/types/latents";
import { FlexRow } from "../stylePrimitives";
import { computeTotalAwakeningsFromSlots } from "./teamStats/awakenings";
import { useDrag, useDrop } from "react-dnd";
import { DraggableTypes } from "../pages/padteambuilder";
import { TeamComponentId } from "./id";

interface DropResult {
  dropEffect: string;
  target: TeamComponentId;
}

const LatentEmpty = styled.div`
  background-color: "lightyellow";
  width: 5rem;
  height: 2.14rem;
  border: 2px dotted #aaa;
  box-sizing: border-box;
`;

const LatentSelected = styled(FlexRow)`
  background-color: lightred;
  width: 5rem;
  height: 2.14rem;
  flex-wrap: wrap;
  gap: 0px 2px;
`;

const RemainderLatents = styled.div`
  width: 50%;
  position: relative;
  top: -48%;
  left: 50%;
  display: flex;
  gap: 3px;
  justify-content: center;
`;

const SixSlotLatent = ({
  latentName,
  halfBreakDamage,
  opacity
}: {
  latentName: string;
  halfBreakDamage: boolean;
  opacity: number;
}) => {
  if (!latentName) {
    return <></>;
  }

  halfBreakDamage = true;
  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
        background: url(img/6slotL.png);
        background-size: contain;
        background-repeat: no-repeat;
        filter: grayscale(${opacity});
      `}
    >
      <PadAssetImage
        assetName={`${latentName}latentbase`}
        height={17}
        className={css`
          position: relative;
          top: ${halfBreakDamage ? 2 : 7}px;
          left: 11px;
        `}
      />
      {halfBreakDamage ? (
        <PadAssetImage
          assetName={`1.5xlatentbase`}
          height={12}
          className={css`
            position: relative;
            top: 1px;
            left: 13px;
          `}
        />
      ) : null}
    </div>
  );
};

export const Latents = ({
  componentId,
  latents,
  teamSlot
}: {
  componentId: Partial<TeamComponentId>;
  latents: number[];
  teamSlot: TeamSlotState;
}) => {
  const { setCardSlotSelected, setLatentModalIsOpen } = useContext(AppStateContext);
  const { teamState, setTeamState } = useContext(TeamStateContext);

  const [a2, setA2] = useState([] as number[]);

  const latentsBySize = latents.reduce((d, num) => {
    const idx = Math.floor((num as any) / 100);
    if (!d[idx]) {
      d[idx] = [];
    }
    d[idx].push(num);
    return d;
  }, {} as { [key: number]: number[] });

  const sixSlotLatent = latentsBySize[6] ?? [];
  const latentId = sixSlotLatent[0];
  const sixSlotLatentName = LATENTS_ID_TO_NAME[latentId];
  const requiredAwakening = AWO_RES_LATENT_TO_AWO_MAP[latentId];

  const opacity = a2.includes(requiredAwakening) ? 0 : 1;

  const hasSixSlot = !!sixSlotLatentName;

  const remainderLatents = latents
    .filter((a) => Math.floor(a / 100) !== 6)
    .sort((a, b) => {
      return b - a;
    });

  useMemo(() => {
    const f = async () => {
      if (hasSixSlot) {
        const a = await computeTotalAwakeningsFromSlots([teamSlot]);
        setA2(Object.keys(a).map((b) => parseInt(b)));
      }
    };
    f();
  }, [teamSlot, hasSixSlot]);

  const [, drag] = useDrag(() => ({
    type: DraggableTypes.latent,
    item: { cardId: componentId },
    end(item, monitor) {
      const dropResult = monitor.getDropResult() as DropResult;
      if (dropResult.dropEffect === "copy") {
        copyLatents(teamState, setTeamState, componentId, dropResult.target);
      } else {
        swapLatents(teamState, setTeamState, componentId, dropResult.target);
      }
    }
  }));

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DraggableTypes.latent,
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
        {latents.length !== 0 ? (
          <LatentSelected
            onClick={() => {
              setCardSlotSelected({ ...componentId, use: "latent" });
              setLatentModalIsOpen(true);
            }}
          >
            {hasSixSlot ? (
              <>
                <SixSlotLatent latentName={sixSlotLatentName} halfBreakDamage={false} opacity={opacity} />
                <RemainderLatents>
                  {remainderLatents.map((a, i) => {
                    return (
                      <PadAssetImage assetName={LATENTS_ID_TO_NAME[a]} height={16} key={LATENTS_ID_TO_NAME[a] + i} />
                    );
                  })}
                </RemainderLatents>
              </>
            ) : (
              <FlexRow gap="3px" wrap="wrap">
                {remainderLatents
                  .sort((a, b) => {
                    return b - a;
                  })
                  .map((a, i) => {
                    return (
                      <PadAssetImage assetName={LATENTS_ID_TO_NAME[a]} height={16} key={LATENTS_ID_TO_NAME[a] + i} />
                    );
                  })}
              </FlexRow>
            )}
          </LatentSelected>
        ) : (
          <LatentEmpty
            onClick={() => {
              setCardSlotSelected({ ...componentId, use: "latent" });
              setLatentModalIsOpen(true);
            }}
          />
        )}
      </div>
    </div>
  );
};
