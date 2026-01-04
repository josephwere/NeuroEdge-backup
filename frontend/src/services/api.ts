import { eventBus } from "./eventBus";

export const executeCommand = async (req: { id: string; command: string }) => {
  // Emit execution request to orchestrator backend
  eventBus.emit("dev:execute", req);
};
