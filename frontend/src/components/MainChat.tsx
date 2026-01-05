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
}

const MainChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Load history from chat context
  useEffect(() => {
    const history = chatContext.getAll().map((m, i) => ({
      id: String(i),
      role: m.role,
      text: m.content,
      type: m.role === "assistant" ? "info" : "info"
    }));
    setMessages(history);
  }, []);

  const scrollToBottom = () =>
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  // Handle responses from orchestrator
  useEffect(() => {
    const handleResponse = (res: any) => {
      const msg: Message = {
        id: res.id,
        role: "assistant",
        text: res.text,
        type: "info"
      };
      setMessages(m => [...m, msg]);
      chatContext.add({ role: "assistant", content: res.text });
    };

    // Subscribe to orchestrator event bus if exists
    // eventBus.subscribe("main_chat:response", handleResponse);

    return () => {
      // eventBus.unsubscribe("main_chat:response", handleResponse);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const id = Date.now().toString();
    const userMsg: Message = { id, role: "user", text: input, type: "info" };
    setMessages(m => [...m, userMsg]);
    chatContext.add({ role: "user", content: input });

    try {
      const res = await sendMessage({ id, text: input, context: chatContext.getAll() });

      // Parse response for logs, ML reasoning, and execution results
      if (res.reasoning) {
        setMessages(m => [...m, { id: id + "_reason", role: "assistant", text: `🧠 Reasoning: ${res.reasoning}`, type: "ml" }]);
      }
      if (res.intent) {
        setMessages(m => [...m, { id: id + "_intent", role: "assistant", text: `🎯 Intent: ${res.intent}`, type: "ml" }]);
      }
      if (res.risk) {
        setMessages(m => [...m, { id: id + "_risk", role: "assistant", text: `⚠️ Risk Level: ${res.risk}`, type: "warn" }]);
      }
      if (res.logs) {
        res.logs.forEach((l: string, i: number) => setMessages(m => [...m, { id: id + "_log" + i, role: "assistant", text: `[Log] ${l}`, type: "info" }]));
      }
      if (res.results) {
        res.results.forEach((r: any, i: number) => {
          const type = r.success ? "info" : "error";
          setMessages(m => [...m, { id: id + "_res" + i, role: "assistant", text: r.success ? r.stdout : `❌ ${r.stderr}`, type }]);
        });
      }
    } catch (err: any) {
      const errorMsg: Message = { id: id + "_err", role: "assistant", text: `❌ Error: ${err.message || err}`, type: "error" };
      setMessages(m => [...m, errorMsg]);
      chatContext.add({ role: "assistant", content: errorMsg.text });
    }

    setInput("");
  };

  // Render messages with syntax highlighting for code blocks
  const renderMessage = (msg: Message) => {
    const codeBlockMatch = msg.text.match(/```(\w+)?\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      const language = codeBlockMatch[1] || "text";
      const code = codeBlockMatch[2];
      return (
        <div key={msg.id} style={{ position: "relative", marginBottom: "8px" }}>
          <button
            onClick={() => navigator.clipboard.writeText(code)}
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              background: "#3a3aff",
              border: "none",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "10px"
            }}
          >
            Copy
          </button>
          <SyntaxHighlighter language={language} style={okaidia} showLineNumbers>
            {code}
          </SyntaxHighlighter>
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
