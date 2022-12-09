/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MonsterResponse } from '../models/MonsterResponse';
import type { MonstersResponse } from '../models/MonstersResponse';
import type { MonsterWithEvosResponse } from '../models/MonsterWithEvosResponse';

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

    /**
     * Getmanybyid
     * @param q
     * @returns MonstersResponse Successful Response
     * @throws ApiError
     */
    public static getManyById(
        q?: string,
    ): CancelablePromise<MonstersResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/monster/get-many/',
            query: {
                'q': q,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Team Builder Query
     * @param q
     * @returns MonsterWithEvosResponse Successful Response
     * @throws ApiError
     */
    public static teamBuilderQuery(
        q?: string,
    ): CancelablePromise<MonsterWithEvosResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/monster/team-builder/',
            query: {
                'q': q,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
