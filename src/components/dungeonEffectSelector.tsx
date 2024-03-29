import { css } from "@emotion/css";
import { useContext } from "react";
import { iStr } from "../i18n/i18n";
import { AppStateContext } from "../model/teamStateManager";
import { FlexRowC, ToggleOption } from "../stylePrimitives";

export interface dungeonEffects {
  hasAssists: boolean;
}

export const DEFAULT_DUNGEON_EFFECTS: dungeonEffects = {
  hasAssists: true
};

export const TeamStatsToggles = () => {
  const { language, dungeonEffects } = useContext(AppStateContext);
  return (
    <div
      className={css`
        position: relative;
        height: 35px;
        box-sizing: border-box;
        width: 440px;
        padding-left: 0.5rem;
      `}
    >
      <FlexRowC
        className={css`
          position: absolute;
          top: 2.4rem;
        `}
        gap={".25rem"}
      >
        {iStr("dungeonEffects", language)}
        <AssistToggle isEnabled={!dungeonEffects.hasAssists}></AssistToggle>
      </FlexRowC>
    </div>
  );
};

const AssistToggle = ({ isEnabled }: { isEnabled: boolean }) => {
  const { setDungeonEffects } = useContext(AppStateContext);
  if (isEnabled) {
    return (
      <ToggleOption
        isEnabled={true}
        image="assistBind.png"
        onClick={() => {
          setDungeonEffects({
            hasAssists: true
          });
        }}
      ></ToggleOption>
    );
  }
  return (
    <ToggleOption
      isEnabled={false}
      image="assistBind.png"
      onClick={() => {
        setDungeonEffects({
          hasAssists: false
        });
      }}
    ></ToggleOption>
  );
};
