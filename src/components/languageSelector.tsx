import styled from "@emotion/styled";
import clsx from "clsx";
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
  return clsx(
    "w-7 border border-solid rounded-sm",
    focused ? "opacity-1 border-slate-800 shadow-sm shadow-slate-400" : "opacity-50 border-slate-300"
  );
};

export const LanguageSelector = () => {
  const { language, setLanguage } = useContext(AppStateContext);
  return (
    <FlexRowC className="gap-1">
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
