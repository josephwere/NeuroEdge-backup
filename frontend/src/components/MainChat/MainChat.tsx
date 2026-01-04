import React, { useState } from "react";
import { eventBus } from "../../services/eventBus";

const MainChat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;
    setMessages([...messages, `You: ${input}`]);
    eventBus.emit("main_chat:send", input);
    setInput("");
  };

  return (
    <div style={{ padding: "1rem", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: "1rem" }}>
        {messages.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          style={{ width: "80%" }}
        />
        <button onClick={sendMessage} style={{ width: "18%", marginLeft: "2%" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default MainChat;
