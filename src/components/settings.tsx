import "react-toastify/dist/ReactToastify.css";

import { css } from "@emotion/css";
import { useContext } from "react";
import { IoMdSettings } from "react-icons/io";

import { AppStateContext } from "../model/teamStateManager";

export const circularIcon = css`
  border-radius: 9999px;
  padding: 0.3rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const SettingsToggle = () => {
  const { setSettingsModalIsOpen } = useContext(AppStateContext);
  return (
    <button
      onClick={() => {
        setSettingsModalIsOpen(true);
      }}
      className={css`
        ${circularIcon};
        background: #ddd;
      `}
    >
      <IoMdSettings />
    </button>
  );
};
