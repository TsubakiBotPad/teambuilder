import { css } from "@emotion/css";
import styled from "@emotion/styled";
import React, { useState } from "react";

import { GameConfig, GameConfigSelector } from "../components/gameConfigSelector";
import { CardSelectorModal } from "../components/modal/cardSelectorModal";
import { LatentSelectorModal } from "../components/modal/latentSelectorModal";
import { Team } from "../components/team";
import { TeamStats, TeamStatDisplay } from "../components/teamStats/teamStats";
import { PadAssetImage } from "../model/padAssets";
import { DEFAULT_TEAM_STATE, TeamState } from "../model/teamStateManager";
import { FlexCol, FlexColC, FlexRow, H1, Page } from "../stylePrimitives";

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
        <GameConfigSelector
          gameConfig={gameConfig}
          setGameConfig={setGameConfig}
          teamState={teamState}
          setTeamStats={setTeamStats}
        />
      </FlexColC>
      <CardSelectorModal
        isOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        cardSlotSelected={cardSlotSelected}
        gameConfig={gameConfig}
        teamState={teamState}
        setTeamState={setTeamState}
        teamStats={teamStats}
        setTeamStats={setTeamStats}
      />
      <LatentSelectorModal
        isOpen={latentModalIsOpen}
        setModalIsOpen={setLatentModalIsOpen}
        cardSlotSelected={cardSlotSelected}
        gameConfig={gameConfig}
        teamState={teamState}
        setTeamState={setTeamState}
        teamStats={teamStats}
        setTeamStats={setTeamStats}
      />
      <FlexColC>
        <FlexRow gap="1rem">
          <FlexCol>
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
            <span>
              TODO: <span>psf, jsf</span>
            </span>
            {/* <FlexCol gap="1em">
              <PadAssetImage assetName="0" />
              <PadAssetImage assetName="1" />
              <PadAssetImage assetName="2" />
              <PadAssetImage assetName="3" />
              <PadAssetImage assetName="4" />
              <PadAssetImage assetName="5" />
              <PadAssetImage assetName="6" />
              <PadAssetImage assetName="7" />
              <PadAssetImage assetName="8" />
              <PadAssetImage assetName="9" />
              <PadAssetImage assetName="10" />
              <PadAssetImage assetName="11" />
              <PadAssetImage assetName="12" />
              <PadAssetImage assetName="13" />
              <PadAssetImage assetName="14" />
              <PadAssetImage assetName="15" />
              <PadAssetImage assetName="16" />
              <PadAssetImage assetName="17" />
            </FlexCol> */}
            <PadAssetImage assetName="psf" />
            <TeamStatDisplay teamStat={teamStats.p1} />
          </FlexColC>
        </FlexRow>
      </FlexColC>
    </Page>
  );
};
