import { v4 as uuidv4 } from "uuid";
import { Logger } from "../utils/logger";

type EventHandler = (payload: any) => void;

export class EventBus {
  private handlers: Map<string, EventHandler[]>;
  private logger: Logger;

  constructor(logger: Logger) {
    this.handlers = new Map();
    this.logger = logger;
  }

  subscribe(event: string, handler: EventHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
    this.logger.debug("EVENT_BUS", `Subscribed to ${event}`);
  }

  emit(event: string, payload: any) {
    const eventId = uuidv4();
    this.logger.info("EVENT_BUS", `Emitting event ${event} (${eventId})`);

    const handlers = this.handlers.get(event) || [];
    for (const handler of handlers) {
      try {
        handler(payload);
      } catch (err) {
        this.logger.error(
          "EVENT_BUS",
          `Handler error on event ${event}: ${String(err)}`
        );
      }
    }
  }
  }
