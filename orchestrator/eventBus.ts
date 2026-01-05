import { EventEmitter } from "events";

class OrchestratorBus extends EventEmitter {
  emitEvent(event: string, payload: any) {
    this.emit(event, payload);
  }
  onEvent(event: string, handler: (payload: any) => void) {
    this.on(event, handler);
  }
}

export const orchestratorBus = new OrchestratorBus();
