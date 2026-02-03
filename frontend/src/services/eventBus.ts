// frontend/src/services/eventBus.tsx
import React, { ReactNode } from "react";

// Type for callback functions
type Callback = (data: any) => void;

// Core EventBus class
class EventBus {
  private listeners: Map<string, Set<Callback>> = new Map();

  // Subscribe to an event
  subscribe(event: string, cb: Callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)?.add(cb);
    return { unsubscribe: () => this.listeners.get(event)?.delete(cb) };
  }

  // Emit an event
  emit(event: string, data: any) {
    this.listeners.get(event)?.forEach((cb) => cb(data));
  }
}

// Singleton instance
export const eventBus = new EventBus();

// Minimal React provider to wrap components
export const EventBusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
