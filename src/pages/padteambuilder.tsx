import { css } from "@emotion/css";
import { debounce } from "lodash";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { exportComponentAsPNG } from "react-component-export-image";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BsImage } from "react-icons/bs";
import { BiLink } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";

import { DefaultLevelSelector } from "../components/defaultLevelSelector";
import { Footer } from "../components/footer";
import { GameConfigSelector } from "../components/gameConfigSelector";
import { LanguageSelector } from "../components/languageSelector";
import { BadgeSelectorModal } from "../components/modal/badgeSelectorModal";
import { CardSelectorModal } from "../components/modal/cardSelectorModal";
import { LatentSelectorModal } from "../components/modal/latentSelectorModal";
import { TeamBuilderContent } from "../components/teamBuilderContent";
import { computeTeamStat, TeamStats } from "../components/teamStats/teamStats";
import { iStr, Language } from "../i18n/i18n";
import { ConfigData, deserializeConfig, serializeConfig } from "../model/serializedUri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AppStateContext,
  DEFAULT_APP_STATE,
  DEFAULT_GAME_CONFIG,
  DEFAULT_TEAM_STATE,
  linkLeadersNoSet,
  TeamStateContext
} from "../model/teamStateManager";
import { FlexColCResponsive, FlexRowC, H1, Page } from "../stylePrimitives";

const maxPageWidth = "1440px";

export const DraggableTypes = {
  card: "card",
  latent: "latent",
  slot: "slot"
};

const PadTeamBuilderPageContainer = React.forwardRef((props, ref) => {
  const { language, modalIsOpen, latentModalIsOpen, badgeModalIsOpen } = useContext(AppStateContext);
  return (
    <Page maxWidth={maxPageWidth}>
      <FlexColCResponsive gap="1rem">
        <FlexRowC gap="1rem">
          <H1>{iStr("applicationTitle", language, "PAD Team Builder")}</H1>
          <LanguageSelector />
        </FlexRowC>
        <FlexRowC gap="2rem">
          <GameConfigSelector />
          <DefaultLevelSelector />
          <FlexRowC gap="0.25rem">
            {iStr("export", language)}:
            <button
              onClick={() => exportComponentAsPNG(ref as any)}
              className={css`
                box-shadow: 1px 1px #ccc;
                border: 1px solid black;
                padding: 0 0.1rem;
                cursor: pointer;
              `}
            >
              <BsImage />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast(iStr("linkCopied", language));
              }}
              className={css`
                box-shadow: 1px 1px #ccc;
                border: 1px solid black;
                padding: 0 0.1rem;
                cursor: pointer;
              `}
            >
              <BiLink />
            </button>
          </FlexRowC>
        </FlexRowC>
      </FlexColCResponsive>
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
          <PadTeamBuilderPageContainer ref={ref} />
          <Footer />
        </TeamStateContext.Provider>
      </AppStateContext.Provider>
    </DndProvider>
  );
};
