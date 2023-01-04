import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { useContext } from "react";

import { ColorKey, getColor } from "../colors";
import { iStr } from "../i18n/i18n";
import { AppStateContext } from "../model/teamStateManager";

const AuthorInput = styled.input`
  border: 0;
  font-family: "Roboto Mono", monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${getColor(ColorKey.AUTHOR_NAME)};
  padding: 0.1rem;
`;

export const AuthorText = () => {
  const { author, setAuthor, language } = useContext(AppStateContext);
  return (
    <div>
      <span
        className={css`
          font-size: 0.75rem;
          margin-right: 0.1rem;
        `}
      >
        {iStr("author", language)}
      </span>
      <AuthorInput
        style={{
          width: author ? Math.min(Math.max(author.length, 2), 50) + "ch" : 0,
          minWidth: "7ch"
        }}
        placeholder="@author"
        value={author}
        onChange={(e) => {
          setAuthor(e.target.value);
        }}
      />
      <span
        className={css`
          font-size: 0.75rem;
          margin-left: 0.1rem;
        `}
      >
        {iStr("withTsubotki", language)}
      </span>
    </div>
  );
};
