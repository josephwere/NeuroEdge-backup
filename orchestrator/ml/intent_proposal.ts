import { ExecutionIntent } from "../core/intent";

export class MLIntentProposal {
  propose(command: string, args?: string[]): ExecutionIntent {
    return {
      id: crypto.randomUUID(),
      proposedBy: "ml",
      command,
      args,
      reason: "Required to install dependencies for requested feature",
      riskLevel: "medium",
      affectsSystem: true
    };
  }
}
