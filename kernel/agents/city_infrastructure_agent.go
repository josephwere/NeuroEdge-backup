package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type CityInfrastructureAgent struct {
	EventBus *core.EventBus
}

func NewCityInfrastructureAgent(bus *core.EventBus) *CityInfrastructureAgent {
	return &CityInfrastructureAgent{
		EventBus: bus,
	}
}

func (c *CityInfrastructureAgent) Start() {
	fmt.Println("🚀 CityInfrastructureAgent started")
	ch := make(chan map[string]interface{})
	c.EventBus.Subscribe("city:infrastructure:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[CityInfrastructureAgent] City Event:", event)
			c.ManageInfrastructure(event)
		}
	}()
}

func (c *CityInfrastructureAgent) Stop() {
	fmt.Println("🛑 CityInfrastructureAgent stopped")
}

func (c *CityInfrastructureAgent) Name() string {
	return "CityInfrastructureAgent"
}

func (c *CityInfrastructureAgent) ManageInfrastructure(data map[string]interface{}) {
	fmt.Println("[CityInfrastructureAgent] Infrastructure updated:", data)
}
