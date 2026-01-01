package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type VerificationOfficerAgent struct {
	EventBus *core.EventBus
}

func NewVerificationOfficerAgent(bus *core.EventBus) *VerificationOfficerAgent {
	return &VerificationOfficerAgent{
		EventBus: bus,
	}
}

func (v *VerificationOfficerAgent) Start() {
	fmt.Println("🚀 VerificationOfficerAgent started")
	ch := make(chan map[string]interface{})
	v.EventBus.Subscribe("verification:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[VerificationOfficerAgent] Verification Event:", event)
			v.Verify(event)
		}
	}()
}

func (v *VerificationOfficerAgent) Stop() {
	fmt.Println("🛑 VerificationOfficerAgent stopped")
}

func (v *VerificationOfficerAgent) Name() string {
	return "VerificationOfficerAgent"
}

func (v *VerificationOfficerAgent) Verify(data map[string]interface{}) {
	fmt.Println("[VerificationOfficerAgent] Verification completed:", data)
}
