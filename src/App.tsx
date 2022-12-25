import { HashRouter, Route, Routes } from "react-router-dom";

import { PadTeamBuilderPage } from "./pages/padteambuilder";

export const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<PadTeamBuilderPage />} />
        <Route path=":config" element={<PadTeamBuilderPage />} />
      </Routes>
    </HashRouter>
  );
};
