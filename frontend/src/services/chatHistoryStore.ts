// frontend/src/services/chatHistoryStore.ts
import React, { createContext, useContext, useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  type?: "info" | "warn" | "error" | "ml";
  timestamp: number;
}

interface Filters {
  role?: "user" | "assistant" | "system";
  type?: string;
  fromDate?: number;
  toDate?: number;
  tags?: string[];
}

interface ChatHistoryContextProps {
  messages: ChatMessage[];
  loadMore: () => void;
  setSearchQuery: (query: string, filters?: Filters) => void;
  replayMessage: (id: string) => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextProps | null>(null);

export const ChatHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allMessages, setAllMessages] = useState<ChatMessage[]>(() => {
    // load from localStorage or start empty
    const saved = localStorage.getItem("chat_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [visibleCount, setVisibleCount] = useState(50); // initial batch
  const [searchQuery, setSearchQueryState] = useState("");
  const [filters, setFilters] = useState<Filters>({});

  const filteredMessages = allMessages
    .filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(m => (!filters.role || m.role === filters.role))
    .filter(m => (!filters.type || m.type === filters.type))
    .filter(m => (!filters.fromDate || m.timestamp >= filters.fromDate))
    .filter(m => (!filters.toDate || m.timestamp <= filters.toDate));

  const messages = filteredMessages.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount(v => v + 50);
  };

  const setSearchQuery = (query: string, appliedFilters?: Filters) => {
    setSearchQueryState(query);
    if (appliedFilters) setFilters(appliedFilters);
    setVisibleCount(50);
  };

  const replayMessage = (id: string) => {
    const msg = allMessages.find(m => m.id === id);
    if (msg) {
      console.log("Replaying message:", msg);
      // integrate with orchestrator execution
    }
  };

  // persist in localStorage
  React.useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(allMessages));
  }, [allMessages]);

  return (
    <ChatHistoryContext.Provider value={{ messages, loadMore, setSearchQuery, replayMessage }}>
      {children}
    </ChatHistoryContext.Provider>
  );
};

export const useChatHistory = () => {
  const ctx = useContext(ChatHistoryContext);
  if (!ctx) throw new Error("useChatHistory must be used inside ChatHistoryProvider");
  return ctx;
};
