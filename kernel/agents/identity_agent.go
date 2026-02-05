// kernel/agents/identity_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type IdentityAgent struct {
	EventBus *types.EventBus
}

func NewIdentityAgent(bus *types.EventBus) *IdentityAgent {
	return &IdentityAgent{
		EventBus: bus,
	}
}

func (i *IdentityAgent) Start() {
	fmt.Println("🚀 IdentityAgent started")
	ch := make(chan map[string]interface{})
	i.EventBus.Subscribe("identity:verify", ch)
	go func() {
		for event := range ch {
			fmt.Println("[IdentityAgent] Verifying Identity:", event)
			i.VerifyIdentity(event)
		}
	}()
}

func (i *IdentityAgent) Stop() {
	fmt.Println("🛑 IdentityAgent stopped")
}

func (i *IdentityAgent) Name() string {
	return "IdentityAgent"
}

func (i *IdentityAgent) VerifyIdentity(data map[string]interface{}) {
	fmt.Println("[IdentityAgent] Verifying biometric and device info:", data)
}
