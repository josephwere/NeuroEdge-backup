import React, { useState, useEffect, useRef } from "react";
import { chatContext } from "../../services/chatContext";
import { OrchestratorClient } from "../../services/orchestrator_client";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
}

const MainChat: React.FC<{ orchestrator?: OrchestratorClient }> = ({ orchestrator }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const history = chatContext.getAll().map((m, i) => ({
      id: String(i),
      role: m.role,
      text: m.content
    }));
    setMessages(history);
  }, []);

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const id = Date.now().toString();
    const userMsg: Message = { id, role: "user", text: input };
    setMessages(m => [...m, userMsg]);
    chatContext.add({ role: "user", content: input });
    setInput("");

    if (!orchestrator) return;

    try {
      const res = await orchestrator.chat({ text: input, context: chatContext.getAll() });
      setMessages(m => [...m, { id: id + "_resp", role: "assistant", text: res.text }]);
      if (res.reasoning) setMessages(m => [...m, { id: id + "_reasoning", role: "assistant", text: `🧠 Reasoning: ${res.reasoning}` }]);
      if (res.intent) setMessages(m => [...m, { id: id + "_intent", role: "assistant", text: `🎯 Intent: ${res.intent}` }]);
      if (res.risk) setMessages(m => [...m, { id: id + "_risk", role: "assistant", text: `⚠️ Risk: ${res.risk}` }]);
      chatContext.add({ role: "assistant", content: res.text });
    } catch (err: any) {
      const errorMsg: Message = { id: id + "_err", role: "assistant", text: `❌ Error: ${err.message || err}` };
      setMessages(m => [...m, errorMsg]);
      chatContext.add({ role: "assistant", content: errorMsg.text });
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem", background: "#f5f5f5" }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ marginBottom: "0.5rem", color: msg.role === "user" ? "#000" : "#3a3aff" }}>
            <strong>{msg.role === "user" ? "You" : "NeuroEdge"}:</strong> {msg.text}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <div style={{ display: "flex", padding: "0.5rem", background: "#e0e0e0" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Think, ask, research, design…"
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
