import { MonsterResponse, StatValues } from "../../client";

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
