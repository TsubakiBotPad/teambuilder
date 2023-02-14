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
    <div className="relative h-9 w-[440px] pl-2">
      <FlexRowC className="absolute top-10 gap-1">
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
        image="bg-[url('../public/img/assistBind.png')]"
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
      image="bg-[url('../public/img/assistBind.png')]"
      onClick={() => {
        setDungeonEffects({
          hasAssists: false
        });
      }}
    ></ToggleOption>
  );
};
