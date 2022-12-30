import JSONCrush from "jsoncrush";

import { GameConfig } from "../components/gameConfigSelector";
import { Language } from "../i18n/i18n";
import { TeamState } from "./teamStateManager";

export type ConfigData = { n: string; ts: TeamState; gc: GameConfig; in?: string; l: Language };

export const serializeConfig = ({
  n: teamName,
  ts: teamState,
  gc: gameConfig,
  in: instructions,
  l: language
}: ConfigData): string => {
  const y = JSON.stringify({ n: teamName, ts: teamState, gc: gameConfig, in: instructions, l: language });
  const z = encodeURIComponent(JSONCrush.crush(y));

  return z;
};

export const deserializeConfig = (serialized: string): ConfigData => {
  const x = JSONCrush.uncrush(decodeURIComponent(serialized));
  const y = JSON.parse(x);
  return y;
};
