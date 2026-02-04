// orchestrator/src/index.ts
import { startServer } from "@server/index";
import { loadConfig } from "@config/config";
import { EventBus } from "@core/event_bus";
import { AgentManager } from "@core/agent_manager";
import { KernelBridge } from "@bridge/kernel_bridge";
import { MLBridge } from "@bridge/ml_bridge";
import { Logger } from "@utils/logger";

async function boot() {
  console.log("🚀 Starting NeuroEdge Orchestrator v1.0");

  // Load config
  const config = loadConfig();
  const logger = new Logger(config.logLevel);

  // Initialize core systems
  const eventBus = new EventBus(logger);
  const agentManager = new AgentManager(eventBus, logger);

  // Initialize bridges
  const kernelBridge = new KernelBridge(config.kernelUrl, eventBus, logger);
  const mlBridge = new MLBridge(config.mlUrl, eventBus, logger);

  await kernelBridge.connect();
  await mlBridge.connect();

  // Start agents
  agentManager.start();

  // Start REST + WebSocket server and keep process alive
  await startServer(config.port, eventBus, logger);

  logger.info("SYSTEM", "NeuroEdge Orchestrator is live");
}

// Catch all errors
boot().catch((err) => {
  console.error("❌ Orchestrator failed to start:", err);
  process.exit(1);
});
