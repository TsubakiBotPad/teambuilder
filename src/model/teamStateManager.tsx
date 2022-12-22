import { debounce, DebouncedFunc } from "lodash";
import React from "react";

import { GameConfig } from "../components/gameConfigSelector";
import { TeamComponentId } from "../components/id";
import { TeamStats } from "../components/teamStats/teamStats";
import { ConfigData } from "./serializedUri";

export interface TeamCardInfo {
  id: number;
  level: number;
  sa?: number;
}

export interface TeamSlotState {
  base: TeamCardInfo;
  assist: TeamCardInfo;
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
    base: { id: 0, level: 0 },
    assist: { id: 0, level: 0 },
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
  cardSlotSelected: Partial<TeamComponentId>;
  setCardSlotSelected: React.Dispatch<React.SetStateAction<Partial<TeamComponentId>>>;
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
  cardSlotSelected: {},
  setCardSlotSelected: () => {},
  playerSelected: "",
  setPlayerSelected: () => {},
  updateUrl: debounce(() => {})
};

export const AppStateContext = React.createContext(DEFAULT_APP_STATE);

export async function setCard(
  cardSlot: Partial<TeamComponentId>,
  value: number,
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  gameConfig: GameConfig
) {
  const p = cardSlot.teamId!;
  const s = cardSlot.slotId!;
  const c = `${cardSlot.use!}` as keyof TeamSlotState;

  var newTeamState = {
    ...teamState
  };

  const card = (newTeamState[p][s] as TeamSlotState)[c] as TeamCardInfo;
  (newTeamState[p][s] as TeamSlotState)[c] = { ...card, id: value } as any;

  setTeamState(newTeamState);
}

export async function setCardLatents(
  cardSlot: Partial<TeamComponentId>,
  value: number[],
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>
) {
  const p = cardSlot.teamId!;
  const s = cardSlot.slotId!;
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

export function copyLatents(
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  s: Partial<TeamComponentId>,
  t: Partial<TeamComponentId>
) {
  var newTeamState = {
    ...teamState
  };

  const oT = teamState[s.teamId!];
  const oS = oT[s.slotId!] as TeamSlotState;
  const oSl = oS.latents;

  (newTeamState[t.teamId!][t.slotId!] as TeamSlotState).latents = [...oSl];
  setTeamState(newTeamState);
}

export function swapLatents(
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  s: Partial<TeamComponentId>,
  t: Partial<TeamComponentId>
) {
  var newTeamState = {
    ...teamState
  };

  const oT = teamState[t.teamId!];
  const oS = oT[t.slotId!] as TeamSlotState;
  const oSl = oS.latents;

  (newTeamState[t.teamId!][t.slotId!] as TeamSlotState).latents = [
    ...(teamState[s.teamId!][s.slotId!] as TeamSlotState).latents
  ];
  (newTeamState[s.teamId!][s.slotId!] as TeamSlotState).latents = [...oSl];
  setTeamState(newTeamState);
}

const USE_TO_USENAME = {
  base: "base",
  assist: "assist",
  latent: "latents"
};

export function swapCards(
  gameConfig: GameConfig,
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  s: Partial<TeamComponentId>,
  t: Partial<TeamComponentId>
) {
  const useNameS = USE_TO_USENAME[s.use!] as keyof TeamSlotState;
  const useNameT = USE_TO_USENAME[t.use!] as keyof TeamSlotState;

  var newTeamState = {
    ...teamState
  };

  const oT = teamState[t.teamId!];
  const oS = oT[t.slotId!] as TeamSlotState;
  const tempCard = oS[useNameT] as TeamCardInfo;

  const sourceCard = (teamState[s.teamId!][s.slotId!] as TeamSlotState)[useNameS] as TeamCardInfo;
  (newTeamState[t.teamId!][t.slotId!] as TeamSlotState)[useNameT] = { ...sourceCard } as any;
  (newTeamState[s.teamId!][s.slotId!] as TeamSlotState)[useNameS] = { ...tempCard } as any;

  setTeamState(newTeamState);
}

export function swapSlot(
  gameConfig: GameConfig,
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  s: Partial<TeamComponentId>,
  t: Partial<TeamComponentId>
) {
  var newTeamState = {
    ...teamState
  };

  const oT = teamState[t.teamId!];
  const tempSlot = oT[t.slotId!] as TeamSlotState;

  const slot = teamState[s.teamId!][s.slotId!] as TeamSlotState;
  (newTeamState[t.teamId!][t.slotId!] as TeamSlotState) = slot;
  (newTeamState[s.teamId!][s.slotId!] as TeamSlotState) = tempSlot;

  setTeamState(newTeamState);
}

export function copyCard(
  gameConfig: GameConfig,
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  s: Partial<TeamComponentId>,
  t: Partial<TeamComponentId>
) {
  const useNameS = USE_TO_USENAME[s.use!] as keyof TeamSlotState;
  const useNameT = USE_TO_USENAME[t.use!] as keyof TeamSlotState;

  var newTeamState = {
    ...teamState
  };

  var targetCard = (newTeamState[t.teamId!][t.slotId!] as TeamSlotState)[useNameT] as TeamCardInfo;
  (teamState[s.teamId!][s.slotId!] as TeamSlotState)[useNameS] = { ...targetCard } as any;

  setTeamState(newTeamState);
}

export function copySlot(
  gameConfig: GameConfig,
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  s: Partial<TeamComponentId>,
  t: Partial<TeamComponentId>
) {
  var newTeamState = {
    ...teamState
  };

  const slot = teamState[s.teamId!][s.slotId!] as TeamSlotState;
  (newTeamState[t.teamId!][t.slotId!] as TeamSlotState) = {
    base: { ...slot.base },
    assist: { ...slot.assist },
    latents: [...slot.latents]
  };

  setTeamState(newTeamState);
}

export function linkLeaders(teamState: TeamState, setTeamState: React.Dispatch<React.SetStateAction<TeamState>>) {
  var newTeamState = {
    ...teamState
  };

  newTeamState.p2.teamSlot6 = teamState.p1.teamSlot1;
  newTeamState.p1.teamSlot6 = teamState.p2.teamSlot1;

  setTeamState(newTeamState);
}

export function unlinkLeaders(teamState: TeamState, setTeamState: React.Dispatch<React.SetStateAction<TeamState>>) {
  var newTeamState = {
    ...teamState
  };

  newTeamState.p2.teamSlot6 = { ...teamState.p1.teamSlot1, latents: [...teamState.p1.teamSlot1.latents] };
  newTeamState.p1.teamSlot6 = { ...teamState.p2.teamSlot1, latents: [...teamState.p2.teamSlot1.latents] };

  setTeamState(newTeamState);
}
