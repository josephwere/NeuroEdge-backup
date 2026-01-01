package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroVisionEngine struct {
	EventBus *core.EventBus
}

func NewNeuroVisionEngine(bus *core.EventBus) *NeuroVisionEngine {
	return &NeuroVisionEngine{
		EventBus: bus,
	}
}

func (n *NeuroVisionEngine) Start() {
	fmt.Println("🚀 NeuroVisionEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("vision:request", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroVisionEngine] Vision Event:", event)
			n.ProcessImage(event)
		}
	}()
}

func (n *NeuroVisionEngine) Stop() {
	fmt.Println("🛑 NeuroVisionEngine stopped")
}

func (n *NeuroVisionEngine) Name() string {
	return "NeuroVisionEngine"
}

func (n *NeuroVisionEngine) ProcessImage(data map[string]interface{}) {
	fmt.Println("[NeuroVisionEngine] Image processed:", data)
}
