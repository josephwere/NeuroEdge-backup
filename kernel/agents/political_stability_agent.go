// kernel/agents/political_stability_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/types" // switched from core to types
)

type PoliticalStabilityAgent struct {
	EventBus *types.EventBus
	Name     string
}

func NewPoliticalStabilityAgent(bus *types.EventBus) *PoliticalStabilityAgent {
	return &PoliticalStabilityAgent{
		EventBus: bus,
		Name:     "PoliticalStabilityAgent",
	}
}

func (p *PoliticalStabilityAgent) Start() {
	fmt.Printf("🚀 %s started\n", p.Name)
	p.EventBus.Subscribe("politics:update", p.HandleEvent)
}

func (p *PoliticalStabilityAgent) Stop() {
	fmt.Printf("🛑 %s stopped\n", p.Name)
}

func (p *PoliticalStabilityAgent) Name() string {
	return p.Name
}

func (p *PoliticalStabilityAgent) HandleEvent(event string, payload interface{}) {
	data, ok := payload.(map[string]interface{})
	if !ok {
		fmt.Printf("[%s] Invalid payload format: %v\n", p.Name, payload)
		return
	}
	p.AnalyzePolitics(data)
}

func (p *PoliticalStabilityAgent) AnalyzePolitics(data map[string]interface{}) {
	fmt.Printf("[%s] Political stability analyzed: %v\n", p.Name, data)
}
