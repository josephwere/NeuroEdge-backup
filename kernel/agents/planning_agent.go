package agents

import (
	"fmt"
	"NeuroEdge/kernel/core"
)

type PlanningAgent struct {
	Name string
}

func NewPlanningAgent() *PlanningAgent {
	return &PlanningAgent{
		Name: "PlanningAgent",
	}
}

func (p *PlanningAgent) Plan(task string) string {
	result := fmt.Sprintf("Plan for '%s' created", task)
	fmt.Printf("[%s] planning steps for task: %s\n", p.Name, task)
	return result
}

func (p *PlanningAgent) Start() {
	fmt.Printf("[%s] listening for tasks to plan...\n", p.Name)
	core.EventBus.Subscribe("task:new", p.HandleEvent)
}

func (p *PlanningAgent) HandleEvent(event string, payload interface{}) {
	task := fmt.Sprintf("%v", payload)
	core.ExecuteWithGuard(p.Name, task, func(t string) {
		p.Plan(t)
		core.EventBus.Publish("task:execute", t)
	})
}

func (p *PlanningAgent) GetName() string {
	return p.Name
}
