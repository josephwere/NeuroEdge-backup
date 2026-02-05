// kernel/agents/logistics_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type LogisticsAgent struct {
	EventBus *types.EventBus
}

func NewLogisticsAgent(bus *types.EventBus) *LogisticsAgent {
	return &LogisticsAgent{
		EventBus: bus,
	}
}

func (l *LogisticsAgent) Start() {
	fmt.Println("🚀 LogisticsAgent started")
	ch := make(chan map[string]interface{})
	l.EventBus.Subscribe("logistics:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[LogisticsAgent] Logistics Event:", event)
			l.OptimizeRoute(event)
		}
	}()
}

func (l *LogisticsAgent) Stop() {
	fmt.Println("🛑 LogisticsAgent stopped")
}

func (l *LogisticsAgent) Name() string {
	return "LogisticsAgent"
}

func (l *LogisticsAgent) OptimizeRoute(data map[string]interface{}) {
	fmt.Println("[LogisticsAgent] Optimizing route for:", data)
}
