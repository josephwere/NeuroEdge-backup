import React, { useState } from "react";
import MainChat from "./MainChat";
import FloatingChat from "./FloatingChat";
import { OrchestratorClient } from "../../services/orchestrator_client";

const UnifiedChat: React.FC<{ orchestrator: OrchestratorClient }> = ({ orchestrator }) => {
  const [activeTab, setActiveTab] = useState<"main" | "floating">("main");

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Tab Switcher */}
      <div style={{ display: "flex", backgroundColor: "#1e1e2f" }}>
        <button
          onClick={() => setActiveTab("main")}
          style={{
            flex: 1,
            padding: "0.75rem",
            backgroundColor: activeTab === "main" ? "#3a3aff" : "#2b2b3c",
            color: "#fff",
            border: "none",
          }}
        >
          Main Chat
        </button>
        <button
          onClick={() => setActiveTab("floating")}
          style={{
            flex: 1,
            padding: "0.75rem",
            backgroundColor: activeTab === "floating" ? "#3a3aff" : "#2b2b3c",
            color: "#fff",
            border: "none",
          }}
        >
          Floating Chat
        </button>
      </div>

      {/* Chat Display */}
      <div style={{ flex: 1, position: "relative" }}>
        {activeTab === "main" && <MainChat />}
        {activeTab === "floating" && <FloatingChat orchestrator={orchestrator} />}
      </div>
    </div>
  );
};

export default UnifiedChat;
