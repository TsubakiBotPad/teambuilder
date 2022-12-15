import { css } from "@emotion/css";
import { useState } from "react";
import Modal from "react-modal";

import { breakpoint } from "../../breakpoints";
import { PadAssetImage } from "../../model/padAssets";
import { setPlayerBadge, TeamState } from "../../model/teamStateManager";
import { BADGE_NAMES } from "../../model/types/badges";
import { BoundingBox, FlexColC, FlexRow, H2 } from "../../stylePrimitives";
import { GameConfig } from "../gameConfigSelector";
import { ConfirmButton } from "../generic/confirmButton";
import { TeamStats } from "../teamStats/teamStats";

const modalClassName = css`
  border: 0;
  position: absolute;
  left: 25vw;
  top: 10vh;

  @media ${breakpoint.xs} {
    left: 5vw;
  }

  &:focus-visible {
    outline: 0;
  }
`;

const overlayClassName = css`
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  inset: 0;
`;

export const BadgeSelectorModal = ({
  isOpen,
  setModalIsOpen,
  playerSelected,
  gameConfig,
  teamState,
  setTeamState,
  teamStats,
  setTeamStats
}: {
  isOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  playerSelected: "p1" | "p2" | "p3";
  gameConfig: GameConfig;
  teamState: TeamState;
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>;
  teamStats: TeamStats;
  setTeamStats: React.Dispatch<React.SetStateAction<TeamStats>>;
}) => {
  const [selectedBadge, setSelectedBadge] = useState<string>("");

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Badge Modal"
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => {
        setModalIsOpen(false);
      }}
      className={modalClassName}
      overlayClassName={overlayClassName}
      ariaHideApp={false}
    >
      <BoundingBox minWidth="50vw" maxWidth="50vw" minWidthM="75vw" maxWidthM="90vw">
        <div
          className={css`
            background-color: #fefefe;
            padding: 1rem;
          `}
        >
          <H2>{playerSelected}-Badge</H2>
          <FlexColC>
            <FlexRow wrap="wrap" gap="0.25rem">
              {BADGE_NAMES.map((name) => {
                return (
                  <div
                    className={css`
                      border: 3px solid ${selectedBadge === name ? "black" : "transparent"};
                      background-color: ${selectedBadge === name ? "lightgreen" : "transparent"};
                      display: flex;
                      align-items: center;
                      padding: 2px;
                    `}
                  >
                    <PadAssetImage
                      assetName={`${name}badge`}
                      onClick={() => {
                        setSelectedBadge(name);
                      }}
                      height={30}
                    />
                  </div>
                );
              })}
            </FlexRow>

            <br />
            <FlexColC>
              <ConfirmButton
                onClick={() => {
                  setPlayerBadge(
                    playerSelected,
                    selectedBadge,
                    gameConfig,
                    teamState,
                    setTeamState,
                    teamStats,
                    setTeamStats
                  );
                  setModalIsOpen(false);
                }}
              >
                Use Badge
              </ConfirmButton>
            </FlexColC>
          </FlexColC>
        </div>
      </BoundingBox>
    </Modal>
  );
};
