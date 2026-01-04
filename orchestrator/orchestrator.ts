// orchestrator/orchestrator.ts
import { EventBus } from "./core/event_bus";
import { Logger, LogLevel } from "./utils/logger";
import { PermissionManager } from "./utils/permissions";
import { DevExecutionAgent } from "./agents/dev_execution_agent";
import { NodeManager } from "./mesh/node_manager";
import { SecureChannel } from "./mesh/secure_channel";
import { MeshExecutor } from "./mesh/mesh_executor";
import { FloatingChatAgent } from "./agents/floating_chat_agent";

const eventBus = new EventBus();
const logger = new Logger(LogLevel.INFO);
const permissions = new PermissionManager();

// DevExecution Agent
const devAgent = new DevExecutionAgent(eventBus, logger, permissions);
devAgent.start();

// Mesh
const nodeManager = new NodeManager(eventBus, logger);
const channel = new SecureChannel("super-secret-key");
const meshExecutor = new MeshExecutor(nodeManager, channel, logger, eventBus);

// Floating Chat
const floatingChat = new FloatingChatAgent(eventBus, logger, devAgent, nodeManager, meshExecutor, permissions);
floatingChat.start();

// Example Node Registration
nodeManager.registerNode({ id: "node-1", address: "192.168.1.10", online: true });
nodeManager.registerNode({ id: "node-2", address: "192.168.1.11", online: true });

// Example command via floating chat
eventBus.emit("chat:command", { command: "npm install", context: "/home/user/project" });
