import React, { useState, useEffect, useRef } from "react";
import { eventBus } from "../../services/eventBus";

const MainChat: React.FC<{ orchestrator: any }> = ({ orchestrator }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => scrollToBottom(), [messages]);

  const sendMessage = async () => {
    if (!input) return;
    setMessages((msgs) => [...msgs, `🗨️ You: ${input}`]);
    const response = await orchestrator.sendMessage(input);
    setMessages((msgs) => [...msgs, `🤖 NeuroEdge: ${response.reply}`]);
    setInput("");
  };

  return (
    <div style={{ padding: "1rem", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#f0f0f5" }}>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: "1rem" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "2px 0" }}>{msg}</div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask anything..."
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={sendMessage} style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}>Send</button>
      </div>
    </div>
  );
};

export default MainChat;
