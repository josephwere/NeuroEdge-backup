package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroCreatorEngine struct {
	EventBus *core.EventBus
}

func NewNeuroCreatorEngine(bus *core.EventBus) *NeuroCreatorEngine {
	return &NeuroCreatorEngine{
		EventBus: bus,
	}
}

func (n *NeuroCreatorEngine) Start() {
	fmt.Println("🚀 NeuroCreatorEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("create:content", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroCreatorEngine] Content Creation Event:", event)
			n.GenerateContent(event)
		}
	}()
}

func (n *NeuroCreatorEngine) Stop() {
	fmt.Println("🛑 NeuroCreatorEngine stopped")
}

func (n *NeuroCreatorEngine) Name() string {
	return "NeuroCreatorEngine"
}

func (n *NeuroCreatorEngine) GenerateContent(data map[string]interface{}) {
	fmt.Println("[NeuroCreatorEngine] Content generated:", data)
}
