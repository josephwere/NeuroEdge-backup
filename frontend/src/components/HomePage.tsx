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
import { ChatHistoryProvider, useChatHistory } from "../services/chatHistoryStore";
import { OrchestratorClient } from "../services/orchestrator_client";

/**
 * NeuroEdge HomePage
 * Central brain of the frontend
 * Hosts sidebar, topbar, chat, floating tools, widgets, search, AI suggestions
 */

interface Props {
  orchestrator: OrchestratorClient;
}

// Home content with chat, search bar, AI overlay, and command palette
const HomeContent: React.FC<{ orchestrator: OrchestratorClient }> = ({ orchestrator }) => {
  const { setSearchQuery } = useChatHistory();
  const [paletteVisible, setPaletteVisible] = useState(false);

  // Keyboard shortcut: Ctrl+K / Cmd+K to toggle Command Palette
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
      {/* Chat Search Bar */}
      <ChatSearchBar
        onSearch={(query: string, filters: any) => setSearchQuery(query, filters)}
      />

      {/* Unified Chat */}
      <UnifiedChat orchestrator={orchestrator} />

      {/* AI Suggestions Overlay */}
      <AISuggestionsOverlay
        onSelect={(suggestion) => {
          console.log("AI Suggestion selected:", suggestion);
          // Optionally auto-fill input in FloatingChat/MainChat
        }}
      />

      {/* Command Palette */}
      <CommandPalette
        orchestrator={orchestrator}
        visible={paletteVisible}
        onClose={() => setPaletteVisible(false)}
      />
    </div>
  );
};

// Main HomePage component with sidebar, topbar, and views
const HomePage: React.FC<Props> = ({ orchestrator }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<"chat" | "dashboard" | "settings" | "history">("chat");

  return (
    <ChatHistoryProvider>
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          backgroundColor: "#f5f6fa",
        }}
      >
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onNavigate={setActiveView}
        />

        {/* Main Area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Topbar */}
          <Topbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

          {/* Main Content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Chat View */}
            {activeView === "chat" && <HomeContent orchestrator={orchestrator} />}

            {/* Dashboard View */}
            {activeView === "dashboard" && (
              <div style={{ flex: 1, overflowY: "auto" }}>
                <Dashboard orchestrator={orchestrator} />
              </div>
            )}

            {/* Settings View */}
            {activeView === "settings" && (
              <div
                style={{
                  padding: "1.5rem",
                  overflowY: "auto",
                  height: "100%",
                }}
              >
                <h2>⚙️ Settings</h2>
                <p>User preferences, privacy, themes, AI controls, profile, memory.</p>
              </div>
            )}

            {/* Chat History View */}
            {activeView === "history" && (
              <div style={{ flex: 1, overflowY: "auto" }}>
                <ChatHistoryPanel />
              </div>
            )}
          </div>
        </div>
      </div>
    </ChatHistoryProvider>
  );
};

export default HomePage;
