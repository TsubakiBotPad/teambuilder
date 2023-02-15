import { css } from "@emotion/css";
import { useContext, useMemo, useState } from "react";
import { IoIosRemoveCircle } from "react-icons/io";
import Modal from "react-modal";

import { MonsterResponse } from "../../client";
import { iStr } from "../../i18n/i18n";
import { monsterCacheClient } from "../../model/monsterCacheClient";
import { PadAssetImage } from "../../model/padAssets";
import { AppStateContext, setCardLatents, TeamSlotState, TeamStateContext } from "../../model/teamStateManager";
import { LATENTS_BY_SIZE, LATENTS_ID_TO_NAME, LATENTS_NAME_TO_ID } from "../../model/types/latents";
import { FlexCol, FlexColC, FlexRow, FlexRowC, H2, H3 } from "../../stylePrimitives";
import { ConfirmButton, RemoveButton } from "../generic/confirmButton";
import { ModalCloseButton } from "./common";
import { BsDot } from "react-icons/bs";
import clsx from "../../clsx";

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
      className="border-0 absolute left-[5vw] sm:left-[25vw] top-[10vh] focus-visible:outline-none"
      overlayClassName="fixed inset-0 bg-black/40"
      ariaHideApp={false}
    >
      <div className="min-w-[75vw] max-w-[90vw] sm:min-w-[50vw] sm:max-w-[50vw]">
        <ModalCloseButton hoverClose={hoverClose} setHoverClose={setHoverClose} setModalOpen={setLatentModalIsOpen} />
        <div className="bg-slate-50 p-4 rounded shadow-sm shadow-slate-50">
          <H2 className="mb-4">
            <FlexRowC>
              {cardSlotSelected.teamId}
              <BsDot />
              {iStr(cardSlotSelected.slotId, language)}
              <BsDot />
              {iStr("latents", language)}
            </FlexRowC>
          </H2>
          <FlexColC className="gap-8">
            <FlexRow className="flex-wrap">
              <FlexCol className="gap-4">
                {Object.entries(LATENTS_BY_SIZE).map(([n, names], j) => {
                  return (
                    <FlexCol key={n + j}>
                      <H3>
                        {n}-{iStr("slots", language)}
                      </H3>
                      <FlexRow className="flex-wrap">
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
            <FlexRow className="gap-3.5">
              {selectedLatents.length !== 0 ? (
                <FlexRow className="gap-3.5">
                  {selectedLatents.map((i: number, idx: number) => {
                    const name = LATENTS_ID_TO_NAME[i];
                    const valid = true; // TODO: check against monster

                    const isSixSlot = Math.floor(i / 100) === 6;
                    if (isSixSlot) {
                      return (
                        <div key={"selectedLatent" + idx}>
                          <PadAssetImage
                            assetName={"6slotLatentBg"}
                            onClick={() => {
                              selectedLatents.splice(idx, 1);
                              setSelectedLatents([...selectedLatents]);
                            }}
                            className={clsx("relative", valid ? "opacity-1" : "opacity-50")}
                          >
                            <div className="absolute top-0 left-[45%] h-0">
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
                <FlexRow className="gap-3.5">
                  {Array.from(Array(maxLatents - currentSize > 0 ? maxLatents - currentSize : 0).keys()).map((i) => {
                    return <PadAssetImage assetName="emptyLatent" height={31} key={"remainderLatents" + i} />;
                  })}
                </FlexRow>
              ) : null}
            </FlexRow>
            <FlexRowC className="gap-4">
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
      </div>
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
