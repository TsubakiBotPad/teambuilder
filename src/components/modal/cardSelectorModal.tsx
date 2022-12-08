import { css } from "@emotion/css";
import styled from "@emotion/styled";
import Modal from "react-modal";
import { AwakeningImage, BASE_ICON_URL } from "../../model/images";

import m from "../../model/monster.json";
import { setCard, TeamState } from "../../model/teamStateManager";
import { MonsterType, getKillers } from "../../model/types/monster";
import {
  BoundingBox,
  FlexCol,
  FlexColC,
  FlexRow,
  FlexRowC,
  H2,
  H3,
  HR,
  Page,
} from "../../stylePrimitives";
import { leftPad } from "../generic/leftPad";

const LeaderSkillText = ({ monster }: { monster: any }) => {
  const hp = m.leader_skill.max_hp * m.leader_skill.max_hp;
  const atk = m.leader_skill.max_atk * m.leader_skill.max_atk;
  const rcv = m.leader_skill.max_rcv * m.leader_skill.max_rcv;
  const resist =
    (1 - (1 - m.leader_skill.max_shield) * (1 - m.leader_skill.max_shield)) *
    100;
  const ehp = hp / (1 - resist);
  const combos = m.leader_skill.max_combos * 2;
  const fua = m.leader_skill.bonus_damage * 2;
  return (
    <>
      [{hp}/{atk}/{rcv}
      {resist ? ` ${resist}%` : ""}] [{ehp}x eHP]{" "}
      {combos ? `[+${combos}c]` : ""} {fua ? `[${fua} fua]` : ""}
    </>
  );
};

const ChooseCard = styled.button`
  border: 1px solid black;
  padding: 0.25rem 0.5rem;
`;

const CardQueryInput = styled.input`
  border: 1px solid gray;
  border-radius: 2px;
  font-size: 1rem;
  padding: 0.5rem 0.5rem;
  text-align: center;
  width: 100%;
`;

export const CardSelectorModal = ({
  isOpen,
  setModalIsOpen,
  cardSlotSelected,
  teamState,
  setTeamState,
}: {
  isOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cardSlotSelected: string;
  teamState: TeamState;
  setTeamState: React.Dispatch<React.SetStateAction<TeamState>>;
}) => (
  <Modal
    isOpen={isOpen}
    contentLabel="Example Modal"
    shouldCloseOnOverlayClick={true}
    onRequestClose={() => {
      setModalIsOpen(false);
    }}
    className={css`
      border: 0;
      position: absolute;
      left: 25vw;
      top: 10vh;

      &:focus-visible {
        outline: 0;
      }
    `}
    overlayClassName={css`
      background-color: rgba(0, 0, 0, 0.4);
      position: fixed;
      inset: 0;
    `}
    ariaHideApp={false}
  >
    <BoundingBox maxWidth="50vw" maxWidthM="75vw">
      <div
        className={css`
          background-color: #fefefe;
          padding: 1rem;
        `}
      >
        <H2>{cardSlotSelected}</H2>

        {/* Todo make this react select for id query */}
        <FlexColC>
          <CardQueryInput type="text" placeholder="Search id/name/query" />
        </FlexColC>

        <div>List of monsters from query</div>
        <div>List of alt evos</div>

        <FlexColC>
          <ChooseCard
            onClick={() => {
              setCard(cardSlotSelected, 9277, teamState, setTeamState);
              setModalIsOpen(false);
            }}
          >
            Select
          </ChooseCard>
        </FlexColC>
        <HR color="black" />

        <FlexCol gap="1rem">
          <div
            className={css`
              display: flex;
              justify-content: space-between;
            `}
          >
            <FlexCol>
              <H3>
                [{m.monster_id}] {m.name_en}
              </H3>
              <b>{m.types.map((a) => MonsterType[a]).join("/")}</b>
              <FlexRow>
                {m.awakenings
                  .filter((a) => !a.is_super)
                  .map((a) => (
                    <AwakeningImage
                      key={a.awakening_id}
                      awakeningId={a.awoken_skill_id}
                    />
                  ))}
              </FlexRow>
              <FlexRow>
                <span>?</span>
                {m.awakenings
                  .filter((a) => a.is_super)
                  .map((a) => (
                    <AwakeningImage
                      key={a.awakening_id}
                      awakeningId={a.awoken_skill_id}
                    />
                  ))}
              </FlexRow>
            </FlexCol>
            <img src={`${BASE_ICON_URL}${leftPad(m.monster_id, 5)}.png`} />
          </div>
          <span>
            <b>Available killers:</b> [{m.latent_slots} slots] {getKillers(m)}
          </span>
          <FlexRow gap="5rem">
            <FlexCol>
              <b>{m.is_inheritable ? "" : "Not "}Inheritable</b>
              <span>
                <b>Rarity</b> {m.rarity}
              </span>
              <span>
                <b>Cost</b> {m.cost}
              </span>
              <b>{m.series["name_en"]}</b>
            </FlexCol>
            <FlexCol>
              <FlexRowC>
                297_img <b>Stats</b> (level_img)
              </FlexRowC>
              <span>
                <b>HP</b> {m.hp_max}
              </span>
              <span>
                <b>ATK</b> {m.atk_max}
              </span>
              <span>
                <b>RCV</b> {m.rcv_max}
              </span>
            </FlexCol>
          </FlexRow>
          <FlexCol>
            <b>
              Active Skill ({m.active_skill.cooldown_turns_max} -&gt;{" "}
              {m.active_skill.cooldown_turns_min})
            </b>
            <span>{m.active_skill.desc_en}</span>
          </FlexCol>
          <FlexCol>
            <b>
              Leader Skill <LeaderSkillText monster={m} />
            </b>
            <span>{m.leader_skill.desc_en}</span>
          </FlexCol>
        </FlexCol>
      </div>
    </BoundingBox>
  </Modal>
);
