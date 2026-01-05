// frontend/src/components/FloatingChat.tsx
import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { chatContext } from "../../services/chatContext";
import { OrchestratorClient } from "../../services/orchestrator_client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useChatHistory } from "../../services/chatHistoryStore";

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
  timestamp?: number;
}

interface ApprovalRequest {
  id: string;
  message: string;
  command?: string;
}

interface FloatingChatProps {
  orchestrator: OrchestratorClient;
  initialPosition?: { x: number; y: number };
  onPositionChange?: (pos: { x: number; y: number }) => void;
}

const PAGE_SIZE = 20;

const FloatingChat: React.FC<FloatingChatProps> = ({ orchestrator, initialPosition, onPositionChange }) => {
  const [messages, setMessages] = useState<LogLine[]>([]);
  const [displayed, setDisplayed] = useState<LogLine[]>([]);
  const [page, setPage] = useState(0);
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition || { x: 20, y: 20 });
  const { searchQuery } = useChatHistory();

  // --- Dragging ---
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let mx = 0, my = 0;
    let x = position.x, y = position.y;

    const down = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      document.onmousemove = move;
      document.onmouseup = up;
    };

    const move = (e: MouseEvent) => {
      x += e.clientX - mx; y += e.clientY - my;
      mx = e.clientX; my = e.clientY;
      setPosition({ x, y });
      onPositionChange?.({ x, y });
    };

    const up = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };

    el.querySelector(".header")?.addEventListener("mousedown", down);
    return () => el.querySelector(".header")?.removeEventListener("mousedown", down);
  }, [onPositionChange, position.x, position.y]);

  // --- Load / Save ---
  useEffect(() => {
    const saved = localStorage.getItem("floating_chat_logs");
    if (saved) {
      const all: LogLine[] = JSON.parse(saved);
      setMessages(all);
      setDisplayed(all.slice(-PAGE_SIZE));
      setPage(1);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("floating_chat_logs", JSON.stringify(messages));
  }, [messages]);

  // --- Infinite scroll ---
  const fetchMore = () => {
    const start = messages.length - (page + 1) * PAGE_SIZE;
    const nextBatch = messages.slice(Math.max(0, start), messages.length - page * PAGE_SIZE);
    setDisplayed(prev => [...nextBatch, ...prev]);
    setPage(prev => prev + 1);
  };

  // --- Send command ---
  const send = async () => {
    if (!input.trim()) return;
    const context = chatContext.getAll();

    const commandId = Date.now().toString();
    addMessage(`💻 ${input}`, "info");
    setInput("");

    try {
      const res = await orchestrator.execute({ command: input, context });

      if (res.reasoning) addMessage(`🧠 Reasoning: ${res.reasoning}`, "ml");
      if (res.intent) addMessage(`🎯 Intent: ${res.intent}`, "ml");
      if (res.risk) addMessage(`⚠️ Risk Level: ${res.risk}`, "warn");

      if (res.logs) res.logs.forEach((l: string) => addMessage(`[Log] ${l}`, "info"));
      if (res.meshStatus) res.meshStatus.forEach((node: any) => addMessage(`🌐 [${node.node}] ${node.status}`, "mesh"));

      if (res.results) res.results.forEach((r: ExecutionResult) => {
        if (r.stdout.includes("```")) {
          addMessage(r.stdout, r.success ? "info" : "error", extractLanguage(r.stdout), true);
        } else {
          addMessage(r.success ? r.stdout : `❌ ${r.stderr}`, r.success ? "info" : "error");
        }
      });

      if (res.approvals) res.approvals.forEach((app: ApprovalRequest) => addApproval(app));
    } catch (err: any) {
      addMessage(`❌ Error: ${err.message || err}`, "error");
    }
  };

  // --- Helpers ---
  const addMessage = (text: string, type?: LogLine["type"], codeLanguage?: string, isCode?: boolean) => {
    const id = Date.now().toString() + Math.random();
    const msg: LogLine = { id, text, type, codeLanguage, isCode, collapsible: isCode, collapsibleOpen: true, timestamp: Date.now() };
    setMessages(m => [...m, msg]);
    setDisplayed(d => [...d, msg]);
  };

  const addApproval = (app: ApprovalRequest) => {
    setMessages(m => [...m, { id: app.id, text: `[Approval] ${app.message}`, type: "ml", associatedId: app.id, timestamp: Date.now() }]);
  };

  const handleApproval = (id: string, approved: boolean) => {
    orchestrator.sendApproval({ id, approved });
    setMessages(m => m.map(msg =>
      msg.associatedId === id ? { ...msg, text: `${msg.text} => ${approved ? "✅ Approved" : "❌ Rejected"}` } : msg
    ));
  };

  const extractLanguage = (codeBlock: string) => {
    const match = codeBlock.match(/```(\w+)?/);
    return match ? match[1] : "text";
  };

  const toggleCollapse = (id: string) => {
    setDisplayed(d => d.map(msg => msg.id === id ? { ...msg, collapsibleOpen: !msg.collapsibleOpen } : msg));
  };

  // --- Render messages with search highlights ---
  const renderMessage = (msg: LogLine) => {
    const searchTerm = searchQuery?.toLowerCase();
    const highlightText = (text: string) => {
      if (!searchTerm) return text;
      return text.split(new RegExp(`(${searchTerm})`, "gi")).map((part, i) =>
        part.toLowerCase() === searchTerm
          ? <mark key={i} style={{ background: "#fffa65", color: "#000" }}>{part}</mark>
          : part
      );
    };

    if (msg.isCode) {
      const codeMatch = msg.text.match(/```(\w+)?\n([\s\S]*?)```/);
      const language = msg.codeLanguage || (codeMatch ? codeMatch[1] : "text");
      const code = codeMatch ? codeMatch[2] : msg.text;

      return (
        <div key={msg.id} style={{ marginBottom: "0.5rem" }}>
          {msg.collapsible && (
            <button onClick={() => toggleCollapse(msg.id)} style={{
              marginBottom: "2px",
              background: "#444",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: "4px"
            }}>
              {msg.collapsibleOpen ? "▼ Collapse" : "▶ Expand"}
            </button>
          )}
          {msg.collapsibleOpen && (
            <>
              <SyntaxHighlighter language={language} style={okaidia} showLineNumbers>
                {highlightText(code)}
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

    return (
      <div key={msg.id} style={{ color, whiteSpace: "pre-wrap", marginBottom: "2px" }}>
        {highlightText(msg.text)}
      </div>
    );
  };

  return (
    <div ref={containerRef} style={{
      position: "fixed",
      left: position.x,
      top: position.y,
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
          <div id="floatingChatScroll" style={{ flex: 1, overflowY: "auto", padding: "10px", fontFamily: "monospace" }}>
            <InfiniteScroll
              dataLength={displayed.length}
              next={fetchMore}
              hasMore={displayed.length < messages.length}
              inverse={true}
              loader={<div style={{ textAlign: "center", padding: "0.5rem" }}>Loading…</div>}
              scrollableTarget="floatingChatScroll"
            >
              {displayed.map(renderMessage)}
              {displayed.filter(m => m.associatedId).map(app => (
                <div key={app.associatedId} style={{ marginTop: "4px" }}>
                  <button onClick={() => handleApproval(app.associatedId!, true)} style={{ marginRight: "4px" }}>✅ Approve</button>
                  <button onClick={() => handleApproval(app.associatedId!, false)}>❌ Reject</button>
                </div>
              ))}
            </InfiniteScroll>
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
