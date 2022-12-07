import styled from "@emotion/styled";
import { FlexRow, FlexRowC } from "../stylePrimitives";

export interface GameConfig {
  mode: string;
}

type FancyButtonProps = {
  backgroundColorFocused: string;
  backgroundColorUnfocused: string;
  focused: boolean;
};

const FancyButton = styled.button<FancyButtonProps>`
  background-color: ${(props) =>
    props.focused
      ? props.backgroundColorFocused
      : props.backgroundColorUnfocused};
  color: ${(props) => (props.focused ? "#fff" : "#000")};
  border: ${(props) => (props.focused ? "2px solid #555" : "0")};
  padding: 0.25rem 1rem;
`;

export const GameConfigSelector = ({
  gameConfig,
  setGameConfig,
}: {
  gameConfig: GameConfig;
  setGameConfig: React.Dispatch<React.SetStateAction<GameConfig>>;
}) => {
  return (
    <FlexRowC gap="0.25rem">
      <span>Game Mode:</span>
      <FlexRowC>
        <FancyButton
          backgroundColorFocused="red"
          backgroundColorUnfocused="pink"
          focused={gameConfig.mode == "1p"}
          onClick={() => {
            setGameConfig({ mode: "1p" });
          }}
        >
          1P
        </FancyButton>
        <FancyButton
          backgroundColorFocused="blue"
          backgroundColorUnfocused="lightblue"
          focused={gameConfig.mode == "2p"}
          onClick={() => {
            setGameConfig({ mode: "2p" });
          }}
        >
          2P
        </FancyButton>
        <FancyButton
          backgroundColorFocused="green"
          backgroundColorUnfocused="lightgreen"
          focused={gameConfig.mode == "3p"}
          onClick={() => {
            setGameConfig({ mode: "3p" });
          }}
        >
          3P
        </FancyButton>
      </FlexRowC>
    </FlexRowC>
  );
};
