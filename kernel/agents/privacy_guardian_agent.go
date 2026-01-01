package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type PrivacyGuardianAgent struct {
	EventBus *core.EventBus
}

func NewPrivacyGuardianAgent(bus *core.EventBus) *PrivacyGuardianAgent {
	return &PrivacyGuardianAgent{
		EventBus: bus,
	}
}

func (p *PrivacyGuardianAgent) Start() {
	fmt.Println("🚀 PrivacyGuardianAgent started")
	ch := make(chan map[string]interface{})
	p.EventBus.Subscribe("privacy:alert", ch)
	go func() {
		for event := range ch {
			fmt.Println("[PrivacyGuardianAgent] Privacy Event:", event)
			p.Protect(event)
		}
	}()
}

func (p *PrivacyGuardianAgent) Stop() {
	fmt.Println("🛑 PrivacyGuardianAgent stopped")
}

func (p *PrivacyGuardianAgent) Name() string {
	return "PrivacyGuardianAgent"
}

func (p *PrivacyGuardianAgent) Protect(data map[string]interface{}) {
	fmt.Println("[PrivacyGuardianAgent] Protection action:", data)
}
