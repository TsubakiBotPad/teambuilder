import { MonsterResponse, StatValues } from "../../client";
import { AwokenSkills } from "./monster";
import { LATENTS_NAME_TO_ID } from "./latents";

type StatType = "hp" | "atk" | "rcv";

export class MonsterStatModifierInput {
  num_hp: number;
  num_atk: number;
  num_rcv: number;
  num_hpplus: number;
  num_atkplus: number;
  num_rcvplus: number;
  num_hpplus2: number;
  num_atkplus2: number;
  num_rcvplus2: number;
  num_all_stat: number;
  num_hp_awakening: number;
  num_atk_awakening: number;
  num_rcv_awakening: number;
  num_voice_awakening: number;

  constructor({
    num_hp = 0,
    num_atk = 0,
    num_rcv = 0,
    num_hpplus = 0,
    num_atkplus = 0,
    num_rcvplus = 0,
    num_hpplus2 = 0,
    num_atkplus2 = 0,
    num_rcvplus2 = 0,
    num_all_stat = 0,
    num_hp_awakening = 0,
    num_atk_awakening = 0,
    num_rcv_awakening = 0,
    num_voice_awakening = 0
  }) {
    this.num_hp = num_hp;
    this.num_atk = num_atk;
    this.num_rcv = num_rcv;
    this.num_hpplus = num_hpplus;
    this.num_atkplus = num_atkplus;
    this.num_rcvplus = num_rcvplus;
    this.num_hpplus2 = num_hpplus2;
    this.num_atkplus2 = num_atkplus2;
    this.num_rcvplus2 = num_rcvplus2;
    this.num_all_stat = num_all_stat;
    this.num_hp_awakening = num_hp_awakening;
    this.num_atk_awakening = num_atk_awakening;
    this.num_rcv_awakening = num_rcv_awakening;
    this.num_voice_awakening = num_voice_awakening;
  }

  public get_latent_multiplier(key: StatType) {
    if (key === "hp")
      return this.num_hp * 0.015 + this.num_hpplus * 0.045 + this.num_hpplus2 * 0.1 + this.num_all_stat * 0.03;
    else if (key === "atk")
      return this.num_atk * 0.01 + this.num_atkplus * 0.03 + this.num_atkplus2 * 0.08 + this.num_all_stat * 0.02;
    else if (key === "rcv")
      return this.num_rcv * 0.1 + this.num_rcvplus * 0.3 + this.num_rcvplus2 * 0.35 + this.num_all_stat * 0.2;

    return 0;
  }

  public get_awakening_addition(key: StatType) {
    if (key === "hp") return 500 * this.num_hp_awakening;
    else if (key === "atk") return 100 * this.num_atk_awakening;
    else if (key === "rcv") return 200 * this.num_rcv_awakening;
    return 0;
  }
}

const PLUS_DICT = { hp: 10, atk: 5, rcv: 3 };
const LV_120_MULT_DICT = { hp: 10, atk: 5, rcv: 5 };

export function base_stat(monster: MonsterResponse, key: keyof StatValues, lv: number) {
  const s_min = monster.stat_values[key]["min"];
  const s_max = monster.stat_values[key]["max"];
  var s_val = 0;
  if (monster.level > 1) {
    const scale = monster.stat_values[key]["scale"];
    s_val = s_min + (s_max - s_min) * Math.pow((Math.min(lv, monster.level) - 1) / (monster.level - 1), scale);
  } else {
    s_val = s_min;
  }

  const val_at_99 = s_val;
  if (lv > 99) {
    s_val *= 1 + ((monster.limit_mult / 11) * (Math.min(lv, 110) - 99)) / 100;
  }
  if (lv > 110) {
    const slb_bonus = (LV_120_MULT_DICT[key] * val_at_99 * (lv - 110)) / 1000;
    s_val += slb_bonus;
  }

  return s_val;
}

function awakeningCount(monsterResponse: MonsterResponse, awokenSkillId: AwokenSkills) {
  return monsterResponse.awakenings.filter((a) => a.awoken_skill_id === awokenSkillId).length;
}

function latentCount(latents: number[], latentId: number) {
  return latents.filter((a) => a === latentId).length;
}

export function stat({
  monster_model,
  key,
  lv,
  plus = 99,
  inherit = false,
  is_plus_297 = true,
  multiplayer = false,
  inherited_monster,
  inherited_monster_lvl = 99,
  ignore_awakenings = false,
  monsterLatents = []
}: {
  monster_model: MonsterResponse;
  key: StatType;
  lv: number;
  plus?: number;
  inherit?: boolean;
  is_plus_297?: boolean;
  multiplayer?: boolean;
  inherited_monster?: MonsterResponse;
  inherited_monster_lvl?: number;
  ignore_awakenings?: boolean;
  monsterLatents?: number[];
}) {
  // # TODO: deal with atk-, rcv-, and hp- awakenings
  // # PAD rounds stats from the start before any calculations
  var s_val = Math.round(base_stat(monster_model, key, lv));

  if (!(monster_model.is_equip || inherit) && !ignore_awakenings) {
    const stat_latents = new MonsterStatModifierInput({
      num_hp_awakening: awakeningCount(monster_model, AwokenSkills.ENHANCEDHP),
      num_atk_awakening: awakeningCount(monster_model, AwokenSkills.ENHANCEDATK),
      num_rcv_awakening: awakeningCount(monster_model, AwokenSkills.ENHANCEDRCV),
      num_voice_awakening: awakeningCount(monster_model, AwokenSkills.VOICE),
      num_hp: latentCount(monsterLatents, LATENTS_NAME_TO_ID["hp"]),
      num_hpplus: latentCount(monsterLatents, LATENTS_NAME_TO_ID["hp+"]),
      num_hpplus2: latentCount(monsterLatents, LATENTS_NAME_TO_ID["hp++"]),
      num_atk: latentCount(monsterLatents, LATENTS_NAME_TO_ID["atk"]),
      num_atkplus: latentCount(monsterLatents, LATENTS_NAME_TO_ID["atk+"]),
      num_atkplus2: latentCount(monsterLatents, LATENTS_NAME_TO_ID["atk++"]),
      num_rcv: latentCount(monsterLatents, LATENTS_NAME_TO_ID["rcv"]),
      num_rcvplus: latentCount(monsterLatents, LATENTS_NAME_TO_ID["rcv+"]),
      num_rcvplus2: latentCount(monsterLatents, LATENTS_NAME_TO_ID["rcv++"])
    });
    const latents = s_val * stat_latents.get_latent_multiplier(key);
    const stat_awakenings = stat_latents.get_awakening_addition(key);
    const voice = s_val * stat_latents.num_voice_awakening * 0.1;
    s_val += latents + stat_awakenings + voice;
  }

  // # include plus calculations. todo: is there a way to do this without subtraction?
  s_val += PLUS_DICT[key] * Math.max(Math.min(plus, 99), 0);
  if (inherit) {
    const inherit_dict = { hp: 0.1, atk: 0.05, rcv: 0.15 };
    if (!is_plus_297) s_val -= PLUS_DICT[key] * Math.max(Math.min(plus, 99), 0);
    s_val *= inherit_dict[key];
  }

  if (inherited_monster) {
    //  # add base stats of inherit only if main atts are the same and not no-main-att
    if (monster_model.attr1 === inherited_monster.attr1 || monster_model.attr1 === 6 || inherited_monster.attr1 === 6) {
      //  # recursion is not possible because inherits do not have inherits on top of them
      //  # inherit=True to calculate inherit stats and multiplayer=False in case the inherit has a multiboost awakening
      s_val += Math.round(
        stat({
          monster_model: inherited_monster,
          key: key,
          lv: inherited_monster_lvl,
          inherit: true,
          multiplayer: multiplayer
        })
      );
    }

    //  # add bonus atk, hp, or rcv awakenings iff the inherit has awoken assist
    if (inherited_monster.is_equip && !ignore_awakenings) {
      const inherit_bonus = new MonsterStatModifierInput({
        num_hp_awakening: awakeningCount(inherited_monster, AwokenSkills.ENHANCEDHP),
        num_atk_awakening: awakeningCount(inherited_monster, AwokenSkills.ENHANCEDATK),
        num_rcv_awakening: awakeningCount(inherited_monster, AwokenSkills.ENHANCEDRCV)
      });
      s_val += inherit_bonus.get_awakening_addition(key);
    }
  }

  if (multiplayer && !ignore_awakenings) {
    var num_multiboost = awakeningCount(monster_model, AwokenSkills.MULTIBOOST);
    num_multiboost +=
      inherited_monster && inherited_monster.is_equip ? awakeningCount(inherited_monster, AwokenSkills.MULTIBOOST) : 0;
    s_val = Math.round(Math.round(s_val) * 1.5 ** num_multiboost);
  }

  return s_val;
}

export function maxLevel(monster: MonsterResponse) {
  return monster.limit_mult !== 0 ? 120 : 99;
}
