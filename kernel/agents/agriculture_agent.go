// kernel/agents/agriculture_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/types" // <-- changed
)

type AgricultureAgent struct {
	EventBus types.EventBus
}

func NewAgricultureAgent(bus types.EventBus) *AgricultureAgent {
	return &AgricultureAgent{
		EventBus: bus,
	}
}

func (a *AgricultureAgent) Start() {
	fmt.Println("🚀 AgricultureAgent started")
	ch := make(chan types.Event)
	a.EventBus.Subscribe("agriculture:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[AgricultureAgent] Agriculture Event:", event)
			a.OptimizeFarm(event)
		}
	}()
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
