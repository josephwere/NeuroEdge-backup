import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import UnifiedChat from "./UnifiedChat";
import ChatSearchBar from "./ChatSearchBar";
import AISuggestionsOverlay from "./AISuggestionsOverlay";
import Dashboard from "./Dashboard";
import CommandPalette from "./CommandPalette";
import ChatHistoryPanel from "./ChatHistoryPanel";
import SettingsPanel from "./settings/SettingsPanel";
import ExtensionsPanel from "./ExtensionsPanel";
import FounderAssistant from "./FounderAssistant"; // <-- NEW

import { ChatHistoryProvider } from "../services/chatHistoryStore";
import { OrchestratorClient } from "../services/orchestrator_client";
import { NotificationProvider } from "../services/notificationStore";

import { loadExtension } from "../extensions/extensionLoader";
import codeLinter from "../extensions/examples/codeLinter";

/* ----------------------------- */
/* Home Content for Chat View    */
/* ----------------------------- */
const HomeContent: React.FC<{ orchestrator: OrchestratorClient }> = ({ orchestrator }) => {
  const [paletteVisible, setPaletteVisible] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteVisible(v => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
      <ChatSearchBar onSearch={(query, filters) => { /* handled via context */ }} />

      <UnifiedChat orchestrator={orchestrator} />

      <AISuggestionsOverlay onSelect={(s) => console.log("AI Suggestion:", s)} />

      <CommandPalette orchestrator={orchestrator} visible={paletteVisible} onClose={() => setPaletteVisible(false)} />
    </div>
  );
};

/* ----------------------------- */
/* Main HomePage                 */
/* ----------------------------- */
interface Props {
  orchestrator: OrchestratorClient;
}

const HomePage: React.FC<Props> = ({ orchestrator }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<"chat" | "dashboard" | "settings" | "history" | "extensions">("chat");

  useEffect(() => {
    const extCtx = {
      orchestrator,
      notify: (msg: string, type: any = "info") => console.log(`[Notification ${type}] ${msg}`),
      getUserProfile: () => ({ name: "Guest User", mode: "local" }),
      requestPermission: async (perm: string) => true,
      registerCommand: (cmd: any) => console.log("Registered extension command:", cmd),
    };
    loadExtension(codeLinter, extCtx);
  }, [orchestrator]);

  return (
    <NotificationProvider>
      <ChatHistoryProvider>
        <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", backgroundColor: "#f5f6fa" }}>
          
          {/* Sidebar */}
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} onNavigate={setActiveView} />

          {/* Main Area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
            
            {/* Topbar */}
            <Topbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

            {/* Founder Assistant */}
            <FounderAssistant orchestrator={orchestrator} />

            {/* Main Content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
              {activeView === "chat" && <HomeContent orchestrator={orchestrator} />}
              {activeView === "dashboard" && <Dashboard orchestrator={orchestrator} />}
              {activeView === "settings" && <SettingsPanel />}
              {activeView === "extensions" && <ExtensionsPanel />}
              {activeView === "history" && <ChatHistoryPanel />}
            </div>
          </div>
        </div>
      </ChatHistoryProvider>
    </NotificationProvider>
  );
};

export default HomePage;
