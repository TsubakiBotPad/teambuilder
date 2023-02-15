import clsx from "../clsx";
import { JP, US } from "country-flag-icons/react/3x2";
import { ReactNode, useContext } from "react";

import { AppStateContext } from "../model/teamStateManager";
import { FlexRowC } from "../stylePrimitives";

export interface GameConfig {
  mode: string;
  defaultCardLevel: number;
}

const FancyButton = ({
  children,
  focused,
  ...rest
}: {
  children: ReactNode;
  focused: boolean;
  [rest: string]: any;
}) => {
  return (
    <button
      {...rest}
      className={clsx(
        focused ? "opacity-1 border-slate-800 shadow-sm shadow-slate-400" : "opacity-50 border-slate-300",
        "cursor-pointer border border-solid rounded-sm"
      )}
    >
      {children}
    </button>
  );
};

export const LanguageSelector = () => {
  const { language, setLanguage } = useContext(AppStateContext);
  return (
    <FlexRowC className="gap-1">
      <FancyButton
        className="cursor-pointer"
        focused={language === "en"}
        onClick={() => {
          setLanguage("en");
        }}
      >
        <US title="English" className="w-7" />
      </FancyButton>
      <FancyButton
        focused={language === "ja"}
        onClick={() => {
          setLanguage("ja");
        }}
      >
        <JP title="日本語" className="w-7" />
      </FancyButton>
    </FlexRowC>
  );
};
