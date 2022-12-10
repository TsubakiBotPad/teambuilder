import { monsterCacheClient } from "../../model/monsterCacheClient";
import { PlayerState } from "../../model/teamStateManager";
import { maxLevel, stat } from "../../model/types/stat";
import { FlexRow } from "../../stylePrimitives";
import { GameConfig } from "../gameConfigSelector";

export interface TeamBasicStats {
  hp: number;
  rcv: number;
  hpNoAwo: number;
  rcvNoAwo: number;
}

export async function computeTeamBasicStats(playerState: PlayerState, gameConfig: GameConfig) {
  const slots = [
    playerState.teamSlot1,
    playerState.teamSlot2,
    playerState.teamSlot3,
    playerState.teamSlot4,
    playerState.teamSlot5,
    playerState.teamSlot6
  ];

  var hpAcc = 0;
  var hpNoAwoAcc = 0;

  var rcvAcc = 0;
  var rcvNoAwoAcc = 0;

  for (var s of slots) {
    const m1b = await monsterCacheClient.get(s.baseId);
    if (!m1b) {
      continue;
    }

    const m1a = await monsterCacheClient.get(s.assistId);

    const plus = 297; // TODO: make config
    var is_plus_297 = false;
    var plusArr = [0, 0, 0];
    if (plus == 297) {
      plusArr = [99, 99, 99];
      is_plus_297 = true;
    }

    const lv = maxLevel(m1b); // TODO: make config
    const multiplayer = gameConfig.mode !== "1p";

    const hp = Math.round(
      stat({
        monster_model: m1b,
        key: "hp",
        lv: lv,
        plus: plusArr[0],
        inherit: false,
        is_plus_297: is_plus_297,
        multiplayer: multiplayer,
        inherited_monster: m1a
      })
    );
    const rcv = Math.round(
      stat({
        monster_model: m1b,
        key: "rcv",
        lv: lv,
        plus: plusArr[2],
        inherit: false,
        is_plus_297: is_plus_297,
        multiplayer: multiplayer,
        inherited_monster: m1a
      })
    );

    hpAcc += hp;
    rcvAcc += rcv;

    const hpNoAwo = Math.round(
      stat({
        monster_model: m1b,
        key: "hp",
        lv: lv,
        plus: plusArr[0],
        inherit: false,
        is_plus_297: is_plus_297,
        multiplayer: multiplayer,
        inherited_monster: m1a
      })
    );
    const rcvNoAwo = Math.round(
      stat({
        monster_model: m1b,
        key: "rcv",
        lv: lv,
        plus: plusArr[2],
        inherit: false,
        is_plus_297: is_plus_297,
        multiplayer: multiplayer,
        inherited_monster: m1a
      })
    );

    hpNoAwoAcc += hpNoAwo;
    rcvNoAwoAcc += rcvNoAwo;
  }

  // TODO: Team HP/RCV

  return { hp: hpAcc, rcv: rcvAcc, hpNoAwo: hpNoAwoAcc, rcvNoAwo: rcvNoAwoAcc };
}

export const TeamBasicStatsDisplay = ({ tbs }: { tbs?: TeamBasicStats }) => {
  if (!tbs) {
    return <></>;
  }
  return (
    <FlexRow gap={"1rem"}>
      Team Attributes:{" "}
      {Object.entries(tbs).map((a) => {
        return (
          <span>
            {a[0]}: {a[1]}
          </span>
        );
      })}
    </FlexRow>
  );
};
