package agents

import (
	"fmt"
	"neuroedge/kernel/types"
)

type SmartCityAgent struct {
	EventBus types.EventBus
}

func NewSmartCityAgent(bus types.EventBus) *SmartCityAgent {
	return &SmartCityAgent{EventBus: bus}
}

func (s *SmartCityAgent) Start() {
	fmt.Println("🚀 SmartCityAgent started")

	ch := make(chan map[string]interface{})
	s.EventBus.Subscribe("city:infrastructure", ch)

	go func() {
		for event := range ch {
			fmt.Println("[SmartCityAgent] Infrastructure Event:", event)
			s.ManageInfrastructure(event)
		}
	}()
}

func (s *SmartCityAgent) Stop() {
	fmt.Println("🛑 SmartCityAgent stopped")
}

func (s *SmartCityAgent) Name() string {
	return "SmartCityAgent"
}

func (s *SmartCityAgent) ManageInfrastructure(event map[string]interface{}) {
	fmt.Println("[SmartCityAgent] Managing infrastructure:", event)
}
