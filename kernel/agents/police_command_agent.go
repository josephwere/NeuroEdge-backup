// kernel/agents/police_command_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/types" // changed from core to types
)

type PoliceCommandAgent struct {
	EventBus *types.EventBus
}

func NewPoliceCommandAgent(bus *types.EventBus) *PoliceCommandAgent {
	return &PoliceCommandAgent{
		EventBus: bus,
	}
}

func (p *PoliceCommandAgent) Start() {
	fmt.Println("🚀 PoliceCommandAgent started")
	ch := make(chan map[string]interface{})
	p.EventBus.Subscribe("police:command", ch)

	go func() {
		for event := range ch {
			fmt.Println("[PoliceCommandAgent] Command Event:", event)
			p.ExecuteCommand(event)
		}
	}()
}

func (p *PoliceCommandAgent) Stop() {
	fmt.Println("🛑 PoliceCommandAgent stopped")
}

func (p *PoliceCommandAgent) Name() string {
	return "PoliceCommandAgent"
}

func (p *PoliceCommandAgent) ExecuteCommand(data map[string]interface{}) {
	fmt.Println("[PoliceCommandAgent] Executing command:", data)
}
