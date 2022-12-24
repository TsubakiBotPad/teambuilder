import styled from "@emotion/styled";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate, useParams } from "react-router-dom";
import { DefaultLevelSelector } from "../components/defaultLevelSelector";

import { GameConfigSelector } from "../components/gameConfigSelector";
import { LevelSelector } from "../components/levelSelector";
import { BadgeSelectorModal } from "../components/modal/badgeSelectorModal";
import { CardSelectorModal } from "../components/modal/cardSelectorModal";
import { LatentSelectorModal } from "../components/modal/latentSelectorModal";
import { Team } from "../components/team";
import { computeTeamStat, TeamStatDisplay, TeamStats } from "../components/teamStats/teamStats";
import { ConfigData, deserializeConfig, serializeConfig } from "../model/serializedUri";
import { AppStateContext, DEFAULT_GAME_CONFIG, DEFAULT_TEAM_STATE, TeamStateContext } from "../model/teamStateManager";
import { FlexCol, FlexColC, FlexRow, FlexRowC, H1, Page } from "../stylePrimitives";

const maxPageWidth = "1440px";

const TeamInput = styled.input`
  border: 0;
  font-size: 1.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem 0.25rem 0;
`;

export const DraggableTypes = {
  card: "card",
  latent: "latent",
  slot: "slot"
};

export const PadTeamBuilderPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { config } = params;
  const parsedConfig = config
    ? deserializeConfig(config)
    : {
        n: "",
        ts: DEFAULT_TEAM_STATE,
        gc: DEFAULT_GAME_CONFIG
      };

  const [teamState, setTeamState] = useState(parsedConfig.ts);
  const [teamName, setTeamName] = useState(parsedConfig.n);
  const [gameConfig, setGameConfig] = useState(parsedConfig.gc);

  const [teamStats, setTeamStats] = useState<TeamStats>({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [latentModalIsOpen, setLatentModalIsOpen] = useState(false);
  const [badgeModalIsOpen, setBadgeModalIsOpen] = useState(false);
  const [playerSelected, setPlayerSelected] = useState("");
  const [cardSlotSelected, setCardSlotSelected] = useState({});

  var updateUrl = useRef(
    debounce((config: Partial<ConfigData>) => {
      const finalConfig = {
        n: teamName,
        ts: teamState,
        gc: gameConfig,
        ...config
      };
      navigate("/" + serializeConfig(finalConfig));
    }, 250)
  );

  useEffect(() => {
    updateUrl.current({ n: teamName, ts: teamState, gc: gameConfig });
  }, [teamName, teamState, gameConfig]);

  useMemo(() => {
    const f = async () => {
      setTeamStats({
        p1: await computeTeamStat(teamState, gameConfig, "p1"),
        p2: await computeTeamStat(teamState, gameConfig, "p2"),
        p3: await computeTeamStat(teamState, gameConfig, "p3")
      });
    };
    f();
  }, [teamState, gameConfig]);

  return (
    <DndProvider backend={HTML5Backend}>
      <AppStateContext.Provider
        value={{
          teamName,
          gameConfig,
          setGameConfig,
          teamStats,
          setTeamStats,
          modalIsOpen,
          setModalIsOpen,
          latentModalIsOpen,
          setLatentModalIsOpen,
          badgeModalIsOpen,
          setBadgeModalIsOpen,
          cardSlotSelected,
          setCardSlotSelected,
          playerSelected,
          setPlayerSelected,
          updateUrl: updateUrl.current
        }}
      >
        <TeamStateContext.Provider value={{ teamState, setTeamState }}>
          <Page maxWidth={maxPageWidth}>
            <FlexColC gap="1rem">
              <H1>PAD Team Builder</H1>
              <FlexRowC gap="1rem">
                <GameConfigSelector />
                <DefaultLevelSelector />
              </FlexRowC>
            </FlexColC>
            <CardSelectorModal isOpen={modalIsOpen} />
            <LatentSelectorModal isOpen={latentModalIsOpen} />
            <BadgeSelectorModal isOpen={badgeModalIsOpen} />
            <FlexColC>
              <FlexRow gap="1rem">
                <FlexCol>
                  <TeamInput
                    placeholder="Team Title"
                    size={35}
                    value={teamName}
                    onChange={(e) => {
                      setTeamName(e.target.value);
                    }}
                  />
                  <FlexCol gap="1.5rem">
                    <FlexRow gap="3rem">
                      <Team teamId={"p1"} state={teamState.p1} />
                      <TeamStatDisplay teamStat={teamStats.p1} keyP="p1" />
                    </FlexRow>
                    {gameConfig.mode === "2p" || gameConfig.mode === "3p" ? (
                      <FlexRow gap="3rem">
                        <Team teamId={"p2"} state={teamState.p2} />
                        <TeamStatDisplay teamStat={teamStats.p2} keyP="p2" />
                      </FlexRow>
                    ) : null}
                    {gameConfig.mode === "3p" ? (
                      <FlexRow gap="3rem">
                        <Team teamId={"p3"} state={teamState.p3} />
                        <TeamStatDisplay teamStat={teamStats.p3} keyP="p3" />
                      </FlexRow>
                    ) : null}
                  </FlexCol>
                </FlexCol>
              </FlexRow>
            </FlexColC>
          </Page>
        </TeamStateContext.Provider>
      </AppStateContext.Provider>
    </DndProvider>
  );
};
