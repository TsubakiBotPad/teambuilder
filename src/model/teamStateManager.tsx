import React from "react";

export interface TeamSlotState {
  baseId: number;
  assistId: number;
  latents: number[];
}

export interface PlayerState {
  badgeId: number;
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
    latents: [],
  };
};

export const DEFAULT_TEAM_STATE: TeamState = {
  p1: {
    badgeId: 0,
    teamSlot1: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot2: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot3: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot4: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot5: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot6: DEFAULT_TEAM_SLOT_STATE(),
  },
  p2: {
    badgeId: 0,
    teamSlot1: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot2: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot3: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot4: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot5: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot6: DEFAULT_TEAM_SLOT_STATE(),
  },
  p3: {
    badgeId: 0,
    teamSlot1: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot2: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot3: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot4: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot5: DEFAULT_TEAM_SLOT_STATE(),
    teamSlot6: DEFAULT_TEAM_SLOT_STATE(),
  },
};

export function setCard(
  cardSlot: string,
  value: number,
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>
) {
  const parts = cardSlot.split("-");
  const p = parts[0].toLowerCase() as keyof TeamState;
  const s = `team${parts[1]}` as keyof PlayerState;
  const c = (
    parts[2] === "Base" ? "baseId" : "assistId"
  ) as keyof TeamSlotState;

  var newTeamState = {
    ...teamState,
  };

  (newTeamState[p][s] as TeamSlotState)[c] = value as any;
  console.log(p, s, c);
  console.log(newTeamState);

  setTeamState(newTeamState);
}

export function setCardLatents(
  cardSlot: string,
  value: number[],
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>
) {
  const parts = cardSlot.split("-");
  const p = parts[0].toLowerCase() as keyof TeamState;
  const s = `team${parts[1]}` as keyof PlayerState;
  const c = "latents";

  var newTeamState = {
    ...teamState,
  };

  (newTeamState[p][s] as TeamSlotState)[c] = value;
  setTeamState(newTeamState);
}

export function setPlayerBadge(
  playerId: string,
  value: number,
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>
) {
  var newTeamState = {
    ...teamState,
  };

  newTeamState[playerId as keyof TeamState].badgeId = value;
  setTeamState(newTeamState);
}
