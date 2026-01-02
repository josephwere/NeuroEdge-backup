package main

import (
	"fmt"
	"neuroedge/kernel/agents"
	"neuroedge/kernel/core"
	"neuroedge/kernel/engines"
)

func main() {
	fmt.Println("🚀 Starting NeuroEdge Kernel v1.0...")

	// =========================
	// Initialize Core Systems
	// =========================
	eventBus := core.NewEventBus()
	fmt.Println("✅ Event bus initialized")

	mem := core.NewMemory()
	fmt.Println("✅ Memory system initialized")

	lc := core.NewLifecycleController()
	fmt.Println("✅ Lifecycle controller initialized")

	health := core.NewHealthManager()
	fmt.Println("✅ Health manager initialized")

	logger := core.NewLogger(core.INFO, "neuroedge.log")
	fmt.Println("✅ Logger initialized")

	// =========================
	// Initialize Python Client (ML Orchestrator)
	// =========================
	pythonClient, err := core.NewPythonClient("localhost:50051")
	if err != nil {
		fmt.Printf("❌ Failed to connect to Python orchestrator: %v\n", err)
		return
	}
	defer pythonClient.Close()
	fmt.Println("✅ Python ML Orchestrator client connected")

	// =========================
	// Initialize Agents
	// =========================
	agentManager := agents.NewManager(eventBus)
	fmt.Println("✅ Agent manager initialized")

	globalMeshAgent := agents.NewGlobalMeshAgent(eventBus)
	agentManager.Register(globalMeshAgent.Name(), globalMeshAgent)

	// Register other agents...
	// agentManager.Register(...)

	// =========================
	// Initialize Engines
	// =========================
	engineManager := engines.NewEngineManager()
	neuroLogicEngine := engines.NewNeuroLogicEngine()
	engineManager.AddEngine(neuroLogicEngine.Name(), neuroLogicEngine)

	// Register other engines...
	// engineManager.AddEngine(...)

	// =========================
	// Start Everything
	// =========================
	engineManager.StartAll()
	agentManager.StartAll()
	lc.Boot()

	fmt.Println("🎯 NeuroEdge Kernel is running...")

	// =========================
	// Example: Dispatch task to Python ML
	// =========================
	eventBus.Subscribe("ml:run", func(event string, payload interface{}) {
		task := payload.(map[string]interface{})
		engineName := task["engine"].(string)
		taskID := task["id"].(string)
		input := task["input"]

		go pythonClient.SubmitTask(engineName, taskID, input)
	})

	// Keep the program running
	select {}
}
