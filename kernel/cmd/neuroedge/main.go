package main

import (
	"fmt"
	"neuroedge/kernel/core"
	"neuroedge/kernel/core/cognition"
	"neuroedge/kernel/core/ethics"
	"neuroedge/kernel/core/engine"
	"neuroedge/kernel/core/memory"
	"neuroedge/kernel/core/scheduler"
	"neuroedge/kernel/events"
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
	// Initialize Registries
	// =========================
	core.InitAgentRegistry(eventBus)   // Registers all 71+ agents automatically
	fmt.Println("✅ All agents registered via AgentRegistry")

	core.InitEngineRegistry()          // Registers all 42+ engines automatically
	fmt.Println("✅ All engines registered via EngineRegistry")

	// =========================
	// Start Everything
	// =========================
	core.StartAllEngines()
	core.StartAllAgents()
	coreEngine.Start()
	fmt.Println("🎯 NeuroEdge Kernel is running...")

	// Keep the program running
	select {}
}
