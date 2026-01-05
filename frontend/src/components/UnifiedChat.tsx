import React from "react";
import MainChat from "./MainChat";
import FloatingChat from "./FloatingChat";
import { OrchestratorClient } from "../../services/orchestrator_client";
import { EventBusProvider } from "../../services/eventBus";

interface Props {
  orchestrator: OrchestratorClient;
}

const UnifiedChat: React.FC<Props> = ({ orchestrator }) => {
  return (
    <EventBusProvider>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          position: "relative",
          backgroundColor: "#f5f6fa",
          overflow: "hidden",
        }}
      >
        {/* Main Chat – Always visible */}
        <div style={{ height: "100%", width: "100%" }}>
          <MainChat />
        </div>

        {/* Floating Chat – Overlay control plane */}
        <FloatingChat orchestrator={orchestrator} />
      </div>
    </EventBusProvider>
  );
};

export default UnifiedChat;
