import React, { useState, useEffect, useRef } from "react";
import { eventBus } from "../../services/eventBus";
import { sendMessage } from "../../services/orchestrator_client";
import { chatContext } from "../../services/chatContext";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
}

const MainChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  /* ---------- Load persisted context ---------- */
  useEffect(() => {
    const history = chatContext.getAll().map((m, i) => ({
      id: String(i),
      role: m.role,
      text: m.content
    }));
    setMessages(history);
  }, []);

  const scrollToBottom = () =>
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  /* ---------- Receive AI responses ---------- */
  useEffect(() => {
    const sub = eventBus.subscribe("main_chat:response", (res: any) => {
      const msg: Message = {
        id: res.id,
        role: "assistant",
        text: res.text
      };

      setMessages(m => [...m, msg]);
      chatContext.add({ role: "assistant", content: res.text });
    });

    return () => sub.unsubscribe();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const id = Date.now().toString();

    const userMsg: Message = {
      id,
      role: "user",
      text: input
    };

    setMessages(m => [...m, userMsg]);
    chatContext.add({ role: "user", content: input });

    try {
      await sendMessage({
        id,
        text: input,
        context: chatContext.getAll()
      });
    } catch (err: any) {
      const errorMsg = {
        id: id + "_err",
        role: "assistant" as const,
        text: `❌ Error: ${err.message || err}`
      };

      setMessages(m => [...m, errorMsg]);
      chatContext.add({ role: "assistant", content: errorMsg.text });
    }

    setInput("");
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          background: "#f5f5f5"
        }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              marginBottom: "0.5rem",
              color:
                msg.role === "user"
                  ? "#000"
                  : msg.role === "assistant"
                  ? "#3a3aff"
                  : "#666"
            }}
          >
            <strong>
              {msg.role === "user"
                ? "You"
                : msg.role === "assistant"
                ? "NeuroEdge"
                : "System"}
              :
            </strong>{" "}
            {msg.text}
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
        <button
          onClick={handleSend}
          style={{
            marginLeft: "0.5rem",
            padding: "0.5rem 1rem",
            background: "#3a3aff",
            color: "#fff",
            border: "none"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MainChat;
