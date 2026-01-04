import { KernelCapability } from "../core/capability";

export interface RemoteExecutionRequest {
  targetNode: string;
  capability: KernelCapability;
  payload: unknown;
}
