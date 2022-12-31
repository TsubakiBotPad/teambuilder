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
  // border: ${(props) => (props.focused ? "1px solid #555" : "0")};
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
    <FlexRowC gap="0.25rem">
      <FancyButton
        focused={language === "en"}
        onClick={() => {
          setLanguage("en");
        }}
      >
        <US title="United States" className={flagClassname(language === "en")} />
      </FancyButton>
      <FancyButton
        focused={language === "ja"}
        onClick={() => {
          setLanguage("ja");
        }}
      >
        <JP title="Japan" className={flagClassname(language === "ja")} />
      </FancyButton>
    </FlexRowC>
  );
};
