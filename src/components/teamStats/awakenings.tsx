import { css } from "@emotion/css";

import { AwakeningImage } from "../../model/images";
import { monsterCacheClient } from "../../model/monsterCacheClient";
import { getTeamSlots, TeamSlotState, TeamState } from "../../model/teamStateManager";
import { AwokenSkills } from "../../model/types/monster";
import { FlexCol, FlexRowC, H3 } from "../../stylePrimitives";
import { GameConfig } from "../gameConfigSelector";

export type AwakeningHistogram = { [key: string]: number };

export async function computeTotalAwakeningsFromSlots(slots: TeamSlotState[]) {
  const totalAwakenings = [];
  for (const slot of slots) {
    const m1b = await monsterCacheClient.get(slot.base.id);
    const m1b_contrib = m1b?.awakenings.filter((a) => !a.is_super).map((a) => a.awoken_skill_id);
    if (m1b_contrib) {
      totalAwakenings.push(...m1b_contrib);
    }
    if (slot.base.sa) {
      totalAwakenings.push(slot.base.sa);
    }

    const m1a = await monsterCacheClient.get(slot.assist.id);
    const m1a_contrib = m1a?.awakenings.map((a) => a.awoken_skill_id);
    if (m1a_contrib && m1a_contrib.includes(AwokenSkills.EQUIP)) {
      totalAwakenings.push(...m1a_contrib);
    }
  }

  const histogram = totalAwakenings.reduce((acc: AwakeningHistogram, val: number) => {
    if (!acc[val]) {
      acc[val] = 0;
    }
    acc[val]++;
    return acc;
  }, {});

  return histogram;
}

export async function computeTotalAwakenings(gameConfig: GameConfig, teamState: TeamState, playerId: keyof TeamState) {
  const slots = getTeamSlots(gameConfig, teamState, playerId);
  return computeTotalAwakeningsFromSlots(slots);
}

export class AwokenSkillAggregation {
  awokenSkill: AwokenSkills;
  aggFunc: ((h: AwakeningHistogram) => number) | null;
  percent: boolean;

  constructor(a: AwokenSkills, agg: ((h: AwakeningHistogram) => number) | null, percent: boolean = false) {
    this.awokenSkill = a;
    this.aggFunc = agg;
    this.percent = percent;
  }
}

function totalDoubleAwakening(one: string, two: string) {
  return (h: AwakeningHistogram) => {
    const k1 = AwokenSkills[one as any];
    const k2 = AwokenSkills[two as any];
    return h[k1] ?? 0 + 2 * (h[k2] ?? 0);
  };
}

function totalResist(resist: string) {
  return (h: AwakeningHistogram) => {
    const name = `${resist}RES` as keyof AwokenSkills;
    const namePlus = `UN${resist}ABLE` as keyof AwokenSkills;

    const k1 = AwokenSkills[name as any];
    const k2 = AwokenSkills[namePlus as any];
    const total = 20 * (h[k1] ?? 0) + 100 * (h[k2] ?? 0);
    return total < 100 ? total : 100;
  };
}

export const AwakeningsToDisplay = [
  {
    header: "Static",
    data: [
      [
        new AwokenSkillAggregation(AwokenSkills.SKILLBOOST, totalDoubleAwakening("SKILLBOOST", "SKILLBOOSTPLUS")),
        new AwokenSkillAggregation(AwokenSkills.SKILLBINDRES, null),
        new AwokenSkillAggregation(AwokenSkills.EXTMOVE, totalDoubleAwakening("EXTMOVE", "EXTMOVEPLUS")),
        new AwokenSkillAggregation(AwokenSkills.ENHTEAMHP, null),
        new AwokenSkillAggregation(AwokenSkills.ENHTEAMRCV, null)
      ]
    ]
  },
  {
    header: "Offensive",
    data: [
      [
        new AwokenSkillAggregation(AwokenSkills.REDROW, null),
        new AwokenSkillAggregation(AwokenSkills.BLUEROW, null),
        new AwokenSkillAggregation(AwokenSkills.GREENROW, null),
        new AwokenSkillAggregation(AwokenSkills.LIGHTROW, null),
        new AwokenSkillAggregation(AwokenSkills.DARKROW, null),
        new AwokenSkillAggregation(AwokenSkills.ENHANCEDRED, totalDoubleAwakening("ENHANCEDRED", "ENHANCEDREDPLUS")),
        new AwokenSkillAggregation(AwokenSkills.ENHANCEDBLUE, totalDoubleAwakening("ENHANCEDBLUE", "ENHANCEDBLUEPLUS")),
        new AwokenSkillAggregation(
          AwokenSkills.ENHANCEDGREEN,
          totalDoubleAwakening("ENHANCEDGREEN", "ENHANCEDGREENPLUS")
        ),
        new AwokenSkillAggregation(
          AwokenSkills.ENHANCEDLIGHT,
          totalDoubleAwakening("ENHANCEDLIGHT", "ENHANCEDLIGHTPLUS")
        ),
        new AwokenSkillAggregation(AwokenSkills.ENHANCEDDARK, totalDoubleAwakening("ENHANCEDDARK", "ENHANCEDDARKPLUS")),
        new AwokenSkillAggregation(AwokenSkills.REDCOMBOCOUNT, null),
        new AwokenSkillAggregation(AwokenSkills.BLUECOMBOCOUNT, null),
        new AwokenSkillAggregation(AwokenSkills.GREENCOMBOCOUNT, null),
        new AwokenSkillAggregation(AwokenSkills.LIGHTCOMBOCOUNT, null),
        new AwokenSkillAggregation(AwokenSkills.DARKCOMBOCOUNT, null)
      ],
      [
        new AwokenSkillAggregation(AwokenSkills.ENHCOMBO7C, null),
        new AwokenSkillAggregation(AwokenSkills.ENHCOMBO10C, null),
        new AwokenSkillAggregation(AwokenSkills.VDP, null),
        new AwokenSkillAggregation(AwokenSkills.ATTR3BOOST, null),
        new AwokenSkillAggregation(AwokenSkills.ATTR4BOOST, null),
        new AwokenSkillAggregation(AwokenSkills.ATTR5BOOST, null),
        new AwokenSkillAggregation(AwokenSkills.HP80ORMORE, null),
        new AwokenSkillAggregation(AwokenSkills.HP50ORLESS, null)
      ],
      [
        new AwokenSkillAggregation(AwokenSkills.COMBOORB, null),
        new AwokenSkillAggregation(AwokenSkills.TPA, totalDoubleAwakening("TPA", "TPAPLUS")),
        new AwokenSkillAggregation(AwokenSkills.ELATTACK, null),
        new AwokenSkillAggregation(AwokenSkills.CROSSATTACK, null),
        new AwokenSkillAggregation(AwokenSkills.BLOBBOOST, null)
      ]
    ]
  },
  {
    header: "Resist",
    data: [
      [
        new AwokenSkillAggregation(AwokenSkills.POISONRES, totalResist("POISON"), true),
        new AwokenSkillAggregation(AwokenSkills.BLINDRES, totalResist("BLIND"), true),
        new AwokenSkillAggregation(AwokenSkills.JAMMERRES, totalResist("JAMM"), true),
        new AwokenSkillAggregation(AwokenSkills.CLOUDRESIST, null),
        new AwokenSkillAggregation(AwokenSkills.TAPERESIST, null)
      ]
    ]
  },
  {
    header: "Utility",
    data: [
      [
        new AwokenSkillAggregation(AwokenSkills.ELATTACK, null),
        new AwokenSkillAggregation(AwokenSkills.ELSHIELD, null),
        new AwokenSkillAggregation(AwokenSkills.CROSSATTACK, null),
        new AwokenSkillAggregation(AwokenSkills.DUNGEONBONUS, null),
        new AwokenSkillAggregation(AwokenSkills.FUA, null),
        new AwokenSkillAggregation(AwokenSkills.SUPERFUA, null),
        new AwokenSkillAggregation(AwokenSkills.BINDRECOVERY, null),
        new AwokenSkillAggregation(AwokenSkills.GUARDBREAK, null)
      ]
    ]
  }
];

export const AwakeningRowDisplay = ({
  ah,
  asa,
  keyPrefix
}: {
  ah: AwakeningHistogram;
  asa: AwokenSkillAggregation[];
  keyPrefix: string;
}) => {
  return (
    <>
      {asa.map((b, i) => {
        var numToDisplay = b.aggFunc ? b.aggFunc(ah) : ah[b.awokenSkill];
        return numToDisplay ? (
          <FlexRowC gap="0.15rem" key={keyPrefix + numToDisplay + i}>
            <AwakeningImage awakeningId={b.awokenSkill} />
            {b.percent ? ":" : "ⅹ"}
            <span>
              {numToDisplay}
              {b.percent ? "%" : ""}
            </span>
          </FlexRowC>
        ) : null;
      })}
    </>
  );
};

export const AwakeningStatsDisplay = ({
  awakenings,
  keyPrefix
}: {
  awakenings?: AwakeningHistogram;
  keyPrefix: string;
}) => {
  if (!awakenings) {
    return <></>;
  }

  const ah = awakenings;
  return (
    <FlexCol
      className={css`
        width: 100%;
      `}
    >
      <FlexCol gap="0.75rem">
        <H3>Awakenings</H3>
        {AwakeningsToDisplay.map((a, j) => {
          const data = a.data;
          return (
            <FlexCol key={`${keyPrefix}awakenings${j}`}>
              <b>{a.header}</b>
              <FlexCol gap="0.35rem">
                {data.map((b, i) => {
                  return (
                    <FlexRowC gap="1rem" key={`${keyPrefix}awakenings${j}-${i}`}>
                      <AwakeningRowDisplay ah={ah} asa={b} keyPrefix={keyPrefix} />
                    </FlexRowC>
                  );
                })}
              </FlexCol>
            </FlexCol>
          );
        })}
      </FlexCol>

      {/* {Object.entries(awakenings).map(([idStr, count]) => {
        const id = parseInt(idStr);
        const awoName = AwokenSkills[id];

        return (
          <FlexRowC>
            <AwakeningImage awakeningId={id} />
            <span>{id}</span>
            <span>: {count}</span>
          </FlexRowC>
        );
      })} */}
    </FlexCol>
  );
};
