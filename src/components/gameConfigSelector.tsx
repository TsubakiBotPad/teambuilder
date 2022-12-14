import styled from "@emotion/styled";
import { TeamState } from "../model/teamStateManager";
import { FlexRow, FlexRowC } from "../stylePrimitives";
import { computeTeamStat, TeamStats } from "./teamStats/teamStats";

export interface GameConfig {
  mode: string;
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
`;

export const GameConfigSelector = ({
  gameConfig,
  setGameConfig,
  teamState,
  setTeamStats
}: {
  gameConfig: GameConfig;
  setGameConfig: React.Dispatch<React.SetStateAction<GameConfig>>;
  teamState: TeamState;
  setTeamStats: React.Dispatch<React.SetStateAction<TeamStats>>;
}) => {
  return (
    <FlexRowC gap="0.25rem">
      <span>Game Mode:</span>
      <FlexRowC>
        <FancyButton
          backgroundColorFocused="red"
          backgroundColorUnfocused="pink"
          focused={gameConfig.mode == "1p"}
          onClick={async () => {
            const newGameConfig = { mode: "1p" };
            setGameConfig(newGameConfig);
            setTeamStats({
              p1: await computeTeamStat(teamState, newGameConfig, "p1")
            });
          }}
        >
          1P
        </FancyButton>
        <FancyButton
          backgroundColorFocused="blue"
          backgroundColorUnfocused="lightblue"
          focused={gameConfig.mode == "2p"}
          onClick={async () => {
            const newGameConfig = { mode: "2p" };
            setGameConfig(newGameConfig);
            setTeamStats({
              p1: await computeTeamStat(teamState, newGameConfig, "p1"),
              p2: await computeTeamStat(teamState, newGameConfig, "p2")
            });
          }}
        >
          2P
        </FancyButton>
        <FancyButton
          backgroundColorFocused="green"
          backgroundColorUnfocused="lightgreen"
          focused={gameConfig.mode == "3p"}
          onClick={async () => {
            const newGameConfig = { mode: "3p" };
            setGameConfig(newGameConfig);
            setTeamStats({
              p1: await computeTeamStat(teamState, newGameConfig, "p1"),
              p2: await computeTeamStat(teamState, newGameConfig, "p2"),
              p3: await computeTeamStat(teamState, newGameConfig, "p3")
            });
          }}
        >
          3P
        </FancyButton>
      </FlexRowC>
    </FlexRowC>
  );
};
