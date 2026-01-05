import React from "react";

export type UserMode = "dev" | "researcher" | "creator";

interface Props {
  mode: UserMode;
  children: React.ReactNode;
}

const ContextAwareUI: React.FC<Props> = ({ mode, children }) => {
  const background = {
    dev: "#f0f4ff",
    researcher: "#fffaf0",
    creator: "#f0fff4",
  }[mode];

  return (
    <div style={{ background, minHeight: "100%", transition: "background 0.3s" }}>
      {children}
    </div>
  );
};

export default ContextAwareUI;
