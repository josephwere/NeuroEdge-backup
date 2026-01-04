import { RemoteExecutionRequest } from "./remote_capability";
import { EventBus } from "../core/event_bus";

export class RemoteExecutor {
  constructor(private bus: EventBus) {}

  execute(request: RemoteExecutionRequest) {
    console.log(`[RemoteExecutor] Sending to node: ${request.targetNode}`);
    // For simulation, we just emit locally
    this.bus.emit("remote:execution:received", request);
  }

  receive() {
    this.bus.subscribe("remote:execution:received", (req: RemoteExecutionRequest) => {
      console.log(`[RemoteExecutor] Received at node: ${req.targetNode}`);
      // Actual execution logic would validate capability and run payload safely
    });
  }
}
