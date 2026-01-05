// frontend/src/components/ChatSearchBar.tsx
import React, { useState, useEffect } from "react";

interface ChatSearchBarProps {
  onSearch: (query: string, filters: ChatFilters) => void;
}

export interface ChatFilters {
  type?: "user" | "assistant" | "system" | "info" | "ml" | "error" | "warn";
  startDate?: string; // ISO string
  endDate?: string;   // ISO string
  tags?: string[];
}

const ChatSearchBar: React.FC<ChatSearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ChatFilters["type"]>();
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  const handleSearch = () => {
    onSearch(query, { type: typeFilter, startDate, endDate });
  };

  useEffect(() => {
    // Debounced search
    const timer = setTimeout(() => handleSearch(), 400);
    return () => clearTimeout(timer);
  }, [query, typeFilter, startDate, endDate]);

  return (
    <div style={{ display: "flex", gap: "0.5rem", padding: "0.5rem", background: "#2b2b3c", color: "#fff" }}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search chats or commands..."
        style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "none" }}
      />

      <select
        value={typeFilter || ""}
        onChange={e => setTypeFilter(e.target.value as ChatFilters["type"] || undefined)}
        style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
      >
        <option value="">All Types</option>
        <option value="user">User</option>
        <option value="assistant">Assistant</option>
        <option value="system">System</option>
        <option value="info">Info</option>
        <option value="ml">ML</option>
        <option value="warn">Warning</option>
        <option value="error">Error</option>
      </select>

      <input
        type="date"
        value={startDate || ""}
        onChange={e => setStartDate(e.target.value)}
        style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
      />
      <input
        type="date"
        value={endDate || ""}
        onChange={e => setEndDate(e.target.value)}
        style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
      />
    </div>
  );
};

export default ChatSearchBar;
