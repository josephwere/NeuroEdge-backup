import { KernelClient, KernelCommand, KernelResponse, KernelHealth, KernelCapabilities, KernelNode } from "./kernelComm";

/**
 * Manages multiple KernelClient instances
 */
export class KernelManager {
  private kernels: Map<string, KernelClient> = new Map();

  /** Add a new kernel by ID and base URL */
  addKernel(id: string, baseUrl: string) {
    if (this.kernels.has(id)) return;
    const client = new KernelClient(baseUrl);
    this.kernels.set(id, client);
    console.log(`[KernelManager] Added kernel ${id} at ${baseUrl}`);
  }

  /** Remove a kernel */
  removeKernel(id: string) {
    if (!this.kernels.has(id)) return;
    this.kernels.delete(id);
    console.log(`[KernelManager] Removed kernel ${id}`);
  }

  /** Get a specific kernel client */
  getKernel(id: string): KernelClient | undefined {
    return this.kernels.get(id);
  }

  /** Get all kernel IDs */
  getKernelIds(): string[] {
    return Array.from(this.kernels.keys());
  }

  /** Get health from all kernels */
  async getAllHealth(): Promise<Record<string, KernelHealth[]>> {
    const results: Record<string, KernelHealth[]> = {};
    for (const [id, client] of this.kernels.entries()) {
      results[id] = await client.getHealth();
    }
    return results;
  }

  /** Get capabilities from all kernels */
  async getAllCapabilities(): Promise<Record<string, KernelCapabilities>> {
    const results: Record<string, KernelCapabilities> = {};
    for (const [id, client] of this.kernels.entries()) {
      results[id] = await client.getCapabilities();
    }
    return results;
  }

  /** Get nodes from all kernels */
  async getAllNodes(): Promise<Record<string, KernelNode[]>> {
    const results: Record<string, KernelNode[]> = {};
    for (const [id, client] of this.kernels.entries()) {
      results[id] = await client.getNodes();
    }
    return results;
  }

  /** Send a command to a specific kernel */
  async sendCommand(kernelId: string, cmd: KernelCommand): Promise<KernelResponse> {
    const client = this.kernels.get(kernelId);
    if (!client) {
      console.warn(`[KernelManager] Kernel ${kernelId} not found`);
      return { id: cmd.id, success: false, stderr: "Kernel not found", timestamp: new Date().toISOString() };
    }
    return await client.sendWithRetry(cmd);
  }
}

// Singleton instance for orchestrator handlers
export const globalKernelManager = new KernelManager();
