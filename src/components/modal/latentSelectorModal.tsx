import { css } from "@emotion/css";
import { useState } from "react";
import Modal from "react-modal";

import { breakpoint } from "../../breakpoints";
import { PadAssetImage } from "../../model/padAssets";
import { setCardLatents, TeamState } from "../../model/teamStateManager";
import { LATENTS_BY_SIZE, LATENTS_ID_TO_NAME, LATENTS_NAME_TO_ID } from "../../model/types/latents";
import { BoundingBox, FlexCol, FlexColC, FlexRow, H2, H3 } from "../../stylePrimitives";
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

export const LatentSelectorModal = ({
  isOpen,
  setModalIsOpen,
  cardSlotSelected,
  gameConfig,
  teamState,
  setTeamState,
  teamStats,
  setTeamStats
}: {
  isOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cardSlotSelected: string;
  gameConfig: GameConfig;
  teamState: TeamState;
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>;
  teamStats: TeamStats;
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
            <FlexRow wrap={"wrap"}>
              <FlexCol gap="1rem">
                {Object.entries(LATENTS_BY_SIZE).map(([n, names]) => {
                  return (
                    <FlexCol>
                      <H3>{n}-slot</H3>
                      <FlexRow wrap="wrap">
                        {names.map((n) => {
                          return (
                            <PadAssetImage
                              assetName={n}
                              onClick={() => {
                                handleAddLatent(n, selectedLatents, setSelectedLatents);
                              }}
                            />
                          );
                        })}
                      </FlexRow>
                    </FlexCol>
                  );
                })}
              </FlexCol>
            </FlexRow>

            <br />
            <FlexRow gap={"14px"}>
              {selectedLatents.length !== 0 ? (
                <FlexRow gap={"14px"}>
                  {selectedLatents.map((i: number, idx: number) => {
                    const name = LATENTS_ID_TO_NAME[i];
                    const valid = true; // TODO: check against monster

                    const isSixSlot = Math.floor(i / 100) === 6;
                    if (isSixSlot) {
                      return (
                        <div>
                          <PadAssetImage
                            assetName={"6slotLatentBg"}
                            onClick={() => {
                              selectedLatents.splice(idx, 1);
                              setSelectedLatents([...selectedLatents]);
                            }}
                            className={css`
                              opacity: ${valid ? "1" : "0.5"};
                            `}
                          />
                          <div
                            className={css`
                              position: relative;
                              top: -50%;
                              left: 45%;
                              width: 0;
                            `}
                          >
                            <PadAssetImage assetName={`${name}latentbase`} />
                          </div>
                        </div>
                      );
                    }

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
                </FlexRow>
              ) : null}
              {MAX_LATENTS - currentSize !== 0 ? (
                <FlexRow gap={"14px"}>
                  {Array.from(Array(MAX_LATENTS - currentSize).keys()).map((i) => {
                    return <PadAssetImage assetName="emptyLatent" height={31} />;
                  })}
                </FlexRow>
              ) : null}
            </FlexRow>
            <br />
            <FlexColC>
              <ConfirmButton
                onClick={() => {
                  setCardLatents(
                    cardSlotSelected,
                    selectedLatents,
                    gameConfig,
                    teamState,
                    setTeamState,
                    teamStats,
                    setTeamStats
                  );
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
