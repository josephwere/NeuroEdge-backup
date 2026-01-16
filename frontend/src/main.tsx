// frontend/src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";

import HomePage from "./components/HomePage";
import { UIProvider } from "./services/uiStore";
import { ChatHistoryProvider } from "./services/chatHistoryStore";
import { NotificationProvider } from "./services/notificationStore";
import { OrchestratorClient } from "./services/orchestrator_client";

import "./styles/globals.css";

/* -------------------- */
/* Orchestrator Bootstrap */
/* -------------------- */

const orchestrator = new OrchestratorClient({
  mode: "frontend",
  safe: true,
});

/* -------------------- */
/* React Root */
/* -------------------- */

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("NeuroEdge root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <UIProvider>
      <NotificationProvider>
        <ChatHistoryProvider>
          <HomePage orchestrator={orchestrator} />
        </ChatHistoryProvider>
      </NotificationProvider>
    </UIProvider>
  </React.StrictMode>
);
