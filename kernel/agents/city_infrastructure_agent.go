// kernel/agents/city_infrastructure_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types"
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

	// ✅ Subscribe directly with a function
	c.EventBus.Subscribe("city:infrastructure:update", func(event types.Event) {
		fmt.Println("[CityInfrastructureAgent] City Event:", event.Data)

		// ✅ Type assertion
		data, ok := event.Data.(map[string]interface{})
		if !ok {
			fmt.Println("[CityInfrastructureAgent] Warning: event.Data is not a map:", event.Data)
			return
		}

		c.ManageInfrastructure(data)
	})
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
