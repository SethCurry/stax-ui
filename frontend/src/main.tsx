import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App";

import { HashRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom";
import Home from "./routes/Home";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <HashRouter basename={"/"}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
    <App />
  </React.StrictMode>
);
