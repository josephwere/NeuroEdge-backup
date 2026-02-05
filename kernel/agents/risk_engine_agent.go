// kernel/agents/risk_engine_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

// RiskEngineAgent monitors and analyzes risk events
type RiskEngineAgent struct {
	EventBus *core.EventBus
	Name     string
}

// NewRiskEngineAgent creates a new RiskEngineAgent instance
func NewRiskEngineAgent(bus *core.EventBus) *RiskEngineAgent {
	return &RiskEngineAgent{
		EventBus: bus,
		Name:     "RiskEngineAgent",
	}
}

// Start subscribes to risk events and begins processing
func (r *RiskEngineAgent) Start() {
	fmt.Printf("🚀 %s started\n", r.Name)

	ch := make(chan map[string]interface{})
	r.EventBus.Subscribe("risk:update", ch)

	go func() {
		for event := range ch {
			fmt.Printf("[%s] Risk Event: %v\n", r.Name, event)
			r.AnalyzeRisk(event)
		}
	}()
}

// Stop gracefully stops the agent
func (r *RiskEngineAgent) Stop() {
	fmt.Printf("🛑 %s stopped\n", r.Name)
}

// NameFunc returns the agent name
func (r *RiskEngineAgent) NameFunc() string {
	return r.Name
}

// AnalyzeRisk executes the risk analysis logic
func (r *RiskEngineAgent) AnalyzeRisk(data map[string]interface{}) {
	fmt.Printf("[%s] Risk analysis executed: %v\n", r.Name, data)
}
