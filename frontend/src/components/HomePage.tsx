// frontend/src/components/HomePage.tsx

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import UnifiedChat from "./UnifiedChat";
import { OrchestratorClient } from "../services/orchestrator_client";

/**
 * NeuroEdge HomePage
 * Central brain of the frontend
 * Hosts navigation, chat, floating tools, widgets
 */

interface Props {
  orchestrator: OrchestratorClient;
}

const HomePage: React.FC<Props> = ({ orchestrator }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<"chat" | "dashboard" | "settings">("chat");

  return (
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
        <Topbar
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Content */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {activeView === "chat" && (
            <UnifiedChat orchestrator={orchestrator} />
          )}

          {activeView === "dashboard" && (
            <div style={{ padding: "1.5rem" }}>
              <h2>📊 NeuroEdge Dashboard</h2>
              <p>Analytics, AI insights, execution stats coming here.</p>
            </div>
          )}

          {activeView === "settings" && (
            <div style={{ padding: "1.5rem" }}>
              <h2>⚙️ Settings</h2>
              <p>User preferences, privacy, themes, AI controls.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
