// orchestrator/src/server/index.ts
import express from "express";
import { WebSocketServer } from "ws";
import { EventBus } from "@core/event_bus";
import { Logger } from "@utils/logger";

export function startServer(port: number, eventBus: EventBus, logger: Logger) {
  const app = express();
  const wss = new WebSocketServer({ port: port + 1000 }); // separate WS port

  // Middleware
  app.use(express.json());

  // REST API
  app.get("/status", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  app.listen(port, () => {
    console.log(`REST API running on http://localhost:${port}`);
  });

  // WebSocket server
  wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
      console.log("WS message:", msg.toString());
      // For now just echo back
      ws.send(`Received: ${msg.toString()}`);
    });
  });

  console.log(`WebSocket Server running on ws://localhost:${port + 1000}`);
}
