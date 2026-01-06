import WebSocket, { WebSocketServer } from "ws";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { DevExecutionAgent } from "./agents/dev_execution_agent";
import { GitHubAgent } from "./github/github_agent";
import { EventBus } from "./core/event_bus";
import { Logger } from "./utils/logger";
import { PermissionManager } from "./utils/permissions";
import { globalKernelManager } from "./services/kernelManager";
import { KernelCommand } from "./services/kernelComm";
import { handleChat } from "./handlers/chatHandler";
import { handleExecution } from "./handlers/executionHandler";
import { handleAIInference } from "./handlers/aiHandler";

// =========================
// Initialize Core Services
// =========================
const WS_PORT = 4000;
const REST_PORT = 5000;

const wss = new WebSocketServer({ port: WS_PORT });
const app = express();
app.use(bodyParser.json());

const eventBus = new EventBus();
const logger = new Logger("info");
const permissions = new PermissionManager();

// =========================
// Initialize Agents
// =========================
const devAgent = new DevExecutionAgent(eventBus, logger, permissions);
devAgent.start();

const githubAgent = new GitHubAgent(); // GitHub automation
// Add more agents as needed

// =========================
// Initialize Kernels
// =========================
globalKernelManager.addKernel("local", "http://localhost:8080"); // Default kernel

console.log(`🚀 Orchestrator WebSocket Server running on ws://localhost:${WS_PORT}`);
console.log(`🚀 Orchestrator REST API running on http://localhost:${REST_PORT}`);

// =========================
// WebSocket Handler
// =========================
wss.on("connection", (ws: WebSocket) => {
  ws.on("message", async (message) => {
    try {
      const payload = JSON.parse(message.toString());
      const command = payload.command;
      const kernelId = payload.kernelId || "local"; // default

      logger.info("OrchestratorServer", `Received WS command: ${command}`);

      // 1️⃣ ML proposes steps
      const mlProposal = await fetchMLProposal(command);

      // 2️⃣ Kernel validation
      const kernelValidation = await validateWithKernel(kernelId, mlProposal);

      // 3️⃣ Execute if approved
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

      ws.send(JSON.stringify({
        reasoning: mlProposal.explanation,
        execution: executionResult.stdout || executionResult.stderr,
        approvals: executionResult.approvals || [],
        risk: executionResult.risk || "low",
        timestamp: executionResult.timestamp,
      }));

    } catch (err: any) {
      console.error("[OrchestratorServer] WS error:", err);
      ws.send(JSON.stringify({ reasoning: "❌ Error", execution: err.message }));
    }
  });
});

// =========================
// REST Endpoints
// =========================

// POST /chat
app.post("/chat", (req: Request, res: Response) => handleChat(req, res));

// POST /execute
app.post("/execute", (req: Request, res: Response) => handleExecution(req, res));

// POST /ai
app.post("/ai", (req: Request, res: Response) => handleAIInference(req, res));

// =========================
// Kernel Lifecycle Management Endpoints
// =========================

// GET /kernels → list all kernels and their health
app.get("/kernels", async (_req: Request, res: Response) => {
  const health = await globalKernelManager.getAllHealth();
  res.json(health);
});

// POST /kernels → add a new kernel
// Body: { id: string, baseUrl: string }
app.post("/kernels", (req: Request, res: Response) => {
  const { id, baseUrl } = req.body;
  if (!id || !baseUrl) return res.status(400).json({ error: "id and baseUrl required" });
  globalKernelManager.addKernel(id, baseUrl);
  res.json({ success: true, message: `Kernel "${id}" added.` });
});

// DELETE /kernels/:id → remove a kernel
app.delete("/kernels/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  globalKernelManager.removeKernel(id);
  res.json({ success: true, message: `Kernel "${id}" removed.` });
});

// Start REST server
app.listen(REST_PORT, () => {
  console.log(`🚀 NeuroEdge Orchestrator REST API listening on port ${REST_PORT}`);
});

// =========================
// Helpers (ML & Kernel Validation)
// =========================
async function fetchMLProposal(command: string): Promise<{ explanation: string }> {
  // Simulate ML reasoning
  return { explanation: `ML proposes steps to safely run: "${command}"` };
}

async function validateWithKernel(kernelId: string, proposal: { explanation: string }): Promise<{ approved: boolean }> {
  // Simulate approval check
  const health = await globalKernelManager.getAllHealth();
  console.log(`[OrchestratorServer] Kernel health for "${kernelId}":`, health[kernelId] || "unknown");
  return { approved: true };
                  }
