package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type HealthMonitoringAgent struct {
	EventBus *core.EventBus
}

func NewHealthMonitoringAgent(bus *core.EventBus) *HealthMonitoringAgent {
	return &HealthMonitoringAgent{
		EventBus: bus,
	}
}

func (h *HealthMonitoringAgent) Start() {
	fmt.Println("🚀 HealthMonitoringAgent started")
	ch := make(chan map[string]interface{})
	h.EventBus.Subscribe("health:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[HealthMonitoringAgent] Health Event:", event)
			h.Monitor(event)
		}
	}()
}

func (h *HealthMonitoringAgent) Stop() {
	fmt.Println("🛑 HealthMonitoringAgent stopped")
}

func (h *HealthMonitoringAgent) Name() string {
	return "HealthMonitoringAgent"
}

func (h *HealthMonitoringAgent) Monitor(data map[string]interface{}) {
	fmt.Println("[HealthMonitoringAgent] Health metrics:", data)
}
