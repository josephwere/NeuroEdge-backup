// kernel/agents/privacy_guardian_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/types"
)

type PrivacyGuardianAgent struct {
	EventBus  *types.EventBus
	agentName string // renamed from Name
}

func NewPrivacyGuardianAgent(bus *types.EventBus) *PrivacyGuardianAgent {
	return &PrivacyGuardianAgent{
		EventBus:  bus,
		agentName: "PrivacyGuardianAgent",
	}
}

func (p *PrivacyGuardianAgent) Start() {
	fmt.Printf("🚀 %s started\n", p.agentName)
	p.EventBus.Subscribe("privacy:alert", p.HandleEvent)
}

func (p *PrivacyGuardianAgent) Stop() {
	fmt.Printf("🛑 %s stopped\n", p.agentName)
}

func (p *PrivacyGuardianAgent) Name() string {
	return p.agentName
}

func (p *PrivacyGuardianAgent) HandleEvent(event string, payload interface{}) {
	data, ok := payload.(map[string]interface{})
	if !ok {
		fmt.Printf("[%s] Invalid payload: %v\n", p.agentName, payload)
		return
	}
	p.Protect(data)
}

func (p *PrivacyGuardianAgent) Protect(data map[string]interface{}) {
	fmt.Printf("[%s] Privacy protection action: %v\n", p.agentName, data)
}
