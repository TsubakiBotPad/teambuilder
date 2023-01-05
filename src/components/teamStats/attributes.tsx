import { monsterCacheClient } from "../../model/monsterCacheClient";
import { getTeamSlots, TeamState } from "../../model/teamStateManager";
import { GameConfig } from "../gameConfigSelector";

export type AttributeHistogram = { [key: number]: boolean };

export async function computeAttributes(
  gameConfig: GameConfig,
  teamState: TeamState,
  playerId: keyof TeamState,
  hasAssists: boolean
) {
  const slots = getTeamSlots(gameConfig, teamState, playerId);

  /* python
      class Attribute(str, Enum):
    """Standard 5 PAD colors in enum form. Values correspond to DadGuide values."""
    Fire = 0
    Water = 1
    Wood = 2
    Light = 3
    Dark = 4
    Unknown = 5
    Nil = 6
    */
  const attrs = [0, 1, 2, 3, 4].reduce((d, c) => {
    d[c] = false;
    return d;
  }, {} as { [key in number]: boolean });

  for (var s of slots) {
    const m1b = await monsterCacheClient.get(s.base.id);

    if (m1b?.attr1 !== undefined && m1b.attr1 in attrs) {
      attrs[m1b.attr1] = true;
    }
    if (m1b?.attr2 !== undefined && m1b.attr2 in attrs) {
      attrs[m1b.attr2] = true;
    }
  }

  return attrs;
}
