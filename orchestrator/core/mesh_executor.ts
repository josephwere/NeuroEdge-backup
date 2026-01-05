import { EventBus } from "./event_bus";
import { Logger } from "./logger";
import { OrchestratorAgent } from "../types";

export class AgentManager {
  private agents: Map<string, OrchestratorAgent> = new Map();
  private eventBus: EventBus;
  private logger: Logger;

  constructor(eventBus: EventBus, logger: Logger) {
    this.eventBus = eventBus;
    this.logger = logger;
  }

  register(agent: OrchestratorAgent) {
    this.agents.set(agent.name(), agent);
    this.logger.info("AgentManager", `Registered agent: ${agent.name()}`);
  }

  startAll() {
    for (const agent of this.agents.values()) {
      agent.start();
      this.logger.info("AgentManager", `Started agent: ${agent.name()}`);
    }
  }

  emit(event: string, payload: any) {
    this.eventBus.emit(event, payload);
  }

  broadcastToMesh(event: string, payload: any) {
    // placeholder: mesh executor integration
    this.eventBus.emit(event, payload);
  }
}
