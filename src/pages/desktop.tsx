import "react-toastify/dist/ReactToastify.css";

import React, { useContext } from "react";

import { DefaultLevelSelector } from "../components/defaultLevelSelector";
import { ExportControls } from "../components/export";
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
            <ExportControls ref={ref} />
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
