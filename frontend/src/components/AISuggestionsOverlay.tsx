// frontend/src/components/AISuggestionsOverlay.tsx
import React, { useState, useEffect } from "react";

export interface Suggestion {
  id: string;
  text: string;
  command?: string;
  type?: "command" | "completion" | "insight";
  action?: () => void;
}

interface Props {
  suggestions: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
  hotkey?: string; // optional hotkey to trigger dynamic suggestions
}

const AISuggestionsOverlay: React.FC<Props> = ({ suggestions, onSelect, hotkey = " " }) => {
  const [selected, setSelected] = useState(0);
  const [visibleSuggestions, setVisibleSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    setVisibleSuggestions(suggestions);
    setSelected(0);
  }, [suggestions]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!visibleSuggestions.length) return;

      // navigation
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected(prev => (prev + 1) % visibleSuggestions.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected(prev => (prev - 1 + visibleSuggestions.length) % visibleSuggestions.length);
      }
      // select
      if (e.key === "Enter") {
        visibleSuggestions[selected]?.action?.();
        onSelect(visibleSuggestions[selected]);
        setVisibleSuggestions([]);
      }
      // dismiss
      if (e.key === "Escape") {
        setVisibleSuggestions([]);
      }

      // optional hotkey to fetch dynamic suggestions
      if (e.ctrlKey && e.key === hotkey) {
        e.preventDefault();
        // simulate dynamic suggestions, can be replaced with real API
        setVisibleSuggestions([
          { id: "1", text: "Run diagnostics", type: "command", action: () => console.log("Diagnostics run") },
          { id: "2", text: "Optimize memory usage", type: "completion", action: () => console.log("Memory optimized") },
        ]);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [visibleSuggestions, selected, onSelect, hotkey]);

  if (!visibleSuggestions.length) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "80px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "480px",
      maxHeight: "300px",
      overflowY: "auto",
      background: "#1e1e2f",
      color: "#fff",
      borderRadius: "10px",
      boxShadow: "0 0 20px rgba(0,0,0,0.5)",
      zIndex: 10000,
      fontFamily: "monospace",
    }}>
      {visibleSuggestions.map((s, i) => (
        <div
          key={s.id}
          onClick={() => { s.action?.(); onSelect(s); setVisibleSuggestions([]); }}
          style={{
            padding: "8px 16px",
            background: i === selected ? "#3a3aff" : "transparent",
            color: i === selected ? "#fff" : "#eee",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{s.text}</span>
          {s.type && <span style={{ opacity: 0.5 }}>{s.type}</span>}
        </div>
      ))}
    </div>
  );
};

export default AISuggestionsOverlay;
