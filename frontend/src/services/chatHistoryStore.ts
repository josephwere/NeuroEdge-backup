// frontend/src/services/chatHistoryStore.ts
import { createContext, useContext, useState, useEffect } from "react";

export interface ChatLog {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  type?: "info" | "ml" | "warn" | "error";
  timestamp: number;
  tags?: string[];
}

interface ChatHistoryState {
  logs: ChatLog[];
  addLog: (log: ChatLog) => void;
  filteredLogs: ChatLog[];
  searchLogs: (query: string, filters?: any) => void;
}

const ChatHistoryContext = createContext<ChatHistoryState | null>(null);

export const ChatHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ChatLog[]>([]);

  useEffect(() => {
    setFilteredLogs(logs); // Initially all logs
  }, [logs]);

  const addLog = (log: ChatLog) => {
    setLogs(prev => [log, ...prev]);
  };

  const searchLogs = (query: string, filters?: { type?: string; startDate?: string; endDate?: string }) => {
    let results = [...logs];

    if (query) {
      results = results.filter(l => l.text.toLowerCase().includes(query.toLowerCase()));
    }
    if (filters?.type) {
      results = results.filter(l => l.type === filters.type);
    }
    if (filters?.startDate) {
      const start = new Date(filters.startDate).getTime();
      results = results.filter(l => l.timestamp >= start);
    }
    if (filters?.endDate) {
      const end = new Date(filters.endDate).getTime();
      results = results.filter(l => l.timestamp <= end);
    }

    setFilteredLogs(results);
  };

  return (
    <ChatHistoryContext.Provider value={{ logs, addLog, filteredLogs, searchLogs }}>
      {children}
    </ChatHistoryContext.Provider>
  );
};

export const useChatHistory = () => {
  const ctx = useContext(ChatHistoryContext);
  if (!ctx) throw new Error("useChatHistory must be used inside ChatHistoryProvider");
  return ctx;
};
