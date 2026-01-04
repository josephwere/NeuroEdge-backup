import { EventBus } from "../core/event_bus";
import { Logger } from "../utils/logger";
import { MeshNode } from "./mesh_node";

export class MeshManager {
  private nodes: Map<string, MeshNode>;
  private eventBus: EventBus;
  private logger: Logger;

  constructor(eventBus: EventBus, logger: Logger) {
    this.nodes = new Map();
    this.eventBus = eventBus;
    this.logger = logger;
  }

  // Register a remote node
  registerNode(node: MeshNode) {
    this.nodes.set(node.id, node);
    this.logger.info("MeshManager", `Node registered: ${node.id} @ ${node.address}`);
  }

  // Discover active nodes
  discoverNodes(): MeshNode[] {
    const activeNodes = Array.from(this.nodes.values()).filter(n => n.isActive());
    this.logger.info("MeshManager", `Discovered ${activeNodes.length} active nodes`);
    return activeNodes;
  }

  // Dispatch command to a node
  async dispatchCommand(nodeId: string, command: string, args: string[] = []) {
    const node = this.nodes.get(nodeId);
    if (!node) {
      this.logger.warn("MeshManager", `Node ${nodeId} not found`);
      return { success: false, error: "Node not found" };
    }
    this.logger.info("MeshManager", `Dispatching command to node ${nodeId}: ${command}`);
    try {
      const result = await node.execute(command, args);
      return result;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // Broadcast command to all nodes
  async broadcastCommand(command: string, args: string[] = []) {
    const results: Record<string, any> = {};
    for (const [id, node] of this.nodes.entries()) {
      results[id] = await this.dispatchCommand(id, command, args);
    }
    return results;
  }
}
