export interface ExecutionIntent {
  id: string;
  proposedBy: "ml" | "human";
  command: string;
  args?: string[];
  cwd?: string;

  reason: string;        // WHY this is needed
  riskLevel: "low" | "medium" | "high";
  affectsSystem: boolean;
}
