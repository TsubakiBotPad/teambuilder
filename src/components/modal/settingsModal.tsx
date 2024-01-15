import { css } from "@emotion/css";
import { useContext, useState } from "react";
import Modal from "react-modal";

import { breakpoint } from "../../breakpoints";
import { iStr } from "../../i18n/i18n";
import { AppStateContext } from "../../model/teamStateManager";
import { BoundingBox, FlexCol, FlexColC, H2 } from "../../stylePrimitives";
import { DefaultLevelSelector } from "../defaultLevelSelector";
import { GameConfigSelector } from "../gameConfigSelector";
import { LanguageSelector } from "../languageSelector";
import { ModalCloseButton } from "./common";

const modalClassName = css`
  border: 0;
  position: absolute;
  left: 25vw;
  top: 10vh;

  @media ${breakpoint.xs} {
    left: 5vw;
    top: 0;
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

export const SettingsModal = ({ isOpen }: { isOpen: boolean }) => {
  const { setSettingsModalIsOpen, language } = useContext(AppStateContext);

  const [hoverClose, setHoverClose] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Example Modal"
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => {
        setSettingsModalIsOpen(false);
      }}
      className={modalClassName}
      overlayClassName={overlayClassName}
      ariaHideApp={false}
    >
      <BoundingBox minWidth="50vw" maxWidth="50vw" minWidthM="90vw" maxWidthM="90vw">
        <ModalCloseButton hoverClose={hoverClose} setHoverClose={setHoverClose} setModalOpen={setSettingsModalIsOpen} />
        <div
          className={css`
            background-color: #fefefe;
            padding: 1rem;
          `}
        >
          <FlexCol gap="0.5rem">
            <H2>{iStr("settings", language)}</H2>
            <FlexColC gap="0.5rem">
              <LanguageSelector />
              <GameConfigSelector />
              <DefaultLevelSelector />
            </FlexColC>
          </FlexCol>
        </div>
      </BoundingBox>
    </Modal>
  );
};
