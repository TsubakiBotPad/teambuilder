import { css } from "@emotion/css";
import { useContext, useMemo, useState } from "react";
import { IoIosRemoveCircle } from "react-icons/io";
import Modal from "react-modal";

import { breakpoint } from "../../breakpoints";
import { MonsterResponse } from "../../client";
import { iStr } from "../../i18n/i18n";
import { monsterCacheClient } from "../../model/monsterCacheClient";
import { PadAssetImage } from "../../model/padAssets";
import { AppStateContext, setCardLatents, TeamSlotState, TeamStateContext } from "../../model/teamStateManager";
import { LATENTS_BY_SIZE, LATENTS_ID_TO_NAME, LATENTS_NAME_TO_ID } from "../../model/types/latents";
import { BoundingBox, FlexCol, FlexColC, FlexRow, FlexRowC, H2, H3 } from "../../stylePrimitives";
import { ConfirmButton, RemoveButton } from "../generic/confirmButton";
import { ModalCloseButton } from "./common";

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

const DEFAULT_MAX_LATENTS = 6;

export const LatentSelectorModal = ({ isOpen }: { isOpen: boolean }) => {
  const [selectedLatents, setSelectedLatents] = useState<number[]>([]);
  const { language, setLatentModalIsOpen, cardSlotSelected } = useContext(AppStateContext);
  const { teamState, setTeamState } = useContext(TeamStateContext);
  const [hoverClose, setHoverClose] = useState(false);
  const [currentMonster, setCurrentMonster] = useState<MonsterResponse | undefined>(undefined);

  useMemo(() => {
    const f = async () => {
      if (!cardSlotSelected || !cardSlotSelected.teamId || !cardSlotSelected.slotId) {
        return;
      }

      const monster = teamState[cardSlotSelected.teamId!][cardSlotSelected.slotId!] as TeamSlotState;
      const m = await monsterCacheClient.get(monster.base.id);

      setCurrentMonster(m);
      setSelectedLatents(monster.latents);
    };
    f();
  }, [teamState, cardSlotSelected]);

  const maxLatents = currentMonster?.latent_slots ?? DEFAULT_MAX_LATENTS;

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
        setLatentModalIsOpen(false);
      }}
      className={modalClassName}
      overlayClassName={overlayClassName}
      ariaHideApp={false}
    >
      <BoundingBox minWidth="50vw" maxWidth="50vw" minWidthM="75vw" maxWidthM="90vw">
        <ModalCloseButton hoverClose={hoverClose} setHoverClose={setHoverClose} setModalOpen={setLatentModalIsOpen} />
        <div
          className={css`
            background-color: #fefefe;
            padding: 1rem;
          `}
        >
          <H2>
            {cardSlotSelected.teamId}-{iStr(cardSlotSelected.slotId, language)}-{iStr("latents", language)}
          </H2>
          <FlexColC gap="2rem">
            <FlexRow wrap={"wrap"}>
              <FlexCol gap="1rem">
                {Object.entries(LATENTS_BY_SIZE).map(([n, names], j) => {
                  return (
                    <FlexCol key={n + j}>
                      <H3>
                        {n}-{iStr("latentSlot", language)}
                      </H3>
                      <FlexRow wrap="wrap">
                        {names.map((n, i) => {
                          return (
                            <PadAssetImage
                              assetName={n}
                              onClick={() => {
                                handleAddLatent(n, maxLatents, selectedLatents, setSelectedLatents);
                              }}
                              key={n + j + i}
                            />
                          );
                        })}
                      </FlexRow>
                    </FlexCol>
                  );
                })}
              </FlexCol>
            </FlexRow>
            <FlexRow gap={"14px"}>
              {selectedLatents.length !== 0 ? (
                <FlexRow gap={"14px"}>
                  {selectedLatents.map((i: number, idx: number) => {
                    const name = LATENTS_ID_TO_NAME[i];
                    const valid = true; // TODO: check against monster

                    const isSixSlot = Math.floor(i / 100) === 6;
                    if (isSixSlot) {
                      return (
                        <div key={"selectedLatent" + idx} className={css``}>
                          <PadAssetImage
                            assetName={"6slotLatentBg"}
                            onClick={() => {
                              selectedLatents.splice(idx, 1);
                              setSelectedLatents([...selectedLatents]);
                            }}
                            className={css`
                              opacity: ${valid ? "1" : "0.5"};
                              position: relative;
                            `}
                          >
                            <div
                              className={css`
                                position: absolute;
                                top: 0;
                                left: 45%;
                                height: 0;
                              `}
                            >
                              <PadAssetImage assetName={`${name}latentbase`} />
                            </div>
                          </PadAssetImage>
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
                        key={"selectedLatent" + idx}
                      />
                    );
                  })}
                </FlexRow>
              ) : null}
              {maxLatents - currentSize !== 0 ? (
                <FlexRow gap={"14px"}>
                  {Array.from(Array(maxLatents - currentSize > 0 ? maxLatents - currentSize : 0).keys()).map((i) => {
                    return <PadAssetImage assetName="emptyLatent" height={31} key={"remainderLatents" + i} />;
                  })}
                </FlexRow>
              ) : null}
            </FlexRow>
            <FlexRowC gap="1rem">
              <ConfirmButton
                onClick={() => {
                  setCardLatents(cardSlotSelected, selectedLatents, teamState, setTeamState);
                  setLatentModalIsOpen(false);
                }}
              >
                <IoIosRemoveCircle /> {iStr("confirm", language)}
              </ConfirmButton>
              <RemoveButton
                onClick={() => {
                  setSelectedLatents([]);
                }}
              >
                <IoIosRemoveCircle /> {iStr("clear", language)}
              </RemoveButton>
            </FlexRowC>
          </FlexColC>
        </div>
      </BoundingBox>
    </Modal>
  );
};

function handleAddLatent(
  name: string,
  maxLatents: number,
  selectedLatents: number[],
  setSelectedLatents: React.Dispatch<React.SetStateAction<number[]>>
) {
  const id = LATENTS_NAME_TO_ID[name];
  const size = Math.floor(id / 100);

  const currentSize = selectedLatents.reduce((a, b) => {
    const s = Math.floor(b / 100);
    return a + s;
  }, 0);

  if (currentSize + size <= maxLatents) {
    setSelectedLatents([...selectedLatents, id]);
  } else {
    // TODO: animate error
  }
}
