import "./server";

import { EventBus } from "./core/event_bus";
import { Logger } from "./utils/logger";
import { PermissionManager } from "./utils/permissions";

import { DevExecutionAgent } from "./agents/dev_execution_agent";
import { MLReasoningAgent } from "./agents/ml_reasoning_agent";
import { ApprovalAgent } from "./agents/approval_agent";

// --- Core shared infrastructure ---
const eventBus = new EventBus();
const logger = new Logger("info");
const permissions = new PermissionManager(eventBus, logger);

// --- Agent initialization ---
const agents = [
  new DevExecutionAgent(eventBus, logger, permissions),
  new MLReasoningAgent(eventBus, logger),
  new ApprovalAgent(eventBus, logger, permissions),
];

// --- Start all agents ---
agents.forEach(agent => agent.start());

console.log("🧠 NeuroEdge Orchestrator Online");
