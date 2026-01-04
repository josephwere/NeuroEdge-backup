import { KernelCapability } from "../core/capability";

export interface RemoteExecutionRequest {
  id: string;
  command: string;
  args?: string[];
  targetNode: string;        // only once
  capability: KernelCapability;
  payload: unknown;
  capabilityToken: string;   // issued by kernel
}
