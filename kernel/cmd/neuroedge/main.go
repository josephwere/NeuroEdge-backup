package main

import (
	"fmt"
	"os"

	"neuroedge/kernel/agents"
	"neuroedge/kernel/config"
	"neuroedge/kernel/core"
	"neuroedge/kernel/engines"
	"neuroedge/kernel/events"
	"neuroedge/kernel/mesh"
)

func main() {
	fmt.Println("🚀 Starting NeuroEdge Kernel v1.0...")

	// =========================
	// Load Configuration
	// =========================
	cfg := config.LoadConfig("config.json")
	fmt.Printf("✅ Configuration loaded (Environment: %s)\n", cfg.Environment)

	// =========================
	// Initialize Logger
	// =========================
	logger := core.NewLogger(core.INFO, cfg.LogFilePath)
	defer logger.Close()
	logger.Info("Kernel", "Logger initialized")
	
    // =========================
// Start Self-Learning Loop
// =========================
selfLearning := core.NewSelfLearningLoop(agentManager, engineManager, 30*time.Second)
selfLearning.Start()
logger.Info("Kernel", "Self-Learning Loop started")
	// =========================
	// Initialize Core Systems
	// =========================
	eventBus := events.NewEventBus()
	logger.Info("Kernel", "Event bus initialized")

	mem := core.NewMemory()
	logger.Info("Kernel", "Memory system initialized")

	ethicsEngine := core.NewEthics()
	logger.Info("Kernel", "Ethics engine initialized")

	cognitionEngine := core.NewCognition()
	logger.Info("Kernel", "Cognition engine initialized")

	schedulerEngine := core.NewScheduler(eventBus)
	logger.Info("Kernel", "Scheduler initialized")

	coreEngine := core.NewEngine(eventBus, mem, ethicsEngine, cognitionEngine, schedulerEngine)
	logger.Info("Kernel", "Core engine initialized")

	// =========================
	// Initialize Mesh
	// =========================
	encryptionKey := []byte("supersecretkey123") // Replace with secure key
	meshManager := mesh.NewMeshManager(encryptionKey)
	logger.Info("Mesh", "Mesh manager initialized")

	// Example: Add a local node (could be dynamic in production)
	localNode := mesh.NewNode("local-node", "127.0.0.1")
	meshManager.AddNode(localNode)

	// =========================
	// Initialize Agents
	// =========================
	agentManager := agents.NewManager(eventBus)
	logger.Info("Agents", "Agent manager initialized")

	// Register agents from registry
	for _, ag := range agents.GetAllAgents() {
		agentManager.Register(ag.Name(), ag)
		logger.Info("Agents", fmt.Sprintf("Registered agent: %s", ag.Name()))
	}

	// =========================
	// Initialize Engines
	// =========================
	engineManager := engines.NewEngineManager()
	for _, eng := range engines.GetAllEngines() {
		engineManager.AddEngine(eng.Name(), eng)
		logger.Info("Engines", fmt.Sprintf("Registered engine: %s", eng.Name()))
	}

	// =========================
	// Initialize Health Monitoring
	// =========================
	healthManager := core.NewHealthManager()
	for _, comp := range coreEngine.GetComponents() {
		healthManager.RegisterComponent(comp)
	}
	healthManager.StartMonitoring()
	logger.Info("Kernel", "Health monitoring started")

	// =========================
	// Start Everything
	// =========================
	logger.Info("Kernel", "Starting engines...")
	engineManager.StartAll()

	logger.Info("Kernel", "Starting agents...")
	agentManager.StartAll()

	coreEngine.Start()
	logger.Info("Kernel", "Core engine running")

	// =========================
	// Demonstrate Mesh Communication
	// =========================
	meshManager.BroadcastMessage("Hello NeuroEdge Nodes!")
	logger.Info("Mesh", "Broadcast message sent")

	// =========================
	// Keep the kernel running
	// =========================
	fmt.Println("🎯 NeuroEdge Kernel is fully operational")
	select {} // block forever
}
