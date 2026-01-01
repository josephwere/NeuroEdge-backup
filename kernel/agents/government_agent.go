package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type GovernmentAgent struct {
	EventBus *core.EventBus
}

func NewGovernmentAgent(bus *core.EventBus) *GovernmentAgent {
	return &GovernmentAgent{
		EventBus: bus,
	}
}

func (g *GovernmentAgent) Start() {
	fmt.Println("🚀 GovernmentAgent started")
	ch := make(chan map[string]interface{})
	g.EventBus.Subscribe("gov:policy_update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[GovernmentAgent] Policy Update:", event)
			g.ProcessPolicy(event)
		}
	}()
}

func (g *GovernmentAgent) Stop() {
	fmt.Println("🛑 GovernmentAgent stopped")
}

func (g *GovernmentAgent) Name() string {
	return "GovernmentAgent"
}

func (g *GovernmentAgent) ProcessPolicy(policy map[string]interface{}) {
	fmt.Println("[GovernmentAgent] Processing policy:", policy)
}
