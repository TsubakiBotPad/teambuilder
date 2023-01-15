import { css } from "@emotion/css";
import { useContext, useState } from "react";
import Modal from "react-modal";

import { breakpoint } from "../../breakpoints";
import { PadAssetImage } from "../../model/padAssets";
import { AppStateContext, setPlayerBadge, TeamStateContext } from "../../model/teamStateManager";
import { BADGE_NAMES } from "../../model/types/badges";
import { BoundingBox, FlexColC, FlexRow, FlexRowC, H2 } from "../../stylePrimitives";
import { ConfirmButton, RemoveButton } from "../generic/confirmButton";
import { ModalCloseButton } from "./common";
import { IoIosRemoveCircle, IoIosCheckmarkCircle } from "react-icons/io";
import { iStr } from "../../i18n/i18n";
import { BsDot } from "react-icons/bs";

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
  z-index: 100;
`;

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
      className={modalClassName}
      overlayClassName={overlayClassName}
      ariaHideApp={false}
    >
      <BoundingBox minWidth="50vw" maxWidth="50vw" minWidthM="75vw" maxWidthM="90vw">
        <ModalCloseButton hoverClose={hoverClose} setHoverClose={setHoverClose} setModalOpen={setBadgeModalIsOpen} />
        <div
          className={css`
            background-color: #fefefe;
            padding: 1rem;
          `}
        >
          <H2>
            <FlexRowC>
              {playerSelected}
              <BsDot />
              {iStr("badge", language)}
            </FlexRowC>
          </H2>
          <FlexColC>
            <FlexRow wrap="wrap" gap="0.25rem">
              {BADGE_NAMES.map((name, i) => {
                return (
                  <div
                    className={css`
                      border: 3px solid ${selectedBadge === name ? "black" : "transparent"};
                      background-color: ${selectedBadge === name ? "lightgreen" : "transparent"};
                      display: flex;
                      align-items: center;
                      padding: 2px;
                    `}
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
            <FlexRowC gap="1rem">
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
      </BoundingBox>
    </Modal>
  );
};
