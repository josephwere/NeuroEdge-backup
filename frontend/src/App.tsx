import React from "react";
import UnifiedChat from "./components/UnifiedChat";
import { OrchestratorClient } from "./services/orchestrator_client";
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
const orchestrator = new OrchestratorClient();

const App: React.FC = () => {
  return <UnifiedChat orchestrator={orchestrator} />;
};

export default App;
