// kernel/agents/border_control_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type BorderControlAgent struct {
	EventBus *types.EventBus
}

func NewBorderControlAgent(bus *types.EventBus) *BorderControlAgent {
	return &BorderControlAgent{
		EventBus: bus,
	}
}

func (b *BorderControlAgent) Start() {
	fmt.Println("🚀 BorderControlAgent started")
	ch := make(chan map[string]interface{})
	b.EventBus.Subscribe("border:check", ch)
	go func() {
		for event := range ch {
			fmt.Println("[BorderControlAgent] Border Check Event:", event)
			b.VerifyTraveler(event)
		}
	}()
}

func (b *BorderControlAgent) Stop() {
	fmt.Println("🛑 BorderControlAgent stopped")
}

func (b *BorderControlAgent) Name() string {
	return "BorderControlAgent"
}

func (b *BorderControlAgent) VerifyTraveler(data map[string]interface{}) {
	fmt.Println("[BorderControlAgent] Verifying traveler:", data)
}
