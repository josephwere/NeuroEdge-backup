// kernel/agents/city_infrastructure_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type CityInfrastructureAgent struct {
	EventBus *types.EventBus
}

func NewCityInfrastructureAgent(bus *types.EventBus) *CityInfrastructureAgent {
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
