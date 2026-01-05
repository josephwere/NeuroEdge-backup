// frontend/src/components/MainChat.tsx
import React, { useState, useEffect, useRef } from "react";
import { chatContext } from "../../services/chatContext";
import { sendMessage } from "../../services/orchestrator_client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  type?: "info" | "warn" | "error" | "ml";
  isCode?: boolean;
  codeLanguage?: string;
  collapsible?: boolean;
  collapsibleOpen?: boolean;
}

const MainChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Load chat history
  useEffect(() => {
    const history = chatContext.getAll().map((m, i) => ({
      id: String(i),
      role: m.role,
      text: m.content,
      type: m.role === "assistant" ? "info" : "info",
      isCode: false
    }));
    setMessages(history);
  }, []);

  const scrollToBottom = () =>
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const id = Date.now().toString();
    const userMsg: Message = { id, role: "user", text: input, type: "info" };
    setMessages(m => [...m, userMsg]);
    chatContext.add({ role: "user", content: input });
    setInput("");

    try {
      const res = await sendMessage({ id, text: input, context: chatContext.getAll() });

      // ML reasoning, intent, risk
      if (res.reasoning) addMessage(`🧠 Reasoning: ${res.reasoning}`, "ml");
      if (res.intent) addMessage(`🎯 Intent: ${res.intent}`, "ml");
      if (res.risk) addMessage(`⚠️ Risk Level: ${res.risk}`, "warn");

      // Logs
      if (res.logs) res.logs.forEach((l: string) => addMessage(`[Log] ${l}`, "info"));

      // Execution results
      if (res.results) res.results.forEach((r: any) => {
        if (r.stdout.includes("```")) {
          addMessage(r.stdout, r.success ? "info" : "error", extractLanguage(r.stdout), true);
        } else {
          addMessage(r.success ? r.stdout : `❌ ${r.stderr}`, r.success ? "info" : "error");
        }
      });

    } catch (err: any) {
      addMessage(`❌ Error: ${err.message || err}`, "error");
    }
  };

  // --- Helpers ---
  const addMessage = (text: string, type?: Message["type"], codeLanguage?: string, isCode?: boolean) => {
    const id = Date.now().toString() + Math.random();
    setMessages(m => [...m, { id, text, type, isCode, codeLanguage, collapsible: isCode, collapsibleOpen: true }]);
  };

  const extractLanguage = (codeBlock: string) => {
    const match = codeBlock.match(/```(\w+)?/);
    return match ? match[1] : "text";
  };

  const toggleCollapse = (id: string) => {
    setMessages(m => m.map(msg => msg.id === id ? { ...msg, collapsibleOpen: !msg.collapsibleOpen } : msg));
  };

  const renderMessage = (msg: Message) => {
    if (msg.isCode) {
      const codeMatch = msg.text.match(/```(\w+)?\n([\s\S]*?)```/);
      const language = msg.codeLanguage || (codeMatch ? codeMatch[1] : "text");
      const code = codeMatch ? codeMatch[2] : msg.text;

      return (
        <div key={msg.id} style={{ marginBottom: "0.5rem", position: "relative" }}>
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
                {code}
              </SyntaxHighlighter>
              <button onClick={() => navigator.clipboard.writeText(code)} style={{
                marginTop: "2px",
                background: "#3a3aff",
                color: "#fff",
                border: "none",
                padding: "2px 5px",
                cursor: "pointer"
              }}>
                Copy
              </button>
            </>
          )}
        </div>
      );
    }

    let color = "#000";
    if (msg.type === "error") color = "#ff4d4f";
    else if (msg.type === "warn") color = "#faad14";
    else if (msg.type === "ml") color = "#40a9ff";
    else if (msg.role === "assistant") color = "#3a3aff";

    return <div key={msg.id} style={{ color, whiteSpace: "pre-wrap", marginBottom: "4px" }}>{msg.text}</div>;
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem", background: "#f5f5f5" }}>
        {messages.map(renderMessage)}
        <div ref={messageEndRef} />
      </div>
      <div style={{ display: "flex", padding: "0.5rem", background: "#e0e0e0" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Ask, debug, code, research…"
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={handleSend} style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem", background: "#3a3aff", color: "#fff", border: "none" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default MainChat;
