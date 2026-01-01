package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type DeveloperOpsAgent struct {
	EventBus *core.EventBus
}

func NewDeveloperOpsAgent(bus *core.EventBus) *DeveloperOpsAgent {
	return &DeveloperOpsAgent{
		EventBus: bus,
	}
}

func (d *DeveloperOpsAgent) Start() {
	fmt.Println("🚀 DeveloperOpsAgent started")
	ch := make(chan map[string]interface{})
	d.EventBus.Subscribe("devops:event", ch)
	go func() {
		for event := range ch {
			fmt.Println("[DeveloperOpsAgent] DevOps Event:", event)
			d.HandleDevOps(event)
		}
	}()
}

func (d *DeveloperOpsAgent) Stop() {
	fmt.Println("🛑 DeveloperOpsAgent stopped")
}

func (d *DeveloperOpsAgent) Name() string {
	return "DeveloperOpsAgent"
}

func (d *DeveloperOpsAgent) HandleDevOps(data map[string]interface{}) {
	fmt.Println("[DeveloperOpsAgent] Handling DevOps task:", data)
}
