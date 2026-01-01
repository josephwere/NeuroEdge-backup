package main

import (
    "fmt"
    "log"
    "neuroedge/kernel/core/engine"
    "neuroedge/kernel/core/scheduler"
    "neuroedge/kernel/core/memory"
    "neuroedge/kernel/core/cognition"
    "neuroedge/kernel/core/ethics"
    "neuroedge/kernel/events"
    "neuroedge/kernel/agents"
)

func main() {
    fmt.Println("🚀 Starting NeuroEdge Kernel v1.0...")

    // Initialize Event Bus
    eventBus := events.NewEventBus()
    fmt.Println("✅ Event bus initialized")

    // Initialize Memory
    mem := memory.NewMemory()
    fmt.Println("✅ Memory system initialized")

    // Initialize Ethics
    ethicsEngine := ethics.NewEthics()
    fmt.Println("✅ Ethics engine initialized")

    // Initialize Cognition
    cognitionEngine := cognition.NewCognition()
    fmt.Println("✅ Cognition engine initialized")

    // Initialize Scheduler
    schedulerEngine := scheduler.NewScheduler(eventBus)
    fmt.Println("✅ Scheduler initialized")

    // Initialize Core Engine
    coreEngine := engine.NewEngine(eventBus, mem, ethicsEngine, cognitionEngine, schedulerEngine)
    fmt.Println("✅ Core engine initialized")

    // Initialize Agent Manager
    agentManager := agents.NewManager(eventBus)
    fmt.Println("✅ Agent manager initialized")

    // Start main loop
    coreEngine.Start()
    fmt.Println("🎯 NeuroEdge Kernel is running...")

    // Keep running
    select {}
}
