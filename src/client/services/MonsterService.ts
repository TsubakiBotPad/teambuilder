/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MonsterResponse } from '../models/MonsterResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MonsterService {

    /**
     * Get
     * @param monsterId
     * @returns MonsterResponse Successful Response
     * @throws ApiError
     */
    public static get(
        monsterId: any,
    ): CancelablePromise<MonsterResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/monster/{monster_id}',
            path: {
                'monster_id': monsterId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
