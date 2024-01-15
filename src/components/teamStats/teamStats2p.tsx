import { css } from "@emotion/css";
import styled from "@emotion/styled";

import { FlexCol, FlexColC, FlexRow, FlexRowC } from "../../stylePrimitives";
import { fixedDecimals } from "../generic/fixedDecimals";
import { AttributeHistogram } from "./attributes";
import { AwakeningHistogram, AwakeningRowDisplay, AwakeningsToDisplay2PShared } from "./awakenings";
import { TeamBasicStats } from "./basicStats";
import { TeamTypes } from "./types";
import { iStr } from "../../i18n/i18n";
import { AppStateContext } from "../../model/teamStateManager";
import { useContext } from "react";
import { TeamStat } from "./teamStats";

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

export const TeamSharedStats = ({
  teamStat1,
  teamStat2,
  sharedAwakenings
}: {
  teamStat1: TeamStat | undefined;
  teamStat2: TeamStat | undefined;
  sharedAwakenings?: AwakeningHistogram;
}) => {
  const { language } = useContext(AppStateContext);

  if (!teamStat1 || !teamStat2) {
    return null;
  }

  return (
    <FlexRowC gap="1rem">
      <FlexColC>
        <span>{iStr("shared", language)}</span>
        <div
          className={css`
            border: solid 1px #aaa;
          `}
        >
          <TeamSharedStatsDisplay
            sbs={teamStat1.sharedBasicStats}
            tbs1={teamStat1.teamBasicStats}
            tbs2={teamStat2.teamBasicStats}
            tt1={teamStat1.teamTypes}
            tt2={teamStat2.teamTypes}
            unbindablePct1={teamStat1.teamUnbindablePct}
            unbindablePct2={teamStat2.teamUnbindablePct}
            ah1={teamStat1.attributes}
            ah2={teamStat2.attributes}
            keyP={"p1"}
            sAwo={sharedAwakenings}
          />
        </div>
      </FlexColC>
    </FlexRowC>
  );
};

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
                <div
                  className={css`
                    background: url("img/awo.png") no-repeat;
                    background-size: contain;
                    height: 20px;
                    width: 20px;
                    margin-right: 1rem;
                    float: right;
                    vertical-align: middle;
                  `}
                />
              </TH>
              <TH>
                <div
                  className={css`
                    background: url("img/awoBind.png") no-repeat;
                    background-size: contain;
                    height: 20px;
                    width: 20px;
                    margin-right: 1rem;
                    float: right;
                    vertical-align: middle;
                  `}
                />
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
      <AwakeningStatsDisplay2P awakenings={sAwo} keyPrefix={"shared2p"} />
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
            return (
              <FlexCol
                key={`${keyPrefix}awakenings${j}`}
                className={css`
                  padding: 0 0.5rem;
                `}
              >
                <FlexRow className={css``} gap="0.5rem">
                  <AwakeningRowDisplay ah={ah} asa={a.data} keyPrefix={keyPrefix + a.header + j} />
                </FlexRow>
              </FlexCol>
            );
          })}
        </FlexRow>
      </FlexCol>
    </FlexColC>
  );
};
