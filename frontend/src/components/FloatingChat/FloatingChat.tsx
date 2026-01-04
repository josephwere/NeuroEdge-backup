import React, { useState, useEffect } from "react";
import { eventBus } from "../../services/eventBus";
import { executeCommand } from "../../services/api";

const FloatingChat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Listen for execution results
    eventBus.subscribe("floating_chat:execution_result", (res: any) => {
      setMessages((msgs) => [...msgs, `Result: ${JSON.stringify(res)}`]);
    });

    eventBus.subscribe("floating_chat:fix_suggestion", (res: any) => {
      setMessages((msgs) => [...msgs, `ML Fix Suggestion: ${res.fixPlan}`]);
    });
  }, []);

  const sendCommand = async () => {
    if (!input) return;
    setMessages([...messages, `You: ${input}`]);

    // Emit dev execution request
    const req = { id: Date.now().toString(), command: input };
    await executeCommand(req);

    setInput("");
  };

  return (
    <div style={{ padding: "1rem", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#f9f9f9" }}>
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
          onKeyDown={(e) => e.key === "Enter" && sendCommand()}
          placeholder="Run commands, fix issues, analyze..."
          style={{ width: "80%" }}
        />
        <button onClick={sendCommand} style={{ width: "18%", marginLeft: "2%" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default FloatingChat;
