import { EventBus } from "@core/event_bus";
import { ExecutionIntent } from "@intent";
import { KernelCapability } from "@capability";

export class ControlPlane {
  constructor(private bus: EventBus) {}

  proposeIntent(intent: ExecutionIntent) {
    this.bus.emit("intent:proposed", intent);
  }

  requestApproval(intent: ExecutionIntent) {
    this.bus.emit("intent:approval_requested", intent);
  }

  issueCapability(cap: KernelCapability) {
    this.bus.emit("capability:issued", cap);
  }

  deny(intentId: string, reason: string) {
    this.bus.emit("intent:denied", { intentId, reason });
  }
}
