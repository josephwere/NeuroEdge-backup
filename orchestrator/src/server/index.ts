import WebSocket, { WebSocketServer } from "ws";
import express, { Request, Response } from "express";

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

export function startServer(port: number, eventBus: EventBus, logger: Logger) {
  const WS_PORT = port;
  const REST_PORT = port + 1000; // example, adjust

  const wss = new WebSocketServer({ port: WS_PORT });
  const app = express();
  app.use(express.json());

  const permissions = new PermissionManager();

  // Initialize Agents
  const devAgent = new DevExecutionAgent(eventBus, logger, permissions);
  devAgent.start();

  const githubAgent = new GitHubAgent();
  // more agents can be added here

  // Kernel initialization
  globalKernelManager.addKernel("local", "http://localhost:8080");

  console.log(`🚀 WS Server running on ws://localhost:${WS_PORT}`);
  console.log(`🚀 REST API running on http://localhost:${REST_PORT}`);

  // WebSocket
  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", async (message) => {
      try {
        const payload = JSON.parse(message.toString());
        const cmdId = `ws-${Date.now()}`;

        const kernelCommand: KernelCommand = {
          id: cmdId,
          type: "execute",
          payload: { command: payload.command },
          metadata: { user: payload.user || "websocket" }
        };

        const response = await globalKernelManager.sendCommandBalanced(kernelCommand);
        ws.send(JSON.stringify(response));
      } catch (err: any) {
        logger.error("WS", err.message);
        ws.send(JSON.stringify({ error: err.message }));
      }
    });
  });

  // REST endpoints
  app.post("/chat", handleChat);
  app.post("/execute", handleExecution);
  app.post("/ai", handleAIInference);

  app.listen(REST_PORT, () => {
    console.log(`🚀 NeuroEdge REST API listening on port ${REST_PORT}`);
  });
}
