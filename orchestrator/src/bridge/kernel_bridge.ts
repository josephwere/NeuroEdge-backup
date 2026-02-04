// orchestrator/src/bridge/kernel_bridge.ts
import axios from "axios";
import { EventBus } from "@core/event_bus";
import { Logger } from "@utils/logger";

export class KernelBridge {
  private baseUrl: string;
  private eventBus: EventBus;
  private logger: Logger;
  private connected = false;

  constructor(baseUrl: string, eventBus: EventBus, logger: Logger) {
    this.baseUrl = baseUrl;
    this.eventBus = eventBus;
    this.logger = logger;
  }

  /**
   * Soft-connect to kernel.
   * Never throws.
   * Retries a few times, then continues without kernel.
   */
  async connect(retries = 5, delayMs = 2000): Promise<boolean> {
    this.logger.info("KERNEL_BRIDGE", "Connecting to Go kernel...");

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await axios.get(`${this.baseUrl}/health`, { timeout: 2000 });

        this.connected = true;
        this.logger.info(
          "KERNEL_BRIDGE",
          "✅ Connected to kernel"
        );

        this.attachEventListeners();
        return true;
      } catch (err) {
        this.logger.warn(
          "KERNEL_BRIDGE",
          `⚠️ Kernel not ready (${attempt}/${retries}), retrying...`
        );
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }

    this.logger.warn(
      "KERNEL_BRIDGE",
      "❌ Kernel unreachable, continuing without it"
    );

    // Still attach listeners so kernel can come up later
    this.attachEventListeners();
    return false;
  }

  /**
   * Subscribe to internal events regardless of kernel state
   */
  private attachEventListeners() {
    this.eventBus.subscribe("kernel:event", (payload) => {
      if (!this.connected) {
        this.logger.warn(
          "KERNEL_BRIDGE",
          "Kernel down — event skipped"
        );
        return;
      }
      this.sendToKernel(payload);
    });
  }

  async sendToKernel(payload: any) {
    try {
      await axios.post(`${this.baseUrl}/events`, payload);
    } catch (err) {
      this.logger.warn(
        "KERNEL_BRIDGE",
        "Failed to send event to kernel"
      );
    }
  }
}
