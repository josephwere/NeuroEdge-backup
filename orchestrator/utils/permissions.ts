import { ExecutionRequest } from "../types/execution";

export class PermissionManager {
  private approvedSessions: Set<string> = new Set();

  requestApproval(req: ExecutionRequest): boolean {
    if (!req.requiresApproval) return true;

    // In future: UI popup / floating chat approval
    console.warn("⚠️ EXECUTION APPROVAL REQUIRED");
    console.warn(`Command: ${req.command} ${req.args?.join(" ") || ""}`);

    return false; // default deny
  }

  approve(sessionId: string) {
    this.approvedSessions.add(sessionId);
  }

  isApproved(sessionId: string): boolean {
    return this.approvedSessions.has(sessionId);
  }
}
