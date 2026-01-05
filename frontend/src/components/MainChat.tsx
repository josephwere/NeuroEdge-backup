// frontend/src/components/MainChat.tsx
import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { chatContext } from "../../services/chatContext";
import { sendMessage } from "../../services/orchestrator_client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useChatHistory } from "../../services/chatHistoryStore";
import { saveToCache, getCache } from "../services/offlineCache";

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
      // Fallback: load chatContext if no cache
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
    const nextBatch = messages.slice(Math.max(0, start), messages.length - page * PAGE_SIZE);
    setDisplayed(prev => [...nextBatch, ...prev]);
    setPage(prev => prev + 1);
  };

  const scrollToBottom = () =>
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [displayed]);

  // --- Send message ---
  const handleSend = async () => {
    if (!input.trim()) return;

    const id = Date.now().toString();
    const userMsg: Message = { id, role: "user", text: input, type: "info" };
    setMessages(m => [...m, userMsg]);
    setDisplayed(d => [...d, userMsg]);
    chatContext.add({ role: "user", content: input });

    // Save user message to offline cache
    saveToCache({
      id,
      timestamp: Date.now(),
      type: "chat",
      payload: { role: "user", text: input, type: "info" }
    });

    const userInput = input;
    setInput("");

    try {
      const res = await sendMessage({ id, text: userInput, context: chatContext.getAll() });

      if (res.reasoning) addMessage(`🧠 Reasoning: ${res.reasoning}`, "ml");
      if (res.intent) addMessage(`🎯 Intent: ${res.intent}`, "ml");
      if (res.risk) addMessage(`⚠️ Risk Level: ${res.risk}`, "warn");

      if (res.logs) res.logs.forEach((l: string) => addMessage(`[Log] ${l}`, "info"));

      if (res.results) res.results.forEach((r: any) => {
        if (r.stdout.includes("```")) {
          addMessage(r.stdout, r.success ? "info" : "error", extractLanguage(r.stdout), true);
        } else {
          addMessage(r.success ? r.stdout : `❌ ${r.stderr}`, r.success ? "info" : "error");
        }
      });

    } catch (err: any) {
      addMessage(`❌ Error: ${err.message || err}`, "error");
    }
  };

  // --- Add message helper (auto caches) ---
  const addMessage = (text: string, type?: Message["type"], codeLanguage?: string, isCode?: boolean) => {
    const id = Date.now().toString() + Math.random();
    const msg: Message = { id, text, type, isCode, codeLanguage, collapsible: isCode, collapsibleOpen: true, role: "assistant", timestamp: Date.now() };
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

  const toggleCollapse = (id: string) => {
    setDisplayed(d => d.map(msg => msg.id === id ? { ...msg, collapsibleOpen: !msg.collapsibleOpen } : msg));
  };

  // --- Render messages with search highlights ---
  const renderMessage = (msg: Message) => {
    const searchTerm = searchQuery?.toLowerCase();
    const highlightText = (text: string) => {
      if (!searchTerm) return text;
      return text.split(new RegExp(`(${searchTerm})`, "gi")).map((part, i) =>
        part.toLowerCase() === searchTerm
          ? <mark key={i} style={{ background: "#fffa65", color: "#000" }}>{part}</mark>
          : part
      );
    };

    if (msg.isCode) {
      const codeMatch = msg.text.match(/```(\w+)?\n([\s\S]*?)```/);
      const language = msg.codeLanguage || (codeMatch ? codeMatch[1] : "text");
      const code = codeMatch ? codeMatch[2] : msg.text;

      return (
        <div key={msg.id} style={{ marginBottom: "0.5rem", position: "relative" }}>
          {msg.collapsible && (
            <button onClick={() => toggleCollapse(msg.id)} style={{
              marginBottom: "2px",
              background: "#444",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: "4px"
            }}>
              {msg.collapsibleOpen ? "▼ Collapse" : "▶ Expand"}
            </button>
          )}
          {msg.collapsibleOpen && (
            <>
              <SyntaxHighlighter language={language} style={okaidia} showLineNumbers>
                {highlightText(code)}
              </SyntaxHighlighter>
              <button onClick={() => navigator.clipboard.writeText(code)} style={{
                marginTop: "2px",
                background: "#3a3aff",
                color: "#fff",
                border: "none",
                padding: "2px 5px",
                cursor: "pointer"
              }}>
                Copy
              </button>
            </>
          )}
        </div>
      );
    }

    let color = "#000";
    if (msg.type === "error") color = "#ff4d4f";
    else if (msg.type === "warn") color = "#faad14";
    else if (msg.type === "ml") color = "#40a9ff";
    else if (msg.role === "assistant") color = "#3a3aff";

    return <div key={msg.id} style={{ color, whiteSpace: "pre-wrap", marginBottom: "4px" }}>{highlightText(msg.text)}</div>;
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
      <div id="chatScroll" style={{ flex: 1, overflowY: "auto", padding: "1rem", background: "#f5f5f5" }}>
        <InfiniteScroll
          dataLength={displayed.length}
          next={fetchMore}
          hasMore={displayed.length < messages.length}
          inverse={true}
          loader={<div style={{ textAlign: "center", padding: "0.5rem" }}>Loading…</div>}
          scrollableTarget="chatScroll"
        >
          {displayed.map(renderMessage)}
        </InfiniteScroll>
        <div ref={messageEndRef} />
      </div>
      <div style={{ display: "flex", padding: "0.5rem", background: "#e0e0e0" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Ask, debug, code, research…"
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={handleSend} style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem", background: "#3a3aff", color: "#fff", border: "none" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default MainChat;
