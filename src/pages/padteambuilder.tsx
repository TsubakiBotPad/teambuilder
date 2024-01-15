import "react-toastify/dist/ReactToastify.css";

import { debounce } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { isMobile } from "../breakpoints";
import { computeTeamStat, TeamStats } from "../components/teamStats/teamStats";
import { iStr, Language } from "../i18n/i18n";
import { ConfigData, deserializeConfig, serializeConfig } from "../model/serializedUri";
import {
  AppStateContext,
  DEFAULT_APP_STATE,
  DEFAULT_GAME_CONFIG,
  DEFAULT_TEAM_STATE,
  linkLeadersNoSet,
  TeamStateContext
} from "../model/teamStateManager";
import { DesktopPageContainer } from "./desktop";
import { MobilePageContainer } from "./mobile";

export const DraggableTypes = {
  card: "card",
  latent: "latent",
  slot: "slot"
};

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
        gc: DEFAULT_GAME_CONFIG,
        in: undefined,
        l: "en" as Language,
        a: undefined
      };

  const [teamName, setTeamName] = useState(parsedConfig.n);
  const [gameConfig, setGameConfig] = useState(parsedConfig.gc);
  const [language, setLanguage] = useState(parsedConfig.l);
  const [teamState, setTeamState] = useState(
    parsedConfig.gc.mode === "2p" ? linkLeadersNoSet(parsedConfig.ts) : parsedConfig.ts
  );
  const [teamStats, setTeamStats] = useState<TeamStats>({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [latentModalIsOpen, setLatentModalIsOpen] = useState(false);
  const [badgeModalIsOpen, setBadgeModalIsOpen] = useState(false);
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false);

  const [playerSelected, setPlayerSelected] = useState("");
  const [cardSlotSelected, setCardSlotSelected] = useState({});
  const [instructions, setInstructions] = useState<string | undefined>(parsedConfig.in);
  const [author, setAuthor] = useState<string | undefined>(parsedConfig.a);
  const [dungeonEffects, setDungeonEffects] = useState(DEFAULT_APP_STATE.dungeonEffects);

  var updateUrl = useRef(
    debounce((config: Partial<ConfigData>) => {
      const finalConfig = {
        in: instructions,
        n: teamName,
        ts: teamState,
        gc: gameConfig,
        l: language,
        a: author,
        ...config
      };
      navigate("/" + serializeConfig(finalConfig));
    }, 250)
  );

  useEffect(() => {
    window.addEventListener("hashchange", function (e) {
      window.location.reload();
    });
  });

  useEffect(() => {
    updateUrl.current({ n: teamName, ts: teamState, gc: gameConfig, in: instructions, a: author });
  }, [teamName, teamState, gameConfig, instructions, author]);

  useEffect(() => {
    const tabName = iStr("tabName", language);
    document.title = teamName !== "" ? `${teamName} | ${tabName}` : tabName;
  }, [teamName, language]);

  useMemo(() => {
    const f = async () => {
      setTeamStats({
        p1: await computeTeamStat(teamState, gameConfig, "p1", dungeonEffects.hasAssists),
        p2: await computeTeamStat(teamState, gameConfig, "p2", dungeonEffects.hasAssists),
        p3: await computeTeamStat(teamState, gameConfig, "p3", dungeonEffects.hasAssists)
      });
    };
    f();
  }, [teamState, gameConfig, dungeonEffects]);

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
          settingsModalIsOpen,
          setSettingsModalIsOpen,
          cardSlotSelected,
          setCardSlotSelected,
          playerSelected,
          setPlayerSelected,
          updateUrl: updateUrl.current,
          instructions,
          setInstructions,
          language,
          setLanguage,
          author,
          setAuthor,
          dungeonEffects,
          setDungeonEffects
        }}
      >
        <TeamStateContext.Provider value={{ teamState, setTeamState }}>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={false}
            theme="light"
          />

          {isMobile() ? <MobilePageContainer ref={ref} /> : <DesktopPageContainer ref={ref} />}
          {/* <Footer /> */}
        </TeamStateContext.Provider>
      </AppStateContext.Provider>
    </DndProvider>
  );
};
