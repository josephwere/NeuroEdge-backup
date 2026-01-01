package main

import (
	"fmt"
	"neuroedge/kernel/core/engine"
	"neuroedge/kernel/core/memory"
	"neuroedge/kernel/core/cognition"
	"neuroedge/kernel/core/ethics"
	"neuroedge/kernel/core/scheduler"
	"neuroedge/kernel/events"
	"neuroedge/kernel/agents"
	"neuroedge/kernel/engines"
)

func main() {
	fmt.Println("🚀 Starting NeuroEdge Kernel v1.0...")

	// =========================
	// Initialize Core Systems
	// =========================
	eventBus := events.NewEventBus()
	fmt.Println("✅ Event bus initialized")

	mem := memory.NewMemory()
	fmt.Println("✅ Memory system initialized")

	ethicsEngine := ethics.NewEthics()
	fmt.Println("✅ Ethics engine initialized")

	cognitionEngine := cognition.NewCognition()
	fmt.Println("✅ Cognition engine initialized")

	schedulerEngine := scheduler.NewScheduler(eventBus)
	fmt.Println("✅ Scheduler initialized")

	coreEngine := engine.NewEngine(eventBus, mem, ethicsEngine, cognitionEngine, schedulerEngine)
	fmt.Println("✅ Core engine initialized")

	// =========================
	// Initialize Agents
	// =========================
	agentManager := agents.NewManager(eventBus)
	fmt.Println("✅ Agent manager initialized")

	// Example: register first agent
	globalMeshAgent := agents.NewGlobalMeshAgent(eventBus)
	agentManager.Register(globalMeshAgent.Name(), globalMeshAgent)

	// TODO: Register all 71 agents here

	// =========================
	// Initialize Engines
	// =========================
	engineManager := engines.NewEngineManager()

	neuroLogicEngine := engines.NewNeuroLogicEngine()
	engineManager.AddEngine(neuroLogicEngine.Name(), neuroLogicEngine)

	// TODO: Register all 42 engines here

	// =========================
	// Start Everything
	// =========================
	engineManager.StartAll()
	agentManager.StartAll()
	coreEngine.Start()
	fmt.Println("🎯 NeuroEdge Kernel is running...")

	// Keep the program running
	select {}
}
