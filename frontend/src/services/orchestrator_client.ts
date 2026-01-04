import { eventBus } from "./eventBus";

interface CommandRequest {
  id: string;
  command: string;
}

export class OrchestratorClient {
  async sendCommand(req: CommandRequest) {
    // Emit to TypeScript orchestrator
    eventBus.emit("dev:execute", req);

    // Return dummy placeholder while backend executes
    return new Promise<any>((resolve) => {
      const sub = eventBus.subscribe("dev:result", (res: any) => {
        if (res.id === req.id) {
          sub.unsubscribe();
          resolve(res);
        }
      });
    });
  }

  async sendMessage(msg: { id: string; text: string }) {
    eventBus.emit("main_chat:request", msg);
  }
}
