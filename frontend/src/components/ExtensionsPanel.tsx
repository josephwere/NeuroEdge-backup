// frontend/src/components/ExtensionsPanel.tsx
import React, { useState } from "react";

export interface Extension {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  version?: string;
}

const defaultExtensions: Extension[] = [
  {
    id: "code-linter",
    name: "Code Linter",
    description: "Automatically checks your code blocks for errors.",
    enabled: true,
    version: "1.0.0",
  },
  {
    id: "analytics-widget",
    name: "Analytics Widget",
    description: "Adds extra dashboards for execution stats.",
    enabled: false,
    version: "0.9.2",
  },
  {
    id: "custom-commands",
    name: "Custom Commands",
    description: "Add your own commands to the NeuroEdge Command Palette.",
    enabled: true,
    version: "1.1.0",
  },
];

const ExtensionsPanel: React.FC = () => {
  const [extensions, setExtensions] = useState<Extension[]>(defaultExtensions);

  const toggleExtension = (id: string) => {
    setExtensions((prev) =>
      prev.map((ext) =>
        ext.id === id ? { ...ext, enabled: !ext.enabled } : ext
      )
    );
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "700px" }}>
      <h1>🧩 Extensions & Plugins</h1>
      <p style={{ color: "#555", marginBottom: "1rem" }}>
        Enable, disable, or configure mini-modules that extend NeuroEdge functionality.
      </p>

      {extensions.map((ext) => (
        <div
          key={ext.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1rem",
            marginBottom: "0.5rem",
            borderRadius: "8px",
            background: "#fafafa",
            border: "1px solid #e5e7eb",
          }}
        >
          <div>
            <div style={{ fontWeight: 600 }}>{ext.name}</div>
            <div style={{ fontSize: "0.85rem", color: "#555" }}>
              {ext.description} {ext.version && `v${ext.version}`}
            </div>
          </div>

          <button
            onClick={() => toggleExtension(ext.id)}
            style={{
              padding: "0.4rem 0.6rem",
              borderRadius: "6px",
              border: "none",
              background: ext.enabled ? "#3a3aff" : "#d1d5db",
              color: ext.enabled ? "#fff" : "#333",
              cursor: "pointer",
            }}
          >
            {ext.enabled ? "Enabled" : "Disabled"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExtensionsPanel;
