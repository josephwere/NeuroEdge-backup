package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroDefenseEngine struct {
	EventBus *core.EventBus
}

func NewNeuroDefenseEngine(bus *core.EventBus) *NeuroDefenseEngine {
	return &NeuroDefenseEngine{
		EventBus: bus,
	}
}

func (n *NeuroDefenseEngine) Start() {
	fmt.Println("🚀 NeuroDefenseEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("defense:alert", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroDefenseEngine] Defense Event:", event)
			n.ActivateDefense(event)
		}
	}()
}

func (n *NeuroDefenseEngine) Stop() {
	fmt.Println("🛑 NeuroDefenseEngine stopped")
}

func (n *NeuroDefenseEngine) Name() string {
	return "NeuroDefenseEngine"
}

func (n *NeuroDefenseEngine) ActivateDefense(data map[string]interface{}) {
	fmt.Println("[NeuroDefenseEngine] Defense action executed:", data)
}
