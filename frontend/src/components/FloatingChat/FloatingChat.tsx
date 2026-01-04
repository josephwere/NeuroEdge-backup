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

interface ApprovalRequest {
  id: string;
  message: string;
}

const FloatingChat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, pendingApprovals]);

  // --- Subscriptions ---
  useEffect(() => {
    const execSub = eventBus.subscribe("floating_chat:execution_result", (res: ExecutionResult) => {
      const output = res.success ? res.stdout : `❌ Error: ${res.stderr}`;
      setMessages((msgs) => [...msgs, `[Execution] ${output}`]);
    });

    const fixSub = eventBus.subscribe("floating_chat:fix_suggestion", (res: FixSuggestion) => {
      setMessages((msgs) => [...msgs, `[ML Fix] ${res.fixPlan}`]);
    });

    const logSub = eventBus.subscribe("floating_chat:log_stream", (log: string) => {
      setMessages((msgs) => [...msgs, `[Log] ${log}`]);
    });

    const approvalSub = eventBus.subscribe("floating_chat:approval_request", (req: ApprovalRequest) => {
      setPendingApprovals((prev) => [...prev, req]);
      setMessages((msgs) => [...msgs, `[Approval Needed] ${req.message}`]);
    });

    return () => {
      execSub.unsubscribe();
      fixSub.unsubscribe();
      logSub.unsubscribe();
      approvalSub.unsubscribe();
    };
  }, []);

  const sendCommand = async () => {
    if (!input) return;
    setMessages((msgs) => [...msgs, `💻 You: ${input}`]);

    // Emit execution request to orchestrator/backend
    const req = { id: Date.now().toString(), command: input };
    await executeCommand(req);

    setInput("");
  };

  const handleApproval = (id: string, approved: boolean) => {
    eventBus.emit("floating_chat:user_approval", { id, approved });
    setPendingApprovals((prev) => prev.filter((p) => p.id !== id));
    setMessages((msgs) => [...msgs, `📝 Proposal ${id} ${approved ? "approved ✅" : "rejected ❌"}`]);
  };

  return (
    <div style={{ padding: "1rem", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#f4f4f8" }}>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: "1rem", fontFamily: "monospace" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "2px 0" }}>{msg}</div>
        ))}
        {pendingApprovals.map((p) => (
          <div key={p.id} style={{ margin: "2px 0" }}>
            <strong>{p.message}</strong>
            <button onClick={() => handleApproval(p.id, true)} style={{ marginLeft: "0.5rem" }}>✅ Approve</button>
            <button onClick={() => handleApproval(p.id, false)} style={{ marginLeft: "0.5rem" }}>❌ Reject</button>
          </div>
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
