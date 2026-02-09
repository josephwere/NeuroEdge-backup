package core

import (
	"time"

	"neuroedge/kernel/config"
	"neuroedge/kernel/types"
	"neuroedge/kernel/logging"
	"neuroedge/kernel/engines"
	"neuroedge/kernel/agents"
)

type Kernel struct {
	Config   *config.KernelConfig
	EventBus *types.EventBus
}

// NewKernel creates and wires the kernel
func NewKernel(cfg *config.KernelConfig) *Kernel {
	return &Kernel{
		Config:   cfg,
		EventBus: types.NewEventBus(),
	}
}

// Start boots the NeuroEdge kernel
func (k *Kernel) Start() {
	logging.Info("Starting NeuroKernel...")

	logging.InitLogger()

	engines.InitAllEngines(k.EventBus)
	agents.StartAllAgents(k.EventBus)

	logging.Info("All agents and engines are running.")

	// Kernel heartbeat loop
	for {
		time.Sleep(5 * time.Second)
		logging.Info("NeuroKernel heartbeat")
	}
}
