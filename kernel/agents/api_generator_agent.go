// kernel/agents/api_generator_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use lightweight types package to avoid cycles
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
	ch := make(chan map[string]interface{})
	a.EventBus.Subscribe("api:generate", ch)
	go func() {
		for event := range ch {
			fmt.Println("[APIGeneratorAgent] API Generation Event:", event)
			a.GenerateAPI(event)
		}
	}()
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
