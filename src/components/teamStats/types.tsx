import { css } from "@emotion/css";
import { Attribute } from "../../client";
import { monsterCacheClient } from "../../model/monsterCacheClient";

import { PlayerState, TeamState } from "../../model/teamStateManager";
import { MonsterType } from "../../model/types/monster";
import { FlexCol, FlexRow } from "../../stylePrimitives";
import { AwakeningHistogram, AwakeningStatsDisplay, computeTotalAwakenings } from "./awakenings";

export type TeamTypes = number[];

export async function computeTypes(playerState: PlayerState) {
  const slots = [
    playerState.teamSlot1,
    playerState.teamSlot2,
    playerState.teamSlot3,
    playerState.teamSlot4,
    playerState.teamSlot5,
    playerState.teamSlot6
  ];

  var types: number[] = [];
  for (var s of slots) {
    const m1b = await monsterCacheClient.get(s.baseId);
    if (!m1b) {
      continue;
    }
    if (m1b.type1 !== undefined) {
      types.push(m1b.type1);
    }
  }
  return types.filter((v, i, a) => a.indexOf(v) === i);
}

export const TeamTypesDisplay = ({ tt }: { tt?: TeamTypes }) => {
  if (!tt) {
    return <></>;
  }
  return (
    <FlexRow gap={"1rem"}>
      Team Types:{" "}
      {tt.map((a) => {
        return <span>{MonsterType[a]}</span>;
      })}
    </FlexRow>
  );
};
