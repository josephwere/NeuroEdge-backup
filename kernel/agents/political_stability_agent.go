package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type PoliticalStabilityAgent struct {
	EventBus *core.EventBus
}

func NewPoliticalStabilityAgent(bus *core.EventBus) *PoliticalStabilityAgent {
	return &PoliticalStabilityAgent{
		EventBus: bus,
	}
}

func (p *PoliticalStabilityAgent) Start() {
	fmt.Println("🚀 PoliticalStabilityAgent started")
	ch := make(chan map[string]interface{})
	p.EventBus.Subscribe("politics:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[PoliticalStabilityAgent] Political Event:", event)
			p.AnalyzePolitics(event)
		}
	}()
}

func (p *PoliticalStabilityAgent) Stop() {
	fmt.Println("🛑 PoliticalStabilityAgent stopped")
}

func (p *PoliticalStabilityAgent) Name() string {
	return "PoliticalStabilityAgent"
}

func (p *PoliticalStabilityAgent) AnalyzePolitics(data map[string]interface{}) {
	fmt.Println("[PoliticalStabilityAgent] Political stability analyzed:", data)
}
