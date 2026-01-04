import React from "react";
import ReactDOM from "react-dom";
import NeuroEdgeChat from "./components/NeuroEdgeChat";
import { OrchestratorClient } from "./services/orchestrator_client";

const orchestrator = new OrchestratorClient();

const App = () => <NeuroEdgeChat orchestrator={orchestrator} />;

ReactDOM.render(<App />, document.getElementById("root"));
