import { MonsterResponse } from "../client/models/MonsterResponse";
import { MonsterService } from "../client/services/MonsterService";

export class MonsterCacheClient {
  cache: { [key: number]: MonsterResponse };

  constructor() {
    this.cache = {};
  }

  public async get(monsterId: number) {
    if (monsterId === 0) {
      return null;
    }

    if (this.cache[monsterId]) {
      return this.cache[monsterId];
    }

    const j = await MonsterService.get(monsterId);
    this.cache[monsterId] = j;
    return j;
  }

  public async getMonsters(monsterIds: number[]) {
    const result = [];
    const needsQuery = [];
    for (var idx in monsterIds) {
      if (this.cache[monsterIds[idx]]) {
        result.push({ idx: this.cache[monsterIds[idx]] });
        continue;
      }
      needsQuery.push({ index: idx, monsterId: monsterIds[idx] });
    }

    const j = await MonsterService.getManyById(
      needsQuery.map((a) => a.monsterId).join(",")
    );
    j.monsters.forEach((m) => {
      this.cache[m.monster_id] = m;
    });

    return j;
  }

  public async teamBuilderQuery(query: string) {
    const j = await MonsterService.teamBuilderQuery(query);
    [j.monster, ...j.evolutions].forEach((m) => {
      this.cache[m.monster_id] = m;
    });

    return j;
  }
}

export const monsterCacheClient = new MonsterCacheClient();
