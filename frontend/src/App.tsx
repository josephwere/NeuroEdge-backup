// frontend/src/App.tsx
import React, { useEffect, useState } from "react";

import UnifiedChat from "@/components/UnifiedChat";
import CommandPalette from "@/components/CommandPalette";

import { OrchestratorClient } from "@/services/orchestrator_client";
import { registerCommand } from "@/services/commandRegistry";

/* ---------------- Initialize Orchestrator ---------------- */
const orchestrator = new OrchestratorClient();

/* ---------------- App Component ---------------- */
const App: React.FC = () => {
  const [paletteVisible, setPaletteVisible] = useState(false);

  /* ---------- Global Ctrl + P Command Palette ---------- */
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

  /* ---------- Register Global Commands ---------- */
  useEffect(() => {
    registerCommand({
      id: "new-chat",
      label: "New Chat",
      shortcut: "Ctrl+N",
      action: () => orchestrator.resetConversation(),
    });

    registerCommand({
      id: "open-settings",
      label: "Open Settings",
      shortcut: "Ctrl+,",
      action: () => console.log("Open Settings (hook SettingsPanel here)"),
    });

    registerCommand({
      id: "export-chat",
      label: "Export Chat",
      action: () => console.log("Export Chat"),
    });
  }, []);

  return (
    <>
      <UnifiedChat orchestrator={orchestrator} />

      <CommandPalette
        visible={paletteVisible}
        onClose={() => setPaletteVisible(false)}
      />
    </>
  );
};

export default App;
