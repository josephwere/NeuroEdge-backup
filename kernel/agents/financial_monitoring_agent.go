package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type FinancialMonitoringAgent struct {
	EventBus *core.EventBus
}

func NewFinancialMonitoringAgent(bus *core.EventBus) *FinancialMonitoringAgent {
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
