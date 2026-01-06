import { KernelClient, KernelCommand, KernelResponse, KernelHealth, KernelCapabilities, KernelNode } from "./kernelComm";

/**
 * Manages multiple KernelClient instances
 * Handles lifecycle, health, capabilities, nodes, and command routing
 */
export class KernelManager {
  private kernels: Map<string, KernelClient> = new Map();

  /** -------------------- Add a new kernel -------------------- */
  addKernel(id: string, baseUrl: string) {
    if (this.kernels.has(id)) {
      console.warn(`[KernelManager] Kernel ${id} already exists`);
      return;
    }
    const client = new KernelClient(baseUrl);
    this.kernels.set(id, client);
    console.log(`[KernelManager] Added kernel "${id}" at ${baseUrl}`);
  }

  /** -------------------- Remove a kernel -------------------- */
  removeKernel(id: string) {
    if (!this.kernels.has(id)) {
      console.warn(`[KernelManager] Kernel ${id} not found`);
      return;
    }
    this.kernels.delete(id);
    console.log(`[KernelManager] Removed kernel "${id}"`);
  }

  /** -------------------- Get a specific kernel client -------------------- */
  getKernel(id: string): KernelClient | undefined {
    return this.kernels.get(id);
  }

  /** -------------------- List all kernel IDs -------------------- */
  getKernelIds(): string[] {
    return Array.from(this.kernels.keys());
  }

  /** -------------------- Fetch health from all kernels -------------------- */
  async getAllHealth(): Promise<Record<string, KernelHealth[]>> {
    const results: Record<string, KernelHealth[]> = {};
    for (const [id, client] of this.kernels.entries()) {
      try {
        results[id] = await client.getHealth();
      } catch (err) {
        console.error(`[KernelManager] Failed to fetch health for ${id}:`, err);
        results[id] = [];
      }
    }
    return results;
  }

  /** -------------------- Fetch capabilities from all kernels -------------------- */
  async getAllCapabilities(): Promise<Record<string, KernelCapabilities>> {
    const results: Record<string, KernelCapabilities> = {};
    for (const [id, client] of this.kernels.entries()) {
      try {
        results[id] = await client.getCapabilities();
      } catch (err) {
        console.error(`[KernelManager] Failed to fetch capabilities for ${id}:`, err);
        results[id] = { version: "unknown", capabilities: [], status: "offline" };
      }
    }
    return results;
  }

  /** -------------------- Fetch nodes from all kernels -------------------- */
  async getAllNodes(): Promise<Record<string, KernelNode[]>> {
    const results: Record<string, KernelNode[]> = {};
    for (const [id, client] of this.kernels.entries()) {
      try {
        results[id] = await client.getNodes();
      } catch (err) {
        console.error(`[KernelManager] Failed to fetch nodes for ${id}:`, err);
        results[id] = [];
      }
    }
    return results;
  }

  /** -------------------- Send a command to a specific kernel -------------------- */
  async sendCommand(kernelId: string, cmd: KernelCommand): Promise<KernelResponse> {
    const client = this.kernels.get(kernelId);
    if (!client) {
      console.warn(`[KernelManager] Kernel ${kernelId} not found`);
      return {
        id: cmd.id,
        success: false,
        stderr: "Kernel not found",
        timestamp: new Date().toISOString(),
      };
    }
    try {
      const res = await client.sendWithRetry(cmd);
      console.log(`[KernelManager] Command ${cmd.id} sent to kernel ${kernelId} → success: ${res.success}`);
      return res;
    } catch (err: any) {
      console.error(`[KernelManager] Command ${cmd.id} failed on kernel ${kernelId}:`, err);
      return {
        id: cmd.id,
        success: false,
        stderr: err instanceof Error ? err.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }
}

/** -------------------- Singleton instance -------------------- */
export const globalKernelManager = new KernelManager();
