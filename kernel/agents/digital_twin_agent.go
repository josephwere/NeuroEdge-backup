// kernel/agents/digital_twin_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type DigitalTwinAgent struct {
	EventBus *types.EventBus
}

func NewDigitalTwinAgent(bus *types.EventBus) *DigitalTwinAgent {
	return &DigitalTwinAgent{
		EventBus: bus,
	}
}

func (d *DigitalTwinAgent) Start() {
	fmt.Println("🚀 DigitalTwinAgent started")
	ch := make(chan map[string]interface{})
	d.EventBus.Subscribe("digitaltwin:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[DigitalTwinAgent] Digital Twin Event:", event)
			d.SyncTwin(event)
		}
	}()
}

func (d *DigitalTwinAgent) Stop() {
	fmt.Println("🛑 DigitalTwinAgent stopped")
}

func (d *DigitalTwinAgent) Name() string {
	return "DigitalTwinAgent"
}

func (d *DigitalTwinAgent) SyncTwin(data map[string]interface{}) {
	fmt.Println("[DigitalTwinAgent] Syncing digital twin:", data)
}
