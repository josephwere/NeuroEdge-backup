package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

// ProductivityAgent monitors and optimizes productivity
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
	ch := make(chan map[string]interface{})
	p.EventBus.Subscribe("productivity:update", ch)

	go func() {
		for event := range ch {
			fmt.Printf("[%s] Productivity Event: %v\n", p.Name, event)
			p.OptimizeTasks(event)
		}
	}()
}

func (p *ProductivityAgent) Stop() {
	fmt.Printf("🛑 %s stopped\n", p.Name)
}

func (p *ProductivityAgent) NameFunc() string {
	return p.Name
}

func (p *ProductivityAgent) OptimizeTasks(data map[string]interface{}) {
	fmt.Printf("[%s] Task optimization: %v\n", p.Name, data)
}
