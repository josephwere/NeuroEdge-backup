import React, { useState, useEffect, useRef } from "react";
import { eventBus } from "../../services/eventBus";
import { executeCommand } from "../../services/orchestrator_client";

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

const FloatingChat: React.FC<{ orchestrator: any }> = ({ orchestrator }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => scrollToBottom(), [messages, pendingApprovals]);

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
    const req = { id: Date.now().toString(), command: input };

    // Emit command to backend / ML orchestrator
    try {
      const response = await executeCommand(req);

      // Show reasoning & auto-fix suggestions
      if (response.reasoning) setMessages((msgs) => [...msgs, `🧠 Reasoning: ${response.reasoning}`]);
      if (response.fixes) response.fixes.forEach((fix: string) => setMessages((msgs) => [...msgs, `🛠️ Suggested Fix: ${fix}`]));

      // Stream logs
      if (response.logs) response.logs.forEach((log: string) => setMessages((msgs) => [...msgs, `[Log] ${log}`]));

      // Handle remote nodes execution results
      if (response.remoteResults) {
        response.remoteResults.forEach((r: ExecutionResult) =>
          setMessages((msgs) => [...msgs, `[Node ${r.id}] ${r.success ? r.stdout : `❌ ${r.stderr}`}`])
        );
      }
    } catch (err: any) {
      setMessages((msgs) => [...msgs, `❌ Execution error: ${err.message || err}`]);
    }

    setInput("");
  };

  const handleApproval = (id: string, approved: boolean) => {
    eventBus.emit("floating_chat:user_approval", { id, approved });
    setPendingApprovals((prev) => prev.filter((p) => p.id !== id));
    setMessages((msgs) => [...msgs, `📝 Proposal ${id} ${approved ? "approved ✅" : "rejected ❌"}`]);
  };

  return (
    <div style={{ padding: "1rem", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#1e1e2f", color: "#fff" }}>
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
          placeholder="Run commands, debug code, analyze logs, fix issues..."
          style={{ flex: 1, padding: "0.5rem", fontFamily: "monospace", backgroundColor: "#2b2b3c", color: "#fff", border: "none", borderRadius: "6px 0 0 6px" }}
        />
        <button onClick={sendCommand} style={{ padding: "0.5rem 1rem", backgroundColor: "#3a3aff", color: "#fff", border: "none", borderRadius: "0 6px 6px 0" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default FloatingChat;
