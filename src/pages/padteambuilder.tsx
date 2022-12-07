import styled from "@emotion/styled";
import React, { useState } from "react";

import { CardSelectorModal } from "../components/modal/cardSelectorModal";
import {
  GameConfig,
  GameConfigSelector,
} from "../components/gameConfigSelector";
import { LatentSelectorModal } from "../components/modal/latentSelectorModal";
import { Team } from "../components/team";
import { DEFAULT_TEAM_STATE, TeamState } from "../model/teamStateManager";
import { FlexCol, FlexColC, FlexRow, H1, H2, Page } from "../stylePrimitives";
import { css } from "@emotion/css";

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

  return (
    <Page maxWidth={maxPageWidth}>
      <FlexColC gap="1rem">
        <H1>PAD Team Builder</H1>
        <GameConfigSelector
          gameConfig={gameConfig}
          setGameConfig={setGameConfig}
        />
      </FlexColC>
      <CardSelectorModal
        isOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        cardSlotSelected={cardSlotSelected}
        teamState={teamState}
        setTeamState={setTeamState}
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
          <H2>Team Stats</H2>
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sed
            iaculis risus. Pellentesque habitant morbi tristique senectus et
            netus et malesuada fames ac turpis egestas. Pellentesque egestas et
            nisi et tincidunt. Morbi at varius justo. Praesent convallis congue
            magna sit amet tincidunt. Vestibulum vehicula leo tortor.
            Suspendisse sollicitudin condimentum elit quis interdum. Donec
            maximus iaculis dui, eget lacinia neque tincidunt at. Fusce nec
            dignissim odio. Pellentesque habitant morbi tristique senectus et
            netus et malesuada fames ac turpis egestas. Aenean sed odio non odio
            posuere efficitur at ac quam. Suspendisse nec nibh leo. Maecenas eu
            massa justo. Mauris non ex in leo molestie tristique. Pellentesque
            ut tellus et nunc rhoncus convallis vitae vel purus. Duis bibendum,
            urna a ornare dapibus, lorem eros accumsan mi, sed scelerisque nunc
            velit sit amet massa. Fusce ut commodo nisl.
          </span>
        </FlexColC>
      </FlexRow>
    </Page>
  );
};
