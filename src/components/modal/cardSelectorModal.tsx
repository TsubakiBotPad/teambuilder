import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { AxiosError } from "axios";
import { debounce } from "lodash";
import { useContext, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Modal from "react-modal";

import { breakpoint } from "../../breakpoints";
import { ApiError, MonsterResponse } from "../../client";
import { BASE_ICON_URL } from "../../model/images";
import { monsterCacheClient } from "../../model/monsterCacheClient";
import { AppStateContext, setCard, TeamStateContext } from "../../model/teamStateManager";
import { BoundingBox, FlexCol, FlexColC, FlexRowC, H2 } from "../../stylePrimitives";
import { ConfirmButton } from "../generic/confirmButton";
import { leftPad } from "../generic/leftPad";
import { CardInfo } from "./cardInfo";
import { ModalCloseButton } from "./common";

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
  setSelectedMonster: React.Dispatch<React.SetStateAction<MonsterResponse | undefined>>,
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

const AlternateEvoImages = ({
  ids,
  selectedMonster,
  setSelectedMonster
}: {
  ids: number[];
  selectedMonster: MonsterResponse | undefined;
  setSelectedMonster: React.Dispatch<React.SetStateAction<MonsterResponse | undefined>>;
}) => {
  const { cardSlotSelected, setModalIsOpen, gameConfig } = useContext(AppStateContext);
  const { teamState, setTeamState } = useContext(TeamStateContext);

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
            onDoubleClick={() => {
              setCard(cardSlotSelected, selectedMonster!.monster_id, teamState, setTeamState, gameConfig);
              setModalIsOpen(false);
            }}
            selected={selectedMonster ? id === selectedMonster.monster_id : false}
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

const f = async (e: any, setQueriedId: any, setAltEvoIds: any, setSelectedMonster: any, setError: any) => {
  e.preventDefault();
  await handleInputChange(e.target.value, setQueriedId, setAltEvoIds, setSelectedMonster, setError);
};

const debouncedOnChange = debounce(f, 300);

export const CardSelectorModal = ({ isOpen }: { isOpen: boolean }) => {
  const { setModalIsOpen, cardSlotSelected, gameConfig } = useContext(AppStateContext);
  const { teamState, setTeamState } = useContext(TeamStateContext);

  const [, setQueriedId] = useState(0);
  const [altEvoIds, setAltEvoIds] = useState([] as number[]);
  const [error, setError] = useState("");
  const [selectedMonster, setSelectedMonster] = useState<MonsterResponse | undefined>(undefined);
  const [hoverClose, setHoverClose] = useState(false);

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
      <BoundingBox minWidth="50vw" maxWidth="50vw" minWidthM="75vw" maxWidthM="90vw">
        <ModalCloseButton hoverClose={hoverClose} setHoverClose={setHoverClose} setModalOpen={setModalIsOpen} />
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
                onChange={async (e) => {
                  debouncedOnChange(e, setQueriedId, setAltEvoIds, setSelectedMonster, setError);
                }}
              />

              {error ? <span>{error}</span> : <></>}
              {!error ? (
                <AlternateEvoImages
                  ids={altEvoIds}
                  selectedMonster={selectedMonster}
                  setSelectedMonster={setSelectedMonster}
                />
              ) : (
                <></>
              )}
            </FlexColC>

            <FlexColC>
              <FlexRowC gap="0.25rem">
                <ConfirmButton
                  onClick={() => {
                    setCard(cardSlotSelected, selectedMonster!.monster_id, teamState, setTeamState, gameConfig);
                    setModalIsOpen(false);
                  }}
                >
                  Use Card
                </ConfirmButton>
                <ConfirmButton
                  onClick={() => {
                    setCard(cardSlotSelected, 0, teamState, setTeamState, gameConfig);
                    setModalIsOpen(false);
                  }}
                >
                  Remove
                </ConfirmButton>
              </FlexRowC>
            </FlexColC>

            <FlexCol
              gap="1rem"
              className={css`
                border: 1px solid black;
                padding: 1rem;
                box-shadow: 2px 2px #888888;
              `}
            >
              {selectedMonster ? <CardInfo monster={selectedMonster} /> : <FlexColC>Monster Details</FlexColC>}
            </FlexCol>
          </FlexCol>
        </div>
      </BoundingBox>
    </Modal>
  );
};
