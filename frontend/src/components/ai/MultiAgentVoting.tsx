import React from "react";

interface Suggestion {
  agent: string;
  text: string;
  confidence: number; // 0-100%
}

interface Props {
  suggestions: Suggestion[];
  onVote?: (agent: string) => void;
}

const MultiAgentVoting: React.FC<Props> = ({ suggestions, onVote }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {suggestions.map((s, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          <strong style={{ width: "60px" }}>{s.agent}</strong>
          <div style={{ flex: 1 }}>{s.text}</div>
          <div
            style={{
              width: "100px",
              height: "8px",
              background: "#e5e7eb",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${s.confidence}%`,
                height: "100%",
                background: "#3a3aff",
              }}
            />
          </div>
          <button
            style={{
              marginLeft: "0.5rem",
              padding: "0.25rem 0.5rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              background: "#3a3aff",
              color: "#fff",
            }}
            onClick={() => onVote?.(s.agent)}
          >
            Vote
          </button>
        </div>
      ))}
    </div>
  );
};

export default MultiAgentVoting;
