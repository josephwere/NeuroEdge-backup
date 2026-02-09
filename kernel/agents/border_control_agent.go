// kernel/agents/border_control_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types"
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

	// ✅ Subscribe using a function
	b.EventBus.Subscribe("border:check", func(event types.Event) {
		fmt.Println("[BorderControlAgent] Border Check Event:", event.Data)

		// ✅ Type assertion
		data, ok := event.Data.(map[string]interface{})
		if !ok {
			fmt.Println("[BorderControlAgent] Warning: event.Data is not a map:", event.Data)
			return
		}

		b.VerifyTraveler(data)
	})
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
