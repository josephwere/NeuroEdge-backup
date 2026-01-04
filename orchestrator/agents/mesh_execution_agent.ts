import { eventBus } from "../core/event_bus";

interface RemoteRequest {
  id: string;
  command: string;
  targetNode: string;
}

export class MeshExecutionAgent {
  start() {
    // Listen for commands to run remotely
    eventBus.subscribe("mesh:execute", async (req: RemoteRequest) => {
      // In production, call actual remote node via secure channel
      eventBus.emit("floating_chat:log_stream", `[Mesh] Sending command to node ${req.targetNode}: ${req.command}`);
      
      // Simulate remote execution
      setTimeout(() => {
        eventBus.emit("floating_chat:execution_result", {
          id: req.id,
          success: true,
          stdout: `Remote node ${req.targetNode} executed: ${req.command}`,
          stderr: ""
        });
      }, 1000);
    });
  }
}
