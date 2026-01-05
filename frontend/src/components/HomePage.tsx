// frontend/src/components/HomePage.tsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import UnifiedChat from "./UnifiedChat";
import ChatSearchBar from "./ChatSearchBar";
import AISuggestionsOverlay from "./AISuggestionsOverlay";
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

const HomeContent: React.FC<{ orchestrator: OrchestratorClient }> = ({ orchestrator }) => {
  const { setSearchQuery } = useChatHistory();

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
    </div>
  );
};

const HomePage: React.FC<Props> = ({ orchestrator }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<"chat" | "dashboard" | "settings">("chat");

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
            {activeView === "chat" && <HomeContent orchestrator={orchestrator} />}

            {activeView === "dashboard" && (
              <div
                style={{
                  padding: "1.5rem",
                  overflowY: "auto",
                  height: "100%",
                }}
              >
                <h2>📊 NeuroEdge Dashboard</h2>
                <p>Analytics, AI insights, execution stats, and widgets.</p>
              </div>
            )}

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
          </div>
        </div>
      </div>
    </ChatHistoryProvider>
  );
};

export default HomePage;
