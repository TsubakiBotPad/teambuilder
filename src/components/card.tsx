import { css } from "@emotion/css";
import styled from "@emotion/styled";
import React, { useState } from "react";
import { BASE_ICON_URL } from "../model/images";
import { PadAssetImage } from "../model/padAssets";
import { LATENTS_ID_TO_NAME } from "../model/types/latents";
import { FlexRow } from "../stylePrimitives";
import { leftPad } from "./generic/leftPad";

const CardEmpty = styled.div`
  background-color: #fefefe;
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

export const Card = ({
  cardId,
  setModalIsOpen,
  setCardSlotSelected,
  monsterId
}: {
  cardId: string;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCardSlotSelected: React.Dispatch<React.SetStateAction<string>>;
  monsterId: number;
}) => {
  return monsterId !== 0 ? (
    <CardSelected
      monsterId={monsterId}
      onClick={() => {
        setCardSlotSelected(cardId);
        setModalIsOpen(true);
      }}
    />
  ) : (
    <CardEmpty
      onClick={() => {
        setCardSlotSelected(cardId);
        setModalIsOpen(true);
      }}
    />
  );
};

const LatentEmpty = styled.div`
  background-color: lightyellow;
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

const SixSlotLatent = ({ latentName, halfBreakDamage }: { latentName: string; halfBreakDamage: boolean }) => {
  console.log(`"6 slot ${latentName}`);
  if (!latentName) {
    return <></>;
  }

  halfBreakDamage = true;
  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
        background-image: url(img/6slotL.png);
        background-size: contain;
        background-repeat: no-repeat;
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
  setLatentModalIsOpen,
  setCardSlotSelected,
  latents
}: {
  cardId: string;
  setLatentModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCardSlotSelected: React.Dispatch<React.SetStateAction<string>>;
  latents: number[];
}) => {
  const latentsBySize = latents.reduce((d, num) => {
    const idx = Math.floor((num as any) / 100);
    if (!d[idx]) {
      d[idx] = [];
    }
    d[idx].push(num);
    return d;
  }, {} as { [key: number]: number[] });

  const sixSlotLatent = latentsBySize[6] ?? [];
  const sixSlotLatentName = LATENTS_ID_TO_NAME[sixSlotLatent[0]];

  const hasSixSlot = !!sixSlotLatentName;

  const remainderLatents = latents
    .filter((a) => Math.floor(a / 100) !== 6)
    .sort((a, b) => {
      return b - a;
    });

  return latents.length !== 0 ? (
    <LatentSelected
      onClick={() => {
        setCardSlotSelected(cardId);
        setLatentModalIsOpen(true);
      }}
    >
      {hasSixSlot ? (
        <>
          <SixSlotLatent latentName={sixSlotLatentName} halfBreakDamage={false} />
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
  ) : (
    <LatentEmpty
      onClick={() => {
        setCardSlotSelected(cardId);
        setLatentModalIsOpen(true);
      }}
    />
  );
};
