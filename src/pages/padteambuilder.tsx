import { css } from "@emotion/css";
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
import { TeamBuilderContent } from "../components/teamBuilderContent";
import { computeTeamStat, TeamStats } from "../components/teamStats/teamStats";
import { iStr, Language } from "../i18n/i18n";
import { ConfigData, deserializeConfig, serializeConfig } from "../model/serializedUri";
import {
  AppStateContext,
  DEFAULT_GAME_CONFIG,
  DEFAULT_TEAM_STATE,
  linkLeadersNoSet,
  TeamStateContext
} from "../model/teamStateManager";
import { FlexColC, FlexRowC, H1, Page } from "../stylePrimitives";

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
      <FlexColC gap="1rem">
        <H1>{iStr("applicationTitle", language, "PAD Team Builder")}</H1>
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
        gc: DEFAULT_GAME_CONFIG,
        in: iStr("notes", "en", "Type notes here!"),
        l: "en" as Language
      };

  const [teamName, setTeamName] = useState(parsedConfig.n);
  const [gameConfig, setGameConfig] = useState(parsedConfig.gc);
  const [language] = useState(parsedConfig.l);
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

  var updateUrl = useRef(
    debounce((config: Partial<ConfigData>) => {
      const finalConfig = {
        in: instructions,
        n: teamName,
        ts: teamState,
        gc: gameConfig,
        l: language,
        ...config
      };
      navigate("/" + serializeConfig(finalConfig));
    }, 250)
  );

  useEffect(() => {
    updateUrl.current({ n: teamName, ts: teamState, gc: gameConfig, in: instructions });
  }, [teamName, teamState, gameConfig, instructions]);

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
          updateUrl: updateUrl.current,
          instructions,
          setInstructions,
          language
        }}
      >
        <TeamStateContext.Provider value={{ teamState, setTeamState }}>
          <div ref={ref as any}>
            <PadTeamBuilderPageContainer ref={ref} />
          </div>
        </TeamStateContext.Provider>
      </AppStateContext.Provider>
    </DndProvider>
  );
};
