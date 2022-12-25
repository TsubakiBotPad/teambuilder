import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { debounce } from "lodash";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { exportComponentAsPNG } from "react-component-export-image";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BsImage } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";

import { DefaultLevelSelector } from "../components/defaultLevelSelector";
import { GameConfigSelector } from "../components/gameConfigSelector";
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

const TeamBuilderContent = React.forwardRef((props, ref) => {
  const { gameConfig, setTeamName, teamName, teamStats } = useContext(AppStateContext);
  const { teamState } = useContext(TeamStateContext);

  return (
    <FlexColC ref={ref as any}>
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
            <textarea
              rows={15}
              cols={10}
              className={css`
                width: 48%;
              `}
              defaultValue="Type some notes here. Text is not saved when you share the link yet."
            />
          </FlexCol>
        </FlexCol>
      </FlexRow>
    </FlexColC>
  );
});

const PadTeamBuilderPageInner = React.forwardRef((props, ref) => {
  const { modalIsOpen, latentModalIsOpen, badgeModalIsOpen } = useContext(AppStateContext);
  return (
    <Page maxWidth={maxPageWidth}>
      <FlexColC gap="1rem">
        <H1>PAD Team Builder</H1>
        <FlexRowC gap="2rem">
          <GameConfigSelector />
          <DefaultLevelSelector />
          <FlexRowC gap="0.25rem">
            Export:
            <button
              onClick={() => exportComponentAsPNG(ref as any)}
              className={css`
                box-shadow: 1px 1px #ccc;
                border: 1px solid black;
                padding: 0 0.1rem;
              `}
            >
              <BsImage />
            </button>
          </FlexRowC>
        </FlexRowC>
      </FlexColC>
      <CardSelectorModal isOpen={modalIsOpen} />
      <LatentSelectorModal isOpen={latentModalIsOpen} />
      <BadgeSelectorModal isOpen={badgeModalIsOpen} />
      <TeamBuilderContent ref={ref} />
    </Page>
  );
});

export const PadTeamBuilderPage = () => {
  const ref = useRef();

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
          setTeamName,
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
          <div ref={ref as any}>
            <PadTeamBuilderPageInner ref={ref} />
          </div>
        </TeamStateContext.Provider>
      </AppStateContext.Provider>
    </DndProvider>
  );
};
