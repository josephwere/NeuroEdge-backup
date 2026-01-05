import React, { useState, useEffect, useRef } from "react";
import { chatContext } from "../../services/chatContext";
import { OrchestratorClient } from "../../services/orchestrator_client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ExecutionResult {
  id: string;
  success: boolean;
  stdout: string;
  stderr: string;
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

  // Dragging
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let x = 0, y = 0, mx = 0, my = 0;
    const down = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; document.onmousemove = move; document.onmouseup = up; };
    const move = (e: MouseEvent) => { x += e.clientX - mx; y += e.clientY - my; mx = e.clientX; my = e.clientY; el.style.transform = `translate(${x}px, ${y}px)`; };
    const up = () => { document.onmousemove = null; document.onmouseup = null; };
    el.querySelector(".header")?.addEventListener("mousedown", down);
  }, []);

  // Load & save chat history
  useEffect(() => { const saved = localStorage.getItem("floating_chat_logs"); if (saved) setMessages(JSON.parse(saved)); }, []);
  useEffect(() => { localStorage.setItem("floating_chat_logs", JSON.stringify(messages)); }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const context = chatContext.getAll();
    setMessages(m => [...m, { id: Date.now().toString(), text: `💻 ${input}`, type: "info" }]);

    try {
      const res = await orchestrator.execute({ command: input, context });

      // ML reasoning
      if (res.reasoning) setMessages(m => [...m, { id: Date.now().toString(), text: `🧠 Reasoning: ${res.reasoning}`, type: "ml" }]);
      if (res.intent) setMessages(m => [...m, { id: Date.now().toString(), text: `🎯 Intent: ${res.intent}`, type: "ml" }]);
      if (res.risk) setMessages(m => [...m, { id: Date.now().toString(), text: `⚠️ Risk Level: ${res.risk}`, type: "warn" }]);

      // Logs
      if (res.logs) res.logs.forEach((l: string) => setMessages(m => [...m, { id: Date.now().toString(), text: `[Log] ${l}`, type: "info" }]));

      // Execution results
      if (res.results) res.results.forEach((r: ExecutionResult) => {
        const text = r.success ? r.stdout : `❌ ${r.stderr}`;
        setMessages(m => [...m, { id: Date.now().toString(), text, type: r.success ? "info" : "error" }]);
      });

    } catch (err: any) {
      setMessages(m => [...m, { id: Date.now().toString(), text: `❌ Error: ${err.message || err}`, type: "error" }]);
    }

    setInput("");
  };

  // Render with syntax highlighting
  const renderMessage = (msg: LogLine) => {
    const codeBlockMatch = msg.text.match(/```(\w+)?\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      const language = codeBlockMatch[1] || "text";
      const code = codeBlockMatch[2];
      return (
        <SyntaxHighlighter key={msg.id} language={language} style={okaidia} showLineNumbers>
          {code}
        </SyntaxHighlighter>
      );
    }

    let color = "#fff";
    if (msg.type === "error") color = "#ff4d4f";
    else if (msg.type === "warn") color = "#faad14";
    else if (msg.type === "ml") color = "#40a9ff";

    return <div key={msg.id} style={{ color, whiteSpace: "pre-wrap" }}>{msg.text}</div>;
  };

  return (
    <div ref={containerRef} style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "400px",
      height: minimized ? "48px" : "540px",
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
            {messages.map(renderMessage)}
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
