package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroEdgeAntiTheftEngine struct {
	EventBus *core.EventBus
}

func NewNeuroEdgeAntiTheftEngine(bus *core.EventBus) *NeuroEdgeAntiTheftEngine {
	return &NeuroEdgeAntiTheftEngine{
		EventBus: bus,
	}
}

func (n *NeuroEdgeAntiTheftEngine) Start() {
	fmt.Println("🚀 NeuroEdgeAntiTheftEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("device:theft-alert", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroEdgeAntiTheftEngine] Theft Alert:", event)
			n.ProtectDevice(event)
		}
	}()
}

func (n *NeuroEdgeAntiTheftEngine) Stop() {
	fmt.Println("🛑 NeuroEdgeAntiTheftEngine stopped")
}

func (n *NeuroEdgeAntiTheftEngine) Name() string {
	return "NeuroEdgeAntiTheftEngine"
}

func (n *NeuroEdgeAntiTheftEngine) ProtectDevice(data map[string]interface{}) {
	fmt.Println("[NeuroEdgeAntiTheftEngine] Device protection executed:", data)
}
