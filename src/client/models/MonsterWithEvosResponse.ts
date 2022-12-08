/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MonsterResponse } from './MonsterResponse';

export type MonsterWithEvosResponse = {
    monster: MonsterResponse;
    evolutions: Array<MonsterResponse>;
};

