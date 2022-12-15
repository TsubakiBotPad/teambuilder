import styled from "@emotion/styled";
import { debounce } from "lodash";
import React, { useState } from "react";

import { GameConfig, GameConfigSelector } from "../components/gameConfigSelector";
import { BadgeSelectorModal } from "../components/modal/badgeSelectorModal";
import { CardSelectorModal } from "../components/modal/cardSelectorModal";
import { LatentSelectorModal } from "../components/modal/latentSelectorModal";
import { Team } from "../components/team";
import { computeTeamStat, TeamStatDisplay, TeamStats } from "../components/teamStats/teamStats";
import { ConfigData, serializeConfig } from "../model/serializedUri";
import { DEFAULT_TEAM_STATE, TeamState } from "../model/teamStateManager";
import { FlexCol, FlexColC, FlexRow, H1, Page } from "../stylePrimitives";
import { useNavigate, useParams } from "react-router-dom";

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
  const [badgeModalIsOpen, setBadgeModalIsOpen] = useState(false);
  const [playerSelected, setPlayerSelected] = useState("");
  const [cardSlotSelected, setCardSlotSelected] = useState("");
  const [teamState, setTeamState] = useState(DEFAULT_TEAM_STATE as TeamState);
  const [teamName, setTeamName] = useState("");
  const [gameConfig, setGameConfig] = useState({ mode: "3p" } as GameConfig);
  const [teamStats, setTeamStats] = useState<TeamStats>({});

  const navigate = useNavigate();

  const updateUrl = debounce((config: Partial<ConfigData>) => {
    const finalConfig = {
      n: teamName,
      ts: teamState,
      gc: gameConfig,
      ...config
    };
    navigate("/" + serializeConfig(finalConfig));
  }, 250);

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
      <BadgeSelectorModal
        isOpen={badgeModalIsOpen}
        setModalIsOpen={setBadgeModalIsOpen}
        playerSelected={playerSelected as any}
        gameConfig={gameConfig}
        teamState={teamState}
        setTeamState={setTeamState}
        teamStats={teamStats}
        setTeamStats={setTeamStats}
      />
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
                <Team
                  teamId={"P1"}
                  setModalIsOpen={setModalIsOpen}
                  setLatentModalIsOpen={setLatentModalIsOpen}
                  setBadgeModalIsOpen={setBadgeModalIsOpen}
                  setPlayerSelected={setPlayerSelected}
                  setCardSlotSelected={setCardSlotSelected}
                  state={teamState.p1}
                  gameConfig={gameConfig}
                />
                <TeamStatDisplay teamStat={teamStats.p1} />
              </FlexRow>
              {gameConfig.mode === "2p" || gameConfig.mode === "3p" ? (
                <FlexRow gap="3rem">
                  <Team
                    teamId={"P2"}
                    setModalIsOpen={setModalIsOpen}
                    setLatentModalIsOpen={setLatentModalIsOpen}
                    setBadgeModalIsOpen={setBadgeModalIsOpen}
                    setCardSlotSelected={setCardSlotSelected}
                    setPlayerSelected={setPlayerSelected}
                    state={teamState.p2}
                    gameConfig={gameConfig}
                  />
                  <TeamStatDisplay teamStat={teamStats.p2} />
                </FlexRow>
              ) : null}
              {gameConfig.mode === "3p" ? (
                <FlexRow gap="3rem">
                  <Team
                    teamId={"P3"}
                    setModalIsOpen={setModalIsOpen}
                    setLatentModalIsOpen={setLatentModalIsOpen}
                    setBadgeModalIsOpen={setBadgeModalIsOpen}
                    setCardSlotSelected={setCardSlotSelected}
                    setPlayerSelected={setPlayerSelected}
                    state={teamState.p3}
                    gameConfig={gameConfig}
                  />
                  <TeamStatDisplay teamStat={teamStats.p3} />
                </FlexRow>
              ) : null}
            </FlexCol>
          </FlexCol>
        </FlexRow>
      </FlexColC>
    </Page>
  );
};
