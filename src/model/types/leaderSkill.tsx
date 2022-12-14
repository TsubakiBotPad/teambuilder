import { MonsterResponse } from "../../client";

export interface LeaderStats {
  hp: number;
  atk: number;
  rcv: number;
  resist: number;
  ehp: number;
  combos: number;
  fua: number;
}

function getLeaderStats(m?: MonsterResponse): LeaderStats {
  const calc = {
    hp: 1,
    atk: 1,
    rcv: 1,
    shield: 0,
    combos: 0,
    fua: 0
  };

  if (m && m.leader_skill) {
    const ls = m.leader_skill;
    calc.hp = ls.max_hp;
    calc.atk = ls.max_atk;
    calc.rcv = ls.max_rcv;
    calc.shield = ls.max_shield;
    calc.combos = ls.max_combos;
    calc.fua = ls.bonus_damage;
  }

  const hp = calc.hp;
  const resist = 1 - (1 - calc.shield);
  const ehp = hp / (1 - resist);

  return {
    hp,
    atk: calc.atk,
    rcv: calc.rcv,
    resist,
    ehp,
    combos: calc.combos,
    fua: calc.fua
  };
}

export function computeLeaderSkill(leader?: MonsterResponse, helper?: MonsterResponse): LeaderStats {
  const ls1 = getLeaderStats(leader);
  const ls2 = getLeaderStats(helper);
  const resist = 1 - (1 - ls1.resist) * (1 - ls2.resist);
  const hp = ls1.hp * ls2.hp;
  const ehp = hp / (1 - resist);

  return {
    hp,
    atk: ls1.atk * ls2.atk,
    rcv: ls1.rcv * ls2.rcv,
    resist,
    ehp,
    combos: ls1.combos + ls2.combos,
    fua: ls1.fua + ls2.fua
  };
}
