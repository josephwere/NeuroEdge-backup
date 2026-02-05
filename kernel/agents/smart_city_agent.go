package agents

import (
	"fmt"

	"neuroedge/kernel/types"
)

type SmartCityAgent struct {
	EventBus *types.EventBus
}

func NewSmartCityAgent(bus *types.EventBus) *SmartCityAgent {
	return &SmartCityAgent{
		EventBus: bus,
	}
}

func (s *SmartCityAgent) Start() {
	fmt.Println("🚀 SmartCityAgent started")

	ch := make(chan types.Event)
	s.EventBus.Subscribe("city:infrastructure", ch)

	go func() {
		for event := range ch {
			fmt.Println("[SmartCityAgent] Infrastructure Event:", event.Payload)
			s.ManageInfrastructure(event.Payload)
		}
	}()
}

func (s *SmartCityAgent) Stop() {
	fmt.Println("🛑 SmartCityAgent stopped")
}

func (s *SmartCityAgent) Name() string {
	return "SmartCityAgent"
}

// Manage city infrastructure
func (s *SmartCityAgent) ManageInfrastructure(payload map[string]interface{}) {
	fmt.Println("[SmartCityAgent] Managing infrastructure:", payload)

	// Example: emit decision or status update
	s.EventBus.Publish(types.Event{
		Type: "city:action",
		Payload: map[string]interface{}{
			"source": "SmartCityAgent",
			"status": "processed",
			"data":   payload,
		},
	})
}
