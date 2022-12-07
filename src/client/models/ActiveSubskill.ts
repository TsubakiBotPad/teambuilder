/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActivePart } from './ActivePart';

export type ActiveSubskill = {
    active_subskill_id: number;
    name_ja: string;
    name_en: string;
    name_ko: string;
    desc_ja: string;
    desc_en: string;
    desc_ko: string;
    desc_templated_ja: string;
    desc_templated_en: string;
    desc_templated_ko: string;
    board_65: string;
    board_76: string;
    cooldown: number;
    active_parts: Array<ActivePart>;
    name: string;
    desc: string;
    desc_templated: string;
};

