import React from "react";
import { GameConfig } from "../components/gameConfigSelector";
import { computeTeamStat, TeamStats } from "../components/teamStats/teamStats";

export interface TeamSlotState {
  baseId: number;
  assistId: number;
  latents: number[];
}

export interface PlayerState {
  badgeId: string;
  teamSlot1: TeamSlotState;
  teamSlot2: TeamSlotState;
  teamSlot3: TeamSlotState;
  teamSlot4: TeamSlotState;
  teamSlot5: TeamSlotState;
  teamSlot6: TeamSlotState;
}

export interface TeamState {
  p1: PlayerState;
  p2: PlayerState;
  p3: PlayerState;
}

export const DEFAULT_TEAM_SLOT_STATE = () => {
  return {
    baseId: 0,
    assistId: 0,
    latents: []
  };
};

export const DEFAULT_TEAM_STATE: TeamState = {
  p1: {
    badgeId: "",
    teamSlot1: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot2: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot3: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot4: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot5: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot6: DEFAULT_TEAM_SLOT_STATE()
  },
  p2: {
    badgeId: "",
    teamSlot1: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot2: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot3: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot4: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot5: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot6: DEFAULT_TEAM_SLOT_STATE()
  },
  p3: {
    badgeId: "",
    teamSlot1: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot2: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot3: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot4: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot5: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot6: DEFAULT_TEAM_SLOT_STATE()
  }
};

export async function setCard(
  cardSlot: string,
  value: number,
  gameConfig: GameConfig,
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  teamStats: TeamStats,
  setTeamStats: React.Dispatch<React.SetStateAction<TeamStats>>
) {
  const parts = cardSlot.split("-");
  const p = parts[0].toLowerCase() as keyof TeamState;
  const s = `team${parts[1]}` as keyof PlayerState;
  const c = (parts[2] === "Base" ? "baseId" : "assistId") as keyof TeamSlotState;

  var newTeamState = {
    ...teamState
  };

  (newTeamState[p][s] as TeamSlotState)[c] = value as any;
  console.log(p, s, c);
  console.log(newTeamState);

  setTeamState(newTeamState);
  setTeamStats({ ...teamStats, [p]: await computeTeamStat(teamState, gameConfig, p) });
}

export async function setCardLatents(
  cardSlot: string,
  value: number[],
  gameConfig: GameConfig,
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  teamStats: TeamStats,
  setTeamStats: React.Dispatch<React.SetStateAction<TeamStats>>
) {
  const parts = cardSlot.split("-");
  const p = parts[0].toLowerCase() as keyof TeamState;
  const s = `team${parts[1]}` as keyof PlayerState;
  const c = "latents";

  var newTeamState = {
    ...teamState
  };

  (newTeamState[p][s] as TeamSlotState)[c] = [...value];
  setTeamState(newTeamState);
  setTeamStats({ ...teamStats, [p]: await computeTeamStat(teamState, gameConfig, p) });
}

export async function setPlayerBadge(
  playerId: "p1" | "p2" | "p3",
  value: string,
  gameConfig: GameConfig,
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  teamStats: TeamStats,
  setTeamStats: React.Dispatch<React.SetStateAction<TeamStats>>
) {
  var newTeamState = {
    ...teamState
  };

  newTeamState[playerId as keyof TeamState].badgeId = value;
  setTeamState(newTeamState);
  setTeamStats({ ...teamStats, [playerId]: await computeTeamStat(teamState, gameConfig, playerId) });
}

export function serializeTeamState(teamState: TeamState) {}

function serializePlayerState(prefix: string, playerId: string, p: PlayerState) {
  const k = `${prefix}p${playerId}`;
  return [
    { [`${k}b`]: p.badgeId },
    serializeTeamSlot(k, 1, p.teamSlot1),
    serializeTeamSlot(k, 2, p.teamSlot2),
    serializeTeamSlot(k, 3, p.teamSlot3),
    serializeTeamSlot(k, 4, p.teamSlot4),
    serializeTeamSlot(k, 5, p.teamSlot5),
    serializeTeamSlot(k, 6, p.teamSlot6)
  ];
}

function serializeTeamSlot(prefix: string, slotId: number, ts: TeamSlotState) {
  return { [`${prefix}s${slotId}`]: [ts.baseId, ts.assistId, ts.latents] };
}
