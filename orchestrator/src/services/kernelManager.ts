import { KernelClient, KernelCommand, KernelResponse, KernelInfo } from "@services/kernelComm";

interface KernelStatus {
  client: KernelClient;
  consecutiveFailures: number;
  lastHealth: KernelInfo;
  busy: boolean; // for load balancing
}

/**
 * Manages multiple KernelClient instances
 * Handles lifecycle, health, capabilities, nodes, and load-balanced command routing
 */
export class KernelManager {
  private kernels: Map<string, KernelStatus> = new Map();
  private healthCheckInterval = 10000;
  private maxFailures = 3;
  private healthTimer: NodeJS.Timer | null = null;
  private roundRobinIndex = 0;

  constructor() {
    this.startHealthMonitoring();
  }

  /** -------------------- Add a new kernel -------------------- */
  addKernel(id: string, baseUrl: string) {
    if (this.kernels.has(id)) return;
    const client = new KernelClient(baseUrl);
    this.kernels.set(id, {
      client,
      consecutiveFailures: 0,
      lastHealth: { version: "unknown", capabilities: [], status: "offline" },
      busy: false,
    });
    console.log(`[KernelManager] Added kernel "${id}" at ${baseUrl}`);
  }

  /** -------------------- Remove a kernel -------------------- */
  removeKernel(id: string) {
    if (!this.kernels.has(id)) return;
    this.kernels.delete(id);
    console.log(`[KernelManager] Removed kernel "${id}"`);
  }

  /** -------------------- List all kernels -------------------- */
  listKernels(): Record<string, KernelInfo> {
    const result: Record<string, KernelInfo> = {};
    this.kernels.forEach((status, id) => {
      result[id] = status.lastHealth;
    });
    return result;
  }

  /** -------------------- Load-Balanced Command Dispatch -------------------- */
  private pickHealthyKernel(): KernelStatus | null {
    const healthyKernels = Array.from(this.kernels.values())
      .filter(k => k.lastHealth.status === "ready" && !k.busy);

    if (healthyKernels.length === 0) return null;

    const kernel = healthyKernels[this.roundRobinIndex % healthyKernels.length];
    this.roundRobinIndex++;
    return kernel;
  }

  /** Send a command to any healthy kernel (load-balanced) */
  async sendCommandBalanced(cmd: KernelCommand): Promise<KernelResponse> {
    const kernelStatus = this.pickHealthyKernel();
    if (!kernelStatus) {
      return {
        id: cmd.id,
        success: false,
        stderr: "No healthy kernels available",
        timestamp: new Date().toISOString(),
      };
    }

    kernelStatus.busy = true;
    try {
      const response = await kernelStatus.client.sendWithRetry(cmd);
      console.log(`[KernelManager] Command ${cmd.id} sent → success: ${response.success}`);
      return response;
    } finally {
      kernelStatus.busy = false;
    }
  }

  /** Send a command to a specific kernel */
  async sendCommand(kernelId: string, cmd: KernelCommand): Promise<KernelResponse> {
    const status = this.kernels.get(kernelId);
    if (!status) {
      return {
        id: cmd.id,
        success: false,
        stderr: `Kernel "${kernelId}" not found`,
        timestamp: new Date().toISOString(),
      };
    }
    return status.client.sendWithRetry(cmd);
  }

  /** -------------------- Health Monitoring -------------------- */
  private startHealthMonitoring() {
    if (this.healthTimer) return;
    this.healthTimer = setInterval(async () => {
      for (const [id, status] of this.kernels.entries()) {
        try {
          const info = await status.client.getInfo();
          status.lastHealth = info;

          if (info.status !== "ready") {
            status.consecutiveFailures++;
            console.warn(`[KernelManager] Kernel "${id}" not ready (${status.consecutiveFailures}/${this.maxFailures})`);
          } else {
            status.consecutiveFailures = 0;
          }

          if (status.consecutiveFailures >= this.maxFailures) {
            console.error(`[KernelManager] Kernel "${id}" removed after ${status.consecutiveFailures} consecutive failures`);
            this.kernels.delete(id);
          }
        } catch (err) {
          status.consecutiveFailures++;
          console.error(`[KernelManager] Kernel "${id}" health check error:`, err);
          if (status.consecutiveFailures >= this.maxFailures) {
            console.error(`[KernelManager] Kernel "${id}" removed due to repeated failures`);
            this.kernels.delete(id);
          }
        }
      }
    }, this.healthCheckInterval);
  }

  stopHealthMonitoring() {
    if (this.healthTimer) clearInterval(this.healthTimer);
    this.healthTimer = null;
  }

  /** -------------------- Fetch all kernel info -------------------- */
  async getAllHealth(): Promise<Record<string, KernelInfo>> {
    const result: Record<string, KernelInfo> = {};
    this.kernels.forEach((status, id) => {
      result[id] = status.lastHealth;
    });
    return result;
  }
}

/** -------------------- Global singleton -------------------- */
export const globalKernelManager = new KernelManager();
