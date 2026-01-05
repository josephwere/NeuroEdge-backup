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
import { NotificationProvider } from "../services/notificationStore";
// In App.tsx or HomePage.tsx
import React, { useState, useEffect } from "react";
import CommandPalette from "./components/CommandPalette";
import { registerCommand } from "./services/commandRegistry";

const HomePageWrapper: React.FC = () => {
  const [paletteVisible, setPaletteVisible] = useState(false);

  // Global Ctrl+P listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setPaletteVisible(v => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Example commands
  useEffect(() => {
    registerCommand({
      id: "new-chat",
      label: "New Chat",
      action: () => console.log("New Chat triggered"),
      shortcut: "Ctrl+N",
    });
    registerCommand({
      id: "open-settings",
      label: "Open Settings",
      action: () => console.log("Open Settings"),
      shortcut: "Ctrl+,",
    });
    registerCommand({
      id: "export-chat",
      label: "Export Chat",
      action: () => console.log("Export Chat triggered"),
    });
  }, []);

  return (
    <>
      <HomePage orchestrator={/* orchestrator */ null as any} />
      <CommandPalette visible={paletteVisible} onClose={() => setPaletteVisible(false)} />
    </>
  );
};
/**
 * NeuroEdge HomePage
 * Central brain of the frontend
 * Hosts sidebar, topbar, chat, floating tools, widgets, search, AI suggestions, notifications
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
    <NotificationProvider>
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
    </NotificationProvider>
  );
};
// inside HomePage.tsx — dashboard view
{activeView === "dashboard" && (
  <AnalyticsOverview
    stats={{
      executedCommands: 1245,
      successCount: 1130,
      failureCount: 115,
      errorTypes: {
        "SyntaxError": 50,
        "RuntimeError": 30,
        "Timeout": 20,
        "Unknown": 15,
      },
      approvalLatencyAvg: 12.4,
      aiConfidenceAvg: 87.2,
      meshNodes: [
        { node: "Node-1", status: "online" },
        { node: "Node-2", status: "offline" },
      ],
    }}
  />
)}
export default HomePage;
