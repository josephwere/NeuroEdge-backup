import WebSocket from "ws";
import { EventBus } from "./core/event_bus";

export class MLIntegration {
  private ws: WebSocket;
  private eventBus: EventBus;

  constructor(eventBus: EventBus, mlServerUrl: string) {
    this.eventBus = eventBus;
    this.ws = new WebSocket(mlServerUrl);

    this.ws.on("open", () => {
      console.log("✅ Connected to ML orchestrator");
    });

    this.ws.on("message", (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.type === "ml:proposal") {
        // Emit event for floating chat / DevExecutionAgent
        this.eventBus.emit("ml:proposal", msg.payload);
      }
    });

    // Listen for requests from DevExecutionAgent
    this.eventBus.subscribe("ml:request", (payload) => {
      this.sendRequest(payload);
    });
  }

  private sendRequest(payload: any) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "ml:request", payload }));
    }
  }
}
