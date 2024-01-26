import { Box } from "@mui/material";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import MoxfieldExport from "./routes/MoxfieldExport";
import { DefaultContainer } from "./containers/DefaultContainer";
import XmageLauncher from "./routes/XmageLauncher";

export default function App() {
  return (
    <Box width="100vw" height="100vh" overflow="hidden">
      <HashRouter basename={"/"}>
        <Routes>
          <Route
            path="/"
            element={
              <DefaultContainer>
                <Home />
              </DefaultContainer>
            }
          />
          <Route
            path="/moxfield/export"
            element={
              <DefaultContainer>
                <MoxfieldExport />
              </DefaultContainer>
            }
          />
          <Route
            path="/xmage"
            element={
              <DefaultContainer>
                <XmageLauncher />
              </DefaultContainer>
            }
          />
        </Routes>
      </HashRouter>
    </Box>
  );
}
