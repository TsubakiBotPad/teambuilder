import { css } from "@emotion/css";
import Modal from "react-modal";
import { AwakeningImage } from "../../model/images";

import m from "../../model/monster.json";
import { MonsterType } from "../../model/types/monster";
import { FlexCol, FlexRow, FlexRowC, H3, Page } from "../../stylePrimitives";

function leftPad(num: number, size: number) {
  var s = String(num);
  while (s.length < size) {
    s = "0" + s;
  }
  return s;
}

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

export const LatentSelectorModal = ({
  isOpen,
  setModalIsOpen,
  cardSlotSelected,
}: {
  isOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cardSlotSelected: string;
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
      inset: 0 20%;
    `}
  >
    <Page maxWidth="600px">Nothing yet</Page>
  </Modal>
);
