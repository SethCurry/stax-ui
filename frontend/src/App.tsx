import { Box } from "@mui/material";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import MoxfieldExport from "./routes/MoxfieldExport";
import { DefaultContainer } from "./containers/DefaultContainer";

export default function App() {
  return (
    <Box width="100vw" height="100vh">
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
        </Routes>
      </HashRouter>
    </Box>
  );
}
