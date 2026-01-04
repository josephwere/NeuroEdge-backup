import React from "react";
import UnifiedChat from "./components/UnifiedChat";
import { OrchestratorClient } from "./services/orchestrator_client";

const orchestrator = new OrchestratorClient();

const App: React.FC = () => {
  return <UnifiedChat orchestrator={orchestrator} />;
};

export default App;
