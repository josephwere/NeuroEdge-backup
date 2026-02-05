// kernel/agents/financial_monitoring_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type FinancialMonitoringAgent struct {
	EventBus *types.EventBus
}

func NewFinancialMonitoringAgent(bus *types.EventBus) *FinancialMonitoringAgent {
	return &FinancialMonitoringAgent{
		EventBus: bus,
	}
}

func (f *FinancialMonitoringAgent) Start() {
	fmt.Println("🚀 FinancialMonitoringAgent started")
	ch := make(chan map[string]interface{})
	f.EventBus.Subscribe("finance:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[FinancialMonitoringAgent] Finance Event:", event)
			f.MonitorFinance(event)
		}
	}()
}

func (f *FinancialMonitoringAgent) Stop() {
	fmt.Println("🛑 FinancialMonitoringAgent stopped")
}

func (f *FinancialMonitoringAgent) Name() string {
	return "FinancialMonitoringAgent"
}

func (f *FinancialMonitoringAgent) MonitorFinance(data map[string]interface{}) {
	fmt.Println("[FinancialMonitoringAgent] Finance metrics:", data)
}
