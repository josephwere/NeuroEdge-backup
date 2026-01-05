import React, { useState, useEffect, useRef } from "react";
import { OrchestratorClient } from "../../services/orchestrator_client";
import { chatContext } from "../../services/chatContext";

interface ExecutionResult {
  id: string;
  success: boolean;
  stdout: string;
  stderr: string;
}

interface Proposal {
  id: string;
  reasoning: string;
  intent?: string;
  risk?: string;
}

interface LogLine {
  id: string;
  text: string;
  type?: "info" | "warn" | "error" | "ml";
}

const FloatingChat: React.FC<{ orchestrator: OrchestratorClient }> = ({ orchestrator }) => {
  const [messages, setMessages] = useState<LogLine[]>([]);
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Draggable chat
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let x = 0, y = 0, mx = 0, my = 0;
    const down = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      document.onmousemove = move;
      document.onmouseup = up;
    };
    const move = (e: MouseEvent) => {
      x += e.clientX - mx;
      y += e.clientY - my;
      mx = e.clientX;
      my = e.clientY;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const up = () => { document.onmousemove = null; document.onmouseup = null; };
    el.querySelector(".header")?.addEventListener("mousedown", down);

    return () => el.querySelector(".header")?.removeEventListener("mousedown", down);
  }, []);

  // Load logs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("floating_chat_logs");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Persist logs
  useEffect(() => { localStorage.setItem("floating_chat_logs", JSON.stringify(messages)); }, [messages]);

  useEffect(scrollToBottom, [messages]);

  // Format message with colors
  const formatMessage = (msg: LogLine) => {
    const style: React.CSSProperties = {};
    if (msg.type === "error") style.color = "#ff4d4f";
    else if (msg.type === "warn") style.color = "#faad14";
    else if (msg.type === "ml") style.color = "#40a9ff";
    return <div key={msg.id} style={{ margin: "2px 0", ...style }}>{msg.text}</div>;
  };

  // Send command to orchestrator
  const send = async () => {
    if (!input.trim()) return;

    const id = Date.now().toString();
    const context = chatContext.getAll();
    setMessages(m => [...m, { id, text: `💻 ${input}` }]);
    setInput("");

    try {
      const res = await orchestrator.execute({ command: input, context });

      // ML reasoning & proposal
      if (res.proposal) {
        const p: Proposal = res.proposal;
        setMessages(m => [...m, { id: p.id, text: `🧠 Proposal: ${p.reasoning}`, type: "ml" }]);
        if (p.intent) setMessages(m => [...m, { id: p.id + "_intent", text: `🎯 Intent: ${p.intent}`, type: "ml" }]);
        if (p.risk) setMessages(m => [...m, { id: p.id + "_risk", text: `⚠️ Risk: ${p.risk}`, type: "warn" }]);
      }

      // Logs
      if (res.logs) res.logs.forEach((l: string, i: number) =>
        setMessages(m => [...m, { id: id + "_log_" + i, text: `[Log] ${l}`, type: "info" }])
      );

      // Execution results
      if (res.results) res.results.forEach((r: ExecutionResult) =>
        setMessages(m => [...m, { id: r.id, text: r.success ? r.stdout : `❌ ${r.stderr}`, type: r.success ? "info" : "error" }])
      );

    } catch (err: any) {
      setMessages(m => [...m, { id: id + "_err", text: `❌ Error: ${err.message || err}`, type: "error" }]);
    }
  };

  return (
    <div ref={containerRef} style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "380px",
      height: minimized ? "48px" : "520px",
      background: "#1e1e2f",
      color: "#fff",
      borderRadius: "12px",
      boxShadow: "0 0 30px rgba(0,0,0,0.6)",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column"
    }}>
      <div className="header" style={{
        padding: "10px",
        cursor: "move",
        background: "#2b2b3c",
        display: "flex",
        justifyContent: "space-between",
        fontWeight: "bold"
      }}>
        NeuroEdge Control
        <button onClick={() => setMinimized(!minimized)}>{minimized ? "⬆️" : "⬇️"}</button>
      </div>

      {!minimized && (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: "10px", fontFamily: "monospace" }}>
            {messages.map(formatMessage)}
            <div ref={messageEndRef} />
          </div>
          <div style={{ display: "flex" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="execute • debug • fix • analyze"
              style={{ flex: 1, padding: "10px", background: "#2b2b3c", border: "none", color: "#fff" }}
            />
            <button onClick={send} style={{ padding: "10px", background: "#3a3aff", border: "none", color: "#fff" }}>▶</button>
          </div>
        </>
      )}
    </div>
  );
};

export default FloatingChat;
