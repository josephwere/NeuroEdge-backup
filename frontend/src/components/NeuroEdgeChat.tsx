import React, { useState } from "react";
import FloatingChat from "./FloatingChat";
import MainChat from "./MainChat";
import { OrchestratorClient } from "../services/orchestrator_client";

interface NeuroEdgeChatProps {
  orchestrator: OrchestratorClient;
}

const NeuroEdgeChat: React.FC<NeuroEdgeChatProps> = ({ orchestrator }) => {
  const [activeTab, setActiveTab] = useState<"main" | "floating">("main");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Tabs */}
      <div style={{ display: "flex", backgroundColor: "#2b2b3c", color: "#fff" }}>
        <button
          onClick={() => setActiveTab("main")}
          style={{
            flex: 1,
            padding: "10px",
            backgroundColor: activeTab === "main" ? "#3a3aff" : "#2b2b3c",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            border: "none"
          }}
        >
          Main Chat
        </button>
        <button
          onClick={() => setActiveTab("floating")}
          style={{
            flex: 1,
            padding: "10px",
            backgroundColor: activeTab === "floating" ? "#3a3aff" : "#2b2b3c",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            border: "none"
          }}
        >
          Floating Chat
        </button>
      </div>

      {/* Chat Panels */}
      <div style={{ flex: 1, position: "relative" }}>
        {activeTab === "main" && (
          <div style={{ height: "100%", width: "100%" }}>
            <MainChat orchestrator={orchestrator} />
          </div>
        )}
        {activeTab === "floating" && (
          <div style={{ height: "100%", width: "100%" }}>
            <FloatingChat orchestrator={orchestrator} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NeuroEdgeChat;
