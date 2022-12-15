import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import { PadTeamBuilderPage } from "./pages/padteambuilder";

export const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PadTeamBuilderPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};
