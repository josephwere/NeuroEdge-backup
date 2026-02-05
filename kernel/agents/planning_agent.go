// kernel/agents/planning_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/types" // use types instead of core
)

type PlanningAgent struct {
	Name     string
	EventBus *types.EventBus
}

func NewPlanningAgent(bus *types.EventBus) *PlanningAgent {
	return &PlanningAgent{
		Name:     "PlanningAgent",
		EventBus: bus,
	}
}

func (p *PlanningAgent) Plan(task string) string {
	result := fmt.Sprintf("Plan for '%s' created", task)
	fmt.Printf("[%s] planning steps for task: %s\n", p.Name, task)
	return result
}

func (p *PlanningAgent) Start() {
	fmt.Printf("[%s] listening for tasks to plan...\n", p.Name)
	ch := make(chan map[string]interface{})
	p.EventBus.Subscribe("task:new", ch)

	go func() {
		for event := range ch {
			task := fmt.Sprintf("%v", event["task"])
			p.HandleEvent(task)
		}
	}()
}

func (p *PlanningAgent) HandleEvent(task string) {
	fmt.Printf("[%s] executing plan for task: %s\n", p.Name, task)
	// Example: after planning, you can publish execution event
	p.EventBus.Publish("task:execute", map[string]interface{}{"task": task})
}

func (p *PlanningAgent) GetName() string {
	return p.Name
}
