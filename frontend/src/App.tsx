import React, { useEffect, useState } from "react";

import BootScreen from "@/components/BootScreen";
import UnifiedChat from "@/components/UnifiedChat";
import CommandPalette from "@/components/CommandPalette";

import { OrchestratorClient } from "@/services/orchestrator_client";
import { registerCommand } from "@/services/commandRegistry";

/* -------------------------------------------------
   Single Orchestrator Instance (global & stable)
-------------------------------------------------- */
const orchestrator = new OrchestratorClient();

/* -------------------------------------------------
   App
-------------------------------------------------- */
const App: React.FC = () => {
  const [booted, setBooted] = useState(false);
  const [paletteVisible, setPaletteVisible] = useState(false);

  /* ---------- Ctrl / Cmd + P : Command Palette ---------- */
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

  /* ---------- Global Commands (safe offline) ---------- */
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
      action: () => console.log("Settings panel coming next"),
    });

    registerCommand({
      id: "export-chat",
      label: "Export Chat",
      action: () => console.log("Export Chat"),
    });
  }, []);

  return (
    <>
      {/* Boot overlay (offline + online safe) */}
      {!booted && <BootScreen onDone={() => setBooted(true)} />}

      {/* Main UI (never blocked) */}
      {booted && (
        <>
          <UnifiedChat orchestrator={orchestrator} />
          <CommandPalette
            visible={paletteVisible}
            onClose={() => setPaletteVisible(false)}
          />
        </>
      )}
    </>
  );
};

export default App;
