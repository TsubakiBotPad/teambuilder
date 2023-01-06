import { css } from "@emotion/css";
import styled from "@emotion/styled";
import React, { useContext, useMemo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

import { monsterCacheClient } from "../model/monsterCacheClient";
import { PadAssetImage } from "../model/padAssets";
import { AppStateContext, copyLatents, swapLatents, TeamSlotState, TeamStateContext } from "../model/teamStateManager";
import {
  AWO_RES_LATENT_TO_AWO_MAP,
  HALF_BREAK_DAMAGE_AWOS,
  LATENTS_ID_TO_NAME,
  UNRESTRICTED_AWOS
} from "../model/types/latents";
import { DraggableTypes } from "../pages/padteambuilder";
import { FlexRow } from "../stylePrimitives";
import { TeamComponentId } from "./id";
import { computeTotalAwakeningsFromSlots } from "./teamStats/awakenings";

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
  position: relative;
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
  valid
}: {
  latentName: string;
  halfBreakDamage: boolean;
  valid: boolean;
}) => {
  if (!latentName) {
    return <></>;
  }

  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
        background: url(img/6slotL.png);
        background-size: contain;
        background-repeat: no-repeat;
        filter: grayscale(${valid ? 0 : 1});
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
  const { gameConfig, setCardSlotSelected, setLatentModalIsOpen, statsTab } = useContext(AppStateContext);
  const { teamState, setTeamState } = useContext(TeamStateContext);

  const [monsterAwakenings, setMonsterAwakenings] = useState([] as number[]);
  const [hasError, setHasError] = useState(false);

  const not2P = gameConfig.mode !== "2p";

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

  const valid =
    UNRESTRICTED_AWOS.includes(sixSlotLatentName) ||
    monsterAwakenings.includes(requiredAwakening) ||
    (sixSlotLatentName === "dbl" && teamSlot.base.level > 110);

  const hasSixSlot = !!sixSlotLatentName;
  const showHalfBreakDamage = HALF_BREAK_DAMAGE_AWOS.includes(sixSlotLatentName) && teamSlot.base.level > 110;

  const remainderLatents = latents
    .filter((a) => Math.floor(a / 100) !== 6)
    .sort((a, b) => {
      return b - a;
    });

  useMemo(() => {
    const f = async () => {
      if (teamState) {
        // This is here just to get rid of the useMemo warning.
      }
      if (teamSlot.base.id > 0) {
        const m = await monsterCacheClient.get(teamSlot.base.id);
        if (m) {
          const numSlots = m!.latent_slots;
          const latentSize = teamSlot.latents.reduce((d, num) => {
            const size = Math.floor((num as any) / 100);
            return d + size;
          }, 0);
          setHasError(latentSize > numSlots);
        }
      } else if (teamSlot.base.id === 0) {
        setHasError(false);
      }

      // check validity of awakening-restricted latents
      if (hasSixSlot) {
        const a = await computeTotalAwakeningsFromSlots([teamSlot], not2P, statsTab[0] !== "main");
        setMonsterAwakenings(Object.keys(a).map((b) => parseInt(b)));
      }
    };
    f();
  }, [teamState, teamSlot, hasSixSlot, not2P, setHasError, statsTab]);

  const [, drag] = useDrag(() => ({
    type: DraggableTypes.latent,
    item: { cardId: componentId },
    end(item, monitor) {
      const dropResult = monitor.getDropResult() as DropResult;
      if (!dropResult) {
        return;
      }

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
              setCardSlotSelected({ ...componentId, use: "latents" });
              setLatentModalIsOpen(true);
            }}
          >
            {hasSixSlot ? (
              <>
                <SixSlotLatent latentName={sixSlotLatentName} halfBreakDamage={showHalfBreakDamage} valid={valid} />
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
            <div
              className={css`
                position: absolute;
                top: -17%;
                left: 85%;
                width: 1rem;
              `}
            >
              {hasError ? <img src="img/warning.png" width={"17rem"} alt="warn" /> : null}
            </div>
          </LatentSelected>
        ) : (
          <LatentEmpty
            onClick={() => {
              setCardSlotSelected({ ...componentId, use: "latents" });
              setLatentModalIsOpen(true);
            }}
          />
        )}
      </div>
    </div>
  );
};
