import { startServer } from "@server"; // alias for server.ts
import { loadConfig } from "@config/config";
import { EventBus } from "@core/event_bus";
import { AgentManager } from "@core/agent_manager";
import { KernelBridge } from "@bridge/kernel_bridge";
import { MLBridge } from "@bridge/ml_bridge";
import { Logger } from "@utils/logger";

async function boot() {
  console.log("🚀 Starting NeuroEdge Orchestrator v1.0");

  const config = loadConfig();
  const logger = new Logger(config.logLevel);

  const eventBus = new EventBus(logger);
  const agentManager = new AgentManager(eventBus, logger);

  const kernelBridge = new KernelBridge(config.kernelUrl, eventBus, logger);
  const mlBridge = new MLBridge(config.mlUrl, eventBus, logger);

  await kernelBridge.connect();
  await mlBridge.connect();

  agentManager.start();

  startServer(config.port, eventBus, logger);

  logger.info("SYSTEM", "NeuroEdge Orchestrator is live");
}

boot().catch(err => {
  console.error("❌ Orchestrator failed to start:", err);
  process.exit(1);
});
