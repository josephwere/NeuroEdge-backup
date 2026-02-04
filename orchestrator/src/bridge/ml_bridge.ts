import axios from "axios";
import { EventBus } from "@core/event_bus";
import { Logger } from "@utils/logger";

export class MLBridge {
  private baseUrl: string;
  private eventBus: EventBus;
  private logger: Logger;

  constructor(baseUrl: string, eventBus: EventBus, logger: Logger) {
    this.baseUrl = baseUrl;
    this.eventBus = eventBus;
    this.logger = logger;
  }

  async connect() {
    this.logger.info("ML_BRIDGE", "Connecting to ML orchestrator...");

    try {
      const res = await axios.get(`${this.baseUrl}/health`);
      if (res.status === 200) {
        this.logger.info("ML_BRIDGE", "Connected to ML system");
      }
    } catch (err) {
      this.logger.error("ML_BRIDGE", "Failed to connect to ML system");
      throw err;
    }

    this.eventBus.subscribe("ml:request", payload => {
      this.forwardToML(payload);
    });
  }

  async forwardToML(payload: any) {
    try {
      const res = await axios.post(`${this.baseUrl}/infer`, payload);
      this.eventBus.emit("ml:response", res.data);
    } catch (err) {
      this.logger.error("ML_BRIDGE", "ML request failed");
    }
  }
                    }
