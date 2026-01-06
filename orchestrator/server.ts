
import WebSocket, { WebSocketServer } from "ws";
import { DevExecutionAgent } from "./agents/dev_execution_agent";
import { GitHubAgent } from "./github/github_agent";
import { EventBus } from "./core/event_bus";
import { Logger } from "./utils/logger";
import { PermissionManager } from "./utils/permissions";
import { globalKernelManager, KernelManager } from "./services/kernelManager";
import { KernelCommand } from "./services/kernelComm";

// =========================
// Initialize Core Services
// =========================
const wss = new WebSocketServer({ port: 4000 });
const eventBus = new EventBus();
const logger = new Logger("info");
const permissions = new PermissionManager();

// =========================
// Initialize Agents
// =========================
const devAgent = new DevExecutionAgent(eventBus, logger, permissions);
devAgent.start();

const githubAgent = new GitHubAgent(); // GitHub automation agent
// Add more agents as needed

// =========================
// Initialize Kernels
// =========================
globalKernelManager.addKernel("local", "http://localhost:8080"); // Default local kernel

console.log("🚀 Orchestrator WebSocket Server running on ws://localhost:4000");

// =========================
// WebSocket Connection Handler
// =========================
wss.on("connection", (ws: WebSocket) => {
  ws.on("message", async (message) => {
    try {
      const payload = JSON.parse(message.toString());
      const command = payload.command;
      const kernelId = payload.kernelId || "local"; // default kernel

      logger.info("OrchestratorServer", `Received command: ${command}`);

      // 1️⃣ ML proposes steps
      const mlProposal = await fetchMLProposal(command);

      // 2️⃣ Kernel validation & approval
      const kernelValidation = await validateWithKernel(kernelId, mlProposal);

      // 3️⃣ Execute command if approved
      let executionResult = { stdout: "", stderr: "" };
      if (kernelValidation.approved) {
        const cmd: KernelCommand = {
          id: `ws-${Date.now()}`,
          type: "execute",
          payload: { command, args: payload.args || [], cwd: payload.cwd || process.cwd() },
          metadata: { user: payload.user || "web" },
        };

        executionResult = await globalKernelManager.sendCommand(kernelId, cmd);
      }

      // 4️⃣ Send structured response to frontend
      ws.send(JSON.stringify({
        reasoning: mlProposal.explanation,
        execution: executionResult.stdout || executionResult.stderr,
        approvals: executionResult.approvals || [],
        risk: executionResult.risk || "low",
        timestamp: executionResult.timestamp,
      }));

    } catch (err: any) {
      console.error("[OrchestratorServer] WebSocket error:", err);
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

async function validateWithKernel(kernelId: string, proposal: { explanation: string }): Promise<{ approved: boolean }> {
  // Call kernel for policy / ethics validation
  // For now, simulate approval
  const health = await globalKernelManager.getAllHealth();
  console.log(`[OrchestratorServer] Kernel health for validation:`, health[kernelId] || "unknown");
  return { approved: true };
}
