/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AwokenSkill } from "./AwokenSkill";

export type Awakening = {
  awakening_id: number;
  monster_id: number;
  awoken_skill_id: number;
  is_super: number;
  order_idx: number;
  awoken_skill: AwokenSkill;
  name: string;
};
