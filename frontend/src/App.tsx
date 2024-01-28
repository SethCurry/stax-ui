import { ThemeProvider } from "@mui/material";
import StaxBox from "./containers/StaxBox";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import MoxfieldExport from "./routes/MoxfieldExport";
import { DefaultContainer } from "./containers/DefaultContainer";
import XmageLauncher from "./routes/XmageLauncher";
import { defaultTheme } from "./theme";

export default function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <StaxBox width="100vw" height="100vh" overflow="hidden">
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
      </StaxBox>
    </ThemeProvider>
  );
}
