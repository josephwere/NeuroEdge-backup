import { KernelClient, KernelCommand, KernelResponse, KernelInfo } from "@services/kernelComm";

interface KernelStatus {
  client: KernelClient;
  consecutiveFailures: number;
  lastHealth: KernelInfo;
  busy: boolean; // for load balancing
  healthy: boolean; // soft health flag
}

/**
 * Manages multiple KernelClient instances
 * Handles lifecycle, health, nodes, and load-balanced command routing
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
      healthy: false,
    });
    console.log(`[KernelManager] Added kernel "${id}" at ${baseUrl}`);
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
      .filter(k => k.healthy && !k.busy);

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
      return await kernelStatus.client.sendWithRetry(cmd);
    } catch (err: any) {
      console.warn(`[KernelManager] Command failed on kernel: ${err.message}`);
      return {
        id: cmd.id,
        success: false,
        stderr: err.message,
        timestamp: new Date().toISOString(),
      };
    } finally {
      kernelStatus.busy = false;
    }
  }

  /** -------------------- Health Monitoring -------------------- */
  private startHealthMonitoring() {
    if (this.healthTimer) return;

    this.healthTimer = setInterval(async () => {
      for (const [id, status] of this.kernels.entries()) {
        try {
          // Safe call to getInfo — may not exist
          const info = (status.client.getInfo?.() || {
            version: "unknown",
            capabilities: [],
            status: "offline",
          }) as KernelInfo;

          status.lastHealth = info;

          if (info.status === "ready") {
            status.consecutiveFailures = 0;
            status.healthy = true;
          } else {
            status.consecutiveFailures++;
            status.healthy = false;
            console.warn(`[KernelManager] Kernel "${id}" not ready (${status.consecutiveFailures}/${this.maxFailures})`);
          }

          if (status.consecutiveFailures >= this.maxFailures) {
            console.warn(`[KernelManager] Kernel "${id}" unhealthy, will keep retrying`);
            // Do NOT delete — just mark unhealthy
            status.healthy = false;
          }
        } catch (err: any) {
          status.consecutiveFailures++;
          status.healthy = false;
          console.warn(`[KernelManager] Kernel "${id}" health check error: ${err.message}`);
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
