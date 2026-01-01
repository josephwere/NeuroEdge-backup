package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroLogicEngine struct {
	EventBus *core.EventBus
}

func NewNeuroLogicEngine(bus *core.EventBus) *NeuroLogicEngine {
	return &NeuroLogicEngine{
		EventBus: bus,
	}
}

func (n *NeuroLogicEngine) Start() {
	fmt.Println("🚀 NeuroLogicEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("logic:request", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroLogicEngine] Logic Event:", event)
			n.ProcessLogic(event)
		}
	}()
}

func (n *NeuroLogicEngine) Stop() {
	fmt.Println("🛑 NeuroLogicEngine stopped")
}

func (n *NeuroLogicEngine) Name() string {
	return "NeuroLogicEngine"
}

func (n *NeuroLogicEngine) ProcessLogic(data map[string]interface{}) {
	fmt.Println("[NeuroLogicEngine] Logic processed:", data)
}
