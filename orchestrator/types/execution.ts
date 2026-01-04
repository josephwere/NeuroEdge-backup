export interface ExecutionRequest {
  id: string;
  command: string;
  args?: string[];
  cwd?: string;
  requiresApproval?: boolean; // optional, default true if missing
}

export interface ExecutionResult {
  id: string;
  success: boolean;
  stdout: string;
  stderr: string;
}
