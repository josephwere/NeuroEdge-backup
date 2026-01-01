package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroHREngine struct {
	EventBus *core.EventBus
}

func NewNeuroHREngine(bus *core.EventBus) *NeuroHREngine {
	return &NeuroHREngine{
		EventBus: bus,
	}
}

func (n *NeuroHREngine) Start() {
	fmt.Println("🚀 NeuroHREngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("hr:process", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroHREngine] HR Event:", event)
			n.ManageHR(event)
		}
	}()
}

func (n *NeuroHREngine) Stop() {
	fmt.Println("🛑 NeuroHREngine stopped")
}

func (n *NeuroHREngine) Name() string {
	return "NeuroHREngine"
}

func (n *NeuroHREngine) ManageHR(data map[string]interface{}) {
	fmt.Println("[NeuroHREngine] HR process completed:", data)
}
