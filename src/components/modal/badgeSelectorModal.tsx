import { useContext, useState } from "react";
import Modal from "react-modal";

import { PadAssetImage } from "../../model/padAssets";
import { AppStateContext, setPlayerBadge, TeamStateContext } from "../../model/teamStateManager";
import { BADGE_NAMES } from "../../model/types/badges";
import { FlexColC, FlexRow, FlexRowC, H2 } from "../../stylePrimitives";
import { ConfirmButton, RemoveButton } from "../generic/confirmButton";
import { ModalCloseButton } from "./common";
import { IoIosRemoveCircle, IoIosCheckmarkCircle } from "react-icons/io";
import { iStr } from "../../i18n/i18n";
import { BsDot } from "react-icons/bs";
import clsx from "../../clsx";

export const BadgeSelectorModal = ({ isOpen }: { isOpen: boolean }) => {
  const [selectedBadge, setSelectedBadge] = useState<string>("");
  const { language, setBadgeModalIsOpen, playerSelected } = useContext(AppStateContext);
  const { teamState, setTeamState } = useContext(TeamStateContext);
  const [hoverClose, setHoverClose] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Badge Modal"
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => {
        setBadgeModalIsOpen(false);
      }}
      className="border-0 absolute left-[5vw] sm:left-[25vw] top-[10vh] focus-visible:outline-none"
      overlayClassName="fixed inset-0 bg-black/40"
      ariaHideApp={false}
    >
      <div className="min-w-[75vw] max-w-[90vw] sm:min-w-[50vw] sm:max-w-[50vw]">
        <ModalCloseButton hoverClose={hoverClose} setHoverClose={setHoverClose} setModalOpen={setBadgeModalIsOpen} />
        <div className="bg-slate-50 p-4 rounded shadow-sm shadow-slate-50">
          <H2>
            <FlexRowC>
              {playerSelected}
              <BsDot />
              {iStr("badge", language)}
            </FlexRowC>
          </H2>
          <FlexColC>
            <FlexRow className="flex-wrap gap-1">
              {BADGE_NAMES.map((name, i) => {
                return (
                  <div
                    className={clsx(
                      selectedBadge === name ? " border-black bg-green-400" : "border-transparent",
                      "border-[3px] border-solid flex items-center p-[2px] rounded"
                    )}
                    key={name + i}
                  >
                    <PadAssetImage
                      assetName={`${name}badge`}
                      onClick={() => {
                        setSelectedBadge(name);
                      }}
                      height={30}
                    />
                  </div>
                );
              })}
            </FlexRow>
            <FlexRowC className="gap-4">
              <ConfirmButton
                onClick={() => {
                  setPlayerBadge(playerSelected as any, selectedBadge, teamState, setTeamState);
                  setBadgeModalIsOpen(false);
                }}
              >
                <IoIosCheckmarkCircle /> {iStr("confirm", language)}
              </ConfirmButton>
              <RemoveButton
                onClick={() => {
                  setSelectedBadge("");
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
