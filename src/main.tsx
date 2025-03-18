import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { FlashProvider } from "./hooks/useFlashes.tsx";
import FlashMessages from "./components/FlashRender.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <FlashProvider>
        <FlashMessages />
        <App />
      </FlashProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
