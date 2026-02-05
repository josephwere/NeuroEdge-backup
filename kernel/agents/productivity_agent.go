// kernel/agents/productivity_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type ProductivityAgent struct {
	EventBus *core.EventBus
	Name     string
}

func NewProductivityAgent(bus *core.EventBus) *ProductivityAgent {
	return &ProductivityAgent{
		EventBus: bus,
		Name:     "ProductivityAgent",
	}
}

func (p *ProductivityAgent) Start() {
	fmt.Printf("🚀 %s started\n", p.Name)
	p.EventBus.Subscribe("productivity:update", p.HandleEvent)
}

func (p *ProductivityAgent) Stop() {
	fmt.Printf("🛑 %s stopped\n", p.Name)
}

func (p *ProductivityAgent) Name() string {
	return p.Name
}

func (p *ProductivityAgent) HandleEvent(event string, payload interface{}) {
	data, ok := payload.(map[string]interface{})
	if !ok {
		fmt.Printf("[%s] Invalid payload: %v\n", p.Name, payload)
		return
	}
	p.OptimizeTasks(data)
}

func (p *ProductivityAgent) OptimizeTasks(data map[string]interface{}) {
	fmt.Printf("[%s] Optimizing tasks: %v\n", p.Name, data)
}
