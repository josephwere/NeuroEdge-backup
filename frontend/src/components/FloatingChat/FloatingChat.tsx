import React, { useState, useEffect, useRef } from "react";
import { eventBus } from "../../services/eventBus";
import { executeCommand } from "../../services/api";

interface ExecutionResult {
  id: string;
  success: boolean;
  stdout: string;
  stderr: string;
}

interface FixSuggestion {
  id: string;
  fixPlan: string;
}

const FloatingChat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Listen for execution results
    eventBus.subscribe("floating_chat:execution_result", (res: ExecutionResult) => {
      const output = res.success
        ? res.stdout
        : `❌ Error: ${res.stderr}`;
      setMessages((msgs) => [...msgs, `[Execution] ${output}`]);
    });

    // Listen for ML fix suggestions
    eventBus.subscribe("floating_chat:fix_suggestion", (res: FixSuggestion) => {
      setMessages((msgs) => [...msgs, `[ML Fix] ${res.fixPlan}`]);
    });

    // Listen for live logs
    eventBus.subscribe("floating_chat:log_stream", (log: string) => {
      setMessages((msgs) => [...msgs, `[Log] ${log}`]);
    });
  }, []);

  const sendCommand = async () => {
    if (!input) return;
    setMessages([...messages, `💻 You: ${input}`]);
    
    useEffect(() => {
  // Approval requests from ML
  eventBus.subscribe("floating_chat:approval_request", (msg: string) => {
    setMessages((msgs) => [...msgs, `[Approval Needed] ${msg}`]);
  });
}, []);

const approveProposal = (id: string, approved: boolean) => {
  eventBus.emit("floating_chat:user_approval", { id, approved });
};

    // Emit execution request to orchestrator/backend
    const req = { id: Date.now().toString(), command: input };
    await executeCommand(req);

    setInput("");
  };

  return (
    <div style={{ padding: "1rem", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#f4f4f8" }}>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: "1rem", fontFamily: "monospace" }}>
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
          onKeyDown={(e) => e.key === "Enter" && sendCommand()}
          placeholder="Run commands, analyze code, fix issues..."
          style={{ flex: 1, padding: "0.5rem", fontFamily: "monospace" }}
        />
        <button onClick={sendCommand} style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default FloatingChat;
