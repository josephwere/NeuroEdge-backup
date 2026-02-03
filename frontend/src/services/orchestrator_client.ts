// frontend/src/services/orchestrator_client.ts
import { eventBus } from "@/eventBus";

interface CommandRequest {
  id: string;
  command: string;
  context?: any;
}

interface FounderMessage {
  type: "status" | "info" | "warning" | "error";
  message: string;
  timestamp?: number;
}

export class OrchestratorClient {
  /* ---------------- Send command to orchestrator ---------------- */
  async execute(req: CommandRequest) {
    // Emit command to backend or kernel
    eventBus.emit("dev:execute", req);

    // Wait for result (subscribe to result events)
    return new Promise<any>((resolve) => {
      const sub = eventBus.subscribe("dev:result", (res: any) => {
        if (res.id === req.id) {
          sub.unsubscribe();
          resolve(res);
        }
      });
    });
  }

  /* ---------------- Send message to MainChat / FloatingChat ---------------- */
  async sendMessage(msg: { id: string; text: string; context?: any }) {
    eventBus.emit("main_chat:request", msg);
    eventBus.emit("floating_chat:request", msg);
  }

  /* ---------------- FounderAssistant messaging ---------------- */
  emitFounderMessage(msg: FounderMessage) {
    eventBus.emit("founder:message", msg);
  }

  onFounderMessage(handler: (msg: FounderMessage) => void) {
    return eventBus.subscribe("founder:message", handler);
  }

  offFounderMessage(handler: (msg: FounderMessage) => void) {
    return eventBus.unsubscribe("founder:message", handler);
  }

  /* ---------------- Optional node check helper ---------------- */
  async runCheck(node: string) {
    eventBus.emit("dev:check_node", { node });
    return new Promise<{ status: string }>((resolve) => {
      const sub = eventBus.subscribe("dev:node_status", (res: any) => {
        if (res.node === node) {
          sub.unsubscribe();
          resolve(res);
        }
      });
    });
  }
  }
