package core

import (
	"time"
)

type Kernel struct {
	Config   *KernelConfig
	EventBus *EventBus
}

func NewKernel(cfg *KernelConfig) *Kernel {
	return &Kernel{
		Config:   cfg,
		EventBus: NewEventBus(),
	}
}

func (k *Kernel) Start() {
	Info("Starting NeuroKernel...")
	InitLogger()
	InitAllEngines()
	StartAllAgents()
	Info("All agents and engines are running.")

	for {
		time.Sleep(5 * time.Second)
		// Example heartbeat / health checks
		Info("NeuroKernel heartbeat")
	}
}
