// frontend/src/components/FloatingChat.tsx
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
  type?: "info" | "warn" | "error" | "ml" | "mesh";
  codeLanguage?: string;
  isCode?: boolean;
  collapsible?: boolean;
  collapsibleOpen?: boolean;
  associatedId?: string;
}

interface ApprovalRequest {
  id: string;
  message: string;
  command?: string;
}

const FloatingChat: React.FC<{ orchestrator: OrchestratorClient }> = ({ orchestrator }) => {
  const [messages, setMessages] = useState<LogLine[]>([]);
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dragging floating chat
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
  }, []);

  // Load & save chat history
  useEffect(() => {
    const saved = localStorage.getItem("floating_chat_logs");
    if (saved) setMessages(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("floating_chat_logs", JSON.stringify(messages));
  }, [messages]);

  // --- Send Command to Orchestrator ---
  const send = async () => {
    if (!input.trim()) return;
    const context = chatContext.getAll();
    const commandId = Date.now().toString();

    setMessages(m => [...m, { id: commandId, text: `💻 ${input}`, type: "info" }]);
    setInput("");

    try {
      const res = await orchestrator.execute({ command: input, context });

      // ML reasoning and risk
      if (res.reasoning) addMessage(`🧠 Reasoning: ${res.reasoning}`, "ml");
      if (res.intent) addMessage(`🎯 Intent: ${res.intent}`, "ml");
      if (res.risk) addMessage(`⚠️ Risk Level: ${res.risk}`, "warn");

      // Logs
      if (res.logs) res.logs.forEach((l: string) => addMessage(`[Log] ${l}`, "info"));

      // Mesh execution
      if (res.meshStatus) res.meshStatus.forEach((node: any) => addMessage(`🌐 [${node.node}] ${node.status}`, "mesh"));

      // Execution results
      if (res.results) res.results.forEach((r: ExecutionResult) => {
        if (r.stdout.includes("```")) {
          // Handle code blocks
          addMessage(r.stdout, r.success ? "info" : "error", extractLanguage(r.stdout), true);
        } else {
          addMessage(r.success ? r.stdout : `❌ ${r.stderr}`, r.success ? "info" : "error");
        }
      });

      // Approval requests
      if (res.approvals) res.approvals.forEach((app: ApprovalRequest) => {
        addApproval(app);
      });

    } catch (err: any) {
      addMessage(`❌ Error: ${err.message || err}`, "error");
    }
  };

  // --- Helpers ---
  const addMessage = (text: string, type?: LogLine["type"], codeLanguage?: string, isCode?: boolean) => {
    const id = Date.now().toString() + Math.random();
    setMessages(m => [...m, { id, text, type, codeLanguage, isCode, collapsible: isCode, collapsibleOpen: true }]);
  };

  const addApproval = (app: ApprovalRequest) => {
    const id = app.id;
    setMessages(m => [...m, { id, text: `[Approval] ${app.message}`, type: "ml", associatedId: id }]);
  };

  const handleApproval = (id: string, approved: boolean) => {
    orchestrator.sendApproval({ id, approved });
    setMessages(m => m.map(msg => msg.associatedId === id ? { ...msg, text: `${msg.text} => ${approved ? "✅ Approved" : "❌ Rejected"}` } : msg));
  };

  const extractLanguage = (codeBlock: string) => {
    const match = codeBlock.match(/```(\w+)?/);
    return match ? match[1] : "text";
  };

  const toggleCollapse = (id: string) => {
    setMessages(m => m.map(msg => msg.id === id ? { ...msg, collapsibleOpen: !msg.collapsibleOpen } : msg));
  };

  const renderMessage = (msg: LogLine) => {
    if (msg.isCode) {
      const codeMatch = msg.text.match(/```(\w+)?\n([\s\S]*?)```/);
      const language = msg.codeLanguage || (codeMatch ? codeMatch[1] : "text");
      const code = codeMatch ? codeMatch[2] : msg.text;

      return (
        <div key={msg.id} style={{ marginBottom: "0.5rem" }}>
          {msg.collapsible && (
            <button onClick={() => toggleCollapse(msg.id)} style={{ marginBottom: "2px", background: "#444", color: "#fff", border: "none", cursor: "pointer" }}>
              {msg.collapsibleOpen ? "▼ Collapse" : "▶ Expand"}
            </button>
          )}
          {msg.collapsibleOpen && (
            <>
              <SyntaxHighlighter language={language} style={okaidia} showLineNumbers>
                {code}
              </SyntaxHighlighter>
              <button onClick={() => navigator.clipboard.writeText(code)} style={{ marginTop: "2px", background: "#3a3aff", color: "#fff", border: "none", padding: "2px 5px", cursor: "pointer" }}>
                Copy
              </button>
            </>
          )}
        </div>
      );
    }

    let color = "#fff";
    if (msg.type === "error") color = "#ff4d4f";
    else if (msg.type === "warn") color = "#faad14";
    else if (msg.type === "ml") color = "#40a9ff";
    else if (msg.type === "mesh") color = "#36cfc9";

    return <div key={msg.id} style={{ color, whiteSpace: "pre-wrap", marginBottom: "2px" }}>{msg.text}</div>;
  };

  return (
    <div ref={containerRef} style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "450px",
      height: minimized ? "48px" : "560px",
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
        <strong>NeuroEdge Floating Chat</strong>
        <button onClick={() => setMinimized(!minimized)}>{minimized ? "⬆️" : "⬇️"}</button>
      </div>

      {!minimized && (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: "10px", fontFamily: "monospace" }}>
            {messages.map(renderMessage)}
            {messages.filter(m => m.associatedId).map(app => (
              <div key={app.associatedId} style={{ marginTop: "4px" }}>
                <button onClick={() => handleApproval(app.associatedId!, true)} style={{ marginRight: "4px" }}>✅ Approve</button>
                <button onClick={() => handleApproval(app.associatedId!, false)}>❌ Reject</button>
              </div>
            ))}
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
