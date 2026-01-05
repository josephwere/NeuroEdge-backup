// frontend/src/components/Topbar.tsx

import React, { useState } from "react";

interface TopbarProps {
  onSearch: (query: string) => void;
  onCommand: (command: string) => void;
}

const Topbar: React.FC<TopbarProps> = ({ onSearch, onCommand }) => {
  const [search, setSearch] = useState("");
  const [showCommands, setShowCommands] = useState(false);

  return (
    <div
      style={{
        height: "56px",
        width: "100%",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        padding: "0 1rem",
        gap: "1rem",
        zIndex: 10,
      }}
    >
      {/* NeuroEdge Identity */}
      <div
        style={{
          fontWeight: 600,
          fontSize: "0.95rem",
          color: "#1f2937",
        }}
      >
        NeuroEdge
      </div>

      {/* Global Search */}
      <div style={{ flex: 1, position: "relative" }}>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder="Search chats, messages, commands…"
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: "0.85rem",
          }}
        />
      </div>

      {/* Command Palette Trigger */}
      <button
        onClick={() => setShowCommands(true)}
        title="Command Palette (Ctrl + K)"
        style={iconButton}
      >
        ⌘
      </button>

      {/* Notifications */}
      <button title="Notifications" style={iconButton}>
        🔔
      </button>

      {/* Theme Toggle */}
      <button title="Toggle theme" style={iconButton}>
        🌗
      </button>

      {/* User Menu */}
      <div style={{ position: "relative" }}>
        <button title="User menu" style={iconButton}>
          👤
        </button>
      </div>

      {/* Command Palette Overlay */}
      {showCommands && (
        <CommandPalette
          onClose={() => setShowCommands(false)}
          onSelect={onCommand}
        />
      )}
    </div>
  );
};

export default Topbar;

/* -------------------- */
/* Command Palette */
/* -------------------- */

interface CommandPaletteProps {
  onClose: () => void;
  onSelect: (cmd: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  onClose,
  onSelect,
}) => {
  const commands = [
    "New Chat",
    "Open Settings",
    "Toggle Theme",
    "Export Chat",
    "Clear History",
    "NeuroEdge Diagnostics",
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "420px",
          background: "#ffffff",
          borderRadius: "12px",
          padding: "0.5rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        {commands.map((cmd) => (
          <div
            key={cmd}
            onClick={() => {
              onSelect(cmd);
              onClose();
            }}
            style={{
              padding: "0.6rem 0.75rem",
              cursor: "pointer",
              borderRadius: "8px",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#f3f4f6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            {cmd}
          </div>
        ))}
      </div>
    </div>
  );
};

/* -------------------- */
/* Styles */
/* -------------------- */

const iconButton: React.CSSProperties = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: "1.1rem",
};
