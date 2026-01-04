import React from "react";
import MainChat from "./components/MainChat/MainChat";
import FloatingChat from "./components/FloatingChat/FloatingChat";

function App() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Main Chat takes majority of space */}
      <div style={{ flex: 3, borderRight: "1px solid #ccc" }}>
        <MainChat />
      </div>

      {/* Floating Chat overlay/panel */}
      <div style={{ flex: 1, position: "relative" }}>
        <FloatingChat />
      </div>
    </div>
  );
}

export default App;
