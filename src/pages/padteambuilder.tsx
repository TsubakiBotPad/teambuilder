import { css } from "@emotion/css";
import styled from "@emotion/styled";
import React, { useState } from "react";

import { GameConfig, GameConfigSelector } from "../components/gameConfigSelector";
import { CardSelectorModal } from "../components/modal/cardSelectorModal";
import { LatentSelectorModal } from "../components/modal/latentSelectorModal";
import { Team } from "../components/team";
import { TeamStats, TeamStatsDisplay } from "../components/teamStats";
import { PadAssetImage } from "../model/padAssets";
import { DEFAULT_TEAM_STATE, TeamState } from "../model/teamStateManager";
import { FlexCol, FlexColC, FlexRow, H1, H2, H3, Page } from "../stylePrimitives";

const maxPageWidth = "1440px";

const TeamInput = styled.input`
  border: 0;
  font-size: 1.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem 0.25rem 0;
`;

export const PadTeamBuilderPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [latentModalIsOpen, setLatentModalIsOpen] = useState(false);
  const [cardSlotSelected, setCardSlotSelected] = useState("");
  const [teamState, setTeamState] = useState(DEFAULT_TEAM_STATE as TeamState);
  const [gameConfig, setGameConfig] = useState({ mode: "3p" } as GameConfig);
  const [teamStats, setTeamStats] = useState<TeamStats>({});

  return (
    <Page maxWidth={maxPageWidth}>
      <FlexColC gap="1rem">
        <H1>PAD Team Builder</H1>
        <GameConfigSelector gameConfig={gameConfig} setGameConfig={setGameConfig} />
      </FlexColC>
      <CardSelectorModal
        isOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        cardSlotSelected={cardSlotSelected}
        teamState={teamState}
        setTeamState={setTeamState}
        setTeamStats={setTeamStats}
      />
      <LatentSelectorModal
        isOpen={latentModalIsOpen}
        setModalIsOpen={setLatentModalIsOpen}
        cardSlotSelected={cardSlotSelected}
      />
      <FlexRow style={{ justifyContent: "space-around" }}>
        <FlexCol
          className={css`
            max-width: 50%;
          `}
        >
          <TeamInput placeholder="Team Title" size={35} />
          <FlexCol gap="1.5rem">
            <Team
              teamId={"P1"}
              teamColor={"pink"}
              setModalIsOpen={setModalIsOpen}
              setLatentModalIsOpen={setLatentModalIsOpen}
              setCardSlotSelected={setCardSlotSelected}
              state={teamState.p1}
            />
            {gameConfig.mode === "2p" || gameConfig.mode === "3p" ? (
              <Team
                teamId={"P2"}
                teamColor={"lightblue"}
                setModalIsOpen={setModalIsOpen}
                setLatentModalIsOpen={setLatentModalIsOpen}
                setCardSlotSelected={setCardSlotSelected}
                state={teamState.p2}
              />
            ) : null}
            {gameConfig.mode === "3p" ? (
              <Team
                teamId={"P3"}
                teamColor={"lightgreen"}
                setModalIsOpen={setModalIsOpen}
                setLatentModalIsOpen={setLatentModalIsOpen}
                setCardSlotSelected={setCardSlotSelected}
                state={teamState.p3}
              />
            ) : null}
          </FlexCol>
        </FlexCol>
        <FlexColC
          className={css`
            max-width: 50%;
            padding: 1rem;
          `}
        >
          <H3>Team Stats</H3>
          <span>normal: HP, RCV</span>
          <span>awo bound: HP, RCV</span>
          <span>eHP</span>
          <span>fully unbindable?, card types, has L, has all attr</span>
          <TeamStatsDisplay teamStats={teamStats} />
        </FlexColC>
      </FlexRow>
    </Page>
  );
};
