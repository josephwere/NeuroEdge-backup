import React, { useState, useEffect, useRef } from "react";
import { eventBus } from "../../eventBus";
import { OrchestratorClient } from "../../services/orchestrator_client";

interface ExecutionResult {
  id: string;
  success: boolean;
  stdout: string;
  stderr: string;
  node?: string; // optional for remote nodes
}

interface FixSuggestion {
  id: string;
  fixPlan: string;
}

interface ApprovalRequest {
  id: string;
  message: string;
}

interface Task {
  id: string;
  command: string;
  approved: boolean;
  node?: string;
}

interface FloatingChatProps {
  orchestrator: OrchestratorClient;
}

const FloatingChat: React.FC<FloatingChatProps> = ({ orchestrator }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>([]);
  const [taskQueue, setTaskQueue] = useState<Task[]>([]);
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
      const output = res.success
        ? res.stdout
        : `❌ Error${res.node ? ` [${res.node}]` : ""}: ${res.stderr}`;
      setMessages((msgs) => [...msgs, `[Execution${res.node ? `@${res.node}` : ""}] ${output}`]);
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

  // --- Command handling ---
  const sendCommand = async () => {
    if (!input.trim()) return;

    const taskId = Date.now().toString();
    const task: Task = { id: taskId, command: input, approved: false };

    setMessages((msgs) => [...msgs, `💻 You: ${input}`]);
    setTaskQueue((prev) => [...prev, task]);
    setInput("");

    // Emit for ML analysis and orchestrator execution
    eventBus.emit("floating_chat:new_task", task);
    await orchestrator.sendCommand(task.command, task.id);
  };

  const handleApproval = (id: string, approved: boolean) => {
    setPendingApprovals((prev) => prev.filter((p) => p.id !== id));
    setMessages((msgs) => [...msgs, `📝 Proposal ${id} ${approved ? "approved ✅" : "rejected ❌"}`]);
    eventBus.emit("floating_chat:user_approval", { id, approved });

    // Update taskQueue
    setTaskQueue((prev) =>
      prev.map((t) => (t.id === id ? { ...t, approved } : t))
    );
  };

  return (
    <div
      style={{
        padding: "1rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1e1e2f",
        color: "#fff",
        fontFamily: "monospace",
        borderRadius: "12px",
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", marginBottom: "1rem" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "2px 0" }}>{msg}</div>
        ))}

        {pendingApprovals.map((p) => (
          <div key={p.id} style={{ margin: "2px 0", background: "#2b2b3c", padding: "4px 8px", borderRadius: "8px" }}>
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
          style={{
            flex: 1,
            padding: "0.5rem",
            fontFamily: "monospace",
            borderRadius: "8px 0 0 8px",
            border: "none",
            outline: "none",
            background: "#2b2b3c",
            color: "#fff"
          }}
        />
        <button
          onClick={sendCommand}
          style={{
            marginLeft: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "0 8px 8px 0",
            background: "#3a3aff",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default FloatingChat;
