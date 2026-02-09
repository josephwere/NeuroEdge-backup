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

	// Use a subscriber function instead of a channel
	a.EventBus.Subscribe("agriculture:update", func(event types.Event) {
		fmt.Println("[AgricultureAgent] Agriculture Event:", event)
		a.OptimizeFarm(event)
	})
}

func (a *AgricultureAgent) Stop() {
	fmt.Println("🛑 AgricultureAgent stopped")
}

func (a *AgricultureAgent) Name() string {
	return "AgricultureAgent"
}

func (a *AgricultureAgent) OptimizeFarm(data types.Event) {
	fmt.Println("[AgricultureAgent] Optimizing farm:", data)
}
