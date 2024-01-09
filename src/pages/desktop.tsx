import "react-toastify/dist/ReactToastify.css";

import { css } from "@emotion/css";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { exportComponentAsPNG } from "react-component-export-image";
import { BiLink } from "react-icons/bi";
import { BsImage } from "react-icons/bs";
import { toast } from "react-toastify";

import { DefaultLevelSelector } from "../components/defaultLevelSelector";
import { GameConfigSelector } from "../components/gameConfigSelector";
import { LanguageSelector } from "../components/languageSelector";
import { BadgeSelectorModal } from "../components/modal/badgeSelectorModal";
import { CardSelectorModal } from "../components/modal/cardSelectorModal";
import { LatentSelectorModal } from "../components/modal/latentSelectorModal";
import { TeamBuilderContent } from "../components/teamBuilderContent";
import { iStr } from "../i18n/i18n";
import { AppStateContext } from "../model/teamStateManager";
import { FlexColCResponsive, FlexRowC, H1, Page } from "../stylePrimitives";

const maxPageWidth = "1440px";

export const DraggableTypes = {
  card: "card",
  latent: "latent",
  slot: "slot"
};

export const DesktopPageContainer = React.forwardRef((props, ref) => {
  const { language, modalIsOpen, latentModalIsOpen, badgeModalIsOpen } = useContext(AppStateContext);
  return (
    <Page maxWidth={maxPageWidth}>
      <FlexColCResponsive gap="1rem">
        <FlexRowC gap="1rem">
          <H1>{iStr("applicationTitle", language, "PAD Team Builder")}</H1>
          <LanguageSelector />
        </FlexRowC>
        <FlexRowC gap="2rem">
          <GameConfigSelector />
          <DefaultLevelSelector />
          <FlexRowC gap="0.25rem">
            {iStr("export", language)}:
            <button
              onClick={() => exportComponentAsPNG(ref as any)}
              className={css`
                box-shadow: 1px 1px #ccc;
                border: 1px solid black;
                padding: 0 0.1rem;
                cursor: pointer;
              `}
            >
              <BsImage />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast(iStr("linkCopied", language));
              }}
              className={css`
                box-shadow: 1px 1px #ccc;
                border: 1px solid black;
                padding: 0 0.1rem;
                cursor: pointer;
              `}
            >
              <BiLink />
            </button>
          </FlexRowC>
        </FlexRowC>
      </FlexColCResponsive>
      <CardSelectorModal isOpen={modalIsOpen} />
      <LatentSelectorModal isOpen={latentModalIsOpen} />
      <BadgeSelectorModal isOpen={badgeModalIsOpen} />
      <TeamBuilderContent ref={ref} />
    </Page>
  );
});