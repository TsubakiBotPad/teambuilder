import styled from "@emotion/styled";
import { useContext } from "react";
import { iStr } from "../i18n/i18n";
import { AppStateContext } from "../model/teamStateManager";

import { FlexRowC } from "../stylePrimitives";

export interface GameConfig {
  mode: string;
  defaultCardLevel: number;
}

type FancyButtonProps = {
  backgroundColorFocused: string;
  backgroundColorUnfocused: string;
  focused: boolean;
};

const FancyButton = styled.button<FancyButtonProps>`
  background-color: ${(props) => (props.focused ? props.backgroundColorFocused : props.backgroundColorUnfocused)};
  color: ${(props) => (props.focused ? "#fff" : "#000")};
  border: ${(props) => (props.focused ? "2px solid #555" : "0")};
  padding: 0.25rem 0.5rem;
  cursor: pointer;
`;

export const DefaultLevelSelector = () => {
  const { language, gameConfig, setGameConfig } = useContext(AppStateContext);
  return (
    <FlexRowC className="gap-1">
      <span>{iStr("defaultLevel", language)}:</span>
      <FlexRowC>
        <FancyButton
          backgroundColorFocused="#666"
          backgroundColorUnfocused="#eee"
          focused={gameConfig.defaultCardLevel === 99}
          onClick={() => {
            setGameConfig({ ...gameConfig, defaultCardLevel: 99 });
          }}
        >
          99
        </FancyButton>
        <FancyButton
          backgroundColorFocused="blue"
          backgroundColorUnfocused="lightblue"
          focused={gameConfig.defaultCardLevel === 110}
          onClick={() => {
            setGameConfig({ ...gameConfig, defaultCardLevel: 110 });
          }}
        >
          110
        </FancyButton>
        <FancyButton
          backgroundColorFocused="green"
          backgroundColorUnfocused="lightgreen"
          focused={gameConfig.defaultCardLevel === 120}
          onClick={() => {
            setGameConfig({ ...gameConfig, defaultCardLevel: 120 });
          }}
        >
          120
        </FancyButton>
      </FlexRowC>
    </FlexRowC>
  );
};
