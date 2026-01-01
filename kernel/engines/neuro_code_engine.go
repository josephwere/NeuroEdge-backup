package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroCodeEngine struct {
	EventBus *core.EventBus
}

func NewNeuroCodeEngine(bus *core.EventBus) *NeuroCodeEngine {
	return &NeuroCodeEngine{
		EventBus: bus,
	}
}

func (n *NeuroCodeEngine) Start() {
	fmt.Println("🚀 NeuroCodeEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("code:request", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroCodeEngine] Code Event:", event)
			n.ProcessCode(event)
		}
	}()
}

func (n *NeuroCodeEngine) Stop() {
	fmt.Println("🛑 NeuroCodeEngine stopped")
}

func (n *NeuroCodeEngine) Name() string {
	return "NeuroCodeEngine"
}

func (n *NeuroCodeEngine) ProcessCode(data map[string]interface{}) {
	fmt.Println("[NeuroCodeEngine] Code generated:", data)
}
