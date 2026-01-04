type Callback = (payload: any) => void;

class EventBusClass {
  private events: { [key: string]: Callback[] } = {};

  subscribe(event: string, cb: Callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(cb);
  }

  emit(event: string, payload: any) {
    if (this.events[event]) {
      this.events[event].forEach((cb) => cb(payload));
    }
  }

  // Stream logs line by line with optional delay
  streamLogs(event: string, logs: string[], delay = 200) {
    logs.forEach((line, idx) => {
      setTimeout(() => {
        this.emit(event, line);
      }, idx * delay);
    });
  }
}

export const eventBus = new EventBusClass();
