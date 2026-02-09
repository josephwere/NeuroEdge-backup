// kernel/agents/political_stability_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/types"
)

type PoliticalStabilityAgent struct {
	EventBus  *types.EventBus
	agentName string // renamed from Name
}

func NewPoliticalStabilityAgent(bus *types.EventBus) *PoliticalStabilityAgent {
	return &PoliticalStabilityAgent{
		EventBus:  bus,
		agentName: "PoliticalStabilityAgent",
	}
}

func (p *PoliticalStabilityAgent) Start() {
	fmt.Printf("🚀 %s started\n", p.agentName)
	p.EventBus.Subscribe("politics:update", p.HandleEvent)
}

func (p *PoliticalStabilityAgent) Stop() {
	fmt.Printf("🛑 %s stopped\n", p.agentName)
}

func (p *PoliticalStabilityAgent) Name() string {
	return p.agentName
}

func (p *PoliticalStabilityAgent) HandleEvent(event string, payload interface{}) {
	data, ok := payload.(map[string]interface{})
	if !ok {
		fmt.Printf("[%s] Invalid payload format: %v\n", p.agentName, payload)
		return
	}
	p.AnalyzePolitics(data)
}

func (p *PoliticalStabilityAgent) AnalyzePolitics(data map[string]interface{}) {
	fmt.Printf("[%s] Political stability analyzed: %v\n", p.agentName, data)
}
