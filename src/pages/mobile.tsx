import "react-toastify/dist/ReactToastify.css";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

import { DefaultLevelSelector } from "../components/defaultLevelSelector";
import { ExportControls } from "../components/export";
import { GameConfigSelector } from "../components/gameConfigSelector";
import { LanguageSelector } from "../components/languageSelector";
import { BadgeSelectorModal } from "../components/modal/badgeSelectorModal";
import { CardSelectorModal } from "../components/modal/cardSelectorModal";
import { LatentSelectorModal } from "../components/modal/latentSelectorModal";
import { TeamBuilderContentMobile } from "../components/teamBuilderContentMobile";
import { iStr } from "../i18n/i18n";
import { AppStateContext } from "../model/teamStateManager";
import { FlexColCResponsive, FlexRowC, H1, Page } from "../stylePrimitives";

const maxPageWidth = "100vw";

export const DraggableTypes = {
  card: "card",
  latent: "latent",
  slot: "slot"
};

export const MobilePageContainer = React.forwardRef((props, ref) => {
  const { language, modalIsOpen, latentModalIsOpen, badgeModalIsOpen } = useContext(AppStateContext);
  return (
    <Page maxWidth={maxPageWidth}>
      <FlexColCResponsive gap="1rem">
        <H1>{iStr("applicationTitle", language, "PAD Team Builder")} M</H1>
        <FlexRowC>
          <LanguageSelector />
          <GameConfigSelector />
        </FlexRowC>
        <FlexRowC gap="2rem">
          <DefaultLevelSelector />
          <FlexRowC gap="0.25rem">
            <ExportControls ref={ref} />
          </FlexRowC>
        </FlexRowC>
      </FlexColCResponsive>
      <CardSelectorModal isOpen={modalIsOpen} />
      <LatentSelectorModal isOpen={latentModalIsOpen} />
      <BadgeSelectorModal isOpen={badgeModalIsOpen} />
      <TeamBuilderContentMobile ref={ref} />
    </Page>
  );
});
