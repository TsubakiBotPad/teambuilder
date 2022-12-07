import { MonsterResponse } from "../client/models/MonsterResponse";
import { MonsterService } from "../client/services/MonsterService";

export class MonsterCacheClient {
  cache: { [key: number]: MonsterResponse };

  constructor() {
    this.cache = {};
  }

  public async getMonster(monsterId: number) {
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

    const url = `https://api.tsubakibot.com/monsters?`;
    var params = {
      ids: needsQuery.map((a) => a.monsterId).join(",")
    };

    const resp = await fetch(url + new URLSearchParams(params));

    const j = await resp.json();
  }

  public async queryMonsters(query: string) {}
}

export const monsterCacheClient = new MonsterCacheClient();
