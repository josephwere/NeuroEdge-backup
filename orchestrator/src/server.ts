import express from "express";
import { WebSocketServer } from "ws";
import { EventBus } from "./core/event_bus";
import { Logger } from "./utils/logger";

export function startServer(
  port: number,
  eventBus: EventBus,
  logger: Logger
) {
  const app = express();
  app.use(express.json());

  app.get("/health", (_, res) => {
    res.json({ status: "ok", service: "orchestrator" });
  });

  const server = app.listen(port, () => {
    logger.info("SERVER", `HTTP server running on port ${port}`);
  });

  const wss = new WebSocketServer({ server });

  wss.on("connection", ws => {
    logger.info("WS", "New WebSocket connection");

    ws.on("message", data => {
      eventBus.emit("ws:message", data.toString());
    });
  });
}
