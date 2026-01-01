package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type TravelAgent struct {
	EventBus *core.EventBus
}

func NewTravelAgent(bus *core.EventBus) *TravelAgent {
	return &TravelAgent{
		EventBus: bus,
	}
}

func (t *TravelAgent) Start() {
	fmt.Println("🚀 TravelAgent started")
	ch := make(chan map[string]interface{})
	t.EventBus.Subscribe("travel:plan:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[TravelAgent] Travel Event:", event)
			t.PlanTravel(event)
		}
	}()
}

func (t *TravelAgent) Stop() {
	fmt.Println("🛑 TravelAgent stopped")
}

func (t *TravelAgent) Name() string {
	return "TravelAgent"
}

func (t *TravelAgent) PlanTravel(data map[string]interface{}) {
	fmt.Println("[TravelAgent] Travel plan created:", data)
}
