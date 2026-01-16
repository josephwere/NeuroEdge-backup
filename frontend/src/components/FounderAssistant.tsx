// frontend/src/components/FounderAssistant.tsx

import React, { useState, useEffect, useRef } from "react";
import { OrchestratorClient } from "../services/orchestrator_client";

/**
 * FounderAssistant
 * - Displays alerts, logs, and messages for the founder
 * - Integrates TTS for real-time voice notifications
 * - Stacks messages in modern style (top-right corner)
 */

interface AlertMessage {
  id: number;
  type: "info" | "success" | "warning" | "error";
  message: string;
  timestamp: number;
}

interface Props {
  orchestrator: OrchestratorClient;
}

const FounderAssistant: React.FC<Props> = ({ orchestrator }) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const alertIdRef = useRef(0);
  const ttsQueueRef = useRef<AlertMessage[]>([]);
  const speakingRef = useRef(false);

  /* ------------------------ TTS Function ------------------------ */
  const speakMessage = (msg: string) => {
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
      speakingRef.current = false;
      if (ttsQueueRef.current.length > 0) {
        const next = ttsQueueRef.current.shift()!;
        speakMessage(next.message);
      }
    };

    speakingRef.current = true;
    window.speechSynthesis.speak(utterance);
  };

  /* ------------------------ Add Alert ------------------------ */
  const addAlert = (type: AlertMessage["type"], message: string) => {
    const id = alertIdRef.current++;
    const alert: AlertMessage = { id, type, message, timestamp: Date.now() };
    setAlerts((prev) => [alert, ...prev]);
    ttsQueueRef.current.push(alert);
    if (!speakingRef.current) speakMessage(alert.message);
  };

  /* ------------------------ Listen to Orchestrator ------------------------ */
  useEffect(() => {
    const subscription = orchestrator.onFounderMessage((msg) => {
      const type: AlertMessage["type"] =
        msg.type === "error" ? "error" : msg.type === "status" ? "success" : "info";
      addAlert(type, msg.message);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [orchestrator]);

  /* ------------------------ Render ------------------------ */
  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        width: "320px",
        maxHeight: "80vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        zIndex: 9999,
      }}
    >
      {alerts.map((alert) => (
        <div
          key={alert.id}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            background:
              alert.type === "info"
                ? "#f0f4ff"
                : alert.type === "success"
                ? "#e6ffed"
                : alert.type === "warning"
                ? "#fff7e6"
                : "#ffe6e6",
            color:
              alert.type === "info"
                ? "#1e3a8a"
                : alert.type === "success"
                ? "#166534"
                : alert.type === "warning"
                ? "#78350f"
                : "#991b1b",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            fontSize: "0.85rem",
          }}
        >
          {alert.message}
        </div>
      ))}
    </div>
  );
};

export default FounderAssistant;
