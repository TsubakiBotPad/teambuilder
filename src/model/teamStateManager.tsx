import { debounce, DebouncedFunc } from "lodash";
import React from "react";
import { DEFAULT_DUNGEON_EFFECTS, dungeonEffects } from "../components/dungeonEffectSelector";

import { GameConfig } from "../components/gameConfigSelector";
import { TeamComponentId } from "../components/id";
import { TeamStats } from "../components/teamStats/teamStats";
import { Language } from "../i18n/i18n";
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
  subattr?: number;
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
    latents: [] as number[]
  };
};

export const teamSlotEmpty = (slot: TeamSlotState) => {
  return slot.base.id === 0 && slot.assist.id === 0 && slot.latents.length === 0;
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

export const DEFAULT_GAME_CONFIG: GameConfig = {
  mode: "1p",
  defaultCardLevel: 120
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
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  teamName: string;
  setTeamName: React.Dispatch<React.SetStateAction<string>>;
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
  instructions?: string;
  setInstructions: React.Dispatch<React.SetStateAction<string | undefined>>;
  author?: string;
  setAuthor: React.Dispatch<React.SetStateAction<string | undefined>>;
  dungeonEffects: dungeonEffects;
  setDungeonEffects: React.Dispatch<React.SetStateAction<dungeonEffects>>;
}

export const DEFAULT_APP_STATE: AppState = {
  gameConfig: DEFAULT_GAME_CONFIG,
  setGameConfig: () => {},
  language: "en",
  setLanguage: () => {},
  teamName: "",
  setTeamName: () => {},
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
  updateUrl: debounce(() => {}),
  instructions: "",
  setInstructions: () => {},
  author: "",
  setAuthor: () => {},
  dungeonEffects: DEFAULT_DUNGEON_EFFECTS,
  setDungeonEffects: () => {}
};

export const AppStateContext = React.createContext(DEFAULT_APP_STATE);

export async function setCard(
  cardSlot: Partial<TeamComponentId>,
  cardInfo: TeamCardInfo,
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  gameConfig: GameConfig
) {
  const p = cardSlot.teamId!;
  const s = cardSlot.slotId!;
  const c = `${cardSlot.use!}` as keyof TeamSlotState;

  // Remove SA if level < 110
  if (cardInfo.level < 110) {
    cardInfo.sa = undefined;
  }

  const card = (teamState[p][s] as TeamSlotState)[c] as TeamCardInfo;
  (teamState[p][s] as TeamSlotState)[c] = {
    ...card,
    ...cardInfo
  } as any;

  setTeamState({ ...teamState });
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

  (teamState[p][s] as TeamSlotState)[c] = [...value];
  setTeamState({ ...teamState });
}

export async function setPlayerBadge(
  playerId: "p1" | "p2" | "p3",
  value: string,
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>
) {
  teamState[playerId as keyof TeamState].badgeId = value;
  setTeamState({ ...teamState });
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
      teamState.p2.teamSlot1
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

export function get2PTeamSlots(teamState: TeamState) {
  return [
    teamState.p1.teamSlot1,
    teamState.p1.teamSlot2,
    teamState.p1.teamSlot3,
    teamState.p1.teamSlot4,
    teamState.p1.teamSlot5,
    teamState.p2.teamSlot1,
    teamState.p2.teamSlot2,
    teamState.p2.teamSlot3,
    teamState.p2.teamSlot4,
    teamState.p2.teamSlot5
  ];
}

export function copyLatents(
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  s: Partial<TeamComponentId>,
  t: Partial<TeamComponentId>
) {
  const oT = teamState[s.teamId!];
  const oS = oT[s.slotId!] as TeamSlotState;
  const oSl = oS.latents;

  const latents = (teamState[t.teamId!][t.slotId!] as TeamSlotState).latents;
  latents.splice(0, latents.length, ...oSl);
  setTeamState({ ...teamState });
}

export function swapLatents(
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  s: Partial<TeamComponentId>,
  t: Partial<TeamComponentId>
) {
  const oT = teamState[t.teamId!];
  const oS = oT[t.slotId!] as TeamSlotState;
  const oSl = oS.latents;

  (teamState[t.teamId!][t.slotId!] as TeamSlotState).latents = [
    ...(teamState[s.teamId!][s.slotId!] as TeamSlotState).latents
  ];
  (teamState[s.teamId!][s.slotId!] as TeamSlotState).latents = [...oSl];
  setTeamState({ ...teamState });
}

const USE_TO_USENAME = {
  base: "base",
  assist: "assist",
  latents: "latents"
};

export function swapCards(
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  s: Partial<TeamComponentId>,
  t: Partial<TeamComponentId>
) {
  const useNameS = USE_TO_USENAME[s.use!] as keyof TeamSlotState;
  const useNameT = USE_TO_USENAME[t.use!] as keyof TeamSlotState;

  const oT = teamState[t.teamId!];
  const oS = oT[t.slotId!] as TeamSlotState;
  const tempCard = oS[useNameT] as TeamCardInfo;

  const sourceCard = (teamState[s.teamId!][s.slotId!] as TeamSlotState)[useNameS] as TeamCardInfo;
  (teamState[t.teamId!][t.slotId!] as TeamSlotState)[useNameT] = { ...sourceCard } as any;
  (teamState[s.teamId!][s.slotId!] as TeamSlotState)[useNameS] = { ...tempCard } as any;

  setTeamState({ ...teamState });
}

export function swapSlot(
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  s: Partial<TeamComponentId>,
  t: Partial<TeamComponentId>
) {
  const oT = teamState[t.teamId!];
  const tempSlot = oT[t.slotId!] as TeamSlotState;
  const tempVal: TeamSlotState = {
    base: { ...tempSlot.base },
    assist: { ...tempSlot.assist },
    latents: [...tempSlot.latents]
  };

  const slot = teamState[s.teamId!][s.slotId!] as TeamSlotState;
  var targetSlot = teamState[t.teamId!][t.slotId!] as TeamSlotState;
  targetSlot.base.id = slot.base.id;
  targetSlot.base.level = slot.base.level;
  targetSlot.base.sa = slot.base.sa;
  targetSlot.assist.id = slot.assist.id;
  targetSlot.assist.level = slot.assist.level;
  targetSlot.assist.sa = slot.assist.sa;
  targetSlot.latents.splice(0, targetSlot.latents.length, ...slot.latents);

  const sourceSlot = teamState[s.teamId!][s.slotId!] as TeamSlotState;
  sourceSlot.base.id = tempVal.base.id;
  sourceSlot.base.level = tempVal.base.level;
  sourceSlot.base.sa = tempVal.base.sa;
  sourceSlot.assist.id = tempVal.assist.id;
  sourceSlot.assist.level = tempVal.assist.level;
  sourceSlot.assist.sa = tempVal.assist.sa;
  sourceSlot.latents.splice(0, sourceSlot.latents.length, ...tempVal.latents);

  setTeamState({ ...teamState });
}

export function copyCard(
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  s: Partial<TeamComponentId>,
  t: Partial<TeamComponentId>
) {
  const useNameS = USE_TO_USENAME[s.use!] as keyof TeamSlotState;
  const useNameT = USE_TO_USENAME[t.use!] as keyof TeamSlotState;

  var sourceCard = (teamState[s.teamId!][s.slotId!] as TeamSlotState)[useNameS] as TeamCardInfo;
  var targetCard = (teamState[t.teamId!][t.slotId!] as TeamSlotState)[useNameT] as TeamCardInfo;
  targetCard.id = sourceCard.id;
  targetCard.level = sourceCard.level;
  targetCard.sa = sourceCard.sa;

  setTeamState({ ...teamState });
}

export function copySlot(
  teamState: TeamState,
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>,
  s: Partial<TeamComponentId>,
  t: Partial<TeamComponentId>
) {
  const slot = teamState[s.teamId!][s.slotId!] as TeamSlotState;
  const targetSlot = teamState[t.teamId!][t.slotId!] as TeamSlotState;
  targetSlot.base.id = slot.base.id;
  targetSlot.base.level = slot.base.level;
  targetSlot.base.sa = slot.base.sa;
  targetSlot.assist.id = slot.assist.id;
  targetSlot.assist.level = slot.assist.level;
  targetSlot.assist.sa = slot.assist.sa;
  targetSlot.latents.splice(0, targetSlot.latents.length, ...slot.latents);

  setTeamState({ ...teamState });
}

export function linkLeaders(teamState: TeamState, setTeamState: React.Dispatch<React.SetStateAction<TeamState>>) {
  // We need to make sure we don't lose data in the 1p -> 2p transition. Because P1 is
  // always onscreen, it's impossible for dataloss to happen in the P1 lead aka P2 helper
  // position, but dataloss CAN happen in the P2 lead aka P1 helper slot. So we may
  // wish to assign EITHER the P1 helper OR the P2 lead here, whichever one
  // actually exists.

  teamState.p2.teamSlot6 = teamState.p1.teamSlot1;

  // Give the P1 helper to P2
  if (!teamSlotEmpty(teamState.p1.teamSlot6)) {
    teamState.p2.teamSlot1 = teamState.p1.teamSlot6;
  }
  teamState.p1.teamSlot6 = teamState.p2.teamSlot1;
  setTeamState({ ...teamState });
}

export function linkLeadersNoSet(teamState: TeamState) {
  teamState.p2.teamSlot6 = teamState.p1.teamSlot1;
  teamState.p1.teamSlot6 = teamState.p2.teamSlot1;

  return teamState;
}

export function unlinkLeaders(teamState: TeamState, setTeamState: React.Dispatch<React.SetStateAction<TeamState>>) {
  var newTeamState = {
    ...teamState
  };

  newTeamState.p2.teamSlot6 = { ...teamState.p1.teamSlot1, latents: [...teamState.p1.teamSlot1.latents] };
  newTeamState.p1.teamSlot6 = { ...teamState.p2.teamSlot1, latents: [...teamState.p2.teamSlot1.latents] };

  setTeamState({ ...teamState });
}
