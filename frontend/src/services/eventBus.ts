import React from "react";

type Callback = (data: any) => void;

class EventBus {
  private listeners: Map<string, Set<Callback>> = new Map();

  subscribe(event: string, cb: Callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)?.add(cb);
    return { unsubscribe: () => this.listeners.get(event)?.delete(cb) };
  }

  emit(event: string, data: any) {
    this.listeners.get(event)?.forEach((cb) => cb(data));
  }
}

export const eventBus = new EventBus();

// Minimal provider so components can import it
export const EventBusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
