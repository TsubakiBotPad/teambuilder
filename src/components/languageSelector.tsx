import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { JP, US } from "country-flag-icons/react/3x2";
import { useContext } from "react";

import { AppStateContext } from "../model/teamStateManager";
import { FlexRowC } from "../stylePrimitives";

export interface GameConfig {
  mode: string;
  defaultCardLevel: number;
}

type FancyButtonProps = {
  focused: boolean;
};

const FancyButton = styled.button<FancyButtonProps>`
  cursor: pointer;
`;

const flagClassname = (focused: boolean) => {
  return css`
    width: 1.75rem;
    border: ${focused ? "1px solid #555" : "1px solid #ccc"};
    opacity: ${focused ? 1 : 0.5};
  `;
};

export const LanguageSelector = () => {
  const { language, setLanguage } = useContext(AppStateContext);
  return (
    <FlexRowC gap="gap-1">
      <FancyButton
        focused={language === "en"}
        onClick={() => {
          setLanguage("en");
        }}
      >
        <US title="English" className={flagClassname(language === "en")} />
      </FancyButton>
      <FancyButton
        focused={language === "ja"}
        onClick={() => {
          setLanguage("ja");
        }}
      >
        <JP title="日本語" className={flagClassname(language === "ja")} />
      </FancyButton>
    </FlexRowC>
  );
};
