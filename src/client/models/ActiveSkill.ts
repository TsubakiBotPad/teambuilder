/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActiveSubskill } from "./ActiveSubskill";

export type ActiveSkill = {
  active_skill_id: number;
  compound_skill_type_id: number;
  name_ja: string;
  name_en: string;
  name_ko: string;
  desc_ja: string;
  desc_en: string;
  desc_ko: string;
  desc_templated_ja: string;
  desc_templated_en: string;
  desc_templated_ko: string;
  desc_official_ja: string;
  desc_official_en: string;
  desc_official_ko: string;
  cooldown_turns_max: number;
  cooldown_turns_min: number;
  active_subskills: Array<ActiveSubskill>;
  name: string;
  desc: string;
  desc_templated: string;
};
