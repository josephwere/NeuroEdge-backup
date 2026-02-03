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

/* -------------------- */
/* Boot Modules (3 backends aligned) */
/* -------------------- */
const modules = [
  "Kernel Core",        // kernel/health.go
  "ML Engine",          // ml/main.py
  "Command Router",     // orchestrator
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
  const [warning, setWarning] = useState<string | null>(null);

  /* -------------------- */
  /* Animate percentage */
  /* -------------------- */
  useEffect(() => {
    if (animatedProgress < progress) {
      const id = setInterval(() => {
        setAnimatedProgress(p => Math.min(p + 1, progress));
      }, 10);
      return () => clearInterval(id);
    }
  }, [progress, animatedProgress]);

  /* -------------------- */
  /* Boot Sequence */
  /* -------------------- */
  useEffect(() => {
    let logId = 0;
    let hintId = 0;

    const addLog = (message: string) =>
      setLogs(prev => [...prev, { id: logId++, message }]);

    const addHint = (message: string) =>
      setHints(prev => [
        ...prev,
        {
          id: hintId++,
          message,
          x: Math.random() * 80 + 10,
          y: Math.random() * 70 + 10,
          visible: true,
        },
      ]);

    const simulateModules = async () => {
      for (let i = 0; i < modules.length; i++) {
        const steps = 10;
        for (let j = 0; j <= steps; j++) {
          await new Promise(res => setTimeout(res, 45));
          setProgress(Math.floor(((i + j / steps) / modules.length) * 85));
        }
        addLog(`✔ ${modules[i]} ready`);
        addHint(aiHints[i % aiHints.length]);
      }
    };

    const checkKernelHealth = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);

        const res = await fetch("/api/health", {
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) throw new Error("Kernel unhealthy");

        addLog("✔ Kernel health verified");
      } catch {
        setWarning("Backend not connected — running in Offline Mode");
        addLog("⚠ Kernel not reachable (offline mode)");
      }
    };

    const runBoot = async () => {
      await simulateModules();
      await checkKernelHealth();

      setProgress(100);
      addHint("NeuroEdge online 🚀");

      setTimeout(onDone, 900);
    };

    runBoot();
  }, [onDone]);

  /* -------------------- */
  /* UI */
  /* -------------------- */
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
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
      {/* Title */}
      <div style={{ marginBottom: "1rem", fontSize: "1.3rem" }}>
        {animatedProgress < 100 ? "Booting NeuroEdge…" : "Finalizing…"}
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "60%",
          height: "14px",
          background: "#333",
          borderRadius: "7px",
          overflow: "hidden",
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

      <div style={{ fontSize: "0.85rem", opacity: 0.7, margin: "0.5rem 0 1rem" }}>
        {animatedProgress}%
      </div>

      {/* Logs */}
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
            animation: "hintFade 2s ease-in-out",
          }}
        >
          {hint.message}
        </div>
      ))}

      {/* Offline Warning */}
      {warning && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            color: "#facc15",
            fontSize: "0.8rem",
          }}
        >
          ⚠ {warning}
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            to { opacity: 1; }
          }
          @keyframes hintFade {
            0%, 100% { opacity: 0; transform: translateY(-6px); }
            50% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default BootScreen;
