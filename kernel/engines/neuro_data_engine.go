package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroDataEngine struct {
	EventBus *core.EventBus
}

func NewNeuroDataEngine(bus *core.EventBus) *NeuroDataEngine {
	return &NeuroDataEngine{
		EventBus: bus,
	}
}

func (n *NeuroDataEngine) Start() {
	fmt.Println("🚀 NeuroDataEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("data:request", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroDataEngine] Data Event:", event)
			n.ProcessData(event)
		}
	}()
}

func (n *NeuroDataEngine) Stop() {
	fmt.Println("🛑 NeuroDataEngine stopped")
}

func (n *NeuroDataEngine) Name() string {
	return "NeuroDataEngine"
}

func (n *NeuroDataEngine) ProcessData(data map[string]interface{}) {
	fmt.Println("[NeuroDataEngine] Data processed:", data)
}
