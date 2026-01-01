package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type RiskEngineAgent struct {
	EventBus *core.EventBus
}

func NewRiskEngineAgent(bus *core.EventBus) *RiskEngineAgent {
	return &RiskEngineAgent{
		EventBus: bus,
	}
}

func (r *RiskEngineAgent) Start() {
	fmt.Println("🚀 RiskEngineAgent started")
	ch := make(chan map[string]interface{})
	r.EventBus.Subscribe("risk:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[RiskEngineAgent] Risk Event:", event)
			r.AnalyzeRisk(event)
		}
	}()
}

func (r *RiskEngineAgent) Stop() {
	fmt.Println("🛑 RiskEngineAgent stopped")
}

func (r *RiskEngineAgent) Name() string {
	return "RiskEngineAgent"
}

func (r *RiskEngineAgent) AnalyzeRisk(data map[string]interface{}) {
	fmt.Println("[RiskEngineAgent] Risk analysis executed:", data)
}
