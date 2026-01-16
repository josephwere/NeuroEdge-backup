// frontend/src/components/BootScreen.tsx
import React, { useEffect, useState } from "react";

interface BootScreenProps {
  onDone: () => void;
}

interface BootLog {
  id: number;
  message: string;
}

interface FloatingHint {
  id: number;
  message: string;
  x: number;
  y: number;
  visible: boolean;
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
  "Checking Kernel nodes…",
  "Loading AI models…",
  "Ready to go!",
];

const BootScreen: React.FC<BootScreenProps> = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [logs, setLogs] = useState<BootLog[]>([]);
  const [hints, setHints] = useState<FloatingHint[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Animate percentage counter
  useEffect(() => {
    if (animatedProgress < progress) {
      const id = setInterval(() => {
        setAnimatedProgress(prev => Math.min(prev + 1, progress));
      }, 10);
      return () => clearInterval(id);
    }
  }, [progress, animatedProgress]);

  useEffect(() => {
    const firstInstall = localStorage.getItem("neuroedge_first_install") !== "done";
    if (!firstInstall) {
      onDone();
      return;
    }

    let logId = 0;
    let hintId = 0;

    const addHint = (message: string) => {
      setHints(prev => [
        ...prev,
        {
          id: hintId++,
          message,
          x: Math.random() * 80 + 10, // % of width
          y: Math.random() * 70 + 10, // % of height
          visible: true,
        },
      ]);
    };

    const runBoot = async () => {
      try {
        // Step 1: Install each module
        for (let i = 0; i < modules.length; i++) {
          const module = modules[i];
          const steps = 12;
          for (let j = 0; j <= steps; j++) {
            await new Promise(res => setTimeout(res, 50));
            setProgress(Math.floor(((i + j / steps) / modules.length) * 100));
          }

          setLogs(prev => [...prev, { id: logId++, message: `✔ ${module} loaded` }]);
          addHint(aiHints[i % aiHints.length]);
        }

        // Step 2: Kernel health check (mocked / real)
        try {
          const res = await fetch("/api/health");
          if (!res.ok) throw new Error("Kernel offline");
        } catch (err: any) {
          throw new Error("Kernel health check failed");
        }

        // Step 3: Finish boot
        setProgress(100);
        addHint("NeuroEdge online 🚀");
        localStorage.setItem("neuroedge_first_install", "done");
        setTimeout(onDone, 1000);
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
        overflow: "hidden",
      }}
    >
      {/* Animated Progress */}
      <div style={{ marginBottom: "1rem", fontSize: "1.3rem" }}>
        {animatedProgress < 100 ? "Booting NeuroEdge..." : "Finalizing..."}
      </div>
      <div
        style={{
          width: "60%",
          height: "14px",
          background: "#333",
          borderRadius: "7px",
          overflow: "hidden",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            width: `${animatedProgress}%`,
            height: "100%",
            background: "#3a3aff",
            transition: "width 0.05s linear",
          }}
        />
      </div>
      <div style={{ fontSize: "0.85rem", opacity: 0.7, marginBottom: "1rem" }}>
        {animatedProgress}%
      </div>

      {/* Log Window */}
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
          <div
            key={log.id}
            style={{
              marginBottom: "0.25rem",
              opacity: 0,
              animation: "fadeIn 0.4s forwards",
            }}
          >
            {log.message}
          </div>
        ))}
      </div>

      {/* Floating AI hints */}
      {hints.map(hint => (
        <div
          key={hint.id}
          style={{
            position: "absolute",
            top: `${hint.y}%`,
            left: `${hint.x}%`,
            background: "rgba(58, 58, 255, 0.2)",
            padding: "0.3rem 0.5rem",
            borderRadius: "4px",
            fontSize: "0.75rem",
            color: "#fff",
            whiteSpace: "nowrap",
            opacity: hint.visible ? 1 : 0,
            animation: "hintFade 2s ease-in-out",
          }}
        >
          {hint.message}
        </div>
      ))}

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

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            to { opacity: 1; }
          }
          @keyframes hintFade {
            0%, 100% { opacity: 0; transform: translateY(-5px); }
            50% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default BootScreen;
