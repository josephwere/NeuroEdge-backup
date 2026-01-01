package agents

import (
	"fmt"
	"NeuroEdge/kernel/core"
)

type PolicyEthicsAgent struct {
	Name string
}

func NewPolicyEthicsAgent() *PolicyEthicsAgent {
	return &PolicyEthicsAgent{
		Name: "PolicyEthicsAgent",
	}
}

func (p *PolicyEthicsAgent) Start() {
	fmt.Printf("[%s] monitoring tasks for policy and ethics...\n", p.Name)
	core.EventBus.Subscribe("task:new", p.HandleEvent)
}

func (p *PolicyEthicsAgent) HandleEvent(event string, payload interface{}) {
	task := fmt.Sprintf("%v", payload)
	fmt.Printf("[%s] checking task for compliance: %s\n", p.Name, task)
	allowed := p.CheckPolicy(task)
	if !allowed {
		fmt.Printf("[%s] task violates policy: %s\n", p.Name, task)
	}
}

func (p *PolicyEthicsAgent) CheckPolicy(task string) bool {
	// TODO: integrate real policy engine
	return true
}

func (p *PolicyEthicsAgent) GetName() string {
	return p.Name
}
