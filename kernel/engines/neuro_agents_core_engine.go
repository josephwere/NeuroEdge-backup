package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroAgentsCoreEngine struct {
	EventBus *core.EventBus
}

func NewNeuroAgentsCoreEngine(bus *core.EventBus) *NeuroAgentsCoreEngine {
	return &NeuroAgentsCoreEngine{
		EventBus: bus,
	}
}

func (n *NeuroAgentsCoreEngine) Start() {
	fmt.Println("🚀 NeuroAgentsCoreEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("agent:command", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroAgentsCoreEngine] Agent Command Event:", event)
			n.ManageAgents(event)
		}
	}()
}

func (n *NeuroAgentsCoreEngine) Stop() {
	fmt.Println("🛑 NeuroAgentsCoreEngine stopped")
}

func (n *NeuroAgentsCoreEngine) Name() string {
	return "NeuroAgentsCoreEngine"
}

func (n *NeuroAgentsCoreEngine) ManageAgents(data map[string]interface{}) {
	fmt.Println("[NeuroAgentsCoreEngine] Agent command executed:", data)
}
