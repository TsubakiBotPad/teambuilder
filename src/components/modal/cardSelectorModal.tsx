import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { AxiosError } from "axios";
import { debounce } from "lodash";
import { useContext, useMemo, useRef, useState } from "react";
import { IoIosCheckmarkCircle, IoIosRemoveCircle } from "react-icons/io";
import Modal from "react-modal";

import { breakpoint } from "../../breakpoints";
import { ApiError, MonsterResponse } from "../../client";
import { iStr } from "../../i18n/i18n";
import { BASE_ICON_URL } from "../../model/images";
import { monsterCacheClient } from "../../model/monsterCacheClient";
import { AppStateContext, setCard, TeamCardInfo, TeamSlotState, TeamStateContext } from "../../model/teamStateManager";
import { BoundingBox, FlexCol, FlexColC, FlexRowC, H2 } from "../../stylePrimitives";
import { GameConfig } from "../gameConfigSelector";
import { ConfirmButton, RemoveButton } from "../generic/confirmButton";
import { leftPad } from "../generic/leftPad";
import { CardInfo } from "./cardInfo";
import { ModalCloseButton } from "./common";
import { BsDot } from "react-icons/bs";

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
  setError: React.Dispatch<React.SetStateAction<string>>,
  gameConfig: GameConfig,
  setCurrentLevel: React.Dispatch<React.SetStateAction<number | undefined>>
) => {
  try {
    if (query.length > 0) {
      const ret = await monsterCacheClient.teamBuilderQuery(query);
      setQueriedId(ret.monster.monster_id);
      setAlternateEvoIds(ret.evolutions.map((a) => a.monster_id));
      setSelectedMonster(ret.monster);
      setError("");

      const level = ret.monster.limit_mult !== 0 ? gameConfig.defaultCardLevel : ret.monster.level;
      setCurrentLevel(level);
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
  setSelectedMonster,
  setCurrentLevel,
  setCurrentSA
}: {
  ids: number[];
  selectedMonster: MonsterResponse | undefined;
  setSelectedMonster: React.Dispatch<React.SetStateAction<MonsterResponse | undefined>>;
  setCurrentLevel: React.Dispatch<React.SetStateAction<number | undefined>>;
  setCurrentSA: React.Dispatch<React.SetStateAction<number | undefined>>;
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
              setCardLevelForNewCard(gameConfig, monster, setCurrentLevel);
              setCurrentSA(undefined);
            }}
            onDoubleClick={() => {
              setCard(
                cardSlotSelected,
                { id: selectedMonster!.monster_id, level: gameConfig.defaultCardLevel, sa: 0 },
                teamState,
                setTeamState,
                gameConfig
              );
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
  z-index: 100;
`;

const f = async (
  e: any,
  setQueriedId: any,
  setAltEvoIds: any,
  setSelectedMonster: any,
  setError: any,
  gameConfig: any,
  setCurrentLevel: any
) => {
  e.preventDefault();
  await handleInputChange(
    e.target.value,
    setQueriedId,
    setAltEvoIds,
    setSelectedMonster,
    setError,
    gameConfig,
    setCurrentLevel
  );
};

const debouncedOnChange = debounce(f, 300);

export const CardSelectorModal = ({ isOpen }: { isOpen: boolean }) => {
  const { setModalIsOpen, cardSlotSelected, gameConfig, language } = useContext(AppStateContext);
  const { teamState, setTeamState } = useContext(TeamStateContext);

  const [, setQueriedId] = useState(0);
  const [altEvoIds, setAltEvoIds] = useState([] as number[]);
  const [error, setError] = useState("");
  const [selectedMonster, setSelectedMonster] = useState<MonsterResponse | undefined>(undefined);
  const [hoverClose, setHoverClose] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<number | undefined>(undefined);
  const [currentSA, setCurrentSA] = useState<number | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  useMemo(() => {
    const f = async () => {
      if (!cardSlotSelected || !cardSlotSelected.teamId || !cardSlotSelected.slotId) {
        return;
      }

      const monster = teamState[cardSlotSelected.teamId!][cardSlotSelected.slotId!] as TeamSlotState;
      const card = monster[cardSlotSelected.use!] as TeamCardInfo;
      const m = await monsterCacheClient.get(card.id);

      setSelectedMonster(m);
      setCurrentLevel(card.level);
      setCurrentSA(card.sa);
    };
    f();
  }, [teamState, cardSlotSelected]);

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Example Modal"
      shouldCloseOnOverlayClick={true}
      onAfterOpen={() => {
        setCardLevelForExistingCard(gameConfig, selectedMonster, currentLevel, setCurrentLevel);
        if (inputRef && inputRef.current) {
          inputRef.current.focus();
        }
      }}
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
            <H2>
              <FlexRowC>
                {cardSlotSelected.teamId}
                <BsDot />
                {iStr(cardSlotSelected.slotId, language)}
                <BsDot />
                {iStr(cardSlotSelected.use, language)}
              </FlexRowC>
            </H2>
            <FlexColC gap="0.5rem">
              <CardQueryInput
                ref={inputRef}
                type="text"
                placeholder={iStr("search", language)}
                onChange={async (e) => {
                  debouncedOnChange(
                    e,
                    setQueriedId,
                    setAltEvoIds,
                    setSelectedMonster,
                    setError,
                    gameConfig,
                    setCurrentLevel
                  );
                }}
              />
              <AlternateEvoImages
                ids={altEvoIds}
                selectedMonster={selectedMonster}
                setSelectedMonster={setSelectedMonster}
                setCurrentLevel={setCurrentLevel}
                setCurrentSA={setCurrentSA}
              />
              {error ? <span>{error}</span> : null}
            </FlexColC>

            <FlexColC>
              <FlexRowC gap="1rem">
                <ConfirmButton
                  onClick={() => {
                    var cardInfo = selectedMonster
                      ? {
                          id: selectedMonster!.monster_id,
                          level: currentLevel ?? 99,
                          sa: currentSA
                        }
                      : { id: 0, level: 0, sa: 0 };
                    setCard(cardSlotSelected, cardInfo, teamState, setTeamState, gameConfig);
                    setModalIsOpen(false);
                  }}
                >
                  <IoIosCheckmarkCircle /> {iStr("confirm", language)}
                </ConfirmButton>
                <RemoveButton
                  onClick={() => {
                    setSelectedMonster(undefined);
                    setCard(cardSlotSelected, { id: 0, level: 0, sa: 0 }, teamState, setTeamState, gameConfig);
                    setModalIsOpen(false);
                  }}
                >
                  <IoIosRemoveCircle /> {iStr("clear", language)}
                </RemoveButton>
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
              {selectedMonster ? (
                <CardInfo
                  monster={selectedMonster}
                  currentSA={currentSA}
                  setCurrentSA={setCurrentSA}
                  currentLevel={currentLevel}
                  setCurrentLevel={setCurrentLevel}
                />
              ) : (
                <FlexColC>{iStr("noCardSelected", language)}</FlexColC>
              )}
            </FlexCol>
          </FlexCol>
        </div>
      </BoundingBox>
    </Modal>
  );
};

function setCardLevelForExistingCard(
  gameConfig: GameConfig,
  monster: MonsterResponse | undefined,
  currentLevel: number | undefined,
  setCurrentLevel: React.Dispatch<React.SetStateAction<number | undefined>>
) {
  var maxCardLevel = 99;
  if (monster) {
    if (monster?.limit_mult !== 0) {
      maxCardLevel = 120;
    } else if (monster.level < 99) {
      maxCardLevel = monster.level;
    }
  }

  const levelToDisplay = Math.min(maxCardLevel, currentLevel ?? maxCardLevel);
  setCurrentLevel(levelToDisplay);
}

function setCardLevelForNewCard(
  gameConfig: GameConfig,
  monster: MonsterResponse | undefined,
  setCurrentLevel: React.Dispatch<React.SetStateAction<number | undefined>>
) {
  var maxCardLevel = 99;
  const desiredCardLevel = gameConfig.defaultCardLevel;
  if (monster) {
    if (monster?.limit_mult !== 0) {
      maxCardLevel = 120;
    } else if (monster.level < 99) {
      maxCardLevel = monster.level;
    }
  }

  const levelToDisplay = Math.min(desiredCardLevel, maxCardLevel);
  setCurrentLevel(levelToDisplay);
}
