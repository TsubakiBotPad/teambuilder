import { css } from "@emotion/css";
import styled from "@emotion/styled";
import React, { useContext } from "react";

import { PadAssetImage } from "../model/padAssets";
import { AppStateContext } from "../model/teamStateManager";
import { AWO_RES_LATENT_TO_AWO_MAP, LATENTS_ID_TO_NAME } from "../model/types/latents";
import { AwokenSkills } from "../model/types/monster";
import { FlexRow } from "../stylePrimitives";

type LatentEmptyProps = {
  hide: boolean;
};

const LatentEmpty = styled.div<LatentEmptyProps>`
  background-color: ${(props) => (props.hide ? "transparent" : "#lightyellow")};
  width: 5rem;
  height: 2.14rem;
  border: 2px dotted ${(props) => (props.hide ? "transparent" : "#aaa")};
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
        opacity: ${opacity};
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
  cardId,
  latents,
  awakenings,
  hide
}: {
  cardId: string;
  latents: number[];
  awakenings: AwokenSkills[];
  hide?: boolean;
}) => {
  const { setCardSlotSelected, setLatentModalIsOpen } = useContext(AppStateContext);
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

  const opacity = requiredAwakening in awakenings ? 1 : 0.5;

  const hasSixSlot = !!sixSlotLatentName;

  const remainderLatents = latents
    .filter((a) => Math.floor(a / 100) !== 6)
    .sort((a, b) => {
      return b - a;
    });

  return latents.length !== 0 ? (
    hide ? (
      <></>
    ) : (
      <LatentSelected
        onClick={
          !hide
            ? () => {
                setCardSlotSelected(cardId);
                setLatentModalIsOpen(true);
              }
            : () => {}
        }
      >
        {hasSixSlot ? (
          <>
            <SixSlotLatent latentName={sixSlotLatentName} halfBreakDamage={false} opacity={opacity} />
            <RemainderLatents>
              {remainderLatents.map((a) => {
                return <PadAssetImage assetName={LATENTS_ID_TO_NAME[a]} height={16} />;
              })}
            </RemainderLatents>
          </>
        ) : (
          <FlexRow gap="3px" wrap="wrap">
            {remainderLatents
              .sort((a, b) => {
                return b - a;
              })
              .map((a) => {
                return <PadAssetImage assetName={LATENTS_ID_TO_NAME[a]} height={16} />;
              })}
          </FlexRow>
        )}
      </LatentSelected>
    )
  ) : (
    <LatentEmpty
      onClick={
        !hide
          ? () => {
              setCardSlotSelected(cardId);
              setLatentModalIsOpen(true);
            }
          : () => {}
      }
      hide={!!hide}
    />
  );
};
