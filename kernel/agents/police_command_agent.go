package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type PoliceCommandAgent struct {
	EventBus *core.EventBus
}

func NewPoliceCommandAgent(bus *core.EventBus) *PoliceCommandAgent {
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
