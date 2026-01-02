package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"neuroedge/kernel/core"
	"neuroedge/kernel/agents"
	"neuroedge/kernel/engines"
	"neuroedge/kernel/core/config"
	"neuroedge/kernel/core/logging"
	"neuroedge/kernel/core/memory"
	"neuroedge/kernel/core/cognition"
	"neuroedge/kernel/core/ethics"
	"neuroedge/kernel/core/scheduler"
	"neuroedge/kernel/events"
)

func main() {
	fmt.Println("🚀 Starting NeuroEdge Kernel v1.0")

	// =========================
	// Load Configuration
	// =========================
	cfg := config.LoadConfig("config.json")

	// =========================
	// Initialize Logging
	// =========================
	logger := logging.NewLogger(logging.INFO, cfg.LogFilePath)
	defer logger.Close()
	logger.Info("Kernel", "Logger initialized")

	// =========================
	// Initialize Core Systems
	// =========================
	eventBus := events.NewEventBus()
	logger.Info("Kernel", "EventBus initialized")

	mem := memory.NewMemory()
	logger.Info("Kernel", "Memory system initialized")

	ethicsEngine := ethics.NewEthics()
	logger.Info("Kernel", "Ethics engine initialized")

	cognitionEngine := cognition.NewCognition()
	logger.Info("Kernel", "Cognition engine initialized")

	schedulerEngine := scheduler.NewScheduler(eventBus)
	logger.Info("Kernel", "Scheduler initialized")

	coreEngine := core.NewEngine(eventBus, mem, ethicsEngine, cognitionEngine, schedulerEngine)
	logger.Info("Kernel", "Core engine initialized")

	// =========================
	// Initialize Lifecycle Controller
	// =========================
	lifecycle := core.NewLifecycleController()
	lifecycle.RegisterComponent(coreEngine)
	lifecycle.RegisterComponent(mem)
	lifecycle.RegisterComponent(ethicsEngine)
	lifecycle.RegisterComponent(cognitionEngine)
	lifecycle.RegisterComponent(schedulerEngine)
	logger.Info("Kernel", "Lifecycle controller initialized")

	// =========================
	// Initialize Health Manager
	// =========================
	healthMgr := core.NewHealthManager()
	healthMgr.RegisterComponent(coreEngine)
	healthMgr.RegisterComponent(mem)
	healthMgr.RegisterComponent(ethicsEngine)
	healthMgr.RegisterComponent(cognitionEngine)
	healthMgr.RegisterComponent(schedulerEngine)
	healthMgr.StartMonitoring()
	defer healthMgr.StopMonitoring()

	// =========================
	// Initialize Agent & Engine Registries
	// =========================
	core.InitializeAllAgents() // 71+ agents
	engineRegistry := core.NewEngineRegistry(eventBus)
	engineRegistry.RegisterAllEngines() // 42 engines

	// =========================
	// Boot Kernel
	// =========================
	if err := lifecycle.Boot(); err != nil {
		logger.Fatal("Kernel", fmt.Sprintf("Boot failed: %v", err))
	}

	// =========================
	// Self-Learning Loop
	// =========================
	go func() {
		logger.Info("SelfLearning", "Starting Self-Learning Loop")
		for {
			time.Sleep(30 * time.Second) // periodic evaluation
			for _, agent := range core.GetAllAgents() {
				if !agent.EvaluatePerformance() {
					logger.Warn("SelfLearning", fmt.Sprintf("Agent %s underperforming, retraining...", agent.Name()))
					agent.Learn()
				}
			}
			for _, engine := range engineRegistry.GetAllEngines() {
				if !engine.EvaluatePerformance() {
					logger.Warn("SelfLearning", fmt.Sprintf("Engine %s underperforming, optimizing...", engine.Name()))
					engine.Optimize()
				}
			}
		}
	}()

	// =========================
	// Graceful Shutdown Handling
	// =========================
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-sigs
		logger.Info("Kernel", "Shutdown signal received")
		engineRegistry.StopAllEngines()
		core.StopAllAgents()
		if err := lifecycle.Shutdown(); err != nil {
			logger.Error("Kernel", fmt.Sprintf("Shutdown error: %v", err))
		}
		logger.Info("Kernel", "NeuroEdge Kernel stopped gracefully")
		os.Exit(0)
	}()

	// =========================
	// Kernel is Running
	// =========================
	logger.Info("Kernel", "🎯 NeuroEdge Kernel is running")

	// Keep main thread alive
	select {}
}
