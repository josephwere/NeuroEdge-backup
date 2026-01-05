// frontend/src/ExtensionsPanel.tsx
import React, { useEffect, useState } from "react";
import { loadExtension } from "../extensions/extensionLoader";

// Type for loaded extension
interface Extension {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  permissions: string[];
}

/**
 * ExtensionsPanel
 * Shows loaded extensions, allows activation/deactivation, and safe loading of new ones
 */
const ExtensionsPanel: React.FC = () => {
  const [extensions, setExtensions] = useState<Extension[]>([]);

  // Mock initial loaded extensions (replace with dynamic loading if needed)
  useEffect(() => {
    const initial: Extension[] = [
      {
        id: "code-linter",
        name: "Code Linter",
        description: "Lint and auto-format your code blocks",
        active: true,
        permissions: ["read-chat", "execute-scripts"],
      },
      {
        id: "analytics-plugin",
        name: "Analytics Plugin",
        description: "Custom analytics and metrics visualization",
        active: false,
        permissions: ["read-metrics"],
      },
    ];
    setExtensions(initial);
  }, []);

  const toggleExtension = (id: string) => {
    setExtensions((prev) =>
      prev.map((ext) =>
        ext.id === id ? { ...ext, active: !ext.active } : ext
      )
    );
  };

  const handleLoadNew = async () => {
    // For demo, load a new extension (in real use, select from file or repo)
    const newExt = {
      id: "example-extension",
      name: "Example Extension",
      description: "Demonstration extension",
      active: true,
      permissions: ["read-chat"],
    };
    // You would call loadExtension(newExt, extContext) here
    setExtensions((prev) => [...prev, newExt]);
  };

  return (
    <div style={{ padding: "1.5rem", height: "100%", overflowY: "auto" }}>
      <h2>🧩 Extensions / Plugins</h2>
      <p>Manage loaded mini-modules, activate or deactivate safely.</p>

      <button
        onClick={handleLoadNew}
        style={{
          padding: "0.5rem 1rem",
          marginBottom: "1rem",
          background: "#3a3aff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ➕ Load New Extension
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {extensions.map((ext) => (
          <div
            key={ext.id}
            style={{
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: ext.active ? "#f0f4ff" : "#f9f9f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{ext.name}</div>
              {ext.description && (
                <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                  {ext.description}
                </div>
              )}
              <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                Permissions: {ext.permissions.join(", ") || "None"}
              </div>
            </div>

            <button
              onClick={() => toggleExtension(ext.id)}
              style={{
                padding: "0.3rem 0.6rem",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: ext.active ? "#ff4d4f" : "#3a3aff",
                color: "#fff",
              }}
            >
              {ext.active ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExtensionsPanel;
