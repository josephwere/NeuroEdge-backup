// frontend/src/components/Sidebar.tsx

import React from "react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate: (view: "chat" | "dashboard" | "settings") => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  onNavigate,
}) => {
  return (
    <div
      style={{
        width: collapsed ? "64px" : "240px",
        transition: "width 0.2s ease",
        background: "#1e1e2f",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* Header / Brand */}
      <div
        style={{
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          borderBottom: "1px solid #2b2b3c",
        }}
      >
        {!collapsed && (
          <strong style={{ fontSize: "1.1rem" }}>🧠 NeuroEdge</strong>
        )}
        <button
          onClick={onToggle}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1.1rem",
          }}
          title="Toggle sidebar"
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* Profile Summary */}
      <div
        style={{
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          borderBottom: "1px solid #2b2b3c",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#3a3aff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          N
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: "0.9rem" }}>Guest User</div>
            <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
              Local session
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, paddingTop: "0.5rem" }}>
        <NavItem
          icon="💬"
          label="Chat"
          collapsed={collapsed}
          onClick={() => onNavigate("chat")}
        />
        <NavItem
          icon="📊"
          label="Dashboard"
          collapsed={collapsed}
          onClick={() => onNavigate("dashboard")}
        />
        <NavItem
          icon="⚙️"
          label="Settings"
          collapsed={collapsed}
          onClick={() => onNavigate("settings")}
        />
        <NavItem
          icon="🕘"
          label="History"
          collapsed={collapsed}
          disabled
        />
        <NavItem
          icon="🧩"
          label="Extensions"
          collapsed={collapsed}
          disabled
        />
        <NavItem
          icon="🔔"
          label="Notifications"
          collapsed={collapsed}
          badge={2}
          disabled
        />
      </div>

      {/* Quick Actions */}
      <div
        style={{
          padding: "1rem",
          borderTop: "1px solid #2b2b3c",
        }}
      >
        <button
          style={actionButtonStyle}
          title="New chat"
        >
          ➕ {!collapsed && "New Chat"}
        </button>

        <button
          style={{
            ...actionButtonStyle,
            background: "#2b2b3c",
          }}
          title="Login"
        >
          🔐 {!collapsed && "Login / Get Started"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

/* -------------------- */
/* Sub Components */
/* -------------------- */

interface NavItemProps {
  icon: string;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
  disabled?: boolean;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  collapsed,
  onClick,
  disabled,
  badge,
}) => {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      style={{
        padding: "0.75rem 1rem",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        opacity: disabled ? 0.4 : 1,
        position: "relative",
      }}
    >
      <span>{icon}</span>
      {!collapsed && <span>{label}</span>}

      {badge && !collapsed && (
        <span
          style={{
            marginLeft: "auto",
            background: "#ff4d4f",
            borderRadius: "12px",
            padding: "0 6px",
            fontSize: "0.7rem",
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
};

/* -------------------- */
/* Styles */
/* -------------------- */

const actionButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem",
  marginBottom: "0.5rem",
  background: "#3a3aff",
  border: "none",
  borderRadius: "6px",
  color: "#fff",
  cursor: "pointer",
};
