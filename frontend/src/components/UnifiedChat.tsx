// frontend/src/components/UnifiedChat.tsx
import React, { useRef, useEffect, useState } from "react";
import MainChat from "./MainChat";
import FloatingChat from "./FloatingChat";
import { OrchestratorClient } from "../../services/orchestrator_client";
import { EventBusProvider } from "../../services/eventBus";

interface Props {
  orchestrator: OrchestratorClient;
}

const UnifiedChat: React.FC<Props> = ({ orchestrator }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [floatingPosition, setFloatingPosition] = useState({ x: 20, y: 20 });

  // Ensure floating chat stays inside viewport
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      const { innerWidth, innerHeight } = window;
      setFloatingPosition(pos => ({
        x: Math.min(pos.x, innerWidth - 400 - 20),
        y: Math.min(pos.y, innerHeight - 540 - 20),
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <EventBusProvider>
      <div
        ref={containerRef}
        style={{
          height: "100vh",
          width: "100vw",
          position: "relative",
          backgroundColor: "#f5f6fa",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Main Chat */}
        <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
          <MainChat />
        </div>

        {/* Floating Chat */}
        <FloatingChat
          orchestrator={orchestrator}
          initialPosition={floatingPosition}
          onPositionChange={setFloatingPosition}
        />
      </div>
    </EventBusProvider>
  );
};

export default UnifiedChat;
