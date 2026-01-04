import { OrchestratorAgent } from "../core/agent_manager";
import { EventBus } from "../core/event_bus";
import { Logger } from "../utils/logger";
import { runCommand } from "../utils/shell";

import { SecureExecutionRequest, ExecutionResult } from "../types/execution";
import { KernelVerifier } from "../security/verifier";
import { ApprovalController } from "../floating/approval_controller";

export class DevExecutionAgent implements OrchestratorAgent {
  private verifier: KernelVerifier;
  private approval: ApprovalController;

  constructor(
    private eventBus: EventBus,
    private logger: Logger,
    kernelPublicKey: string
  ) {
    this.verifier = new KernelVerifier(kernelPublicKey);
    this.approval = new ApprovalController(eventBus, logger);
  }

  name(): string {
    return "DevExecutionAgent";
  }

  start(): void {
    this.logger.info(this.name(), "Started");
    this.approval.start();

    this.eventBus.subscribe(
      "dev:execute",
      async (req: SecureExecutionRequest) => {
        await this.handleExecution(req);
      }
    );
  }

  private async handleExecution(req: SecureExecutionRequest) {
    // 1️⃣ Verify kernel authority
    if (!this.verifier.verify(req.capability)) {
      this.logger.error(this.name(), "Invalid or expired kernel capability");
      return;
    }

    // 2️⃣ Request human approval (Floating Chat)
    const approved = await this.approval.requestApproval(
      req.id,
      `${req.command} ${req.args?.join(" ") || ""}`
    );

    if (!approved) {
      this.logger.warn(this.name(), "Execution denied by user");
      return;
    }

    // 3️⃣ Execute
    this.logger.info(
      this.name(),
      `Executing: ${req.command} ${req.args?.join(" ") || ""}`
    );

    try {
      const result = await runCommand(req.command, req.args, req.cwd);

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
