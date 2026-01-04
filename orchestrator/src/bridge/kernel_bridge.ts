import axios from "axios";
import { EventBus } from "../core/event_bus";
import { Logger } from "../utils/logger";

export class KernelBridge {
  private baseUrl: string;
  private eventBus: EventBus;
  private logger: Logger;

  constructor(baseUrl: string, eventBus: EventBus, logger: Logger) {
    this.baseUrl = baseUrl;
    this.eventBus = eventBus;
    this.logger = logger;
  }

  async connect() {
    this.logger.info("KERNEL_BRIDGE", "Connecting to Go kernel...");

    try {
      const res = await axios.get(`${this.baseUrl}/health`);
      if (res.status === 200) {
        this.logger.info("KERNEL_BRIDGE", "Connected to kernel");
      }
    } catch (err) {
      this.logger.error(
        "KERNEL_BRIDGE",
        "Failed to connect to kernel"
      );
      throw err;
    }

    // Example: listen for outbound kernel events
    this.eventBus.subscribe("kernel:event", payload => {
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
