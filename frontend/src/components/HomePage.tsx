// frontend/src/components/HomePage.tsx
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

import { ChatHistoryProvider } from "../services/chatHistoryStore";
import { OrchestratorClient } from "../services/orchestrator_client";
import { NotificationProvider } from "../services/notificationStore";

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
      <ChatSearchBar
        onSearch={(query: string, filters: any) => {
          // Chat search handled via chat history context
        }}
      />

      <UnifiedChat orchestrator={orchestrator} />

      <AISuggestionsOverlay
        onSelect={(suggestion) => console.log("AI Suggestion selected:", suggestion)}
      />

      <CommandPalette
        orchestrator={orchestrator}
        visible={paletteVisible}
        onClose={() => setPaletteVisible(false)}
      />
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

  return (
    <NotificationProvider>
      <ChatHistoryProvider>
        <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", backgroundColor: "#f5f6fa" }}>
          
          {/* Sidebar */}
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            onNavigate={setActiveView}
          />

          {/* Main Area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
            
            {/* Topbar */}
            <Topbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

            {/* Main Content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
              
              {/* Chat View */}
              {activeView === "chat" && <HomeContent orchestrator={orchestrator} />}

              {/* Dashboard View */}
              {activeView === "dashboard" && <Dashboard orchestrator={orchestrator} />}

              {/* Settings View */}
              {activeView === "settings" && <SettingsPanel />}

              {/* Extensions View */}
              {activeView === "extensions" && <ExtensionsPanel />}

              {/* Chat History View */}
              {activeView === "history" && <ChatHistoryPanel />}
            </div>
          </div>
        </div>
      </ChatHistoryProvider>
    </NotificationProvider>
  );
};

export default HomePage;
