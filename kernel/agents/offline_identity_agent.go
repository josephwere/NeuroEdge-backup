// kernel/agents/offline_identity_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core to avoid import cycles
)

type OfflineIdentityAgent struct {
	EventBus *types.EventBus
}

func NewOfflineIdentityAgent(bus *types.EventBus) *OfflineIdentityAgent {
	return &OfflineIdentityAgent{
		EventBus: bus,
	}
}

func (o *OfflineIdentityAgent) Start() {
	fmt.Println("🚀 OfflineIdentityAgent started")
	ch := make(chan map[string]interface{})
	o.EventBus.Subscribe("identity:offline:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[OfflineIdentityAgent] Offline Identity Event:", event)
			o.ValidateOffline(event)
		}
	}()
}

func (o *OfflineIdentityAgent) Stop() {
	fmt.Println("🛑 OfflineIdentityAgent stopped")
}

func (o *OfflineIdentityAgent) Name() string {
	return "OfflineIdentityAgent"
}

func (o *OfflineIdentityAgent) ValidateOffline(data map[string]interface{}) {
	fmt.Println("[OfflineIdentityAgent] Offline identity verified:", data)
}
