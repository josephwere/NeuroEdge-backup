// frontend/src/components/ChatSearchBar.tsx

import React from "react";

const ChatSearchBar: React.FC<{ onSearch: (q: string) => void }> = ({ onSearch }) => {
  return (
    <input
      placeholder="Search memory…"
      onChange={(e) => onSearch(e.target.value)}
      style={{
        width: "100%",
        padding: "0.5rem",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        marginBottom: "0.5rem",
        fontSize: "0.85rem",
      }}
    />
  );
};

export default ChatSearchBar;
