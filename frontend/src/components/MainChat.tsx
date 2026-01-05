// frontend/src/components/MainChat.tsx
import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { chatContext } from "../../services/chatContext";
import { sendMessage } from "../../services/orchestrator_client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useChatHistory } from "../../services/chatHistoryStore";
import { saveToCache, getCache } from "../services/offlineCache";
// Add ChatExportMenu above chat messages
import ChatExportMenu from "./ChatExportMenu";
import { useChatHistory } from "../services/chatHistoryStore";

const { messages, importHistory } = useChatHistory();

<ChatExportMenu chatHistory={messages} onImport={importHistory} />
import { useNotifications } from "../services/notificationStore";

const { addNotification } = useNotifications();

addNotification({ message: "New AI suggestion available", type: "ai" });
addNotification({ message: "Error executing command", type: "error" });
addNotification({ message: "Chat synced successfully", type: "success" });

/* 🔹 AI Suggestions Overlay */
import AISuggestionOverlay from "./AISuggestionOverlay";
import {
  generateSuggestions,
  AISuggestion
} from "../../services/aiSuggestionEngine";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  type?: "info" | "warn" | "error" | "ml";
  isCode?: boolean;
  codeLanguage?: string;
  collapsible?: boolean;
  collapsibleOpen?: boolean;
  timestamp?: number;
}

const PAGE_SIZE = 30;

const MainChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [displayed, setDisplayed] = useState<Message[]>([]);
  const [page, setPage] = useState(0);
  const [input, setInput] = useState("");

  /* 🔹 AI suggestions state */
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  const messageEndRef = useRef<HTMLDivElement>(null);
  const { searchQuery } = useChatHistory();

  // --- Load cached messages on init ---
  useEffect(() => {
    const cached = getCache();
    if (cached.length) {
      const logs: Message[] = cached.map(c => ({
        id: c.id,
        role: c.payload.role || "assistant",
        text: c.payload.text,
        type: c.payload.type,
        timestamp: c.timestamp,
        isCode: c.payload.isCode,
        collapsible: c.payload.isCode,
        collapsibleOpen: true,
        codeLanguage: c.payload.codeLanguage
      }));
      setMessages(logs);
      setDisplayed(logs.slice(-PAGE_SIZE));
      setPage(1);
    } else {
      const history = chatContext.getAll().map((m, i) => ({
        id: String(i),
        role: m.role,
        text: m.content,
        type: "info",
        isCode: false,
        timestamp: Date.now() - (chatContext.getAll().length - i) * 1000
      }));
      setMessages(history);
      setDisplayed(history.slice(-PAGE_SIZE));
      setPage(1);
    }
  }, []);

  // --- Infinite scroll ---
  const fetchMore = () => {
    const start = messages.length - (page + 1) * PAGE_SIZE;
    const nextBatch = messages.slice(
      Math.max(0, start),
      messages.length - page * PAGE_SIZE
    );
    setDisplayed(prev => [...nextBatch, ...prev]);
    setPage(prev => prev + 1);
  };

  const scrollToBottom = () =>
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [displayed]);

  // --- 🔹 AI suggestions watcher ---
  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const s = await generateSuggestions(input, "main");
      setSuggestions(s);
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  const acceptSuggestion = (s: AISuggestion) => {
    setInput(prev => prev + " " + s.text);
    setSuggestions([]);
  };

  // --- Send message ---
  const handleSend = async () => {
    if (!input.trim()) return;

    setSuggestions([]);

    const id = Date.now().toString();
    const userMsg: Message = { id, role: "user", text: input, type: "info" };
    setMessages(m => [...m, userMsg]);
    setDisplayed(d => [...d, userMsg]);
    chatContext.add({ role: "user", content: input });

    saveToCache({
      id,
      timestamp: Date.now(),
      type: "chat",
      payload: { role: "user", text: input, type: "info" }
    });

    const userInput = input;
    setInput("");

    try {
      const res = await sendMessage({
        id,
        text: userInput,
        context: chatContext.getAll()
      });

      if (res.reasoning) addMessage(`🧠 Reasoning: ${res.reasoning}`, "ml");
      if (res.intent) addMessage(`🎯 Intent: ${res.intent}`, "ml");
      if (res.risk) addMessage(`⚠️ Risk Level: ${res.risk}`, "warn");

      if (res.logs)
        res.logs.forEach((l: string) =>
          addMessage(`[Log] ${l}`, "info")
        );

      if (res.results)
        res.results.forEach((r: any) => {
          if (r.stdout.includes("```")) {
            addMessage(
              r.stdout,
              r.success ? "info" : "error",
              extractLanguage(r.stdout),
              true
            );
          } else {
            addMessage(
              r.success ? r.stdout : `❌ ${r.stderr}`,
              r.success ? "info" : "error"
            );
          }
        });
    } catch (err: any) {
      addMessage(`❌ Error: ${err.message || err}`, "error");
    }
  };

  const addMessage = (
    text: string,
    type?: Message["type"],
    codeLanguage?: string,
    isCode?: boolean
  ) => {
    const id = Date.now().toString() + Math.random();
    const msg: Message = {
      id,
      text,
      type,
      isCode,
      codeLanguage,
      collapsible: isCode,
      collapsibleOpen: true,
      role: "assistant",
      timestamp: Date.now()
    };
    setMessages(m => [...m, msg]);
    setDisplayed(d => [...d, msg]);

    saveToCache({
      id,
      timestamp: Date.now(),
      type: "chat",
      payload: { role: "assistant", text, type, codeLanguage, isCode }
    });
  };

  const extractLanguage = (codeBlock: string) => {
    const match = codeBlock.match(/```(\w+)?/);
    return match ? match[1] : "text";
  };

  // --- Render messages ---
  const renderMessage = (msg: Message) => {
    if (msg.isCode) {
      const codeMatch = msg.text.match(/```(\w+)?\n([\s\S]*?)```/);
      const language =
        msg.codeLanguage || (codeMatch ? codeMatch[1] : "text");
      const code = codeMatch ? codeMatch[2] : msg.text;

      return (
        <div key={msg.id} style={{ marginBottom: "0.5rem" }}>
          <SyntaxHighlighter language={language} style={okaidia} showLineNumbers>
            {code}
          </SyntaxHighlighter>
        </div>
      );
    }

    return (
      <div key={msg.id} style={{ marginBottom: "4px" }}>
        {msg.text}
      </div>
    );
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        id="chatScroll"
        style={{ flex: 1, overflowY: "auto", padding: "1rem" }}
      >
        <InfiniteScroll
          dataLength={displayed.length}
          next={fetchMore}
          hasMore={displayed.length < messages.length}
          inverse
          scrollableTarget="chatScroll"
          loader={<div style={{ textAlign: "center" }}>Loading…</div>}
        >
          {displayed.map(renderMessage)}
        </InfiniteScroll>
        <div ref={messageEndRef} />
      </div>

      {/* 🔹 Input + AI Overlay */}
      <div
        style={{
          position: "relative",
          display: "flex",
          padding: "0.5rem",
          background: "#e0e0e0"
        }}
      >
        <AISuggestionOverlay
          suggestions={suggestions}
          onAccept={acceptSuggestion}
        />

        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleSend();
            if (e.key === "Tab" && suggestions.length) {
              e.preventDefault();
              acceptSuggestion(suggestions[0]);
            }
            if (e.key === "Escape") setSuggestions([]);
          }}
          placeholder="Ask, debug, code, research…"
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
