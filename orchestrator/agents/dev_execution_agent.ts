import { OrchestratorAgent } from "../core/agent_manager";
import { EventBus } from "../core/event_bus";
import { Logger } from "../utils/logger";
import { PermissionManager } from "../utils/permissions";
import { runCommand } from "../utils/shell";
import { ExecutionRequest, ExecutionResult } from "../types/execution";

export class DevExecutionAgent implements OrchestratorAgent {
  private eventBus: EventBus;
  private logger: Logger;
  private permissions: PermissionManager;

  constructor(
    eventBus: EventBus,
    logger: Logger,
    permissions: PermissionManager
  ) {
    this.eventBus = eventBus;
    this.logger = logger;
    this.permissions = permissions;
  }

  name(): string {
    return "DevExecutionAgent";
  }

  start(): void {
    this.logger.info(this.name(), "Started");

    this.eventBus.subscribe(
      "dev:execute",
      async (req: ExecutionRequest) => {
        await this.handleExecution(req);
      }
    );
  }

  private async handleExecution(req: ExecutionRequest) {
    if (!this.permissions.requestApproval(req)) {
      this.logger.warn(this.name(), "Execution blocked pending approval");
      return;
    }

    this.logger.info(
      this.name(),
      `Executing: ${req.command} ${req.args?.join(" ") || ""}`
    );

    try {
      const result = await runCommand(
        req.command,
        req.args,
        req.cwd
      );

      const response: ExecutionResult = {
        id: req.id,
        success: true,
        stdout: result.stdout,
        stderr: result.stderr
      };

      this.eventBus.emit("dev:result", response);
    } catch (err: any) {
      const response: ExecutionResult = {
        id: req.id,
        success: false,
        stdout: err.stdout || "",
        stderr: err.stderr || "Execution failed"
      };

      this.eventBus.emit("dev:result", response);
    }
  }
        }
