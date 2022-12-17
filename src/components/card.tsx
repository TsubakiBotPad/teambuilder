import styled from "@emotion/styled";
import React, { useContext } from "react";

import { BASE_ICON_URL } from "../model/images";
import { AppStateContext } from "../model/teamStateManager";
import { leftPad } from "./generic/leftPad";

type CardEmptyProps = {
  hide: boolean;
};

const CardEmpty = styled.div<CardEmptyProps>`
  background-color: ${(props) => (props.hide ? "transparent" : "#fefefe")};
  width: 5rem;
  height: 5rem;
  border: 2px dotted ${(props) => (props.hide ? "transparent" : "#aaa")};
  box-sizing: border-box;
`;

type CardSelectedType = {
  monsterId: number;
  hide: boolean;
};

const CardSelected = styled.div<CardSelectedType>`
  background: ${(props) => (props.hide ? "" : `url("${BASE_ICON_URL}${leftPad(props.monsterId, 5)}.png")`)};
  background-size: cover;
  width: 5rem;
  height: 5rem;
`;

export const Card = ({ cardId, monsterId, hide }: { cardId: string; monsterId: number; hide?: boolean }) => {
  const { setModalIsOpen, setCardSlotSelected } = useContext(AppStateContext);

  return monsterId !== 0 ? (
    <CardSelected
      monsterId={monsterId}
      onClick={
        !hide
          ? () => {
              setCardSlotSelected(cardId);
              setModalIsOpen(true);
            }
          : () => {}
      }
      hide={!!hide}
    />
  ) : (
    <CardEmpty
      onClick={
        !hide
          ? () => {
              setCardSlotSelected(cardId);
              setModalIsOpen(true);
            }
          : () => {}
      }
      hide={!!hide}
    />
  );
};
