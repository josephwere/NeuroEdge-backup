import { OrchestratorAgent } from "../core/agent_manager";
import { EventBus } from "../core/event_bus";
import { Logger } from "../utils/logger";

export class MeshAgent implements OrchestratorAgent {
  private eventBus: EventBus;
  private logger: Logger;

  constructor(eventBus: EventBus, logger: Logger) {
    this.eventBus = eventBus;
    this.logger = logger;
  }

  name(): string {
    return "MeshAgent";
  }

  start(): void {
    this.logger.info(this.name(), "Mesh Agent started");
    this.eventBus.subscribe("dev:execute_remote", async (payload: any) => {
      this.logger.info(this.name(), `Forwarding execution to remote node: ${payload.node}`);
      // TODO: connect to node, send command, return output
    });
  }
}
