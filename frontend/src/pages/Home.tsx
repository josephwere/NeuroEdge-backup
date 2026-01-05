// frontend/src/pages/Home.tsx

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import UnifiedChat from "../components/UnifiedChat";
import ProfileSettings from "../components/ProfileSettings";
import { OrchestratorClient } from "../services/orchestrator_client";
import { useNavigate } from "react-router-dom";

/* -------------------- */
/* Types / Session */
/* -------------------- */
interface Session {
  name: string;
  email?: string;
  mode: "guest" | "account";
  token?: string;
}

/* -------------------- */
/* Component */
/* -------------------- */
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<"chat" | "dashboard" | "settings">("chat");
  const [profileOpen, setProfileOpen] = useState(false);

  /* ---------------- Load session ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem("neuroedge_session");
    if (!saved) {
      navigate("/login");
      return;
    }
    setSession(JSON.parse(saved));
  }, [navigate]);

  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  const handleNavigate = (view: "chat" | "dashboard" | "settings") => {
    setActiveView(view);
    if (view === "settings") setProfileOpen(true);
    else setProfileOpen(false);
  };

  /* ---------------- Orchestrator Client ---------------- */
  const orchestrator = new OrchestratorClient();

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        {/* Optional Dashboard */}
        {activeView === "dashboard" && (
          <div style={{ padding: "1rem", flex: 1, background: "#f5f6fa", overflowY: "auto" }}>
            <h2>Dashboard / Analytics</h2>
            <p>🚀 Chat stats, AI suggestions, and execution metrics appear here.</p>
          </div>
        )}

        {/* Chat View */}
        {activeView === "chat" && (
          <UnifiedChat orchestrator={orchestrator} />
        )}

        {/* Profile Settings Overlay */}
        {profileOpen && session && (
          <ProfileSettings
            session={session}
            onClose={() => setProfileOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
