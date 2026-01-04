// orchestrator/agents/floating_chat_agent.ts
import { EventBus } from "../core/event_bus";
import { Logger } from "../utils/logger";
import { DevExecutionAgent } from "./dev_execution_agent";
import { NodeManager, MeshNode } from "../mesh/node_manager";
import { MeshExecutor } from "../mesh/mesh_executor";
import { PermissionManager } from "../utils/permissions";

export class FloatingChatAgent {
  private eventBus: EventBus;
  private logger: Logger;
  private devAgent: DevExecutionAgent;
  private meshExecutor: MeshExecutor;
  private nodeManager: NodeManager;
  private permissions: PermissionManager;

  constructor(
    eventBus: EventBus,
    logger: Logger,
    devAgent: DevExecutionAgent,
    nodeManager: NodeManager,
    meshExecutor: MeshExecutor,
    permissions: PermissionManager
  ) {
    this.eventBus = eventBus;
    this.logger = logger;
    this.devAgent = devAgent;
    this.nodeManager = nodeManager;
    this.meshExecutor = meshExecutor;
    this.permissions = permissions;
  }

  name(): string {
    return "FloatingChatAgent";
  }

  start(): void {
    this.logger.info(this.name(), "Started");

    // Listen for commands from user / ML
    this.eventBus.subscribe("chat:command", async (payload: any) => {
      await this.handleCommand(payload.command, payload.context);
    });
  }
  //  (partial)
async handleAnalysisOutput(output: string, autoFix: boolean = true) {
  this.logger.info(this.name(), `Analysis output: ${output}`);
  if (autoFix) {
    await this.executor.handleExecution({ id: Date.now().toString(), command: output });
  }
}
  // (add method)
async requestApproval(proposal: any): Promise<boolean> {
  // In final UI, you would show the command + reason + context to user
  this.logger.info(this.name(), `Requesting approval for ML command: ${proposal.command}`);
  // For now auto-approve (can later integrate with UI prompt)
  return true;
}

  private async handleCommand(command: string, context?: string) {
    this.logger.info(this.name(), `Received command: ${command}`);

    // Run locally first if allowed
    if (this.permissions.requestApproval({ command })) {
      this.logger.info(this.name(), `Executing locally: ${command}`);
      this.eventBus.emit("dev:execute", { id: Date.now(), command });
    } else {
      this.logger.warn(this.name(), `Local execution blocked: ${command}`);
    }

    // Broadcast to remote nodes
    const onlineNodes: MeshNode[] = this.nodeManager.getOnlineNodes();
    if (onlineNodes.length > 0) {
      this.logger.info(this.name(), `Broadcasting command to ${onlineNodes.length} nodes`);
      await this.meshExecutor.broadcastCommand(command, context);
    } else {
      this.logger.info(this.name(), "No online mesh nodes available");
    }
  }
                            }
