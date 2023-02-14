import { AxiosError } from "axios";
import { debounce } from "lodash";
import { useContext, useMemo, useRef, useState } from "react";
import { IoIosCheckmarkCircle, IoIosRemoveCircle } from "react-icons/io";
import Modal from "react-modal";

import { ApiError, MonsterResponse } from "../../client";
import { iStr } from "../../i18n/i18n";
import { BASE_ICON_URL } from "../../model/images";
import { monsterCacheClient } from "../../model/monsterCacheClient";
import { AppStateContext, setCard, TeamCardInfo, TeamSlotState, TeamStateContext } from "../../model/teamStateManager";
import { FlexCol, FlexColC, FlexRowC, H2 } from "../../stylePrimitives";
import { GameConfig } from "../gameConfigSelector";
import { ConfirmButton, RemoveButton } from "../generic/confirmButton";
import { leftPad } from "../generic/leftPad";
import { CardInfo } from "./cardInfo";
import { ModalCloseButton } from "./common";
import { BsDot } from "react-icons/bs";
import clsx from "clsx";

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
      <FlexRowC className="gap-1">
        {ids.map((id) => (
          <img
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
            className={clsx(
              "w-12 rounded-sm cursor-pointer",
              selectedMonster && selectedMonster.monster_id === id
                ? "opacity-1 border border-solid border-black"
                : "opacity-80 border-0"
            )}
            alt={selectedMonster ? selectedMonster.name_en : ""}
          />
        ))}
      </FlexRowC>
    </FlexColC>
  );
};

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
      className="border-0 absolute left-[5vw] sm:left-[25vw] top-[10vh] focus-visible:outline-none"
      overlayClassName="fixed inset-0 bg-black/40"
      ariaHideApp={false}
    >
      <div className="min-w-[75vw] max-w-[90vw] sm:min-w-[50vw] sm:max-w-[50vw]">
        <ModalCloseButton hoverClose={hoverClose} setHoverClose={setHoverClose} setModalOpen={setModalIsOpen} />
        <div className="bg-slate-50 p-4 rounded shadow-sm shadow-slate-50">
          <FlexCol className="gap-2">
            <H2>
              <FlexRowC>
                {cardSlotSelected.teamId}
                <BsDot />
                {iStr(cardSlotSelected.slotId, language)}
                <BsDot />
                {iStr(cardSlotSelected.use, language)}
              </FlexRowC>
            </H2>
            <FlexColC className="gap-2">
              <input
                className="border border-solid border-slate-500 rounded-sm text-base p-2 text-center w-[95%]"
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
              <FlexRowC className="gap-4">
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

            <FlexCol className="gap-4 p-4 shadow-sm shadow-slate-400 border border-solid border-black rounded">
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
      </div>
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
