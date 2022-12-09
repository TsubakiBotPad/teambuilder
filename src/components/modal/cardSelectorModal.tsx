import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { AxiosError } from "axios";
import { debounce } from "lodash";
import { useState } from "react";
import Modal from "react-modal";

import { ApiError, MonsterResponse } from "../../client";
import { AwakeningImage, BASE_ICON_URL } from "../../model/images";
import m from "../../model/monster.json";
import {
  MonsterCacheClient,
  monsterCacheClient,
} from "../../model/monsterCacheClient";
import { setCard, TeamState } from "../../model/teamStateManager";
import { getKillers, MonsterType } from "../../model/types/monster";
import {
  BoundingBox,
  FlexCol,
  FlexColC,
  FlexRow,
  FlexRowC,
  H2,
  H3,
  Page,
  PageBox,
} from "../../stylePrimitives";
import { CardInfo } from "./cardInfo";
import { leftPad } from "../generic/leftPad";
import { breakpoint } from "../../breakpoints";

const ChooseCard = styled.button`
  border: 1px solid black;
  padding: 0.25rem 0.5rem;
  background-color: #eee;
`;

const CardQueryInput = styled.input`
  border: 1px solid gray;
  border-radius: 2px;
  font-size: 1rem;
  padding: 0.5rem 0.5rem;
  text-align: center;
  width: 95%;
`;

const handleInputChange = async (
  query: string,
  setQueriedId: React.Dispatch<React.SetStateAction<number>>,
  setAlternateEvoIds: React.Dispatch<React.SetStateAction<number[]>>,
  setSelectedMonster: React.Dispatch<
    React.SetStateAction<MonsterResponse | null>
  >,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    if (query.length > 0) {
      const ret = await monsterCacheClient.teamBuilderQuery(query);
      setQueriedId(ret.monster.monster_id);
      setAlternateEvoIds(ret.evolutions.map((a) => a.monster_id));
      setSelectedMonster(ret.monster);
      setError("");
    }
  } catch (e) {
    if (e instanceof ApiError) {
      setError(e.body.detail.error);
      return;
    } else if (e instanceof AxiosError) {
      console.error(e);
    }
    throw e;
  }
};

type AltEvoimgProps = {
  selected: boolean;
};

const AltEvoImg = styled.img<AltEvoimgProps>`
  border: ${(props) => (props.selected ? "1px solid black" : "0")};
  width: 3rem;
  opacity: ${(props) => (props.selected ? "1" : "0.8")};
`;

export const AlternateEvoImages = ({
  ids,
  queriedId,
  selectedMonster,
  setSelectedMonster,
}: {
  ids: number[];
  queriedId: number;
  selectedMonster: MonsterResponse | null;
  setSelectedMonster: React.Dispatch<
    React.SetStateAction<MonsterResponse | null>
  >;
}) => {
  return (
    <FlexColC>
      <FlexRowC gap="0.25rem">
        {ids.map((id) => (
          <AltEvoImg
            key={id}
            src={`${BASE_ICON_URL}${leftPad(id, 5)}.png`}
            onClick={async (e) => {
              const monster = await monsterCacheClient.get(id);
              setSelectedMonster(monster);
            }}
            selected={
              selectedMonster ? id === selectedMonster.monster_id : false
            }
          />
        ))}
      </FlexRowC>
    </FlexColC>
  );
};

const modalClassName = css`
  border: 0;
  position: absolute;
  left: 25vw;
  top: 10vh;

  @media ${breakpoint.xs} {
    left: 5vw;
  }

  &:focus-visible {
    outline: 0;
  }
`;

const overlayClassName = css`
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  inset: 0;
`;

export const CardSelectorModal = ({
  isOpen,
  setModalIsOpen,
  cardSlotSelected,
  teamState,
  setTeamState,
}: {
  isOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cardSlotSelected: string;
  teamState: TeamState;
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>;
}) => {
  const [queriedId, setQueriedId] = useState(0);
  const [altEvoIds, setAltEvoIds] = useState([] as number[]);
  const [error, setError] = useState("");
  const [selectedMonster, setSelectedMonster] =
    useState<MonsterResponse | null>(null);

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Example Modal"
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => {
        setModalIsOpen(false);
      }}
      className={modalClassName}
      overlayClassName={overlayClassName}
      ariaHideApp={false}
    >
      <BoundingBox
        minWidth="50vw"
        maxWidth="50vw"
        minWidthM="75vw"
        maxWidthM="90vw"
      >
        <div
          className={css`
            background-color: #fefefe;
            padding: 1rem;
          `}
        >
          <FlexCol gap="0.5rem">
            <H2>{cardSlotSelected}</H2>
            <FlexColC gap="0.5rem">
              <CardQueryInput
                type="text"
                placeholder="Search id/name/query"
                onChange={debounce(async (e) => {
                  e.preventDefault();
                  await handleInputChange(
                    e.target.value,
                    setQueriedId,
                    setAltEvoIds,
                    setSelectedMonster,
                    setError
                  );
                }, 200)}
              />

              {error ? <span>{error}</span> : <></>}
              {!error ? (
                <AlternateEvoImages
                  ids={altEvoIds}
                  queriedId={queriedId}
                  selectedMonster={selectedMonster}
                  setSelectedMonster={setSelectedMonster}
                />
              ) : (
                <></>
              )}
            </FlexColC>

            <FlexColC>
              <ChooseCard
                onClick={() => {
                  setCard(
                    cardSlotSelected,
                    selectedMonster!.monster_id,
                    teamState,
                    setTeamState
                  );
                  setModalIsOpen(false);
                }}
              >
                Use Card
              </ChooseCard>
            </FlexColC>

            <FlexCol
              gap="1rem"
              className={css`
                border: 1px solid black;
                padding: 1rem;
                box-shadow: 2px 2px #888888;
              `}
            >
              {selectedMonster ? (
                <CardInfo monster={selectedMonster} />
              ) : (
                <FlexColC>Monster Details</FlexColC>
              )}
            </FlexCol>
          </FlexCol>
        </div>
      </BoundingBox>
    </Modal>
  );
};
