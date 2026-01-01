package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type ManufacturingAgent struct {
	EventBus *core.EventBus
}

func NewManufacturingAgent(bus *core.EventBus) *ManufacturingAgent {
	return &ManufacturingAgent{
		EventBus: bus,
	}
}

func (m *ManufacturingAgent) Start() {
	fmt.Println("🚀 ManufacturingAgent started")
	ch := make(chan map[string]interface{})
	m.EventBus.Subscribe("manufacturing:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[ManufacturingAgent] Manufacturing Event:", event)
			m.OptimizeProduction(event)
		}
	}()
}

func (m *ManufacturingAgent) Stop() {
	fmt.Println("🛑 ManufacturingAgent stopped")
}

func (m *ManufacturingAgent) Name() string {
	return "ManufacturingAgent"
}

func (m *ManufacturingAgent) OptimizeProduction(data map[string]interface{}) {
	fmt.Println("[ManufacturingAgent] Optimizing production:", data)
}
