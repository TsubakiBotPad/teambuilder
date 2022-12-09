import styled from "@emotion/styled";
import React, { useState } from "react";
import { BASE_ICON_URL } from "../model/images";
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
const CardSelected = styled.img<CardSelectedType>`
  background: ${(props) =>
    `url("${BASE_ICON_URL}${leftPad(props.monsterId, 5)}.png")`};
  background-size: cover;
  width: 5rem;
  height: 5rem;
`;

export const Card = ({
  cardId,
  setModalIsOpen,
  setCardSlotSelected,
  monsterId,
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

const LatentSelected = styled.div`
  background-color: #ff99ff;
  width: 5rem;
  height: 2rem;
`;

export const Latents = ({
  cardId,
  setLatentModalIsOpen,
  setCardSlotSelected,
  latents,
}: {
  cardId: string;
  setLatentModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCardSlotSelected: React.Dispatch<React.SetStateAction<string>>;
  latents: number[];
}) => {
  return latents.length !== 0 ? (
    <LatentSelected />
  ) : (
    <LatentEmpty
      onClick={() => {
        setCardSlotSelected(cardId);
        setLatentModalIsOpen(true);
      }}
    />
  );
};
