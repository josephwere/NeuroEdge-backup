import React, { useState, useEffect, useRef } from "react";
import { chatContext } from "../../services/chatContext";
import { OrchestratorClient } from "../../services/orchestrator_client";

interface ExecutionResult {
  id: string;
  success: boolean;
  stdout: string;
  stderr: string;
}

const FloatingChat: React.FC<{ orchestrator: OrchestratorClient }> = ({ orchestrator }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let x = 0, y = 0, mx = 0, my = 0;
    const down = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; document.onmousemove = move; document.onmouseup = up; };
    const move = (e: MouseEvent) => { x += e.clientX - mx; y += e.clientY - my; mx = e.clientX; my = e.clientY; el.style.transform = `translate(${x}px, ${y}px)`; };
    const up = () => { document.onmousemove = null; document.onmouseup = null; };
    el.querySelector(".header")?.addEventListener("mousedown", down);
  }, []);

  useEffect(() => { const saved = localStorage.getItem("floating_chat_logs"); if (saved) setMessages(JSON.parse(saved)); }, []);
  useEffect(() => { localStorage.setItem("floating_chat_logs", JSON.stringify(messages)); }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const context = chatContext.getAll();
    setMessages(m => [...m, `💻 ${input}`]);

    const res = await orchestrator.execute({ command: input, context });
    if (res.reasoning) setMessages(m => [...m, `🧠 Reasoning: ${res.reasoning}`]);
    if (res.intent) setMessages(m => [...m, `🎯 Intent: ${res.intent}`]);
    if (res.risk) setMessages(m => [...m, `⚠️ Risk Level: ${res.risk}`]);
    if (res.logs) res.logs.forEach((l: string) => setMessages(m => [...m, `[Log] ${l}`]));
    if (res.results) res.results.forEach((r: ExecutionResult) => setMessages(m => [...m, r.success ? r.stdout : `❌ ${r.stderr}`]));

    setInput("");
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
        justifyContent: "space-between"
      }}>
        <strong>NeuroEdge Control</strong>
        <button onClick={() => setMinimized(!minimized)}>{minimized ? "⬆️" : "⬇️"}</button>
      </div>

      {!minimized && (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: "10px", fontFamily: "monospace" }}>
            {messages.map((m, i) => <div key={i}>{m}</div>)}
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
