// frontend/src/services/chatHistoryStore.ts
import React, { createContext, useContext, useState, useEffect } from "react";

/** Chat message structure */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  type?: "info" | "warn" | "error" | "ml" | "mesh";
  isCode?: boolean;
  codeLanguage?: string;
  collapsible?: boolean;
  collapsibleOpen?: boolean;
  timestamp: number;
  tags?: string[];
}

/** Filters for search */
export interface Filters {
  role?: "user" | "assistant" | "system";
  type?: string;
  fromDate?: number;
  toDate?: number;
  tags?: string[];
}

interface ChatHistoryContextProps {
  messages: ChatMessage[]; // currently visible
  allMessages: ChatMessage[]; // complete history
  addMessage: (msg: ChatMessage) => void;
  loadMore: () => void;
  setSearchQuery: (query: string, filters?: Filters) => void;
  replayMessage: (id: string) => void;
  resetHistory: () => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextProps | null>(null);

export const ChatHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allMessages, setAllMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("chat_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [visibleCount, setVisibleCount] = useState(50); // batch size
  const [searchQuery, setSearchQueryState] = useState("");
  const [filters, setFilters] = useState<Filters>({});

  /** Filtered and searched messages */
  const filteredMessages = allMessages
    .filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(m => (!filters.role || m.role === filters.role))
    .filter(m => (!filters.type || m.type === filters.type))
    .filter(m => (!filters.fromDate || m.timestamp >= filters.fromDate))
    .filter(m => (!filters.toDate || m.timestamp <= filters.toDate))
    .filter(m => (!filters.tags || filters.tags.every(tag => m.tags?.includes(tag))));

  /** Messages currently visible (for infinite scroll) */
  const messages = filteredMessages.slice(0, visibleCount);

  /** Add a new message */
  const addMessage = (msg: ChatMessage) => {
    setAllMessages(prev => [...prev, { ...msg, timestamp: Date.now() }]);
  };

  /** Load older messages */
  const loadMore = () => setVisibleCount(v => v + 50);

  /** Set search query and optional filters */
  const setSearchQuery = (query: string, appliedFilters?: Filters) => {
    setSearchQueryState(query);
    if (appliedFilters) setFilters(appliedFilters);
    setVisibleCount(50); // reset visible count on new search
  };

  /** Replay a message via orchestrator */
  const replayMessage = (id: string) => {
    const msg = allMessages.find(m => m.id === id);
    if (msg) {
      console.log("Replaying message:", msg);
      // integrate with orchestrator.execute({ command: msg.text }) if needed
    }
  };

  /** Reset entire history */
  const resetHistory = () => {
    setAllMessages([]);
    setVisibleCount(50);
    setSearchQueryState("");
    setFilters({});
    localStorage.removeItem("chat_history");
  };

  /** Persist allMessages to localStorage */
  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(allMessages));
  }, [allMessages]);

  return (
    <ChatHistoryContext.Provider
      value={{
        messages,
        allMessages,
        addMessage,
        loadMore,
        setSearchQuery,
        replayMessage,
        resetHistory,
      }}
    >
      {children}
    </ChatHistoryContext.Provider>
  );
};

/** Hook for components */
export const useChatHistory = () => {
  const ctx = useContext(ChatHistoryContext);
  if (!ctx) throw new Error("useChatHistory must be used inside ChatHistoryProvider");
  return ctx;
};
