package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroAPIEngine struct {
	EventBus *core.EventBus
}

func NewNeuroAPIEngine(bus *core.EventBus) *NeuroAPIEngine {
	return &NeuroAPIEngine{
		EventBus: bus,
	}
}

func (n *NeuroAPIEngine) Start() {
	fmt.Println("🚀 NeuroAPIEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("api:request", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroAPIEngine] API Event:", event)
			n.ProcessAPI(event)
		}
	}()
}

func (n *NeuroAPIEngine) Stop() {
	fmt.Println("🛑 NeuroAPIEngine stopped")
}

func (n *NeuroAPIEngine) Name() string {
	return "NeuroAPIEngine"
}

func (n *NeuroAPIEngine) ProcessAPI(data map[string]interface{}) {
	fmt.Println("[NeuroAPIEngine] API processed:", data)
}
