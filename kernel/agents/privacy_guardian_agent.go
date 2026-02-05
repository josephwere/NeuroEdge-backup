// kernel/agents/privacy_guardian_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/types"
)

type PrivacyGuardianAgent struct {
	EventBus *types.EventBus
	Name     string
}

func NewPrivacyGuardianAgent(bus *types.EventBus) *PrivacyGuardianAgent {
	return &PrivacyGuardianAgent{
		EventBus: bus,
		Name:     "PrivacyGuardianAgent",
	}
}

func (p *PrivacyGuardianAgent) Start() {
	fmt.Printf("🚀 %s started\n", p.Name)
	p.EventBus.Subscribe("privacy:alert", p.HandleEvent)
}

func (p *PrivacyGuardianAgent) Stop() {
	fmt.Printf("🛑 %s stopped\n", p.Name)
}

func (p *PrivacyGuardianAgent) Name() string {
	return p.Name
}

func (p *PrivacyGuardianAgent) HandleEvent(event string, payload interface{}) {
	data, ok := payload.(map[string]interface{})
	if !ok {
		fmt.Printf("[%s] Invalid payload: %v\n", p.Name, payload)
		return
	}
	p.Protect(data)
}

func (p *PrivacyGuardianAgent) Protect(data map[string]interface{}) {
	fmt.Printf("[%s] Privacy protection action: %v\n", p.Name, data)
}
