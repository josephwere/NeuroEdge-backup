package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type PlanningAgent struct {
	EventBus *core.EventBus
}

func NewPlanningAgent(bus *core.EventBus) *PlanningAgent {
	return &PlanningAgent{
		EventBus: bus,
	}
}

func (p *PlanningAgent) Start() {
	fmt.Println("🚀 PlanningAgent started")
	ch := make(chan map[string]interface{})
	p.EventBus.Subscribe("planning:task", ch)
	go func() {
		for event := range ch {
			fmt.Println("[PlanningAgent] Planning Task Event:", event)
			p.Plan(event)
		}
	}()
}

func (p *PlanningAgent) Stop() {
	fmt.Println("🛑 PlanningAgent stopped")
}

func (p *PlanningAgent) Name() string {
	return "PlanningAgent"
}

func (p *PlanningAgent) Plan(data map[string]interface{}) {
	fmt.Println("[PlanningAgent] Planning process executed:", data)
}
