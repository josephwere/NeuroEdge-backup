// kernel/agents/api_generator_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types"
)

type APIGeneratorAgent struct {
	EventBus *types.EventBus
}

func NewAPIGeneratorAgent(bus *types.EventBus) *APIGeneratorAgent {
	return &APIGeneratorAgent{
		EventBus: bus,
	}
}

func (a *APIGeneratorAgent) Start() {
	fmt.Println("🚀 APIGeneratorAgent started")

	// Use a subscriber function directly
	a.EventBus.Subscribe("api:generate", func(event types.Event) {
		fmt.Println("[APIGeneratorAgent] API Generation Event:", event.Data)
		a.GenerateAPI(event.Data)
	})
}

func (a *APIGeneratorAgent) Stop() {
	fmt.Println("🛑 APIGeneratorAgent stopped")
}

func (a *APIGeneratorAgent) Name() string {
	return "APIGeneratorAgent"
}

func (a *APIGeneratorAgent) GenerateAPI(data map[string]interface{}) {
	fmt.Println("[APIGeneratorAgent] Generating API:", data)
}
