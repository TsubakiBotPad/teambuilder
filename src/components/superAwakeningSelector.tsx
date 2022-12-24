import { css } from "@emotion/css";
import { useState } from "react";

import { MonsterResponse } from "../client";
import { AwakeningImage } from "../model/images";
import { FlexRow, FlexRowC } from "../stylePrimitives";

export const SuperAwakeningSelector = ({
  currentSA,
  selectedMonster,
  setSA
}: {
  currentSA: number | undefined;
  selectedMonster: MonsterResponse | undefined;
  setSA: (l: number) => void;
}) => {
  if (!selectedMonster || selectedMonster.limit_mult === 0) {
    return <></>;
  }

  const superAwakenings = selectedMonster.awakenings.filter((a) => a.is_super);

  return (
    <FlexRowC
      gap="0.25rem"
      className={css`
        font-size: 0.75rem;
        font-weight: 400;
      `}
    >
      <span>SA: </span>
      <FlexRowC>
        {superAwakenings.length > 0 ? (
          <FlexRow gap="0.25rem">
            {superAwakenings.map((a) => (
              <div
                className={css`
                  border: 2px solid ${currentSA === a.awoken_skill_id ? "#555" : "#fff"};
                  box-sizing: border-box;
                  opacity: ${currentSA === a.awoken_skill_id ? "1" : "0.75"};
                `}
                onClick={() => {
                  setSA(a.awoken_skill_id);
                }}
              >
                <AwakeningImage key={a.awoken_skill_id} awakeningId={a.awoken_skill_id} />
              </div>
            ))}
          </FlexRow>
        ) : null}
      </FlexRowC>
    </FlexRowC>
  );
};
