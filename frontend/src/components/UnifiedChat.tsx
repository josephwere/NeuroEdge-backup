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
      <div style={{ height: "100vh", width: "100vw", position: "relative", backgroundColor: "#f5f6fa", overflow: "hidden" }}>
        <MainChat />
        <FloatingChat orchestrator={orchestrator} />
      </div>
    </EventBusProvider>
  );
};

export default UnifiedChat;
