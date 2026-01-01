package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroComputeEngine struct {
	EventBus *core.EventBus
}

func NewNeuroComputeEngine(bus *core.EventBus) *NeuroComputeEngine {
	return &NeuroComputeEngine{
		EventBus: bus,
	}
}

func (n *NeuroComputeEngine) Start() {
	fmt.Println("🚀 NeuroComputeEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("compute:task", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroComputeEngine] Compute Event:", event)
			n.Execute(event)
		}
	}()
}

func (n *NeuroComputeEngine) Stop() {
	fmt.Println("🛑 NeuroComputeEngine stopped")
}

func (n *NeuroComputeEngine) Name() string {
	return "NeuroComputeEngine"
}

func (n *NeuroComputeEngine) Execute(data map[string]interface{}) {
	fmt.Println("[NeuroComputeEngine] Task executed:", data)
}
