import { css } from "@emotion/css";
import { useContext } from "react";
import { iStr } from "../i18n/i18n";
import { AppStateContext } from "../model/teamStateManager";
import { FlexRowC, ToggleOption } from "../stylePrimitives";

export const TeamStatsToggles = () => {
  const { language, statsTab } = useContext(AppStateContext);
  return (
    <div
      className={css`
        position: relative;
        height: 35px;
        box-sizing: border-box;
        width: 440px;
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
        <AssistToggle isEnabled={statsTab[0] !== "main"}></AssistToggle>
      </FlexRowC>
    </div>
  );
};

const AssistToggle = ({ isEnabled }: { isEnabled: boolean }) => {
  const { setStatsTab } = useContext(AppStateContext);
  if (isEnabled) {
    return (
      <ToggleOption
        isEnabled={true}
        image="assistBind.png"
        onClick={() => {
          setStatsTab(["main", "main", "main"]);
        }}
      ></ToggleOption>
    );
  }
  return (
    <ToggleOption
      isEnabled={false}
      image="assistBind.png"
      onClick={() => {
        setStatsTab(["no-assists", "no-assists", "no-assists"]);
      }}
    ></ToggleOption>
  );
};
