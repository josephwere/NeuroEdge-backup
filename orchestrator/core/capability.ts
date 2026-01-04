export interface KernelCapability {
  id: string;
  issuedBy: "kernel";
  subject: string;          // agent or node
  permissions: string[];    // e.g. ["exec:local", "exec:remote"]
  expiresAt: number;
  signature: string;
}

export function isCapabilityExpired(cap: KernelCapability): boolean {
  return Date.now() > cap.expiresAt;
}
