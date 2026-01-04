import React, { useState, useEffect, useRef } from "react";
import { eventBus } from "../../services/eventBus";
import { sendMessage } from "../../services/orchestrator_client";

interface Message {
  id: string;
  text: string;
  from: "user" | "ai";
}

const MainChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    const sub = eventBus.subscribe("main_chat:response", (res: any) => {
      setMessages((msgs) => [...msgs, { id: res.id, text: res.text, from: "ai" }]);
    });

    return () => sub.unsubscribe();
  }, []);

  const handleSend = async () => {
    if (!input) return;

    const msgId = Date.now().toString();
    setMessages((msgs) => [...msgs, { id: msgId, text: input, from: "user" }]);

    try {
      await sendMessage({ id: msgId, text: input });
    } catch (err: any) {
      setMessages((msgs) => [...msgs, { id: msgId, text: `❌ Error: ${err.message || err}`, from: "ai" }]);
    }

    setInput("");
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", fontFamily: "Arial, sans-serif" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem", backgroundColor: "#f5f5f5" }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ margin: "0.25rem 0", color: msg.from === "user" ? "#000" : "#3a3aff" }}>
            <strong>{msg.from === "user" ? "You" : "NeuroEdge"}:</strong> {msg.text}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <div style={{ display: "flex", padding: "0.5rem", backgroundColor: "#e0e0e0" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask anything..."
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={handleSend} style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "#3a3aff", color: "#fff", border: "none" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default MainChat;
