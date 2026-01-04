import { KernelCapability } from "../core/capability";

export interface RemoteExecutionRequest {
  targetNode: string;
  capability: KernelCapability;
  payload: unknown;
  id: string;
  command: string;
  args?: string[];
  targetNode: string;
  capabilityToken: string; // issued by kernel
  }
}
