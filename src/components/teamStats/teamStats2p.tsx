import { css } from "@emotion/css";
import styled from "@emotion/styled";

import { AwakeningImage } from "../../model/images";
import { AwokenSkills } from "../../model/types/monster";
import { FlexCol, FlexColC, FlexRow } from "../../stylePrimitives";
import { fixedDecimals } from "../generic/fixedDecimals";
import { AttributeHistogram } from "./attributes";
import { AwakeningHistogram, AwakeningRowDisplay, AwakeningsToDisplay2PShared } from "./awakenings";
import { TeamBasicStats } from "./basicStats";
import { TeamTypes } from "./types";

const TD = styled.td`
  padding: 0 1rem 0 0;
  vertical-align: middle;
  text-align: right;
`;

const TH = styled.th`
  padding: 0rem 0rem;
  vertical-align: middle;
  text-align: center;
`;

export const TeamSharedStatsDisplay = ({
  sbs,
  tbs1,
  tbs2,
  sAwo
}: {
  sbs?: TeamBasicStats;
  tbs1?: TeamBasicStats;
  tbs2?: TeamBasicStats;
  tt1?: TeamTypes;
  tt2?: TeamTypes;
  unbindablePct1?: number;
  unbindablePct2?: number;
  ah1?: AttributeHistogram;
  ah2?: AttributeHistogram;
  keyP: string;
  sAwo?: AwakeningHistogram;
}) => {
  if (!sbs || !tbs1 || !tbs2) {
    return <></>;
  }

  return (
    <FlexColC
      className={css`
        padding: 0.5rem;
      `}
    >
      <div>
        <table>
          <thead>
            <tr>
              <th></th>
              <TH>
                <FlexRow justifyContent="flex-end" style={{ paddingRight: "1rem" }}>
                  <AwakeningImage awakeningId={AwokenSkills.AWOKENKILLER} width={23} />
                </FlexRow>
              </TH>
              <TH>
                <FlexRow justifyContent="flex-end" style={{ paddingRight: "1rem" }}>
                  <div
                    className={css`
                      background: url("img/awoBind.webp") no-repeat;
                      background-size: contain;
                      height: 20px;
                      width: 20px;
                    `}
                  />
                </FlexRow>
              </TH>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TD>
                <b>HP</b>
              </TD>
              <TD>{fixedDecimals(sbs.hp, 0)}</TD>
              <TD>{fixedDecimals(sbs.hpNoAwo, 0)}</TD>
            </tr>
            <tr>
              <TD>
                <b>eHP</b>
              </TD>
              <TD>{fixedDecimals(sbs.ehp, 0)}</TD>
              <TD>{fixedDecimals(sbs.ehpNoAwo, 0)}</TD>
            </tr>
          </tbody>
        </table>
      </div>
      <AwakeningStatsDisplay2P awakenings={sAwo} keyPrefix={"shared"} />
    </FlexColC>
  );
};

export const AwakeningStatsDisplay2P = ({
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
    <FlexColC
      className={css`
        padding: 0 1rem;
      `}
    >
      <FlexCol
        gap="0.75rem"
        className={css`
          margin: 0.5rem 0;
        `}
      >
        <FlexRow>
          {AwakeningsToDisplay2PShared.map((a, j) => {
            const data = a.data;
            return (
              <FlexCol
                className={css`
                  padding: 0 0.5rem;
                `}
              >
                <FlexRow className={css``} gap="0.5rem" key={`${keyPrefix}awakenings${j}`}>
                  {data.map((b, i) => {
                    return <AwakeningRowDisplay ah={ah} asa={b} keyPrefix={keyPrefix} />;
                  })}
                </FlexRow>
              </FlexCol>
            );
          })}
        </FlexRow>
      </FlexCol>
    </FlexColC>
  );
};
