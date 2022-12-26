import JSONCrush from "jsoncrush";

import { GameConfig } from "../components/gameConfigSelector";
import { TeamState } from "./teamStateManager";

export type ConfigData = { n: string; ts: TeamState; gc: GameConfig; in?: string };

export const serializeConfig = ({
  n: teamName,
  ts: teamState,
  gc: gameConfig,
  in: instructions
}: ConfigData): string => {
  const y = JSON.stringify({ n: teamName, ts: teamState, gc: gameConfig, in: instructions });
  const z = encodeURIComponent(JSONCrush.crush(y));

  return z;
};

export const deserializeConfig = (serialized: string): ConfigData => {
  const x = JSONCrush.uncrush(decodeURIComponent(serialized));
  const y = JSON.parse(x);
  return y;
};
