import styled from "@emotion/styled";
import React from "react";
import { useContext } from "react";

import { iStr } from "../i18n/i18n";
import { AppStateContext } from "../model/teamStateManager";

const TeamNameInput = styled.input`
  border: 0;
  font-size: 1.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem 0.25rem 0;
`;

export const TeamName = () => {
  const { setTeamName, teamName, language } = useContext(AppStateContext);
  return (
    <TeamNameInput
      placeholder={iStr("teamName", language)}
      size={20}
      value={teamName}
      onChange={(e) => {
        setTeamName(e.target.value);
      }}
    />
  );
};
