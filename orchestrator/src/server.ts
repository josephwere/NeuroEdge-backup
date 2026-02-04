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
// Configuration
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
      const commandText: string = payload.command;
      const kernelId: string = payload.kernelId || "local"; // default
      const cmdId = `ws-${Date.now()}`;

      logger.info("OrchestratorServer", `Received WS command: ${commandText}`);

      // 1️⃣ ML proposes steps (simulate for now)
      const mlProposal = await fetchMLProposal(commandText);

      // 2️⃣ Validate with kernel (simulate / check health)
      const kernelValidation = await validateWithKernel(kernelId, mlProposal);

      // 3️⃣ Create kernel command and send if approved
      let kernelResponse = { stdout: "", stderr: "", success: false, approvals: [], risk: "low", timestamp: new Date().toISOString() };
      if (kernelValidation.approved) {
        const cmd: KernelCommand = {
          id: cmdId,
          type: "execute",
          payload: { command: commandText, args: payload.args || [], cwd: payload.cwd || process.cwd() },
          metadata: { user: payload.user || "websocket" },
        };
        kernelResponse = await globalKernelManager.sendCommandBalanced(cmd);
      }

      // 4️⃣ Send structured response
      ws.send(JSON.stringify({
        id: cmdId,
        reasoning: mlProposal.explanation,
        execution: kernelResponse.stdout || kernelResponse.stderr,
        approvals: kernelResponse.approvals || [],
        risk: kernelResponse.risk || "low",
        timestamp: kernelResponse.timestamp,
      }));

    } catch (err: any) {
      logger.error("OrchestratorServer", `WS error: ${err.message}`);
      ws.send(JSON.stringify({ reasoning: "❌ Error", execution: err.message }));
    }
  });
});

// =========================
// REST Endpoints
// =========================
app.post("/chat", (req: Request, res: Response) => handleChat(req, res));
app.post("/execute", (req: Request, res: Response) => handleExecution(req, res));
app.post("/ai", (req: Request, res: Response) => handleAIInference(req, res));

// =========================
// Kernel Lifecycle Management
// =========================
app.get("/kernels", async (_req: Request, res: Response) => {
  const health = await globalKernelManager.getAllHealth();
  res.json(health);
});

app.post("/kernels", (req: Request, res: Response) => {
  const { id, baseUrl } = req.body;
  if (!id || !baseUrl) return res.status(400).json({ error: "id and baseUrl required" });
  globalKernelManager.addKernel(id, baseUrl);
  res.json({ success: true, message: `Kernel "${id}" added.` });
});

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
// Helpers (ML Proposal & Kernel Validation)
// =========================
async function fetchMLProposal(command: string): Promise<{ explanation: string }> {
  // Simulate ML reasoning
  return { explanation: `ML proposes steps to safely run: "${command}"` };
}

async function validateWithKernel(kernelId: string, proposal: { explanation: string }): Promise<{ approved: boolean }> {
  // Check kernel health
  const health = await globalKernelManager.getAllHealth();
  console.log(`[OrchestratorServer] Kernel health for "${kernelId}":`, health[kernelId] || "unknown");
  return { approved: true };
      }
