import { EventBus } from "../core/event_bus";
import { Logger } from "../utils/logger";
import { ExecutionIntent } from "../core/intent";

export class FloatingChatAgent {
  constructor(
    private bus: EventBus,
    private logger: Logger
  ) {}

  name(): string {
    return "FloatingChatAgent";
  }

  start(): void {
    this.logger.info(this.name(), "Floating Chat Agent started");

    // Listen for ML intents
    this.bus.subscribe("ml:intent_proposed", (intent: ExecutionIntent) => {
      this.presentIntent(intent);
    });

    // Listen for execution results
    this.bus.subscribe("dev:result", (result: any) => {
      this.displayExecutionResult(result);
    });
  }

  private presentIntent(intent: ExecutionIntent) {
    this.logger.info(
      this.name(),
      `Intent proposed: ${intent.command} (${intent.riskLevel})`
    );

    // Send to UI layer (floating window)
    this.bus.emit("ui:floating:show_intent", {
      id: intent.id,
      command: intent.command,
      args: intent.args,
      reason: intent.reason,
      risk: intent.riskLevel
    });
  }

  approveIntent(intentId: string) {
    this.logger.info(this.name(), `Intent approved: ${intentId}`);
    this.bus.emit("intent:approved", intentId);
  }

  rejectIntent(intentId: string) {
    this.logger.warn(this.name(), `Intent rejected: ${intentId}`);
    this.bus.emit("intent:rejected", intentId);
  }

  private displayExecutionResult(result: any) {
    this.bus.emit("ui:floating:execution_result", result);
  }
    }
