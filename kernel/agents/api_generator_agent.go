package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type APIGeneratorAgent struct {
	EventBus *core.EventBus
}

func NewAPIGeneratorAgent(bus *core.EventBus) *APIGeneratorAgent {
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
