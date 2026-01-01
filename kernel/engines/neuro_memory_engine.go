package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroMemoryEngine struct {
	EventBus *core.EventBus
}

func NewNeuroMemoryEngine(bus *core.EventBus) *NeuroMemoryEngine {
	return &NeuroMemoryEngine{
		EventBus: bus,
	}
}

func (n *NeuroMemoryEngine) Start() {
	fmt.Println("🚀 NeuroMemoryEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("memory:request", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroMemoryEngine] Memory Event:", event)
			n.HandleMemory(event)
		}
	}()
}

func (n *NeuroMemoryEngine) Stop() {
	fmt.Println("🛑 NeuroMemoryEngine stopped")
}

func (n *NeuroMemoryEngine) Name() string {
	return "NeuroMemoryEngine"
}

func (n *NeuroMemoryEngine) HandleMemory(data map[string]interface{}) {
	fmt.Println("[NeuroMemoryEngine] Memory stored/retrieved:", data)
}
