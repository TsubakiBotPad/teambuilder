import { useContext } from "react";
import { AuthorText } from "./components/authorText";
import { iStr } from "./i18n/i18n";
import { AppStateContext } from "./model/teamStateManager";
import { FlexCol } from "./stylePrimitives";
import { css } from "@emotion/css";

export const TeamNotes = () => {
  const { instructions, setInstructions, language } = useContext(AppStateContext);
  return (
    <FlexCol gap="0.25rem">
      <AuthorText />
      <textarea
        rows={15}
        cols={10}
        className={css`
          width: 37.7rem;
          max-width: 90vw;
        `}
        value={instructions}
        onChange={(e) => {
          setInstructions(e.target.value);
        }}
        placeholder={iStr("notesPlaceholder", language)}
      />
    </FlexCol>
  );
};
