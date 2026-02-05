// kernel/agents/hardware_node_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type HardwareNodeAgent struct {
	EventBus *types.EventBus
}

func NewHardwareNodeAgent(bus *types.EventBus) *HardwareNodeAgent {
	return &HardwareNodeAgent{
		EventBus: bus,
	}
}

func (h *HardwareNodeAgent) Start() {
	fmt.Println("🚀 HardwareNodeAgent started")
	ch := make(chan map[string]interface{})
	h.EventBus.Subscribe("hardware:node:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[HardwareNodeAgent] Hardware Node Event:", event)
			h.MonitorNode(event)
		}
	}()
}

func (h *HardwareNodeAgent) Stop() {
	fmt.Println("🛑 HardwareNodeAgent stopped")
}

func (h *HardwareNodeAgent) Name() string {
	return "HardwareNodeAgent"
}

func (h *HardwareNodeAgent) MonitorNode(data map[string]interface{}) {
	fmt.Println("[HardwareNodeAgent] Node monitored:", data)
}
