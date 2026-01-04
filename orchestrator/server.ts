import WebSocket, { WebSocketServer } from "ws";
import { DevExecutionAgent } from "./agents/dev_execution_agent";
import { GitHubAgent } from "./github/github_agent";
import { EventBus } from "./core/event_bus";
import { Logger } from "./utils/logger";
import { PermissionManager } from "./utils/permissions";

const wss = new WebSocketServer({ port: 4000 });
const eventBus = new EventBus();
const logger = new Logger("info");
const permissions = new PermissionManager();

// Initialize Agents
const devAgent = new DevExecutionAgent(eventBus, logger, permissions);
devAgent.start();

const githubAgent = new GitHubAgent(); // can pull, push, merge, force
// Add more agents as needed

console.log("🚀 Orchestrator WebSocket Server running on ws://localhost:4000");

// Handle incoming WebSocket connections
wss.on("connection", (ws: WebSocket) => {
  ws.on("message", async (message) => {
    try {
      const payload = JSON.parse(message.toString());
      const command = payload.command;

      logger.info("OrchestratorServer", `Received command: ${command}`);

      // 1️⃣ ML proposes steps
      const mlProposal = await fetchMLProposal(command);

      // 2️⃣ Kernel validation (simulate approval)
      const kernelValidation = await validateWithKernel(mlProposal);

      // 3️⃣ Execute command if approved
      let executionResult = { stdout: "", stderr: "" };
      if (kernelValidation.approved) {
        executionResult = await devAgent.handleExecution({
          id: "web-" + Date.now(),
          command: command,
          args: payload.args || [],
          cwd: payload.cwd || process.cwd(),
        });
      }

      ws.send(JSON.stringify({
        reasoning: mlProposal.explanation,
        execution: executionResult.stdout || executionResult.stderr,
      }));
    } catch (err: any) {
      ws.send(JSON.stringify({ reasoning: "❌ Error", execution: err.message }));
    }
  });
});

// =========================
// Helpers
// =========================
async function fetchMLProposal(command: string): Promise<{ explanation: string }> {
  // Call Python ML orchestrator (via REST or local socket)
  // For now, simulate
  return {
    explanation: `ML proposes steps to safely run: "${command}"`,
  };
}

async function validateWithKernel(proposal: { explanation: string }): Promise<{ approved: boolean }> {
  // Connect to Go kernel, check policy & ethics
  // Simulate approval
  return { approved: true };
}
