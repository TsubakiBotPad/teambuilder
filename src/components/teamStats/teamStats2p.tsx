import { css } from "@emotion/css";
import styled from "@emotion/styled";

import { AwakeningImage } from "../../model/images";
import { PadAssetImage } from "../../model/padAssets";
import { Attribute, AwokenSkills, MonsterType } from "../../model/types/monster";
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

type AttrImgProps = {
  selected: boolean;
};

const AttrImg = styled.img<AttrImgProps>`
  width: 20px;
  opacity: ${(props) => (props.selected ? "1" : "0.25")};
  border: ${(props) => (props.selected ? "1px solid gray" : "0")};
  border-radius: ${(props) => (props.selected ? "1000px" : "0")};
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

export const TeamBasicStatsDisplay2P2 = ({
  sbs,
  tbs1,
  tbs2,
  tt1,
  tt2,
  unbindablePct1,
  unbindablePct2,
  ah1,
  ah2,
  keyP,
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
    <div
      className={css`
        padding: 0 1rem;
      `}
    >
      <FlexCol
        gap={"0.5rem"}
        className={css`
          margin: 0.5rem 0;
        `}
      >
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
            <tr>
              <TD>
                <b>P1 RCV</b>
              </TD>
              <TD>{fixedDecimals(tbs1?.rcv, 0)}</TD>
              <TD>{fixedDecimals(tbs1?.rcvNoAwo, 0)}</TD>
            </tr>
            <tr>
              <TD>
                <b>P2 RCV</b>
              </TD>
              <TD>{fixedDecimals(tbs2.rcv, 0)}</TD>
              <TD>{fixedDecimals(tbs2.rcvNoAwo, 0)}</TD>
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            {tt1 ? (
              <tr>
                <TD>
                  <b>P1 Types</b>
                </TD>
                <TD>
                  <FlexRow>
                    {tt1.map((a, i) => {
                      return (
                        <PadAssetImage
                          assetName={`${MonsterType[a].toLocaleLowerCase().substring(0, 3)}t`}
                          height={25}
                          key={keyP + "P1Types" + i}
                        />
                      );
                    })}
                  </FlexRow>
                </TD>
              </tr>
            ) : (
              <></>
            )}
            {tt2 ? (
              <tr>
                <TD>
                  <b>P2 Types</b>
                </TD>
                <TD>
                  <FlexRow>
                    {tt2.map((a, i) => {
                      return (
                        <PadAssetImage
                          assetName={`${MonsterType[a].toLocaleLowerCase().substring(0, 3)}t`}
                          height={25}
                          key={keyP + "P2Types" + i}
                        />
                      );
                    })}
                  </FlexRow>
                </TD>
              </tr>
            ) : (
              <></>
            )}

            {ah1 ? (
              <tr>
                <TD>
                  <b>P1 Attr</b>
                </TD>
                <TD>
                  <FlexRow gap={"0.25rem"}>
                    {Object.entries(ah1).map((a, i) => {
                      const attr = Attribute[a[0] as keyof {}].toLocaleLowerCase();
                      return (
                        <span key={keyP + attr + i + "P1"}>
                          <AttrImg src={`img/orb${attr}.webp`} selected={a[1]} />
                        </span>
                      );
                    })}
                  </FlexRow>
                </TD>
              </tr>
            ) : (
              <></>
            )}

            {ah2 ? (
              <tr>
                <TD>
                  <b>P2 Attr</b>
                </TD>
                <TD>
                  <FlexRow gap={"0.25rem"}>
                    {Object.entries(ah2).map((a, i) => {
                      const attr = Attribute[a[0] as keyof {}].toLocaleLowerCase();
                      return (
                        <span key={keyP + attr + i + "P2"}>
                          <AttrImg src={`img/orb${attr}.webp`} selected={a[1]} />
                        </span>
                      );
                    })}
                  </FlexRow>
                </TD>
              </tr>
            ) : (
              <></>
            )}

            {unbindablePct1 !== undefined ? (
              <tr>
                <TD>
                  <b>P1 !Bind</b>
                </TD>
                <td>{fixedDecimals(unbindablePct1, 0)}%</td>
              </tr>
            ) : (
              <></>
            )}

            {unbindablePct2 !== undefined ? (
              <tr>
                <TD>
                  <b>P2 !Bind</b>
                </TD>
                <td>{fixedDecimals(unbindablePct2, 0)}%</td>
              </tr>
            ) : (
              <></>
            )}
          </tbody>
        </table>
      </FlexCol>
    </div>
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
