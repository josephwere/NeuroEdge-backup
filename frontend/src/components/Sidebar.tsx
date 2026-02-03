// frontend/src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import { useNotifications } from "@/stores/notificationStore";

/* -------------------- */
/* Types */
/* -------------------- */
export type ViewType =
  | "chat"
  | "dashboard"
  | "settings"
  | "history"
  | "extensions";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate: (view: ViewType) => void;
  unreadChats?: number;
  pendingApprovals?: number;
  user?: {
    name: string;
    mode: "guest" | "local" | "account";
  };
}

/* -------------------- */
/* Sidebar Component */
/* -------------------- */
const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  onNavigate,
  unreadChats = 0,
  pendingApprovals = 0,
  user = { name: "Guest User", mode: "local" },
}) => {
  const { notifications, addNotification, removeNotification } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  // Add initial notifications safely on mount
  useEffect(() => {
    if (notifications.length === 0) {
      addNotification({ message: "New AI suggestion available", type: "ai" });
      addNotification({ message: "Error executing command", type: "error" });
      addNotification({ message: "Chat synced successfully", type: "success" });
    }
  }, [addNotification, notifications.length]);

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
        position: "relative",
      }}
    >
      {/* ---------------- Header ---------------- */}
      <div
        style={{
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          borderBottom: "1px solid #2b2b3c",
        }}
      >
        {!collapsed && <strong style={{ fontSize: "1.1rem" }}>🧠 NeuroEdge</strong>}
        <button onClick={onToggle} title="Toggle sidebar" style={iconButton}>
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* ---------------- Profile ---------------- */}
      <div
        style={{
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          borderBottom: "1px solid #2b2b3c",
        }}
      >
        <Avatar letter={user.name[0]} />
        {!collapsed && (
          <div>
            <div style={{ fontSize: "0.9rem" }}>{user.name}</div>
            <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
              {user.mode === "guest" && "Guest mode"}
              {user.mode === "local" && "Local session"}
              {user.mode === "account" && "Signed in"}
            </div>
          </div>
        )}
      </div>

      {/* ---------------- Navigation ---------------- */}
      <div style={{ flex: 1, paddingTop: "0.5rem", position: "relative" }}>
        <NavItem icon="💬" label="Chat" collapsed={collapsed} badge={unreadChats} onClick={() => onNavigate("chat")} />
        <NavItem icon="📊" label="Dashboard" collapsed={collapsed} onClick={() => onNavigate("dashboard")} />
        <NavItem icon="⚙️" label="Settings" collapsed={collapsed} onClick={() => onNavigate("settings")} />
        <NavItem icon="🕘" label="History" collapsed={collapsed} disabled />
        <NavItem icon="🧩" label="Extensions" collapsed={collapsed} disabled />

        {/* Notifications NavItem with dropdown */}
        <div style={{ position: "relative" }}>
          <NavItem
            icon="🔔"
            label="Notifications"
            collapsed={collapsed}
            badge={notifications.length}
            onClick={() => setShowNotifications(prev => !prev)}
          />

          {!collapsed && showNotifications && notifications.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: 0,
                width: "240px",
                maxHeight: "300px",
                overflowY: "auto",
                background: "#2b2b3c",
                borderRadius: "6px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                zIndex: 50,
              }}
            >
              {notifications.map(n => (
                <div
                  key={n.id}
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #3a3aff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.8rem",
                    background:
                      n.type === "error"
                        ? "#ff4d4f33"
                        : n.type === "success"
                        ? "#52c41a33"
                        : "#3a3aff33",
                    color: n.type === "error" ? "#ff4d4f" : n.type === "success" ? "#52c41a" : "#3a3aff",
                    borderRadius: "4px",
                    margin: "4px",
                  }}
                >
                  <span>{n.message}</span>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: "bold",
                      marginLeft: "8px",
                    }}
                    onClick={() => removeNotification(n.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <NavItem icon="✅" label="Approvals" collapsed={collapsed} badge={pendingApprovals} disabled />
      </div>

      {/* ---------------- Quick Actions ---------------- */}
      <div style={{ padding: "1rem", borderTop: "1px solid #2b2b3c" }}>
        <button style={primaryAction}>➕ {!collapsed && "New Chat"}</button>
        <button style={secondaryAction}>🔐 {!collapsed && "Login / Get Started"}</button>
      </div>
    </div>
  );
};

export default Sidebar;

/* -------------------- Sub Components -------------------- */
const NavItem: React.FC<{
  icon: string;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
  disabled?: boolean;
  badge?: number;
}> = ({ icon, label, collapsed, onClick, disabled, badge }) => (
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
    {badge && badge > 0 && !collapsed && (
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

const Avatar: React.FC<{ letter: string }> = ({ letter }) => (
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
    {letter.toUpperCase()}
  </div>
);

/* -------------------- Styles -------------------- */
const iconButton: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  fontSize: "1.1rem",
};

const primaryAction: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem",
  marginBottom: "0.5rem",
  background: "#3a3aff",
  border: "none",
  borderRadius: "6px",
  color: "#fff",
  cursor: "pointer",
};

const secondaryAction: React.CSSProperties = {
  ...primaryAction,
  background: "#2b2b3c",
};
