// kernel/agents/decentralized_ai_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type DecentralizedAIAgent struct {
	EventBus *types.EventBus
}

func NewDecentralizedAIAgent(bus *types.EventBus) *DecentralizedAIAgent {
	return &DecentralizedAIAgent{
		EventBus: bus,
	}
}

func (d *DecentralizedAIAgent) Start() {
	fmt.Println("🚀 DecentralizedAIAgent started")
	ch := make(chan map[string]interface{})
	d.EventBus.Subscribe("ai:decentralized:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[DecentralizedAIAgent] Decentralized AI Event:", event)
			d.UpdateAIMesh(event)
		}
	}()
}

func (d *DecentralizedAIAgent) Stop() {
	fmt.Println("🛑 DecentralizedAIAgent stopped")
}

func (d *DecentralizedAIAgent) Name() string {
	return "DecentralizedAIAgent"
}

func (d *DecentralizedAIAgent) UpdateAIMesh(data map[string]interface{}) {
	fmt.Println("[DecentralizedAIAgent] AI mesh updated:", data)
}
