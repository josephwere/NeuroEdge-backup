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

	// Subscribe with function
	a.EventBus.Subscribe("api:generate", func(event types.Event) {
		fmt.Println("[APIGeneratorAgent] API Generation Event:", event.Data)

		// ✅ Type assertion to map[string]interface{}
		data, ok := event.Data.(map[string]interface{})
		if !ok {
			fmt.Println("[APIGeneratorAgent] Warning: event.Data is not a map:", event.Data)
			return
		}

		a.GenerateAPI(data)
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
