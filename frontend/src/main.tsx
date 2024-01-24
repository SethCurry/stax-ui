import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import NavSidebar from "./components/NavSidebar";
import App from "./App";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
