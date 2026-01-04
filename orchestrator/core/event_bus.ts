type Callback = (payload: any) => void;

export class EventBus {
  private subscribers: Record<string, Callback[]> = {};

  subscribe(event: string, cb: Callback) {
    if (!this.subscribers[event]) this.subscribers[event] = [];
    this.subscribers[event].push(cb);
  }

  emit(event: string, payload: any) {
    if (!this.subscribers[event]) return;
    for (const cb of this.subscribers[event]) cb(payload);
  }
}
