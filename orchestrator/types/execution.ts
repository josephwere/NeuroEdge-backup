export type ExecutionRequest = {
  id: string;
  command: string;
  args?: string[];
  cwd?: string;
  requiresApproval: boolean;
};

export type ExecutionResult = {
  id: string;
  success: boolean;
  stdout: string;
  stderr: string;
};
