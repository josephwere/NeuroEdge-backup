// kernel/agents/verification_officer_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // ✅ switched from core to types
)

type VerificationOfficerAgent struct {
	EventBus *types.EventBus
}

func NewVerificationOfficerAgent(bus *types.EventBus) *VerificationOfficerAgent {
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
