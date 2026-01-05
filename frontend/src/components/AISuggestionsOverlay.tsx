// frontend/src/components/AISuggestionsOverlay.tsx
import React, { useState, useEffect } from "react";

interface Suggestion {
  id: string;
  text: string;
  command?: string;
}

interface Props {
  onSelect: (suggestion: Suggestion) => void;
}

const AISuggestionsOverlay: React.FC<Props> = ({ onSelect }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === " ") {
        // fetch AI suggestions dynamically
        setSuggestions([
          { id: "1", text: "Run diagnostics" },
          { id: "2", text: "Optimize memory usage" },
        ]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!suggestions.length) return null;

  return (
    <div style={{
      position: "absolute",
      bottom: "100px",
      right: "20px",
      width: "300px",
      background: "#1e1e2f",
      color: "#fff",
      borderRadius: "8px",
      boxShadow: "0 0 20px rgba(0,0,0,0.5)",
      padding: "0.5rem",
      zIndex: 9999,
    }}>
      {suggestions.map(s => (
        <div key={s.id} onClick={() => onSelect(s)} style={{ padding: "0.5rem", cursor: "pointer" }}>
          {s.text}
        </div>
      ))}
    </div>
  );
};

export default AISuggestionsOverlay;
