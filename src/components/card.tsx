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
  height: 2rem;
  border: 2px dotted #aaa;
`;

const LatentSelected = styled(FlexRow)`
  background-color: lightred;
  width: 5rem;
  height: 2rem;
  padding: 2px 0;
  flex-wrap: wrap;
  gap: 0px 2px;
  justify-content: center;
  border-left: 2px solid transparent;
  border-right: 2px solid transparent;
`;

type LatentImgProps = {
  hasSixSlot: boolean;
};

const SixSlotLatentImg = styled.div<LatentImgProps>`
  background-image: ${(props) => (props.hasSixSlot ? "url(img/6slotL.png)" : "")};
  width: 5rem;
  height: 36px;
  background-size: 80px 36px;
  position: relative;
`;

type RemainderLatentsProps = {
  hasSixSlot: boolean;
};

const RemainderLatents = styled.div<RemainderLatentsProps>`
  width: 50%;
  position: relative;
  top: -17px;
  left: 50%;
  display: flex;
  gap: 3px;
`;

const SixSlotLatent = ({
  shouldDisplay,
  latentName,
  halfBreakDamage
}: {
  shouldDisplay: boolean;
  latentName: string;
  halfBreakDamage: boolean;
}) => {
  console.log(`"6 slot ${latentName}`);
  if (!latentName) {
    return <></>;
  }

  return (
    <div>
      <SixSlotLatentImg hasSixSlot={shouldDisplay} />
      <div
        className={css`
          height: 0;
        `}
      >
        <PadAssetImage
          assetName={`${latentName}latentbase`}
          height={18}
          className={css`
            position: relative;
            top: ${halfBreakDamage ? -32 : -27}px;
            left: 11px;
          `}
        />
        {halfBreakDamage ? (
          <PadAssetImage
            assetName={`1.5xlatentbase`}
            height={12}
            className={css`
              position: relative;
              top: -33px;
              left: 13px;
            `}
          />
        ) : null}
      </div>
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
  const sixSlotLatent = latents.filter((a) => Math.floor(a / 100) === 6)[0];
  const sixSlotLatentName = LATENTS_ID_TO_NAME[sixSlotLatent];

  const hasSixSlot = true;

  const remainderLatentNames = latents.filter((a) => Math.floor(a / 100) !== 6).map((a) => LATENTS_ID_TO_NAME[a]);

  return latents.length !== 0 ? (
    <LatentSelected
      onClick={() => {
        setCardSlotSelected(cardId);
        setLatentModalIsOpen(true);
      }}
    >
      <div>
        <SixSlotLatent shouldDisplay={hasSixSlot} latentName={"vdp"} halfBreakDamage={false} />
        <RemainderLatents hasSixSlot={hasSixSlot}>
          {/* <PadAssetImage assetName="drk" height={17} /> */}
          <PadAssetImage assetName="sdr" height={17} />
          <PadAssetImage assetName="sdr" height={17} />
        </RemainderLatents>
      </div>
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
