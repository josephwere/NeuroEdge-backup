package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type AgricultureAgent struct {
	EventBus *core.EventBus
}

func NewAgricultureAgent(bus *core.EventBus) *AgricultureAgent {
	return &AgricultureAgent{
		EventBus: bus,
	}
}

func (a *AgricultureAgent) Start() {
	fmt.Println("🚀 AgricultureAgent started")
	ch := make(chan map[string]interface{})
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

func (a *AgricultureAgent) OptimizeFarm(data map[string]interface{}) {
	fmt.Println("[AgricultureAgent] Optimizing farm:", data)
}
