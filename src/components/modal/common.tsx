import { css } from "@emotion/css";
import { AiFillCloseCircle } from "react-icons/ai";

export const ModalCloseButton = ({
  hoverClose,
  setHoverClose,
  setModalOpen
}: {
  hoverClose: boolean;
  setHoverClose: React.Dispatch<React.SetStateAction<boolean>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div
      className={css`
        position: relative;
        top: 2.3rem;
        left: 95%;
      `}
    >
      <AiFillCloseCircle
        size={25}
        color={hoverClose ? "gray" : "lightgray"}
        onMouseOver={() => {
          setHoverClose(true);
        }}
        onMouseOut={() => {
          setHoverClose(false);
        }}
        onClick={() => {
          setHoverClose(false);
          setModalOpen(false);
        }}
      />
    </div>
  );
};
