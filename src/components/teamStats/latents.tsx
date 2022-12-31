import { monsterCacheClient } from "../../model/monsterCacheClient";
import { get2PTeamSlots, getTeamSlots, TeamState } from "../../model/teamStateManager";
import { GameConfig } from "../gameConfigSelector";

export interface LatentInfoShared {
  psf: boolean;
  jsf: boolean;
}

export interface LatentInfo extends LatentInfoShared {
  ls: number;
}

export function computeLatents(gameConfig: GameConfig, teamState: TeamState, playerId: keyof TeamState): LatentInfo {
  const slots = getTeamSlots(gameConfig, teamState, playerId);
  var psf = false;
  var jsf = false;
  var ls = 0;
  for (var i = 0; i < slots.length; i++) {
    const s = slots[i];
    if (s.latents.includes(601)) {
      psf = true;
    }
    if (s.latents.includes(602)) {
      jsf = true;
    }
    if (s.latents.includes(603)) {
      if (i === 0) {
        ls = 100;
      }
      if (i === 5) {
        continue;
      }
      if (ls < 100) {
        ls += 20;
      }
    }
  }
  return { psf, jsf, ls };
}

export function computeLatents2P(gameConfig: GameConfig, teamState: TeamState): LatentInfoShared {
  if (gameConfig.mode !== "2p") {
    return {
      psf: false,
      jsf: false
    };
  }

  const slots = get2PTeamSlots(teamState);
  var psf = false;
  var jsf = false;
  var ls = 0;
  for (var i = 0; i < slots.length; i++) {
    const s = slots[i];
    if (s.latents.includes(601)) {
      psf = true;
    }
    if (s.latents.includes(602)) {
      jsf = true;
    }
  }

  return { psf, jsf };
}
