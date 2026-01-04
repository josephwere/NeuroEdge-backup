import { EventBus } from "../core/event_bus";
import { Logger } from "../utils/logger";

export class MeshExecutionAgent {
  constructor(
    private bus: EventBus,
    private logger: Logger
  ) {}

  start() {
    this.bus.subscribe("intent:approved", async (intent: any) => {
      if (intent.target !== "mesh") return;

      this.logger.info("MeshExecution", `Dispatching to node ${intent.nodeId}`);

      // placeholder transport
      this.bus.emit("mesh:execute", intent);
    });
  }
}
