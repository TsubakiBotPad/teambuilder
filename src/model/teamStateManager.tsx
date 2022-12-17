import { debounce, DebouncedFunc } from "lodash";
import React from "react";

import { GameConfig } from "../components/gameConfigSelector";
import { TeamStats } from "../components/teamStats/teamStats";
import { ConfigData } from "./serializedUri";

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

interface ITeamStateContext {
  teamState: TeamState;
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>;
}

const DEFAULT_TEAM_STATE_CONTEXT: ITeamStateContext = { teamState: DEFAULT_TEAM_STATE, setTeamState: () => {} };
export const TeamStateContext = React.createContext(DEFAULT_TEAM_STATE_CONTEXT);

interface AppState {
  gameConfig: GameConfig;
  setGameConfig: React.Dispatch<React.SetStateAction<GameConfig>>;
  teamName: string;
  setTeamStats: React.Dispatch<React.SetStateAction<TeamStats>>;
  teamStats: TeamStats;
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  latentModalIsOpen: boolean;
  setLatentModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  badgeModalIsOpen: boolean;
  setBadgeModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cardSlotSelected: string;
  setCardSlotSelected: React.Dispatch<React.SetStateAction<string>>;
  playerSelected: string;
  setPlayerSelected: React.Dispatch<React.SetStateAction<string>>;
  updateUrl: DebouncedFunc<(config: Partial<ConfigData>) => void>;
}

const DEFAULT_APP_STATE: AppState = {
  gameConfig: { mode: "3p" },
  setGameConfig: () => {},
  teamName: "",
  teamStats: {},
  setTeamStats: () => {},
  modalIsOpen: false,
  setModalIsOpen: () => {},
  latentModalIsOpen: false,
  setLatentModalIsOpen: () => {},
  badgeModalIsOpen: false,
  setBadgeModalIsOpen: () => {},
  cardSlotSelected: "",
  setCardSlotSelected: () => {},
  playerSelected: "",
  setPlayerSelected: () => {},
  updateUrl: debounce(() => {})
};

export const AppStateContext = React.createContext(DEFAULT_APP_STATE);

export async function setCard(
  cardSlot: string,
  value: number,
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  gameConfig: GameConfig
) {
  const parts = cardSlot.split("-");
  const p = parts[0].toLowerCase() as keyof TeamState;
  const s = `team${parts[1]}` as keyof PlayerState;
  const c = (parts[2] === "Base" ? "baseId" : "assistId") as keyof TeamSlotState;

  var newTeamState = {
    ...teamState
  };

  if (gameConfig.mode === "2p") {
    newTeamState.p1.teamSlot6 = newTeamState.p2.teamSlot1;
    newTeamState.p2.teamSlot6 = newTeamState.p1.teamSlot1;
  }

  (newTeamState[p][s] as TeamSlotState)[c] = value as any;
  setTeamState(newTeamState);
}

export async function setCardLatents(
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
    ...teamState
  };

  (newTeamState[p][s] as TeamSlotState)[c] = [...value];
  setTeamState(newTeamState);
}

export async function setPlayerBadge(
  playerId: "p1" | "p2" | "p3",
  value: string,
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>
) {
  var newTeamState = {
    ...teamState
  };

  newTeamState[playerId as keyof TeamState].badgeId = value;
  setTeamState(newTeamState);
}

export function getTeamSlots(gameConfig: GameConfig, teamState: TeamState, playerId: keyof TeamState) {
  var slots = [];
  const playerState = teamState[playerId];
  if (gameConfig.mode === "2p") {
    slots = [
      teamState.p1.teamSlot1,
      playerState.teamSlot2,
      playerState.teamSlot3,
      playerState.teamSlot4,
      playerState.teamSlot5,
      teamState.p2.teamSlot6
    ];
  } else {
    slots = [
      playerState.teamSlot1,
      playerState.teamSlot2,
      playerState.teamSlot3,
      playerState.teamSlot4,
      playerState.teamSlot5,
      playerState.teamSlot6
    ];
  }

  return slots;
}
