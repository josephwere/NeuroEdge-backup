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
}

export const eventBus = new EventBusClass();
