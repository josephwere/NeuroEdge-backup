// kernel/agents/agriculture_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/types"
)

type AgricultureAgent struct {
	EventBus *types.EventBus
}

func NewAgricultureAgent(bus *types.EventBus) *AgricultureAgent {
	return &AgricultureAgent{
		EventBus: bus,
	}
}

func (a *AgricultureAgent) Start() {
	fmt.Println("🚀 AgricultureAgent started")

	// Subscribe directly with a function
	a.EventBus.Subscribe("agriculture:update", func(event types.Event) {
		fmt.Println("[AgricultureAgent] Agriculture Event:", event.Data)

		// Type assertion to map[string]interface{}
		data, ok := event.Data.(map[string]interface{})
		if !ok {
			fmt.Println("[AgricultureAgent] Warning: event.Data is not a map[string]interface{}")
			return
		}

		a.OptimizeFarm(data)
	})
}

func (a *AgricultureAgent) Stop() {
	fmt.Println("🛑 AgricultureAgent stopped")
}

func (a *AgricultureAgent) Name() string {
	return "AgricultureAgent"
}

// Optimized farm method now receives map[string]interface{}
func (a *AgricultureAgent) OptimizeFarm(data map[string]interface{}) {
	fmt.Println("[AgricultureAgent] Optimizing farm:", data)
}
