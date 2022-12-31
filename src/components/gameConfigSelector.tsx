import styled from "@emotion/styled";
import { useContext } from "react";
import { iStr } from "../i18n/i18n";

import { AppStateContext, linkLeaders, TeamStateContext, unlinkLeaders } from "../model/teamStateManager";
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
  padding: 0.25rem 1rem;
  cursor: pointer;
`;

export const GameConfigSelector = () => {
  const { language, gameConfig, setGameConfig, updateUrl } = useContext(AppStateContext);
  const { teamState, setTeamState } = useContext(TeamStateContext);

  return (
    <FlexRowC gap="0.25rem">
      <span>{iStr("gameMode", language)}:</span>
      <FlexRowC>
        <FancyButton
          backgroundColorFocused="red"
          backgroundColorUnfocused="pink"
          focused={gameConfig.mode === "1p"}
          onClick={async () => {
            const newGameConfig = { ...gameConfig, mode: "1p" };
            setGameConfig(newGameConfig);
            if (gameConfig.mode === "2p") {
              unlinkLeaders(teamState, setTeamState);
            }
            updateUrl({ gc: newGameConfig });
          }}
        >
          1P
        </FancyButton>
        <FancyButton
          backgroundColorFocused="blue"
          backgroundColorUnfocused="lightblue"
          focused={gameConfig.mode === "2p"}
          onClick={async () => {
            const newGameConfig = { ...gameConfig, mode: "2p" };
            setGameConfig(newGameConfig);
            linkLeaders(teamState, setTeamState);
            updateUrl({ gc: newGameConfig });
          }}
        >
          2P
        </FancyButton>
        <FancyButton
          backgroundColorFocused="green"
          backgroundColorUnfocused="lightgreen"
          focused={gameConfig.mode === "3p"}
          onClick={async () => {
            const newGameConfig = { ...gameConfig, mode: "3p" };
            setGameConfig(newGameConfig);
            if (gameConfig.mode === "2p") {
              unlinkLeaders(teamState, setTeamState);
            }
            updateUrl({ gc: newGameConfig });
          }}
        >
          3P
        </FancyButton>
      </FlexRowC>
    </FlexRowC>
  );
};
