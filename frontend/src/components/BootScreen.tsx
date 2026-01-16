// frontend/src/components/BootScreen.tsx
import React, { useEffect, useState } from "react";

// Props
interface BootScreenProps {
  onDone: () => void;
}

interface BootStage {
  id: number;
  message: string;
  duration: number; // ms
  action?: () => Promise<void>;
}

const BootScreen: React.FC<BootScreenProps> = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Initializing NeuroEdge...");
  const [error, setError] = useState<string | null>(null);

  // Stages definition
  const stages: BootStage[] = [
    { id: 1, message: "Starting Kernel...", duration: 800 },
    {
      id: 2,
      message: "Checking Kernel health...",
      duration: 1200,
      action: async () => {
        try {
          const res = await fetch("/api/health");
          if (!res.ok) throw new Error("Kernel offline");
        } catch (err) {
          throw new Error("Kernel health check failed");
        }
      },
    },
    {
      id: 3,
      message: "Loading modules & AI core...",
      duration: 1500,
    },
    {
      id: 4,
      message: "Configuring local environment...",
      duration: 1000,
    },
    {
      id: 5,
      message: "NeuroEdge online 🚀",
      duration: 700,
    },
  ];

  useEffect(() => {
    const firstInstall = localStorage.getItem("neuroedge_first_install") !== "done";

    if (!firstInstall) {
      // Skip boot for returning users
      onDone();
      return;
    }

    const runStage = async (index: number) => {
      if (index >= stages.length) {
        // Boot complete
        localStorage.setItem("neuroedge_first_install", "done");
        onDone();
        return;
      }

      const stage = stages[index];
      setStatusMessage(stage.message);

      try {
        if (stage.action) await stage.action();
      } catch (err: any) {
        setError(err.message || "Unknown error");
        return;
      }

      // Increment progress smoothly
      const newProgress = Math.floor(((index + 1) / stages.length) * 100);
      setProgress(newProgress);

      // Move to next stage after duration
      setTimeout(() => runStage(index + 1), stage.duration);
    };

    runStage(0);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#1e1e2f",
        color: "#ffffff",
        fontFamily: "monospace",
        zIndex: 9999,
      }}
    >
      <div style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>
        {statusMessage}
      </div>

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
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {error && (
        <div style={{ color: "#ff4d4f", fontWeight: "bold", marginTop: "0.5rem" }}>
          ⚠️ {error}. Boot halted. Safe Mode activated.
        </div>
      )}

      {!error && (
        <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
          {progress}% complete
        </div>
      )}
    </div>
  );
};

export default BootScreen;
