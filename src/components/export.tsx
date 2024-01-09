import { css } from "@emotion/css";
import { exportComponentAsPNG } from "react-component-export-image";
import { BiLink } from "react-icons/bi";
import { BsImage } from "react-icons/bs";
import { toast } from "react-toastify";
import { iStr } from "../i18n/i18n";
import { AppStateContext } from "../model/teamStateManager";
import { useContext } from "react";
import React from "react";

export const ExportControls = React.forwardRef((props, ref) => {
  const { language } = useContext(AppStateContext);
  return (
    <>
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
      <button
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          toast(iStr("linkCopied", language));
        }}
        className={css`
          box-shadow: 1px 1px #ccc;
          border: 1px solid black;
          padding: 0 0.1rem;
          cursor: pointer;
        `}
      >
        <BiLink />
      </button>
    </>
  );
});
