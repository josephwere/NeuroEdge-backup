export type ExecutionRequest = {
  id: string;
  command: string;
  args?: string[];
  cwd?: string;
  requiresApproval: boolean;
  success: boolean;
  stdout: string;
  stderr: string;
};

types/execution.ts
