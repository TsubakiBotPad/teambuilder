import { useContext } from "react";

import { iStr } from "../i18n/i18n";
import { AppStateContext } from "../model/teamStateManager";

export const AuthorText = () => {
  const { author, setAuthor, language } = useContext(AppStateContext);
  return (
    <div>
      <span className="text-sm mr-px">{iStr("author", language)}</span>
      <input
        className="text-purple-600 border-0 font-roboto text-sm font-semibold pr-0 mr-0"
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
      <span className="text-sm">{iStr("withTsubotki", language)}</span>
    </div>
  );
};
