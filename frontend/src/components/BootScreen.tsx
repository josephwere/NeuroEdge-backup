// frontend/src/components/BootScreen.tsx
import React, { useEffect, useState } from "react";

interface BootScreenProps {
  onDone: () => void;
}

interface BootLog {
  id: number;
  message: string;
}

const modules = [
  "Kernel Core",
  "ML Engine",
  "Command Router",
  "Memory Manager",
  "AI Personality",
  "Cache System",
  "Network Node",
  "User Interface",
];

const aiHints = [
  "Hello, I’m NeuroEdge 🤖",
  "Initializing AI personality...",
  "Preparing your workspace...",
  "I’ll assist with everything you need.",
  "All systems nominal.",
];

const BootScreen: React.FC<BootScreenProps> = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<BootLog[]>([]);
  const [hint, setHint] = useState<string>("Initializing NeuroEdge...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const firstInstall = localStorage.getItem("neuroedge_first_install") !== "done";
    if (!firstInstall) {
      onDone();
      return;
    }

    let logId = 0;

    const runBoot = async () => {
      try {
        // Step 1: Install each module
        for (let i = 0; i < modules.length; i++) {
          const module = modules[i];
          const steps = 12; // internal percentage steps
          for (let j = 0; j <= steps; j++) {
            await new Promise(res => setTimeout(res, 50)); // wait 50ms per step
            setProgress(Math.floor(((i + j / steps) / modules.length) * 100));
          }
          // Add log entry
          setLogs(prev => [...prev, { id: logId++, message: `✔ ${module} loaded` }]);

          // Random AI hints
          if (i < aiHints.length) setHint(aiHints[i]);
        }

        // Step 2: Kernel health check (mocked or real)
        try {
          const res = await fetch("/api/health");
          if (!res.ok) throw new Error("Kernel offline");
        } catch (err: any) {
          throw new Error("Kernel health check failed");
        }

        // Done
        setHint("NeuroEdge online 🚀");
        setProgress(100);
        localStorage.setItem("neuroedge_first_install", "done");
        setTimeout(onDone, 800);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      }
    };

    runBoot();
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#1e1e2f",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "monospace",
        zIndex: 9999,
      }}
    >
      {/* Main progress */}
      <div style={{ marginBottom: "1rem", fontSize: "1.3rem" }}>{hint}</div>
      <div
        style={{
          width: "60%",
          height: "12px",
          background: "#333",
          borderRadius: "6px",
          overflow: "hidden",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#3a3aff",
            transition: "width 0.1s linear",
          }}
        />
      </div>
      <div style={{ fontSize: "0.85rem", opacity: 0.7, marginBottom: "1rem" }}>
        {progress}%
      </div>

      {/* Log window */}
      <div
        style={{
          width: "60%",
          maxHeight: "25vh",
          overflowY: "auto",
          background: "#2b2b3c",
          padding: "0.75rem",
          borderRadius: "8px",
          fontSize: "0.8rem",
        }}
      >
        {logs.map(log => (
          <div key={log.id} style={{ marginBottom: "0.25rem" }}>
            {log.message}
          </div>
        ))}
      </div>

      {/* Error overlay */}
      {error && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            color: "#ff4d4f",
            fontWeight: "bold",
          }}
        >
          ⚠️ {error}. Boot halted. Safe Mode active.
        </div>
      )}
    </div>
  );
};

export default BootScreen;
