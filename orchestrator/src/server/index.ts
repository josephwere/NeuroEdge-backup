// orchestrator/src/server/index.ts
import express, { Request, Response } from "express";
import { WebSocketServer } from "ws";

import { DevExecutionAgent } from "@agents/dev_execution_agent";
import { GitHubAgent } from "@github/github_agent";

import { EventBus } from "@core/event_bus";
import { Logger } from "@utils/logger";
import { PermissionManager } from "@utils/permissions";

import { globalKernelManager } from "@services/kernelManager";
import { KernelCommand } from "@services/kernelComm";

import { handleChat } from "@handlers/chatHandler";
import { handleExecution } from "@handlers/executionHandler";
import { handleAIInference } from "@handlers/aiHandler";

export async function startServer(
  port: number,
  eventBus: EventBus,
  logger: Logger
) {
  const WS_PORT = port + 1000; // WebSocket port
  const REST_PORT = port;      // REST API port

  const app = express();
  const wss = new WebSocketServer({ port: WS_PORT });

  app.use(express.json());

  // Initialize permissions
  const permissions = new PermissionManager();

  // Initialize Agents
  const devAgent = new DevExecutionAgent(eventBus, logger, permissions);
  devAgent.start();

  const githubAgent = new GitHubAgent();
  // More agents can be added here

  // Initialize Kernel Manager
  globalKernelManager.addKernel("local", "http://localhost:8080");

  // REST endpoints
  app.get("/status", (_req: Request, res: Response) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });
  app.post("/chat", handleChat);
  app.post("/execute", handleExecution);
  app.post("/ai", handleAIInference);

  // Start REST API and keep process alive
  await new Promise<void>((resolve) => {
    app.listen(REST_PORT, () => {
      console.log(`🚀 REST API listening on http://localhost:${REST_PORT}`);
      resolve();
    });
  });

  // WebSocket server
  wss.on("connection", (ws) => {
    ws.on("message", async (message) => {
      try {
        const payload = JSON.parse(message.toString());
        const cmdId = `ws-${Date.now()}`;

        const kernelCommand: KernelCommand = {
          id: cmdId,
          type: "execute",
          payload: { command: payload.command },
          metadata: { user: payload.user || "websocket" },
        };

        const response = await globalKernelManager.sendCommandBalanced(kernelCommand);
        ws.send(JSON.stringify(response));
      } catch (err: any) {
        logger.error("WS", err.message);
        ws.send(JSON.stringify({ error: err.message }));
      }
    });
  });

  console.log(`🚀 WebSocket Server running on ws://localhost:${WS_PORT}`);

  // Prevent exit — keep process alive
  await new Promise(() => {});
}
