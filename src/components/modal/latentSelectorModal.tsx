import { css } from "@emotion/css";
import { useState } from "react";
import Modal from "react-modal";

import { breakpoint } from "../../breakpoints";
import { PadAssetImage } from "../../model/padAssets";
import { setCardLatents, TeamState } from "../../model/teamStateManager";
import { LATENTS_ID_TO_NAME, LATENTS_NAME_TO_ID, LATENT_NAMES } from "../../model/types/latents";
import { BoundingBox, FlexColC, FlexRowC, H2 } from "../../stylePrimitives";
import { GameConfig } from "../gameConfigSelector";
import { ConfirmButton } from "../generic/confirmButton";
import { TeamStats } from "../teamStats/teamStats";

const modalClassName = css`
  border: 0;
  position: absolute;
  left: 25vw;
  top: 10vh;

  @media ${breakpoint.xs} {
    left: 5vw;
  }

  &:focus-visible {
    outline: 0;
  }
`;

const overlayClassName = css`
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  inset: 0;
`;

const MAX_LATENTS = 8;

interface SelectedLatent {
  id: string;
}

export const LatentSelectorModal = ({
  isOpen,
  setModalIsOpen,
  cardSlotSelected,
  teamState,
  gameConfig,
  setTeamState,
  setTeamStats
}: {
  isOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cardSlotSelected: string;
  teamState: TeamState;
  gameConfig: GameConfig;
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>;
  setTeamStats: React.Dispatch<React.SetStateAction<TeamStats>>;
}) => {
  const [selectedLatents, setSelectedLatents] = useState<number[]>([]);

  const currentSize = selectedLatents.reduce((a, b) => {
    const s = Math.floor(b / 100);
    return a + s;
  }, 0);

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Example Modal"
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => {
        setModalIsOpen(false);
      }}
      className={modalClassName}
      overlayClassName={overlayClassName}
      ariaHideApp={false}
    >
      <BoundingBox minWidth="50vw" maxWidth="50vw" minWidthM="75vw" maxWidthM="90vw">
        <div
          className={css`
            background-color: #fefefe;
            padding: 1rem;
          `}
        >
          <H2>{cardSlotSelected}-Latents</H2>
          <FlexColC>
            <FlexRowC wrap={"wrap"}>
              {LATENT_NAMES.map((n: string) => {
                return (
                  <PadAssetImage
                    assetName={n}
                    onClick={() => {
                      handleAddLatent(n, selectedLatents, setSelectedLatents);
                    }}
                  />
                );
              })}
            </FlexRowC>

            <br />
            <FlexRowC>
              {selectedLatents.map((i: number, idx: number) => {
                const name = LATENTS_ID_TO_NAME[i];
                const valid = true; // TODO: check against monster
                return (
                  <PadAssetImage
                    assetName={name}
                    onClick={() => {
                      selectedLatents.splice(idx, 1);
                      setSelectedLatents([...selectedLatents]);
                    }}
                    className={css`
                      opacity: ${valid ? "1" : "0.5"};
                    `}
                  />
                );
              })}
              {Array.from(Array(MAX_LATENTS - currentSize).keys()).map((i) => {
                return <PadAssetImage assetName="emptyLatent" />;
              })}
            </FlexRowC>

            <FlexColC>
              <ConfirmButton
                onClick={() => {
                  setCardLatents(cardSlotSelected, selectedLatents, teamState, gameConfig, setTeamState, setTeamStats);
                  setModalIsOpen(false);
                }}
              >
                Use Latents
              </ConfirmButton>
            </FlexColC>
          </FlexColC>
        </div>
      </BoundingBox>
    </Modal>
  );
};

function handleAddLatent(
  name: string,
  selectedLatents: number[],
  setSelectedLatents: React.Dispatch<React.SetStateAction<number[]>>
) {
  const id = LATENTS_NAME_TO_ID[name];
  const size = Math.floor(id / 100);

  const currentSize = selectedLatents.reduce((a, b) => {
    const s = Math.floor(b / 100);
    return a + s;
  }, 0);

  if (currentSize + size <= MAX_LATENTS) {
    setSelectedLatents([...selectedLatents, id]);
  } else {
    // TODO: animate error
  }
}
