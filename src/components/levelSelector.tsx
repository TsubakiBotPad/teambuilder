import { css } from "@emotion/css";
import styled from "@emotion/styled";

import { MonsterResponse } from "../client";
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
`;

export const LevelSelector = ({
  currentLevel,
  selectedMonster,
  setLevel
}: {
  currentLevel: number;
  selectedMonster: MonsterResponse | undefined;
  setLevel: (l: number) => void;
}) => {
  if (!selectedMonster) {
    return <></>;
  }

  return (
    <FlexRowC
      gap="0.25rem"
      className={css`
        font-size: 0.75rem;
        font-weight: 400;
      `}
    >
      <span>Lv: </span>
      <FlexRowC>
        <FancyButton
          backgroundColorFocused="#666"
          backgroundColorUnfocused="#eee"
          focused={currentLevel === 99}
          onClick={() => {
            setLevel(99);
          }}
        >
          99
        </FancyButton>
        {selectedMonster.limit_mult !== 0 ? (
          <>
            <FancyButton
              backgroundColorFocused="blue"
              backgroundColorUnfocused="lightblue"
              focused={currentLevel === 110}
              onClick={() => {
                setLevel(110);
              }}
            >
              110
            </FancyButton>
            <FancyButton
              backgroundColorFocused="green"
              backgroundColorUnfocused="lightgreen"
              focused={currentLevel === 120}
              onClick={() => {
                setLevel(120);
              }}
            >
              120
            </FancyButton>
          </>
        ) : null}
      </FlexRowC>
    </FlexRowC>
  );
};
