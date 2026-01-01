package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type DigitalTwinAgent struct {
	EventBus *core.EventBus
}

func NewDigitalTwinAgent(bus *core.EventBus) *DigitalTwinAgent {
	return &DigitalTwinAgent{
		EventBus: bus,
	}
}

func (d *DigitalTwinAgent) Start() {
	fmt.Println("🚀 DigitalTwinAgent started")
	ch := make(chan map[string]interface{})
	d.EventBus.Subscribe("digital:twin:update", ch)
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
	fmt.Println("[DigitalTwinAgent] Digital twin synced:", data)
}
