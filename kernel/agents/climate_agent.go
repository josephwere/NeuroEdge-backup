// kernel/agents/climate_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type ClimateAgent struct {
	EventBus *types.EventBus
}

func NewClimateAgent(bus *types.EventBus) *ClimateAgent {
	return &ClimateAgent{
		EventBus: bus,
	}
}

func (c *ClimateAgent) Start() {
	fmt.Println("🚀 ClimateAgent started")
	ch := make(chan map[string]interface{})
	c.EventBus.Subscribe("climate:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[ClimateAgent] Climate Event:", event)
			c.AnalyzeClimate(event)
		}
	}()
}

func (c *ClimateAgent) Stop() {
	fmt.Println("🛑 ClimateAgent stopped")
}

func (c *ClimateAgent) Name() string {
	return "ClimateAgent"
}

func (c *ClimateAgent) AnalyzeClimate(data map[string]interface{}) {
	fmt.Println("[ClimateAgent] Analyzing climate data:", data)
}
