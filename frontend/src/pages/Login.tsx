// frontend/src/pages/Login.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* -------------------- */
/* Types */
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
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<Session["mode"]>("guest");

  /* ---------------- Load previous session ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem("neuroedge_session");
    if (saved) {
      const s: Session = JSON.parse(saved);
      setName(s.name);
      setEmail(s.email || "");
      setMode(s.mode);
      if (s.mode === "account") {
        // auto-navigate if logged in
        navigate("/");
      }
    }
  }, [navigate]);

  /* ---------------- Save session ---------------- */
  const saveSession = (s: Session) => {
    localStorage.setItem("neuroedge_session", JSON.stringify(s));
  };

  /* ---------------- Handlers ---------------- */
  const handleGuest = () => {
    const s: Session = { name: name || "Guest User", mode: "guest" };
    saveSession(s);
    navigate("/");
  };

  const handleLogin = () => {
    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }
    const s: Session = {
      name: name || email.split("@")[0],
      email,
      mode: "account",
      token: "FAKE-JWT-TOKEN-FOR-FRONTEND", // placeholder for backend JWT
    };
    saveSession(s);
    navigate("/");
  };

  return (
    <div style={container}>
      <h2 style={title}>Welcome to NeuroEdge</h2>

      {/* ---------- Name ---------- */}
      <label style={label}>Name (optional)</label>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        style={input}
        placeholder="Your display name"
      />

      {/* ---------- Email (optional for Guest) ---------- */}
      <label style={label}>Email (for full account)</label>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={input}
        placeholder="you@example.com"
      />

      <div style={buttons}>
        {/* Guest Mode */}
        <button style={guestButton} onClick={handleGuest}>
          🚀 Continue as Guest
        </button>

        {/* Account / Login */}
        <button style={loginButton} onClick={handleLogin}>
          🔐 Login / Get Started
        </button>
      </div>

      <p style={note}>
        Guest mode uses local storage only. Full account unlocks cloud sync,
        history backup, and advanced features.
      </p>
    </div>
  );
};

export default Login;

/* -------------------- */
/* Styles */
/* -------------------- */

const container: React.CSSProperties = {
  maxWidth: "480px",
  margin: "3rem auto",
  padding: "2rem",
  border: "1px solid #ddd",
  borderRadius: "12px",
  background: "#f5f6fa",
  display: "flex",
  flexDirection: "column",
};

const title: React.CSSProperties = {
  marginBottom: "1.5rem",
  textAlign: "center",
};

const label: React.CSSProperties = {
  marginTop: "0.75rem",
  fontSize: "0.9rem",
};

const input: React.CSSProperties = {
  padding: "0.5rem",
  marginTop: "0.25rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "0.9rem",
};

const buttons: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "1.5rem",
  gap: "1rem",
};

const guestButton: React.CSSProperties = {
  flex: 1,
  padding: "0.75rem",
  background: "#3a3aff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const loginButton: React.CSSProperties = {
  flex: 1,
  padding: "0.75rem",
  background: "#36cfc9",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const note: React.CSSProperties = {
  marginTop: "1rem",
  fontSize: "0.75rem",
  opacity: 0.7,
  textAlign: "center",
};
