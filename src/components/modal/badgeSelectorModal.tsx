import { css } from "@emotion/css";
import { useContext, useState } from "react";
import Modal from "react-modal";

import { breakpoint } from "../../breakpoints";
import { PadAssetImage } from "../../model/padAssets";
import { AppStateContext, setPlayerBadge, TeamStateContext } from "../../model/teamStateManager";
import { BADGE_NAMES } from "../../model/types/badges";
import { BoundingBox, FlexColC, FlexRow, H2 } from "../../stylePrimitives";
import { ConfirmButton } from "../generic/confirmButton";
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

export const BadgeSelectorModal = ({ isOpen }: { isOpen: boolean }) => {
  const [selectedBadge, setSelectedBadge] = useState<string>("");
  const { setBadgeModalIsOpen, playerSelected } = useContext(AppStateContext);
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
          <H2>{playerSelected}-Badge</H2>
          <FlexColC>
            <FlexRow wrap="wrap" gap="0.25rem">
              {BADGE_NAMES.map((name) => {
                return (
                  <div
                    className={css`
                      border: 3px solid ${selectedBadge === name ? "black" : "transparent"};
                      background-color: ${selectedBadge === name ? "lightgreen" : "transparent"};
                      display: flex;
                      align-items: center;
                      padding: 2px;
                    `}
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

            <br />
            <FlexColC>
              <ConfirmButton
                onClick={() => {
                  setPlayerBadge(playerSelected as any, selectedBadge, teamState, setTeamState);
                  setBadgeModalIsOpen(false);
                }}
              >
                Use Badge
              </ConfirmButton>
            </FlexColC>
          </FlexColC>
        </div>
      </BoundingBox>
    </Modal>
  );
};
